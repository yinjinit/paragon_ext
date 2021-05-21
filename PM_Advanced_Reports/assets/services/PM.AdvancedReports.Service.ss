
function service(request, response)
{
	'use strict';
	try 
	{
		require('PM.AdvancedReports.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('PM.AdvancedReports.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}