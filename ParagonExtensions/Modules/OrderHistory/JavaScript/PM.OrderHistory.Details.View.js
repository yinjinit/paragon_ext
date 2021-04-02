// @module PM.OrderHistory.Details.View
define('PM.OrderHistory.Details.View', [
  'OrderHistory.Details.View',
  'pm_order_history_details.tpl',
  'underscore'
], function(
  OrderHistoryDetailsView,
  pm_order_history_details_tpl,
  _
) {
  'use strict';

  return {
    loadModule: function loadModule() {
      console.log('order history details view came in');
      _.extend(OrderHistoryDetailsView.prototype, {
        //@property {Function} template
        template: pm_order_history_details_tpl,
        //@method getContext
        //@returns {PM.OrderHistory.Details.View.Context}
        getContext: _.wrap(OrderHistoryDetailsView.prototype.getContext,
          function(fn) {
            var context = fn.apply(this, _.toArray(arguments).slice(1));

            return context;
          })
      });
    }
  };
});
