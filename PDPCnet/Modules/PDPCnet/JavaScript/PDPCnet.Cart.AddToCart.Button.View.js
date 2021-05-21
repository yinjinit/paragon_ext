/**
 * @module PDPCnet.Cart.AddToCart.Button.View
 * @desc override the addToCart button to send the information required to Create the item if not exist in NS
 */
define(
    'PDPCnet.Cart.AddToCart.Button.View',
    [
        'Cart.AddToCart.Button.View',
        'Backbone.View',
        'Item.Model',
        'Backbone',
        'LiveOrder.Line.Model',
        'Cart.Confirmation.Helpers',
        'NetsuiteUtils',
        'underscore',
        'Utils',
        'jQuery'
    ],
    function (
        CartAddToCartButtonView,
        BackboneView,
        ItemModel,
        Backbone,
        LiveOrderLineModel,
        CartConfirmationHelpers,
        NetsuiteUtils,
        _,
        Utils,
        jQuery

    ) {
        'use strict';



        _.extend(CartAddToCartButtonView.prototype, {

            /**
             * @method addToCartFromPLP
             * @desc add an item to the cart by first, fetching if the item exist in NS
             * If exist, we set the internalid on the line
             * If not, just go ahead with the add to cart that handle non-existing items using the item option
             * @param {*} e 
             */
            addToCartFromPLP: function (e) {

                e.preventDefault();

                var self = this;

                var cart_promise;

                var netsuite_item_promise;

                if (self.model.get("item").get("mpn")) {
                    netsuite_item_promise = NetsuiteUtils.getItemFromNetsuite(self.model.get("item").get("mpn").replace(/__/g, '#').replace(/_/, "/"), self.model.get("item").get("internalid"))
                        .then(function (data) {

                            //console.log('data addToCartFromPLP')
                            //console.log(data);

                            if (
                                !self.model.areAttributesValid(['options', 'quantity'], self.getAddToCartValidators())
                            ) {
                                return;
                            }

                            if (!self.model.isNew() && self.model.get('source') === 'cart') {
                                cart_promise = self.cart.updateProduct(self.model);
                                cart_promise.done(function () {
                                    self.options.application.getLayout().closeModal();
                                });
                            } else {
                                var line = LiveOrderLineModel.createFromProduct(self.model);

                                var options = line.get("options");

                                //Deon Doughty - 09/18/2020 - adds images to items in NS if the item does not have an image
                                var imagesUrl = '';
                                var imgClassCheck = jQuery('div').hasClass('ccs-ds-cloud-main-image');
                                var imgClassCheckTwo = jQuery('div').hasClass('ccs-fancybox-gallery');
                                if (imgClassCheck === true && imgClassCheckTwo === true) {

                                    var imagesUrl = jQuery('div').closest('.ccs-slick-list').find('.ccs-cc-thumbnail-wrapper').attr('data-original-src');

                                } else {

                                    //06-03-2020 - Deon Doughty - added thumbnail image
                                    var imagesUrl = self.model.getItem().get('_thumbnail');
                                    imagesUrl = imagesUrl.url;

                                }



                                //console.log('addToCartFromPLP imagesUrl: ');
                                //console.log(imagesUrl);
                                //console.log('data');
                                //console.log(data);

                                //OK
                                var status_check = data.status;
                                var item_id = data.data;

                                //console.log('status_check: ' + status_check);
                                //console.log('item_id: ' + item_id);

                                if(status_check === 'OK' && item_id){

                                    setTimeout(
                                      function() 
                                      {
                                    //console.log('inside item check');
                                    var data = {
                                        id_param: item_id,
                                        images_url_param: imagesUrl,
                                    };
                                    
                                     //PM Thumbnail Check
                                    //customscript_pm_thumbnail_check
                                    //pmThumbnailCheck.js
                                    //624 on prod
                                    //630 on SB
                                      
                                    jQuery.getJSON("/app/site/hosting/scriptlet.nl?script=624&deploy=1", data, function (response) {
                                        
                                        var sent = response;
                                        //console.log('sent');
                                        //console.log(sent);
                                        //PM Thumbnail Check
                                        //customscript_pm_thumbnail_check
                                        //pmThumbnailCheck.js
                                        var requestDelivered = sent[0].imageCheck;
                                        //var success_msg = '<p class="register-form-legend">Thank You for your interest.</p><p class="register-form-legend">Your request for ParagonMicro.com site access has been succesfully sent.</p><p class="register-form-legend">A sales representative will be in contact with you soon.</p><p class="register-form-legend">If you have not heard from us, please call: <a href="tel:18663808663 ">1 (866) 380-8663 </a> or email <a href="mailto: pheflin@paragonmicro.com">Online Sales </a> </p>';
                                        if(requestDelivered === "success"){
                                            //jQuery('#request-site-access').replaceWith(success_msg);
                                            console.log('Thumbnail checked');
                                            //Backbone.history.loadUrl();
                                            //data-item-id="4681208"
                                            jQuery('[data-item-id="' + item_id +'"]').find('img').attr('src', imagesUrl);
                                        }
                                        
                                    });

                                    }, 1000);

                                }

                                var cnetCategoryId = self.model.getItem().get("cnet_category_id");
                                var nsCategoryId = self.model.getItem().get("ns_category_id");
                                var pricingGroupId = self.model.getItem().get("pricing_group_id");

                                /*
                                console.log(' ');
                                console.log('cnetCategoryId: ' + cnetCategoryId);
                                console.log('nsCategoryId: ' + nsCategoryId);
                                console.log('pricingGroupId ' + pricingGroupId);
                                console.log(' ');
                                */

                                // ------------------------
                                // CNET FAKE OPTION
                                // ------------------------

                                var cnet_data = {
                                    id: self.model.getItem().get("internalid"),
                                    price: self.model.getPrice().price || self.model.getItem().get("price"),
                                    mpn: self.model.getItem().get("mpn").replace(/__/g, '#').replace(/_/, "/"),
                                    cat: self.model.getItem().get("cat"),
                                    weight: self.model.getItem().get("weight"),
                                    description: self.model.getItem().get('displayname').replace(/__/g, '#'),
                                    manufacturer: self.model.getItem().get('manufacturer'),
                                    imageUrl: imagesUrl,
                                    cnetcategoryid: self.model.getItem().get("cnet_category_id"),
                                    nscategoryid: self.model.getItem().get("ns_category_id"),
                                    pricinggroupid: self.model.getItem().get("pricing_group_id")
                                }
                                //console.log(cnet_data);

                                var option = {

                                    cartOptionId: "CNET_DATA",
                                    itemOptionId: "CNET_DATA",
                                    label: "CNET_DATA",
                                    type: "text",
                                    value: cnet_data

                                }
                                options.push(option)

                                if (data.data && data.data > 0) {
                                    line.get("item").set("internalid", parseInt(data.data))
                                }

                                cart_promise = self.cart.addLine(line);

                                CartConfirmationHelpers.showCartConfirmation(
                                    cart_promise,
                                    line,
                                    self.options.application
                                );
                            }

                            cart_promise.fail(function (jqXhr) {
                                var error_details = null;
                                try {
                                    var response = JSON.parse(jqXhr.responseText);
                                    error_details = response.errorDetails;
                                } finally {
                                    if (error_details && error_details.status === 'LINE_ROLLBACK') {
                                        self.model.set('internalid', error_details.newLineId);
                                    }
                                }
                            });


                        }).fail(function (data) {
                            // item not created on netsuite
                            console.log('Item not in netsuite.')
                        });
                    this.disableElementsOnPromise(netsuite_item_promise, e.target);

                    return false;

                }


            },

            /*
            custitem_primary_category
            custitem_secondary_category
            pricinggroup
            */

            addToCart: function (e) {


                e.preventDefault();


                //added by RG for picing bug 09.11.2020
                var itemInNS = this.model.get("item").get("item_in_ns");
                console.log('before item in ns');
                console.log(itemInNS);

                
                //var itemIDinNS = this.model.attributes.item.id;


                //console.log(itemIDinNS);
                //console.log('Looking at addToCart this.model.get("item")');
                //console.log(this.model.get("item"));

                
                
                if (this.model.getItem().get("easy_ask_item") || itemInNS) {
                    //console.log('return add to cart from plp');
                    return this.addToCartFromPLP(e);
                }

                var self = this;

                var cart_promise;

                if (
                    !this.model.areAttributesValid(['options', 'quantity'], self.getAddToCartValidators())
                ) {
                    return;
                }

                if (!this.model.isNew() && this.model.get('source') === 'cart') {
                    cart_promise = this.cart.updateProduct(this.model);
                    cart_promise.done(function () {
                        self.options.application.getLayout().closeModal();
                    });
                } else {
                    var line = LiveOrderLineModel.createFromProduct(this.model);

                    var options = line.get("options");



                    //06-03-2020 - Deon Doughty - added thumbnail image
                    var imagesUrl = '';
                    var imgClassCheck = jQuery('div').hasClass('ccs-ds-cloud-main-image');
                    var imgClassCheckTwo = jQuery('div').hasClass('ccs-fancybox-gallery');
                    if (imgClassCheck === true && imgClassCheckTwo === true) {

                        var imagesUrl = jQuery('div').closest('.ccs-slick-list').find('.ccs-cc-thumbnail-wrapper').attr('data-original-src');

                    }

                    
                   //console.log('addToCart imagesUrl: ');
                    //console.log(imagesUrl);
                    //console.log('itemIDinNS: ' + itemIDinNS);
                    //console.log('this.model after image');
                    //console.log(this.model);
                    

                    //console.log(this.model.attributes.item.custitem_pm_cnet_id);
                //console.log(this.model.attributes.item.mpn);

                //console.log(this.model.attributes.item.attributes.custitem_pm_cnet_id);
                //console.log(this.model.attributes.item.attributes.mpn);

                var cnet_id = "";
                var mpn_attr = "";

                if(this.model.attributes.item.custitem_pm_cnet_id !== undefined && this.model.attributes.item.mpn !== undefined){
                    cnet_id = this.model.attributes.item.custitem_pm_cnet_id;
                    mpn_attr = this.model.attributes.item.mpn;
                }

                if(this.model.attributes.item.attributes.custitem_pm_cnet_id !== undefined && this.model.attributes.item.attributes.mpn !== undefined){
                    cnet_id = this.model.attributes.item.attributes.custitem_pm_cnet_id;
                    /*
                    if(cnet_id === undefined){
                       cnet_id =  this.model.attributes.item.attributes.itemid
                    }
                    */
                    mpn_attr = this.model.attributes.item.attributes.mpn;
                }

                var internalid_check;

                setTimeout(

                    function() 
                    {
                        if(cnet_id !== "" && cnet_id !== undefined && mpn_attr !== "" && mpn_attr !== undefined){
                    //console.log('inside item check');

                        var mpn = encodeURIComponent(mpn_attr);
                        var cnetID  = cnet_id;

                        var data = {
                            mpn: mpn,
                            cnetID: cnetID ,
                        };

                        //This is the checkitem script that is in PDPCnet

                        jQuery.getJSON("/app/site/hosting/scriptlet.nl?script=606&deploy=1&", data, function (response) {

                        var id = response;
                        var internalid_check = id;
                        //console.log(id);

                        checkAndAddThumbnailUrl(internalid_check, imagesUrl);

                    });
                    }


            }, 1000);



              function checkAndAddThumbnailUrl(internalid_check, imagesUrl){
                if(internalid_check !== "" && internalid_check !== 0   && imagesUrl !== ""){

                               // console.log('inside add image');
                                var internalid = internalid_check;
                                var data = {
                                    id_param: internalid_check,
                                    images_url_param: imagesUrl,
                                };

                                //console.log('internalid_check ' + internalid_check);
                                
                                //PM Thumbnail Check
                                //customscript_pm_thumbnail_check
                                //pmThumbnailCheck.js
                                //624 on prod
                                //630 on SB
                                  
                                jQuery.getJSON("/app/site/hosting/scriptlet.nl?script=624&deploy=1", data, function (response) {
                                    
                                    var sent = response;
                                    //console.log('sent');
                                    //console.log(sent);
                                    var requestDelivered = sent[0].imageCheck;
                                    //var success_msg = '<p class="register-form-legend">Thank You for your interest.</p><p class="register-form-legend">Your request for ParagonMicro.com site access has been succesfully sent.</p><p class="register-form-legend">A sales representative will be in contact with you soon.</p><p class="register-form-legend">If you have not heard from us, please call: <a href="tel:18663808663 ">1 (866) 380-8663 </a> or email <a href="mailto: pheflin@paragonmicro.com">Online Sales </a> </p>';
                                    if(requestDelivered === "success"){
                                        //jQuery('#request-site-access').replaceWith(success_msg);
                                        console.log('Thumbnail checked');
                                        //Backbone.history.loadUrl();
                                        //data-item-id="4681208"
                                        var item_id = internalid_check;
                                        jQuery('[data-item-id="' + item_id +'"]').find('img').attr('src', imagesUrl);
                                    }
                                    
                                });

                            }

              }

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

                    // ------------------------
                    // CNET FAKE OPTION
                    // ------------------------
                    var cnet_data = {
                        id: this.model.getItem().get("internalid"),
                        price: this.model.getPrice().price || this.model.getItem().get("price"),
                        mpn: self.model.getItem().get("mpn").replace(/__/g, '#').replace(/_/, "/"),
                        cat: this.model.getItem().get("cat"),
                        weight: this.model.getItem().get("weight"),
                        description: jQuery('.ccs-ds-standardDescription').html(),
                        manufacturer: this.model.getItem().get('manufacturer'),
                        imageUrl: imagesUrl,
                        cnetcategoryid: GetUrlParameter('cnetcategoryid'),
                        nscategoryid:  GetUrlParameter('nscategoryid'),
                        pricinggroupid:  GetUrlParameter('pricinggroupid')   
                    }

                    //console.log(cnet_data);

                    var option = {

                        cartOptionId: "CNET_DATA",
                        itemOptionId: "CNET_DATA",
                        label: "CNET_DATA",
                        type: "text",
                        value: cnet_data
                    }

                    options.push(option)

                    cart_promise = this.cart.addLine(line);

                    CartConfirmationHelpers.showCartConfirmation(
                        cart_promise,
                        line,
                        self.options.application
                    );
                }

                cart_promise.fail(function (jqXhr) {
                    var error_details = null;
                    try {
                        var response = JSON.parse(jqXhr.responseText);
                        error_details = response.errorDetails;
                    } finally {
                        if (error_details && error_details.status === 'LINE_ROLLBACK') {
                            self.model.set('internalid', error_details.newLineId);
                        }
                    }
                });

                this.disableElementsOnPromise(cart_promise, e.target);
                return false;

            }
        });
    });
