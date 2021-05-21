// @module PM.ProductList
define('PM.ProductList', [
  'PM.ProductList.Lists.View',
  'PM.ProductList.DisplayFull.View'
], function(
  ProductListListsView,
  ProductListDisplayFullView
) {
  'use strict';

  return {
    mountToApp: function() {
      ProductListListsView.loadModule();
    }
  };
});
