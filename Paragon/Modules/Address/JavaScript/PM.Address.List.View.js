// @module PM.Address.List.View
define('PM.Address.List.View', [
  'Address.List.View',
  'pm_address_list.tpl',
  'underscore',
], function(
  AddressListView,
  address_list_tpl,
  _,
) {
  'use strict';

  return {
    loadModule: function loadModule() {
      _.extend(AddressListView.prototype, {
        //@property {Function} template
        template: address_list_tpl,
      });
    }
  };
});
