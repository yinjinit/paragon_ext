define('PM.AdvancedReports', [
  'PM.AdvancedReports.View',
  'PM.AdvancedReports.Details.View'
], function(
  AdvancedReportsView,
  AdvancedReportsDetailsView
) {
  'use strict';

  return {
    mountToApp: function mountToApp(container) {
      var pageType = container.getComponent('PageType');

      pageType.registerPageType({
        name: 'viewalllist',
        routes: ['/reports'],
        view: AdvancedReportsView,
        defaultTemplate: {
          name: 'reports_list.tpl',
          displayName: 'View All',
          thumbnail: null
        }
      });

      pageType.registerPageType({
        name: 'pubreport',
        routes: ['pubreport/:id/:name'],
        view: AdvancedReportsDetailsView,
        defaultTemplate: {
          name: 'reports_details.tpl',
          displayName: 'Reports',
          thumbnail: null
        }
      });
    }
  };
});

