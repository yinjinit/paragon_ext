define('QuoteToSaleOrderWizard.SaveButton', [
    'Wizard.Module',
    'Quotes.Save.Modal',
    'QuoteEdit.Model',
    'GlobalViews.Confirmation.View',
    'Backbone',
    'underscore',
    'jQuery',
    'quote_to_sale_order_save_button.tpl'
], function QuoteToSaleOrderWizardSaveButton(
    WizardModule,
    QuotesSaveModal,
    QuoteEditModel,
    GlobalViewsConfirmationView,
    Backbone,
    _,
    jQuery,
    quoteToSaleOrderSaveButtonTpl
) {
    return WizardModule.extend({
        template: quoteToSaleOrderSaveButtonTpl,
        events: {
            'click [data-action="save-quote"]': 'saveQuoteModal'
        },
        saveQuoteModal: function saveQuote(e) {
            var self = this;
            var quotesSaveModalView = new QuotesSaveModal({
                name: this.model.get('options').custbody_web_name || '',
                notes: this.model.get('options').custbody_web_notes
            });
            var saveQuoteModal;
            quotesSaveModalView._render(); // eslint-disable-line no-underscore-dangle
            e.preventDefault();
            saveQuoteModal = new GlobalViewsConfirmationView({
                callBackParameters: {
                    target: e.target,
                    context: this
                },
                confirmLabel: _('Save').translate(),
                cancelLabel: _('Cancel').translate(),
                callBack: function saveCallback() {
                    self.saveQuote({
                        name: this.$('#in-modal-name').val(),
                        notes: this.$('#in-modal-notes').val()
                    });
                },
                cancelCallBack: jQuery.proxy(this.cancelSaveQuote, this),
                title: _('Save as Quote').translate(),
                autohide: true,
                body: quotesSaveModalView.$el.html()
            });

            this.wizard.application.getLayout().showInModal(saveQuoteModal);
        },
        saveQuote: function saveQuote(options) {
            var savePromise;
            var self = this;
            var saveQuoteInfo = this.model.toJSON();
            saveQuoteInfo = _.extend(saveQuoteInfo, saveQuoteInfo.quoteDetails, { recordtype: 'estimate' });
            saveQuoteInfo.lines = JSON.parse(JSON.stringify(saveQuoteInfo.lines));

            _.each(saveQuoteInfo.lines, function eachLine(line) {
                if (line.item) {
                    line.item.itemtype = line.item.itemtype || line.item.type;
                }
            });

            this.saveQuoteModel = new QuoteEditModel(saveQuoteInfo);
            this.saveQuoteModel.set('customname', options.name);
            this.saveQuoteModel.set('customnotes', options.notes);

            savePromise = this.saveQuoteModel.save(null, { type: 'POST' });

            this.disableElementsOnPromise(savePromise, '.quote-details-view button, .quote-details-view a, .quote-details-view input');

            savePromise.done(function modelSave() {
                self.$('.quote-edit-save-quote').show();
                _.delay(function hideMessage() {
                    self.$('.quote-edit-save-quote').fadeOut();
                }, 3000);
            });
        }
    });
});
