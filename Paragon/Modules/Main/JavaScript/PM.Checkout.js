define('PM.Checkout', [
  'PM.OrderWizard.Module.PaymentMethod.POQuote',
  'PM.OrderWizard.Module.Address',
  'PM.Address.Details.View',
  'PM.Address.List.View',
  'underscore'
], function(
  OrderWizardModulePaymentMethodPOQuote,
  OrderWizardModuleAddress,
  AddressDetailsView,
  AddressListView,
  _
) {
  'use strict';

  return {
    mountToApp: function() {
      OrderWizardModulePaymentMethodPOQuote.loadModule();
      OrderWizardModuleAddress.loadModule();
      AddressDetailsView.loadModule();
      // AddressListView.loadModule();
    }
  };
});
