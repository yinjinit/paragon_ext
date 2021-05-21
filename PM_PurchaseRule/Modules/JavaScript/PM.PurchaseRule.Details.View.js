// @module PM.PurchaseRule.Details.View
define('PM.PurchaseRule.Details.View', [
  'Backbone.View',
  'pm_purchaserule_details.tpl'
], function(
  BackboneView,
  purchaserule_details_tpl
) {
  'use strict';

  // @class PM.PurchaseRule.Details.View @extend BackboneView
  return BackboneView.extend({
    template: purchaserule_details_tpl,

    // @method getContext @return {PurchaseRule.Details.View.Context}
    getContext: function() {
      const model = this.options.model;

      var role;

      if (SC.published && SC.published.cpas_role) {
        role = SC.published.cpas_role;
      } else {
        role = SC.getPublishedObject('cpas_role');
      }

      // @class PurchaseRule.Details.View.Context
      return {
        // @property {Number} internalid
        internalid: model.get('internalid'),
        // @property {String} name
        name: model.get('name'),
        // @property {String} custrecord_cpas_rules_customerid
        custrecord_cpas_rules_customerid: model.get(
          'custrecord_cpas_rules_customerid'),
        // @property {String} custrecord_cpas_rules_type
        custrecord_cpas_rules_type: model.get('custrecord_cpas_rules_type'),
        // @property {String} custrecord_cpas_rules_approver1
        custrecord_cpas_rules_approver1: model.get(
          'custrecord_cpas_rules_approver1'),
        // @property {String} custrecord_cpas_rules_approver2
        custrecord_cpas_rules_approver2: model.get(
          'custrecord_cpas_rules_approver2'),
        // @property {String} custrecord_cpas_rules_approver3
        custrecord_cpas_rules_approver3: model.get(
          'custrecord_cpas_rules_approver3'),
        // @property {String} custrecord_cpas_rules_approver4
        custrecord_cpas_rules_approver4: model.get(
          'custrecord_cpas_rules_approver4'),
        // @property {String} custrecord_cpas_rules_approver5
        custrecord_cpas_rules_approver5: model.get(
          'custrecord_cpas_rules_approver5'),
        // @property {Boolean} showEditButtons
        showEditButtons: role[0] === '1' //if admin
      };
    }
  });
});
