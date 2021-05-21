// Approval.Model.js
// ----------------
// Handles fetching, approve, decline sales orders
define('PM.Approval.Model', [
  'SC.Model',
  'Application',
  'SC.Models.Init',
  'Configuration',
  'underscore'
], function(
  SCModel,
  Application,
  ModelsInit,
  Configuration,
  _
) {
  return SCModel.extend({
    name: 'PM.Approval',
    // ## General settings

    // Returns a pending sales order list
    list: function(role, contactid) {

      try {

        var filters = [
          new nlobjSearchFilter('mainline', 'custrecord_cpas_os_orderid', 'is',
            'T'),
          new nlobjSearchFilter('isinactive', null, 'is', 'F'),
          new nlobjSearchFilter('custrecord_cpas_os_orderid', null, 'noneof',
            '@NONE@'),
          new nlobjSearchFilter('custrecord_cpas_os_status', null, 'anyof',
            '1'), //1 - pending
          new nlobjSearchFilter('custrecord_cpas_order_approver_status',
            'custrecord_cpas_order_approver_order_id', 'anyof', '1') // 1- pending
        ];

        role = parseInt(role);

        var currentUser = nlapiGetUser();

        if (role === 1) {//admin
          // display all the sales oders created by all the contacts belonging to the current user
          filters.push(
            new nlobjSearchFilter('company', 'custrecord_cpas_os_customerid',
              'anyof', currentUser));
        } else if (role === 2) {//approver
          // display all the sales orders where this contact id is the approver
          filters.push(
            new nlobjSearchFilter('custrecord_cpas_order_approver_id',
              'custrecord_cpas_order_approver_order_id', 'anyof', contactid));
        } else if (role === 3) {//employee
          // display all the sales orders that were created by this contact id
          filters.push(
            new nlobjSearchFilter('custrecord_cpas_os_customerid', null,
              'anyof', contactid));
        }

        var columns = [
          new nlobjSearchColumn('internalid'),
          new nlobjSearchColumn('custrecord_cpas_os_customerid'),
          new nlobjSearchColumn('custrecord_cpas_os_orderid'),
          new nlobjSearchColumn('custrecord_cpas_os_status'),
          new nlobjSearchColumn('tranid', 'custrecord_cpas_os_orderid'),
          new nlobjSearchColumn('internalid', 'custrecord_cpas_os_orderid'),
          new nlobjSearchColumn('trandate', 'custrecord_cpas_os_orderid'),
          new nlobjSearchColumn('total', 'custrecord_cpas_os_orderid'),
          new nlobjSearchColumn('entity', 'custrecord_cpas_os_orderid'),
          new nlobjSearchColumn('firstname', 'custrecord_cpas_os_customerid'),
          new nlobjSearchColumn('email', 'custrecord_cpas_os_customerid'),
          new nlobjSearchColumn('custrecord_cpas_order_approver_id',
            'CUSTRECORD_CPAS_ORDER_APPROVER_ORDER_ID'),
          new nlobjSearchColumn('lastname', 'custrecord_cpas_os_customerid'),
          new nlobjSearchColumn('custrecord_cpas_os_approvers')
        ];

        var search_results = Application.getAllSearchResults(
          'customrecord_cpas_order',
          _.values(filters),
          _.values(columns)
        );

        search_results = _.map(search_results, function(cpas_order_record) {

          const current_record_id = cpas_order_record.getId();

          return { // cpas_order
            // @property {String} internalid
            internalid: current_record_id,
            // @property {String} custrecord_cpas_os_customerid - customer id
            custrecord_cpas_os_customerid: {
              code: cpas_order_record.getValue('custrecord_cpas_os_customerid'),
              name: cpas_order_record.getText('custrecord_cpas_os_customerid')
            },
            // @property {String} custrecord_cpas_os_approvers - approvers
            custrecord_cpas_os_approvers: cpas_order_record.getValue(
              'custrecord_cpas_os_approvers'),
            // @property {String} custrecord_cpas_os_orderid - order number
            custrecord_cpas_os_orderid: {
              code: cpas_order_record.getValue('custrecord_cpas_os_orderid'),
              name: cpas_order_record.getText('custrecord_cpas_os_orderid')
            },
            // @property {String} trandate
            trandate: cpas_order_record.getValue('trandate',
              'custrecord_cpas_os_orderid'),
            // @property {String} total
            total: cpas_order_record.getValue('total',
              'custrecord_cpas_os_orderid'),
            // @property {String} custrecord_cpas_os_status - order status
            custrecord_cpas_os_status: {
              code: cpas_order_record.getValue('custrecord_cpas_os_status'),
              name: cpas_order_record.getText('custrecord_cpas_os_status')
            },
            // @property {String} total
            tranid: cpas_order_record.getValue('tranid',
              'custrecord_cpas_os_orderid'),
            // @property {String} internalid of sales order id
            orderid: cpas_order_record.getValue('internalid',
              'custrecord_cpas_os_orderid')
          };
        });

        return search_results;

      } catch (e) {
        nlapiLogExecution('ERROR', 'APPROVAL_LIST_ERROR', JSON.stringify(e));
      }

    },

    // Returns a purchaserule based on a given userId
    get: function(id) {

      try {
        var filters = [
          new nlobjSearchFilter('internalid', null, 'anyof', id)
        ];

        var columns = [
          new nlobjSearchColumn('internalid'),
          new nlobjSearchColumn('custrecord_cpas_os_customerid'),
          new nlobjSearchColumn('custrecord_cpas_os_orderid'),
          new nlobjSearchColumn('custrecord_cpas_os_status'),
          new nlobjSearchColumn('tranid', 'custrecord_cpas_os_orderid'),
          new nlobjSearchColumn('internalid', 'custrecord_cpas_os_orderid'),
          new nlobjSearchColumn('trandate', 'custrecord_cpas_os_orderid'),
          new nlobjSearchColumn('total', 'custrecord_cpas_os_orderid'),
          new nlobjSearchColumn('entity', 'custrecord_cpas_os_orderid'),
          new nlobjSearchColumn('firstname', 'custrecord_cpas_os_customerid'),
          new nlobjSearchColumn('email', 'custrecord_cpas_os_customerid'),
          new nlobjSearchColumn('custrecord_cpas_order_approver_id',
            'CUSTRECORD_CPAS_ORDER_APPROVER_ORDER_ID'),
          new nlobjSearchColumn('lastname', 'custrecord_cpas_os_customerid'),
          new nlobjSearchColumn('custrecord_cpas_os_approvers')
        ];

        var search_results = Application.getAllSearchResults(
          'customrecord_cpas_order',
          _.values(filters),
          _.values(columns)
        );

        search_results = _.map(search_results, function(cpas_order_record) {

          const current_record_id = cpas_order_record.getId();

          return { // cpas_order
            // @property {String} internalid
            internalid: current_record_id,
            // @property {String} custrecord_cpas_os_customerid - customer id
            custrecord_cpas_os_customerid: {
              code: cpas_order_record.getValue('custrecord_cpas_os_customerid'),
              name: cpas_order_record.getText('custrecord_cpas_os_customerid')
            },
            // @property {String} custrecord_cpas_os_approvers - approvers
            custrecord_cpas_os_approvers: cpas_order_record.getValue(
              'custrecord_cpas_os_approvers'),
            // @property {String} custrecord_cpas_os_orderid - order number
            custrecord_cpas_os_orderid: {
              code: cpas_order_record.getValue('custrecord_cpas_os_orderid'),
              name: cpas_order_record.getText('custrecord_cpas_os_orderid')
            },
            // @property {String} trandate
            trandate: cpas_order_record.getValue('trandate',
              'custrecord_cpas_os_orderid'),
            // @property {String} total
            total: cpas_order_record.getValue('total',
              'custrecord_cpas_os_orderid'),
            // @property {String} custrecord_cpas_os_status - order status
            custrecord_cpas_os_status: {
              code: cpas_order_record.getValue('custrecord_cpas_os_status'),
              name: cpas_order_record.getText('custrecord_cpas_os_status')
            },
            // @property {String} tranid
            tranid: cpas_order_record.getValue('tranid',
              'custrecord_cpas_os_orderid'),
            // @property {String} internalid of sales order id
            orderid: cpas_order_record.getValue('internalid',
              'custrecord_cpas_os_orderid')
          };
        });

        if (search_results.length >= 1) {
          return search_results[0];
        }

        throw notFoundError;

      } catch (e) {
        nlapiLogExecution('ERROR', 'APPROVAL_GET_ERROR', JSON.stringify(e));
      }
    },

    update: function(id, data) {

      try {

        var isApprovalOverride = false;

        if (data.role && data.role === '1') {//admin
          isApprovalOverride = true;
        }

        var thisRec = nlapiLoadRecord('customrecord_cpas_order', id,
          {recordmode: 'dynamic'});

        var enforceApprovalOrder = thisRec.getFieldValue(
          'custrecord_cpas_os_enfore_approval_order');
        enforceApprovalOrder = !!(
          enforceApprovalOrder && enforceApprovalOrder === 'T'
        );

        var numApprovers = thisRec.getLineItemCount(
          'recmachcustrecord_cpas_order_approver_order_id');

        var result = {
          id: null
        };

        if (numApprovers > 0) {
          var toSubmit = false;
          var sequence = 0;
          var setNextApprover = false;
          for (var i = 1; i <= numApprovers; i++) {
            thisRec.selectLineItem(
              'recmachcustrecord_cpas_order_approver_order_id', i);
            var approver = thisRec.getCurrentLineItemValue(
              'recmachcustrecord_cpas_order_approver_order_id',
              'custrecord_cpas_order_approver_id');
            var status = thisRec.getCurrentLineItemValue(
              'recmachcustrecord_cpas_order_approver_order_id',
              'custrecord_cpas_order_approver_status');
            sequence = thisRec.getCurrentLineItemValue(
              'recmachcustrecord_cpas_order_approver_order_id',
              'custrecord_cpas_order_approver_sequence');

            if (isApprovalOverride === false) {
              if ((
                data && data.contactid === approver
              ) && (
                data && data.hasOwnProperty('custrecord_cpas_os_status')
              ) && status === 1) { //1 - Pending
                if (data.custrecord_cpas_os_comments) {
                  thisRec.setCurrentLineItemValue(
                    'recmachcustrecord_cpas_order_approver_order_id',
                    'custrecord_cpas_order_approver_comment',
                    data.custrecord_cpas_os_comments);
                }

                if (enforceApprovalOrder === true && setNextApprover ===
                  false) {
                  sequence++;
                  setNextApprover = true;
                }

                thisRec.setCurrentLineItemValue(
                  'recmachcustrecord_cpas_order_approver_order_id',
                  'custrecord_cpas_order_approver_status',
                  data.custrecord_cpas_os_status);
                thisRec.commitLineItem(
                  'recmachcustrecord_cpas_order_approver_order_id');
                toSubmit = true;
              }
            } else {
              if ((
                data && data.hasOwnProperty('custrecord_cpas_os_status')
              ) && status === 1) { //1 - Pending
                if (data.custrecord_cpas_os_comments) {
                  thisRec.setCurrentLineItemValue(
                    'recmachcustrecord_cpas_order_approver_order_id',
                    'custrecord_cpas_order_approver_comment',
                    data.custrecord_cpas_os_comments);
                }

                if (enforceApprovalOrder === true && setNextApprover ===
                  false) {
                  sequence++;
                  setNextApprover = true;
                }

                thisRec.setCurrentLineItemValue(
                  'recmachcustrecord_cpas_order_approver_order_id',
                  'custrecord_cpas_order_approver_status',
                  data.custrecord_cpas_os_status);
                thisRec.commitLineItem(
                  'recmachcustrecord_cpas_order_approver_order_id');
                toSubmit = true;
                break;
              }
            }
          }

          if (enforceApprovalOrder === true && setNextApprover === true &&
            sequence > 0) {
            for (i = 1; i <= numApprovers; i++) {
              thisRec.selectLineItem(
                'recmachcustrecord_cpas_order_approver_order_id', i);
              var idxSequence = thisRec.getCurrentLineItemValue(
                'recmachcustrecord_cpas_order_approver_order_id',
                'custrecord_cpas_order_approver_sequence');
              if (parseInt(idxSequence) === parseInt(sequence)) {
                thisRec.setCurrentLineItemValue(
                  'recmachcustrecord_cpas_order_approver_order_id',
                  'custrecord_cpas_order_approver_status', 1); //1 - Pending
                thisRec.setCurrentLineItemValue(
                  'recmachcustrecord_cpas_order_approver_order_id',
                  'custrecord_cpas_order_approver_notify', 'T');
                thisRec.commitLineItem(
                  'recmachcustrecord_cpas_order_approver_order_id');
              }
            }
          }
        }

        if (toSubmit === true) {
          result.id = nlapiSubmitRecord(thisRec, true, true);
        }

        return result;
      } catch (e) {
        nlapiLogExecution('ERROR', 'UPDATE_ORDER_ACTION_ERROR',
          JSON.stringify(e));
      }
    }
  });
});
