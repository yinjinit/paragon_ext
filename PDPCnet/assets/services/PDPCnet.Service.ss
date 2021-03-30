
function service(request, response)
{
	'use strict';
	try 
	{
		require('Tavano.PDPCnet.PDPCnet.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Tavano.PDPCnet.PDPCnet.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}