// QuoteEdit.ServiceController.js
// ----------------
// Service to edit quote requests
define('QuoteEdit.ServiceController', [
    'ServiceController',
    'QuoteEdit.Model'
], function QuoteEditServiceController(
    ServiceController,
    QuoteEditModel
) {
    try {
        return ServiceController.extend({
            name: 'QuoteEdit.ServiceController',
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
                    return QuoteEditModel.get('estimate', id);
                }
                return QuoteEditModel.list({
                    filter: this.request.getParameter('filter'),
                    order: this.request.getParameter('order'),
                    sort: this.request.getParameter('sort'),
                    from: this.request.getParameter('from'),
                    to: this.request.getParameter('to'),
                    page: this.request.getParameter('page') || 1,
                    types: this.request.getParameter('types')
                });
            },

            post: function post() {
                var orderInfo;
                QuoteEditModel.update('estimate', this.data.internalid || 'null', this.data);

                orderInfo = QuoteEditModel.get('estimate', this.data.internalid || 'null');

                orderInfo.confirmation = QuoteEditModel.submit();
                return orderInfo;
            },

            put: function put() {
                QuoteEditModel.update('estimate', this.data.internalid, this.data);
                return QuoteEditModel.get('estimate', this.data.internalid);
            }
        });
    } catch (e) {
        this.sendError(e);
        return null;
    }
});
