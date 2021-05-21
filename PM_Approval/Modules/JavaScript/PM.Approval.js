// @module PM.Approval
define('PM.Approval', [
  'PM.Approval.List.View'
], function(
  ApprovalListView
) {
  'use strict';

  return {
    mountToApp: function(application) {
      const pageType = application.getComponent('PageType');

      pageType.registerPageType({
        name: 'approvals',
        routes: ['approvals'],
        view: ApprovalListView,
        defaultTemplate: {
          name: 'approval_list.tpl',
          displayName: 'Approval List',
          thumbnail: null
        }
      });
    }
  };
});
