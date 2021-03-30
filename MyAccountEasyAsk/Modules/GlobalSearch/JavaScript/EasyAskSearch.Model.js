define('EasyAskSearch.Model',[
    'Backbone.CachedModel',
    'underscore'
], function(BackboneCachedModel, _) {
    'use strict';
    

    var original_fetch = BackboneCachedModel.prototype.fetch;
    
    /**
     * 
     */
    return BackboneCachedModel.extend({
        url : _.getAbsoluteUrl(getExtensionAssetsPath('services/GlobalSearch.Service.ss')),

        // ------------------------------------------------------------------------------
        // Getters & Setters
        // ------------------------------------------------------------------------------
        getPaginationData : function(){
            return this.get('data') && this.get('data').source && this.get('data').source.products && this.get('data').source.products.itemDescription;
        },

        getProducts : function() {
            return this.get('data') && this.get('data').source && this.get('data').source.products && this.get('data').source.products.items;
        },

        getFacets : function(){
            return this.get('data') && this.get('data').source && this.get('data').source.attributes && this.get('data').source.attributes.attribute;
        },

        getQuery : function() {
            return this.get('data') && this.get('data').source && this.get('data').source.originalQuestion;
            
        },
        getTotal : function(){
            return this.get('data') && this.get('data').source && this.get('data').source.products && this.get('data').source.products.itemDescription && this.get('data').source.products.itemDescription.totalItems
        }

        // @method fetch overrides fetch so we make sure that the cache is set to true, so we wrap it
	,	fetch: function (options)
        {
            options = _.extend(options || {}, this.options);

            options.cache = true;

            return original_fetch.apply(this, arguments);
        }
        // ------------------------------------------------------------------------------
    });
});