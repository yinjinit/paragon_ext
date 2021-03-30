define('ShareQuote.View', [
    'ShareQuote.Model',
    'Backbone.FormView',
    'share_quote_modal.tpl',
    'underscore',
    'Utils',
    'Backbone'
], function ShareQuoteView(
    ShareQuoteModel,
    BackboneFormView,
    shareQuoteModalTpl,
    _,
    Utils,
    Backbone
) {
    return Backbone.View.extend({
        template: shareQuoteModalTpl,
        title: 'Share Quote',
        events: {
            'submit form': 'saveForm'
        },
        bindings: {
            '[name="sendTo"]': 'sendTo',
        },
        initialize: function initialize(options){
            this.model = new ShareQuoteModel({
                type: 'link',
                quoteId: options.quoteModel.get('internalid')
            });
            BackboneFormView.add(this);
            this.editView = options.editView;
            this.saveForm = this.shareQuote;
        },
        shareQuote: function shareQuote(e){
            var $form = jQuery(e.currentTarget);
            var formObject = $form.serializeObject();
            var promise;
            var self = this;

            e.preventDefault();
            e.stopPropagation();

            if (formObject.type === 'link'){
                formObject.quoteLink = SC.SESSION.touchpoints.customercenter;
                formObject.quoteLink += (formObject.quoteLink.indexOf('?') >= 0 ? '&fragment=' : '?fragment=') +
                    Backbone.history.fragment + '#' + Backbone.history.fragment;
            } else {
                formObject.sendPdf = true;
            }
            this.model.set(formObject);

            promise = BackboneFormView.saveForm.apply(this, arguments);

            promise && promise.done(function doneSaveForm(){
                self.editView.showSuccessMessage(Utils.translate("Quote has been shared!"));
            })
        },
        getContext: function getContext(){
            return {
                type: this.model.get('type'),
                sendTo: this.model.get('sendTo')
            };
        }
    })
});
