// @module NetsuiteUtils.Model
define('NetsuiteUtils.Model', [
    'SC.Model', 
    'Application', 
    'Utils', 
    'underscore', 
    'Configuration'
], function(
    SCModel,
    Application,
    Utils,
    _,
    Configuration
) {
    'use strict';
    
    return SCModel.extend({

        itemData : {},

        headers : {
            "Content-Type": "application/json"
            , "Accept": 'application/json'
        },

        /**
         * Check Inventory ItemUsage: Checks whether a specific product record exists in NetSuite.
         * Script Name:  PM: Check Item SL
         * Script File: checkItem_SL.jsDeployment 
         * URL: /app/site/hosting/scriptlet.nl?script=350&deploy=1Request 
         * Parameters: 
         * 		cid <string>: CNET ID of the product
         * 		mpn <string>: Manufacturer Part Number (helps get a better match)
         * 		callback <string>: Usually passed in automatically by JQuery. Formats the response in a way that can be used for JSON AJAX calls.
         * Response:
         * 		NetSuite ID <integer> or 0 if there was no match
         */
        checkItem : function(){
            var suiteletURL = nlapiResolveURL('SUITELET', 'customscript_checkitemsexist', 'customdeploy_checkitemsexist', 'external');
            var encodedMPN = this.itemData.mpn;
            encodedMPN = encodedMPN && encodeURIComponent(encodedMPN);
            suiteletURL += "&mpn=" + encodedMPN + "&cnetID=" + this.itemData.cnet;

            var jsonData = {}

            try {
                var data = nlapiRequestURL(suiteletURL, "", this.headers, "GET").getBody();
                jsonData.status = 'OK';
                jsonData.data = JSON.parse(data);
            } catch (error) {
                jsonData = {
                    status : 'ERROR',
                    message : 'Item does not exist on Netsuite'
                }
            }

            return jsonData;
        },

        /**
         * 
         * Usage:
         *		Creates an inventory item in NetSuite if one does not already exist, can also be used to updated existing inventory item records.
         *	Script Name:PM: Create Items SL
         *	Script File: createItems.js
         *	Deployment URL: /app/site/hosting/scriptlet.nl?script=349&deploy=1
         *	Request Parameters:
         *		Item[id] <string>: CNET ID of the product
         *		Item[price] <currency>: MSRP according to EA data
         *		Item[description] <string>: Product Description
         *		Item[mpn] <string>: Manufacturer Part Number
         *		Item[cat] <string>: 2-digit category code (.e.g. ‘AB’)
         *		Item[weight] <float>: The item’s weight (e.g. ’12.50’)
         *		Item[action] <string>: Either ‘update’ or ‘create’
         *			Update: updates the inventory item data with the data provided
         *			Create: creates a new inventory item with the data provided
         *			NOTE: If no value is provided, then “create” is assumed
         *		callback <string>: Usually passed in automatically by JQuery. Formats the response in a way that can be used for JSON AJAX calls.
         *	Response:
         *		NetSuite ID <integer> or false is item creation/update fails
         */
        createItem : function(){
            //PM: Create Items SL
            //createItems.js
            var suiteletURL = nlapiResolveURL('SUITELET', 'customscript358', 'customdeploy1', 'external');
            var jsonData = {}

            // ------------------------------------------------------------------------------
            // Validates request against EasyAsk to pull the correct price.
            // ------------------------------------------------------------------------------
            try {
                var EasyAskSearchModel = require('EasyAskSearch.Model');
                EasyAskSearchModel.generateEasyAskEndpoint(1, null, this.itemData.mpn);
                var easyAskData = EasyAskSearchModel.makeAPICall();

                var easyAskDataObj = JSON.parse(easyAskData);

                if(easyAskDataObj && easyAskDataObj.returnCode == 0 && easyAskDataObj.source) {
                    for( var i = 0; i < easyAskDataObj.source.products.items.length; i++ ){
                        if( easyAskDataObj.source.products.items[i]['Mpn'] == this.itemData.mpn ) {
                            // remove $ sign
                            var price = easyAskDataObj.source.products.items[i]['Online_Price'].slice(1)
                            this.itemData.price = parseFloat(price.replace(/,/g, ''));
                            nlapiLogExecution('DEBUG', '-- PRICE SET FROM EASY ASK --', this.itemData.price);

                            //Deon Doughty - 8/20/20 - None of these values are being added to add to quote or add to product List this corrects that issue.
                            var product_id = easyAskDataObj.source.products.items[i]['Product_Id'];
                            this.itemData.id = product_id;

                            nlapiLogExecution('DEBUG', '-- Product_id SET FROM EASY ASK --', this.itemData.id);

                            var purchase_description = easyAskDataObj.source.products.items[i]['Purchase_Description'];
                            this.itemData.description = purchase_description;

                            nlapiLogExecution('DEBUG', '-- Description SET FROM EASY ASK --', this.itemData.description);

                            var item_category = easyAskDataObj.source.products.items[i]['Cat_ID'];
                            this.itemData.cat = item_category;

                            nlapiLogExecution('DEBUG', '-- Category SET FROM EASY ASK --', this.itemData.cat);

                            var item_weight = easyAskDataObj.source.products.items[i]['Weight'];
                            this.itemData.weight = item_weight;

                            nlapiLogExecution('DEBUG', '-- Weight SET FROM EASY ASK --', this.itemData.weight);

                            var item_manufacturer = easyAskDataObj.source.products.items[i]['Manufacturer'];
                            this.itemData.manufacturer = item_manufacturer;

                            nlapiLogExecution('DEBUG', '-- manufacturer SET FROM EASY ASK --', this.itemData.manufacturer);

                            //Deon Doughty - 11/03/2020 - new categories
                            //New cnetCategoryId, nsCategoryId, pricingGroupId
                            var item_cnetcategoryid = easyAskDataObj.source.products.items[i]['CNET_Cat_ID'];
                            this.itemData.cnetcategoryid = item_cnetcategoryid;

                            nlapiLogExecution('DEBUG', '-- cnetcategoryid SET FROM EASY ASK --', this.itemData.cnetcategoryid);

                            var item_nscategoryid = easyAskDataObj.source.products.items[i]['NS_Cat_ID'];
                            this.itemData.nscategoryid = item_nscategoryid;

                            nlapiLogExecution('DEBUG', '-- nscategoryid SET FROM EASY ASK --', this.itemData.nscategoryid);

                            var item_pricinggroupid = easyAskDataObj.source.products.items[i]['NS_Pricing_Grp_ID'];
                            this.itemData.pricinggroupid = item_pricinggroupid;

                            nlapiLogExecution('DEBUG', '-- pricinggroupid SET FROM EASY ASK --', this.itemData.nscategoryid);


                            var imageUrl = '';
                            var Medium_Img_URL = easyAskDataObj.source.products.items[i]['Medium_Img_URL'];
                            var Thumbnail_URL = easyAskDataObj.source.products.items[i]['Thumbnail_URL'];

                            if(Medium_Img_URL){

                                imageUrl = Medium_Img_URL;

                            } else if(Thumbnail_URL){

                              imageUrl = Thumbnail_URL;

                            } else {

                                imageUrl = '';
                                
                            }

                            this.itemData.imageUrl = imageUrl;

                            nlapiLogExecution('DEBUG', '-- imageUrl SET FROM EASY ASK --', this.itemData.imageUrl);
                        }
                    }
                }
            } catch (error) {
                nlapiLogExecution('DEBUG', '-- API CALL TO EASY ASK FAILED (NetsuiteUtils.Model.js) --', error.message);
            }
            // ------------------------------------------------------------------------------

            // ------------------------------------------------------------------------------
            // Move to item creation on Netsuite
            // ------------------------------------------------------------------------------
            try {
                var data = nlapiRequestURL(suiteletURL, JSON.stringify(this.itemData) , this.headers).getBody();
                jsonData.status = 'OK';
                jsonData.data = JSON.parse(data);
            } catch (error) {
                jsonData = {
                    status : 'ERROR',
                    message : 'Item already exists in Netsuite'
                }
            }
            // ------------------------------------------------------------------------------

            return jsonData;
        }
    })
});