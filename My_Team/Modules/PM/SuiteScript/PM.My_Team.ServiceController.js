define('PM.My_Team.ServiceController', ['ServiceController', 'PM.My_Team.Model'], function (
  ServiceController,
  PM_My_Team_Model
) {
  'use strict';

  return ServiceController.extend({
    name: 'PM.My_Team.ServiceController',

    // The values in this object are the validation needed for the current service.
    options: {
      common: {},
    },

    get: function get() {
      var id = this.request.getParameter('internalid');
      nlapiLogExecution('Debug', 'service', 'service');
      nlapiLogExecution('debug', 'customer id from parameter', id);

      return PM_My_Team_Model.getCust(id);
    },

    post: function post() {
      // not implemented
    },

    put: function put() {
      // not implemented
    },

    delete: function () {
      // not implemented
    },
  });
});
