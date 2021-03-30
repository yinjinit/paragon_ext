
function service(request, response)
{
	'use strict';
	try
	{
		require('CopyQuote.ServiceController').handle(request, response);
	}
	catch(ex)
	{
		console.log('CopyQuote.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}
