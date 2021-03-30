
function service(request, response)
{
    'use strict';
    try
    {
        require('AddToQuote.ServiceController').handle(request, response);
    }
    catch(ex)
    {
        console.log('AddToQuote.ServiceController ', ex);
        var controller = require('ServiceController');
        controller.response = response;
        controller.request = request;
        controller.sendError(ex);
    }
}
