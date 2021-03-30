define('ShareQuote.ServiceController', [
    'ServiceController',
    'ShareQuote.Model'
], function ShareQuoteServiceController(
    ServiceController,
    ShareQuoteModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'ShareQuote.ServiceController',

        post: function post() {
            return ShareQuoteModel.shareQuote(this.data);
        }
    });
});
