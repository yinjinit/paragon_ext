/**
 * @module PDP.Cnet.ProductList.ControlItem.View
 * @desc wrap addItemToList to add necessary information for the item creation
 */
define('PM.ProductList.DisplayFull.View', [
  'ProductList.DisplayFull.View',
  'Item.KeyMapping',
  'underscore'
], function(
  ProductListDisplayFullView,
  ItemKeyMapping,
  _
) {
  'use strict';

  _.extend(ProductListDisplayFullView.prototype, {
    getContext: _.wrap(ProductListDisplayFullView.prototype.getContext,
      function(fn) {
        var context = fn.apply(this, _.toArray(arguments).slice(1));

        context.mpn = context.productName;
        context.productName = this.model.get('item').get('displayname') ?
          this.model.get('item').get('displayname') : context.productName;

        return context;
      })
  });

  _.extend(ItemKeyMapping.prototype, {
    getKeyMapping: _.wrap(ItemKeyMapping.getKeyMapping,
      function(fn) {
        var keyMapping = fn.apply(this,
          _.toArray(arguments).slice(1));

        return _.extend(keyMapping, {
          _url: function(item) {

            var matrixParent = item.get('_matrixParent');

            // If this item is a child of a matrix return the URL of the parent
            if (!_.isEmpty(matrixParent) && matrixParent.get('internalid')) {
              return item.get('_matrixParent').get('_url');
            }

            // if its a standard version we need to send it to the canonical URL
            if (SC.ENVIRONMENT.siteType && SC.ENVIRONMENT.siteType ===
              'STANDARD') {
              return item.get('canonicalurl');
            }

            if (
              SC.Configuration &&
              SC.Configuration.isSCIS &&
              item.get('itemoptions_detail') &&
              item.get('itemoptions_detail').parentid &&
              item.get('itemoptions_detail').matrixtype === 'child'
            ) {
              return item.get('urlcomponent')
                ? '/' + item.get('urlcomponent')
                : '/product/' + item.get('itemoptions_detail').parentid;
            }

            // Other ways it will use the URL component or a default /product/ID

            var mpn = item.get('itemid');
            var price = item.get('price');
            var cat = item.get('custitem_gvo_category');
            var weight = item.get('weight');
            var easy_ask_item = item.get('easy_ask_item');

            /**
             * For the items that comes from easy ask, we build the url based on the easy ask parameters
             * In other case, we can be sure that we are not on the PLP
             */
            if (easy_ask_item) {
              return item.get('urlcomponent')
                ? '/' + item.get('urlcomponent')
                : '/product/' + item.get('itemid') + '?quantity=1' + '&mpn=' +
                mpn +
                '&price=' + price + '&cat=' + cat + '&weight=' + weight;
            } else {

              var itemIdOnUrl = item.get('custitem_pm_cnet_id') || '';

              mpn = mpn ? mpn.replace(/#/g, '__') : '';
              // return '/product/' + item.get('custitem_pm_cnet_id') + "?quantity=1" + "&mpn=" + itemIdOnUrl.replace(/#/g, '__') + "&price=" + item.getPrice().price + "&cat=" + item.get("custitem_gvo_category") + "&weight=" + item.get("weight");
              return '/product/' + itemIdOnUrl + '?quantity=1' + '&mpn=' +
                mpn +
                '&price=' + item.getPrice().price + '&cat=' + cat ||
                item.get('custitem_gvo_category') + '&weight=' +
                item.get('weight');
            }
          }
        });
      })
  });
});
