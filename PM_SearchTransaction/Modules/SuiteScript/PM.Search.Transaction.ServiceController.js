// PM.Search.Transaction.ServiceController.js
// ----------------
// Service to manage search transactions requests
define('PM.Search.Transaction.ServiceController', [
  'ServiceController',
  'PM.Search.Transaction.Model'
], function(
  ServiceController,
  SearchTransactionModel
) {
  try {
    // @class PM.Search.Transaction.ServiceController Manage search transaction requests
    // @extend ServiceController
    return ServiceController.extend({
      // @property {String} name Mandatory for all ssp-libraries model
      name: 'PM.Search.Transaction.ServiceController',

      // @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
      // The values in this object are the validation needed for the current service.
      // Can have values for all the request methods ('common' values) and specific for each one.
      options: {
        common: {
          requireLogin: true
        }
      },

      // @method get The call to TransactionHistory.Service.ss with http method 'get' is managed by this function
      // @return {TransactionHistoryModel.list} A list featuring the transaction history
      get: function() {
        return SearchTransactionModel.list({
          filter: this.request.getParameter('filter'),
          order: this.request.getParameter('order'),
          sort: this.request.getParameter('sort'),
          from: this.request.getParameter('from'),
          to: this.request.getParameter('to'),
          page: this.request.getParameter('page') || 1,
          keyword: this.request.getParameter('keyword')
        });
      }

    });
  } catch (e) {
    console.warn('PM.Search.Transaction.Service.ss' + e.name, e);
    this.sendError(e);
  }
});
