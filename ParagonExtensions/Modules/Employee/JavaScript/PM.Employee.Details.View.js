// @module PM.Employee.Details.View
define('PM.Employee.Details.View', [
  'Backbone.View',
  'pm_employee_details.tpl'
], function(
  BackboneView,
  employee_details_tpl
) {
  'use strict';

  // @class PM.Employee.Details.View @extend BackboneView
  return BackboneView.extend({
    template: employee_details_tpl,

    // @method getContext @return {PM.Employee.Details.View.Context}
    getContext: function() {
      var model = this.options.model,
        role;

      if(SC.published && SC.published.cpas_role){
        role = SC.published.cpas_role;
      } else{
        role = SC.getPublishedObject('cpas_role');
      }

      // @class PM.Employee.Details.View.Context
      return {
        // @property {Number} internalid
        internalid: model.get('internalid'),
        // @property {String} firstname
        firstname: model.get('firstname'),
        // @property {String} name
        lastname: model.get('lastname'),
        // @property {String} email
        email: model.get('email'),
        // @property {String} role
        accountType: model.get('accountType'),
        // @property {Boolean} showEditButtons
        showEditButtons: role[0] === "1" // If admin
      };
    }
  });
});
