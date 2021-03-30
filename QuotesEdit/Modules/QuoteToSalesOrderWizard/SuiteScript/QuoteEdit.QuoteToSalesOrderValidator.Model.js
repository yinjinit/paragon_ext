define('QuoteEdit.QuoteToSalesOrderValidator.Model', [
    'QuoteToSalesOrderValidator.Model',
    'underscore'
], function QuoteEditQuoteToSalesOrderValidatorModel(
    QuoteToSalesOrderValidatorModel,
    _
) {
    'use strict';

    QuoteToSalesOrderValidatorModel.purchasableQuoteConditions = _.filter(QuoteToSalesOrderValidatorModel.purchasableQuoteConditions,
        function excludeConditions(condition) {
            return condition.errorCode !== 'INVALIDENTITYSTATUS' && condition.errorCode !== 'MISSINGSALESREP';
        });
});
