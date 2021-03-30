define('QuoteEdit.Quote.Model', [
    'Quote.Model',
    'underscore'
], function QuoteEditQuoteModel(
    QuoteModel,
    _
) {
    'use strict';

    _.extend(QuoteModel.prototype, {
        validation: _.extend(QuoteModel.prototype.validation || {}, {
            customname: {
                required: true,
                msg: 'Name is required'
            }
        })
    });
});
