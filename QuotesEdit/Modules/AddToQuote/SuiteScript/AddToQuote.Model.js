define('AddToQuote.Model', [
    'Quote.Model',
    'SC.Models.Init',
    'Configuration',
    'Application',
    'NetsuiteUtils.Model',
    'underscore'
], function AddToQuoteModel(
    QuoteModel,
    ModelsInit,
    Configuration,
    Application,
    NetsuiteUtilsModel,
    _
) {
    'use strict';

    return QuoteModel.extend({
        name: 'AddToQuote.Model',

        list: function list(data) {
            var self = this;
            var siteId;
            var filterSite;
            var searchFilterArray = null;
            var quotes = {};

            this.data = data;

            this.amountField = this.isMultiCurrency ? 'fxamount' : 'amount';

            this.filters = {
                entity: ['entity', 'is', nlapiGetUser()],
                mainline_operator: 'and',
                mainline: ['mainline', 'is', 'F']
            };

            this.columns = {
                trandate: new nlobjSearchColumn('trandate'),
                internalid: new nlobjSearchColumn('internalid'),
                tranid: new nlobjSearchColumn('tranid'),
                status: new nlobjSearchColumn('status'),
                amount: new nlobjSearchColumn(this.amountField)
            };

            if (this.isMultiCurrency) {
                this.columns.currency = new nlobjSearchColumn('currency');
            }

            if (this.data.from && this.data.to) {
                this.filters.date_operator = 'and';

                this.data.from = this.data.from.split('-');
                this.data.to = this.data.to.split('-');

                this.filters.date = [
                    'trandate',
                    'within',
                    new Date(this.data.from[0], this.data.from[1] - 1, this.data.from[2]),
                    new Date(this.data.to[0], this.data.to[1] - 1, this.data.to[2])
                ];
            } else if (this.data.from) {
                this.filters.date_from_operator = 'and';

                this.data.from = this.data.from.split('-');

                this.filters.date_from = [
                    'trandate',
                    'onOrAfter',
                    new Date(this.data.from[0], this.data.from[1] - 1, this.data.from[2])
                ];
            } else if (this.data.to) {
                this.filters.date_to_operator = 'and';

                this.data.to = this.data.to.split('-');

                this.filters.date_to = [
                    'trandate',
                    'onOrBefore',
                    new Date(this.data.to[0], this.data.to[1] - 1, this.data.to[2])
                ];
            }

            if (this.data.internalid) {
                this.data.internalid = _.isArray(this.data.internalid)
                    ? this.data.internalid
                    : this.data.internalid.split(',');
                this.filters.internalid_operator = 'and';
                this.filters.internalid = ['internalid', 'anyof', this.data.internalid];
            }

            if (this.data.createdfrom) {
                this.filters.createdfrom_operator = 'and';
                this.filters.createdfrom = ['createdfrom', 'is', this.data.createdfrom];
            }

            if (this.data.types) {
                this.filters.types_operator = 'and';
                this.filters.types = ['type', 'anyof', this.data.types.split(',')];
            }

            if (this.isMultiSite) {
                siteId = ModelsInit.session.getSiteSettings(['siteid']).siteid;
                filterSite =
                    Configuration.get('filterSite') || Configuration.get('filter_site');

                if (_.isString(filterSite) && filterSite === 'current') {
                    searchFilterArray = [siteId, '@NONE@'];
                } else if (_.isString(filterSite) && filterSite === 'all') {
                    searchFilterArray = [];
                } else if (_.isArray(filterSite)) {
                    searchFilterArray = filterSite;
                    searchFilterArray.push('@NONE@');
                } else if (_.isObject(filterSite) && filterSite.option) {
                    switch (filterSite.option) {
                    case 'all':
                        searchFilterArray = [];
                        break;
                    case 'siteIds':
                        searchFilterArray = filterSite.ids;
                        break;
                    default:
                        // case 'current' (current site) is configuration default
                        searchFilterArray = [siteId, '@NONE@'];
                        break;
                    }
                }

                if (searchFilterArray && searchFilterArray.length) {
                    this.filters.site_operator = 'and';
                    this.filters.site = ['website', 'anyof', _.uniq(searchFilterArray)];
                }
            }

            this.filters.item_operator = 'and';
            this.filters.item = ['item', 'noneof', '@NONE@'];
            this.filters.shipping_operator = 'and';
            this.filters.shipping = ['shipping', 'is', 'F'];
            this.filters.cogs_operator = 'and';
            this.filters.cogs = ['cogs', 'is', 'F'];
            this.filters.transactiondiscount_operator = 'and';
            this.filters.transactiondiscount = ['transactiondiscount', 'is', 'F'];
            this.filters.open_operator = 'and';
            this.filters.open = ['status', 'anyof', 'Estimate:A'];

            this.filters.taxline_operator = 'and';
            this.filters.taxline = ['taxline', 'is', 'F'];

            this.filters.quantity_operator = 'and';
            this.filters.quantity = ['quantity', 'notequalto', 0];

            this.columns.item = new nlobjSearchColumn('item');
            this.columns.name = new nlobjSearchColumn('custbody_transaction_name');
            this.columns.itemCnetId = new nlobjSearchColumn('custitem_pm_cnet_id', 'item');

            if (this.data.sort) {
                _.each(this.data.sort.split(','), function eachSortData(columnName) {
                    if (self.columns[columnName]) {
                        self.columns[columnName].setSort(self.data.order >= 0);
                    }
                });
            }

            this.search_results = Application.getAllSearchResults(
                'transaction',
                _.values(this.filters),
                _.values(this.columns)
            );

            _.each(this.search_results || [], function mapResults(record) {
                var quoteId = record.getValue('internalid');

                quotes[quoteId] = quotes[quoteId] || {
                    customname: record.getValue('custbody_transaction_name'),
                    tranid: record.getValue('tranid'),
                    trandate: record.getValue('trandate'),
                    internalid: quoteId
                };

                quotes[quoteId].currentItems = quotes[quoteId].currentItems || [];
                quotes[quoteId].currentItems.push(record.getValue('item'));

                if (record.getValue('custitem_pm_cnet_id', 'item')) {
                    quotes[quoteId].currentItems.push(record.getValue('custitem_pm_cnet_id', 'item'));
                }

            });

            return _.values(quotes);
        },

        addItemsToQuote: function addItemsToQuote(quoteId, items) {
            var quote = nlapiLoadRecord('estimate', quoteId);
            var self = this;
            _.each(items, function eachItem(item) {
                var newItem = self.processCNetDataAndCreateItem(item);
                quote.selectNewLineItem('item');
                quote.setCurrentLineItemValue('item', 'item', newItem.id);
                quote.setCurrentLineItemValue('item', 'quantity', newItem.quantity || 1);
                if (!newItem.type) {
                    newItem.type = 'InvtPart';
                }
                quote.setCurrentLineItemValue('item', 'itemtype', newItem.type);
                quote.commitLineItem('item');
            });
            nlapiSubmitRecord(quote, false, true);
        },

        processCNetDataAndCreateItem: function processCNetDataAndCreateItem(line) {
            var cnetData = _.find(line.options, function (option) {
                return option.cartOptionId === "CNET_DATA";
            });
            if (cnetData) {
                var cnetItem = cnetData.value;
                cnetItem.category = cnetItem.cat; // change the cat to use category

                cnetItem.price = cnetItem.price ? parseFloat(cnetItem.price.replace(/,/g, '')) : 0.0;
                cnetItem.weight = parseFloat(cnetItem.weight);

                // Item creation
                NetsuiteUtilsModel.itemData = cnetItem;

                var itemCreatedId = null;

                var checkData = NetsuiteUtilsModel.checkItem();
                if (checkData.status == "OK" && checkData.data > 0) {
                    itemCreatedId = checkData.data;
                }

                if (itemCreatedId) {
                    line.id = itemCreatedId;
                } else {
                    var item = NetsuiteUtilsModel.createItem();
                    // end Item creation
                    // set the correct item and perform line clean up.
                    if (item.data && item.data > 0) {
                        // change the internal id for the currently created item.
                        line.id = item.data;
                        // remove the item options since we are not going to use it anymore.
                        line.options = _.filter(line.options, function (option) {
                            return option.cartOptionId !== "CNET_DATA";
                        });

                    } else {
                        nlapiLogExecution('DEBUG', 'Error creating the item');
                    }
                }
            }
            return line;
        }
    });
});
