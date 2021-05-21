define('PM.Configuration', [
  'SC.Model',
  'Configuration',
  'Models.Init',
  'Profile.Model'
], function(
  SCModel,
  GlobalConfiguration,
  ModelsInit,
  Profile
) {
  var config = GlobalConfiguration.get();
  var environment = request.getHeader('X-SC-Touchpoint');
  if (environment !== 'shopping') {
    config.publish = config.publish || [];
    config.publish.push({
      key: 'account_type',
      model: 'PM.Configuration',
      call: 'getAccountTypes'
    });
    config.publish.push({
      key: 'list_employees',
      model: 'PM.Configuration',
      call: 'getEmployees'
    });
    config.publish.push({
      key: 'list_approvers',
      model: 'PM.Configuration',
      call: 'getApprovers'
    });
    config.publish.push({
      key: 'rule_type',
      model: 'PM.Configuration',
      call: 'getRuleTypes'
    });
    config.publish.push({
      key: 'cpas_role',
      model: 'PM.Configuration',
      call: 'getRole'
    });
    config.publish.push({
      key: 'contact_id',
      model: 'PM.Configuration',
      call: 'getContactId'
    });
    return SCModel.extend({
      name: 'PM.Configuration',
      getAccountTypes: function() {
        //getting the account type options
        try {
          var url = nlapiResolveURL('SUITELET',
            'customscript_tt_slet_getaccounttype',
            'customdeploy_tt_slet_getaccounttype', true);
          var request = nlapiRequestURL(url + '&accounttype=T');
          var body = request.getBody();
          return JSON.parse(body);
        } catch (e) {
          nlapiLogExecution('ERROR',
            'Unable to receive CPAS account type options', e);
        }
      },
      getEmployees: function() {
        //getting the employee list
        try {
          var url = nlapiResolveURL('SUITELET',
            'customscript_tt_slet_getaccounttype',
            'customdeploy_tt_slet_getaccounttype', true);
          var request = nlapiRequestURL(
            url + '&employeepp=T&customer=' + nlapiGetUser());
          var body = request.getBody();
          return JSON.parse(body);
        } catch (e) {
          nlapiLogExecution('ERROR',
            'Unable to receive CPAS Employee options', e);
        }
      },
      getApprovers: function() {
        //getting the approver list
        try {
          var url = nlapiResolveURL('SUITELET',
            'customscript_tt_slet_getaccounttype',
            'customdeploy_tt_slet_getaccounttype', true);
          var request = nlapiRequestURL(
            url + '&approverpp=T&customer=' + nlapiGetUser());
          var body = request.getBody();
          return JSON.parse(body);
        } catch (e) {
          nlapiLogExecution('ERROR',
            'Unable to receive CPAS Approver options', e);
        }
      },
      getRuleTypes: function() {
        //getting the rule types
        try {
          var url = nlapiResolveURL('SUITELET',
            'customscript_tt_slet_getaccounttype',
            'customdeploy_tt_slet_getaccounttype', true);
          var request = nlapiRequestURL(url + '&ruletypepp=T');
          var body = request.getBody();
          return JSON.parse(body);
        } catch (e) {
          nlapiLogExecution('ERROR',
            'Unable to receive CPAS rule type options', e);
        }
      },
      getRole: function() {
        //getting the role
        try {
          //object to get the email of the current contact loggued
          var user = Profile.get();
          var url = nlapiResolveURL('SUITELET',
            'customscript_tt_slet_getaccounttype',
            'customdeploy_tt_slet_getaccounttype', true);
          var request = nlapiRequestURL(
            url + '&role=T&customer=' + nlapiGetUser() + '&contactemail=' +
            user.email);
          var body = request.getBody();
          var roleObj = JSON.parse(body);
          return roleObj;
        } catch (e) {
          nlapiLogExecution('ERROR', 'Unable to receive CPAS role object', e);
        }
      },
      getContactId: function() {
        //getting the contact id
        try {
          //object to get the email of the current contact loggued
          var user = Profile.get();
          var url = nlapiResolveURL('SUITELET',
            'customscript_tt_slet_getaccounttype',
            'customdeploy_tt_slet_getaccounttype', true);
          var request = nlapiRequestURL(
            url + '&contact=T&customer=' + nlapiGetUser() + '&contactemail=' +
            user.email);
          var body = request.getBody();
          return JSON.parse(body);
        } catch (e) {
          nlapiLogExecution('ERROR', 'Unable to receive contact id object',
            e);
        }
      }
    });
  }

});