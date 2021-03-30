
function service(request, response)
{
	'use strict';
	try 
	{
		require('BigBang.Punchout2Go.PunchoutServices.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('BigBang.Punchout2Go.PunchoutServices.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}