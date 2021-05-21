// @module PM.Quote
define('PM.Quote', [
  'PM.Quote.List.View',
  'PM.Quote.Collection'
], function(
  QuoteListView,
  QuoteCollection
) {
  'use strict';

  return {
    mountToApp: function() {
      QuoteListView.loadModule();
      QuoteCollection.loadModule();
    }
  };
});

