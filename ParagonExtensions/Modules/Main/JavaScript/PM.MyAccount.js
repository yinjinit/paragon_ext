define('PM.MyAccount', [
  'PM.OrderHistory.Details.View',
  'PM.OrderHistory.Summary.View',
  'underscore'
], function(
  PMOrderHistoryDetailsView,
  PMOrderHistorySummaryView,
  _
) {
  'use strict';

  return {
    mountToApp: function() {
      PMOrderHistoryDetailsView.loadModule();
      PMOrderHistorySummaryView.loadModule();
    }
  };
});
