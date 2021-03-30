define('AddToQuote.Collection', [
    'Backbone.CachedCollection',
    'AddToQuote.Model',
    'underscore'
], function QuoteEditCollection(
    CachedCollection,
    AddToQuoteModel,
    _
) {
    'use strict';

    return CachedCollection.extend({
        url: _.getAbsoluteUrl(getExtensionAssetsPath('services/AddToQuote.Service.ss')),
        model: AddToQuoteModel
    });
});
