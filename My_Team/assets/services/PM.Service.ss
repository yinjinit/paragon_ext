
function service(request, response)
{
	'use strict';
	try 
	{
		require('PM.My_Team.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('PM.My_Team.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}