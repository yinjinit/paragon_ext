
function service(request, response)
{
	'use strict';
	try 
	{
		require('Tavano.PDPCnet.CNetUtils.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Tavano.PDPCnet.CNetUtils.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}