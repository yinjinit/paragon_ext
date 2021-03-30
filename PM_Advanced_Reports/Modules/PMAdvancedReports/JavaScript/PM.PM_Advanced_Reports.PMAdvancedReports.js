
define(
	'PM.PM_Advanced_Reports.PMAdvancedReports'
,   [
	    'PMAdvancedReports.View',
		'PMAdvancedReports.Details.View'
	]
,   function (
		PMAdvancedReportsView,
		PMAdvancedReportsDetailsView
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			// using the 'Layout' component we add a new child view inside the 'Header' existing view 
			// (there will be a DOM element with the HTML attribute data-view="Header.Logo")
			// more documentation of the Extensibility API in
			// https://system.netsuite.com/help/helpcenter/en_US/APIs/SuiteCommerce/Extensibility/Frontend/index.html

			/** @type {LayoutComponent}  **/
			

			var pageType = container.getComponent('PageType');

			pageType.registerPageType({
              name: 'viewalllist',
              routes: ['/reports'],
              view: PMAdvancedReportsView,
              defaultTemplate: {
              	name: 'reports_list.tpl',
              	displayName: 'View All',
              	thumbnail: null
              }
			});



			console.log(PMAdvancedReportsDetailsView);
			pageType.registerPageType({
              name: 'pubreport',
              routes: ['pubreport/:id/:name'],
              view: PMAdvancedReportsDetailsView,
              defaultTemplate: {
              	name: 'reports_details.tpl',
              	displayName: 'Reports',
              	thumbnail: null
              }
			});
			

			var myaccountmenu = container.getComponent('MyAccountMenu');

			var reportsmenugroup = {
				id: 'reports',
				name: 'Advanced Reports',
				index: 8
			}

			var reportsviewall = {
				id: 'viewall',
				groupid:'reports',
				name: 'View All',
				url: '/reports',
			index: 1
			}



			myaccountmenu.addGroup(reportsmenugroup);
			myaccountmenu.addGroupEntry(reportsviewall);

			/** @type {LayoutComponent} 
			var layout = container.getComponent('Layout');

           */
		}
	};
});

