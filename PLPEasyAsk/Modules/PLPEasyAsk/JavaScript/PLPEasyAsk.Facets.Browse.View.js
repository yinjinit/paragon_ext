define(
    'PLPEasyAsk.Facets.Browse.View',
    [
        'Facets.Browse.View',
        'PLP.EasyAsk.Facets.Helper',
        'Backbone',
        'Profile.Model',
        'EasyAskSearch.Model',
        'AjaxRequestsKiller',
        'Categories.Model',
        
        'underscore',
        'Utils',
        'jQuery'
    ],
    function(
        FacetsBrowseView,
        PLPEasyAskFacetsHelper,
        Backbone,
        ProfileModel,
        EasyAskSearchModel,
        AjaxRequestsKiller,
        CategoriesModel,
        
        _,
        Utils,
        jQuery

    ) {
        'use strict';



        _.extend(FacetsBrowseView.prototype, {

            
           initialize: _.wrap(FacetsBrowseView.prototype.initialize, function (fn) {
               
            var ret = fn.apply(this, _.toArray(arguments).slice(1));
            
            var fullurl = Backbone.history.fragment;
            //console.log(fullurl);

            
            this.translator = PLPEasyAskFacetsHelper.parseUrl(
                fullurl,
                this.translatorConfig,
                this.isCategoryPage
            );


            
            this.setOptionsTranslator();


            if (this.isCategoryPage) {
                

                var categoryModel = new CategoriesModel();
                
                    categoryModel.options = {
                        data: { fullurl: this.translator.getCategoryUrl() },
                        killerId: AjaxRequestsKiller.getKillerId()
                    };

                    this.model.set('category', categoryModel);

            }

            return ret;
           }),

            beforeShowContent: function () {

                var promise = jQuery.Deferred();

                // if prices aren't to be shown we take out price related facet
                // and clean up the url
                if (ProfileModel.getInstance().hidePrices()) {
                    this.translator = this.translator.cloneWithoutFacetId('onlinecustomerprice');
                }

                var self = this;
                var models = []; // Remove call to items api since we are pulling the list of itesm from easy ask.
                var categoryModel = this.model.get('category');

                
                if (categoryModel) {
                    models.push(categoryModel);
                }
                
                // ------------------------------------------------------------------------------
                // Easys ASK
                // ------------------------------------------------------------------------------
                // Removing default facets on request
                self.model.set("facets",[]);

                this.easyAskModel = new EasyAskSearchModel();
                
                this.easyAskModel.options = {
                    data: PLPEasyAskFacetsHelper.getEasyAskApiParams(this.translator),
                    killerId: AjaxRequestsKiller.getKillerId(),
                    pageGeneratorPreload: true
                };
                
                // Filters and/or query
                // var easyAskFilters = PLPEasyAskFacetsHelper.getEasyAskFilters(this.translator);

                // Set the filters in the easy ask model
                // this.easyAskModel.setFilters(easyAskFilters)
                models.push(this.easyAskModel);

                jQuery.when
                    .apply(null, _.invoke(models, 'fetch', {}))
                    .then(function(facetResponse) {
                        facetResponse = categoryModel ? facetResponse[0] : facetResponse;
                        
                        if (facetResponse.corrections && facetResponse.corrections.length > 0) {
                            var unaliased_url = self.router.unaliasUrl(null, facetResponse.corrections);
                            promise.reject();

                            if (SC.ENVIRONMENT.jsEnvironment === 'server') {
                                nsglobal.statusCode = 301;
                                nsglobal.location = '/' + unaliased_url;
                            } else {
                                Backbone.history.navigate('#' + unaliased_url, { trigger: true });
                            }
                        } else {
                            
                            // Translate Products
                            PLPEasyAskFacetsHelper.translateProductsToNsItems(self.easyAskModel,self.model);
                            
                            // Add Urls
                            PLPEasyAskFacetsHelper.addUrlsToRouter(self.easyAskModel,self.translator,self.model,self.application)

                            // Set new facets on configuration
                            PLPEasyAskFacetsHelper.setFacetsInConfiguration(self.easyAskModel,self.translator,self.application)
                            
                            promise.resolve();
                        }
                    })
                    .fail(function(jqXhr) {
                        promise.reject();

                        if (jqXhr.status + '' === '404') {
                            self.application.getLayout().notFound();
                        }
                    });

                return promise;
            },


            getContext : _.wrap(FacetsBrowseView.prototype.getContext, function(fn) {

                var context = fn.call(this, _.toArray(arguments).slice(1));

                function formatNumber(num) {
                    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                }

                context.total = formatNumber(context.total);

                //console.log('Facets browser view context');
                //console.log(context);
                

                var brand_category_arr = [];
                var brand_category = this.easyAskModel.attributes.data.source.categories.categoryList;

                /*   
                console.log(' ');
                console.log(' ');
                console.log('easyAskModel');
                console.log(this.easyAskModel);
                console.log(' ');
                console.log(' ');
                
                
                console.log(' ');
                console.log(' ');
                console.log('brand_category');
                console.log(brand_category);
                console.log(' ');
                console.log(' ');
                */
                
                


                if(brand_category != undefined){

                    for (var i = 0; i < brand_category.length; i++) {
                        //remove replace for prod
                        //var brand_cat_name = brand_category[i].name.replace(/[^a-zA-Z0-9 ]/g, "").replace("  ", " ");
                        //prod
                        var brand_cat_name = brand_category[i].name;
                        //console.log(brand_category[i].name.replace(/[^a-zA-Z0-9 ]/g, "").replace("  ", " "));
                        brand_category_arr.push(brand_cat_name);

                    }
                }

                //console.log(brand_category_arr);

            //Deon Doughty - 08-28-202 - added this to check on brand images.
            function checkBrandUrlToHideCategory(){

                //console.log(brand_category_arr);
                //var pathname = window.location.pathname;
                 //console.log('checkBrandUrlToHideCategory called');
                 //Deon Doughty - 09-01-2020 - If Brand id is set from home page or anything othe pages that is not set from the category page it errors and does not load the brand. This fixes the issue.
                 var brand_check = jQuery('[itemprop="name"]').attr('content');
                 if(brand_check){
                    var redirect_check = brand_check.search('Brand');
                 } else {
                    var redirect_check = '';
                 }

                 var url = window.location.href; 
                 //console.log(url);
                 var brand_flag = url.search('Brand');
                 //console.log('brand_flag' + brand_flag);
                   //redirect_check = "";
                 if(redirect_check == -1 && brand_flag != -1 && brand_category != undefined){
                    //location.reload();
                    console.log('inside redirect');
                     //setTimeout(function(){
                    Backbone.history.loadUrl();
                    //location.reload();
                    //}, 1000);
                    
                    return false;

                 } else if(brand_flag != -1){
                    //console.log(url);

                    var url_parse = url.split('Brand='); 
                    //console.log(url_parse[1]);
                    var brand = '?Brand=' + url_parse[1];

                    var facets_category_title = jQuery('.facets-faceted-navigation-item-category-title').html();
                    if(facets_category_title){
                       facets_category_title.trim();
                    }
                    //console.log(facets_category_title);

                    var facets_main_category_title = jQuery('.facets-browse-category-heading-main-description h1').html().trim();
                    //console.log(facets_main_category_title);
                    //Sets major and minors based on Primary Item titles
                    if(facets_main_category_title == 'Products' && brand_category != undefined){
                        localStorage.setItem("major", JSON.stringify({brand_category_arr}));

                    } else if(facets_main_category_title != 'Products' && brand_category != undefined){

                        localStorage.setItem("minor", JSON.stringify({brand_category_arr}));

                    }

                    if(facets_category_title == 'Products'){
                        var x = JSON.parse(localStorage.getItem("major"));
                        //console.log('facets_category_title Products x: ');
                        //console.log(x);

                    } else if(facets_category_title != 'Products'){
                        var x = JSON.parse(localStorage.getItem("minor"));
                        //console.log('facets_category_title Not Products x: ');
                        //console.log(x);
                    }

                    /*  
                    console.log(' ');
                    console.log(' ');

                    console.log('x localStorage Test');
                    console.log(x.brand_category_arr);

                    console.log(' ');
                    console.log(' ');
                    */

                    if(jQuery('.facets-facet-browse-category').is(":visible") == true){
                        jQuery(".facets-category-cell").each(function( index ) {
                        var thumbnail_url = jQuery('.facets-category-cell-thumbnail a',this).attr('href');
                        var cell_title_url = jQuery('.facets-category-cell-title a',this).attr('href');
                        var category_text = jQuery('.facets-category-cell-title a',this).html().trim();

                        //Deon Doughty - fixes broken  brand categories
                        if(thumbnail_url.search('notebooks') != -1 && thumbnail_url.search('notebooks/notebooks') == -1 && thumbnail_url.search('notebooks/tablets-tablet-pcs') == -1){
                            thumbnail_url = thumbnail_url + '/notebooks';
                            cell_title_url = cell_title_url + '/notebooks';
                        }

                        if(thumbnail_url.search('memory') != -1 && thumbnail_url.search('flash-memory') == -1){
                            thumbnail_url = thumbnail_url + '/device-memory';
                            cell_title_url = cell_title_url + '/device-memory';
                        }

                        category_text = category_text.replace('&amp;', '&');
                        //console.log(category_text);
                        var n = brand_category_arr.includes(category_text);

                        //console.log(category_text + ': ' + n);

                        //console.log(brand_category_arr.includes(category_text));
                        if(n == true){
                        jQuery('.facets-category-cell-thumbnail a',this).attr('href', thumbnail_url +'' +brand);
                        jQuery('.facets-category-cell-title a',this).attr('href', cell_title_url +''+ brand);
                        } else if(n == false && brand_category_arr.length > -1){

                            jQuery(this).remove();

                        }

                          //console.log( index + ": " + jQuery('.facets-category-cell-thumbnail a',this).attr('href') );
                          //console.log( index + ": " + jQuery('.facets-category-cell-title a',this).attr('href') );
                        });
                    }

                    jQuery("a.facets-faceted-navigation-item-category-facet-option").each(function( index ) {
                        var category_facet_url = jQuery(this).attr('href');
                        var category_text = jQuery(this).html().trim();

                        if(category_facet_url.search('notebooks') != -1 && category_facet_url.search('notebooks/notebooks') == -1 && category_facet_url.search('notebooks/tablets-tablet-pcs') == -1) {
                            category_facet_url = category_facet_url + '/notebooks';
                        }

                        if(category_facet_url.search('memory') != -1 && category_facet_url.search('flash-memory') == -1) {
                            category_facet_url = category_facet_url + '/device-memory';
                        }

                        //https://beta.paragonmicro.com/products/notebooks/tablets-tablet-pcs/notebooks?Brand=Lenovo
                        //console.log(category_text);
                        //console.log('facet');

                        category_text = category_text.replace('&amp;', '&');

                        //console.log(brand_category_arr.includes(category_text));

                        var n = x.brand_category_arr.includes(category_text);

                        //console.log(category_text + ': ' + n);

                        var productsCheck = jQuery('.global-views-breadcrumb-item-active').html().trim();

                        if(category_facet_url.search('Brand') == -1 && n == true && productsCheck == 'Products'){
                        jQuery(this).attr('href', category_facet_url +''+brand);
                        //console.log( index + ": " + jQuery(this).attr('href') );
                        //&& facets_category_title != 'Products'
                        /*
                        } else if(n == false && brand_category_arr.length > -1){
                           jQuery(this).closest('li').remove();
                          */ 
                        } else {
                           jQuery(this).attr('href', category_facet_url +''+brand); 
                        }
                        
                        if(n == false && x.brand_category_arr.length > -1){
                           jQuery(this).closest('li').remove();
                       }
                    });

                    jQuery(".global-views-breadcrumb-item a").each(function( index ) {
                        if(jQuery(this).attr('href') !== '/'){
                            var category_facet_url = jQuery(this).attr('href');

                            if(category_facet_url.search('notebooks') != -1 && category_facet_url.search('notebooks/notebooks') == -1 && category_facet_url.search('notebooks/tablets-tablet-pcs') == -1) {
                                category_facet_url = category_facet_url + '/notebooks';
                            }

                            if(category_facet_url.search('memory') != -1) {
                                category_facet_url = category_facet_url + '/device-memory';
                            }
                            //memory/device-memory
                            jQuery(this).attr('href', category_facet_url +''+brand);
                        }
                        
                        
                    });
                 }



                 var url = window.location.href; 
                 //console.log(url);
                 var brand_flag = url.search('Brand');
                // console.log('brand_flag' + brand_flag);

                //Deon Doughty - Checks to collapse brand menu
                 if(brand_flag != -1){
                    var expaned = jQuery('a[title="Brand"]').closest('div').find('div').hasClass('in');
                    //console.log('expaned ' + expaned);
                        if(expaned == true){
                            jQuery('a[title="Brand"]').trigger('click').trigger('tap');
                        }
                    //jQuery('.facets-facet-browse-category').hide();
                        if(facets_main_category_title == "Products" && brand_category == undefined){
                            jQuery('.facets-faceted-navigation-item-category').hide();
                        }
                    //expands facet menu
                    jQuery('.facets-faceted-navigation-item-category-optionlist-extra-button').trigger('click').trigger('tap');
                    
                    } else {
                        //jQuery('.facets-facet-browse-category').show();
                    }
            }

            jQuery(document).ready(function(){
                
                var profile = ProfileModel.getInstance();

                if (profile.get("isLoggedIn") == "T"){

                    checkBrandUrlToHideCategory();

                } else {
                    checkBrandUrlToHideCategory();
                }
            });
               

                return context;
            })

        });
    });
