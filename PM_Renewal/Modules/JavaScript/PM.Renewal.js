define('PM.Renewal', [
  'PM.Renewal.Add.View',
  'PM.Renewal.Details.View',
  'PM.Renewal.Edit.View',
  'PM.Renewal.List.View'
], function(
  RenewalAddView,
  RenewalDetailsView,
  RenewalEditView,
  RenewalListView
) {
  'use strict';

  return {
    mountToApp: function mountToApp(container) {
      var pageType = container.getComponent('PageType');

      pageType.registerPageType({
        name: 'renewals',
        routes: ['/reminders'],
        view: RenewalListView,
        defaultTemplate: {
          name: 'renewal_list.tpl',
          displayName: 'Renewal Reminders',
          thumbnail: null
        }
      });

      pageType.registerPageType({
        name: 'addreminder',
        routes: ['/addreminder'],
        view: RenewalAddView,
        defaultTemplate: {
          name: 'renewal_new.tpl',
          displayName: 'New Renewal Reminder',
          thumbnail: null
        }
      });

      pageType.registerPageType({
        name: 'editreminder',
        routes: ['/editreminder/:id'],
        view: RenewalEditView,
        defaultTemplate: {
          name: 'renewal_edit.tpl',
          displayName: 'Edit Renewal Reminder',
          thumbnail: null
        }
      });

      pageType.registerPageType({
        name: 'showreminder',
        routes: ['/showreminder/:id'],
        view: RenewalDetailsView,
        defaultTemplate: {
          name: 'renewal_details.tpl',
          displayName: 'Renewal Details',
          thumbnail: null
        }
      });
    }
  };
});
