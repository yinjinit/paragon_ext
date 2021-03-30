define('QuoteEdit.Model', [
    'Quote.Model',
    'underscore'
], function QuoteEditModel(
    QuoteModel,
    _
) {
    'use strict';

    return QuoteModel.extend({
        urlRoot: _.getAbsoluteUrl(getExtensionAssetsPath('services/QuoteEdit.Service.ss?recordtype=estimate'))
    });
});
