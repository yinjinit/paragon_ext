define('Quotes.Edit.View', [
  'Backbone.CollectionView',
  'backbone_collection_view_cell.tpl',
  'backbone_collection_view_row.tpl',
  'Quote.Details.View',
  'Cart.Lines.View',
  'Quotes.Item.Actions.View',
  'Quotes.Item.Summary.View',
  'Quotes.Save.Modal',
  'GlobalViews.Confirmation.View',
  'GlobalViews.Message.View',
  'ShareQuote.View',
  'QuoteEdit.Model',
  'CopyQuote.Model',
  'Profile.Model',
  'Address.Details.View',
  'Utils',
  'quotes_edit.tpl',
  'order_wizard_address_module.tpl',
  'order_wizard_address_row.tpl',
  'order_wizard_address_cell.tpl',
  'paymentinstrument_creditcard_edit.tpl',
  'underscore',
  'Backbone',
  'jQuery'
], function QuotesEditView(
  BackboneCollectionView,
  backbone_collection_view_cell_tpl,
  backbone_collection_view_row_tpl,
  QuoteDetailsView,
  TransactionLineViewsCellNavigableView,
  QuotesItemActionsView,
  QuotesItemSummaryView,
  QuotesSaveModal,
  GlobalViewsConfirmationView,
  GlobalViewsMessageView,
  ShareQuoteView,
  QuoteEditModel,
  CopyQuoteModel,
  ProfileModel,
  AddressDetailsView,
  Utils,
  quotesEditTpl,
  orderWizardAddressModuleTpl,
  orderWizardAddressRowTpl,
  orderWizardAddressCellTpl,
  paymentInstrumentCreditCardEditTpl,
  _,
  Backbone,
  jQuery
) {
  'use strict';

  return _.extend(QuoteDetailsView.prototype, {
    template: quotesEditTpl,
    title: 'Quote Edit',
    events: {
      'click [data-action="remove-item"]': 'removeItem',
      'click [data-action="undo-remove"]': 'undoRemove',
      'click [data-action="save-quote"]': 'saveQuote',
      'click [data-action="copy-quote"]': 'copyQuote',
      'click [data-action="convert-to-order"]': 'saveAndConvertToOrder',
      'click [data-action="open-share-modal"]': 'openShareModal',
      'change [data-type="cart-item-quantity-input"]': 'debouncedUpdateItemQuantity',
      'change #notes': 'showSaveButton',
      'keypress #notes': 'showSaveButton',
      'change #name': 'showSaveButton',
      'keypress #name': 'showSaveButton',
      'keypress [data-type="cart-item-quantity-input"]': 'debouncedUpdateItemQuantity',
      'click [data-action="remove"]': 'removeAddress',
      'click .address-details-selector[data-action="select"]': 'selectAddress',
      'keyup #addrSearchInput': 'filterAddress',
      'click .selectAddress': 'selectAddressFromSearch',
      'click .updateAddress': 'updateAddress',
      'click [data-action="change-selected-address"]': 'changeSelectedAddress'
    },

    initialize: function initialize(options) {
      this.application = options.application;
      this.model = new QuoteEditModel({
        internalid: options.routerArguments[0]
      });

      this.profileModel = ProfileModel.getInstance();
      this.addresses = this.profileModel.get('addresses');

      this.addresses.on(
        'reset sync add remove change destroy',
        function resetSycnAddRemoveChangeDestroyAddress() {
          if (this.addresses.length) {
            this.addresses.sort();
            this.render();
          }
        },
        this
      );

      // @property {Quote.Details.View.ErrorMessages} statusTranslationKeys
      this.statusTranslationKeys = {
        INVALIDPERMISSION: Utils.translate('Not allowed'),
        INVALIDENTITYSTATUS: Utils.translate('Sales representative approval'),
        MISSINGSHIPMETHOD: Utils.translate('Shipping information'),
        MISSINGSHIPADDRESS: Utils.translate('Shipping information'),
        GIFTCERTIFICATENOTALLOWED: Utils.translate(
          'Gift Certificate not allowed'),
        MISSINGSALESREP: Utils.translate('Sales Representative assigned')
      };
    },

    validInputValue: function validInputValue(input) {
      if ((
        input.validity && !input.validity.valid
      ) || input.value === '') {
        return false;
      }
      return !isNaN(input.value);
    },

    undoRemove: function undoRemove(e) {
      e.preventDefault();
      this.model.get('lines').add(this.removedItem);
      this.model.get('lines').comparator = function comparatorSort(line) {
        return line.get('internalid');
      };
      this.model.get('lines').sort();
      this.removedItem = null;
      this.updateQuote();
    },
    saveQuoteModal: function saveQuote(e) {
      var self = this;
      var quotesSaveModalView = new QuotesSaveModal({
        name: this.model.get('customname'),
        notes: this.model.get('customnotes')
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
            notes: this.$('#in-modal-notes').val(),
            saveOnly: true
          });
        },
        cancelCallBack: jQuery.proxy(this.cancelSaveQuote, this),
        title: _('Save as Quote').translate(),
        autohide: true,
        body: quotesSaveModalView.$el.html()
      });

      this.options.application.getLayout().showInModal(saveQuoteeModal);
    },
    saveAndConvertToOrder: function saveAndConvertToOrder(e) {
      var $el = jQuery(e.currentTarget);

      e.preventDefault();

      this.saveQuote({
        name: this.model.get('customname'),
        notes: this.model.get('customnotes'),
        convertToQuote: true,
        convertToQuoteUrl: $el.data('url')
      });
    },
    saveQuote: function saveQuote(options) {
      var savePromise;
      var self = this;
      this.model.set('customname', this.$('#name').val());
      this.model.set('customnotes', this.$('#notes').val());
      this.model.set('step', 'details');

      savePromise = this.model.save(null, {type: 'POST'});

      this.disableElementsOnPromise(savePromise,
        '.quote-details-view button, .quote-details-view a, .quote-details-view input, .quote-details-view textarea');

      savePromise.done(function modelSave() {
        if (options.convertToQuote) {
          Backbone.history.navigate(options.convertToQuoteUrl,
            {trigger: true, replace: true});
        } else {
          self.quoteSaved = true;
          self.render();
        }
      });
    },
    openShareModal: function openShareModal() {
      var view = new ShareQuoteView({
        application: this.options.application,
        quoteModel: this.model,
        editView: this
      });
      view.showInModal();
    },
    copyQuote: function copyQuote() {
      var self = this;
      var copyModel = new CopyQuoteModel();
      var copyPromise = copyModel.save(
        {internalid: this.model.get('internalid')});
      this.disableElementsOnPromise(copyPromise,
        '.quote-details-view button, .quote-details-view a, .quote-details-view input, .quote-details-view textarea');

      copyPromise.done(function copyDone(resp) {
        self.showSuccessMessage(Utils.translate(
          'Quote copied in <a href="/quotes/' + resp.internalid + '">' +
          resp.tranid));
      });
    },
    showSuccessMessage: function showSuccessMessage(text) {
      var globalViewMessage = new GlobalViewsMessageView({
        message: Utils.translate(text),
        type: 'success',
        closable: false
      });
      self.$('[data-type="alert-placeholder-copy"]').empty().show();
      this.$('[data-type="alert-placeholder-copy"]').append(
        globalViewMessage.render().$el.html()
      );
      _.delay(function hideMessage() {
        self.$('[data-type="alert-placeholder-copy"]').fadeOut();
      }, 3000);
      jQuery('html, body').animate({scrollTop: '0px'});
    },
    showSaveButton: function enableSaveButton() {
      this.model.set('customname', this.$('#name').val());
      this.model.set('customnotes', this.$('#notes').val());
      this.$('[data-action="save-quote"]').show();
    },
    updateQuote: function updateQuote() {
      var updatePromise;
      var self = this;
      this.model.set('customname', this.$('#name').val());
      this.model.set('customnotes', this.$('#notes').val());
      this.model.set('step', 'details');

      updatePromise = this.model.save();
      this.disableElementsOnPromise(updatePromise,
        '.quote-details-view button, .quote-details-view a, .quote-details-view input, .quote-details-view textarea');

      updatePromise.done(function doneUpdate() {
        self.render();
        self.showSaveButton();
      });
    },
    debouncedUpdateItemQuantity: _.debounce(
      function debouncedUpdateItemQuantity(e) {
        this.updateItemQuantity(e);
      }, 1000),
    updateItemQuantity: function updateItemQuantity(e) {
      var $form = jQuery(e.target).closest('form');
      var options = $form.serializeObject();
      var internalid = options.internalid;
      var line = this.model.get('lines').get(internalid);
      var $input = $form.find('[name="quantity"]');
      var validInput = this.validInputValue($input[0]);
      var newQuantity;
      var item;
      var minQuantity;
      var maxQuantity;
      var currentQuantity1;
      var invalid;
      var placeholder1;

      e.preventDefault();
      if (!validInput || options.quantity) {
        newQuantity = parseInt(options.quantity, 10);
        item = line.get('item');
        minQuantity = item
          ? item.get('_minimumQuantity', true)
          : line.get('minimumquantity');
        maxQuantity = item
          ? item.get('_maximumQuantity', true)
          : line.get('maximumquantity');
        currentQuantity1 = parseInt(line.get('quantity'), 10);
        newQuantity =
          newQuantity >= minQuantity ? newQuantity : currentQuantity1;
        newQuantity =
          !!maxQuantity && newQuantity > maxQuantity ? currentQuantity1 :
            newQuantity;
        $input.val(newQuantity);
        if (newQuantity !== currentQuantity1) {
          line.set('quantity', newQuantity);
          invalid = line.validate();
          if (!invalid) {
            this.updateQuote();
          } else {
            placeholder1 =
              this.$('#' + internalid + ' [data-type="alert-placeholder"]');
            placeholder1.empty();
            _.each(invalid, function eachInvalid(value) {
              var globalViewMessage = new GlobalViewsMessageView({
                message: value,
                type: 'error',
                closable: true
              });
              placeholder1.append(globalViewMessage.render().$el.html());
            });
            line.set('quantity', currentQuantity1);
          }
        }
      }
    },
    removeItem: function removeItem(e) {
      if (this.model.get('lines').length > 1) {
        this.removedItem =
          this.model.get('lines').remove(this.$(e.target).data('internalid'));
        this.updateQuote();
      } else {
        self.$('.quote-edit-remove-limit-item').show();
        _.delay(function hideMessage() {
          self.$('.quote-edit-remove-limit-item').fadeOut();
        }, 5000);
      }
    },
    childViews: _.extend(QuoteDetailsView.prototype.childViews, {
      'Items.EditCollection': function ItemEditCollection() {
        return new BackboneCollectionView({
          collection: this.model.get('lines'),
          childView: TransactionLineViewsCellNavigableView,
          viewsPerRow: 1,
          childViewOptions: {
            ActionsView: QuotesItemActionsView,
            SummaryView: QuotesItemSummaryView,
            application: this.options.application,
            navigable: !this.options.application.isStandalone,
            showAlert: false
          }
        });
      },
      'Shipping.Address': function ShippingAddress() {
        // Todo
        var addrModel = this.model.get('addresses').get(this.model.get('shipaddress'));

        if (!addrModel) {
          addrModel = this.addresses.get(this.model.get('shipaddress'));
        }

        return new AddressDetailsView({
          model: addrModel,
          hideDefaults: true,
          hideActions: false,
          isShippingDetails: true,
          showSearchBar: !!this.model.get('showSearchBar')
        });
      }
    }),
    removeAddress: function removeAddress(e) {
      var deleteConfirmationView;
      e.preventDefault();

      deleteConfirmationView = new GlobalViewsConfirmationView({
        callBack: this.removeAddressModel,
        callBackParameters: {
          context: this,
          addressId: jQuery(e.target).data('id')
        },
        title: Utils.translate('Remove Address'),
        body: Utils.translate('Are you sure you want to delete this address?'),
        autohide: true
      });

      this.options.application.getLayout().showInModal(deleteConfirmationView);
    },
    removeAddressModel: function removeAddressModel(options) {
      options.context.addresses.get(options.addressId).destroy({wait: true});
    },
    getAddressesToShow: function getAddressesToShow() {
      var addressesToShow;
      var addresses = this.addresses;

      if (addresses && !!addresses.length) {
        addressesToShow = paymentInstrumentCreditCardEditTpl
          ? addresses.getCollectionForRendering()
          : addresses;
      }

      return addressesToShow ? addressesToShow.models : [];
    },
    getAddressListOptions: function getAddressListOptions() {
      return {
        showSelect: true,
        showMultiSelect: false,
        selectMessage: this.selectMessage || '',
        hideDefaults: true,
        showError: true,
        hideSelector: false,
        selectedAddressId: this.model.get('shipaddress')
      };
    },
    selectAddress: function selectAddress(e) {
      var $el = jQuery(e.currentTarget);
      this.model.set('shipaddress', $el.data('id').toString());
      this.render();
      this.showSaveButton();
    },
    filterAddress: function() {
      var filter = jQuery('#addrSearchInput').val().toUpperCase();
      if (filter.length < 3) {
        jQuery('#addressSearchDropdown .addressItem').each(function() {
          jQuery(this).hide();
        });
      } else {
        jQuery('#addressSearchDropdown .addressItem').each(function() {
          if (
            jQuery(this).find('span').text().toUpperCase().indexOf(filter) >
            -1
          ) {
            jQuery(this).show();
          } else {
            jQuery(this).hide();
          }
        });
      }
    },
    selectAddressFromSearch: function(e) {
      var id = jQuery(e.target).attr('addrid');
      this.model.set('shipaddress', id.toString());
      this.model.unset('showSearchBar');
      this.render();
      this.showSaveButton();
    },
    updateAddress: function(e) {
      var id = jQuery(e.target).attr('addrid');
      jQuery(
        '.address-details-action-custom[data-action="change-selected-address"]'
      ).trigger('click');
      // console.log(id, jQuery('.address-details-action-custom[data-id="'+id+'"][data-action="edit-address"]').length );
      jQuery(
        '.address-details-action-custom[data-id="' +
        id +
        '"][data-action="edit-address"]'
      ).trigger('click');
    },
    changeSelectedAddress: function() {
      this.model.set('showSearchBar', true);
      this.render();
    },
    getContext: _.wrap(QuoteDetailsView.prototype.getContext,
      function wrapGetContext(fn) {
        var context = fn.apply(this, _.toArray(arguments).slice(1));

        if (this.removedItem) {
          context.removedItem =
            this.removedItem.get('item').get('_name');
        }

        if (this.quoteSaved) {
          context.quoteSaved = true;
          this.quoteSaved = false;
          jQuery('html, body').animate({scrollTop: '0px'});
          _.delay(function hideMessage() {
            self.$('.quote-edit-save-quote').fadeOut();
          }, 3000);
        }

        console.log('Quotes.Edit.View.js originalContext');
        console.log(context);
        return context;
      })
  });
});
