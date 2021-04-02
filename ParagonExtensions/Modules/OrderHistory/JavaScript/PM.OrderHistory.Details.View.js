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
      _.extend(OrderHistoryDetailsView.prototype, {
        //@property {Function} template
        template: pm_order_history_details_tpl,
      });
    }
  };
});
