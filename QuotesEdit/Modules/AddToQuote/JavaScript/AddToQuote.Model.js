define('AddToQuote.Model', [
    'Backbone',
    'underscore'
], function QuoteEditModel(
    Backbone,
    _
) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: _.getAbsoluteUrl(getExtensionAssetsPath('services/AddToQuote.Service.ss')),
        checked: function checked() {}
    });
});
