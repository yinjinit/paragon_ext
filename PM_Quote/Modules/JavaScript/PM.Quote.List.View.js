// @module PM.Quote.List.View
define('PM.Quote.List.View', [
  'SC.Configuration',
  'ListHeader.View',
  'Quote.List.View',
  'Utils',
  'underscore'
], function(
  Configuration,
  ListHeaderView,
  QuoteListView,
  Utils,
  _
) {
  'use strict';

  return {
    loadModule: function() {
      _.extend(QuoteListView.prototype, {
        // @method setupListHeader Initialize the list header component
        // @return {Void}
        setupListHeader: function() {
          var today = new Date(),
            isoDate = today.getFullYear() + '-' + (
              today.getMonth() + 1
            ) + '-' + today.getDate();

          this.rangeFilterOptions = {
            fromMin: '1800-01-02',
            fromMax: isoDate,
            toMin: '1800-01-02',
            toMax: isoDate
          };

          // manges sorting and filtering of the collection
          this.listHeader = new ListHeaderView({
            view: this,
            application: this.application,
            collection: this.collection,
            filters: this.filterOptions,
            sorts: this.sortOptions,
            rangeFilter: 'date',
            rangeFilterLabel: Utils.translate('From'),
            allowEmptyBoundaries: true
          });
        }
      });
    }
  };
});
