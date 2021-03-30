
function service(request, response)
{
    'use strict';
    try
    {
        require('QuoteEdit.ServiceController').handle(request, response);
    }
    catch(ex)
    {
        console.log('QuoteEdit.ServiceController ', ex);
        var controller = require('ServiceController');
        controller.response = response;
        controller.request = request;
        controller.sendError(ex);
    }
}
