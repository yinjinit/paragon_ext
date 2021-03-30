
define(
	'ParagonMicro.PM_Renewal.PMRenewal',
	[
		'ParagonMicro.PM_Renewal.PMRenewal.Add.View', 
		'ParagonMicro.PM_Renewal.PMRenewal.Details.View',
		'ParagonMicro.PM_Renewal.PMRenewal.Edit.View',
		'ParagonMicro.PM_Renewal.PMRenewal.List.View'
	]
,   function (
		PMRenewalAddView,
	    PMRenewalDetailsView,
	    PMRenewalEditView,
	    PMRenewalListView
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
			//console.log('PM_Renewal');

			var pageType = container.getComponent('PageType');

			pageType.registerPageType({
              name: 'renewals',
              routes: ['/reminders'],
              view: PMRenewalListView,
              defaultTemplate: {
              	name: 'renewal_list.tpl',
              	displayName: 'Renewal Reminders',
              	thumbnail: null
              }
			});


			pageType.registerPageType({
              name: 'addreminder',
              routes: ['/addreminder'],
              view: PMRenewalAddView,
              defaultTemplate: {
              	name: 'renewal_new.tpl',
              	displayName: 'New Renewal Reminder',
              	thumbnail: null
              }
			});

			pageType.registerPageType({
              name: 'editreminder',
              routes: ['/editreminder/:id'],
              view: PMRenewalEditView,
              defaultTemplate: {
              	name: 'renewal_edit.tpl',
              	displayName: 'Edit Renewal Reminder',
              	thumbnail: null
              }
			});

			pageType.registerPageType({
              name: 'showreminder',
              routes: ['/showreminder/:id'],
              view: PMRenewalDetailsView,
              defaultTemplate: {
              	name: 'renewal_details.tpl',
              	displayName: 'Renewal Details',
              	thumbnail: null
              }
			});
			

			var myaccountmenu = container.getComponent('MyAccountMenu');

			var renewalmenugroup = {
				id: 'renewals',
				name: 'Reminders',
				index: 8
			}

			var renewalviewall = {
				id: 'reminders',
				groupid:'renewals',
				name: 'Reminders',
				url: '/reminders',
				index: 1
			}

			var renewalviewadd = {
				id: 'addreminder',
				groupid:'renewals',
				name: 'New Reminder',
				url: '/addreminder',
				index: 2
			}

			myaccountmenu.addGroup(renewalmenugroup);
			myaccountmenu.addGroupEntry(renewalviewall);
			myaccountmenu.addGroupEntry(renewalviewadd);
			//myaccountmenu.addGroupEntry(renewalviewlist);
			/** @type {LayoutComponent} 
			var layout = container.getComponent('Layout');
			
			if(layout)
			{
				layout.addChildView('Header.Logo', function() { 
					return new PMRenewalView({ container: container });
				});
			}
           */
		}
	};
});
