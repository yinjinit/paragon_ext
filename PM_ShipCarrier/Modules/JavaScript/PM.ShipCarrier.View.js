// @module PM.ShipCarrier.View
define('PM.ShipCarrier.View', [
  'PM.ShipCarrier.Model',
  'pm_shipcarrier.tpl',
  'GlobalViews.Message.View',
  'Backbone.View',
  'Backbone.FormView',
  'Utils',
  'underscore'
], function(
  ShipCarrierModel,
  shipcarrierTemplate,
  GlobalViewsMessageView,
  BackboneView,
  BackboneFormView,
  Utils,
  _
) {
  // @class PM.ShipCarrier View
  return BackboneView.extend({
    template: shipcarrierTemplate,

    attributes: {class: 'product-list-new-wrapper'},

    events: {
      'submit form': 'saveForm',
      '[data-action="prevent-enter"]': 'preventEnter'
    },

    bindings: {
      '[name="carrier"]': 'carrier',
      '[name="accountNumber"]': 'accountNumber'
    },

    initialize: function(options) {
      this.application = options.application;
      this.parentView = options.parentView;
      this.model = new ShipCarrierModel();
      var self = this;

      this.model.fetch().done(function() {
        var accountNumber = self.model.get('customfields') &&
          _.find(self.model.get('customfields'), function(item) {
            return item['name'] === 'custentity_tpc_account_no';
          });

        var carrier = self.model.get('customfields') &&
          _.find(self.model.get('customfields'), function(item) {
            return item['name'] === 'custentity_3rd_party_carrier';
          });

        self.model.set('carrier', carrier.value);
        self.model.set('accountNumber', accountNumber.value);

        self.render();
      });

      BackboneFormView.add(this);
      this.useLayoutError = true;
      this.model.on('save', this.showSuccess, this);
    },

    // @method getSelectedMenu
    getSelectedMenu: function() {
      return 'shipcarrier';
    },

    // @method getBreadcrumbPages
    getBreadcrumbPages: function() {
      return {
        text: Utils.translate('Shipping Account'),
        href: '/shipcarrier'
      };
    },

    // @method preventEnter Prevents not desired behavior when hitting enter
    preventEnter: function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
    },

    showSuccess: function() {
      if (this.$savingForm) {
        var global_view_message = new GlobalViewsMessageView({
          message: Utils.translate('Profile successfully updated!'),
          type: 'success',
          closable: true
        });
        this.showContent();
        this.$('[data-type="alert-placeholder"]').append(
          global_view_message.render().$el.html()
        );
      }
    },

    // @method getContext @return {PM.ShipCarrier.View.Context}
    getContext: function() {
      var model = this.model,
        carriers;

      if (SC.published && SC.published.carriers) {
        carriers = SC.published.carriers;
      } else {
        carriers = SC.getPublishedObject('carriers');
      }

      var accountNumber = model.get('customfields') &&
        _.find(model.get('customfields'), function(item) {
          return item['name'] === 'custentity_tpc_account_no';
        });

      // @class PM.ShipCarrier.View.Context
      return {
        // @property {Boolean} isEdit
        isEdit: !!this.isEdit,
        // @property {String} email
        accountNumber: accountNumber && accountNumber.value,
        // @property {Array} accountType
        carriers: carriers,
        pageHeader: 'Shipping Account Information'
      };
    }
  });
});
