define('Quotes.List.View.Name', [
    'Quote.List.View',
    'Backbone.CollectionView',
    'RecordViews.View',
    'Backbone',
    'SC.Configuration',
    'Utils'
], function QuotesItemSummaryView(
    QuotesListView,
    BackboneCollectionView,
    RecordViewsView,
    Backbone,
    Configuration,
    Utils
) {
    /* eslint-disable */
    QuotesListView.prototype.filterOptions = [{}];
    QuotesListView.prototype._buildResultsView = function _buildResultsView() {
        var self = this;
        var records_collection = new Backbone.Collection(this.collection.map(function (quote) {
            var quote_internalid = quote.get('internalid');
            var selectedColumns = [];
            if (!Configuration.get().transactionListColumns.enableQuote) {
                selectedColumns.push({
                    label: 'Request date:',
                    type: 'request-date',
                    name: 'request-date',
                    id: 'trandate'
                });
                selectedColumns.push({
                    label: 'Name:',
                    type: 'request-date',
                    name: 'request-date',
                    id: 'customname'
                });

                selectedColumns.push({
                    label: 'Amount:',
                    type: 'currency',
                    name: 'amount-date',
                    id: 'total_formatted'
                });

                selectedColumns.push({
                    label: 'Expiration date:',
                    type: 'expiration-date',
                    name: 'expiration-date',
                    compositeKey: 'QuoteListExpirationDateView',
                    composite: 'Quote.ListExpirationDate.View'
                });
                /*
                selectedColumns.push({
                    label: 'Status:',
                    type: 'status',
                    name: 'status',
                    id: 'status'
                });
                 */
            } else {
                selectedColumns = Configuration.get().transactionListColumns.quote;
            }
            return new Backbone.Model({
                touchpoint: 'customercenter',
                title: Utils.translate('Quote #$(0)', quote.get('tranid')),
                detailsURL: '#/quotes/' + quote_internalid,
                id: quote_internalid,
                internalid: quote_internalid,
                columns: self._buildColumns(selectedColumns, quote)
            });
        }));
        return new BackboneCollectionView({
            childView: RecordViewsView,
            collection: records_collection,
            viewsPerRow: 1
        });
    }
    /* eslint-disable */
});
