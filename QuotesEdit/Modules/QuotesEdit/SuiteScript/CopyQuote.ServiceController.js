// QuoteEdit.ServiceController.js
// ----------------
// Service to edit quote requests
define('CopyQuote.ServiceController', [
    'ServiceController',
    'QuoteEdit.Model'
], function QuoteEditServiceController(
    ServiceController,
    QuoteEditModel
) {
    try {
        return ServiceController.extend({
            name: 'CopyQuote.ServiceController',
            options: {
                common: {
                    requireLogin: true,
                    requirePermissions: {
                        list: ['transactions.tranEstimate.1', 'transactions.tranFind.1']
                    }
                }
            },

            put: function put() {
                return QuoteEditModel.copy('estimate', this.data.internalid);
            }
        });
    } catch (e) {
        this.sendError(e);
        return null;
    }
});
