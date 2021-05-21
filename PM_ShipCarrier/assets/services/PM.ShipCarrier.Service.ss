function service(request, response)
{
	'use strict';
	try 
	{
		require('PM.ShipCarrier.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('PM.ShipCarrier.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}