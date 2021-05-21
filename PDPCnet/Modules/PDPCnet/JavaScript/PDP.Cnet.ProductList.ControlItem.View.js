
/**
 * @module PDP.Cnet.ProductList.ControlItem.View
 * @desc wrap addItemToList to add necessary information for the item creation
 */
define(
    'PDP.Cnet.ProductList.ControlItem.View',
    [
        'ProductList.ControlItem.View',
        'ProductList.Control.View',
        'underscore',
        'Utils',
        'jQuery'
    ],
    function(
        ProductListControlItemView,
        ProductListControlView,
        _,
        Utils,
        jQuery
    ) {
        'use strict';



        _.extend(ProductListControlView.prototype, {
            addItemToList: _.wrap(ProductListControlView.prototype.addItemToList, function (fn,line, productList, dontShowMessage) {

                var options = line.get("options");
                /*
                console.log(' ');
                console.log('options inside addItemToList');
                console.log(options);
                console.log(' ');
                */
                /**
                 * CNET Data
                 */

                var item = line.getItem();
                /*
                console.log(' ');
                console.log('item inside addItemToList');
                console.log(item);
                console.log(' ');
                */
                //Might as well put the image Url in
                //06-03-2020 - Deon Doughty - added thumbnail image
                    var imagesUrl = '';
                    var imgClassCheck = jQuery('div').hasClass('ccs-ds-cloud-main-image');
                    var imgClassCheckTwo = jQuery('div').hasClass('ccs-fancybox-gallery');
                    if (imgClassCheck === true && imgClassCheckTwo === true) {

                        var imagesUrl = jQuery('div').closest('.ccs-slick-list').find('.ccs-cc-thumbnail-wrapper').attr('data-original-src');

                    }

                //New categories
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
                    
                var cnetCategoryId = GetUrlParameter('cnetcategoryid');
                var nsCategoryId = GetUrlParameter('nscategoryid');
                var pricingGroupId = GetUrlParameter('pricinggroupid');

                    /*
                    console.log(' ');
                    console.log('cnetCategoryId: ' + cnetCategoryId);
                    console.log('nsCategoryId: ' + nsCategoryId);
                    console.log('pricingGroupId ' + pricingGroupId);
                    console.log(' ');

                    console.log(' ');
                    console.log('cnetCategoryId: ' + GetUrlParameter('cnetcategoryid'));
                    console.log('nsCategoryId: ' + GetUrlParameter('nscategoryid'));
                    console.log('pricingGroupId ' + GetUrlParameter('pricinggroupid'));
                    console.log(' ');
                    */

                var cnet_data = {
                    id: item.get("internalid"),
                    price: item.getPrice().price || item.get("price"),
                    mpn: item.get("mpn").replace(/__/g, '#').replace(/_/,"/"),
                    cat: item.get("cat"),
                    weight: item.get("weight"),
                    description : jQuery('.ccs-ds-standardDescription').html(),
                    manufacturer : item.get('manufacturer'),
                    imageUrl: imagesUrl,
                    cnetcategoryid: GetUrlParameter('cnetcategoryid'),
                    nscategoryid:  GetUrlParameter('nscategoryid'),
                    pricinggroupid:  GetUrlParameter('pricinggroupid') 
                }



                var option = {
                    cartOptionId: "CNET_DATA",
                    itemOptionId: "CNET_DATA",
                    label: "CNET_DATA",
                    type: "text",
                    value:cnet_data
                }
                
                options.push(option)
                
                var ret = fn.apply(this, _.toArray(arguments).slice(1));
                
                return ret;
            }),
        });
    });
