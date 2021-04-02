define('PMRestrictCheckoutAddress.MyAccount', [
  'Backbone',
  'Backbone.CollectionView',
  'backbone_collection_view_cell.tpl',
  'backbone_collection_view_row.tpl',
  'Address.Details.View',
  'Address.List.View',
  'OrderWizard.Module.Address',
  'request_address_details_custom.tpl',
  'address_list_custom.tpl',
  'underscore',
  'RequestQuoteWizard.Step',
  'QuoteToSalesOrderWizard.Step',
  'request_order_wizard_step.tpl',
  'quote_to_salesorder_wizard_step.tpl',
  'request_address_module.tpl'
], function(
  Backbone,
  BackboneCollectionView,
  backbone_collection_view_cell_tpl,
  backbone_collection_view_row_tpl,
  AddressDetailsView,
  AddressListView,
  OrderWizardModuleAddress,
  request_address_details_custom_tpl,
  address_list_custom_tpl,
  _,
  RequestQuoteWizardStep,
  QuoteToSalesOrderWizardStep,
  request_order_wizard_step_tpl,
  quote_to_salesorder_wizard_step_tpl,
  request_address_module_tpl
) {
  // 'use strict';

  return {
    mountToApp: function mountToApp() {
      var selectedId;
      var lineCount = 0;

      _.extend(OrderWizardModuleAddress.prototype, {
        template: request_address_module_tpl,
        events: {
          'click [data-action="select"]': 'selectAddress',
          'click [data-action="selected"]': 'selectedAddress',
          'click [data-action="change-selected-address"]': 'changeSelectedAddress',
          'click [data-action="edit-address"]': 'editAddress',
          'click [data-action="submit"]': 'submit',
          'click [data-action="change-address"]': 'changeAddressHandler',
          'click [data-action="remove"]': 'validateAddressRemovalHandler',
          'change [data-action="same-as"]': 'markSameAsHandler',
          'change form': 'changeForm'
        },
        markSameAsHandler: function(e) {
          const is_checked = jQuery(e.target).prop('checked');

          this.sameAs = is_checked;

          this.model.set('sameAs', is_checked);

          this.setAddress(
            is_checked ? this.model.get(this.sameAsManage) : null
          );

          this.isSameAsSelected = is_checked;

          this.render();
        },
        editAddress: function(e) {
          var address_id_str = this.$(e.target).data('id');
          // console.log("address id " + address_id_str);
          var address_id = parseInt(address_id_str, 10);
          _.each(this.addresses.models, function(addrModel) {
            addrModel.unset('showAllAddress', {silent: true});
            return true;
          });
          if (_.isNaN(address_id) || !_.isNumber(address_id)) {
            e.stopPropagation();
            e.preventDefault();
            var collection = this.getAddressCollection();
            var selected_address = collection.get(address_id_str);
            var view_1;
            selected_address.unset('internalid', {silent: true});
            view_1 = new AddressEditView({
              application: this.wizard.application,
              collection: collection,
              model: selected_address
            });
            var add_new_address_on_profile_1 = function(model) {
              // Make sure that the new address now take part of the profile addresses
              // This is important if a temporal address is edited more than once
              this.wizard.options.profile.get('addresses').add(model);
            }.bind(this);
            var reset_current_address_1 = function(model) {
              // After saving the temp address, we set it as the one selected
              this.setAddress(model.id);
            };
            view_1.model.once('change', add_new_address_on_profile_1, this);
            // If the address being edited is the selected one we must re-set once it is created
            if (this.wizard.model.get(this.manage) === address_id_str) {
              view_1.model.once('sync', reset_current_address_1, this);
            }
            view_1.once(
              'modal-close',
              function() {
                view_1.model.off('sync', reset_current_address_1);
                view_1.model.off('change', add_new_address_on_profile_1);
              },
              this
            );
            this.wizard.application.getLayout().showInModal(view_1);
            jQuery('#addrSearchInput').val('');
            jQuery('#addressSearchDropdown .addressItem').each(function() {
              jQuery(this).hide();
            });
            jQuery('#addressSearchDropdown').hide();
          }
        },
        changeSelectedAddress: function() {
          // console.log("changeAddress is triggered");
          // console.log(jQuery('#addressSearchDropdown'));
          jQuery('#addressSearchDropdown').css('display', 'block');

          this.model.set('showAddress', true);

          _.each(this.addresses.models, function(addrModel) {
            addrModel.set('showAllAddress', true);
            return true;
          });
          this.render();
          this.trigger('ready', true);
        },
        selectAddress: function(e) {
          this.model.set('showAddress', false);
          jQuery('.wizard-content .alert-error').hide();
          // Grabs the address id and sets it to the model
          // on the position in which our sub class is managing (billaddress or shipaddress)

          var clickData = e.currentTarget.attributes['data-id'];

          var clickInternalId = clickData.value;

          var internalid = e.currentTarget.id;

          if (internalid) {
            this.setAddress(internalid.toString());
          } else if (clickInternalId) {
            this.setAddress(clickInternalId.toString());
          } else if (jQuery(e.target).data('id')) {
            this.setAddress(jQuery(e.target).data('id').toString());
          }

          var showAddress = !!this.model.get('showAddress');
          _.each(this.addresses.models, function(addrModel) {
            addrModel.set('showAllAddress', showAddress);
            // console.log(addrModel);
            return true;
          });
          // re render so if there is changes to be shown they are represented in the view
          this.render();
          // As we already set the address, we let the step know that we are ready
          this.trigger('ready', true);
          var sameAsBilling = $('#sameAsShipping').val();

          //console.log(this.model)
          if (sameAsBilling === 1) {
            $('#sameAsShipping').val('0');
            $('#sameAsShipping').prop('checked', false);
          }
          jQuery('#addrSearchInput').val('');
          jQuery('#addressSearchDropdown .addressItem').each(function() {
            jQuery(this).hide();
          });
          jQuery('#addressSearchDropdown').hide();
        },
        selectedAddress: function(e) {
          this.model.set('showAddress', false);
          jQuery('.wizard-content .alert-error').hide();
          // Grabs the address id and sets it to the model
          // on the position in which our sub class is managing (billaddress or shipaddress)

          var clickData = e.currentTarget.attributes['data-id'];

          var clickInternalId = clickData.value;

          var internalid = e.currentTarget.id;

          if (internalid) {
            this.setAddress(internalid.toString());
          } else if (clickInternalId) {
            this.setAddress(clickInternalId.toString());
          } else if (jQuery(e.target).data('id')) {
            this.setAddress(jQuery(e.target).data('id').toString());
          }
          var showAddress = !!this.model.get('showAddress');
          _.each(this.addresses.models, function(addrModel) {
            addrModel.set('showAllAddress', showAddress);
            //   console.log(addrModel);
            return true;
          });
          // re render so if there is changes to be shown they are represented in the view
          this.render();
          // As we already set the address, we let the step know that we are ready
          this.trigger('ready', true);
          var sameAsBilling = $('#sameAsShipping').val();

          //console.log(this.model)
          if (sameAsBilling === 1) {
            $('#sameAsShipping').val('0');
            $('#sameAsShipping').prop('checked', false);
          }
          jQuery('#addrSearchInput').val('');
          jQuery('#addressSearchDropdown .addressItem').each(function() {
            jQuery(this).hide();
          });
          jQuery('#addressSearchDropdown').hide();
        },
        render: function(not_trigger_ready) {
          // Is Active is overridden by child modules, like Shipping to hide this module in Multi Ship To
          if (!this.isActive()) {
            return this.$el.empty();
          }
          this.addresses = this.getAddressCollection();
          this.isGuest = this.getIsCurrentUserGuest();
          this.isSameAsEnabled = _.isFunction(this.options.enable_same_as)
            ? this.options.enable_same_as()
            : this.options.enable_same_as;
          this.addressId = this.model.get(this.manage);
          this.evaluateDisablingSameAsCheckBox();
          // if the selected manage address is the fake one
          if (this.addressId && ~this.addressId.indexOf('null')) {
            // we silently remove it
            this.setAddress(null, {
              silent: true
            });
          }
          this.sameAs = false;
          this.address = this.getSelectedAddress();
          // Add event listeners to allow special flows
          this.eventHandlersOn();

          // Calls the render function
          this._render();
          const is_address_new = this.address.isNew();
          if (!(
            (
              this.isSameAsEnabled && this.sameAs
            ) || (
            this.addressId && !is_address_new
            )
          ) && this.isGuest && !is_address_new) {
            this.setAddress(this.address.id, {
              silent: true
            });
          }

          // The module is ready when a valid address is selected.
          if (
            !not_trigger_ready &&
            this.address &&
            this.addressId &&
            this.address.get('isvalid') === 'T'
          ) {
            this.trigger('ready', true);
          }
        },
        getContext: _.wrap(
          OrderWizardModuleAddress.prototype.getContext,
          function(fn) {
            var context = fn.apply(this, _.toArray(arguments).slice(1));

            var selectedAddressId = context.selectedAddressId;
            if (!selectedAddressId) {
              if (this.addresses.models.length > 0) {
                selectedAddressId = this.addresses.models[0].get('internalid');
                selectedId = selectedAddressId;
              }
              context.selectedAddressId = selectedAddressId;
            } else {
              selectedId = null;
            }

            context.showAddress = this.model.get('showAddress');

            var addressArray = this.addresses;
            // console.log(addressArray);
            var addressList = [];
            addressArray.models.forEach(function(model) {
              var addressLine = model.get('addr1')
                ? model.get('addr1') + ' '
                : '' + ' ' + model.get('addr2')
                  ? model.get('addr2') + ' '
                  : '' + model.get('addr3')
                    ? model.get('addr3') + ' '
                    : '';
              addressList.push({
                address:
                  model.get('fullname') +
                  ', ' +
                  addressLine +
                  ', ' +
                  model.get('city') +
                  ' ' +
                  model.get('state') +
                  ' ' +
                  model.get('zip') +
                  ', ' +
                  model.get('country'),
                internalid: model.get('internalid')
              });

              return true;
            });

            context.isFirstStep =
              this.wizard.currentStep === 'request-a-quote' ||
              this.wizard.currentStep === 'quotetosalesorder-review' ||
              this.wizard.currentStep === 'quotetosalesorder-review-billing';
            context.addressList = addressList;

            if (this.isSameAsSelected) {
              context.isSameAsSelected = true;
            }
            // console.log(context);
            // _.each(this.addresses.models, function (addrModel) {
            //   addrModel.set("showCustomized", true);
            //   addrModel.set("showAllAddress", false);
            //   return true;
            // });
            return context;
          }
        )
      });

      _.extend(AddressDetailsView.prototype, {
        template: request_address_details_custom_tpl,
        getContext: _.wrap(AddressDetailsView.prototype.getContext,
          function(fn) {
            var context = fn.apply(this, _.toArray(arguments).slice(1));

            context.isFirstStep = false;
            context.showAddress = [];
            var addressLine = '';
            if (context.addressLine1 && context.addressLine2) {
              addressLine = context.addressLine1
                + context.addressLine2;
            }

            if (context.addressLine1 && !context.addressLine2) {
              addressLine = context.addressLine1;
            }

            if (context.addressLine2 && !context.addressLine1) {
              addressLine = context.addressLine2;
            }

            context.showAddress.push({
              address:
                context.fullname +
                ', ' +
                addressLine +
                ', ' +
                context.city +
                ' ' +
                context.state +
                ' ' +
                context.zip +
                ', ' +
                context.country,
              internalid: context.internalid

            });

            if (this.parentView.parentView) {
              if (this.parentView.parentView.step) {
                if (
                  this.parentView.parentView.step.step_url &&
                  (
                    this.parentView.parentView.step.step_url ===
                    'request-a-quote' ||
                    this.parentView.parentView.step.step_url ===
                    'quotetosalesorder-review' ||
                    this.parentView.parentView.step.step_url ===
                    'quotetosalesorder-review-billing'
                  )
                ) {
                  context.isFirstStep = true;
                }

                if ((
                  this.parentView.parentView.step.step_url !==
                  'request-a-quote' ||
                  this.parentView.parentView.step.step_url !==
                  'quotetosalesorder-review'
                )
                ) {
                  if (lineCount === 0) {
                    context.addSearchBar = true;

                    this.model.set('showAddress', true);
                    lineCount++;
                  }
                }
              }
            }

            if (selectedId && context.internalid === selectedId) {
              context.isSelected = true;
            }

            if (Backbone.history.getFragment() === 'addressbook') {
              context.showRemoveButton = true;
              context.showChangeButton = false;
            } else {
              context.showRemoveButton = false;
              context.showChangeButton = true;
            }

            if (this.options && this.options.isShippingDetails) {
              context.isSelected = true;
              context.isFirstStep = true;

              if (this.options.showSearchBar) {
                context.showSearchBar = this.options.showSearchBar;
                context.showChangeButton = true;

                if (this.parentView) {
                  var addressArray = this.parentView.addresses;
                  var addressList = [];
                  addressArray.forEach(function(model) {
                    var addressLine = model.get('addr1')
                      ? model.get('addr1') + ' '
                      : ' ' + model.get('addr2')
                        ? model.get('addr2') + ' '
                        : '' + model.get('addr3')
                          ? model.get('addr3') + ' '
                          : '';
                    addressList.push({
                      address: model.get('fullname') + ', ' + addressLine +
                        ', ' +
                        model.get('city') + ' ' + model.get('state') + ' ' +
                        model.get('zip') + ', ' + model.get('country'),
                      internalid: model.get('internalid')
                    });

                    return true;
                  });

                  context.addressList = addressList;
                }
              }
            }

            return context;
          })
      });

      _.extend(AddressListView.prototype, {
        template: address_list_custom_tpl,
        events: _.extend(AddressListView.prototype.events, {
          'keyup #addrSearchInput': 'filterAddress',
          'click .selectAddress': 'selectAddress',
          'click .updateAddress': 'updateAddress'
        }),
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
        selectAddress: function(e) {
          var id = jQuery(e.target).attr('addrid');
          jQuery(
            '.address-details-action-custom[data-action="change-selected-address"]'
          ).trigger('click');
          jQuery(
            '.address-details-action[data-id="' +
            id +
            '"][data-action="select"]'
          ).trigger('click');
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
        getContext: _.wrap(
          AddressListView.prototype.getContext,
          function wrappedInitialize(fn, options) {
            var context = fn.apply(this, _.toArray(arguments).slice(1));

            var addressArray = this.collection.models;
            var addressList = [];
            addressArray.forEach(function(model) {
              var addressLine = model.get('addr1')
                ? model.get('addr1') + ' '
                : ' ' + model.get('addr2')
                  ? model.get('addr2') + ' '
                  : '' + model.get('addr3')
                    ? model.get('addr3') + ' '
                    : '';
              addressList.push({
                address: model.get('fullname') + ', ' + addressLine + ', ' +
                  model.get('city') + ' ' + model.get('state') + ' ' +
                  model.get('zip') + ', ' + model.get('country'),
                internalid: model.get('internalid')
              });

              return true;
            });

            context.addressList = addressList;

            return context;
          }
        )
      });

      _.extend(RequestQuoteWizardStep.prototype, {
        template: request_order_wizard_step_tpl,
        events: {
          'keyup #addrSearchInput': 'filterAddress',
          'click .selectAddress': 'selectAddress',
          'click .updateAddress': 'updateAddress'
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
        selectAddress: function(e) {
          var id = jQuery(e.target).attr('addrid');
          jQuery(
            '.address-details-action-custom[data-action="change-selected-address"]'
          ).trigger('click');
          jQuery(
            '.address-details-action[data-id="' +
            id +
            '"][data-action="select"]'
          ).trigger('click');
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
        }
      });

      _.extend(QuoteToSalesOrderWizardStep.prototype, {
        template: quote_to_salesorder_wizard_step_tpl,
        events: {
          'keyup #addrSearchInput': 'filterAddress',
          'click .selectAddress': 'selectAddress',
          'click .updateAddress': 'updateAddress'
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
        selectAddress: function(e) {
          var id = jQuery(e.target).attr('addrid');
          jQuery(
            '.address-details-action-custom[data-action="change-selected-address"]'
          ).trigger('click');
          jQuery(
            '.address-details-action[data-id="' +
            id +
            '"][data-action="select"]'
          ).trigger('click');
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
        }
      });

      if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
          value: function(predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
              throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
              throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
              // a. Let Pk be ! ToString(k).
              // b. Let kValue be ? Get(O, Pk).
              // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
              // d. If testResult is true, return k.
              var kValue = o[k];
              if (predicate.call(thisArg, kValue, k, o)) {
                return k;
              }
              // e. Increase k by 1.
              k++;
            }

            // 7. Return -1.
            return -1;
          },
          configurable: true,
          writable: true
        });
      }
    }
  };
});
