/**
 * @module PLP.EasyAsk.Facets.Item.Cell.View
 * @desc work around to fetch pricing of the item using suitelet provided by Paragon
 */
define(
    'PLP.EasyAsk.Facets.Item.Cell.View',
    [
        'Facets.ItemCell.View',
        'NetsuiteUtils',
        'Profile.Model',
        'underscore',
        'Utils'
    ],
    function (
        FacetsItemCellView,
        NetsuiteUtils,
        ProfileModel,
        _,
        Utils

    ) {
        'use strict';

        _.extend(FacetsItemCellView.prototype, {



            updatePriceBasedOnParagonRules: function () {

                var self = this;



                var profile = ProfileModel.getInstance();

                if (profile.get("isLoggedIn") == "T") {


                    // Validate if the item exist in NS



                    if (self.model.get("mpn")) {
                        NetsuiteUtils.getItemFromNetsuite(self.model.get("mpn").replace(/__/g, '#').replace(/_/, "/"), self.model.get("internalid"))
                            .then(function (data) {


                                // item in netsuite if data.data > 0
                                if (data.data && data.data > 0) {

                                    // make the ajax call to get the price from Paragon's script.

                                    var data = {
                                        cid: profile.get("internalid"),
                                        item: self.model.get('internalid'), // CNET ID
                                        msrp: self.model.getPrice().price, // MSRP
                                        cat: self.model.get('cat'), // CAT
                                        mpn: self.model.get('mpn') // PART NUMBER
                                    };
                                    $.get('/app/site/hosting/scriptlet.nl?script=226&deploy=1', data).then(function (data) {

                                        if (data) {
                                            self.model.set("onlinecustomerprice_detail", {
                                                "onlinecustomerprice_formatted": _.formatCurrency(data),
                                                "onlinecustomerprice": parseInt(data),
                                            });
                                            //flag used to get the most recent _url from keyMapping
                                            self.model.set('PLPTrigger', true);
                                            self.model.set('item_in_ns', true);

                                            try {

                                                self.render();
                                                //self.getChildViewInstance("Cart.QuickAddToCart") && self.getChildViewInstance("Cart.QuickAddToCart").render()

                                            } catch (e) {
                                                console.log(e)
                                            }
                                        }
                                    });



                                } else {

                                    // item not created on netsuite
                                    //console.log('inside else set model and render');
                                    //console.log(self.model);
                                    self.model.set("displayAddToCartButton", self.model.get("hasOnlinePrice"));
                                    self.model.set("isLoggedItemNotCreated", 'not-created');
                                    self.render();


                                }
                            }).fail(function (data) {

                            });
                    }
                }
            },


            initialize: _.wrap(FacetsItemCellView.prototype.initialize, function (fn) {

                var ret = fn.apply(this, _.toArray(arguments).slice(1));

                try {

                    this.updatePriceBasedOnParagonRules()

                } catch (e) {

                }
                return ret;
            }),
            getContext: _.wrap(FacetsItemCellView.prototype.getContext, function (fn) {

                var ret = fn.apply(this, _.toArray(arguments).slice(1));
                /*
                console.log(' ');
                console.log('this.model inside getContext');
                console.log(this.model);
                console.log(this);
                console.log('this cell view');
                console.log(' ');
                */
               /*
                    Deon Doughty - 09/24/2020 - Fixed Double Logos Being Displayed On Product List Page When Logged In.
                    I fixed this issue by moving it to the cell view. You also never lose a logo on price refresh.
                */
                    var manufacturer_name = this.model.get('manufacturer');
                    var manufacturer = this.model.get('manufacturer');
                    manufacturer = manufacturer.replace(/\s+/g, '').replace('.', '');
                    manufacturer = manufacturer.toLowerCase();
                    var brand = 'brand-' + manufacturer + '.gif';
                    //console.log('brand-' + manufacturer + '.gif');
                    //console.log('manufacturer: ' + manufacturer);
                    var keyMapping_sku = this.model.get('keyMapping_sku');
                    //console.log('keyMapping_sku: ' + keyMapping_sku);
                    //if(keyMapping_sku == "" || keyMapping_sku == undefined){
                    var item_id = this.model.get('itemid');
                    //}
                    //var 
                    //console.log('item_id: ' + item_id);
                try {
                    ret.mpn = this.model.get('mpn') && this.model.get('mpn').replace(/__/g, '#').replace(/_/, "/");
                    ret.displayAddToCartButton = this.model.get('displayAddToCartButton');
                    var price = this.model.get('price') && parseFloat(this.model.get('price'));
                    if (!price > 0) {
                        ret.displayAddToCartButton = false;
                    }

                    if (this.model.get('isLoggedItemNotCreated') && this.model.get('isLoggedItemNotCreated') == 'not-created' || this.model.get('PLPTrigger')) {
                        // @param {Boolean} dont_cache if true it won't return the cached attribute value.
                        ret.url = this.model.get('_url', true);
                    }


                    //console.log(this.model);
                    //console.log(this.model.get('total_quantity'));

                    //console.log(this.model);
                    //console.log('total_quantity');
                    //console.log(this.model.get('total_quantity'));


                    //Deon Doughty - 09/28/200 Stock Notifications Displayed on Web.
                    var stock_availability = this.model.get('total_quantity');
                    //console.log('stock_availability: ' + stock_availability)
                    var stock_message = '';
                    var stock_message_color ='#d62d20';

                    if(stock_availability == 0){

                        stock_message = 'Out of Stock';
                        stock_message_color = '#d62d20'; //red
                        
                    } else if(stock_availability <= 10){
                        stock_message_color = '#ffa700'; //burnt orange

                        stock_message = 'Limited Quantities Available';
                        
                    } else if(stock_availability > 10){
                        stock_message_color = '#008744'; //Green

                        stock_message = 'In Stock';
                    } else {
                        stock_message = 'Out of Stock';
                        stock_message_color = '#d62d20'; //red
                    }

                    //console.log(stock_message);

                    //ret.stock_message = stock_message;

                    jQuery(document).ready(function(){
                        jQuery('div[data-item-id="'+ item_id +'"]').find('.product-line-stock').html(stock_message);
                        jQuery('div[data-item-id="'+ item_id +'"]').find('.product-line-stock').css({'text-align': 'center', 'font-weight' : 'bolder', 'font-size' : '14px', 'color' : stock_message_color});
                        //console.log(item_list_display);

                        if(jQuery('[title="List"]').hasClass('active') == true){
                            setTimeout(
                                  function() 
                                  {

                                    jQuery('div[data-item-id="'+ item_id +'"]').find('.product-line-stock').css({'text-align': 'left', 'font-weight' : 'bolder', 'font-size' : '14px', 'color' : stock_message_color});
                                    //console.log('brand: ' + brand);
                                    var brand_img = brand;
                                   //console.log('brand_img: ' + brand_img);
                                    var brand_image_placement = '<div class="img-brand fade-in" style="width:100%; height:40px; text-align:center; display: inline-block;">\n <img style="width:100px; height:40px; mix-blend-mode: multiply;" src="/site/pm-imgs/brands/' + brand_img + '" onerror="this.onerror=null;this.src=\'/site/pm-imgs/brands/default.gif\';" />\n </div>';

                                    var check_brand = jQuery('div[data-item-id="'+ item_id +'"]').find('.img-brand img').attr('src');
                                    //$(this).find(".facets-item-cell-list-title").append(brand_image_placement);
                                    if(check_brand == undefined || check_brand == ''){
                                        jQuery('div[data-item-id="'+ item_id +'"]').find(".facets-item-cell-list-image-wrapper").append(brand_image_placement);
                                    }

                                }, 2000);
                            
                        } else if(jQuery('[title="Table"]').hasClass('active') == true){
                            
                            setTimeout(
                                  function() 
                                  {
                                    //console.log('brand: ' + brand);
                                    var brand_img = brand;
                                   // console.log('brand_img: ' + brand_img);
                                    var brand_image_placement = '<div class="img-brand fade-in" style="width:100%; height:40px; text-align:center; display: inline-block;">\n <img width="100px" height="40px" style="width:100px; height:40px" src="/site/pm-imgs/brands/' + brand_img + '" onerror="this.onerror=null;this.src=\'/site/pm-imgs/brands/default.gif\';" />\n </div>';

                                    var check_brand = jQuery('div[data-item-id="'+ item_id +'"]').find('.img-brand img').attr('src');

                                    if(check_brand == undefined || check_brand == ''){
                                        jQuery('div[data-item-id="'+ item_id +'"]').find(".facets-item-cell-table-image-wrapper").prepend(brand_image_placement);
                                    }

                                 }, 2000);                            
                               
                            //console.log('Table true');

                        } else if(jQuery('[title="Grid"]').hasClass('active') == true){
                            setTimeout(
                                  function() 
                                  {
                                    //console.log('brand: ' + brand);
                                    var brand_img = brand;
                                    //console.log('brand_img: ' + brand_img);
                                    var brand_image_placement = '<div class="img-brand fade-in" style="width:100%; text-align:center;">\n <img width="100px" height="40px" src="/site/pm-imgs/brands/' + brand_img + '" onerror="this.onerror=null;this.src=\'/site/pm-imgs/brands/default.gif\';" />\n </div>';

                                   var check_brand = jQuery('div[data-item-id="'+ item_id +'"]').find('.img-brand img').attr('src');
                                   //console.log('check_brand: ' + check_brand);
                                   //console.log('brandimage place item_id: ' + item_id);
                                   //console.log('[data-item-id="'+ item_id +'"]');
                                   if(check_brand == undefined || check_brand == ''){
                                       jQuery('div[data-item-id="'+ item_id +'"]').find(".facets-item-cell-grid-details").prepend(brand_image_placement);
                                   }

                               }, 2000);

                        }

                    });


                } catch (e) {

                }
                return ret;
            }),
        });
    });