define('QuoteEdit.Quote.Model', [
    'Quote.Model',
    'QuoteEdit.Model',
    'underscore'
], function QuoteEditQuoteModel(
    QuoteModel,
    QuoteEditModel,
    _
) {
    'use strict';

    _.extend(QuoteModel, {
        setExtraListColumns: _.wrap(QuoteModel.setExtraListColumns, function setExtraListColumns(fn) {
            var self = this;
            fn.apply(this, _.toArray(arguments).slice(1));

            _.each(QuoteEditModel.customfields, function eachCustomField(customField, fieldName) {
                self.columns[fieldName] = new nlobjSearchColumn(customField);
            });
        }),

        mapListResult: _.wrap(QuoteModel.mapListResult, function mapListResult(fn, result, record) {
            var mapResult = fn.apply(this, _.toArray(arguments).slice(1));

            _.each(QuoteEditModel.customfields, function eachCustomField(customField, fieldName) {
                result[fieldName] = record.getValue(customField);
            });

            return mapResult;
        }),

        postGet: function postGet() {
            var self = this;
            _.each(QuoteEditModel.customfields, function eachCustomField(customField, fieldName) {
                self.result[fieldName] = self.record.getFieldValue(customField);
            });
        },

        setTransactionBodyCustomFields: _.wrap(QuoteModel.setTransactionBodyCustomFields, function setTransactionBodyCustomFields(fn) {
            var self = this;
            fn.apply(this, _.toArray(arguments).slice(1));

            _.each(QuoteEditModel.customfields, function eachCustomField(customField, fieldName) {
                if (self.data[fieldName]) {
                    self.record.setFieldValue(customField, self.data[fieldName]);
                }
            });
        })
    });
});
