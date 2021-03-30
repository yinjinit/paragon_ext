define("PMRestrictCheckoutAddress", [
  "Address.Details.View",
  "Address.Edit.View",
  "OrderWizard.Module.Address",
  "address_details_custom.tpl",
  "underscore",
  "RequestQuoteWizard.Step",
  "request_order_wizard_step.tpl",
  "address_module.tpl",
  "Profile.Model",
  "Address.Model",
  "Backbone.FormView",
  "Utils",
  "SC.Configuration",
], function (
  AddressDetailsView,
  AddressEditView,
  OrderWizardModuleAddress,
  address_details_custom_tpl,
  _,
  RequestQuoteWizardStep,
  request_order_wizard_step_tpl,
  address_module_tpl,
  ProfileModel,
  AddressModel,
  BackboneFormView,
  Utils,
  Configuration
) {
  // 'use strict';

  return {
    mountToApp: function mountToApp(container) {
      var selectedId;
      var addressArray = [];
      OrderWizardModuleAddress.prototype.getContext = _.wrap(
        OrderWizardModuleAddress.prototype.getContext,
        function (fn) {
          var context = fn.apply(this, _.toArray(arguments).slice(1));
          var selectedAddressId = context.selectedAddressId;
          if (!selectedAddressId) {
            if (this.addresses.models.length > 0) {
              selectedAddressId = this.addresses.models[0].get("internalid");
              selectedId = selectedAddressId;
            }
            context.selectedAddressId = selectedAddressId;
          } else {
            selectedId = null;
          }
          var addressArray = this.wizard.profileModel.get("addresses");
          // console.log(addressArray);
          var addressList = [];
          addressArray.models.forEach(function (model) {
            var addressLine = model.get("addr1")
              ? model.get("addr1") + " "
              : "" + " " + model.get("addr2")
              ? model.get("addr2") + " "
              : "" + model.get("addr3")
              ? model.get("addr3") + " "
              : "";
            addressList.push({
              address:
                model.get("fullname") +
                ", " +
                addressLine +
                ", " +
                model.get("city") +
                " " +
                model.get("state") +
                " " +
                model.get("zip") +
                ", " +
                model.get("country"),
              internalid: model.get("internalid"),
            });

            return true;
          });
          //console.log(this.wizard.currentStep);
          if (
            this.wizard.currentStep === "shipping/address" ||
            this.wizard.currentStep === "billing"
          ) {
            context.isFirstStep = true;
          } else {
            context.isFirstStep = false;
          }
          context.addressList = addressList;

          if (this.isSameAsSelected) {
            context.isSameAsSelected = true;
          }
          //   console.log(context)
          // _.each(this.addresses.models, function (addrModel) {
          //   addrModel.set('showCustomized', true);
          //   addrModel.set('showAllAddress', false);
          //   return true;
          // });
          return context;
        }
      );
      AddressDetailsView.prototype.getContext = _.wrap(
        AddressDetailsView.prototype.getContext,
        function (fn) {
          var context = fn.apply(this, _.toArray(arguments).slice(1));
          if (selectedId && context.internalid === selectedId) {
            context.isSelected = true;
          }
          return context;
        }
      );
      _.extend(OrderWizardModuleAddress.prototype, {
        template: address_module_tpl,
        events: {
          'click [data-action="select"]': "selectAddress",
          'click [data-action="selected"]': "selectedAddress",
          'click [data-action="change-selected-address"]':
            "changeSelectedAddress",
          'click [data-action="change-selected-address"]':
            "changeSelectedAddress",
          'click [data-action="edit-address"]': "editAddress",
          'click [data-action="submit"]': "submit",
          'click [data-action="change-address"]': "changeAddressHandler",
          'click [data-action="remove"]': "validateAddressRemovalHandler",
          'change [data-action="same-as"]': "markSameAsHandler",
          "change form": "changeForm",
        },
        markSameAsHandler: function (e) {
          const is_checked = jQuery(e.target).prop("checked");

          this.sameAs = is_checked;

          this.model.set("sameAs", is_checked);

          this.setAddress(
            is_checked ? this.model.get(this.sameAsManage) : null
          );

          this.tempAddress = is_checked
            ? this.model.get("temp" + this.sameAsManage)
            : null;

          this.isSameAsSelected = is_checked;

          this.render();
        },
        editAddress: function (e) {
          var address_id_str = this.$(e.target).data("id");
          console.log("address id " + address_id_str);
          var address_id = parseInt(address_id_str, 10);
          _.each(this.addresses.models, function (addrModel) {
            addrModel.unset("showAllAddress", { silent: true });
            return true;
          });
          if (_.isNaN(address_id) || !_.isNumber(address_id)) {
            e.stopPropagation();
            e.preventDefault();
            var collection = this.getAddressCollection();
            var selected_address = collection.get(address_id_str);
            var view_1;
            selected_address.unset("internalid", { silent: true });
            view_1 = new AddressEditView({
              application: this.wizard.application,
              collection: collection,
              model: selected_address,
            });
            var add_new_address_on_profile_1 = function (model) {
              // Make sure that the new address now take part of the profile addresses
              // This is important if a temporal address is edited more than once
              this.wizard.options.profile.get("addresses").add(model);
            };
            var reset_current_address_1 = function (model) {
              // After saving the temp address, we set it as the one selected
              this.setAddress(model.id);
            };
            view_1.model.once("change", add_new_address_on_profile_1, this);
            // If the address being edited is the selected one we must re-set once it is created
            if (this.wizard.model.get(this.manage) === address_id_str) {
              view_1.model.once("sync", reset_current_address_1, this);
            }
            view_1.once(
              "modal-close",
              function () {
                view_1.model.off("sync", reset_current_address_1);
                view_1.model.off("change", add_new_address_on_profile_1);
              },
              this
            );
            this.wizard.application.getLayout().showInModal(view_1);
            jQuery("#addrSearchInput").val("");
            jQuery("#addressSearchDropdown .addressItem").each(function (i) {
              jQuery(this).hide();
            });
            jQuery("#addressSearchDropdown").hide();
          }
        },
        changeSelectedAddress: function () {
          //console.log('changeAddress is triggered');
          // console.log(jQuery('#addressSearchDropdown'));
          jQuery("#addressSearchDropdown").css("display", "block");
          this.model.set("showAddress", true);
          _.each(this.addresses.models, function (addrModel) {
            addrModel.set("showAllAddress", true);
            return true;
          });
          this.render();
          this.trigger("ready", true);
        },
        selectAddress: function (e) {
          this.model.set("showAddress", false);
          jQuery(".wizard-content .alert-error").hide();
          // Grabs the address id and sets it to the model
          // on the position in which our sub class is managing (billaddress or shipaddress)

          var clickData = e.currentTarget.attributes["data-id"];

          var clickInternalId = clickData.value;

          var internalid = e.currentTarget.id;

          if (internalid) {
            this.setAddress(internalid.toString());
          } else if (clickInternalId) {
            this.setAddress(clickInternalId.toString());
          } else if (jQuery(e.target).data("id")) {
            this.setAddress(jQuery(e.target).data("id").toString());
          }

          var showAddress = this.model.get("showAddress") ? true : false;
          _.each(this.addresses.models, function (addrModel) {
            addrModel.set("showAllAddress", showAddress);
            // console.log(addrModel);
            return true;
          });
          // re render so if there is changes to be shown they are represented in the view
          this.render();
          // As we already set the address, we let the step know that we are ready
          this.trigger("ready", true);
          var sameAsBilling = $("#sameAsShipping").val();

          //console.log(this.model)
          if (sameAsBilling === 1) {
            $("#sameAsShipping").val("0");
            $("#sameAsShipping").prop("checked", false);
          }
          jQuery("#addrSearchInput").val("");
          jQuery("#addressSearchDropdown .addressItem").each(function (i) {
            jQuery(this).hide();
          });
          jQuery("#addressSearchDropdown").hide();
        },
        selectedAddress: function (e) {
          this.model.set("showAddress", false);
          jQuery(".wizard-content .alert-error").hide();
          // Grabs the address id and sets it to the model
          // on the position in which our sub class is managing (billaddress or shipaddress)

          var clickData = e.currentTarget.attributes["data-id"];

          var clickInternalId = clickData.value;

          var internalid = e.currentTarget.id;

          if (internalid) {
            this.setAddress(internalid.toString());
          } else if (clickInternalId) {
            this.setAddress(clickInternalId.toString());
          } else if (jQuery(e.target).data("id")) {
            this.setAddress(jQuery(e.target).data("id").toString());
          }
          var showAddress = !!this.model.get("showAddress");
          _.each(this.addresses.models, function (addrModel) {
            addrModel.set("showAllAddress", showAddress);
            //   console.log(addrModel);
            return true;
          });
          // re render so if there is changes to be shown they are represented in the view
          this.render();
          // As we already set the address, we let the step know that we are ready
          this.trigger("ready", true);
          var sameAsBilling = $("#sameAsShipping").val();

          //console.log(this.model)
          if (sameAsBilling === 1) {
            $("#sameAsShipping").val("0");
            $("#sameAsShipping").prop("checked", false);
          }
          jQuery("#addrSearchInput").val("");
          jQuery("#addressSearchDropdown .addressItem").each(function (i) {
            jQuery(this).hide();
          });
          jQuery("#addressSearchDropdown").hide();
        },
      });

      OrderWizardModuleAddress.prototype.render = function (not_trigger_ready) {
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
        if (this.addressId && ~this.addressId.indexOf("null")) {
          // we silently remove it
          this.setAddress(null, {
            silent: true,
          });
        }
        this.sameAs = false;
        this.address = this.getSelectedAddress();
        // Add event listeners to allow special flows
        this.eventHandlersOn();
        this.addressView = null;
        // Calls the render function
        this._render();
        const is_address_new = this.address.isNew();
        if (
          !(
            (this.isSameAsEnabled && this.sameAs) ||
            (this.addressId && !is_address_new)
          ) &&
          this.isGuest &&
          !is_address_new
        ) {
          this.setAddress(this.address.id, {
            silent: true,
          });
        }
        // the module is ready when a valid address is selected.
        if (
          !not_trigger_ready &&
          this.address &&
          this.addressId &&
          this.address.get("isvalid") === "T"
        ) {
          this.trigger("ready", true);
        }
      };

      _.extend(AddressDetailsView.prototype, {
        template: address_details_custom_tpl,
      });

      _.extend(AddressEditView.prototype, {
        events: {
          "submit form": "saveForm",
          'click [data-action="update_select"]': "updateSelect",
          'click [data-action="change-selected-address"]':
            "changeSelectedAddress",
        },
        initialize: function (options) {
          this.profileModel = ProfileModel.getInstance();
          this.collection =
            options.collection || this.profileModel.get("addresses");
          this.manage = options.manage;
          this.application = options.application;

          const id =
            (options.routerArguments &&
              options.routerArguments.length &&
              options.routerArguments[0]) ||
            "";

          if (id && id !== "new") {
            this.model = this.collection.get(id);

            this.model.on(
              "reset destroy change add",
              function () {
                if (this.inModal && this.$containerModal) {
                  this.$containerModal
                    .removeClass("fade")
                    .modal("hide")
                    .data("bs.modal", null);
                  this.destroy();
                } else {
                  Backbone.history.navigate("#addressbook", { trigger: true });
                }
              },
              this
            );
          } else if (options.model) {
            this.model = options.model;
          } else {
            this.model = new AddressModel();

            this.model.on(
              "change",
              function (model) {
                this.collection.add(model);

                if (this.inModal && this.$containerModal) {
                  this.$containerModal
                    .removeClass("fade")
                    .modal("hide")
                    .data("bs.modal", null);
                  this.destroy();
                } else {
                  Backbone.history.navigate("#addressbook", { trigger: true });
                }

                var addressId = this.model.id;
                // console.log('address', addressId);

                jQuery(
                  '.address-details-action-custom[data-action="change-selected-address"]'
                ).trigger("click");
                jQuery(
                  '.address-details-action[data-id="' +
                    addressId +
                    '"][data-action="select"]'
                ).trigger("click");
                //this.render();
                jQuery(
                  '.address-details-selected-label[data-id="' +
                    addressId +
                    '"][data-action="selected"]'
                ).trigger("click");
              },

              this
            );
          }

          const addNewAddresLabel = Utils.translate("Add New Address");
          const editAddressLabel = Utils.translate("Edit Address");
          this.countries = Configuration.get("siteSettings.countries");

          this.title = this.model.isNew()
            ? addNewAddresLabel
            : editAddressLabel;
          this.page_header = this.title;
          this.countries = Configuration.get("siteSettings.countries");
          this.selectedCountry =
            this.model.get("country") ||
            Configuration.get("siteSettings.defaultshipcountry");

          if (!this.selectedCountry && _.size(this.countries) === 1) {
            this.selectedCountry = _.first(_.keys(this.countries));
          }

          if (this.selectedCountry) {
            this.model.set({ country: this.selectedCountry }, { silent: true });
            if (this.title === addNewAddresLabel)
              this.model.set({ phone: "999-999-9999" }, { silent: true });
          }

          BackboneFormView.add(this);

          this.saveForm = function saveForm() {
            //added to fix phone bug
            var phone = $("#in-modal-phone").val();

            if (!phone) {
              $("#in-modal-phone").val("999-999-9999");
            }
            const promise = BackboneFormView.saveForm.apply(this, arguments);

            return promise;
          };

          this.changeSelectedAddress = function () {
            //console.log('changeAddress is triggered');
            // console.log(jQuery('#addressSearchDropdown'));
            jQuery("#addressSearchDropdown").css("display", "block");
            this.model.set("showAddress", true);
            _.each(this.addresses.models, function (addrModel) {
              addrModel.set("showAllAddress", true);
              return true;
            });
            this.render();
            this.trigger("ready", true);
          };

          this.updateSelect = function () {
            console.log("update select");
            const promise = BackboneFormView.saveForm.apply(this, arguments);

            if (promise) {
              promise.done(() => {
                var addressId = this.model.id;
                // console.log('address', addressId);

                jQuery(
                  '.address-details-action-custom[data-action="change-selected-address"]'
                ).trigger("click");
                jQuery(
                  '.address-details-action[data-id="' +
                    addressId +
                    '"][data-action="select"]'
                ).trigger("click");
                //this.render();
                jQuery(
                  '.address-details-selected-label[data-id="' +
                    addressId +
                    '"][data-action="selected"]'
                ).trigger("click");
              });
            }
            return promise;
          };
        },
      });

      _.extend(RequestQuoteWizardStep.prototype, {
        template: request_order_wizard_step_tpl,
        events: {
          "keyup #addrSearchInput": "filterAddress",
          "click .selectAddress": "selectAddress",
          "click .updateAddress": "updateAddress",
        },
        filterAddress: function (e) {
          var filter = jQuery("#addrSearchInput").val().toUpperCase();
          if (filter.length < 3) {
            jQuery("#addressSearchDropdown .addressItem").each(function (i) {
              jQuery(this).hide();
            });
          } else {
            jQuery("#addressSearchDropdown .addressItem").each(function (i) {
              if (
                jQuery(this).find("span").text().toUpperCase().indexOf(filter) >
                -1
              ) {
                jQuery(this).show();
              } else {
                jQuery(this).hide();
              }
            });
          }
        },
        selectAddress: function (e) {
          var id = jQuery(e.target).attr("addrid");
          jQuery(
            '.address-details-action-custom[data-action="change-selected-address"]'
          ).trigger("click");
          jQuery(
            '.address-details-action[data-id="' +
              id +
              '"][data-action="select"]'
          ).trigger("click");
        },
        updateAddress: function (e) {
          var id = jQuery(e.target).attr("addrid");
          jQuery(
            '.address-details-action-custom[data-action="change-selected-address"]'
          ).trigger("click");
          // console.log(id, jQuery('.address-details-action-custom[data-id="'+id+'"][data-action="edit-address"]').length );
          jQuery(
            '.address-details-action-custom[data-id="' +
              id +
              '"][data-action="edit-address"]'
          ).trigger("click");
        },
      });

      if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, "findIndex", {
          value: function (predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
              throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== "function") {
              throw new TypeError("predicate must be a function");
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
          writable: true,
        });
      }
    },
  };
});
