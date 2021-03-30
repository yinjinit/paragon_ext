
function service(request, response)
{
	'use strict';
	try 
	{
		require('PM.PM_Advanced_Reports.PMAdvancedReports.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('PM.PM_Advanced_Reports.PMAdvancedReports.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}