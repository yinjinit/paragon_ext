define('QuoteEdit.Model', [
    'Quote.Model',
    'PaymentInstrument.Model',
    'CustomFields.Utils',
    'Utils',
    'StoreItem.Model',
    'underscore'
], function QuoteEditModel(
    QuoteModel,
    PaymentInstrumentModel,
    CustomFieldsUtils,
    Utils,
    StoreItem,
    _
) {
    // @class QuoteEdit.Model Defines the model used by the Quote.Service.ss service
    // @extends Quote.Model
    return QuoteModel.extend({
        // @property {String} name
        name: 'QuoteEdit',

        customfields: {
            customname: 'custbody_transaction_name',
            customnotes: 'custbody_web_notes'
        },

        invalidLines: {
            // @property {Number} status
            status: 404,
            // @property {String} code
            code: 'ERR_QUOTE_LINES',
            // @property {String} message
            message: 'There must be at least one line in the quote'
        },

        getTransactionRecord: function getTransactionRecord(recordType, id, edit) {
            if (this.record) {
                return this.record;
            }

            // TODO: do not use dynamic mode if it's a view
            if (!this._isCreatingARecord() && edit) {
                return nlapiLoadRecord(recordType, id, { recordmode: 'dynamic' });
            }

            return QuoteModel.getTransactionRecord.apply(this, arguments);
        },

        removeAllItemLines: function removeAllItemLines() {
            var itemsCount = this.record.getLineItemCount('item');
            var i;
            this.lineData = {};

            for (i = itemsCount; i >= 1; i--) {
                this.lineData[this.record.getLineItemValue('item', 'id', i)] = {
                    price: this.record.getLineItemValue('item', 'price', i),
                    rate: this.record.getLineItemValue('item', 'rate', i)
                }
                this.record.removeLineItem('item', i);
            }
        },

        getShippingMethods: function getShippingMethods() {
            var self = this;
            var shipitemSearch = nlapiSearchRecord('shipitem', null,
                [
                    ['isonline', 'is', 'T'],
                    'AND',
                    ['isinactive', 'is', 'F']
                ],
                [
                    new nlobjSearchColumn('itemid').setSort(false),
                    new nlobjSearchColumn('displayname'),
                    new nlobjSearchColumn('internalid'),
                    new nlobjSearchColumn('carrier')
                ]
            );
            var shipmethods = [];

            _.each(shipitemSearch, function eachShipItem(shipItem) {
                shipmethods.push({
                    internalid: shipItem.getValue('internalid'),
                    name: shipItem.getValue('displayname'),
                    rate: 0,
                    rate_formatted: 'To Be Confirmed',
                    shipcarrier: shipItem.getValue('carrier')
                });
            });

            return shipmethods;
        },

        getRecordShippingMethods: function getRecordShippingMethods() {
            var self = this;
            var i;
            var selectedShipMethod = this.record.getFieldValue('shipmethod');
            var shipmethodsCache = nlapiGetCache('shipmethods');
            var cachedShipMethods = shipmethodsCache.get('shipmethods');
            var shippingMethods;
            if (cachedShipMethods) {
                try {
                    shippingMethods = JSON.parse(cachedShipMethods);
                } catch(e) {
                    shippingMethods = null;
                }
            }

            if (!shippingMethods) {
                shippingMethods = this.getShippingMethods();
                shipmethodsCache.put('shipmethods', JSON.stringify(shippingMethods));
            }

            if (shippingMethods && shippingMethods.length) {
                _.each(shippingMethods, function eachShipItem(shipItem) {
                    if (selectedShipMethod === shipItem.internalid) {
                        self.addShippingMethod({
                            internalid: shipItem.internalid,
                            name: shipItem.name,
                            rate: Utils.toCurrency(self.record.getFieldValue('shippingcost')),
                            rate_formatted: Utils.formatCurrency(
                                self.record.getFieldValue('shippingcost'),
                                self.result.selected_currency
                                    ? self.result.selected_currency.symbol
                                    : undefined
                            ),
                            shipcarrier: shipItem.shipcarrier
                        });
                    } else {
                        self.addShippingMethod({
                            internalid: shipItem.internalid,
                            name: shipItem.name,
                            rate: 0,
                            rate_formatted: 'To Be Confirmed',
                            shipcarrier: shipItem.shipcarrier
                        });
                    }
                });
            } else {
                if (this.record.getLineItemCount('shipgroup') <= 0) {
                    // @class Transaction.Model.Get.ShipMethod
                    self.addShippingMethod({
                        internalid: this.record.getFieldValue('shipmethod'),
                        name: this.record.getFieldText('shipmethod'),
                        rate: Utils.toCurrency(this.record.getFieldValue('shippingcost')),
                        rate_formatted: Utils.formatCurrency(
                            this.record.getFieldValue('shippingcost'),
                            self.result.selected_currency
                                ? self.result.selected_currency.symbol
                                : undefined
                        ),
                        shipcarrier: this.record.getFieldValue('carrier')
                    });
                }

                for (i = 1; i <= this.record.getLineItemCount('shipgroup'); i++) {
                    self.addShippingMethod({
                        internalid: this.record.getLineItemValue('shipgroup', 'shippingmethodref', i),
                        name: this.record.getLineItemValue('shipgroup', 'shippingmethod', i),
                        rate: Utils.toCurrency(
                            this.record.getLineItemValue('shipgroup', 'shippingrate', i)
                        ),
                        rate_formatted: Utils.formatCurrency(
                            this.record.getLineItemValue('shipgroup', 'shippingrate', i),
                            self.result.selected_currency
                                ? self.result.selected_currency.symbol
                                : undefined
                        ),
                        shipcarrier: this.record.getLineItemValue('shipgroup', 'shippingcarrier', i)
                    });
                }
            }

            this.result.shipmethod = selectedShipMethod;
        },

        getRecordPaymentMethod: function getRecordPaymentMethod() {
            // @class Transaction.Model.Get.PaymentMethod
            var paymentmethod = {
                // @property {String} type Possible values: 'creditcard', 'invoice', 'paypal'
                type: this.record.getFieldValue('paymethtype'),
                // @property {Boolean} primary
                primary: true,
                // @property {String} name
                name: this.record.getFieldText('paymentmethod')
            };
            var terms = this.getTerms();
            var ccnumber = this.record.getFieldValue('ccnumber');

            if (ccnumber) {
                paymentmethod.type = 'creditcard';
                // @property {Transaction.Model.Get.PaymentMethod.CreditCard?} creditcard This value is present only if the type is creditcard
                paymentmethod.creditcard =
                    // @class Transaction.Model.Get.PaymentMethod.CreditCard
                {
                    // @property {String} ccnumber
                    ccnumber: ccnumber,
                    // @property {String} ccexpiredate
                    ccexpiredate: this.record.getFieldValue('ccexpiredate'),
                    // @property {String} ccname
                    ccname: this.record.getFieldValue('ccname'),
                    // @property {String} internalid
                    internalid: this.record.getFieldValue('creditcard'),
                    // @property {Transaction.Model.Get.PaymentMethod.CreditCard.Details} paymentmethod
                    paymentmethod: {
                        // @class Transaction.Model.Get.PaymentMethod.CreditCard.Details
                        // @property {String} ispaypal
                        ispaypal: 'F',
                        // @property {String} name
                        name: this.record.getFieldText('paymentmethod'),
                        // @property {String} creditcard Value: 'T'
                        creditcard: 'T',
                        // @property {String} internalid
                        internalid: this.record.getFieldValue('paymentmethod')
                    }
                };
            } else if (this.record.getFieldValue('paymentoption')) {
                paymentmethod.type = 'creditcardtoken';
                paymentmethod.creditcard = PaymentInstrumentModel.get(
                    this.record.getFieldValue('paymentoption')
                );
            }

            if (terms) {
                paymentmethod.type = 'invoice';

                // @property {Transaction.Model.Get.PaymentMethod.Terms} paymentterms This value is present only of the type is invoice
                paymentmethod.terms = terms;
                paymentmethod.paymentterms = terms;
            }

            // @class Transaction.Model.Get.Result
            // @property {Array<Transaction.Model.Get.PaymentMethod>} paymentmethods
            if (paymentmethod.type) {
                this.result.paymentmethods = [paymentmethod];
            } else {
                this.result.paymentmethods = [];
            }

            // @class Transaction.Model
        },

        update: function update(recordType, id, dataModel) {
            if (recordType && id) {
                this.recordId = id;
                this.data = dataModel;
                if (!this.data.lines || !this.data.lines.length) {
                    throw this.invalidLines;
                }
                this.record = this.getTransactionRecord(recordType, id, true);
                // @property {Transaction.Model.Get.Result} currentRecord This property is used so when performing any update
                // operation you can know what is the current state
                // This property is only present when performing an update operation
                this.currentRecord = this.get(recordType, id);
                this.setPaymentMethod();
                if (this.data.shipaddress) {
                    this.setAddress('ship', this.data.shipaddress, 'shipaddress');
                }
                if (this.data.billaddress) {
                    this.setAddress('bill', this.data.billaddress, 'billaddress');
                }

                this.setLines();
                this.setMemo();
                this.setShipMethod();
                this.setTransactionBodyCustomFields();
                this.setSaveFields();
            }
        },

        setSaveFields: function setSaveFields() {
            var self = this;
            var customFieldsId = CustomFieldsUtils.getCustomFieldsIdToBeExposed('salesorder');
            if (this.data.step === 'details') {
                _.each(this.customfields, function eachCustomFields(customField, fieldName) {
                    if (self.data[fieldName]) {
                        self.record.setFieldValue(customField, self.data[fieldName]);
                    }
                });
            } else {
                _.each(this.data.options, function eachDataOption(value, id) {
                    // only set a custom field to the model if was exposed in the configuration
                    if (
                        _.find(customFieldsId, function eacCustomField(configFieldId) {
                            return id === configFieldId;
                        })
                    ) {
                        self.record.setFieldValue(id, value);
                    }
                });
            }

            this.record.setFieldValue('otherrefnum', this.data.purchasenumber || '');
        },

        getTransactionBodyCustomFields: function getTransactionBodyCustomFields() {
            var self = this;
            var options = {};
            var customFieldsId = CustomFieldsUtils.getCustomFieldsIdToBeExposed('salesorder');
            _.each(this.customfields, function eachCustomFields(customField, fieldName) {
                self.result[fieldName] = self.record.getFieldValue(customField);
            });

            _.each(customFieldsId, function eachCustomFields(id) {
                options[id] = self.record.getFieldValue(id);
            });

            this.result.options = options;
        },

        setShipMethod: function setShipMethod() {
            if (this.data.shipmethod !== this.record.getFieldValue('shipmethod')) {
                this.record.setFieldValue('shipmethod', this.data.shipmethod);
            }
        },

        submit: function submit() {
            var newRecordId;
            var result;
            if (!this.record) {
                throw SC.ERROR_IDENTIFIERS.loadBeforeSubmit;
            }

            this.preSubmitRecord();

            newRecordId = nlapiSubmitRecord(this.record, false, true);
            // @class Transaction.Model.Confirmation
            result = {
                // @property {String} internalid
                internalid: newRecordId
            };

            return this.postSubmitRecord(result);
            // @class Transaction.Model
        },

        copy: function copy(recordType, internalid) {
            var copyQuote = nlapiCopyRecord(recordType, internalid);
            var newId;
            var newTranId;
            var currentName = nlapiLookupField(recordType, internalid, 'custbody_transaction_name');
            var newName = currentName;
            if (currentName) {
                newName = currentName + ' Copy';
                copyQuote.setFieldValue('custbody_transaction_name', newName);
            }
            newId = nlapiSubmitRecord(copyQuote);
            newTranId = nlapiLookupField(recordType, newId, 'tranid');
            return {
                internalid: newId,
                customname: newName,
                tranid: newTranId
            };
        },


        setLines: function setLines() {
            var itemsCount = this.record.getLineItemCount('item');
            var i;
            var line;
            var lineId;
            var self = this;
            var linesToRemove = [];
            if (this.data.lines) {
                for (i = 1; i <= itemsCount; i++) {
                    lineId = self.record.getLineItemValue('item', 'id', i);
                    line = _.findWhere(this.data.lines, { internalid: lineId });
                    if (!line) {
                        linesToRemove.push(i);
                    } else {
                        self.record.selectLineItem('item', i);
                        self.record.setCurrentLineItemValue('item', 'quantity', line.quantity);
                        self.record.commitLineItem('item');
                    }
                }
            }

            if (linesToRemove && linesToRemove.length) {
                nlapiLogExecution('DEBUG', 'linesToRemove', JSON.stringify(linesToRemove));
                for (i = linesToRemove.length; i > 0; i --) {
                    nlapiLogExecution('DEBUG', 'linesToRemove[i]', JSON.stringify(linesToRemove[i - 1]));
                    self.record.removeLineItem('item', linesToRemove[i - 1]);
                }
            }
        }
    });
});
