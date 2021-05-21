// @module PM.OrderWizard.Module.Address
define('PM.OrderWizard.Module.Address', [
  'OrderWizard.Module.Address',
  'pm_order_wizard_address_module.tpl',
  'PM.Address.Search.View',
  'Backbone',
  'underscore'
], function(
  OrderWizardModule,
  order_wizard_address_module_tpl,
  AddressSearchView,
  Backbone,
  _
) {
  'use strict';

  return {
    loadModule: function loadModule() {
      _.extend(OrderWizardModule.prototype, {
        //@property {Function} template
        template: order_wizard_address_module_tpl,

        initialize: _.wrap(OrderWizardModule.prototype.initialize,
          function(fn) {
            this.itemsPerRow = 1;
            this.hideRemoveButton = true;

            fn.apply(this, _.toArray(arguments).slice(1));
          }),

        // @method markSameAs @param {Boolean} is_checked
        markSameAs: _.wrap(
          OrderWizardModule.prototype.markSameAs, function() {
            var is_checked = arguments[1];

            this.sameAs = is_checked;

            this.model.set('sameAs', is_checked);

            this.setAddress(is_checked ? this.model.get(this.sameAsManage) : null);

            this.tempAddress = is_checked ? this.model.get('temp' + this.sameAsManage) : null;

            this.render();
          }),

        // @method getAddressListOptions Get the object containing the options to be passed to the Address.Details view when rendering the list of available addresses
        // @return {showSelect:Boolean,selectMessage:String,hideDefaults:Boolean}
        getAddressListOptions: _.wrap(
          OrderWizardModule.prototype.getAddressListOptions, function(fn) {
            var options = fn.apply(this, _.toArray(arguments).slice(1));

            options.hideSelector = true;
            options.hideRemoveButton = true;

            return options;
          }),

        // @method selectAddress @parma {Event} event
        selectAddress: _.wrap(
          OrderWizardModule.prototype.selectAddress, function(fn) {
            this.showAddressList = false;
            fn.apply(this, _.toArray(arguments).slice(1));
          }),

        // @method changeAddress @parma {Boolean} is_disabled
        changeAddress: _.wrap(
          OrderWizardModule.prototype.changeAddress, function(fn) {
            if (arguments[1]) {
              return;
            }

            if (this.options.edit_url) {
              this.unsetAddress(true);

              Backbone.history.navigate(this.options.edit_url + '?force=true', {
                trigger: true
              });
            } else {
              this.showAddressList = true;
              this.render();
            }
          }),

        childViews: _.extend(OrderWizardModule.prototype.childViews, {
          'Address.Search': function() {
            return new AddressSearchView({
              addresses: this.addresses,
              manage: this.manage,
              showActionButtons: !this.isGuest,
              showRemoveButton: !this.hideRemoveButton
            });
          }
        }),

        // @method getContext @return {OrderWizard.Module.Address.Context}
        getContext: _.wrap(
          OrderWizardModule.prototype.getContext, function(fn) {
            var context = fn.apply(this, _.toArray(arguments).slice(1));

            console.log(this);
            console.log(this.showAddressList);
            context.showSingleAddressDetails =
              !this.showAddressList && context.showSingleAddressDetails;

            return context;
          })
      });
    }
  };
});
