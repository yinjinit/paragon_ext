
define('PDPCnet.ProductName.View'
    ,	[
        'pdp_cnet_product_name.tpl'
        ,	'Utils'
        ,	'Backbone'
        ,	'jQuery'
        ,	'underscore'

    ]
    ,	function (
        pdp_cnet_product_name_tpl
        ,	Utils
        ,	Backbone
        ,	jQuery
        ,	_

    )
    {
        'use strict';


        return Backbone.View.extend({

            template: pdp_cnet_product_name_tpl

            ,	initialize: function (options) {

            }

            ,	events: {
            }

            ,	bindings: {
            }

            , 	childViews: {

            }


            ,	getContext: function getContext()
            {
                //adds item brand
                jQuery(document).ready(function(){



                    //var url = window.location.href; 

                    //var stock_message = url.searchParams.get("stock-message");
                    //Deon Doughty - 09/28/200 Stock Notifications Displayed on Web. Gets the stock_staus parameter
                    function GetUrlParameter(sParam){
                        //var sPageURL = window.location.search.substring(1);
                        var sPageURL = ''
                        var isModal = jQuery('div').hasClass('modal-dialog');
                        if(isModal === true){
                            //console.log('is modal');
                            sPageURL = jQuery('.product-details-quickview-full-details').attr('data-hashtag');
                            //console.log('sPageURL: ' + sPageURL);
                        } else {
                            //console.log('detail page');
                            sPageURL = window.location.href;
                        }

                        var sURLVariables = sPageURL.split('&');

                        for (var i = 0; i < sURLVariables.length; i++)
                        {
                            var sParameterName = sURLVariables[i].split('=');

                            if (sParameterName[0] === sParam)

                            {
                                return decodeURIComponent(sParameterName[1]);
                            }
                        }
                    }
                    
                    function getAndPlaceStockStatus(){
                        //Deon Doughty - 09/28/200 Stock Notifications Displayed on Web.
                        var stock_message = '';
                        var stock_message_color = '';
                        var stock_message_placement = '';
                        var stockcontent = '';
                        var isModal = jQuery('div').hasClass('modal-dialog');
                        if(isModal === true){
                            var stock_message = GetUrlParameter('stockmessage');
                            //console.log('is modal');
                            //console.log('stockmessage: ' + stock_message);

                            //var modalUrl = jQuery('.product-details-quickview-full-details').attr('data-hashtag');
                            //console.log('modalUrl: ' + modalUrl);
                            if(stock_message !== ''){
                                if(stock_message === 'Out of Stock'){
                                   stock_message_color = '#d62d20'; //red

                                } else if(stock_message === 'Limited Quantities Available'){
                                    stock_message_color = '#ffa700'; //burnt orange

                                } else if(stock_message === 'In Stock'){
                                    stock_message_color = '#008744'; //Green

                                } 

                                  stockcontent ='<div class="product-line-stock stock-message" style="margin-top: -14px; margin-bottom: 6px; text-align: left; font-weight: bolder; font-size: 18px; color: '+ stock_message_color +';">'+ stock_message +'</div>';
                                  stockcontent  = '<div data-view="ItemViews.Stock" class="facets-item-cell-grid-stock-message">'+ stockcontent +'</div>';

                                  var dupeCheck = jQuery('div').hasClass('stock-message');
                                  //var detailCheck = jQuery('div').hasClass('product-details-full');
                                  //console.log(dupeCheck);
                                 // if(dupeCheck !== true){
                                      //jQuery('#in-modal-main-data-view-quick-view .cart-add-to-cart-button-container .cart-add-to-cart-button').append(stockcontent);
                                      //jQuery('#in-modal-product-price-quick-view[data-view="Product.Price"]').append(stockcontent);
                                      jQuery('#in-modal-quantity-quick-view').prepend(stockcontent);

                                      //in-modal-quantity-quick-view
                                 // }
                            }
                        } else {
                            stock_message = GetUrlParameter('stockmessage');
                            //console.log('detail page')
                            //console.log('stockmessage: ' + stock_message);
                            if(stock_message !== ''){
                                if(stock_message === 'Out of Stock'){
                                   stock_message_color = '#d62d20'; //red

                                } else if(stock_message === 'Limited Quantities Available'){
                                    stock_message_color = '#ffa700'; //burnt orange

                                } else if(stock_message === 'In Stock'){
                                    stock_message_color = '#008744'; //Green

                                //put in place because incoming from MyAccount Quote - remove this when issue is corrected.
                                } else if(stock_message === undefined){
                                    stock_message = 'In Stock';
                                    stock_message_color = '#008744'; //Green
                                }

                                    stockcontent ='<div class="product-line-stock stock-message" style="margin-top: -27px; margin-bottom: 6px; text-align: left; font-weight: bolder; font-size: 18px; color: '+ stock_message_color +';">'+ stock_message +'</div>';
                                    stockcontent  = '<div data-view="ItemViews.Stock" class="facets-item-cell-grid-stock-message">'+ stockcontent +'</div>';

                                    var dupeCheck = jQuery('div').hasClass('stock-message');
                                    var modalCheck = jQuery('div').hasClass('global-views-modal-content-header');

                                    //console.log(dupeCheck);
                                    //console.log('modalCheck: ' +modalCheck);
                                     if(dupeCheck === false){
                                        //jQuery('.cart-add-to-cart-button').append(stockcontent);
                                        //jQuery('#product-price-full-pdp[data-view="Product.Price"]').append(stockcontent);
                                        jQuery('#quantity-full-pdp').prepend(stockcontent);

                                    }

                            }

                        }

                        //console.log('stockmessage: ' + stock_message);

                    }
                    //console.log('stock_message: ' + stock_message);
    
                    function manufacturerBrandImg(brand){
                        var manufacturer = '';

                        //var brand = GetUrlParameter('manufacturer');

                        var quickview_brand = brand;
                        brand.split('&');
                        //console.log(brand);

                        
                        var brand_length = brand.split('&').length;
                        var brand_parse = brand.split('&').slice(-1);
                        brand_parse = brand_parse[0];
                        //console.log(brand_parse);

                        var qtyCheck = brand_parse.lastIndexOf("?");

                        if(qtyCheck === '-1'){
                            brand_parse = quickview_brand.split('&');
                            brand_parse = brand_parse.slice(-2);
                            //console.log('QuickView: ' + brand_parse);
                            brand_parse = brand_parse[0];
                            brand_parse = brand_parse.split('=');
                            manufacturer = brand_parse[1];
                        } else {
                            brand_parse = brand_parse.split('?');
                            brand_parse = brand_parse[0];
                            brand_parse = brand_parse.split('=');
                            manufacturer = brand_parse[1];
                        }
                        
                        //console.log('manufacturer: ' + manufacturer);
                        manufacturer = manufacturer.replace(/\s+/g, '').replace('.', '');
                        manufacturer = manufacturer.toLowerCase();

                        return 'brand-' + manufacturer + '.gif';    
                    };



                    function manufacturerBrand(){

                        if(jQuery("section").hasClass("product-details-full-main-content") === true){
                            if(jQuery("div").hasClass("img-brand") === false){
                                var brand = jQuery('meta[itemprop="url"]').attr("content");
                                var brand_img = manufacturerBrandImg(brand);
                                var brand_image_placement = '<div class="img-brand" style="width:100%; height:40px; text-align:center; display: inline-block;">\n <img width="100px" height="40px" style="width:100px; height:40px" src="/site/pm-imgs/brands/' + brand_img + '" onerror="this.onerror=null;this.src=\'/site/pm-imgs/brands/default.gif\';" />\n </div>';

                                jQuery('[data-view="Product.ImageGallery"]').prepend(brand_image_placement);
                            }

                           // console.log('product details true');
                        } else if(jQuery('div').hasClass('product-details-quickview') === true){
                            //if(jQuery("div").hasClass("img-brand") === false){
                                var brand = jQuery('.product-details-quickview-full-details').attr("data-hashtag");
                                //console.log('modal brand: ' + brand);
                                var brand_img = manufacturerBrandImg(brand);
                                //console.log('quick view true');
                                var brand_image_placement = '<div class="img-brand" style="width:100%; height:40px; text-align:center; display: inline-block;">\n <img width="100px" height="40px" style="width:100px; height:40px" src="/site/pm-imgs/brands/' + brand_img + '" onerror="this.onerror=null;this.src=\'/site/pm-imgs/brands/default.gif\';" />\n </div>';

                                jQuery('[data-view="Product.ImageGallery"]').prepend(brand_image_placement);

                                jQuery('.product-details-quickview-img div.img-brand img').on('load', function() {
                                    //alert('new image loaded: ' + this.src);
                                    var imgCheck = jQuery('.product-details-quickview-img div.img-brand img').attr('src');
                                    var brandCheck = imgCheck.search('no_image_available.jpeg');
                                    if(brandCheck !== '-1'){
                                        jQuery('.product-details-quickview-img div.img-brand img').attr('src', '/site/pm-imgs/brands/default.gif');
                                    }
                                });
                           //}

                        }

                    }
                    
                    //Deon Doughty - 09/28/200 Stock Notifications Displayed on Web.
                    getAndPlaceStockStatus();
                    manufacturerBrand();

                });

                var itemId = NaN;
                try {
                    itemId = parseInt(this.options.pdp.getItemInfo().item.internalid);
                } catch (error) {
                    
                }

                return {
                    itemNotInNS : isNaN(itemId)
                };
            }
        });
    });