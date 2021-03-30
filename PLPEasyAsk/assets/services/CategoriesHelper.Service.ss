
function service(request, response)
{
	'use strict';
	try 
	{
		require('Tavano.PLPEasyAsk.CategoriesHelper.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Tavano.PLPEasyAsk.CategoriesHelper.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}