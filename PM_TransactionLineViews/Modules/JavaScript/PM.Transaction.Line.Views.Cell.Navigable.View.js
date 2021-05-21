// @module PM.Transaction.Line.Views.Cell.Navigable.View
define('PM.Transaction.Line.Views.Cell.Navigable.View', [
  'Transaction.Line.Views.Cell.Navigable.View',
  'underscore'
], function(
  TransactionLineViewsCellNavigableView,
  _
) {
  'use strict';

  return {
    mountToApp: function(application) {
      _.extend(TransactionLineViewsCellNavigableView.prototype, {
        getContext: _.wrap(
          TransactionLineViewsCellNavigableView.prototype.getContext,
          function(fn) {
            var context = fn.apply(this, _.toArray(arguments).slice(1)),
              item = this.model.get('item');

            // Override itemid with displayname on inventory items
            context.itemName = item.get('displayname') || '';

            return context;
          })
      });
    }
  };
});
