
define(
	'Paragon.EasyAskExtension.EasyAskExtension.ServiceController'
,	[
		'ServiceController'
	,	'Paragon.EasyAskExtension.EasyAskExtension'
	]
,	function(
		ServiceController
	,	ParagonEasyAskExtension
	)
	{
		'use strict';

		return ServiceController.extend({

			name: 'Paragon.EasyAskExtension.EasyAskExtension.ServiceController'

			// The values in this object are the validation needed for the current service.
		,	options: {
				common: {
				}
			}

		,	get: function get()
			{

			}

		,	post: function post()
			{
				this.sendContent(ParagonEasyAskExtension.create(this.data), {'status': 201});
			}

		,	put: function put()
			{
				// not implemented
			}
			
		,	delete: function()
			{
				// not implemented
			}
		});
	}
);