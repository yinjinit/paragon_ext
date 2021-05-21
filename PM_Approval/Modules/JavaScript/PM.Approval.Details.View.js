// @module PM.Approval.Details.View
define('PM.Approval.Details.View', [
  'Backbone.View',
  'pm_approval_details.tpl'
], function(
  BackboneView,
  approval_details_tpl
) {
  'use strict';

  // @class PM.Approval.Details.View @extend BackboneView
  return BackboneView.extend({
    template: approval_details_tpl,

    // @method getContext @return {PM.Approval.Details.View.Context}
    getContext: function() {


      const model = this.options.model;
      var role;

      if(SC.published && SC.published.cpas_role){
        role = SC.published.cpas_role;
      } else{
        role = SC.getPublishedObject('cpas_role');
      }

      // @class PM.Approval.Details.View.Context
      return {
        // @property {Number} internalid
        internalid: model.get('internalid'),
        // @property {String} name
        name: model.get('custrecord_cpas_os_customerid').name,
        // @property {String} approver
        approver: model.get('custrecord_cpas_os_approvers'),
        // @property {String} order_number
        order_number: model.get('custrecord_cpas_os_orderid').name,
        // @property {String} order_date
        order_date: model.get('trandate'),
        // @property {String} order_total
        order_total: model.get('total'),
        // @property {String} order_status
        order_status: model.get('custrecord_cpas_os_status').name,
        // @property {String} orderid
        orderid: model.get('orderid'),

        sales_order_id: model.get('internalid'),

        // @property {Boolean} showButtons
        showButtons: (
          role[0] === "1"
        ) || (
          role[0] === "2"
        ) //if admin || approver
      };
    }
  });
});
