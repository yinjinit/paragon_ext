define('RequestQuoteWizard.Module.CustomFields', [
    'Wizard.Module',
    'requestquote_wizard_module_customfields.tpl',
    'jQuery',
    'Utils',
    'underscore'
], function RequestQuoteWizardModuleCustomFields(
    WizardModule,
    requestquoteWizardModuleCustomfieldsTpl,
    jQuery,
    Utils,
    _
) {
    'use strict';

    return WizardModule.extend({
        template: requestquoteWizardModuleCustomfieldsTpl,

        events: {
            'keyup [data-action="validate-textarea-length"]': 'validateTextareaLength'
        },

        initialize: _.wrap(WizardModule.prototype.initialize, function initialize(fn, options) {
            fn.apply(this, _.toArray(arguments).slice(1));
            this.fields = options.fields;
        }),

        getMaxLength: function getMaxLength(field) {
            return field && _.isNumber(field.maxLength) ? field.maxLength : 999;
        },

        validateTextareaLength: function validateTextareaLength() {
            var text = this.$('[data-action="validate-textarea-length"]').val();
            var limit = this.getMaxLength();

            if (text.length > limit) {
                this.$('[data-action="validate-textarea-length"]').val(text.substr(0, limit));
            }
        },

        submit: function submit() {
            var self = this;
            var error;
            _.each(this.fields, function eachField(field) {
                var value = self.$('[data-type="' + field.fieldId + '-input"]').val();
                if (field.isMandatory && !value) {
                    error = jQuery.Deferred().reject(field.title + ' is a mandatory field.');
                }
                if (value) {
                    self.wizard.model.set(field.fieldId, value);
                }
            });

            if (error) {
                return error;
            }
            return jQuery.Deferred().resolve();
        },

        getContext: function getContext() {
            var self = this;
            var fields = _.map(this.fields, function eachField(field) {
                return {
                    memo: self.wizard.model.get(field.fieldId),
                    isReadOnly: !!field.is_read_only,
                    hideContent: field.is_read_only && !self.wizard.model.get(field.fieldId),
                    maxLength: self.getMaxLength(field),
                    type: field.type,
                    isTextArea: field.type === 'textarea',
                    isMandatory: field.isMandatory,
                    fieldId: field.fieldId,
                    title: field.title
                };
            });
            return {
                fields: fields
            };
        }
    });
});
