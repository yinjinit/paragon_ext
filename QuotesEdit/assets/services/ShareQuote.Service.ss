
function service(request, response)
{
	'use strict';
	try
	{
		require('ShareQuote.ServiceController').handle(request, response);
	}
	catch(ex)
	{
		console.log('ShareQuote.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}
