define('Quotes.Item.Actions.View', [
    'Cart.Item.Actions.View',
    'underscore'
], function QuotesItemActionsView(
    CartItemActionsView,
    _
) {
    'use strict';

    return CartItemActionsView.extend({
        getContext: _.wrap(CartItemActionsView.prototype.getContext, function wrapGetContext(fn) {
            var originalContext = fn.apply(this, _.toArray(arguments).slice(1));
            originalContext.isAdvanced = false;
            return originalContext;
        })
    });
});
