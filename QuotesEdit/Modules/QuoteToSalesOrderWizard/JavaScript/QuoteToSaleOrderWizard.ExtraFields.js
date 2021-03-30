define('QuoteToSaleOrderWizard.ExtraFields', [
    'Wizard.Module',
    'jQuery',
    'underscore',
    'quote_to_sale_order_extra_fields.tpl'
], function QuoteToSaleOrderWizardExtraFilds(
    WizardModule,
    jQuery,
    _,
    quoteToSaleOrderExtraFieldsTpl
) {
    'use strict';

    return WizardModule.extend({
        template: quoteToSaleOrderExtraFieldsTpl,
        errors: ['ERR_NOT_SET_PO_NUMBER'],
        poNumberIsRequired: {
            errorMessage: 'Please entera a PO Number',
            errorCode: 'ERR_NOT_SET_PO_NUMBER'
        },
        submit: function submit() {
            if (!this.options.isReview) {
                var poNumber = this.$('#purchase-order-number').val() || '';
                this.wizard.model.set('purchasenumber', poNumber);
                this.wizard.model.set('customname', this.$('#quote-name').val() || '');
                this.wizard.model.set('customnotes', this.$('#quote-notes').val() || '');
                this.wizard.model.set('options', _.extend(this.wizard.model.get('options') || {}, {
                    custbody_transaction_name: this.$('#quote-name').val() || '',
                    custbody_web_notes: this.$('#quote-notes').val() || '',
                    custbody_cost_center: this.$('#cost-centre').val() || ''
                }));
            }
            return jQuery.Deferred().resolve();
        },
        isValid: function(){
            if (!this.wizard.model.get('purchasenumber')) {
                return jQuery.Deferred().reject(this.poNumberIsRequired);
            }
            return jQuery.Deferred().resolve();
        },
        getContext: function getContext() {
            if (!this.options.isReview) {
                this.trigger('change_label_continue', 'Continue');
            }
            return {
                purchaseNumber: this.wizard.model.get('purchasenumber'),
                name: this.wizard.model.get('options').custbody_transaction_name,
                notes: this.wizard.model.get('options').custbody_web_notes,
                costCenter: this.wizard.model.get('options').custbody_cost_center,
                isReview: !!this.options.isReview
            };
        }
    });
});
