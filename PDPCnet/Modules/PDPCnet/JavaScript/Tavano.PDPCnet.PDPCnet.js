
define(
	'Tavano.PDPCnet.PDPCnet'
,   [

		'Tavano.PDPCnet.CNetUtils',
        'NetsuiteUtils',
		'PDPCnet.ProductDetails.Base.View',
        'PDPCnet.Cart.AddToCart.Button.View',
        'PDP.Cnet.ProductList.ControlItem.View',
		'PDPCnet.ImageGallery.View',
		'PDPCnet.ProductInformation.View',
        'PDPCnet.ProductName.View',
        'Product.Model',
        'ProductList.Control.View',
        'Tracker',
        'Utils'
	]
,   function (
        TavanoPDPCnetCNetUtils,
        NetsuiteUtils,
        PDPCnetProductDetailsBaseView,
        PDPCnetCartAddToCartButtonView,
        PDPCnetProductListControlItemView,
        PDPCnetImageGalleryView,
        PDPCnetProductInformationView,
        PDPCnetProductNameView,
        ProductModel,
        ProductListControlView,
        Tracker,
        Utils
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
            
            // ------------------------------------------------------------------------------
            // Override methods for product lists.
            // ------------------------------------------------------------------------------
            
            _.extend(ProductModel.prototype, {

                isEqual: function isEqual(other_line) {
                    var other_line_internalid = _.isFunction(other_line.getItem)
                        ? other_line.getItem().get('internalid')
                        : other_line.get('item').get('internalid');
                    return other_line && this.getItem().get('internalid') === other_line_internalid;
                },
            });


            _.extend(ProductListControlView.prototype, {

                // Adds the new item to the collection
                doAddItemToList: function(product, productList, dontShowMessage) {
                    var self = this;
                    var product_list_line_to_save = this.getNewItemData(product, productList);

                    product_list_line_to_save.save(null, {
                        // Note this is lack of validation is require to not validate the JSON returned from the
                        // services as it will lack the Model/Collection structure required to run the
                        // validation. for example the list of options will be an array and not a collection
                        // as the event handle that parse them didn't run yet
                        validate: false,
                        success: function(product_list_line_to_save_saved) {
                            productList.get('items').add(product_list_line_to_save_saved);

                            Tracker.getInstance().trackAddToWishlist(self.product);

                            self.collection.trigger('changed');
                            self.render();

                            if (!dontShowMessage) {
                                self.saveAndShowConfirmationMessage(
                                    self.$('.ul-product-lists [type="checkbox"]:checked').length > 1
                                        ? Utils.translate('You added this item to your product lists')
                                        : Utils.translate('Item added to your list <a href="#" data-touchpoint="customercenter" data-hashtag="#wishlist/ ' + product_list_line_to_save_saved.get('productList').id + '" > Go to list </a>')
                                );
                            }
                        }
                    });
                },
            })
            // ------------------------------------------------------------------------------

			var layout = container.getComponent('Layout');
            var pdp = container.getComponent('PDP');
			
			if(layout)
			{
                // PDP Context additional variables
                var urlOptions = _.parseUrlOptions(window.location.href);

                /**
                 * For the item that are loaded, we show the information that comes from the item api
                 */
                layout.addToViewContextDefinition('ProductViews.Price.View', 'priceFormatted', 'string', function (context) {

                    var priceToShow = urlOptions.price?_.formatCurrency(urlOptions.price): "";

                    try{
                        if (context && context.model && context.model.item && context.model.item.onlinecustomerprice_detail)
                            priceToShow = context.model.item.onlinecustomerprice_detail.onlinecustomerprice_formatted;

                    }catch(e){
                        console.log(e);

                    }
                    return priceToShow
                });

			}

			if (pdp){
				// By using the data-view = "Product.ImageGallery"
				// We override the default view using the new content provided by CNET
				// If we choose use a different data-view, we should execute pdp.removeChildView("Product.ImageGallery")

                // PDP
                pdp.addChildViews(
                    pdp.PDP_FULL_VIEW
                    ,{
                        'Product.ImageGallery': {
                            'Product.ImageGallery': {
                                childViewIndex: 2
                                ,   childViewConstructor: function(){
                                    return new PDPCnetImageGalleryView({pdp:pdp});
                                }
                            }
                        }
                    }
                )

                // QUICK VIEW
                pdp.addChildViews(
                    pdp.PDP_QUICK_VIEW
                    ,{
                        'Product.ImageGallery': {
                            'Product.ImageGallery': {
                                childViewIndex: 2
                                ,   childViewConstructor: function(){
                                    return new PDPCnetImageGalleryView({pdp:pdp});
                                }
                            }
                        }
                    }
                )

                // Same behavior for Product/Information

                // PDP
                
                pdp.addChildViews(
                    pdp.PDP_FULL_VIEW
                    ,{
                        'Product.Information': {
                            'Product.Information': {
                                childViewIndex: 1
                                ,   childViewConstructor: function(){
                                    return new PDPCnetProductInformationView({pdp:pdp});
                                }
                            }
                        }
                    }
                )

                // Same behavior for Product.Information
                // PDP
                pdp.addChildViews(
                    pdp.PDP_FULL_VIEW
                    ,{
                        'cms:item_info': {
                            'Product.Name': {
                                childViewIndex: 1
                                ,   childViewConstructor: function(){
                                    return new PDPCnetProductNameView({pdp:pdp});
                                }
                            }
                        }
                    }
                )
                // QUICK VIEW
                pdp.addChildViews(
                    pdp.PDP_QUICK_VIEW
                    ,{
                        'item_name': {
                            'item_name': {
                                childViewIndex: 1
                                ,   childViewConstructor: function(){
                                    return new PDPCnetProductNameView({pdp:pdp});
                                }
                            }
                        }
                    }
                )

                //
                pdp.removeChildView("Global.StarRating");
                pdp.removeChildView("Related.Items");
                pdp.removeChildView("Correlated.Items");
                pdp.removeChildView("ProductReviews.Center");
			}
		}
	};
});