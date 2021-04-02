// @module PM.OrderWizard.Module.PaymentMethod.POQuote
define('PM.OrderWizard.Module.PaymentMethod.POQuote', [
  'OrderWizard.Module.PaymentMethod.PurchaseNumber',
  'pm_order_wizard_paymentmethod_poquote_module.tpl',
  'underscore'
], function(
  OrderWizardModule,
  pm_order_wizard_paymentmethod_poquote_module_tpl,
  _
) {
  'use strict';

  return {
    mountToApp: function() {
      _.extend(OrderWizardModule.prototype, {
        //@property {Function} template
        template: pm_order_wizard_paymentmethod_poquote_module_tpl,
        //@property {String} className
        className: 'OrderWizard.Module.PaymentMethod.POQuote',
        submit: _.wrap(OrderWizardModule.prototype.submit,
          function(fn) {
            var costCenter = this.$('[name="cost-centre"]').val(),
              name = this.$('[name="quote-name"]').val(),
              notes = this.$('[name="quote-notes"]').val(),
              options = this.wizard.model.get('options') || {};

            if (name) {
              options.custbody_transaction_name = name;
            } else {
              delete options.custbody_transaction_name;
            }

            if (notes) {
              options.custbody_web_notes = notes;
            } else {
              delete options.custbody_web_notes;
            }

            if (costCenter) {
              options.custbody_cost_center = costCenter;
            } else {
              delete options.custbody_cost_center;
            }

            if (!_.isEmpty(options)) {
              this.wizard.model.set('options',
                _.extend(this.wizard.model.get('options') || {}, options));
            }

            return fn.apply(this, _.toArray(arguments).slice(1));
          }),
        //@method getContext
        //@returns {PM.OrderWizard.Module.PaymentMethod.POQuote.Context}
        getContext: _.wrap(OrderWizardModule.prototype.getContext,
          function(fn) {
            var context = fn.apply(this, _.toArray(arguments).slice(1)),
              options = this.wizard.model.get('options');

            if (options.custbody_transaction_name) {
              context.name = options.custbody_transaction_name;
            }

            if (options.custbody_web_notes) {
              context.notes = options.custbody_web_notes;
            }

            if (options.custbody_cost_center) {
              context.costCenter = options.custbody_cost_center;
            }

            return context;
          })
      });
    }
  };
});
