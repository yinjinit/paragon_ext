define('AwaLabs.QuoteToSalesOrderWizard', [
    'QuoteToSalesOrderWizard.Configuration',
    'QuoteToSaleOrderWizard.ExtraFields',
    'OrderWizard.Module.Address.Shipping',
    'QuoteToSaleOrderWizard.SaveButton',
    'QuoteToSaleOrderWizard.Router',

    'OrderWizard.Module.CartSummary',
    'OrderWizard.Module.ShowShipments',
    'OrderWizard.Module.Shipmethod.MyAccount',
    'OrderWizard.Module.ShowPayments',
    'OrderWizard.Module.TermsAndConditions',
    'OrderWizard.Module.SubmitButton',
    'OrderWizard.Module.PaymentMethod.Creditcard',
    'OrderWizard.Module.PaymentMethod.Invoice',
    'OrderWizard.Module.Address.Billing',
    'QuoteToSalesOrderWizard.Module.QuoteDetails',
    'QuoteToSalesOrderWizard.Module.Confirmation',
    'QuoteToSalesOrderWizard.Module.PaymentMethod.Selector',
    'OrderWizard.Module.Address',
    'Address.Model',

    'QuoteEdit.Model',
    'Header.View',

    'jQuery',
    'underscore',
    'Utils'
], function AwaLabsQuoteToSalesOrderWizard(
    QuoteToSalesOrderWizardConfiguration,
    QuoteToSaleOrderWizardExtraFields,
    OrderWizardModuleAddressShipping,
    QuoteToSaleOrderWizardSaveButton,
    QuoteToSaleOrderWizardSaveRouter,

    OrderWizardModuleCartSummary,
    OrderWizardModuleShowShipments,
    OrderWizardModuleShipmethod,
    OrderWizardModuleShowPayments,
    OrderWizardModuleTermsAndConditions,
    OrderWizardModuleSubmitButton,
    OrderWizardModulePaymentMethodCreditcard,
    OrderWizardModulePaymentMethodInvoice,
    OrderWizardModuleAddressBilling,
    QuoteToSalesOrderWizardModuleQuoteDetails,
    QuoteToSalesOrderWizardModuleConfirmation,
    QuoteToSalesOrderWizardModulePaymentMethodSelector,
    OrderWizardModuleAddress,
    AddressModel,

    QuoteEditModel,

    HeaderView,
    jQuery,
    _,
    Utils
) {
    'use strict';

    _.extend(OrderWizardModuleAddress.prototype, {
        getSelectedAddress: function () {
            if (!this.addressId) {
                if (this.sameAs && this.tempAddress) {
                    return new AddressModel(this.tempAddress);
                }
            }
            return this.addresses.get(this.addressId) || this.getEmptyAddress();
        }
    });


    QuoteToSalesOrderWizardConfiguration.steps = [
        {
            name: Utils.translate('Choose Shipping Address'),
            steps: [
                {
                    url: 'quotetosalesorder-review',
                    name: Utils.translate('Shipping Address'),
                    hideBackButton: true,
                    hideContinueButton: false,
                    continueButtonLabel: Utils.translate('Continue'),
                    hideBreadcrumb: false,
                    showBottomMessage: true,
                    modules: [
                        QuoteToSalesOrderWizardModuleQuoteDetails,
                        [
                            OrderWizardModuleCartSummary,
                            {
                                container: '#wizard-step-content-right',
                                warningMessage: Utils.translate(
                                    'Total may include handling costs not displayed in the summary breakdown'
                                )
                            }
                        ],
                        [
                            OrderWizardModuleAddressShipping,
                            {
                                title: Utils.translate('Shipping Address')
                            }
                        ],
                        [
                            OrderWizardModuleShipmethod,
                            {
                                is_read_only: false,
                                show_edit_address_url: false,
                                hide_accordion: true,
                                collapse_items: true
                            }
                        ]
                    ],
                    isActive: function isActive() {
                        return true;
                    },
                    submit: function submit() {
                        var promises = [];
                        var self = this;
                        var savePromise = jQuery.Deferred();
                        _.each(this.moduleInstances, function eachModuleInstance(moduleInstance) {
                            if (moduleInstance.isActive()) {
                                promises.push(moduleInstance.submit());
                                moduleInstance.disableInterface();
                            }
                        });
                        jQuery.when(promises).then(function thenPromise() {
                            self.wizard.goToNextStep();
                        });
                        return savePromise;
                    }
                }
            ]
        },
        {
            name: Utils.translate('Payment'),
            steps: [
                {
                    url: 'quotetosalesorder-review-billing',
                    name: Utils.translate('Payment'),
                    hideBackButton: false,
                    hideContinueButton: false,
                    continueButtonLabel: Utils.translate('Continue'),
                    hideBreadcrumb: false,
                    showBottomMessage: true,
                    modules: [
                        QuoteToSalesOrderWizardModuleQuoteDetails,
                        [
                            OrderWizardModuleCartSummary,
                            {
                                container: '#wizard-step-content-right',
                                warningMessage: Utils.translate(
                                    'Total may include handling costs not displayed in the summary breakdown'
                                )
                            }
                        ],
                        [
                            QuoteToSalesOrderWizardModulePaymentMethodSelector,
                            {
                                record_type: 'salesorder',
                                modules: [
                                    {
                                        classModule: OrderWizardModulePaymentMethodCreditcard,
                                        name: Utils.translate('Credit / Debit Card'),
                                        type: 'creditcard',
                                        options: {}
                                    },
                                    {
                                        classModule: OrderWizardModulePaymentMethodInvoice,
                                        name: Utils.translate('Invoice'),
                                        type: 'invoice',
                                        options: {}
                                    }
                                ]
                            }
                        ],
                        QuoteToSaleOrderWizardExtraFields,
                        [
                            OrderWizardModuleAddressBilling,
                            {
                                enable_same_as: function sameAs() {
                                    return true;
                                },
                                title: Utils.translate('Billing Address')
                            }
                        ]
                    ],
                    isActive: function isActive() {
                        return true;
                    },
                    submit: function submit() {
                        var promises = [];
                        var self = this;
                        var savePromise = jQuery.Deferred();
                        _.each(this.moduleInstances, function eachModuleInstance(moduleInstance) {
                            if (moduleInstance.isActive()) {
                                promises.push(moduleInstance.submit());
                                moduleInstance.disableInterface();
                            }
                        });
                        jQuery.when(promises).then(function thenPromise() {
                            self.wizard.goToNextStep();
                        });
                        return savePromise;
                    }
                }
            ]
        },
        {
            name: Utils.translate('Review'),
            steps: [
                {
                    url: 'quotetosalesorder-review-review',
                    name: Utils.translate('Review'),
                    hideBackButton: false,
                    hideContinueButton: false,
                    continueButtonLabel: Utils.translate('Place Order'),
                    hideBreadcrumb: false,
                    showBottomMessage: true,
                    modules: [
                        QuoteToSalesOrderWizardModuleQuoteDetails,
                        [
                            OrderWizardModuleCartSummary,
                            {
                                container: '#wizard-step-content-right',
                                warningMessage: Utils.translate(
                                    'Total may include handling costs not displayed in the summary breakdown'
                                )
                            }
                        ],
                        [
                            OrderWizardModuleTermsAndConditions,
                            {
                                container: '#wizard-step-content-right',
                                showWrapper: true,
                                wrapperClass: 'order-wizard-termsandconditions-module-top-summary'
                            }
                        ],
                        [
                            OrderWizardModuleTermsAndConditions,
                            {
                                container: '#wizard-step-content-right',
                                showWrapper: true,
                                wrapperClass: 'order-wizard-termsandconditions-module-bottom'
                            }
                        ],
                        [
                            OrderWizardModuleSubmitButton,
                            {
                                container: '#wizard-step-content-right',
                                showWrapper: true,
                                wrapperClass: 'order-wizard-submitbutton-container'
                            }
                        ],
                        [
                            OrderWizardModuleTermsAndConditions,
                            {
                                showWrapper: true,
                                wrapperClass: 'order-wizard-termsandconditions-module-default'
                            }
                        ],
                        [
                            OrderWizardModuleShowPayments
                        ],
                        [
                            OrderWizardModuleShowShipments,
                            {
                                show_edit_address_url: true,
                                hide_title: true,
                                is_read_only: true,
                                show_combo: false,
                                show_edit_button: false,
                                hide_item_link: true
                            }
                        ],
                        [QuoteToSaleOrderWizardExtraFields, {
                            isReview: true
                        }],
                        [
                            QuoteToSaleOrderWizardSaveButton,
                            {
                                container: '#wizard-step-content-right',
                                showWrapper: true,
                                wrapperClass: 'order-wizard-submitbutton-container'
                            }
                        ]
                    ],
                    save: function save() {
                        var submitOperation = this.wizard.model.submit();
                        var firstModuleInstance = _.first(this.moduleInstances);
                        firstModuleInstance.trigger(
                            'change_label_continue',
                            Utils.translate('Processing...')
                        );
                        submitOperation.always(function always() {
                            firstModuleInstance.trigger(
                                'change_label_continue',
                                Utils.translate('Placed Order')
                            );
                        });
                        return submitOperation;
                    }
                }
            ]
        },
        {
            name: Utils.translate('Thank You'),
            steps: [
                {
                    url: 'quotetosalesorder-confirmation',
                    hideContinueButton: true,
                    name: Utils.translate('Thank you'),
                    hideBackButton: true,
                    hideBreadcrumb: true,
                    headerView: HeaderView,
                    modules: [
                        [
                            OrderWizardModuleCartSummary,
                            {
                                container: '#wizard-step-content-right',
                                warningMessage: Utils.translate(
                                    'Total may include handling costs not displayed in the summary breakdown'
                                )
                            }
                        ],
                        QuoteToSalesOrderWizardModuleConfirmation,
                        QuoteToSalesOrderWizardModuleQuoteDetails,
                        [OrderWizardModuleShowPayments],
                        [
                            OrderWizardModuleShowShipments,
                            {
                                hide_edit_cart_button: true,
                                hide_edit_address_button: true
                            }
                        ],
                        [QuoteToSaleOrderWizardExtraFields, {
                            isReview: true
                        }]
                    ]
                }
            ]
        }
    ]

    //QuoteToSalesOrderWizardConfiguration.steps[0].steps[0].modules.push();
    //QuoteToSalesOrderWizardConfiguration.steps[0].steps[0].modules.splice(6, 0, );
    //QuoteToSalesOrderWizardConfiguration.steps[0].steps[0].modules.splice(8, 0,);
});

