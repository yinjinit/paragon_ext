
function service(request, response)
{
	'use strict';
	try 
	{
		require('TavanoTeam.QuickAddItems.Search.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('TavanoTeam.QuickAddItems.Search.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}