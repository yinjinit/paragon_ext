define('PM.Renewal.ServiceController', [
  'ServiceController',
  'PM.Renewal.Model'
], function(
  ServiceController,
  RenewalModel
) {
  'use strict';

  try {
    return ServiceController.extend({

      name: 'PM.Renewal.ServiceController'

      // The values in this object are the validation needed for the current service.
      , options: {
        common: {
          requireLogin: true
        }
      }

      , get: function get() {
        //console.log('Hello World I\'m an Extension using a Service!');
        //return 'Hello World I\'m an Extension using a Service!';
        var id = this.request.getParameter('internalid');
        //console.log('id from service controller');
        //console.log(id);
        if (id) {
          //return RenewalModel.get('estimate', id);
          return RenewalModel.get(id);
        } else {
          return RenewalModel.search({
            filter: request.getParameter('filter')
            , companyfilter: request.getParameter('companyfilter')
            , order: request.getParameter('order')
            , sort: request.getParameter('sort')
            , from: request.getParameter('from')
            , to: request.getParameter('to')
            , page: request.getParameter('page') || 1
          });
        }
      }

      , post: function post() {
        var new_renewal_id = RenewalModel.create(nlapiGetUser(), this.data);
        return RenewalModel.get(new_renewal_id);
        //Application.sendContent(Renewal.get(new_renewal_id));
      }

      , put: function put() {
        //nlapiLogExecution ('error' , 'put update error' , JSON.stringify(this.data));
        var id = this.request.getParameter('internalid');
        RenewalModel.update(id, this.data);
        return RenewalModel.get(id);
      }

      , delete: function() {
        var id = this.request.getParameter('internalid');
        RenewalModel.remove(id);
        return {status: 'ok'};
      }
    });
  } catch (e) {
    console.warn('PM.Renewal.Service.ss' + e.name, e);
    this.sendError(e);
  }

});