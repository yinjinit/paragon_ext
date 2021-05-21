// @class PM.Address.Search.View
define('PM.Address.Search.View', [
  'SC.Configuration',
  'pm_address_search.tpl',
  'Backbone.View',
  'underscore'
], function(
  Configuration,
  address_search_tpl,
  BackboneView,
  _
) {
  'use strict';

  return BackboneView.extend({
    template: address_search_tpl,

    attributes: {
      id: 'AddressSearch',
      class: 'AddressSearchView'
    },

    events: {
      'change input': 'filterAddress',
      'input input': 'filterAddress',
      'keyup input': 'filterAddress',
      'past input': 'filterAddress',
      'click .address-item .button-select': 'selectAddress',
      'click .address-item .button-edit': 'editAddress',
      'click .address-search-cancel': 'closeDropdown',
      'click .button-address-back': 'returnToAddress'
    },

    initialize: function(options) {
      this.options = options;
    },

    render: function() {
      BackboneView.prototype.render.apply(this, arguments);
      this.$('.address-search-input').focus().val(this.keyword);
    },

    // @method filterAddress Filter addresses on input change.
    // @return void
    filterAddress: function(e) {
      var terms = [
          'fullname',
          'addr1',
          'addr2',
          'addr3',
          'city',
          'state',
          'zip',
          'country'
        ],
        self = this,
        oldKeyword = this.keyword;

      this.keyword = this.$(e.target).val();

      if (oldKeyword === this.keyword) {
        return;
      }

      this.addressesFiltered = [];

      if (this.keyword.length >= 3) {
        this.addressesFiltered =
          _.filter(this.options.addresses.models, function(model) {
            var hasKeyword = false,
              json = model.toJSON();

            if (json.country) {
              var countries = Configuration.get('siteSettings.countries', []),
                countryObj = countries[json.country],
                stateObj = countryObj && countryObj.states ?
                  _.findWhere(countries[json.country].states,
                    {code: json.state}) : null,
                state = stateObj ? stateObj.name : json.state;

              json.country = countryObj ? countryObj.name : json.country;
              json.state = state;
            }

            _.each(terms, function(term) {
              if (!json[term]) {
                return;
              }

              var termVal = json[term];

              if (termVal.toLowerCase().indexOf(self.keyword.toLowerCase()) !==
                -1) {
                hasKeyword = true;
              }
            });

            return hasKeyword;
          });
      }

      this.render();
    },

    // @method selectAddress Select address.
    // @return void
    selectAddress: function(e) {
      var addrId = this.$(e.target).data('id');

      $('.address-details-select-address[data-id="' + addrId + '"]')
        .trigger('click');
    },

    // @method editAddress Edit an address.
    // @return void
    editAddress: function(e) {
      var addrId = this.$(e.target).data('id');

      $('.address-details-edit-address[data-id="' + addrId + '"]')
        .trigger('click');
    },

    // @method closeDropdown Close filtered address list dropdown.
    // @return void
    closeDropdown: function() {
      this.$('.address-search-input').val('').trigger('change');
    },

    // @method returnToAddress Handle to return single address detail page.
    returnToAddress: function() {
      this.parentView.showAddressList = false;
      this.parentView.render()
    },

    // @method getContext @return PM.Address.Search.View.Context
    getContext: function() {
      var addressesFiltered = [];

      _.each(this.addressesFiltered, function(model) {
        var addressLine = model.get('addr1') ? model.get('addr1') + ' ' :
          '' + model.get('addr2') ? model.get('addr2') + ' ' :
            '' + model.get('addr3') ? model.get('addr3') + ' ' : '';

        addressesFiltered.push({
          address:
            model.get('fullname') + ', ' + addressLine + ', ' +
            model.get('city') + ' ' + model.get('state') + ' ' +
            model.get('zip') + ', ' + model.get('country'),
          internalid: model.get('internalid')
        });
      });

      // @class PM.Address.Search.View.Context
      return {
        // @property {Array} addressesFiltered
        addressesFiltered: addressesFiltered,
        // @property {Boolean} showKeywordNotice
        showKeywordNotice: this.keyword && this.keyword.length < 3
      };
    }
  });
});
