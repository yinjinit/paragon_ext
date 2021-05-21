// @module PM.PurchaseRule.Model
define('PM.PurchaseRule.Model', [
  'Backbone',
  'Utils',
  'underscore'
], function(
  Backbone,
  Utils,
  _
) {
  'use strict';

  return Backbone.Model.extend({
    validation: {
      name: {
        required: true,
        msg: Utils.translate('Rule Name is required')
      },
      custrecord_cpas_rules_customerid_: {
        required: true,
        msg: Utils.translate('PurchaseRule is required')
      },
      custrecord_cpas_rules_type_: {
        required: true,
        msg: Utils.translate('Rule Type is required')
      },
      custrecord_cpas_rules_approver1_: function(custrecord_cpas_rules_approver1_,
        attr, form) {

        if (_.isNull(custrecord_cpas_rules_approver1_) ||
          _.isUndefined(custrecord_cpas_rules_approver1_) ||
          custrecord_cpas_rules_approver1_ === '') {
          return Utils.translate('Approver is required');
        } else {
          var selected = (
              custrecord_cpas_rules_approver1_ ===
              form.custrecord_cpas_rules_approver2_
            ) ||
            (
              custrecord_cpas_rules_approver1_ ===
              form.custrecord_cpas_rules_approver3_
            ) ||
            (
              custrecord_cpas_rules_approver1_ ===
              form.custrecord_cpas_rules_approver4_
            ) ||
            (
              custrecord_cpas_rules_approver1_ ===
              form.custrecord_cpas_rules_approver5_
            );
          if (selected) {
            return Utils.translate('Approver already selected');
          }
        }

      },
      custrecord_cpas_rules_approver2_: function(custrecord_cpas_rules_approver2_,
        attr, form) {

        if (!_.isNull(custrecord_cpas_rules_approver2_) &&
          !_.isUndefined(custrecord_cpas_rules_approver2_) && !(
            custrecord_cpas_rules_approver2_ === ''
          )) {
          var selected = (
              custrecord_cpas_rules_approver2_ ===
              form.custrecord_cpas_rules_approver1_
            ) ||
            (
              custrecord_cpas_rules_approver2_ ===
              form.custrecord_cpas_rules_approver3_
            ) ||
            (
              custrecord_cpas_rules_approver2_ ===
              form.custrecord_cpas_rules_approver4_
            ) ||
            (
              custrecord_cpas_rules_approver2_ ===
              form.custrecord_cpas_rules_approver5_
            );
          if (selected) {
            return Utils.translate('Approver already selected');
          }
        }
      },
      custrecord_cpas_rules_approver3_: function(custrecord_cpas_rules_approver3_,
        attr, form) {

        if (!_.isNull(custrecord_cpas_rules_approver3_) &&
          !_.isUndefined(custrecord_cpas_rules_approver3_) && !(
            custrecord_cpas_rules_approver3_ === ''
          )) {
          var selected = (
              custrecord_cpas_rules_approver3_ ===
              form.custrecord_cpas_rules_approver1_
            ) ||
            (
              custrecord_cpas_rules_approver3_ ===
              form.custrecord_cpas_rules_approver2_
            ) ||
            (
              custrecord_cpas_rules_approver3_ ===
              form.custrecord_cpas_rules_approver4_
            ) ||
            (
              custrecord_cpas_rules_approver3_ ===
              form.custrecord_cpas_rules_approver5_
            );

          if (selected) {
            return Utils.translate('Approver already selected');
          }
        }
      },
      custrecord_cpas_rules_approver4_: function(custrecord_cpas_rules_approver4_,
        attr, form) {

        if (!_.isNull(custrecord_cpas_rules_approver4_) &&
          !_.isUndefined(custrecord_cpas_rules_approver4_) && !(
            custrecord_cpas_rules_approver4_ === ''
          )) {
          var selected = (
              custrecord_cpas_rules_approver4_ ===
              form.custrecord_cpas_rules_approver1_
            ) ||
            (
              custrecord_cpas_rules_approver4_ ===
              form.custrecord_cpas_rules_approver2_
            ) ||
            (
              custrecord_cpas_rules_approver4_ ===
              form.custrecord_cpas_rules_approver3_
            ) ||
            (
              custrecord_cpas_rules_approver4_ ===
              form.custrecord_cpas_rules_approver5_
            );
          if (selected) {
            return Utils.translate('Approver already selected');
          }
        }
      },
      custrecord_cpas_rules_approver5_: function(custrecord_cpas_rules_approver5_,
        attr, form) {

        if (!_.isNull(custrecord_cpas_rules_approver5_) &&
          !_.isUndefined(custrecord_cpas_rules_approver5_) && !(
            custrecord_cpas_rules_approver5_ === ''
          )) {
          var selected = (
              custrecord_cpas_rules_approver5_ ===
              form.custrecord_cpas_rules_approver1_
            ) ||
            (
              custrecord_cpas_rules_approver5_ ===
              form.custrecord_cpas_rules_approver2_
            ) ||
            (
              custrecord_cpas_rules_approver5_ ===
              form.custrecord_cpas_rules_approver3_
            ) ||
            (
              custrecord_cpas_rules_approver5_ ===
              form.custrecord_cpas_rules_approver4_
            );
          if (selected) {
            return Utils.translate('Approver already selected');
          }
        }
      }

    },
    urlRoot: _.getAbsoluteUrl(
      getExtensionAssetsPath('services/PM.PurchaseRule.Service.ss'))
  });

});
