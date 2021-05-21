define(
    'PLPEasyAsk.Item.KeyMapping',
    [
        'Item.KeyMapping',
        'SC.Configuration',
        'underscore',
        'Utils',
        'Profile.Model'
    ],
    function (
        ItemKeyMapping,
        Configuration,
        _,
        Utils,
       ProfileModel

    ) {
        'use strict';


        /**
         * @method getKeyMapping
         * @desc Extend default ItemKeyMapping to include the parameters required for CNET on the url
         */

        ItemKeyMapping.getKeyMapping = _.wrap(ItemKeyMapping.getKeyMapping, function wrapKeyMapping(fn) {
            //console.log(this);
            var originalItemsKeyMapping = fn.apply(this, _.toArray(arguments).slice(1));
            //console.log(this);

            var newKeyMapping = _.extend(originalItemsKeyMapping, {

                _url: function (item) {
                    /*
                    console.log(' ');
                    console.log('item INSIDE item PLPEasyAsk.Item.KeyMapping.js');
                    console.log(item);
                    console.log(' ');
                    */
                    
                    //if(item.get('_thumbnail') === undefined){
                        //item.attributes;
                    //}

                    //console.log(item);

                    var matrixParent = item.get('_matrixParent');
                    // If this item is a child of a matrix return the URL of the parent
                    if (!_.isEmpty(matrixParent) && matrixParent.get('internalid')) {
                        return item.get('_matrixParent').get('_url');
                    }
                    // if its a standard version we need to send it to the canonical URL
                    if (SC.ENVIRONMENT.siteType && SC.ENVIRONMENT.siteType === 'STANDARD') {
                        //console.log('STANDARD canonicalurl');
                        return item.get('canonicalurl');
                    }
                    if (
                        SC.Configuration &&
                        SC.Configuration.isSCIS &&
                        item.get('itemoptions_detail') &&
                        item.get('itemoptions_detail').parentid &&
                        item.get('itemoptions_detail').matrixtype === 'child'
                    ) {
                        //console.log('STANDARD itemoptions_detail child');
                        return item.get('urlcomponent') ?
                            '/' + item.get('urlcomponent') :
                            '/product/' + item.get('itemoptions_detail').parentid;
                    }

                    // Other ways it will use the URL component or a default /product/ID



                    var mpn = item.get("mpn");
                    var price = item.get("price");
                    var cat = item.get("cat");
                    var weight = item.get("weight");
                    var displayname = item.get('displayname') ? item.get('displayname') : '';
                    var manufacturer = item.get('manufacturer');
                    var easy_ask_item = item.get("easy_ask_item");

                    //Deon Doughty - 10/28/2020 - new categories
                    //New cnetCategoryId, nsCategoryId, pricingGroupId
                    if(item.get('cnet_category_id') !== undefined){
                        var cnetCategoryId = item.get('cnet_category_id');
                    } else {
                        var cnetCategoryId = '';  
                    }

                    if(item.get('ns_category_id') !== undefined){
                        var nsCategoryId = item.get('ns_category_id');
                    } else {
                        var nsCategoryId = '';
                    }

                   if(item.get('pricing_group_id') !== undefined){
                        var pricingGroupId = item.get('pricing_group_id');
                   } else {
                        var pricingGroupId = '';
                   }
                    

               /*     
               console.log(' ');
               console.log('cnetCategoryId: ' + cnetCategoryId);
               console.log('nsCategoryId: ' + nsCategoryId);
               console.log('pricingGroupId: ' + pricingGroupId);
               console.log(' ');
               */
               

                    var stock_availability = item.get('total_quantity');

                    var stock_message = '';
                    if(stock_availability === "" || stock_availability === undefined || stock_availability === 0){

                        stock_message = 'Out of Stock';
                        
                    } else if(stock_availability <= 10){

                        stock_message = 'Limited Quantities Available';
                        
                    } else if(stock_availability > 10){
                        stock_message = 'In Stock';
                    }

                    if(stock_message !== ''){
                        stock_message = encodeURIComponent(stock_message);
                    } else {
                        stock_message = 'null';
                    }

                    //console.log(' ');
                    //console.log('stock_message: ' + stock_message);
                    //console.log('mpn: ' + mpn);
                    //console.log(' ');
                    



                    //console.log('inside easy ask item key mapping');
                    //console.log(item);

                    /**
                     * For the items that comes from easy ask, we build the url based on the easy ask parameters
                     * In other case, we can be sure that we are not on the PLP
                     */


                    if (easy_ask_item) {
                        var displayAddToCartButton = item.get("displayAddToCartButton");

                        var d = item.get('_sku');
                        var e;


                        if (displayAddToCartButton) {
                            e = d && d.substr(1);
                            e = e && e.split("").reverse().join("");
                        } else {
                            e = d && d.substr(1);

                        }

                        var displayNameEncoded = encodeURIComponent(displayname.replace(/#/g, '__'));

                        var profile = ProfileModel.getInstance();
                        var itemInNS = item.get('item_in_ns');
                        //console.log(profile);
                        var url = "";
                        if(profile.get("isLoggedIn") === "T"){
                            if(itemInNS){
                                console.log('inside no price');
                              url = item.get('urlcomponent') ?
                              '/' + item.get('urlcomponent') :
                              '/product/' + item.get('itemid') + "?quantity=1" + "&mpn=" + mpn + "&cat=" + cat + "&weight=" + weight + '&name=' + displayNameEncoded + '&cnetcategoryid=' + cnetCategoryId + '&nscategoryid=' + nsCategoryId + '&pricinggroupid=' + pricingGroupId + '&stockmessage=' + stock_message + '&manufacturer=' + manufacturer + '&e=' + e;
                          // '/product/' + item.get('itemid') + "?quantity=1" + "&mpn=" + mpn + "&price=" + price + "&cat=" + cat + "&weight=" + weight + '&name=' + displayNameEncoded + '&manufacturer=' + manufacturer + '&e=' + e
                      
                            }
                            else{
                              console.log('inside price');
                              url = item.get('urlcomponent') ?
                              '/' + item.get('urlcomponent') :
                          //    '/product/' + item.get('itemid') + "?quantity=1" + "&mpn=" + mpn + "&cat=" + cat + "&weight=" + weight + '&name=' + displayNameEncoded + '&manufacturer=' + manufacturer + '&e=' + e;
                           '/product/' + item.get('itemid') + "?quantity=1" + "&mpn=" + mpn + "&price=" + price + "&cat=" + cat + "&weight=" + weight + '&name=' + displayNameEncoded  + '&cnetcategoryid=' + cnetCategoryId + '&nscategoryid=' + nsCategoryId + '&pricinggroupid=' + pricingGroupId + '&stockmessage=' + stock_message + '&manufacturer=' + manufacturer + '&e=' + e
                      
                            }
                         }    
                         else{
                             url = item.get('urlcomponent') ?
                            '/' + item.get('urlcomponent') :
                        //    '/product/' + item.get('itemid') + "?quantity=1" + "&mpn=" + mpn + "&cat=" + cat + "&weight=" + weight + '&name=' + displayNameEncoded + '&manufacturer=' + manufacturer + '&e=' + e;
                         '/product/' + item.get('itemid') + "?quantity=1" + "&mpn=" + mpn + "&price=" + price + "&cat=" + cat + "&weight=" + weight + '&name=' + displayNameEncoded  + '&cnetcategoryid=' + cnetCategoryId + '&nscategoryid=' + nsCategoryId + '&pricinggroupid=' + pricingGroupId + '&stockmessage=' + stock_message + '&manufacturer=' + manufacturer + '&e=' + e
                    
                         }

                         return url;
                       // return item.get('urlcomponent') ?
                         //   '/' + item.get('urlcomponent') :
                           // '/product/' + item.get('itemid') + "?quantity=1" + "&mpn=" + mpn + "&cat=" + cat + "&weight=" + weight + '&name=' + displayNameEncoded + '&manufacturer=' + manufacturer + '&e=' + e;
                        // '/product/' + item.get('itemid') + "?quantity=1" + "&mpn=" + mpn + "&price=" + price + "&cat=" + cat + "&weight=" + weight + '&name=' + displayNameEncoded + '&manufacturer=' + manufacturer + '&e=' + e
                    } else {

                        //Deon Doughty - 12/01/2020 - Adds Comma into price on thousands.
                        function numberWithCommas(x) {
                            if(x && x !== undefined){
                                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }
                        }

                        var itemIdOnUrl = item.get('custitem_pm_cnet_id') || "";

                        var itemId = item.get('itemid');

                        if (itemId) {
                            /*
                            console.log(' ');
                            console.log('cnet product itemId');
                            console.log((itemId));
                            console.log(' ');
                            */
                            // return '/product/' + item.get('custitem_pm_cnet_id') + "?quantity=1" + "&mpn=" + itemIdOnUrl.replace(/#/g, '__') + "&price=" + item.getPrice().price + "&cat=" + item.get("custitem_gvo_category") + "&weight=" + item.get("weight");
                            // return '/product/' + itemIdOnUrl + "?quantity=1" + "&mpn=" + itemId.replace(/#/g, '__') + "&price=" + item.getPrice().price + "&cat=" + (cat || item.get("custitem_gvo_category")) + "&weight=" + item.get("weight") + '&name=' + encodeURIComponent(displayname)+ '&manufacturer=' + manufacturer;

                            //Deon Doughty - 12/01/2020 this fixes the issue with price and manufactuer not being being passes in chopping cart and mini cart.
                            //manufactuer was added to item fieldsets to make this work on web setup.
                            //In Stock is a temp fix for inventory status.

                            //return '/product/' + itemIdOnUrl + "?quantity=1" + "&mpn=" + itemId.replace(/#/g, '__') + "&price=" + numberWithCommas(item.getPrice().price) + "&cat=" + (cat || item.get("custitem_gvo_category")) + "&weight=" + item.get("weight") + '&name=' + encodeURIComponent(displayname) + '&cnetcategoryid=' + cnetCategoryId + '&nscategoryid=' + nsCategoryId + '&pricinggroupid=' + pricingGroupId + '&stockmessage=' + stock_message + '&manufacturer=' + manufacturer;
                            //return '/product/' + itemIdOnUrl + "?quantity=1" + "&mpn=" + itemId.replace(/#/g, '__') + "&price=" + numberWithCommas(item.getPrice().price) + "&cat=" + (cat || item.get("custitem_gvo_category")) + "&weight=" + item.get("weight") + '&name=' + encodeURIComponent(displayname) + '&cnetcategoryid=' + cnetCategoryId + '&nscategoryid=' + nsCategoryId + '&pricinggroupid=' + pricingGroupId + '&stockmessage=In%20Stock&manufacturer=' + manufacturer;
                            return '/product/' + itemIdOnUrl + "?quantity=1" + "&mpn=" + itemId.replace(/#/g, '__') + "&price=" + numberWithCommas(item.getPrice().price) + "&cat=" + (cat || item.get("custitem_gvo_category")) + "&weight=" + item.get("weight") + '&name=' + encodeURIComponent(displayname) + '&stockmessage=In%20Stock&manufacturer=' + manufacturer;
                        }
                    }
                },

                _breadcrumb: function (item) {
                    var breadcrumb = [];
                    var commercecategory = item.get('commercecategory');

                    if (
                        commercecategory &&
                        commercecategory.primarypath &&
                        commercecategory.primarypath.length
                    ) {
                        var primarypath = _.sortBy(commercecategory.primarypath, function (path) {
                            return path.urls[0];
                        });

                        _.each(primarypath, function (path) {
                            breadcrumb.push({
                                href: path.urls[0],
                                text: path.name
                            });
                        });
                    }

                    breadcrumb.push({
                        href: item.get('_url'),
                        text: item.get('displayname') || item.get('_name')
                    });

                    return breadcrumb;
                },

            });

            return newKeyMapping;
        })
    });