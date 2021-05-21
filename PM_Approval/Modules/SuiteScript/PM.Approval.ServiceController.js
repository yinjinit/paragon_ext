// Approval.ServiceController.js
// ----------------
// Service to manage Approval requests
define('PM.Approval.ServiceController', [
  'ServiceController',
  'PM.Approval.Model'
], function(
  ServiceController,
  ApprovalModel
) {
  try {
    // @class Approval.ServiceController Manage Approval requests
    // @extend ServiceController
    return ServiceController.extend({
      // @property {String} name Mandatory for all ssp-libraries model
      name: 'PM.Approval.ServiceController',

      // @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
      // The values in this object are the validation needed for the current service.
      // Can have values for all the request methods ('common' values) and specific for each one.
      options: {
        common: {
          requireLogin: true
        }
      },

      // @method get The call to Approval.Service.ss with http method 'get' is managed by this function
      // @return {ApprovalModel.list} A list featuring the Approvals
      get: function() {
        var role = this.request.getParameter('role');
        var contactid = this.request.getParameter('contactid');
        return ApprovalModel.list(role, contactid);
      },

      // @method put The call to Approval.Service.ss with http method 'put' is managed by this function
      // @return {Approval.Model.Get.Result}
      put: function() {
        const id = this.request.getParameter('internalid') ||
          this.data.internalid;

        ApprovalModel.update(id, this.data);

        return ApprovalModel.get(id);
      }

    });
  } catch (e) {
    console.warn('PM.Approval.Service.ss' + e.name, e);
    this.sendError(e);
  }
});
