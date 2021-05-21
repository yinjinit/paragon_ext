// @module PM.Approval.List.View
define('PM.Approval.List.View', [
  'PM.Approval.Model',
  'PM.Approval.Details.View',
  'PM.Approval.Edit.View',
  'PM.Approval.Collection',
  'Backbone',
  'Backbone.CompositeView',
  'Backbone.CollectionView',
  'GlobalViews.Confirmation.View',
  'AjaxRequestsKiller',
  'jQuery',
  'Utils',
  'pm_approval_list.tpl'
], function(
  ApprovalModel,
  ApprovalDetailsView,
  ApprovalEditView,
  ApprovalCollection,
  Backbone,
  BackboneCompositeView,
  BackboneCollectionView,
  GlobalViewsConfirmationView,
  AjaxRequestsKiller,
  $,
  Utils,
  approval_list_tpl
) {
  'use strict';

  // @class PM.Approval.List.View @extend BackboneView
  return Backbone.View.extend({
    template: approval_list_tpl,

    title: Utils.translate('Purchase Authorization: Approvals'),

    events: {
      'click [data-action="approve-decline-sale"]': 'editOrderHandler'
    },

    initialize: function(options) {
      this.options = options;
      this.application = options.application;

      this.collection = new ApprovalCollection();
      BackboneCompositeView.add(this);

    },

    beforeShowContent: function beforeShowContent() {

      var role;

      if (SC.published && SC.published.cpas_role) {
        role = SC.published.cpas_role;
      } else {
        role = SC.getPublishedObject('cpas_role');
      }

      //setting the contact id
      var contactid;

      if (SC.published && SC.published.contact_id) {
        contactid = SC.published.contact_id;
      } else {
        contactid = SC.getPublishedObject('contact_id');
      }

      return this.collection.fetch({
        killerId: AjaxRequestsKiller.getKillerId(),
        data: {
          role: role[0],
          contactid: contactid[0]
        }
      });
    },

    // @method getSelectedMenu
    getSelectedMenu: function() {
      return 'approvals';
    },
    // @method getBreadcrumbPages
    getBreadcrumbPages: function() {
      return {
        text: Utils.translate('Approvals'),
        href: '/approvals'
      };
    },

    // @method editOrderHandler Approve/Decline Order
    editOrderHandler: function(e) {
      const order = this.getListFromDom($(e.target));
      this.approveDeclineOrder(order);
    },

    // @method getListFromDom Get the list (collection) from DOM @return {Approval.Model}
    getListFromDom: function($target) {
      const order_id = $target.closest('[data-approval-id]')
        .data('approval-id') + '';
      return this.collection.where({internalid: order_id})[0];
    },

    // @method approveDeclineOrder Edit list click handler (displays edit order modal view)
    // @param {Approval.Model} list
    approveDeclineOrder: function(order) {
      this.editApprovalView = new ApprovalEditView({
        application: this.application,
        parentView: this,
        model: order,
        inModal: true
      });

      this.application.getLayout().showInModal(this.editApprovalView);
    },

    childViews: {
      'Approvals.ListDetails': function() {
        return new BackboneCollectionView({
          childView: ApprovalDetailsView,
          viewsPerRow: 1,
          collection: this.collection
        });
      }
    },

    // @method getContext @return {Approval.List.View.Context}
    getContext: function() {

      // @class Approval.List.View.Context
      return {
        // @property {Boolean} hasApprovals
        hasApprovals: this.collection.length
      };
    }
  });
});
