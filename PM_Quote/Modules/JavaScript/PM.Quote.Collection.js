// @module PM.Quote.Collection
define('PM.Quote.Collection', [
  'Quote.Collection',
  'underscore'
], function(
  QuoteCollection,
  _
) {
  'use strict';

  return {
    loadModule: function() {
      _.extend(QuoteCollection.prototype, {
        // @method update Method used by the ListHeader to filter the current list when seeing the Quote List
        // @param {Collection.Filter} options
        // @return {Void}
        update: function(options) {
          const range = options.range || {};
          const from = range.from;
          const to = range.to;

          this.fetch({
            data: {
              filter: options.filter.value,
              sort: options.sort.value,
              order: options.order,
              from: from || null,
              to: to || null,
              page: options.page
            },
            reset: true,
            killerId: options.killerId
          });
        }
      });
    }
  };
});
