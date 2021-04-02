define('PM.Checkout', [
  'PM.OrderWizard.Module.PaymentMethod.POQuote',
  'underscore'
], function(
  PMOrderWizardModulePaymentMethodPOQuote,
  _
) {
  'use strict';

  return {
    mountToApp: function() {
      PMOrderWizardModulePaymentMethodPOQuote.loadModule();
    }
  };
});
