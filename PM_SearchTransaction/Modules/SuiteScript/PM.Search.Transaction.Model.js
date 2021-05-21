// PM.Search.Transaction.Model.js
// ----------------
// Handles searching Transaction History
define('PM.Search.Transaction.Model', [
  'SC.Model',
  'Application',
  'Utils',
  'Transaction.Model'
], function(SCModel, Application, Utils, Transaction) {
  return Transaction.extend({
    setExtraListFilters: function() {
      this.filters.types_operator = 'and';
      this.filters.types = ['type', 'anyof', this.data.filter.split(',')];

      //custom filter added | for any that is not 'Mfr Part Number'
      if (this.data.filter !==
        'Estimate,SalesOrd,CustInvc,CashSale,MfrPartNumber' && (
          !!this.data.keyword
        )) {
        this.filters.keyword_operator = 'and';
        this.filters.keyword = [
          [
            ['transactionnumbertext', 'haskeywords', this.data.keyword],
            'or',
            ['poastext', 'contains', this.data.keyword],
            'or',
            ['custbody_customer_po_no', 'contains', this.data.keyword]
          ]
        ];
      }
      //custom filter if 'SearchTransactionName' was selected as a filter
      if (this.data.filter ===
        'Estimate,SalesOrd,CustInvc,CashSale,SearchTransactionName' && (
          !!this.data.keyword
        )) {

        this.filters.transactionName_operator = 'and';
        this.filters.transactionName =
          ['custbody_transaction_name', 'contains', this.data.keyword];
      }
      //custom filter if 'Mfr Part Number' was selected as a filter
      if (this.data.filter ===
        'Estimate,SalesOrd,CustInvc,CashSale,MfrPartNumber' && (
          !!this.data.keyword
        )) {

        this.filters.mainline_operator = 'and';
        this.filters.mainline = ['mainline', 'is', 'F'];

        this.filters.itemid_operator = 'and';
        this.filters.itemid = ['item.itemid', 'is', this.data.keyword];
      }
    }
  });
});