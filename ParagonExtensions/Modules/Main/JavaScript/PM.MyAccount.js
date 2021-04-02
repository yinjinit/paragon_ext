define('PM.MyAccount', [
  'PM.OrderHistory.Details.View',
  'PM.OrderHistory.Summary.View',
  'PM.Address.Edit.View',
  'underscore'
], function(
  PMOrderHistoryDetailsView,
  PMOrderHistorySummaryView,
  PMAddressEditView,
  _
) {
  'use strict';

  return {
    mountToApp: function() {
      PMOrderHistoryDetailsView.loadModule();
      PMOrderHistorySummaryView.loadModule();
      PMAddressEditView.loadModule();
    }
  };
});
