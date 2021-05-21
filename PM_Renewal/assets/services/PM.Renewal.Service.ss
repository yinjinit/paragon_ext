function service(request, response)
{
	'use strict';
	try 
	{
		require('PM.Renewal.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('PM.Renewal.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}