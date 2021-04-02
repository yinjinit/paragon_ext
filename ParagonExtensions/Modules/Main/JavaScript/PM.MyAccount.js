define('PM.MyAccount', [
  'PM.OrderHistory.Details.View',
  'underscore'
], function(
  PMOrderHistoryDetailsView,
  _
) {
  'use strict';

  return {
    mountToApp: function() {
      PMOrderHistoryDetailsView.loadModule();
    }
  };
});
