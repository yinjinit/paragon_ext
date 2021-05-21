
define('PLP.EasyAsk.Facets.Helper'
   , [
      'Facets.Helper'
      , 'Facets.Router'
      , 'SC.Configuration'
      , 'underscore'
      , 'jQuery'
      ,  'Profile.Model'


   ]
   , function (
      FacetsHelper
      , FacetsRouter
      , Configuration
      , _
      , jQuery
      , ProfileModel

   ) {


      var PLPEasyAskFacetsHelper = _.extend(FacetsHelper, {

         /**
          * @method findCategoryId
          * @param {*} categories 
          * @param {*} translator 
          * @desc recursive method that find a category based on the category path
          */
         findCategoryId: function (categories, translator) {

            try {

               var self = this;

               /**
                * Base step
                * Check if the cateogry is in this level
                */
               var category = _.find(categories, function (el) {
                  return el.fullurl === translator.getCategoryUrl();
               });

               /**
                * If we found it, just return the category
                */
               if (category)
                  return category

               // In other way, continue

               /**
                * // Filter the parent category 
                */
               var parentCategory = _.find(categories, function (el) {
                  return translator.getCategoryUrl().includes(el.fullurl)
               });

               // If exist (it should,but just check)
               if (parentCategory) {
                  /**
                   * // Invoke recursive method
                   */
                  return self.findCategoryId(parentCategory.categories, translator);
               }
               return;
            }

            catch (e) {
               return
            }
         },


         /**
          * @method addUrlsToRouter
          * @param {*} easyAskModel 
          * @param {*} translator 
          * @param {*} facetModel 
          * @param {*} application 
          */
         addUrlsToRouter: function (easyAskModel, translator, facetModel, application) {
            // Get the facets of Easy Ask
            var facets = this.translateFacetsToNsFacets(easyAskModel, translator, facetModel);
            // Generate url and add it to the possible routes
            var facetsUrls = _.map(facets, function (f) { return f.url })
            // router instance
            var router = new FacetsRouter(application);
            // Add valid Urls as facets from easy ask
            router.addUrl(facetsUrls, 'facetLoading');
         },


         /**
          * @method getEasyAskFilters
          * @param {*} translator 
          * @desc based on the current translator, return the filters to use on easy ask
          */
         getEasyAskFilters: function (translator) {

            var apiParams = translator.getApiParams();
            var whiteListParams = _.omit(apiParams, ['sort', 'limit', 'offset', 'q', 'commercecategoryurl']);

            return whiteListParams
         },

         /**
          * 
          * @param {*} translator 
          */
         getEasyAskApiParams: function (translator) {



            var params = translator.getApiParams();
            var easyAskFilters = this.getEasyAskFilters(translator);
            /*
            console.log(' ');
            console.log('params getEasyAskApiParams in PLP.EasyAsk.Facets.Helper.js');
            console.log(params);
            console.log(' ');
            */
            /**
             * query
             */
            var data = {};
            if (!_.isEmpty(easyAskFilters))
               data.selected_filters = JSON.stringify(easyAskFilters)
            data.q = params.q || "__global__";

            /**
             * Pagination translation
             */
            var currentPage = translator.getOptionValue('page');
            if (currentPage)
               data.page = currentPage;
            /**
             * Category
             */
            if (translator.isCategoryPage) {
               var category = this.findCategoryId(SC.CATEGORIES, translator);
               if (category)
                  data.c_id = category.internalid
            }

            var filtersCheck = data.selected_filters;
            //xconsole.log('filtersCheck' + filtersCheck);
            var urlCheck = window.location.href;
            var brandCheck = urlCheck.indexOf("Brand");
            var brandsCheck = urlCheck.search("Brands");
            var hashCheck = urlCheck.indexOf("#");
            var ampersandCheck = urlCheck.indexOf("&");
            //console.log(brandCheck);

            //https://www.paragonmicro.com/products?Brand=Citrix
            if(brandCheck !== -1 && brandsCheck === -1){

                if(hashCheck !== -1){
                  var url_vars = urlCheck.split('#');
                } else {
                  var url_vars = urlCheck.split('.com');
                }
                var category_brand = url_vars[1].split('?');
                var category = category_brand[0];
                    category = category.replace('/','');

                var brand = category_brand[1];
                    //currentPage > 1
                    //if(currentPage > 1 || ampersandCheck !== -1){
                    if(ampersandCheck !== -1){
                      brand = brand.split('&');
                      brand = brand[1];
                    }
                    brand =  brand.replace('=', '":"');
                    brand = '{"'+ brand +'"}';

                    if(filtersCheck === undefined){
                      data.selected_filters = brand;
                    }

              }
                

             // }
            /*
              c_id: "1"
              page: 1
              q: "__global__"
              selected_filters: "{"Brand":"APC"}"
            */
            //console.log(' ');
            //console.log('data getEasyAskApiParams in PLP.EasyAsk.Facets.Helper.js');
            //console.log(data);
            //console.log('url');
            //console.log(urlCheck);
            //console.log('params');
            //console.log(params);
            //console.log(' ');

            return data;

         },


         /**
          * @method translateProductsToNsItems
          * @param {*} easyAskModel 
          * @param {*} facetModel 
          * @desc parse the result from easy ask and set the ITEMS response in facet model
          */
         translateProductsToNsItems: function(easyAskModel, facetModel) {

            var products = easyAskModel.getProducts();

            products = _.map(products, function (product) {

              //console.log('product translateProductsToNsItems');
              //console.log(product);
               
               //Deon Doughty - 10/28/2020 - new categories
               //New cnetCategoryId, nsCategoryId, pricingGroupId
               var cnetCategoryId = product.CNET_Cat_ID;
               var nsCategoryId = product.NS_Cat_ID;
               var pricingGroupId = product.NS_Pricing_Grp_ID

               /*
               console.log(' ');
               console.log('cnetCategoryId: ' + cnetCategoryId);
               console.log('nsCategoryId: ' + nsCategoryId);
               console.log('pricingGroupId: ' + pricingGroupId);
               console.log(' ');
               */

               var onlinePrice = product.Online_Price;
               var basePrice = product.Base_Price
               var priceUsed = onlinePrice ? onlinePrice : basePrice;
               var displayAddToCartButton = false;

              //Deon Doughty - 09/28/200 Stock Notifications Displayed on Web.
               var total_quantity = product.Total_Quantity;
               //console.log('total_quantity: '+ total_quantity);

               var profile = ProfileModel.getInstance();

               var nsID = product.Net_Suite_ID;
               var itemInNS = false;
               if (nsID) {
                  itemInNS = true;
               }

               if(onlinePrice || (profile.get("isLoggedIn") === "T")){
                  displayAddToCartButton = true;
               }               

               return {
                  // Default neccesary fields
                  "isinstock": true,
                  "ispurchasable": true,
                  "isbackorderable": true,
                  "showoutofstockmessage": true,
                  "quantityavailable": 100,
                  "urlcomponent": "",
                  //flag when there is no onlineprice from EasyAsk
                  "displayAddToCartButton": displayAddToCartButton,                  
                  "hasOnlinePrice": onlinePrice,    

                  // Parameters to use on CNET
                  "itemid": product.Product_Id,
                  "pn": product.Product_Id,

                  //Deon Doughty - 10/28/2020 - new categories
                  //New cnetCategoryId, nsCategoryId, pricingGroupId
                  "cnet_category_id": cnetCategoryId,
                  "ns_category_id": nsCategoryId,
                  "pricing_group_id": pricingGroupId,
                  /**
                  * MPN parameter should not contain the char "#"
                  */
                  "mpn": product.Mpn.replace(/#/g, '__').replace(/\//g, '_'),

                  "internalid": product.Product_Id,
                  "displayname": product.Product_Name,
                  "storedisplayname2": product.Product_Name,
                  "onlinecustomerprice": product.Online_Price,
                  "easy_ask_item": true,
                  "item_in_ns": itemInNS,
                  "manufacturer" : product.Manufacturer,

                  //Deon Doughty - 09/28/200 Stock Notifications Displayed on Web.
                  "total_quantity" : total_quantity,

                  "cat": product.Cat_ID,
                  "weight": product.Weight,
                  "price": priceUsed && priceUsed.split("$").length > 0 ? priceUsed.split("$")[1] : "-No Price-",
                  "onlinecustomerprice_detail": {
                     "onlinecustomerprice_formatted": priceUsed,
                     "onlinecustomerprice": priceUsed && priceUsed.split("$").length > 0 ? priceUsed.split("$")[1] : "-No Price-",
                  },
                  "itemimages_detail": {
                     "main": {
                        "urls": [{
                           "altimagetext": product.Product_Name,
                           "url": product.Medium_Img_URL
                        }]
                     }
                  }

               }
            })


            facetModel.set("items", products)

         },

         /**
          * 
          * @param {*} easyAskModel 
          */
         getProductsOnNsFormatting: function(easyAskModel) {

            //console.log('PLPEasy Ask getProductsOnNsFormatting easyAskModel');
            //console.log(easyAskModel);

            var products = easyAskModel.getProducts();

            products = _.map(products, function (product) {

              //console.log('products inside PLP.EasyAsk.Facets.Helper.js');
              //console.log(products);

               var onlinePrice = product.Online_Price;
               var basePrice = product.Base_Price
               var priceUsed = onlinePrice ? onlinePrice : basePrice;
               var displayAddToCartButton = false;

               var total_quantity = product.Total_Quantity;
               //console.log(total_quantity);

               //Deon Doughty - 10/28/2020 - new categories
               //New cnetCategoryId, nsCategoryId, pricingGroupId
               var cnetCategoryId = product.CNET_Cat_ID;
               var nsCategoryId = product.NS_Cat_ID;
               var pricingGroupId = product.NS_Pricing_Grp_ID

               /*
               console.log(' ');
               console.log('cnetCategoryId: ' + cnetCategoryId);
               console.log('nsCategoryId: ' + nsCategoryId);
               console.log('pricingGroupId: ' + pricingGroupId);
               console.log(' ');
               */

               var profile = ProfileModel.getInstance();
               //console.log('base price' + basePrice);

               var nsID = product.Net_Suite_ID;
               var itemInNS = false;
               if (nsID) {
                  itemInNS = true;
               }

               //var total_quantity = Total_Quantity;
              // console.log('total_quantity :' + total_quantity);
               
               //console.log('online price' + onlinePrice);
               if(onlinePrice || (profile.get("isLoggedIn") === "T")){
                  displayAddToCartButton = true;
               }    

               return {
                  // Default neccesary fields
                  "isinstock": true,
                  "ispurchasable": true,
                  "isbackorderable": true,
                  "showoutofstockmessage": true,
                  "quantityavailable": 100,
                  "urlcomponent": "",
                  //flag when there is no onlineprice from EasyAsk
                  "displayAddToCartButton": displayAddToCartButton,

                  // Parameters to use on CNET
                  "itemid": product.Product_Id,
                  "pn": product.Product_Id,

                  //Deon Doughty - 10/28/2020 - new categories
                  //New cnetCategoryId, nsCategoryId, pricingGroupId
                  "cnet_category_id": cnetCategoryId,
                  "ns_category_id": nsCategoryId,
                  "pricing_group_id": pricingGroupId,
                  /**
                  * MPN parameter should not contain the char "#"
                  */
                  "mpn": product.Mpn.replace(/#/g, '__').replace(/\//g, '_'),


                  "internalid": product.Product_Id,
                  "displayname": product.Product_Name,
                  "storedisplayname2": product.Product_Name,
                  "onlinecustomerprice": product.Online_Price,
                  "easy_ask_item": true,
                  "item_in_ns": itemInNS,
                  "manufacturer" : product.Manufacturer,

                  //Deon Doughty - 09/28/200 Stock Notifications Displayed on Web.
                  "total_quantity" : total_quantity,

                  "cat": product.Cat_ID,
                  "weight": product.Weight,
                  "price": priceUsed && priceUsed.split("$").length > 0 ? priceUsed.split("$")[1] : "-No Price-",
                  "onlinecustomerprice_detail": {
                     "onlinecustomerprice_formatted": priceUsed,
                     "onlinecustomerprice": priceUsed && priceUsed.split("$").length > 0 ? priceUsed.split("$")[1] : "-No Price-",
                  },
                  "itemimages_detail": {
                     "main": {
                        "urls": [{
                           "altimagetext": product.Product_Name,
                           "url": product.Medium_Img_URL
                        }]
                     }
                  }

               }
            })

            //console.log(products);

            return products;

         },

         /**
          * @method translateFacetsToNsFacets
          * @param {*} easyAskModel 
          * @param {*} translator 
          * @desc parse the result from easy ask and set the FACETS response in facet model
          */
         translateFacetsToNsFacets: function(easyAskModel, translator, facetModel) {

            var facets = easyAskModel.getFacets();

            facets = _.map(facets, function (facet) {

               return {
                  "id": facet.name,
                  "url": facet.attributeValueList[0].nodeString.split(":")[0],
                  "values": _.map(facet.attributeValueList, function (facetNode) {

                     // ------------------------------------------------------------------------------
                     // Clean up the filter values 
                     // ------------------------------------------------------------------------------
                     var url = facetNode.attributeValue.replace(/\s/g, '-');
                     url = url.replace(/\$/g, '');
                     url = url.replace(/\(/g, '');
                     url = url.replace(/\)/g, '');
                     url = url.replace(/\°/g, '');
                     // ------------------------------------------------------------------------------

                     return {
                        "url": url,
                        "label": facetNode.attributeValue
                     }
                  })
               }
            })

            var total = easyAskModel.getTotal();
            translator.setLabelsFromFacets(facets || []);
            facetModel.set("facets", facets || []);
            facetModel.set("total", total || 0)
            return facets;
         },

         setFacetsInConfiguration: function(easyAskModel, translator, application) {

            var original_easy_ask_facets = easyAskModel.getFacets();


            var facets_ids_include = _.map(original_easy_ask_facets, function (item) {
               return item.attributeValueList[0].nodeString.split(":")[0]
            });


            /**
             * Concat element and
             * Remove duplicated elements
             */
            var facets_to_include = _.union(facets_ids_include, _.pluck(Configuration.get('facets'), 'id'));

            facets_to_include = _.uniq(facets_to_include);

            // Re-build information
            var facets_to_include = _.map(facets_to_include, function (item) {

               var facetElement = {
                  id: item,
                  behavior: "multi",
                  name: item.replace(/-/g, ' '),
                  collapsed: true,
                  isParameter: true
               }

               return facetElement
            });

            SC.CONFIGURATION.facets = facets_to_include;
            application.translatorConfig.facets = facets_to_include;
         }


      })

      return PLPEasyAskFacetsHelper;

   });
