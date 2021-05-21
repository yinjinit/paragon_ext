// @module PM.PurchaseRule.List.View
define('PM.PurchaseRule.List.View', [
  'PM.PurchaseRule.Model',
  'PM.PurchaseRule.Details.View',
  'PM.PurchaseRule.Edit.View',
  'PM.PurchaseRule.Collection',
  'Backbone',
  'Backbone.CompositeView',
  'Backbone.CollectionView',
  'GlobalViews.Confirmation.View',
  'AjaxRequestsKiller',
  'jQuery',
  'Utils',
  'pm_purchaserule_list.tpl'
], function(
  PurchaseRuleModel,
  PurchaseRuleDetailsView,
  PurchaseRuleEditView,
  PurchaseRuleCollection,
  Backbone,
  BackboneCompositeView,
  BackboneCollectionView,
  GlobalViewsConfirmationView,
  AjaxRequestsKiller,
  $,
  Utils,
  purchaserule_list_tpl
) {
  'use strict';

  // @class PM.PurchaseRule.List.View @extend BackboneView
  return Backbone.View.extend({
    template: purchaserule_list_tpl,

    title: Utils.translate('Purchase Authorization: Rules'),

    events: {
      'click [data-action="add-new-purchaserule"]': 'addNewPurchaseRule',
      'click [data-action="edit-purchaserule"]': 'editPurchaseRuleHandler',
      'click [data-action="remove-purchaserule"]': 'askDeletePurchaseRule'
    },

    attributes: {
      id: 'PurchaseRule'
    },

    initialize: function(options) {
      this.options = options;
      this.application = options.application;

      this.collection = new PurchaseRuleCollection();

      BackboneCompositeView.add(this);
    },

    // @method getSelectedMenu
    getSelectedMenu: function() {
      return 'purchase_rules';
    },
    // @method getBreadcrumbPages
    getBreadcrumbPages: function() {
      return {
        text: Utils.translate('Purchase Rules'),
        href: '/purchase_rules'
      };
    },

    beforeShowContent: function beforeShowContent() {
      return this.collection.fetch({
        killerId: AjaxRequestsKiller.getKillerId()
      });
    },

    // @method addNewPurchaseRule  create new purchase rule modal form
    addNewPurchaseRule: function() {
      this.newPurchaseRuleView = new PurchaseRuleEditView({
        application: this.application,
        parentView: this,
        model: new PurchaseRuleModel() // create!
      });

      this.application.getLayout().showInModal(this.newPurchaseRuleView);
    },

    // @method askDeletePurchaseRule starts the 'delete a purchase' use case
    askDeletePurchaseRule: function(e) {
      this.deleteConfirmationView = new GlobalViewsConfirmationView({
        callBackParameters: {
          target: e.target,
          context: this
        },
        callBack: this.deletePurchaseRuleHandler,
        title: Utils.translate('Delete Purchase Rule'),
        autohide: true,
        body: Utils.translate(
          'Are you sure you want to delete this purchase rule?')
      });
      this.application.getLayout().showInModal(this.deleteConfirmationView);
    },

    // @method deletePurchaseRuleHandler called from the sub view when the user confirms he
    // wants to delete the purchase rule.
    deletePurchaseRuleHandler: function(options) {
      const self = options.context;
      const {target} = options;
      const purchaserule = self.getListFromDom($(target));
      self.collection.remove(purchaserule);

      purchaserule.destroy().done(function() {
        self.render();
      });

    },

    // @method editPurchaseRuleHandler Edit Purchase Rule click handler
    editPurchaseRuleHandler: function(e) {
      const purchaserule = this.getListFromDom($(e.target));
      this.editPurchaseRule(purchaserule);
    },

    // @method getListFromDom Get the list (collection) from DOM @return {PurchaseRule.Model}
    getListFromDom: function($target) {
      const purchaserule_id = $target.closest('[data-purchaserule-id]')
        .data('purchaserule-id') + '';
      return this.collection.where({internalid: purchaserule_id})[0];
    },

    // @method editPurchaseRule Edit list click handler (displays edit purchaserule modal view)
    // @param {PurchaseRule.Model} list
    editPurchaseRule: function(purchaserule) {
      this.newPurchaseRuleView = new PurchaseRuleEditView({
        application: this.application,
        parentView: this,
        model: purchaserule,
        inModal: true
      });

      this.application.getLayout().showInModal(this.newPurchaseRuleView);
    },

    childViews: {
      'PurchaseRule.ListDetails': function() {
        return new BackboneCollectionView({
          childView: PurchaseRuleDetailsView,
          viewsPerRow: 1,
          collection: this.collection
        });
      }
    },

    // @method getContext @return {PurchaseRule.List.View.Context}
    getContext: function() {

      var role;

      if (SC.published && SC.published.cpas_role) {
        role = SC.published.cpas_role;
      } else {
        role = SC.getPublishedObject('cpas_role');
      }

      // @class PurchaseRule.List.View.Context
      return {
        // @property {Boolean} hasPurchaseRules
        hasPurchaseRules: this.collection.length,
        // @property {Boolean} showCreateButton
        showCreateButton: (
          role[0] === '1'
        ) //if admin
      };
    }
  });
});
