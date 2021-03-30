define(
    'PLP.EasyAsk.ItemSearcher.View',
    [
        'ItemsSearcher.View',
        'ItemsSearcher.Utils',
        'PLP.EasyAsk.Facets.Helper',
        'ItemsSearcher.Collection',
        'EasyAskSearch.Model',
        'underscore',
        'Utils',
        'jQuery'
    ],
    function(
        ItemsSearcherView,
        ItemsSearcherUtils,
        PLPEasyAskFacetsHelper,
        ItemsSearcherCollection,
        EasyAskSearchModel,
        _,
        Utils,
        jQuery

    ) {
        'use strict';


        _.extend(ItemsSearcherView.prototype, {

            loadSuggestionItemsSource: function loadSuggestionItemsSource(query, callback) {
                
                var self = this;

                var query = query.replace(/[^a-zA-Z0-9 ]/g, "");
        
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

                if(self.options.componentId && self.options.componentId == 'quickaddSearch'){ // when it comes from the quickAdd use the native behaviour from NetSuite
                    
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
    
                        var products = PLPEasyAskFacetsHelper.getProductsOnNsFormatting(self.easyAskModel);
                        // remove elements
                        products = products.slice(0, 4);
                        
                        self.collection = new ItemsSearcherCollection(products)
                        self.collection = self.postItemsSuggestionObtained.executeAll(self.collection, self.options) ||
                                self.collection;
                            
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
                        
                    })
                }

            },
            events: {
                'focusout [data-type="search-input"]': 'removeSearchResults',
                'click .site-search-button-submit': 'searchButtonSearchSend', 
                //'tap .site-search-button-submit': 'searchButtonSearchSend',
                'keypress .itemssearcher-input.typeahead.tt-input': 'itemssearcherSearchSend',
            },

            removeSearchResults: function(e) {
                var spanElement = jQuery('.tt-suggestions');
                spanElement.css('display', 'none');
        
            },


            searchButtonSearchSend: function(e) {
                //console.log('searchButtonSearchSend');
                e.preventDefault();
                e.stopPropagation();
                setTimeout(function(){
                    var pre_input = jQuery('[data-view="ItemsSeacher"] .twitter-typeahead pre').html();

                    if(pre_input){
                        var keyword = pre_input.replace(/[^a-zA-Z0-9 ]/g, "");
                        window.location.replace('/search?keywords='+ keyword);
                    }
                }, 500);
        
            },

            itemssearcherSearchSend: function(e) {
                //console.log('itemssearcherSearchSend');
                e.preventDefault();
                e.stopPropagation();
                setTimeout(function(){
                    var pre_input = jQuery('[data-view="ItemsSeacher"] .twitter-typeahead pre').html();
                     
                    if(e.which == 13) {
                        var keyword = pre_input.replace(/[^a-zA-Z0-9 ]/g, "");
                        if(pre_input){
                            window.location.replace('/search?keywords='+ keyword);
                        }

                    }
                }, 500);
        
            },     
        
        });
    });
