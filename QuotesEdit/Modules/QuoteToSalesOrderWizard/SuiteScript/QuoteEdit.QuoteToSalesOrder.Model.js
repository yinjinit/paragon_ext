define('QuoteEdit.QuoteToSalesOrder.Model', [
    'QuoteToSalesOrder.Model',
    'Transaction.Model',
    'Utils',
    'underscore'
], function QuoteEditQuoteToSalesOrderModel(
    QuoteToSalesOrderModel,
    TransactionModel,
    Utils,
    _
) {
    'use strict';

    _.extend(QuoteToSalesOrderModel, {
        preSubmitRecord: function preSubmitRecord() {
            var quoteTranId = this.quoteId && nlapiLookupField('estimate', this.quoteId, 'tranid');
            if (quoteTranId) {
                this.record.setFieldValue('tranid', quoteTranId.replace('Q', 'S'));
            }
        },

        postSubmitRecord: function(confirmation_result, record) {
            var created_salesorder = !_.isUndefined(record)
                ? record
                : nlapiLoadRecord('salesorder', confirmation_result.internalid);
            confirmation_result.tranid = created_salesorder.getFieldValue('tranid');
            confirmation_result.confirmationnumber = created_salesorder.getFieldValue('tranid');
            if (confirmation_result.isexternal) {
                confirmation_result.redirecturl = ExternalPayment.generateUrl(
                    confirmation_result.internalid,
                    'salesorder'
                );
                confirmation_result.statuscode =
                    created_salesorder.getFieldValue('paymenteventholdreason') ===
                    'FORWARD_REQUESTED'
                        ? 'redirect'
                        : '';
                confirmation_result.paymenteventholdreason = created_salesorder.getFieldValue(
                    'paymenteventholdreason'
                );
            }

            // @class QuoteToSalesOrder.Model.Confirmation @extend Transaction.Model.Confirmation
            if (created_salesorder.tranid) {
                confirmation_result.tranid = created_salesorder.tranid;
                confirmation_result.confirmationnumber = created_salesorder.tranid;
            }

            // @class QuoteToSalesOrder.Model
            return confirmation_result;
        },

        setTransactionBodyCustomFields: _.wrap(QuoteToSalesOrderModel.setTransactionBodyCustomFields, function setTransactionBodyCustomFields(fn) {
            fn.apply(this, _.toArray(arguments).slice(1));

            this.record.setFieldValue('otherrefnum', this.data.purchasenumber || '');
        }),

        update: _.wrap(QuoteToSalesOrderModel.update, function update(fn, salesorderId, quoteId, data) {
            if (data && data.paymentmethods && data.paymentmethods.terms) {
                data.paymentmethods.paymentterms = data.paymentmethods.terms;
            }
            if (data && data.paymentmethods && data.paymentmethods.paymentterms) {
                data.paymentmethods.terms = data.paymentmethods.paymentterms;
            }
            if (data && data.paymentmethods && _.isArray(data.paymentmethods)) {
                data.paymentmethods = _.map(data.paymentmethods, function mapPaymentMethods(paymentmethod) {
                    if (paymentmethod && paymentmethod.terms && !paymentmethod.paymentterms) {
                        paymentmethod.paymentterms = paymentmethod.terms;
                    }
                    if (paymentmethod && paymentmethod.paymentterms && !paymentmethod.terms) {
                        paymentmethod.terms = paymentmethod.paymentterms;
                    }
                    return paymentmethod;
                });
            }

            fn.apply(this, _.toArray(arguments).slice(1));
        }),

        getRecordAddresses: function getRecordAddresses() {
            var i;
            // @class Transaction.Model.Get.Result
            // @property {Array<Address.Model.Attributes>} addresses
            this.result.addresses = {};
            this.result.listAddresseByIdTmp = {};

            for (i = 1; i <= this.record.getLineItemCount('iladdrbook'); i++) {
                // Adds all the addresses in the address book
                this.result.listAddresseByIdTmp[
                    this.record.getLineItemValue('iladdrbook', 'iladdrinternalid', i)
                    ] = this.addAddress({
                        internalid: this.record.getLineItemValue('iladdrbook', 'iladdrinternalid', i),
                        country: this.record.getLineItemValue('iladdrbook', 'iladdrshipcountry', i),
                        state: this.record.getLineItemValue('iladdrbook', 'iladdrshipstate', i),
                        city: this.record.getLineItemValue('iladdrbook', 'iladdrshipcity', i),
                        zip: this.record.getLineItemValue('iladdrbook', 'iladdrshipzip', i),
                        addr1: this.record.getLineItemValue('iladdrbook', 'iladdrshipaddr1', i),
                        addr2: this.record.getLineItemValue('iladdrbook', 'iladdrshipaddr2', i),
                        attention: this.record.getLineItemValue('iladdrbook', 'iladdrshipattention', i),
                        addressee: this.record.getLineItemValue('iladdrbook', 'iladdrshipaddressee', i),
                        phone: this.record.getLineItemValue('iladdrbook', 'iladdrshipphone', i)
                    });
            }

            // Adds Shipping Address
            // @property {String} shipaddress Id of the shipping address
            this.result.shipaddress = this.addAddress({
                internalid: this.record.getFieldValue('shipaddresslist'),
                country: this.record.getFieldValue('shipcountry'),
                state: this.record.getFieldValue('shipstate'),
                city: this.record.getFieldValue('shipcity'),
                zip: this.record.getFieldValue('shipzip'),
                addr1: this.record.getFieldValue('shipaddr1'),
                addr2: this.record.getFieldValue('shipaddr2'),
                attention: this.record.getFieldValue('shipattention'),
                addressee: this.record.getFieldValue('shipaddressee'),
                phone: this.record.getFieldValue('shipphone')
            });

            // Adds Bill Address
            // @property {String} billaddress Id of the billing address
            this.result.billaddress = this.addAddress({
                internalid: this.record.getFieldValue('billaddresslist'),
                country: this.record.getFieldValue('billcountry'),
                state: this.record.getFieldValue('billstate'),
                city: this.record.getFieldValue('billcity'),
                zip: this.record.getFieldValue('billzip'),
                addr1: this.record.getFieldValue('billaddr1'),
                addr2: this.record.getFieldValue('billaddr2'),
                attention: this.record.getFieldValue('billattention'),
                addressee: this.record.getFieldValue('billaddressee'),
                phone: this.record.getFieldValue('billphone')
            });
            // @class Quote.Model
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

        getCreatedFrom: function getCreatedFrom() {
            // The createdfrom is being loaded using a Lookup field operation instead of loading it from the current record (this.record)
            // This is done like this to solve an issue
            var created_from_internalid = this.record.getFieldValue('createdfrom');
            var record_type = '';

            if (created_from_internalid) {
                record_type = 'estimate';
            }

            // @class Transaction.Model.Get.Result
            // @property {CreatedFrom} createdfrom
            this.result.createdfrom = {
                // @class CreatedFrom
                // @property {String} internalid
                internalid: created_from_internalid,
                // @property {String} name
                name: this.record.getFieldText('createdfrom'),
                // @property {String} recordtype
                recordtype: record_type || ''
            };
            // @class Transaction.Model
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
        }
    });
});
