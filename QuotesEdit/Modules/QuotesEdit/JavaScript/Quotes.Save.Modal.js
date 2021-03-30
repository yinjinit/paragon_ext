define('Quotes.Save.Modal', [
    'quotes_save_modal.tpl',
    'Backbone'
], function QuotesSaveModal(
    quotesSaveModalTpl,
    Backbone
) {
    'use strict';

    return Backbone.View.extend({
        template: quotesSaveModalTpl,
        getContext: function getContext() {
            return {
                name: this.options.name,
                notes: this.options.notes
            };
        }
    });
});
