define('PM.MyAccount', [
  'PM.AjaxRequestKiller',
  'PM.OrderHistory.Details.View',
  'PM.OrderHistory.Summary.View',
  'PM.Address.Edit.View',
  'PM.Employee',
  'underscore'
], function(
  PMAjaxRequestKiller,
  PMOrderHistoryDetailsView,
  PMOrderHistorySummaryView,
  PMAddressEditView,
  PMEmployee,
  _
) {
  'use strict';

  return {
    mountToApp: function(application) {
      PMOrderHistoryDetailsView.loadModule();
      PMOrderHistorySummaryView.loadModule();
      PMAddressEditView.loadModule();
      PMEmployee.loadModule(application);
      PMAjaxRequestKiller.loadModule(application);
    }
  };
});
