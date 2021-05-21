// @module PM.Employee
define('PM.ShipCarrier', [
  'PM.ShipCarrier.View'
], function(
  ShipCarrierView
) {
  'use strict';

  return {
    mountToApp: function(application) {

      const pageType = application.getComponent('PageType');

      pageType.registerPageType({
        name: 'shipcarrier',
        routes: ['shipcarrier'],
        view: ShipCarrierView,
        defaultTemplate: {
          name: 'pm_shipcarrier.tpl',
          displayName: 'Manage your ship carrier account',
          thumbnail: null
        }
      });

    }
  };
});
