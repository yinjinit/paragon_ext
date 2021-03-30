
function service(request, response)
{
	'use strict';
	try 
	{
		require('Tavano.PLPEasyAsk.PLPEasyAsk.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Tavano.PLPEasyAsk.PLPEasyAsk.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}