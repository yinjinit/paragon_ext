// PM.ShipCarrier.Model.js
// ----------------
// Carrier and number account profile settings
define('PM.ShipCarrier.Model', [
  'SC.Model',
  'Application',
  'SC.Models.Init',
  'Profile.Model',
  'Configuration',
  'underscore'
], function(
  SCModel,
  Application,
  ModelsInit,
  ProfileModel,
  Configuration,
  _
) {
  var config = Configuration.get();
  config.publish = config.publish || [];
  config.publish.push({
    key: 'carriers',
    model: 'PM.ShipCarrier.Model',
    call: 'getCarriers'
  });

  return SCModel.extend({
    name: 'PM.ShipCarrier.Model',
    // ## General settings

    getCarriers: function() {

      //getting the account type options
      try {

        var url = nlapiResolveURL('SUITELET',
          'customscript_tt_slet_getaccounttype',
          'customdeploy_tt_slet_getaccounttype', true);
        var request = nlapiRequestURL(url + '&carriers=T');

        var body = request.getBody();
        return JSON.parse(body);

      } catch (e) {
        nlapiLogExecution('ERROR', 'Unable to receive Carries options', e);
      }
    },

    get: function() {
      return ProfileModel.get();
    },

    // Creates a new Contact record
    update: function(data) {

      if (data.carrier && data.accountNumber) {
        const customerUpdate = {
          internalid: parseInt(nlapiGetUser(), 10),
          customfields: {
            'custentity_3rd_party_carrier': data.carrier,
            'custentity_tpc_account_no': data.accountNumber
          }
        };

        ModelsInit.customer.updateProfile(customerUpdate);
      }

      return this.get();
    }

  });
});
