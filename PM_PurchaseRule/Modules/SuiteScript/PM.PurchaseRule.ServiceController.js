// PM.PurchaseRule.ServiceController.js
// ----------------
// Service to manage purchaserule requests
define('PM.PurchaseRule.ServiceController', [
  'ServiceController',
  'PM.PurchaseRule.Model'
], function(
  ServiceController,
  PurchaseRuleModel
) {
  try {
    // @class PM.PurchaseRule.ServiceController Manage purchaserule requests
    // @extend ServiceController
    return ServiceController.extend({
      // @property {String} name Mandatory for all ssp-libraries model
      name: 'PM.PurchaseRule.ServiceController',

      // @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
      // The values in this object are the validation needed for the current service.
      // Can have values for all the request methods ('common' values) and specific for each one.
      options: {
        common: {
          requireLogin: true
        }
      },

      // @method get The call to PurchaseRule.Service.ss with http method 'get' is managed by this function
      // @return {PurchaseRuleModel.list} A list featuring the purchaserules
      get: function() {
        var id = this.request.getParameter('internalid') ||
          this.data.internalid;
        return id ? PurchaseRuleModel.get(id) : PurchaseRuleModel.list();
      },

      // @method post The call to PurchaseRule.Service.ss with http method 'post' is managed by this function
      // @return {StatusObject}
      post: function() {
        this.sendContent(PurchaseRuleModel.create(this.data), {status: 201});
      },

      // @method put The call to PurchaseRule.Service.ss with http method 'put' is managed by this function
      // @return {PurchaseRule.Model.Get.Result}
      put: function() {
        const id = this.request.getParameter('internalid') ||
          this.data.internalid;
        PurchaseRuleModel.update(id, this.data);
        return PurchaseRuleModel.get(id);
      },

      // @method delete The call to PurchaseRule.Service.ss with http method 'delete' is managed by this function
      // @return {StatusObject}
      delete: function() {
        const id = this.request.getParameter('internalid') ||
          this.data.internalid;
        PurchaseRuleModel.delete(id);
        return {status: 'ok'};
      }
    });

  } catch (e) {
    console.warn('PM.PurchaseRule.Service.ss' + e.name, e);
    this.sendError(e);
  }
});
