// @module PM.ProductList.Lists.View
define('PM.ProductList.Lists.View', [
  'ProductList.Model',
  'ProductList.Lists.View',
  'Utils',
  'underscore'
], function(
  ProductListModel,
  ProductListListsView,
  Utils,
  _
) {
  'use strict';

  return {
    loadModule: function() {
      _.extend(ProductListListsView.prototype, {
        deleteListHandler: _.wrap(
          ProductListListsView.prototype.deleteListHandler,
          function(fn) {
            var self = arguments[1].context,
              target = arguments[1].target,
              list = self.getListFromDom(jQuery(target));

            self.collection.remove(list);
            list.url = ProductListModel.prototype.url;
            list.destroy().done(function() {
              self.render();
              self.showConfirmationMessage(
                Utils.translate(
                  'Your <span class="product-list-name">$(0)</span> list was removed',
                  list.get('name')
                )
              );

              if (self.deleteConfirmationView &&
                self.deleteConfirmationView.$containerModal) {
                self.deleteConfirmationView.$containerModal
                  .removeClass('fade')
                  .modal('hide')
                  .data('bs.modal', null);
              }
            });
          })
      });
    }
  };
});
