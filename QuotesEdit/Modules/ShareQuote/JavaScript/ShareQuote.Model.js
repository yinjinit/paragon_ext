define('ShareQuote.Model', [
    'Backbone',
    'underscore',
    'Utils'
], function QuoteEditModel(
    Backbone,
    _,
    Utils
) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: _.getAbsoluteUrl(getExtensionAssetsPath('services/ShareQuote.Service.ss')),
        validation: {
            sendTo: {
                required: true,
                pattern: 'email',
                msg: Utils.translate('Valid Email is required')
            }
        }
    });
});
