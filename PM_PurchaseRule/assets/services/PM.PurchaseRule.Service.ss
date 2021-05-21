function service(request, response)
{
	'use strict';
	try 
	{
		require('PM.PurchaseRule.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('PM.PurchaseRule.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}