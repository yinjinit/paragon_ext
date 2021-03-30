define('QuoteEdit.RequestQuoteWizard.Configuration', [
    'RequestQuoteWizard.Configuration',
    'RequestQuoteWizard.Module.CustomFields'
], function QuoteEditRequestQuoteWizardConfiguration(
    RequestQuoteWizardConfiguration,
    RequestQuoteWizardModuleCustomFileds
) {
    'use strict';

    var modules = RequestQuoteWizardConfiguration.steps;
    var titleModule;

    if (modules && modules.length) {
        modules = modules[0].steps;
        if (modules && modules.length) {
            modules = modules[0].modules;

            if (modules && modules.length > 1) {
                titleModule = modules[modules.length - 2];
                if (titleModule && titleModule.length > 1) {
                    titleModule[1].title = 'Set Up';
                }

                modules[modules.length - 1] = [RequestQuoteWizardModuleCustomFileds, {
                    fields: [{
                        type: 'text', fieldId: 'customname', title: 'Name', isMandatory: true
                    }, {
                        type: 'textarea', fieldId: 'customnotes', title: 'Note'
                    }]
                }];
            }
        }
    }
});
