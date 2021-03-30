define('QuoteEdit.QuoteToSalesOrder.ServiceController', [
    'QuoteToSalesOrder.ServiceController',
    'QuoteToSalesOrder.Model',
    'underscore'
], function QuoteEditQuoteToSalesOrderServiceController(
    QuoteToSalesOrderServiceController,
    QuoteToSalesOrderModel,
    _
) {
    'use strict';

    _.extend(QuoteToSalesOrderServiceController, {
        post: function () {
            var quoteId = this.request.getParameter('quoteid');
            var salesorderId = this.request.getParameter('salesorderid');
            var orderInfo;
            // Updates the order with the passed in data
            QuoteToSalesOrderModel.update(salesorderId, quoteId, this.data);
            // Gets the status
            orderInfo = QuoteToSalesOrderModel.get(salesorderId, quoteId, true);
            // Finally Submits the order
            orderInfo.confirmation = QuoteToSalesOrderModel.submit();
            // Override tempid with the real sales order id that have been created
            orderInfo.internalid = orderInfo.confirmation.internalid;
            orderInfo.tranid = orderInfo.confirmation.tranid || orderInfo.tranid;
            return orderInfo;
        }
    })
})
