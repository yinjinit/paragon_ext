
function service(request, response)
{
	'use strict';
	try 
	{
		require('ParagonMicro.PM_Renewal.PMRenewal.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('ParagonMicro.PM_Renewal.PMRenewal.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}