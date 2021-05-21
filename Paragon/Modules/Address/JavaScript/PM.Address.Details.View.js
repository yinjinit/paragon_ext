// @module PM.Address.Details.View
define('PM.Address.Details.View', [
  'Address.Details.View',
  'pm_address_details.tpl',
  'underscore',
], function(
  AddressDetailsView,
  address_details_tpl,
  _,
) {
  'use strict';

  return {
    loadModule: function loadModule() {
      _.extend(AddressDetailsView.prototype, {
        //@property {Function} template
        template: address_details_tpl,

        // @method getContext @return PM.Address.Details.View.Context
        getContext: _.wrap( AddressDetailsView.prototype.getContext, function(fn) {
          var context = fn.apply(this, _.toArray(arguments).slice(1));

          context.isSelected = this.model.get('internalid') === this.options.selectedAddressId;

          return context;
        })
      });
    }
  };
});
