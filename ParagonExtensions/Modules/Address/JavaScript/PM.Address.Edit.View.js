// @module PM.Address.Edit.View
define('PM.Address.Edit.View', [
  'Address.Edit.View',
  'pm_address_edit.tpl',
  'underscore',
  'Profile.Model',
  'Address.Model',
  'Backbone.FormView',
  'Utils',
  'SC.Configuration'
], function(
  AddressEditView,
  pm_address_edit_tpl,
  _,
  ProfileModel,
  AddressModel,
  BackboneFormView,
  Utils,
  Configuration
) {
  'use strict';

  return {
    loadModule: function loadModule() {
      _.extend(AddressEditView.prototype, {
        //@property {Function} template
        template: pm_address_edit_tpl,
        events: {
          'submit form': 'saveForm',
          'click [data-action="update_select"]': 'updateSelect'
        },
        initialize: function(options) {
          this.profileModel = ProfileModel.getInstance();
          this.collection =
            options.collection || this.profileModel.get('addresses');
          this.manage = options.manage;
          this.application = options.application;

          const id =
            (
              options.routerArguments &&
              options.routerArguments.length &&
              options.routerArguments[0]
            ) ||
            '';

          if (id && id !== 'new') {
            this.model = this.collection.get(id);

            this.model.on(
              'reset destroy change add',
              function() {
                if (this.inModal && this.$containerModal) {
                  this.$containerModal
                    .removeClass('fade')
                    .modal('hide')
                    .data('bs.modal', null);
                  this.destroy();
                } else {
                  Backbone.history.navigate('#addressbook', {trigger: true});
                }
              },
              this
            );
          } else if (options.model) {
            this.model = options.model;
          } else {
            this.model = new AddressModel();

            this.model.on(
              'change',
              function(model) {
                this.collection.add(model);

                if (this.inModal && this.$containerModal) {
                  this.$containerModal
                    .removeClass('fade')
                    .modal('hide')
                    .data('bs.modal', null);
                  this.destroy();
                } else {
                  Backbone.history.navigate('#addressbook', {trigger: true});
                }
              },
              this
            );
          }

          const addNewAddressLabel = Utils.translate('Add New Address');
          const editAddressLabel = Utils.translate('Edit Address');
          this.title = this.model.isNew()
            ? addNewAddressLabel
            : editAddressLabel;
          this.page_header = this.title;
          this.countries = Configuration.get('siteSettings.countries');
          this.phone = this.model.get('phone') || '999-999-9999';
          this.selectedCountry =
            this.model.get('country') ||
            Configuration.get('siteSettings.defaultshipcountry');

          if (!this.selectedCountry && _.size(this.countries) === 1) {
            this.selectedCountry = _.first(_.keys(this.countries));
          }

          if (this.selectedCountry) {
            this.model.set({country: this.selectedCountry}, {silent: true});
          }

          this.model.unset('showAddress');
          BackboneFormView.add(this);

          this.saveForm = function saveForm() {
            // const loggers = Loggers.getLogger();
            // const actionId = loggers.start('Save Address');

            const promise = BackboneFormView.saveForm.apply(this, arguments);

            if (promise) {
              promise.done(() => {
                /*  loggers.end(actionId, {
                            operationIds: this.model.getOperationIds(),
                            status: 'success'
                        }); */
              });
            }

            return promise;
          };

          this.updateSelect = function() {
            // const loggers = Loggers.getLogger();
            //  const actionId = loggers.start('Save Address');
            //.log("update select");
            const promise = BackboneFormView.saveForm.apply(this, arguments);

            if (promise) {
              promise.done(() => {
                /* loggers.end(actionId, {
                          operationIds: this.model.getOperationIds(),
                          status: 'success'
                      });*/
                var addressId = this.model.id;
                // console.log('address', addressId);

                jQuery(
                  '.address-details-action-custom[data-action="change-selected-address"]'
                ).trigger('click');
                jQuery(
                  '.address-details-action[data-id="' +
                  addressId +
                  '"][data-action="select"]'
                ).trigger('click');
                //this.render();
                jQuery(
                  '.address-details-selected-label[data-id="' +
                  addressId +
                  '"][data-action="selected"]'
                ).trigger('click');
              });
            }
            return promise;
          };
        },
        //@method getContext
        //@returns {PM.Address.Edit.View.Context}
        getContext: _.wrap(AddressEditView.prototype.getContext,
          function(fn) {
            var context = fn.apply(this, _.toArray(arguments).slice(1));

            if (Backbone.history.getFragment() === 'addressbook') {
              context.hideSelectButton = true;
            }

            return context;
          })
      });
    }
  };
});
