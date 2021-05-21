// @module PM.PurchaseRule.Edit.View
define('PM.PurchaseRule.Edit.View', [
  'Backbone.View',
  'Backbone.FormView',
  'pm_purchaserule_new.tpl',
  'Utils',
  'underscore'
], function(
  BackboneView,
  BackboneFormView,
  purchaserule_new_tpl,
  Utils,
  _
) {
  'use strict';

  // @class PM.PurchaseRule.Edit.View @extends Backbone.View
  return BackboneView.extend({
    template: purchaserule_new_tpl,

    attributes: {class: 'product-list-new-wrapper'},

    events: {
      'submit form': 'saveForm',
      '[data-action="prevent-enter"]': 'preventEnter'
    },

    bindings: {
      '[name="name"]': 'name',
      '[name="custrecord_cpas_rules_customerid"]': 'custrecord_cpas_rules_customerid',
      '[name="custrecord_cpas_rules_type"]': 'custrecord_cpas_rules_type',
      '[name="custrecord_cpas_rules_orderl"]': 'custrecord_cpas_rules_orderl',
      '[name="custrecord_cpas_rules_enforce_order"]': 'custrecord_cpas_rules_enforce_order',
      '[name="custrecord_cpas_rules_approver1"]': 'custrecord_cpas_rules_approver1',
      '[name="custrecord_cpas_rules_approver2"]': 'custrecord_cpas_rules_approver2',
      '[name="custrecord_cpas_rules_approver3"]': 'custrecord_cpas_rules_approver3',
      '[name="custrecord_cpas_rules_approver4"]': 'custrecord_cpas_rules_approver4',
      '[name="custrecord_cpas_rules_approver5"]': 'custrecord_cpas_rules_approver5'
    },

    initialize: function(options) {
      this.application = options.application;
      this.parentView = options.parentView;
      this.model = options.model;
      this.isEdit = this.model.get('internalid');
      this.page_header = this.getTitle();
      this.inModal = options.inModal;

      BackboneFormView.add(this);

      this.model.once('saveCompleted', _.bind(this.onSaveComplete, this));
    },

    // @method preventEnter Prevents not desired behavior when hitting enter
    preventEnter: function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
    },

    // Sets focus on the name field and returns the correct title text
    getTitle: function() {
      //this.$('[name="name"]').focus();

      const editLabel = Utils.translate('Edit Purchase Rule');
      const newLabel = Utils.translate('New Purchase Rule');

      return this.isEdit ? editLabel : newLabel;
    },

    // Handles the form submit on save
    onSaveComplete: function() {

      const self = this;

      if (self.isEdit) {
        self.parentView.collection.add(self.model, {merge: true});
      } else {
        self.parentView.collection.add(self.model);
      }

      self.parentView.render();
    },

    // @method getContext @return {PurchaseRule.Edit.View.Context}
    getContext: function() {
      const {model} = this;

      var ruleType;
      var purchaseruleList;
      var approverList1;
      var approverList2;
      var approverList3;
      var approverList4;
      var approverList5;

      if (SC.published && SC.published.rule_type) {
        ruleType = SC.published.rule_type;
      } else {
        ruleType = SC.getPublishedObject('rule_type');
      }

      if (SC.published && SC.published.list_emplyees) {
        purchaseruleList = SC.published.list_employees;
      } else {
        purchaseruleList = SC.getPublishedObject('list_employees');
      }

      if (SC.published && SC.published.list_approvers) {
        approverList1 = SC.published.list_approvers;
      } else {
        approverList1 = SC.getPublishedObject('list_approvers');
      }

      if (!!this.isEdit) {

        //logic to identify which option is selected on edit mode
        purchaseruleList = purchaseruleList.map(function(option) {
          return {
            code: option.code,
            name: option.name,
            isActive: String(option.code) ===
              model.get('custrecord_cpas_rules_customerid').code
          };
        });

        ruleType = ruleType.map(function(option) {
          return {
            code: option.code,
            name: option.name,
            isActive: String(option.code) ===
              model.get('custrecord_cpas_rules_type').code
          };
        });

        approverList1 = approverList1.map(function(option) {
          return {
            code: option.code,
            name: option.name,
            isActive: String(option.code) ===
              model.get('custrecord_cpas_rules_approver1').code
          };
        });

        approverList2 = approverList1.map(function(option) {
          return {
            code: option.code,
            name: option.name,
            isActive: String(option.code) ===
              model.get('custrecord_cpas_rules_approver2').code
          };
        });

        approverList3 = approverList1.map(function(option) {
          return {
            code: option.code,
            name: option.name,
            isActive: String(option.code) ===
              model.get('custrecord_cpas_rules_approver3').code
          };
        });

        approverList4 = approverList1.map(function(option) {
          return {
            code: option.code,
            name: option.name,
            isActive: String(option.code) ===
              model.get('custrecord_cpas_rules_approver4').code
          };
        });

        approverList5 = approverList1.map(function(option) {
          return {
            code: option.code,
            name: option.name,
            isActive: String(option.code) ===
              model.get('custrecord_cpas_rules_approver5').code
          };
        });

        //getting the right amount limit based on rule type

        var ruleCode = model.get('custrecord_cpas_rules_type').code;
        var amountLimit;

        if (ruleCode === '9') {
          amountLimit = model.get('custrecord_cpas_rules_orderl');
        } else if (ruleCode === '5') {
          amountLimit = model.get('custrecord_cpas_rules_dayl');
        } else if (ruleCode === '6') {
          amountLimit = model.get('custrecord_cpas_rules_weekl');
        } else if (ruleCode === '7') {
          amountLimit = model.get('custrecord_cpas_rules_monthl');
        } else if (ruleCode === '8') {
          amountLimit = model.get('custrecord_cpas_rules_yearl');
        }

      } else {
        approverList2 = approverList1;
        approverList3 = approverList1;
        approverList4 = approverList1;
        approverList5 = approverList1;
      }

      // @class PurchaseRule.Edit.View.Context
      return {
        // @property {Boolean} inModal
        inModal: !!this.inModal,
        // @property {Boolean} isEdit
        isEdit: !!this.isEdit,
        // @property {String} name
        name: model.get('name'),
        // @property {String} amountlimit
        amountlimit: amountLimit,
        // @property {String} custrecord_cpas_rules_enforce_order
        custrecord_cpas_rules_enforce_order: model.get(
          'custrecord_cpas_rules_enforce_order'),
        // @property {Array} custrecord_cpas_rules_type
        custrecord_cpas_rules_type: ruleType,
        // @property {Array} custrecord_cpas_rules_customerid
        custrecord_cpas_rules_customerid: purchaseruleList,
        // @property {Array} custrecord_cpas_rules_approver1
        custrecord_cpas_rules_approver1: approverList1,
        // @property {Array} custrecord_cpas_rules_approver2
        custrecord_cpas_rules_approver2: approverList2,
        // @property {Array} custrecord_cpas_rules_approver3
        custrecord_cpas_rules_approver3: approverList3,
        // @property {Array} custrecord_cpas_rules_approver4
        custrecord_cpas_rules_approver4: approverList4,
        // @property {Array} custrecord_cpas_rules_approver5
        custrecord_cpas_rules_approver5: approverList5
      };
    }
  });
});
