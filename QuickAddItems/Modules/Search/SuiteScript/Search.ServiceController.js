
define(
	'TavanoTeam.QuickAddItems.Search.ServiceController'
,	[
		'ServiceController'
	]
,	function(
		ServiceController
	)
	{
		'use strict';

		return ServiceController.extend({

			name: 'TavanoTeam.QuickAddItems.Search.ServiceController'

			// The values in this object are the validation needed for the current service.
		,	options: {
				common: {
				}
			}

		,	get: function get()
			{
				return 'Hello World I\'m an Extension using a Service!';
			}

		,	post: function post()
			{
				// not implemented
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