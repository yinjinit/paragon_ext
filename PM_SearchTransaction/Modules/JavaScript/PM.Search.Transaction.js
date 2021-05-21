// @module PM.Search.Transaction
define('PM.Search.Transaction', [
  'PM.Search.Transaction.List.View',
  'Invoice.Details.View',
  'Quote.Details.View',
  'Receipt.Details.View',
  'OrderHistory.Details.View'
], function(
  SearchTransactionListView,
  InvoiceDetailsView,
  QuoteDetailsView,
  ReceiptDetailsView,
  OrderHistoryDetailsView
) {
  'use strict';

  return {
    mountToApp: function(container) {
      const pageType = container.getComponent('PageType');

      pageType.registerPageType({
        name: 'SearchTransaction',
        routes: ['search_transaction'],
        view: SearchTransactionListView,
        defaultTemplate: {
          name: 'pm_search_transaction_list.tpl',
          displayName: 'Search Transactions List',
          thumbnail: null
        }
      });

      pageType.registerPageType({
        name: 'SearchTransactionInvoiceDetail',
        routes: ['search_transaction/invoices/:id'],
        view: InvoiceDetailsView
      });

      pageType.registerPageType({
        name: 'SearchTransactionQuoteDetail',
        routes: ['search_transaction/quotes/:id'],
        view: QuoteDetailsView
      });

      pageType.registerPageType({
        name: 'SearchTransactionReceiptDetail',
        routes: ['search_transaction/receipts/view/:id'],
        view: ReceiptDetailsView
      });

      pageType.registerPageType({
        name: 'SearchTransactionPurchaseDetail',
        routes: ['search_transaction/purchases/view/:recordtype/:id'],
        view: OrderHistoryDetailsView
      });
    }
  };
});
