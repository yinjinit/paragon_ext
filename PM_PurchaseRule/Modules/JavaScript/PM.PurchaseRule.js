// @module PM.PurchaseRule
define('PM.PurchaseRule', [
  'PM.PurchaseRule.List.View'
], function(
  PurchaseRuleListView
) {
  'use strict';

  return {
    mountToApp: function(application) {
      const pageType = application.getComponent('PageType');

      pageType.registerPageType({
        name: 'PurchaseRule',
        routes: ['purchase_rules'],
        view: PurchaseRuleListView,
        defaultTemplate: {
          name: 'purchaserule_list.tpl',
          displayName: 'Purchase Rule List',
          thumbnail: null
        }
      });
    }
  };
});
