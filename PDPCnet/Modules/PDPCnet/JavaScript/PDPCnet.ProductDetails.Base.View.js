define(
   'PDPCnet.ProductDetails.Base.View',
   [
      'ProductDetails.Base.View',
      'NetsuiteUtils',
      'Tavano.PDPCnet.CNetUtils',
      'AjaxRequestsKiller',
      'Tracker',
      'Backbone.View',
      'Item.Model',
      'Backbone',
      'underscore',
      'Utils',
      'jQuery',
      'Profile.Model'
   ],
   function (
      ProductDetailsBaseView,
      NetsuiteUtils,
      TavanoPDPCnetCNetUtils,
      AjaxRequestsKiller,
      Tracker,
      BackboneView,
      ItemModel,
      Backbone,
      _,
      Utils,
      $,
      ProfileModel
   ) {
      'use strict';



      _.extend(ProductDetailsBaseView.prototype, {

         /**
          * @method syncItemModelWithNs
          * @desc if the item exist in NS, we sync the current model with the existing item
          * By doing this, we retrieve standard fields, pricing and add to cart will be default
          */
         syncItemModelWithNs: function () {
            var self = this;
            var profile = ProfileModel.getInstance();

            if (self.model.get("item").get("mpn")) {
               NetsuiteUtils.getItemFromNetsuite(self.model.get("item").get("mpn").replace(/__/g, '#').replace(/_/,"/"), self.model.get("item").get("internalid"))
                  .then(function (data) {

                     
                  if (profile.get("isLoggedIn") == "F"){
                     self.showNonLoggedInRules(self.model.get("item"));
                  }
   
                     // item in netsuite if data.data > 0
                     if (data.data && data.data > 0) {

                        var original_detail = {};
                        if(self.model.get("item").get('onlinecustomerprice_detail')){
                           original_detail.onlinecustomerprice = self.model.get("item").get('onlinecustomerprice_detail').onlinecustomerprice;
                           original_detail.onlinecustomerprice_formatted = self.model.get("item").get('onlinecustomerprice_detail').onlinecustomerprice_formatted;
                        }                    
   
                        // item on netsuite
                        self.model.get("item").fetch({
                           data: {
                              "id": parseInt(data.data)
                           },
                           killerId: AjaxRequestsKiller.getKillerId()
                        }).then(function () {
                        
                           // TODO: Review to avoid blinding behavior
                           // self.showContent();
                           //in this fetch the internalid of the item is setup
                           //we need this in order to avoid trying to create items in NetSuite that already exist in the backend
                           //here we are updating the price from the value on the PLP | Paragon's script
                           if(original_detail && original_detail.onlinecustomerprice){

                              self.model.get("item").set("onlinecustomerprice_detail",{
                                 "onlinecustomerprice_formatted" : original_detail.onlinecustomerprice_formatted,
                                 "onlinecustomerprice" : original_detail.onlinecustomerprice,
                              });                              
                           }
                           
                           
                           var price = self.model.get("item").get('_price') && parseFloat(self.model.get("item").get('_price'));
                           
                           if(price > 0){
                              self.getChildViewInstance('Product.Price').render();
                              //call here because base price is > 0 but we do not intend to display it
                              self.showNonLoggedInRules(self.model.get("item"));
                           } else {
                              self.showNonLoggedInRules(self.model.get("item"));
                           }
                                                      
                        });

   
                     } else {
                        // item not created on netsuite
                        //self.updatePriceBasedOnParagonRules();
                        self.showNonLoggedInRules(self.model.get("item"));
                        
                     }
                  }).fail(function (data) {
                     // item not created on netsuite
                     //self.updatePriceBasedOnParagonRules();
                     self.showNonLoggedInRules(self.model.get("item"));
                  });
            }
         },

         // ------------------------------------------------------------------------------
         // Update Price Based on the suitelet from Paragon
         // ------------------------------------------------------------------------------
         updatePriceBasedOnParagonRules: function () {

            // make the ajax call to get the price from Paragon's script.
            var item = this.model.get('item');
            var self = this;

            var profile = ProfileModel.getInstance();

            if (profile.get("isLoggedIn") == "T") {
               try {
                  var data = {
                     cid: profile.get("internalid"),
                     item: item.get('internalid'), // CNET ID
                     msrp: item.getPrice().price, // MSRP
                     cat: item.get('cat'), // CAT
                     mpn: item.get('mpn').replace(/__/g, '#').replace(/_/,"/") // PART NUMBER
                  };
   
                  $.get('/app/site/hosting/scriptlet.nl?script=226&deploy=1', data).then(function (data) {
                     //added RG to signify that item is in ns
                     item.set('item_in_ns', 'true'); 
                     item.set('onlinecustomerprice_detail', {
                        onlinecustomerprice_formatted: _.formatCurrency(data),
                        onlinecustomerprice: data
                     });
                     
                     self.getChildViewInstance('Product.Price').render()
                  });
               } catch (error) {
                  //self.$('.product-views-price').show();
                  self.showNonLoggedInRules(item);
               }
            }else {

              
               self.showNonLoggedInRules(item);
            }
         },
         // ------------------------------------------------------------------------------

         showNonLoggedInRules : function(item){
            var x = item.get('e');
            var y = item.get('_sku');
            var ys =  y && y.substr(1);

            var z = y && y.substr(1);
            z = z && z.split("").reverse().join("");

            var price = item.get('_price') && parseFloat(item.get('_price'));

            if(x == ys || price <= 0){
               
               jQuery('#product-price-full-pdp').hide();
               jQuery('#in-modal-product-price-quick-view').hide();

               jQuery('#quantity-full-pdp').hide();
               jQuery('#in-modal-quantity-quick-view').hide();
               
               jQuery('#main-data-view-full-pdp').hide();
               jQuery('#in-modal-main-data-view-quick-view').hide();

               jQuery('#quote-productlist-container-full-pdp').hide();
               jQuery('#in-modal-quote-productlist-container-quickview').hide();

               jQuery('#in-modal-call-for-pricing-quick-view').show();
               jQuery('#call-for-pricing-full-pdp').show();

            }else if(x == z){
               jQuery('.product-views-price').show();
            }
         },

         loadCNetSnippet: function () {
            if (this.model.get("item").get("mpn")) {
               TavanoPDPCnetCNetUtils.loadCNetSnippet(this.model.get("item").get("pn"), this.model.get("item").get("mpn").replace(/__/g, '#').replace(/_/,"/"), this.model.get("item").get("cat"));
            }
         },

         changeInModalIds: function () {
            
            this.$("#in-modal-ccs-gallery").attr("id", "ccs-gallery");
            this.$("#in-modal-ccs-product-details").attr("id", "ccs-product-details");
            this.$("#in-modal-ccs-product-name").attr("id", "ccs-product-name");
            this.$("#in-modal-ccs-standard-desc").attr("id", "ccs-standard-desc");
         },

         /**
          * @method initialize
          * @desc wrap initialize to loadCnetSinppet afger the view was rendered
          */
         initialize: _.wrap(ProductDetailsBaseView.prototype.initialize, function (fn) {
            
            var ret = fn.apply(this, _.toArray(arguments).slice(1));
            var self = this;
            this.on("afterViewRender", function () {
               self.$('.product-views-price').hide();

               // Change In Modal Ids
               _.defer(_.bind(self.changeInModalIds, self));
               // Load CNet Snippet
               _.defer(_.bind(self.loadCNetSnippet, self));

            })

            // Sync item with NS
            this.once("afterViewRender", this.syncItemModelWithNs, this);
            return ret;
         }),

         /**
          * @method showContent
          * @desc Override the showContent method to not add the item as a history
          */
         showContent: function showContent() {
            var self = this;

            return BackboneView.prototype.showContent.apply(this, arguments).done(function () {
               Tracker.getInstance().trackProductView(self.model);

               self.$('[data-action="pushable"]').scPush();
            });
         },

         /**
          * @method updateURL
          * @desc Override the updateURL method to not remove the query parameters
          * This will fix the navigation issue when the user go back and forward
          */
         updateURL: function updateURL() {
            // Backbone.history.navigate(this.model.generateURL(), { replace: true });
         },

         beforeShowContent: function () {
            
            
            // if there are any options in the URL
            var options = null;
            if (Backbone.history.fragment.indexOf('product/') !== 0) {

               // This decode is done because when a PDP is reached from a secure domain it is encoded so NetSuite preserve all the parameters when made
               // the redirect.
               var url = decodeURIComponent(this.arguments[0]);

               if (~url.indexOf('?')) {
                  options = Utils.parseUrlOptions(url);
                  url = url.split('?')[0];
               }
               // Now go grab the data and show it
               if (options) {
                  return this.productDetailsCNet({ url: url }, options);
               }
               return this.productDetailsCNet({ url: url });
            }
            var id = this.arguments[0];
            options = this.arguments[1];


            return this.productDetailsCNet({ id: id }, Utils.parseUrlOptions(options));
         },

         productDetailsCNet: function (api_query, options) {

            if (!options){
               var url = decodeURIComponent(this.arguments[0]);
               return this.productDetails({ url: url });
            }
            // ------------------------
            // EASY ASK URL PARAMETERS
            // ------------------------
            var internalid = api_query.id;
            var mpn = options && options.mpn && options.mpn.replace(/__/g, '#').replace(/_/,"/");
            var cat = options && options.cat;
            var weight = options && options.weight;
            var price = options && options.price;
            var displayname = options && options.name;
            var manufacturer = options && options.manufacturer;
            var e = options && options.e;

            var product = this.model;
            var promise = jQuery.Deferred();
            var self = this;
            var item = new ItemModel();

            
            // ------------------------------------------------
            // Setting required info to include CNET snippet
            // ------------------------------------------------
            item.set("internalid", internalid);
            item.set("itemid", internalid);
            item.set("pn", internalid);
            item.set("manufacturer", manufacturer);
            if(displayname) {
               item.set('displayname', displayname)
            }

            item.set("mpn", mpn);

            item.set("cat", cat);
            item.set("weight", weight);
            item.set("e", e);


            item.set("onlinecustomerprice_detail", {
               "onlinecustomerprice_formatted": "$" + price,
               "onlinecustomerprice": price
            });


            // ------------------------------------------------
            // Setting fields for standard behavior without OOS
            // ------------------------------------------------
            item.set("noLongerAvailable", false);
            item.set("showoutofstockmessage", false);
            item.set("ispurchasable", true);
            item.set("isbackorderable", true);
            product.set("item", item);
            product.set("quantity", 1);


            self.bindModel();
            promise.resolve();
            return promise;

         }

      });
   });
