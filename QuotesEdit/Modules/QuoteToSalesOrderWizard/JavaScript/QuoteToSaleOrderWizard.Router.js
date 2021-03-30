define('QuoteToSaleOrderWizard.Router', [
    'Wizard.Router',
    'Profile.Model',
    'Backbone',
    'jQuery'
], function QuoteToSaleOrderWizardRouter(
    WizardRouter,
    ProfileModel,
    Backbone,
    jQuery
) {
    'use strict';

    _.extend(WizardRouter.prototype, {
        runStep: function() {
            var url = Backbone.history.fragment;
            var self = this;
            var promise = jQuery.Deferred();

            // We allow URLs to have options but they are still identified by the original string,
            // so we need to take them out if present
            url = url.split('?')[0];

            if (this.steps[url]) {
                var confirmation = this._getPropAsModelInstance('confirmation');

                confirmation =
                    confirmation &&
                    (confirmation.get('confirmationnumber') ||
                        confirmation.get('tranid') ||
                        confirmation.get('internalid'));

                var profile_model = ProfileModel.getInstance();

                if (
                    (this.application.getConfig('checkoutApp.skipLogin') &&
                        this.application.getConfig('siteSettings.registration.registrationoptional') ===
                        'T' &&
                        profile_model.get('isRecognized') === 'F') ||
                    profile_model.get('isLoggedIn') === 'T'
                ) {
                    // We keep a reference to the current step URL here
                    this.currentStep = url;

                    // Iterates all the steps and calls the status methods
                    var method_to_call = 'past';
                    var current_group;
                    var past_promises = [];

                    _.each(this.stepsOrder, function(step) {
                        if (step === url) {
                            self.steps[step].present();
                            self.steps[step].state = 'present';
                            self.steps[step].stepGroup.state = 'present';
                            self.steps[step].tellModules('present');
                            method_to_call = 'future';
                            current_group = self.steps[step].stepGroup;
                        } else {
                            self.steps[step].tellModules(method_to_call);
                            var past_promise = !confirmation && self.steps[step][method_to_call]();

                            if (method_to_call === 'past' && past_promise) {
                                past_promise = past_promise.then(jQuery.noop, function() {
                                    throw step;
                                });
                            }
                            past_promises.push(past_promise);

                            self.steps[step].state = method_to_call;

                            // if the step is contained in the current_group we don't change the group state
                            if (self.steps[step].stepGroup !== current_group) {
                                self.steps[step].stepGroup.state = method_to_call;
                            }
                        }
                    });

                    jQuery.when.apply(jQuery, past_promises).then(promise.resolve, function(step_url) {
                        // If some of the "past" steps failed, browse back to that step
                        if(~step_url.indexOf('quotetosalesorder')) {
                            step_url += '?quoteid=' + self.model.get('quoteid');
                        }
                        promise.reject();
                        Backbone.history.navigate(step_url, { trigger: true });
                    });
                } else {
                    promise.reject();
                    Backbone.history.navigate('login-register', { trigger: true });
                }
            } else {
                promise.resolve();
            }

            return promise;
        }
    });
});
