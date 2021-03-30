// QuoteEdit.ServiceController.js
// ----------------
// Service to edit quote requests
define('AddToQuote.ServiceController', [
    'ServiceController',
    'AddToQuote.Model'
], function AddToQuoteServiceController(
    ServiceController,
    AddToQuoteModel
) {
    try {
        return ServiceController.extend({
            name: 'AddToQuote.ServiceController',
            options: {
                common: {
                    requireLogin: true,
                    requirePermissions: {
                        list: ['transactions.tranEstimate.1', 'transactions.tranFind.1']
                    }
                }
            },

            get: function get() {
                var id = this.request.getParameter('internalid');
                if (id) {
                    return AddToQuoteModel.get('estimate', id);
                }
                return AddToQuoteModel.list({
                    filter: this.request.getParameter('filter'),
                    order: this.request.getParameter('order'),
                    sort: this.request.getParameter('sort'),
                    from: this.request.getParameter('from'),
                    to: this.request.getParameter('to'),
                    page: this.request.getParameter('page') || 1,
                    types: this.request.getParameter('types')
                });
            },

            put: function put() {
                AddToQuoteModel.addItemsToQuote(this.data.internalid, this.data.items);
                return AddToQuoteModel.list({});
            },

            delete: function deleteFn() {
                AddToQuoteModel.removeItemsFromQuote(this.data.internalid, this.data.items);
                return AddToQuoteModel.list({});
            }
        });
    } catch (e) {
        this.sendError(e);
        return null;
    }
});
