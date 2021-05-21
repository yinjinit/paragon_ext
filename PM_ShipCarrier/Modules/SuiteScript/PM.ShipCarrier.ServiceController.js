// PM.ShipCarrier.ServiceController.js
// ----------------
// Service to manage profile requests
define('PM.ShipCarrier.ServiceController', [
  'ServiceController',
  'SC.Models.Init',
  'PM.ShipCarrier.Model'
], function(
  ServiceController,
  ModelsInit,
  ShipCarrierModel
) {
  // @class PM.ShipCarrier.ServiceController Manage profile requests
  // @extend ServiceController
  return ServiceController.extend({
    // @property {String} name Mandatory for all ssp-libraries model
    name: 'PM.ShipCarrier.ServiceController',

    // @property {Service.ValidationOptions} options.
    // All the required validation, permissions, etc.
    // The values in this object are the validation needed for the current service.
    // Can have values for all the request methods ('common' values) and specific for each one.
    options: {
      common: {
        requireLoggedInPPS: true
      },
      put: {
        requireLogin: true
      }
    },

    // @method get The call to Profile.Service.ss with http method 'get'
    // is managed by this function
    // @return {Profile.Model.Item}
    get: function() {
      return ShipCarrierModel.get();
    },

    // @method put The call to Profile.Service.ss with http method 'put'
    // is managed by this function
    // @return {Profile.Model.Item}
    put: function() {
      // Pass the data to the Profile's update method and send it response
      ShipCarrierModel.update(this.data);
      return ShipCarrierModel.get();
    }
  });
});
