define(
    'MyAccount.EasyAsk.ItemSearcher.View',
    [
        'ItemsSearcher.View',
        'ItemsSearcher.Utils',
        'MyAccount.EasyAsk.Facets.Helper',
        'ItemsSearcher.Collection',
        'EasyAskSearch.Model',
        'underscore',
        'Utils',
        'jQuery'
    ],
    function(
        ItemsSearcherView,
        ItemsSearcherUtils,
        MyAccountEasyAskFacetsHelper,
        ItemsSearcherCollection,
        EasyAskSearchModel,
        _,
        Utils,
        jQuery
    ) {
        'use strict';


        _.extend(ItemsSearcherView.prototype, {

            loadSuggestionItemsSource: function loadSuggestionItemsSource(query, callback) {

                //console.log('loadSuggestionItemsSource query before' + query);

                var query = query.replace(/[^a-zA-Z0-9 ]/g, "");

                //console.log('query after stripping special charachters' + query);
                
                var self = this;
        
                self.options.ajaxDone = false;
                self.options.results = {};
                self.options.query = ItemsSearcherUtils.formatKeywords(query);
                // self.collection.reset(undefined, {silent:true});
                this.collection = new this.options.collection([], this.options.collectionOptions);
        
                // if the character length from the query is over the min length
                if (self.options.query.length >= self.options.minLength) {
                    self.options.labels = ['see-all-' + self.options.query];
                    callback(self.options.labels);
        
                    self.$searchElement.data('ttTypeahead').dropdown.moveCursorDown();
                }

                if(self.options.componentId && self.options.componentId === 'quickaddSearch'){
                // when it comes from the quickAdd use the native behaviour from NetSuite
                    // silent = true makes it invisible to any listener that is waiting for the data to load
                    // We can use jQuery's .done, as the fetch method returns a promise
                    // http://api.jquery.com/deferred.done/
                    self.collection
                        .fetch(
                            {
                                data: {
                                    q: jQuery.trim(self.options.query),
                                    sort: self.options.sort,
                                    limit: self.options.limit,
                                    offset: 0
                                },
                                killerId: _.uniqueId('ajax_killer_')
                            },
                            {
                                silent: true
                            }
                        )
                        .done(function() {
                            self.collection =
                                self.postItemsSuggestionObtained.executeAll(self.collection, self.options) ||
                                self.collection;

                            //console.log(' ');
                            //console.log('MyAccount  self.collection quick search');
                            //console.log(self.collection);
                            //console.log(' ');

                            self.options.ajaxDone = true;
                            self.options.labels = self.options.showSeeAll
                                ? ['see-all-' + self.options.query].concat(self.getItemIds(self.collection))
                                : self.getItemIds(self.collection);
                            // self.options.labels = self.options.showSeeAll ? ['see-all-' + self.options.query].concat(self.collection.pluck('_id')) : self.collection.pluck('_id');

                            if (!self.options.labels.length) {
                                self.options.labels = ['see-all-' + self.options.query];
                            }

                            callback(self.options.labels);

                            self.selectFirstIfRequire();
                        });

                } else { // use custom easyask logic

                    this.easyAskModel = new EasyAskSearchModel();

                    this.easyAskModel.fetch(
                        {
                            data: {
                                q : jQuery.trim(self.options.query)
                            },
                        }
                    ).done(function(){
    
                        var products = MyAccountEasyAskFacetsHelper.getProductsOnNsFormatting(self.easyAskModel);
                        // remove elements
                        products = products.slice(0, 4);
                        
                        self.collection = new ItemsSearcherCollection(products)
                        self.collection = self.postItemsSuggestionObtained.executeAll(self.collection, self.options) ||
                                self.collection;

                            //console.log(' ');
                            //console.log('MyAccount  self.collection custom search');
                            //console.log(self.collection);
                            //console.log(' ');

                            //var repair_url = self.collection;

                            function stockMessage(stock_availability){

                                if(stock_availability === 0){

                                    return 'Out of Stock';
                                    
                                } else if(stock_availability <= 10){

                                    return 'Limited Quantities Available';
                                    
                                } else if(stock_availability > 10){

                                    return 'In Stock';

                                } else {

                                    return 'Out of Stock';

                                }

                            }
                            
                            self.collection.forEach(function(model, index) {
                               console.log(model); 
                               console.log(model.get('_url'));
                               console.log(model.get('itemid'));




                            var stock_availability = model.get('total_quantity');
                            var stock_message = stockMessage(stock_availability);

                            var new_url = '/product/';
                                new_url += model.get('itemid').replace(/#/g, '__');
                                new_url += '?quantity=1';
                                new_url += '&mpn=' + model.get('mpn').replace(/#/g, '__'); 
                                //.replace(/\//, ___);
                                new_url += '&cat=' + model.get('cat'); 
                                new_url += '&weight=' + model.get('weight');
                                new_url += '&name=' + encodeURI(model.get('_name'));

                                new_url += '&cnetcategoryid=' + model.get('cnet_category_id');
                                new_url += '&nscategoryid=' + model.get('ns_category_id');
                                new_url += '&pricinggroupid=' + model.get('pricing_group_id');

                                new_url += '&stockmessage=' + encodeURI(stock_message);
                                new_url += '&manufacturer=' + encodeURI(model.get('manufacturer'));

                                //console.log('new_url' + new_url);
                                //model.set('_url' : new_url):
                                //self.collection.set(model._url)
                                model.set('_url', new_url);
                            });
                            
            
                            self.options.ajaxDone = true;
                            self.options.labels = self.options.showSeeAll
                                ? ['see-all-' + self.options.query].concat(self.getItemIds(self.collection))
                                : self.getItemIds(self.collection);
                            // self.options.labels = self.options.showSeeAll ? ['see-all-' + self.options.query].concat(self.collection.pluck('_id')) : self.collection.pluck('_id');
            
                            if (!self.options.labels.length) {
                                self.options.labels = ['see-all-' + self.options.query];
                            }
                            //console.log(self.options.labels)
                            callback(self.options.labels);
            
                            self.selectFirstIfRequire();
                        
                    })
                }

            },
            events: {
                'focusout [data-type="search-input"]': 'removeSearchResults',
            },

            removeSearchResults: function(e) {
                var spanElement = jQuery('.tt-suggestions');
                spanElement.css('display', 'none');
        
            }
       });     
    });
