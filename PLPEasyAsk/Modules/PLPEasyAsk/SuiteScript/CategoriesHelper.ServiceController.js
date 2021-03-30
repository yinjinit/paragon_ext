
define(
	'Tavano.PLPEasyAsk.CategoriesHelper.ServiceController'
,	[
		'ServiceController',
		'CategoriesHelper.Model'
	]
,	function(
		ServiceController,
		CategoriesHelper
	)
	{
		'use strict';

		return ServiceController.extend({

			name: 'Tavano.PLPEasyAsk.CategoriesHelper.ServiceController'

			// The values in this object are the validation needed for the current service.
		,	options: {
				common: {
				}
			}

		,	get: function get()
			{
                
                var out = {
                    status : 'NO_RESULTS',
                    data : []
                }
                
				if(this.request.getParameter('id')) {
                    try {
                        var data = CategoriesHelper.get(this.request.getParameter('id'));
                        out.status = 'OK',
                        out.data = JSON.parse(JSON.stringify(data));
                    } catch (error) {
                        out = {
                            status : 'ERROR',
                            message : error.message
                        }
                    }
				}
				
				return out;
			}
		});
	}
);