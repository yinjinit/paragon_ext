define('PM.MyAccount', [
  'PM.OrderHistory.Details.View',
  'PM.OrderHistory.Summary.View',
  'PM.Address.Edit.View',
  'PM.Address.Details.View',
  'underscore'
], function(
  OrderHistoryDetailsView,
  OrderHistorySummaryView,
  AddressEditView,
  AddressDetailsView,
  _
) {
  'use strict';

  return {
    mountToApp: function(application) {
      OrderHistoryDetailsView.loadModule();
      OrderHistorySummaryView.loadModule();
      AddressEditView.loadModule();
      AddressDetailsView.loadModule();
    }
  };
});
