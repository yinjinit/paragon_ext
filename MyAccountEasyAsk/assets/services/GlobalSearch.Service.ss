
function service(request, response)
{
	'use strict';
	try 
	{
		require('Tavano.MyAccountEasyAsk.GlobalSearch.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Tavano.MyAccountEasyAsk.GlobalSearch.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}