
function service(request, response)
{
	'use strict';
	try 
	{
		require('Tavano.PDPCnet.NetsuiteUtils.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Tavano.PDPCnet.NetsuiteUtils.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}