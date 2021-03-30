
function service(request, response)
{
	'use strict';
	try 
	{
		require('TavanoTeam.Jantas.Jantas.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('TavanoTeam.Jantas.Jantas.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}