// @module PM.OrderHistory.Summary.View
define('PM.OrderHistory.Summary.View', [
  'OrderHistory.Summary.View',
  'pm_order_history_summary.tpl',
  'underscore'
], function(
  OrderHistorySummaryView,
  pm_order_history_summary_tpl,
  _
) {
  'use strict';

  return {
    loadModule: function loadModule() {
      _.extend(OrderHistorySummaryView.prototype, {
        //@property {Function} template
        template: pm_order_history_summary_tpl,
        //@method getContext
        //@returns {PM.OrderHistory.Summary.View.Context}
        getContext: _.wrap(OrderHistorySummaryView.prototype.getContext,
          function(fn) {
            var context = fn.apply(this, _.toArray(arguments).slice(1)),
              purchaseNumber = this.model.get('purchasenumber'),
              options = this.model.get('options');

            if (purchaseNumber) {
              context.purchaseNumber = purchaseNumber;
            }

            if (options.custbody_transaction_name) {
              context.orderName = options.custbody_transaction_name;
            }

            if (options.custbody_web_notes) {
              context.webNotes = options.custbody_web_notes;
            }

            if (options.custbody_cost_center) {
              context.costCenter = options.custbody_cost_center;
            }
            return context;
          })
      });
    }
  };
});
