
define(
	'ParagonMicro.PM_Renewal.PMRenewal.ServiceController'
,	[
		'ServiceController'
	,	'PMRenewal.Model'
	]
,	function(
		ServiceController
	,   PMRenewalModel
	)
	{
		'use strict';
     try
     {
		return ServiceController.extend({

			name: 'ParagonMicro.PM_Renewal.PMRenewal.ServiceController'

			// The values in this object are the validation needed for the current service.
		,	options: {
				common: {
					requireLogin: true
				}
			}

		,	get: function get()
			{
				//console.log('Hello World I\'m an Extension using a Service!');
				//return 'Hello World I\'m an Extension using a Service!';
				var id = this.request.getParameter('internalid');
				//console.log('id from service controller');
                //console.log(id);
					if (id)
					{
						//return PMRenewalModel.get('estimate', id);
						return PMRenewalModel.get(id);
					}
					else
					{
						return PMRenewalModel.search({
							filter: request.getParameter('filter')
						,	companyfilter: request.getParameter('companyfilter')
						,   order: request.getParameter('order')
	                    ,   sort: request.getParameter('sort')
	                    ,   from: request.getParameter('from')
	                    ,   to: request.getParameter('to')
	                    ,   page: request.getParameter('page') || 1
					});
					}
			}

		,   post: function post()
            {
                var new_renewal_id = PMRenewalModel.create(nlapiGetUser(), this.data);
                return PMRenewalModel.get(new_renewal_id);
                //Application.sendContent(Renewal.get(new_renewal_id));
            }

        ,   put: function put()
            {
            	//nlapiLogExecution ('error' , 'put update error' , JSON.stringify(this.data));
                var id = this.request.getParameter('internalid');
                PMRenewalModel.update(id, this.data);
                return PMRenewalModel.get(id);
            }
            
        ,   delete: function()
            {
                var id = this.request.getParameter('internalid');
                PMRenewalModel.remove(id);
                return { status: 'ok' };
            }
		});
	} catch(e){
		console.warn('PMRenewal.Service.ss' + e.name, e);
		this.sendError(e);
	}

	}
);