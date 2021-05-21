// PM.Employee.ServiceController.js
// Service to manage employee requests
define('PM.Employee.ServiceController', [
  'ServiceController',
  'PM.Employee.Model'
], function(
  ServiceController,
  PMEmployeeModel
) {
  try {
    // @class PM.Employee.ServiceController Manage employee requests
    // @extend ServiceController
    return ServiceController.extend({
      // @property {String} name Mandatory for all ssp-libraries model
      name: 'PM.Employee.ServiceController',

      // @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
      // The values in this object are the validation needed for the current service.
      // Can have values for all the request methods ('common' values) and specific for each one.
      options: {
        common: {
          requireLogin: true
        }
      },

      // @method get The call to Employee.Service.ss with http method 'get' is managed by this function
      // @return {EmployeeModel.list} A list featuring the employees
      get: function() {

        var id = this.request.getParameter('internalid') ||
          this.data.internalid;
        return id ? PMEmployeeModel.get(id) : PMEmployeeModel.list();
      },

      // @method post The call to Employee.Service.ss with http method 'post' is managed by this function
      // @return {StatusObject}
      post: function() {
        this.sendContent(PMEmployeeModel.create(this.data), {status: 201});
      },

      // @method put The call to Employee.Service.ss with http method 'put' is managed by this function
      // @return {Employee.Model.Get.Result}
      put: function() {
        const id = this.request.getParameter('internalid') ||
          this.data.internalid;
        PMEmployeeModel.update(id, this.data);
        return PMEmployeeModel.get(id);
      },

      // @method delete The call to Employee.Service.ss with http method 'delete' is managed by this function
      // @return {StatusObject}
      delete: function() {
        const id = this.request.getParameter('internalid') ||
          this.data.internalid;
        PMEmployeeModel.delete(id);
        return {status: 'ok'};
      }

    });
  } catch (e) {
    console.warn('PM.Employee.Service.ss' + e.name, e);
    this.sendError(e);
  }
});
