define('AddToQuote.ControlItem.View', [
    'ProductList.ControlItem.View',
    'AddToQuote.Model',
    'AddToQuote.Collection',
    'AddToQuote.Utils',
    'product_quote_control_item.tpl',
    'Backbone',
    'underscore',
    'jQuery'
], function AddToQuoteProductDetails(
    ProductListControlItemView,
    AddToQuoteModel,
    AddToQuoteCollection,
    AddToQuoteUtils,
    productQuoteControlItemTpl,
    Backbone,
    _,
    jQuery
) {
    'use strict';

    return ProductListControlItemView.extend({
        template: productQuoteControlItemTpl,
        events: {
            'click [data-action="quote-item"]': 'quoteItemHandler'
        },
        quoteItemHandler: _.debounce(function quoteItemHandler(e) {
            this.parentView.$('.quote-message-list').hide();
            this.addItemToQuote(this.line, this.model);
        },100),
        addItemToQuote: function addItemToList() {
            var self = this;
            var model = new AddToQuoteModel();
            var line = this.parentView.product;
            var item = line.get('item');
            var options = line.get("options").toJSON();

            var imagesUrl ={};
            var imgClassCheck = jQuery('div').hasClass('ccs-ds-cloud-main-image');
            var imgClassCheckTwo = jQuery('div').hasClass('ccs-fancybox-gallery');
            if(imgClassCheck == true && imgClassCheckTwo == true){
            //must get the first thumbnail from fancy box
                //var imagesUrlCheck = jQuery('.ccs-fancybox-gallery').find('img').attr('src');
                var imagesUrlCheck = jQuery('div').closest('.ccs-slick-list').find('.ccs-cc-thumbnail-wrapper').attr('data-original-src');
                
                //if(imagesUrlCheck){
                    imagesUrl.url = imagesUrlCheck;
                    console.log(imagesUrl);
                //}
            }

            

            console.log('AddToQuote.ControlItem.View.js item');
            console.log(item);
            console.log('AddToQuote.ControlItem.View.js options');
            console.log(options);


            // ------------------------
            // CNET FAKE OPTION
            // ------------------------
            var cnet_data = {
                id: item.get("internalid"),
                price: line.getPrice().price || item.get("price"),
                mpn: item.get("mpn").replace(/__/g, '#').replace(/_/,"/"),
                cat: item.get("cat"),
                weight: item.get("weight"),
                imageUrl : imagesUrl.url
            }


            var option = {

                cartOptionId: "CNET_DATA",
                itemOptionId: "CNET_DATA",
                label: "CNET_DATA",
                type: "text",
                value:cnet_data
            }

            options.push(option);
            model.set('internalid', this.model.get('internalid'));
            model.set('items', [{
                id: item.get('internalid'),
                quantity: line.get('quantity'),
                type: item.get('itemtype'),
                options: options
            }]);
            model.save().then(function addFn() {
                self.updateCachedCollection(model, 'add');
            });
        },
        /*
        removeItemFromQuote: function removeItemFromQuote() {
            var self = this;
            var model = new AddToQuoteModel();
            var line = this.parentView.product;
            var item = line.get('item');
            model.set('internalid', this.model.get('internalid'));
            model.set('delete', true);
            model.set('items', [item.get('internalid')]);
            model.save().then(function deleteFn() {
                self.updateCachedCollection(model, 'remove');
            });
        },
         */
        updateCachedCollection: function updateCachedCollection(model, method) {
            var url = (new AddToQuoteCollection()).url;
            var self = this;
            Backbone.localCache[url] = _.toArray(model.changed);
            self.parentView.updateQuotesList(true, method);
        },
        checked: function checked() {
            var itemInternalId = this.parentView.product.get('item').get('internalid');
            return this.model.get('currentItems').indexOf(itemInternalId.toString()) > -1;
        },
        getContext: function getContext() {
            return {
                isMoving: this.parentView.mode === 'move',
                isChecked: this.checked(),
                quoteName: this.model.get('customname'),
                quoteNumber: this.model.get('tranid'),
                quoteDate: this.model.get('trandate'),
                quoteId: this.model.get('internalid')
            };
        }
    });
});
