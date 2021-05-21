// @module PM.Search.Transaction.List.View
define('PM.Search.Transaction.List.View', [
  'SC.Configuration',
  'PM.Search.Transaction.Model',
  'PM.Search.Transaction.Collection',
  'pm_search_transaction_list.tpl',
  'ListHeader.View',
  'RecordViews.View',
  'Backbone',
  'Backbone.CompositeView',
  'Backbone.CollectionView',
  'GlobalViews.Pagination.View',
  'AjaxRequestsKiller',
  'Utils',
  'jQuery',
  'Handlebars',
  'underscore'
], function(
  Configuration,
  SearchTransactionModel,
  SearchTransactionCollection,
  search_transaction_list_tpl,
  ListHeaderView,
  RecordViewsView,
  Backbone,
  BackboneCompositeView,
  BackboneCollectionView,
  GlobalViewsPaginationView,
  AjaxRequestsKiller,
  Utils,
  $,
  Handlebars,
  _
) {
  'use strict';

  // @class PM.Search.Transaction.List.View @extend BackboneView
  return Backbone.View.extend({
    template: search_transaction_list_tpl,

    isSCISIntegrationEnabled: Configuration.get(
      'siteSettings.isSCISIntegrationEnabled',
      false
    ),
    // @property {String} title
    title: Utils.translate('Search Transactions'),

    page_header: Utils.translate('Search Transaction Results'),

    // @method initialize
    // @param {application:ApplicationSkeleton} options
    // @return {Void}
    initialize: function(options) {
      let page = 1;

      if (options.routerArguments && options.routerArguments[0]) {
        const params = Utils.parseUrlOptions(options.routerArgument);

        if (params.page) {
          page = params.page;
        }
      }

      this.options.page = page;

      this.application = options.application;
      this.collection = new SearchTransactionCollection();

      this.listenCollection();

      this.collection.on('reset', this.showContent, this);

      const today = new Date();
      const isoDate = today.getFullYear() + '-' + (
        today.getMonth() + 1
      ) + '-' + today.getDate();

      this.rangeFilterOptions = {
        fromMin: '1800-01-02',
        fromMax: isoDate,
        toMin: '1800-01-02',
        toMax: isoDate
      };

      this.listHeader = new ListHeaderView({
        view: this,
        application: this.application,
        collection: this.collection,
        filters: this.filterOptions(),
        sorts: this.sortOptions,
        rangeFilter: 'date',
        rangeFilterLabel: Utils.translate('From'),
        hidePagination: true,
        allowEmptyBoundaries: true,
        keywordFilter: true
      });
    },

    // @method listenCollection
    listenCollection: function() {
      this.setLoading(true);

      this.collection.on({
        request: $.proxy(this, 'setLoading', true),
        reset: $.proxy(this, 'setLoading', false)
      });
    },

    // @method setLoading @param {Boolean} bool
    setLoading: function(bool) {
      this.isLoading = bool;
    },

    // @method getSelectedMenu @return {String}
    getSelectedMenu: function() {
      return 'search_transaction';
    },

    // @method getBreadcrumbPages
    // @return {BreadcrumbPage}
    getBreadcrumbPages: function() {
      return {
        text: this.title,
        href: 'search_transaction'
      };
    },

    // @property {Array} filterOptions Array of default filter options filters always apply on the original collection
    // DO NOT CHANGE THE ORDER FOR 'Mfr Part Number'
    // this filter is used to search for item.id on Search.Transaction.Model
    filterOptions: function() {
      //By default search on all the transactions
      return [
        {
          value: 'Estimate,SalesOrd,CustInvc,CashSale',
          name: Utils.translate('Search Type'),
          selected: true
        },
        {
          value: 'Estimate,SalesOrd',
          name: Utils.translate('PO Number'),
          permission: this.isSCISIntegrationEnabled
            ? 'transactions.tranFind.1,transactions.tranPurchases.1' +
            ',transactions.tranFind.1,transactions.tranEstimate.1'
            : 'transactions.tranFind.1,transactions.tranSalesOrd.1' +
            ',transactions.tranFind.1,transactions.tranEstimate.1'
        },
        {
          value: 'SalesOrd',
          name: Utils.translate('Order Number'),
          permission: this.isSCISIntegrationEnabled
            ? 'transactions.tranFind.1,transactions.tranPurchases.1'
            : 'transactions.tranFind.1,transactions.tranSalesOrd.1'
        },
        {
          value: 'Estimate',
          name: Utils.translate('Quote Number'),
          permission: 'transactions.tranFind.1,transactions.tranEstimate.1'
        },
        {
          value: 'CustInvc,CashSale',
          name: Utils.translate('Invoice Number'),
          permission: 'transactions.tranCustInvc.1,transactions.tranCashSale.1'
        },
        {
          value: 'Estimate,SalesOrd,CustInvc,CashSale,MfrPartNumber', //MfrPartNumber is just to make a difference
          name: Utils.translate('Mfr Part Number')
        },
        {
          value: 'Estimate,SalesOrd,CustInvc,CashSale,SearchTransactionName', //SearchTransactionName is just to make a difference
          name: Utils.translate('Transaction Name')
        }
      ];
    },
    // @property {Array} sortOptions Array of default sort options sorts only apply on the current collection
    // which might be a filtered version of the original
    sortOptions: [
      {
        value: 'trandate,internalid',
        name: Utils.translate('by Date'),
        selected: true
      },
      {
        value: 'tranid',
        name: Utils.translate('by Number')
      },
      {
        value: 'amount',
        name: Utils.translate('by Amount')
      }
    ],

    childViews:
      {
        'ListHeader.View': function() {
          return this.listHeader;
        },
        'Records.Collection': function() {
          const records_collection = new Backbone.Collection(
            this.collection.map(function(search_transaction) {
              return new Backbone.Model({
                touchpoint: 'customercenter',
                title: new Handlebars.SafeString(
                  Utils.translate(
                    search_transaction.getTypeLabel() +
                    ' #<span class="tranid">$(0)</span>',
                    search_transaction.get('tranid')
                  )
                ),
                detailsURL: search_transaction.getTypeUrl(),

                id: search_transaction.id,
                internalid: search_transaction.id,

                columns: [
                  {
                    label: Utils.translate('Date:'),
                    type: 'date',
                    name: 'date',
                    value: search_transaction.get('trandate')
                  },
                  {
                    label: Utils.translate('Amount:'),
                    type: 'currency',
                    name: 'amount',
                    value: search_transaction.get('amount_formatted')
                  },
                  {
                    label: Utils.translate('Status:'),
                    type: 'status',
                    name: 'status',
                    value: search_transaction.get('status').name
                  }
                ]
              });
            })
          );

          return new BackboneCollectionView({
            childView: RecordViewsView,
            collection: records_collection,
            viewsPerRow: 1
          });
        },
        'GlobalViews.Pagination': function() {
          return new GlobalViewsPaginationView(
            _.extend(
              {
                totalPages: Math.ceil(
                  this.collection.totalRecordsFound /
                  this.collection.recordsPerPage
                )
              },
              Configuration.defaultPaginationSettings
            )
          );
        }
      },

    // @method getContext @return {TransactionHistory.List.View.Context}
    getContext: function() {
      // @class TransactionHistory.List.View.Context
      return {
        // @property {String} pageHeader
        pageHeader: this.page_header,
        // @property {Boolean} isThereAnyResult
        isThereAnyResult: !!this.collection.length,
        // @property {Boolean} isLoading
        isLoading: this.isLoading,
        // @property {Boolean} showPagination
        showPagination: !!(
          this.collection.totalRecordsFound && this.collection.recordsPerPage
        ),
        // @property {Boolean} showCurrentPage
        showCurrentPage: this.options.showCurrentPage
      };
    }
  });
});
