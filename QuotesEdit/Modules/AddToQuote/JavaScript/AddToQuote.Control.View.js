define('AddToQuote.Control.View', [
    'ProductList.Control.View',
    'AddToQuote.ControlItem.View',
    'AddToQuote.Collection',
    'Backbone.View',
    'product_quote_control.tpl',
    'Backbone',
    'underscore'
], function AddToQuoteProductDetails(
    ProductListControlView,
    AddToQuoteControlItemView,
    AddToQuoteCollection,
    BackboneView,
    productQuoteControlTpl,
    Backbone,
    _
) {
    'use strict';

    return ProductListControlView.extend({
        template: productQuoteControlTpl,
        events: _.extend(ProductListControlView.prototype.events, {
            'click [data-action="add-to-request-a-quote"]': 'addToRequestAQuote',
            'keyup #search-quote-value': 'filterQuotes'
        }),
        addToRequestAQuote: _.debounce(function addToRequestAQuote(e) {
            e.stopPropagation();
            e.preventDefault();
            this.parentView.itemToQuote(e)
        }, 100),
        render: function render() {
            BackboneView.prototype.render.apply(this);
            this.updateQuotesList(null,'new');
        },
        updateQuotesList: function updateQuotesList(fetchCollection, method) {
            var self = this;
            if (fetchCollection) {
                self.collection.fetch().then(function fetchCollectionFn() {
                    self.renderQuotesList(method);
                });
            } else {
                self.renderQuotesList(method);
            }
        },
        isItemOnQuote: function isItemOnQuote(self,model) {
            var itemInternalId = self.product.get('item').get('internalid');
            return model.get('currentItems').indexOf(itemInternalId.toString()) > -1;
        },
        filterQuotes: function filterQuotes(e){
            var $input = jQuery(e.currentTarget);
            this.keywords = $input.val();
            if(this.keywords.length > 2){
                this.renderQuotesList();
            }else{
                this.keywords = '';
                this.renderQuotesList();
            }
        },
        renderQuotesList: function renderQuotesList(method) {
            var self = this;
            var $listQuotesToAdd = self.$('#list-quotes-to-add');
            var $listQuotesAdded = self.$('#list-quotes-added');
            if (method !== 'new') {
                $listQuotesToAdd.empty();
                $listQuotesAdded.empty();
            }
            self.collection.each(function eachModel(model) {
                var view = new AddToQuoteControlItemView({
                    model: model,
                    product: self.product,
                    application: self.application,
                    parentView: self
                });
                if (self.isItemOnQuote(self, model)) {
                    $listQuotesAdded.prepend(view.render().el);
                } else {
                    if(self.keywords){
                        if(
                            model.get('customname').toLocaleLowerCase().indexOf(self.keywords.toLocaleLowerCase()) === -1 &&
                            model.get('tranid').toLocaleLowerCase().indexOf(self.keywords.toLocaleLowerCase()) === -1
                        ){
                            return;
                        }
                    }
                    $listQuotesToAdd.prepend(view.render().el);
                }

            });
            if (method === 'add') {
                self.showMessage('Item was successfully added to quote');
            }
        },
        showMessage: function showMessage(text) {
            this.$('.quote-message-list').show().text(text);
        },
        getContext: function() {
            var self = this;
            return {
                isMoving: this.mode === 'move',
                showControl: this.is_visible,
                isEmptyToAdd: this.collection.every(function everyCollection(model){
                    return self.isItemOnQuote(self, model)
                }),
                isEmptyAdded: this.collection.every(function everyCollection(model){
                    return !self.isItemOnQuote(self, model)
                }),
                hasOneProductList: this.collection.length === 1,
                hasProductLists: this.collection.length > 0,
                productListLength: this.collection.length
            };
        }
    });
});
