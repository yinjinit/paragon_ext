function service(request, response)
{
	'use strict';
	try
	{
		require('PM.Employee.ServiceController').handle(request, response);
	}
	catch(ex)
	{
		console.log('PM.Employee.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}