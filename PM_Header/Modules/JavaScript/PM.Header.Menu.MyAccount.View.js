// @module PM.Header.Menu.MyAccount.View
define('PM.Header.Menu.MyAccount.View', [
  'SC.Configuration',
  'Header.Menu.MyAccount.View',
  'MyAccountMenu',
  'MenuTree.View',
  'ProductList.Utils',
  'Utils',
  'underscore'
], function(
  Configuration,
  HeaderMenuMyAccountView,
  MyAccountMenu,
  MenuTreeView,
  ProductListUtils,
  Utils,
  _
) {
  'use strict';

  return {
    mountToApp: function(application) {
      _.extend(HeaderMenuMyAccountView.prototype, {
        initialize: _.wrap(HeaderMenuMyAccountView.prototype.initialize,
          function(fn) {
            var myAccountMenu = MyAccountMenu.MyAccountMenu.getInstance();

            // Dashboard
            if ((
                !Utils.isPhoneDevice() &&
                application.getConfig('siteSettings.sitetype') === 'STANDARD'
              ) ||
              application.getConfig('siteSettings.sitetype') !== 'STANDARD'
            ) {
              myAccountMenu.removeEntry('home');

              myAccountMenu.addEntry({
                id: 'dashboard',
                name: Utils.translate('Dashboard'),
                url: 'overview',
                index: 0
              });
            }

            myAccountMenu.removeEntry('subscriptions');
            myAccountMenu.removeEntry('orders');
            myAccountMenu.removeSubEntry('product_list_dummy');
            myAccountMenu.removeSubEntry('purchases');
            myAccountMenu.removeSubEntry('returns');
            myAccountMenu.removeSubEntry('reorderitems');
            myAccountMenu.removeSubEntry('quotes');
            myAccountMenu.removeSubEntry('balance');

            var isSCISIntegrationEnabled = Configuration.get(
              'siteSettings.isSCISIntegrationEnabled',
              false
            );

            // Transactions
            myAccountMenu.addEntry({
              id: 'transactions',
              name: Utils.translate('Transactions'),
              index: 1,
              permission: isSCISIntegrationEnabled
                ?
                'transactions.tranPurchases.1,transactions.tranEstimate.1,transactions.tranPurchasesReturns.1'
                :
                'transactions.tranSalesOrd.1,transactions.tranEstimate.1,transactions.tranRtnAuth.1',
              permissionOperator: 'OR'
            });

            myAccountMenu.addSubEntry({
              entryId: 'transactions',
              id: 'search_transaction',
              name: Utils.translate('Search'),
              url: 'search_transaction',
              index: 1
            });

            myAccountMenu.addSubEntry({
              entryId: 'transactions',
              id: 'quotes',
              name: Utils.translate('Quotes'),
              url: 'quotes',
              index: 2,
              permission: 'transactions.tranFind.1,transactions.tranEstimate.1'
            });

            myAccountMenu.addSubEntry({
              entryId: 'transactions',
              id: 'purchases',
              name: Utils.translate('Orders'),
              url: 'purchases',
              index: 3,
              permission: isSCISIntegrationEnabled
                ? 'transactions.tranFind.1,transactions.tranPurchases.1'
                : 'transactions.tranFind.1,transactions.tranSalesOrd.1'
            });

            myAccountMenu.replaceSubEntry('invoices', {
              entryId: 'transactions',
              id: 'invoices',
              name: Utils.translate('Invoices'),
              url: 'invoices',
              index: 4,
              permission: 'transactions.tranCustInvc.1'
            });

            myAccountMenu.addSubEntry({
              entryId: 'transactions',
              id: 'returns',
              name: Utils.translate('Return History'),
              url: 'returns',
              index: 5,
              permission: isSCISIntegrationEnabled
                ? 'transactions.tranFind.1,transactions.tranPurchasesReturns.1'
                : 'transactions.tranFind.1,transactions.tranRtnAuth.1'
            });

            // Purchase Authorization
            myAccountMenu.addEntry({
              id: 'purchase_authorization',
              name: Utils.translate('Purchase Authorization'),
              url: '',
              index: 3
            });

            myAccountMenu.addSubEntry({
              entryId: 'purchase_authorization',
              id: 'employees',
              name: Utils.translate('Employees'),
              url: 'employees',
              index: 1
            });

            myAccountMenu.addSubEntry({
              entryId: 'purchase_authorization',
              id: 'approvals',
              name: Utils.translate('Approvals'),
              url: 'approvals',
              index: 2
            });

            myAccountMenu.addSubEntry({
              entryId: 'purchase_authorization',
              id: 'purchase_rules',
              name: Utils.translate('Purchase Rules'),
              url: 'purchase_rules',
              index: 3
            });

            // Billing
            myAccountMenu.replaceEntry('billing', {
              id: 'billing',
              name: Utils.translate('Billing'),
              index: 4
            });
            myAccountMenu.replaceSubEntry('billing', {
              entryId: 'billing',
              id: 'transactionhistory',
              name: Utils.translate('Transaction History'),
              url: 'transactionhistory',
              permissionOperator: 'OR',
              permission:
                'transactions.tranCustInvc.1, transactions.tranCustCred.1, transactions.tranCustPymt.1, transactions.tranCustDep.1, transactions.tranDepAppl.1',
              index: 2
            });
            myAccountMenu.replaceSubEntry('printstatement', {
              entryId: 'billing',
              id: 'printstatement',
              name: Utils.translate('Print a Statement'),
              url: 'printstatement',
              index: 1,
              permission: 'transactions.tranStatement.2'
            });

            // Settings
            myAccountMenu.replaceSubEntry('paymentmethods', {
              entryId: 'settings',
              id: 'paymentmethods',
              name: Utils.translate('Credit Cards'),
              url: 'paymentmethods',
              index: 4
            });

            myAccountMenu.addSubEntry({
              entryId: 'settings',
              id: 'shipcarrier',
              name: Utils.translate('Shipping Account'),
              url: 'shipcarrier',
              index: 6
            });

            // Advanced Report
            myAccountMenu.addEntry({
              id: 'reports',
              name: Utils.translate('Advanced Reports'),
              index: 7
            });
            myAccountMenu.addSubEntry({
              entryId: 'reports',
              id: 'viewall',
              name: Utils.translate('View All'),
              url: 'reports',
              index: 1
            });

            // Renewal
            myAccountMenu.addEntry({
              id: 'renewals',
              name: Utils.translate('Reminders'),
              index: 8
            });

            myAccountMenu.addSubEntry({
              entryId: 'renewals',
              id: 'reminders',
              name: Utils.translate('Reminders'),
              url: 'reminders',
              index: 1
            });

            myAccountMenu.addSubEntry({
              entryId: 'renewals',
              id: 'addreminder',
              name: Utils.translate('New Reminder'),
              url: 'addreminder',
              index: 2
            });

            myAccountMenu.getEmitter()
              .on('entriesChanged', this.replaceProductList);

            return fn.apply(this, _.toArray(arguments).slice(1));
          }),
        replaceProductList: function() {
          var myAccountMenu = MyAccountMenu.MyAccountMenu.getInstance(),
            entryToReplace = _.find(myAccountMenu.entries,
              entry => entry.id === 'productlists');

          if (entryToReplace && entryToReplace.name ===
            Utils.translate('Wishlist')) {
            myAccountMenu.replaceEntry('productlists', {
              id: 'productlists',
              name: Utils.translate('Product lists'),
              url: '',
              index: 2
            });
          }

          var subEntryToReplace = _.find(myAccountMenu.subEntries,
            entry => entry.id === 'productlist_all');

          if (subEntryToReplace && subEntryToReplace.name ===
            Utils.translate('All my lists')) {
            myAccountMenu.replaceSubEntry('productlist_all', {
              entryId: 'productlists',
              id: 'productlist_all',
              name: Utils.translate('All Product Lists'),
              url: 'wishlist',
              index: 1
            });
          }
        }
      });
    }
  };
});
