// @module PM.ListHeader.View
define('PM.ListHeader.View', [
  'SC.Configuration',
  'ListHeader.View',
  'GlobalViews.Pagination.View',
  'GlobalViews.ShowingCurrent.View',
  'Backbone',
  'Backbone.View',
  'Backbone.CompositeView',
  'AjaxRequestsKiller',
  'Utils',
  'jQuery',
  'underscore'
], function(
  Configuration,
  ListHeaderView,
  GlobalViewsPaginationView,
  GlobalViewsShowingCurrentView,
  Backbone,
  BackboneView,
  BackboneCompositeView,
  AjaxRequestsKiller,
  Utils,
  $,
  _
) {
  'use strict';

  return {
    mountToApp: function(application) {
      _.extend(ListHeaderView.prototype, {
        events: _.extend(ListHeaderView.prototype.events, {
          'blur [data-action="keyword-filter"]': 'keywordFilterBlur'
        }),
        initialize: _.wrap(ListHeaderView.prototype.initialize,
          function(fn, options) {
            // @property {String} keyword filter
            this.keywordFilter = options.keywordFilter;

            return fn.apply(this, _.toArray(arguments).slice(1));
          }),
        getContext: _.wrap(ListHeaderView.prototype.getContext,
          function(fn) {
            var context = fn.apply(this, _.toArray(arguments).slice(1));

            context.keywordFilter = this.keywordFilter;
            context.keyword = this.keyword;

            return context;
          }),
        updateCollection: _.wrap(ListHeaderView.prototype.updateCollection,
          function(fn) {
            var ret = fn.apply(this, _.toArray(arguments).slice(1)),
              collection = this.collection,
              range;

            if (this.selectedRange) {
              // @class RangeFilter
              // If there is no date selected i keep the range empty in order to get "transactions" dated in the future
              range = {
                // @property {String} from
                from:
                  this.selectedRange.from ||
                  (
                    this.allowEmptyBoundaries ? '' :
                      this.rangeFilterOptions.fromMin
                  ),
                // @property {String} to
                to:
                  this.selectedRange.to ||
                  (
                    this.allowEmptyBoundaries ? '' :
                      this.rangeFilterOptions.toMax
                  )
              };
            }

            // @class Collection.Filter
            if (collection.update) {
              collection.update(
                {
                  // @property {value:String} filter
                  filter: this.selectedFilter,
                  // @property {RangeFilter} range
                  range: range,
                  // @property {value:String} sort
                  sort: this.selectedSort,
                  // @property {String} order
                  order: this.order,
                  page: this.page,
                  // @property {string} keyword
                  keyword: this.keyword,
                  // @property {string} transactionName
                  transactionName: this.transactionName,
                  // @property {Number} killerId
                  killerId: AjaxRequestsKiller.getKillerId()
                },
                this
              );
            }

            return ret;
          }),
        updateUrl: _.wrap(ListHeaderView.prototype.updateUrl,
          function(fn) {
            let url = Backbone.history.fragment;
            // if the selected filter is the default one
            //   remove the filter parameter
            // else change it for the selected value
            url = this.isDefaultFilter(this.selectedFilter)
              ? Utils.removeUrlParameter(url, 'filter')
              : Utils.setUrlParameter(
                url,
                'filter',
                _.isFunction(this.selectedFilter.value)
                  ? this.selectedFilter.value.apply(this.view)
                  : this.selectedFilter.value
              );
            // if the selected sort is the default one remove the sort parameter
            // else change it for the selected value
            url = this.isDefaultSort(this.selectedSort)
              ? Utils.removeUrlParameter(url, 'sort')
              : Utils.setUrlParameter(url, 'sort', this.selectedSort.value);
            // if the selected order is the default one remove the order parameter
            // else change it for the selected value
            url =
              this.order === 1
                ? Utils.removeUrlParameter(url, 'order')
                : Utils.setUrlParameter(url, 'order', 'inverse');
            // if range from and range to are set up change them in the url
            // else remove the parameter
            if (this.selectedRange) {
              url =
                this.selectedRange.from || this.selectedRange.to
                  ? Utils.setUrlParameter(
                  url,
                  'range',
                  (
                    this.selectedRange.from || ''
                  ) + 'to' + (
                  this.selectedRange.to || ''
                  )
                  )
                  : Utils.removeUrlParameter(url, 'range');
            }

            //adding parameters keyword and transactioname
            url = !!this.keyword
              ? Utils.setUrlParameter(url, 'keyword', this.keyword)
              : Utils.removeUrlParameter(url, 'keyword');

            url = !!this.transactionName
              ? Utils.setUrlParameter(url, 'transaction_name',
                this.transactionName)
              : Utils.removeUrlParameter(url, 'transaction_name');

            url = Utils.removeUrlParameter(url, 'page');
            this.page = 1;

            // just go there already, but warn no one
            Backbone.history.navigate(url, {trigger: false});

            return this.updateCollection();
          }),
        // @method keywordFilterBluer
        keywordFilterBlur: function(e) {
          this.keyword = e.target.value;
          this.updateUrl();
        }
      });
    }
  };
});
