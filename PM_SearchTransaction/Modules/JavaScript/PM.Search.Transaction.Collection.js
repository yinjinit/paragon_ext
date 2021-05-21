// @module PM.Search.Transaction.Collection
define('PM.Search.Transaction.Collection', [
  'PM.Search.Transaction.Model',
  'Transaction.Collection',
  'Backbone',
  'underscore'
], function(
  Model,
  TransactionCollection,
  Backbone,
  _
) {
  'use strict';

  // @class PM.Search.Transaction.Collection @extend Backbone.Collection
  return TransactionCollection.extend({
    // @property {PM.Search.Transaction.Model}
    model: Model,

    // @property {Boolean} cacheSupport enable or disable the support for cache (Backbone.CachedModel)
    cacheSupport: false,

    // @property {string} url
    url: _.getAbsoluteUrl(
      getExtensionAssetsPath('services/PM.Search.Transaction.Service.ss')),

    // @method update | this method comes from Transaction.Collection
    // We need to make changes on it in order to include extra filters: keyword, transaction name
    // @param {Transaction.Collection.UpdateOptions} options
    // @return {Void}
    update: function(options) {
      // @class Transaction.Collection.UpdateOptions
      // @property {DateRange?} range
      const range = options.range || {};

      this.fetch({
        data: {
          // @property {value:String?} filter
          filter: options.filter && options.filter.value,
          // @property {value:String?} sort
          sort: options.sort.value,
          // @property {String?} order
          order: options.order,
          from: range.from,
          to: range.to,
          // @property {String?} page
          page: options.page,
          // @property {String} keyword
          keyword: options.keyword
        },
        reset: true,
        // @property {String?} killerId
        killerId: options.killerId
      });
    }
  });
});
