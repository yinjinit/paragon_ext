define('AddToQuote.ProductDetails', [
    'ProductDetailToQuote.View',
    'AddToQuote.Control.View',
    'AddToQuote.Collection',
    'AddToQuote.Utils',
    'Profile.Model',
    'product_detail_to_quote.tpl',
    'Product.Option.Collection',
    'Backbone.View',
    'Backbone.CompositeView',
    'Backbone',
    'Utils',
    'underscore'
], function AddToQuoteProductDetails(
    ProductDetailsToQuoteView,
    AddToQuoteListControlView,
    AddToQuoteCollection,
    AddToQuoteUtils,
    ProfileModel,
    productDetailToQuoteTpl,
    ProductOptionCollection,
    BackboneView,
    BackboneCompositeView,
    Backbone,
    Utils,
    _
) {
    'use strict';

    _.extend(ProductDetailsToQuoteView.prototype, {
        template: productDetailToQuoteTpl,
        initialize: function initialize(options) {
            this.application = options.application;

            this.profile_promise = ProfileModel.getPromise();

            this.state = {
                feedbackMessage: '',
                quote_permissions: false,
                feedbackMessageType: 'warning'
            };

            this.model.on('change', this.render, this);
            this.once('afterViewRender', this.attachOnProfileModelEvents, this);
        },
        childViews: {
            AddToQuoteListControl: function AddToQuoteListControlFn() {
                var view = new AddToQuoteListControlView({
                    collection: AddToQuoteUtils.prototype.getQuotesLists(),
                    product: this.model,
                    application: this.application,
                    countedClicks: this.countedClicks || {},
                    parentView: this
                });
                AddToQuoteUtils.prototype.getQuoteListsPromise().then(function quoteListPromise() {
                    view.render();
                });
                return view;
            }
        },
        addItemToQuote: function addItemToQuote(productList, productListLine, product) {
            var quantityToAdd;
            var self = this;
            var productName;
            var showEnforcedQuantityMessage = false;

            var options = productListLine.get("options").toJSON();


            // ------------------------
            // CNET FAKE OPTION
            // ------------------------
            var cnet_data = {
                id: this.model.getItem().get("internalid"),
                price: this.model.getPrice().price || this.model.getItem().get("price"),
                mpn: this.model.getItem().get("mpn").replace(/__/g, '#').replace(/_/,"/"),
                cat: this.model.getItem().get("cat"),
                weight: this.model.getItem().get("weight")
            }


            var option = {

                cartOptionId: "CNET_DATA",
                itemOptionId: "CNET_DATA",
                label: "CNET_DATA",
                type: "text",
                value:cnet_data
            }

            options.push(option);

            productListLine.set('options', new ProductOptionCollection(options));

            if (product.get('item').get('_matrixParent').internalid) {
                productListLine.set('item', product.get('item').get('_matrixParent'), {
                    silent: true
                });
            }
            if (product.get('quantity') < product.get('_minimumQuantity')) {
                quantityToAdd = product.get('_minimumQuantity');
                showEnforcedQuantityMessage = true;
            } else {
                quantityToAdd = product.get('quantity');
            }
            productListLine.set('productList', {
                id: productList.internalid
            });
            productListLine.set('quantity', quantityToAdd);
            this.$('.quote-message-new').hide();
            productListLine
                .save(null, {
                    validate: false
                })
                .done(function doneFn(obj) {
                    self.state.feedbackMessageType = 'success';
                    productName = self.model.get('item').get('_name');
                    product.set('pl_item_internalid', obj.internalid, { silent: true });
                    if (showEnforcedQuantityMessage) {
                        /* eslint-disable max-len */
                        self.showMessage(Utils.translate('$(0) has been added to your <a href="#" data-hashtag="#request-a-quote" data-touchpoint="customercenter" data-trigger="go-to-quote">Quote Request</a><br>Quantity: $(1). (Enforced minimum quantity)', productName, quantityToAdd));
                    } else {
                        /* eslint-disable max-len */
                        self.showMessage(Utils.translate('$(0) has been added to your <a href="#" data-hashtag="#request-a-quote" data-touchpoint="customercenter" data-trigger="go-to-quote">Quote Request</a><br>Quantity: $(1)', productName, quantityToAdd));
                    }
                });
        },
        showMessage: function showMessage(text) {
            this.$('.quote-message-new').show().html(text);

        }
    });
});
