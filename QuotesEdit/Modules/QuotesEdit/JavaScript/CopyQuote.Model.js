define('CopyQuote.Model', [
    'Quote.Model',
    'underscore'
], function QuoteEditModel(
    QuoteModel,
    _
) {
    'use strict';

    return QuoteModel.extend({
        urlRoot: _.getAbsoluteUrl(getExtensionAssetsPath('services/CopyQuote.Service.ss?recordtype=estimate'))
    });
});
