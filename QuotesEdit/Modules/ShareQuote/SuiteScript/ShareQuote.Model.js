define('ShareQuote.Model', [
    'SC.Model',
    'Configuration'
], function ShareQuoteModel(
    SCModel,
    Configuration
) {
    'use strict';

    return SCModel.extend({
        name: 'ShareQuote.Model',
        shareQuote: function shareQuote(data) {

            return {
                status: this.sendEmail(
                    data.quoteLink,
                    data.sendTo,
                    data.quoteId,
                    data.sendPdf
                ) ? 'success' : 'error',
                data: { from: data.userData, to: data.sendTo }
            };
        },
        sendEmail: function sendEmail(quoteLink, sendTo, quoteId, sendPdf) {
            var pdfFile = null;
            var employeeInternalId = Configuration.get('shareQuote.employeeInternalId');
            var templateId = Configuration.get('shareQuote.templatelId');
            // templatelPdfId
            // eslint-disable-next-line no-undef


            if (quoteId && sendPdf) {
                // eslint-disable-next-line no-undef
                pdfFile = nlapiPrintRecord('TRANSACTION', quoteId, 'PDF');
                templateId = Configuration.get('shareQuote.templatelPdfId');
            }

            var emailMerger = nlapiCreateEmailMerger(templateId).merge();
            var emailSubject = emailMerger.getSubject();
            var emailBody = emailMerger.getBody().toString();
            if (quoteLink) {
                emailBody = emailBody.replace(/{{LINK}}/g, quoteLink);
            } else {
                emailBody = emailBody.replace(/{{LINK}}/g, '');
            }

            // eslint-disable-next-line no-undef
            nlapiSendEmail(employeeInternalId, sendTo, emailSubject, emailBody, null, null, { transaction: quoteId, entity: nlapiGetUser() }, pdfFile);
            return true;
        }
    });
});
