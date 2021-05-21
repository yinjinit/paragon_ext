// PM.PurchaseRule.Model.js
// ----------------
// Handles creating, fetching, removing and updating Purchase Rules
define('PM.PurchaseRule.Model', [
  'SC.Model',
  'Application',
  'SC.Models.Init',
  'Configuration',
  'underscore',
  'PM.Employee.Model'
], function(
  SCModel,
  Application,
  ModelsInit,
  Configuration,
  _,
  EmployeeModel
) {
  return SCModel.extend({
    name: 'PM.PurchaseRule',
    // ## General settings

    validation: {
      name: {
        required: true,
        msg: 'Rule Name is required'
      },
      custrecord_cpas_rules_customerid_: {
        required: true,
        msg: (
          'Employee is required'
        )
      },
      custrecord_cpas_rules_type_: {
        required: true,
        msg: 'Rule Type is required'
      },
      custrecord_cpas_rules_approver1_: function(custrecord_cpas_rules_approver1_,
        attr, form) {

        if (_.isNull(custrecord_cpas_rules_approver1_) ||
          _.isUndefined(custrecord_cpas_rules_approver1_) ||
          custrecord_cpas_rules_approver1_ === '') {
          return 'Approver is required';
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
            return 'Approver already selected';
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
            return 'Approver already selected';
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
            return 'Approver already selected';
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
            return 'Approver already selected';
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
            return 'Approver already selected';
          }
        }
      }
    },

    // Returns a purchaserule list
    list: function() {

      try {

        var employeeArray = _.pluck(EmployeeModel.list(), 'internalid');

        if (employeeArray.length) {
          var filters = [
            new nlobjSearchFilter('custrecord_cpas_rules_customerid', null,
              'is', employeeArray),
            new nlobjSearchFilter('isinactive', null, 'is', 'F')
          ];

          var columns = [
            new nlobjSearchColumn('custrecord_cpas_rules_customerid'),
            new nlobjSearchColumn('custrecord_cpas_rules_type'),
            new nlobjSearchColumn('custrecord_cpas_rules_approver1'),
            new nlobjSearchColumn('custrecord_cpas_rules_approver2'),
            new nlobjSearchColumn('custrecord_cpas_rules_approver3'),
            new nlobjSearchColumn('custrecord_cpas_rules_approver4'),
            new nlobjSearchColumn('custrecord_cpas_rules_approver5'),
            new nlobjSearchColumn('name'),

            new nlobjSearchColumn('custrecord_cpas_rules_orderl'),
            new nlobjSearchColumn('custrecord_cpas_rules_dayl'),
            new nlobjSearchColumn('custrecord_cpas_rules_weekl'),
            new nlobjSearchColumn('custrecord_cpas_rules_monthl'),
            new nlobjSearchColumn('custrecord_cpas_rules_yearl'),
            new nlobjSearchColumn('custrecord_cpas_rules_quarterl'),
            new nlobjSearchColumn('custrecord_cpas_rules_enforce_order')

          ];

          var search_results = Application.getAllSearchResults(
            'customrecord_cpas_rules',
            _.values(filters),
            _.values(columns)
          );

          search_results = _.map(search_results,
            function(purchaserule_record) {

              const current_record_id = purchaserule_record.getId();

              return {
                // @property {String} internalid
                internalid: current_record_id,
                // @property {String} name - rule name
                name: purchaserule_record.getValue('name'),
                // @property {String} customer - contact
                custrecord_cpas_rules_customerid: {
                  code: purchaserule_record.getValue(
                    'custrecord_cpas_rules_customerid'),
                  name: purchaserule_record.getText(
                    'custrecord_cpas_rules_customerid')
                },
                // @property {String} rule type
                custrecord_cpas_rules_type: {
                  code: purchaserule_record.getValue(
                    'custrecord_cpas_rules_type'),
                  name: purchaserule_record.getText(
                    'custrecord_cpas_rules_type')
                },
                // @property {String} approver1
                custrecord_cpas_rules_approver1: {
                  code: purchaserule_record.getValue(
                    'custrecord_cpas_rules_approver1'),
                  name: purchaserule_record.getText(
                    'custrecord_cpas_rules_approver1')
                },
                // @property {String} approver2
                custrecord_cpas_rules_approver2: {
                  code: purchaserule_record.getValue(
                    'custrecord_cpas_rules_approver2'),
                  name: purchaserule_record.getText(
                    'custrecord_cpas_rules_approver2')
                },
                // @property {String} approver3
                custrecord_cpas_rules_approver3: {
                  code: purchaserule_record.getValue(
                    'custrecord_cpas_rules_approver3'),
                  name: purchaserule_record.getText(
                    'custrecord_cpas_rules_approver3')
                },
                // @property {String} approver4
                custrecord_cpas_rules_approver4: {
                  code: purchaserule_record.getValue(
                    'custrecord_cpas_rules_approver4'),
                  name: purchaserule_record.getText(
                    'custrecord_cpas_rules_approver4')
                },
                // @property {String} approver5
                custrecord_cpas_rules_approver5: {
                  code: purchaserule_record.getValue(
                    'custrecord_cpas_rules_approver5'),
                  name: purchaserule_record.getText(
                    'custrecord_cpas_rules_approver5')
                },

                custrecord_cpas_rules_orderl: purchaserule_record.getValue(
                  'custrecord_cpas_rules_orderl'),
                custrecord_cpas_rules_dayl: purchaserule_record.getValue(
                  'custrecord_cpas_rules_dayl'),
                custrecord_cpas_rules_weekl: purchaserule_record.getValue(
                  'custrecord_cpas_rules_weekl'),
                custrecord_cpas_rules_monthl: purchaserule_record.getValue(
                  'custrecord_cpas_rules_monthl'),
                custrecord_cpas_rules_yearl: purchaserule_record.getValue(
                  'custrecord_cpas_rules_yearl'),
                custrecord_cpas_rules_quarterl: purchaserule_record.getValue(
                  'custrecord_cpas_rules_quarterl'),
                custrecord_cpas_rules_enforce_order: purchaserule_record.getValue(
                  'custrecord_cpas_rules_enforce_order')
              };
            });
          return search_results;

        } else {
          return [];
        }

      } catch (e) {
        nlapiLogExecution('ERROR', 'PURCHASERULE_LIST_ERROR',
          JSON.stringify(e));
      }

    },

    // Returns a purchaserule based on a given userId
    get: function(id) {

      try {

        var filters = [
          new nlobjSearchFilter('isinactive', null, 'is', 'F'),
          new nlobjSearchFilter('internalid', null, 'anyof', id)
        ];

        var columns = [
          new nlobjSearchColumn('custrecord_cpas_rules_customerid'),
          new nlobjSearchColumn('custrecord_cpas_rules_type'),
          new nlobjSearchColumn('custrecord_cpas_rules_approver1'),
          new nlobjSearchColumn('custrecord_cpas_rules_approver2'),
          new nlobjSearchColumn('custrecord_cpas_rules_approver3'),
          new nlobjSearchColumn('custrecord_cpas_rules_approver4'),
          new nlobjSearchColumn('custrecord_cpas_rules_approver5'),
          new nlobjSearchColumn('name'),

          new nlobjSearchColumn('custrecord_cpas_rules_orderl'),
          new nlobjSearchColumn('custrecord_cpas_rules_dayl'),
          new nlobjSearchColumn('custrecord_cpas_rules_weekl'),
          new nlobjSearchColumn('custrecord_cpas_rules_monthl'),
          new nlobjSearchColumn('custrecord_cpas_rules_yearl'),
          new nlobjSearchColumn('custrecord_cpas_rules_quarterl'),
          new nlobjSearchColumn('custrecord_cpas_rules_enforce_order')

        ];

        var search_results = Application.getAllSearchResults(
          'customrecord_cpas_rules',
          _.values(filters),
          _.values(columns)
        );

        search_results = _.map(search_results,
          function(purchaserule_record) {

            const current_record_id = purchaserule_record.getId();

            return {
              // @property {String} internalid
              internalid: current_record_id,
              // @property {String} name - rule name
              name: purchaserule_record.getValue('name'),
              // @property {String} customer - contact
              custrecord_cpas_rules_customerid: {
                code: purchaserule_record.getValue(
                  'custrecord_cpas_rules_customerid'),
                name: purchaserule_record.getText(
                  'custrecord_cpas_rules_customerid')
              },
              // @property {String} rule type
              custrecord_cpas_rules_type: {
                code: purchaserule_record.getValue(
                  'custrecord_cpas_rules_type'),
                name: purchaserule_record.getText('custrecord_cpas_rules_type')
              },
              // @property {String} approver1
              custrecord_cpas_rules_approver1: {
                code: purchaserule_record.getValue(
                  'custrecord_cpas_rules_approver1'),
                name: purchaserule_record.getText(
                  'custrecord_cpas_rules_approver1')
              },
              // @property {String} approver2
              custrecord_cpas_rules_approver2: {
                code: purchaserule_record.getValue(
                  'custrecord_cpas_rules_approver2'),
                name: purchaserule_record.getText(
                  'custrecord_cpas_rules_approver2')
              },
              // @property {String} approver3
              custrecord_cpas_rules_approver3: {
                code: purchaserule_record.getValue(
                  'custrecord_cpas_rules_approver3'),
                name: purchaserule_record.getText(
                  'custrecord_cpas_rules_approver3')
              },
              // @property {String} approver4
              custrecord_cpas_rules_approver4: {
                code: purchaserule_record.getValue(
                  'custrecord_cpas_rules_approver4'),
                name: purchaserule_record.getText(
                  'custrecord_cpas_rules_approver4')
              },
              // @property {String} approver5
              custrecord_cpas_rules_approver5: {
                code: purchaserule_record.getValue(
                  'custrecord_cpas_rules_approver5'),
                name: purchaserule_record.getText(
                  'custrecord_cpas_rules_approver5')
              },

              custrecord_cpas_rules_orderl: purchaserule_record.getValue(
                'custrecord_cpas_rules_orderl'),
              custrecord_cpas_rules_dayl: purchaserule_record.getValue(
                'custrecord_cpas_rules_dayl'),
              custrecord_cpas_rules_weekl: purchaserule_record.getValue(
                'custrecord_cpas_rules_weekl'),
              custrecord_cpas_rules_monthl: purchaserule_record.getValue(
                'custrecord_cpas_rules_monthl'),
              custrecord_cpas_rules_yearl: purchaserule_record.getValue(
                'custrecord_cpas_rules_yearl'),
              custrecord_cpas_rules_quarterl: purchaserule_record.getValue(
                'custrecord_cpas_rules_quarterl'),
              custrecord_cpas_rules_enforce_order: purchaserule_record.getValue(
                'custrecord_cpas_rules_enforce_order')
            };
          });

        if (search_results.length >= 1) {
          return search_results[0];
        }

        throw notFoundError;

      } catch (e) {
        nlapiLogExecution('ERROR', 'PURCHASERULE_GET_ERROR', JSON.stringify(e));
      }

    },

    // Creates a new Purchase Rule Custom Record
    create: function(data) {

      try {
        this.validate(data);
        //creating purchase rule custom record
        const purchaseRuleRec = nlapiCreateRecord('customrecord_cpas_rules',
          {recordmode: 'dynamic'});

        purchaseRuleRec.setFieldValue('name', data.name);

        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_customerid',
          data.custrecord_cpas_rules_customerid_);
        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_type',
          data.custrecord_cpas_rules_type_);
        //setting the amountlimit based on the rule type selected
        if (data.custrecord_cpas_rules_type_ === '9') {
          purchaseRuleRec.setFieldValue('custrecord_cpas_rules_orderl',
            data.amountlimit);
        } else if (data.custrecord_cpas_rules_type_ === '5') {
          purchaseRuleRec.setFieldValue('custrecord_cpas_rules_dayl',
            data.amountlimit);
        } else if (data.custrecord_cpas_rules_type_ === '6') {
          purchaseRuleRec.setFieldValue('custrecord_cpas_rules_weekl',
            data.amountlimit);
        } else if (data.custrecord_cpas_rules_type_ === '7') {
          purchaseRuleRec.setFieldValue('custrecord_cpas_rules_monthl',
            data.amountlimit);
        } else if (data.custrecord_cpas_rules_type_ === '8') {
          purchaseRuleRec.setFieldValue('custrecord_cpas_rules_yearl',
            data.amountlimit);
        }

        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_enforce_order',
          data.custrecord_cpas_rules_enforce_order);
        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_approver1',
          data.custrecord_cpas_rules_approver1_);
        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_approver2',
          data.custrecord_cpas_rules_approver2_);
        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_approver3',
          data.custrecord_cpas_rules_approver3_);
        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_approver4',
          data.custrecord_cpas_rules_approver4_);
        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_approver5',
          data.custrecord_cpas_rules_approver5_);

        var purchaseRuleId = nlapiSubmitRecord(purchaseRuleRec);

        return this.get(purchaseRuleId);

      } catch (e) {
        //returning the "status":400,"code":"ERR_BAD_REQUEST
        //return e;

        return {
          errorStatusCode: '400',
          errorCode: 'FIELD_PARAM_REQD',
          errorMessage: 'Please enter a value for Name'
        };
      }
    },

    // Updates a given purchaserule given its id
    update: function(id, data) {
      //this.verifySession();

      try {
        this.validate(data);

        const purchaseRuleRec = nlapiLoadRecord('customrecord_cpas_rules', id);

        purchaseRuleRec.setFieldValue('name', data.name);
        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_customerid',
          data.custrecord_cpas_rules_customerid_);
        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_type',
          data.custrecord_cpas_rules_type_);
        //setting the amountlimit based on the rule type selected
        if (data.custrecord_cpas_rules_type_ === '9') {
          purchaseRuleRec.setFieldValue('custrecord_cpas_rules_orderl',
            data.amountlimit);
        } else if (data.custrecord_cpas_rules_type_ === '5') {
          purchaseRuleRec.setFieldValue('custrecord_cpas_rules_dayl',
            data.amountlimit);
        } else if (data.custrecord_cpas_rules_type_ === '6') {
          purchaseRuleRec.setFieldValue('custrecord_cpas_rules_weekl',
            data.amountlimit);
        } else if (data.custrecord_cpas_rules_type_ === '7') {
          purchaseRuleRec.setFieldValue('custrecord_cpas_rules_monthl',
            data.amountlimit);
        } else if (data.custrecord_cpas_rules_type_ === '8') {
          purchaseRuleRec.setFieldValue('custrecord_cpas_rules_yearl',
            data.amountlimit);
        }

        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_enforce_order',
          data.custrecord_cpas_rules_enforce_order);
        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_approver1',
          data.custrecord_cpas_rules_approver1_);
        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_approver2',
          data.custrecord_cpas_rules_approver2_);
        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_approver3',
          data.custrecord_cpas_rules_approver3_);
        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_approver4',
          data.custrecord_cpas_rules_approver4_);
        purchaseRuleRec.setFieldValue('custrecord_cpas_rules_approver5',
          data.custrecord_cpas_rules_approver5_);

        //returning the id fo the contact updated
        return nlapiSubmitRecord(purchaseRuleRec);

      } catch (e) {
        nlapiLogExecution('ERROR', 'PURCHASERULE_UPDATE_ERROR',
          JSON.stringify(e));
      }
    },

    // Deletes a purchaserule given its id
    delete: function(id) {
      //this.verifySession();

      try {
        const purchaseRuleRec = nlapiLoadRecord('customrecord_cpas_rules', id);
        purchaseRuleRec.setFieldValue('isinactive', 'T');
        return nlapiSubmitRecord(purchaseRuleRec);

      } catch (e) {
        nlapiLogExecution('ERROR', 'PURCHASERULE_DELETE_ERROR',
          JSON.stringify(e));
      }
    }
  });
});
