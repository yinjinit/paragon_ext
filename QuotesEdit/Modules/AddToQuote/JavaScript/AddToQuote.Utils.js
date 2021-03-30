define('AddToQuote.Utils',
    [
        'underscore',
        'AddToQuote.Collection',
        'ProductList.Model',
        'ProductList.ControlSingle.View',
        'ProductList.Control.View',
        'ProductList.Item.Model',
        'jQuery',
        'Utils',
    ], function AddToQuoteUtils(
        _,
        AddToQuoteCollection,
        ProductListModel,
        ProductListControlSingleView,
        ProductListControlView,
        ProductListItemModel,
        jQuery,
        Utils
    ) {
        'use strict';

        var addToQuoteInstancePromise;
        var addToQuoteInstance;
        return /** @class */ (function () {
            function AddToQuoteUtils(app) {
                // @property {control:String} placeholder this application will render some of
                // its views in existing DOM elements (placeholders)
                this.placeholder = { control: '[data-type="product-lists-control"]' };
                this.application = app;
            }
            // @method getQuoteListsPromise Loads Product Lists collection model
            // singleton @return {jQuery.Deferred}
            AddToQuoteUtils.prototype.getQuoteListsPromise = function () {
                if (!addToQuoteInstancePromise) {
                    addToQuoteInstancePromise = jQuery.Deferred();
                    addToQuoteInstance = new AddToQuoteCollection();
                    addToQuoteInstance.application = this.application;
                    addToQuoteInstance.fetch({ cache: false }).done(function (jsonCollection) {
                        addToQuoteInstance.reset(jsonCollection);
                        addToQuoteInstancePromise.resolve(addToQuoteInstance);
                    });
                }
                return addToQuoteInstancePromise;
            };
            // @method productListsPromiseDone method to be called once the product lists are
            // loaded to show the MyAccount's menu item
            AddToQuoteUtils.prototype.productListsPromiseDone = function () {
                var layout = this.application.getLayout();
                if (this.application.ProductListModule.Utils.isSingleList()) {
                    // Update header profile link for single product list...
                    var the_single_list = this.application.ProductListModule.Utils.getProductLists().at(0);
                    var product_list_menu_item = layout.$('.header-profile-single-productlist');
                    if (the_single_list && product_list_menu_item) {
                        var product_list_hashtag = '#wishlist/' +
                            (the_single_list.get('internalid')
                                ? the_single_list.get('internalid')
                                : 'tmpl_' + the_single_list.get('templateId'));
                        product_list_menu_item.text(the_single_list.get('name'));
                        product_list_menu_item.attr('data-hashtag', product_list_hashtag);
                    }
                }
            };
            // @method profileModelPromiseDone method to be executed once the user
            // profile has loaded. We need this to start working with product lists.
            AddToQuoteUtils.prototype.profileModelPromiseDone = function () {
                var utils = this.application.ProductListModule.Utils;
                // if Product Lists are not enabled, return...
                if (!utils.isProductListEnabled()) {
                    return;
                }
                var layout = this.application.getLayout();
                // rendering product lists
                utils.renderProductLists();
                layout.on('afterAppendView', function (view) {
                    utils.renderProductLists(view);
                });
                layout.on('afterAppendToDom', function () {
                    utils.renderProductLists();
                });
                // Put this code block outside afterAppendView to avoid infinite loop!
                utils.getQuoteListsPromise().done(function () { return utils.productListsPromiseDone(); });
                ProductListItemModel.prototype.keyMapping = this.application.getConfig('itemKeyMapping', {});
                ProductListItemModel.prototype.itemOptionsConfig = this.application.getConfig('itemOptions', []);
            };
            // @method getProductLists @return {ProductList.Collection}
            AddToQuoteUtils.prototype.getQuotesLists = function () {
                if (!addToQuoteInstance) {
                    addToQuoteInstance = new AddToQuoteCollection();
                    addToQuoteInstance.application = this.application;
                }
                return addToQuoteInstance;
            };
            // @method getProductList obtain a single ProductList with all its item's data
            // @return {ProductList.Model}
            AddToQuoteUtils.prototype.getProductList = function (id) {
                var productList = new ProductListModel();
                productList.set('internalid', id);
                return productList.fetch();
            };
            // @method getSavedForLaterProductList obtain a single Saved for Later ProductList with
            // all its item's data @return {jQuery.Deferred}
            AddToQuoteUtils.prototype.getSavedForLaterProductList = function () {
                var productList = new ProductListModel();
                productList.set('internalid', 'later');
                return productList.fetch();
            };
            AddToQuoteUtils.prototype.getRequestAQuoteProductList = function () {
                var productList = new ProductListModel();
                productList.set('internalid', 'quote');
                return productList.fetch();
            };
            // @method isProductListEnabled is the Product-List functionality available for this
            // application? @return {Boolean}
            AddToQuoteUtils.prototype.isProductListEnabled = function () {
                return SC.ENVIRONMENT.PRODUCTLIST_ENABLED && !SC.ENVIRONMENT.standalone;
            };
            // @method isSingleList are we in the single-list modality ? @return {Boolean}
            AddToQuoteUtils.prototype.isSingleList = function () {
                return (!this.application.getConfig('productList.additionEnabled', false) &&
                    _.filter(this.application.getConfig('productList.listTemplates', []), function (pl) {
                        return !pl.typeName || (pl.typeName !== 'later' && pl.typeName !== 'quote');
                    }).length === 1);
            };
            // @method renderProductLists render all product-lists related widgets
            // @param {Backbone.View} view
            AddToQuoteUtils.prototype.renderProductLists = function (view) {
                this.application.ProductListModule.Utils.renderControl(view);
            };
            // @method internalGetProductId Gets the internal product id for a store item
            // considering it could be a matrix child.	// @param {Item.Model} product
            // @return {String}
            AddToQuoteUtils.prototype.internalGetProductId = function (product) {
                // If its matrix its expected that only 1 item is selected, not more than one nor 0
                if (product.getPosibleOptions().length) {
                    var selected_options = product.getSelectedMatrixChilds();
                    if (selected_options.length === 1) {
                        return selected_options[0].get('internalid') + '';
                    }
                }
                return product.get('_id') + '';
            };
            // @method renderControl renders the control used in shopping pdp and quickview
            // @param {Backbone.View} view
            AddToQuoteUtils.prototype.renderControl = function (view_) {
                var utils = this.application.ProductListModule.Utils;
                jQuery(this.placeholder.control).each(function () {
                    var view = view_ || this.application.getLayout().currentView;
                    var is_single_list_mode = utils.isSingleList();
                    var $container = jQuery(this);
                    var product_lists_promise = utils.getQuoteListsPromise();
                    product_lists_promise.done(function () {
                        // this control needs a reference to the StoreItem model !
                        if (view && view.model && view.model.getPosibleOptions) {
                            var control = null;
                            if (is_single_list_mode) {
                                control = new ProductListControlSingleView({
                                    collection: utils.getProductLists(),
                                    product: view.model,
                                    application: this.application
                                });
                            }
                            else {
                                view.countedClicks = {};
                                control = new ProductListControlView({
                                    collection: utils.getProductLists(),
                                    product: view.model,
                                    application: this.application,
                                    isDisabledWishlistButton: !!jQuery(utils.placeholder.control).data('disabledbutton'),
                                    countedClicks: view.countedClicks
                                });
                            }
                            $container.empty().append(control.$el);
                            control.render();
                        }
                    });
                    if (product_lists_promise.state() === 'pending') {
                        $container
                            .empty()
                            .append('<button class="product-list-control-button-wishlist">' +
                                (is_single_list_mode
                                    ? Utils.translate('Loading List...')
                                    : Utils.translate('Loading Lists...')) +
                                '</button>');
                    }
                });
            };
            return AddToQuoteUtils;
        }());
    });