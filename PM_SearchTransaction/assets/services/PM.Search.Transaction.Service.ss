function service(request, response)
{
	'use strict';
	try 
	{
		require('PM.Search.Transaction.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('PM.Search.Transaction.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}