// @module PM.Search.Transaction.Model
define('PM.Search.Transaction.Model', [
  'Transaction.Model',
  'Utils',
  'underscore'
], function(
  TransactionModel,
  Utils,
  _
) {
  'use strict';

  // @class PM.Search.Transaction.Model @extend Transaction.Model
  return TransactionModel.extend({
    urlRoot: _.getAbsoluteUrl(
      getExtensionAssetsPath('services/PM.Search.Transaction.Service.ss')),
    // @property {Boolean} cacheSupport enable or disable the support for cache (Backbone.CachedModel)
    cacheSupport: true,
    // @method getTypeLabel @return {String}
    getTypeLabel: function() {
      let type;

      const recordtype = this.get('recordtype');
      if (recordtype === 'salesorder') {
        type = Utils.translate('Sales Order');
      } else if (recordtype === 'estimate') {
        type = Utils.translate('Quote');
      } else if (recordtype === 'invoice') {
        type = Utils.translate('Invoice');
      } else if (recordtype === 'cashsale') {
        type = Utils.translate('Credit Card Invoice');
      }

      return type;
    },

    // @method getTypeUrl @return {String}
    getTypeUrl: function() {
      const type = this.get('recordtype');
      let record_root_url;

      if (type === 'estimate') {
        record_root_url = 'search_transaction/quotes';
      } else if (type === 'salesorder') {
        record_root_url = 'search_transaction/purchases/view/' + type;
      } else if (type === 'invoice') {
        record_root_url = 'search_transaction/invoices';
      } else if (type === 'cashsale') {
        record_root_url = 'search_transaction/receipts/view';
      }

      return record_root_url + '/' + this.get('internalid');
    }
  });
});
