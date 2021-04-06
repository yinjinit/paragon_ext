// Employee.Model.js
// ----------------
// Handles creating, fetching, removing and updating Employees
define('Employee.Model', [
  'SC.Model',
  'Application',
  'SC.Models.Init',
  'Configuration',
  'underscore'
], function(SCModel, Application, ModelsInit, Configuration, _) {
  return SCModel.extend({
    name: 'Employee',
    // ## General settings

    // Returns a employee list based on a given userId
    list: function() {

      try {

        var filters = [
          ['company', 'anyof', nlapiGetUser()],
          'AND',
          ['isinactive', 'is', 'F']
        ];

        var columns = [
          new nlobjSearchColumn('entityid').setSort(false),
          new nlobjSearchColumn('firstname'),
          new nlobjSearchColumn('lastname'),
          new nlobjSearchColumn('email'),
          new nlobjSearchColumn('custentity_cpas_account_type')
        ];

        var search_results = Application.getAllSearchResults(
          'contact',
          _.values(filters),
          _.values(columns)
        );

        return _.map(search_results, function(contact_record) {
          // @class Case.Model.Attributes
          const current_record_id = contact_record.getId();

          return {
            // @property {String} internalid
            internalid: current_record_id,

            // @property {String} firstname
            firstname: contact_record.getValue('firstname'),

            // @property {String} lastname
            lastname: contact_record.getValue('lastname'),

            // @property {String} email
            email: contact_record.getValue('email'),

            // @property {String} confirmemail
            confirmemail: contact_record.getValue('email'),

            // @property {object} accountType
            accountType: {
              code: contact_record.getValue('custentity_cpas_account_type'),
              name: contact_record.getText('custentity_cpas_account_type')
            }
          };
        });

      } catch (e) {
        nlapiLogExecution('ERROR', 'EMPLOYEE_LIST_ERROR', JSON.stringify(e));
      }

    },

    // Returns a employee list based on a given userId
    get: function(id) {

      try {

        var filters = [
          ['company', 'anyof', nlapiGetUser()],
          'AND',
          ['internalid', 'anyof', id],
          'AND',
          ['isinactive', 'is', 'F']
        ];

        var columns = [
          new nlobjSearchColumn('entityid').setSort(false),
          new nlobjSearchColumn('firstname'),
          new nlobjSearchColumn('lastname'),
          new nlobjSearchColumn('email'),
          new nlobjSearchColumn('custentity_cpas_account_type')
        ];

        var search_results = Application.getAllSearchResults(
          'contact',
          _.values(filters),
          _.values(columns)
        );

        search_results = _.map(search_results, function(contact_record) {
          // @class Case.Model.Attributes
          const current_record_id = contact_record.getId();

          return {
            // @property {String} internalid
            internalid: current_record_id,

            // @property {String} firstname
            firstname: contact_record.getValue('firstname'),

            // @property {String} lastname
            lastname: contact_record.getValue('lastname'),

            // @property {String} email
            email: contact_record.getValue('email'),

            // @property {String} confirmemail
            confirmemail: contact_record.getValue('email'),

            // @property {object} accountType
            accountType: {
              code: contact_record.getValue('custentity_cpas_account_type'),
              name: contact_record.getText('custentity_cpas_account_type')
            }
          };
        });

        if (search_results.length >= 1) {
          return search_results[0];
        }

        throw notFoundError;

      } catch (e) {
        nlapiLogExecution('ERROR', 'EMPLOYEE_LIST_ERROR', JSON.stringify(e));
      }

    },

    // Creates a new Contact record
    create: function(data) {

      try {

        const userId = nlapiGetUser();

        //creating contact record
        const contactRec = nlapiCreateRecord('contact',
          {recordmode: 'dynamic'});

        contactRec.setFieldValue('company', userId);
        contactRec.setFieldValue('firstname', data.firstname);
        contactRec.setFieldValue('lastname', data.lastname);
        contactRec.setFieldValue('email', data.email);
        contactRec.setFieldValue('custentity_cpas_account_type',
          data.accounttype); //from the form it is data.accounttype

        var recContactId = nlapiSubmitRecord(contactRec);

        //loading customer record to give access to the contact created above
        var customerRec = nlapiLoadRecord('customer', userId);
        var line = customerRec.findLineItemValue('contactroles', 'contact',
          recContactId);

        customerRec.selectLineItem('contactroles', line);
        customerRec.setCurrentLineItemValue('contactroles', 'giveaccess', 'T');
        customerRec.setCurrentLineItemValue('contactroles', 'role', 1021); // 1021 = web access role
        customerRec.setCurrentLineItemValue('contactroles', 'password',
          data.password);
        customerRec.setCurrentLineItemValue('contactroles', 'passwordconfirm',
          data.password2);
        customerRec.commitLineItem('contactroles');

        nlapiSubmitRecord(customerRec);

        // Returns the current record created.
        return this.get(recContactId);

      } catch (e) {
        nlapiLogExecution('ERROR', 'EMPLOYEE_CREATION_ERROR',
          JSON.stringify(e));
      }
    },

    // Updates a given Employee given its id
    update: function(id, data) {
      //this.verifySession();

      const userId = nlapiGetUser();

      const contactRec = nlapiLoadRecord('contact', id);

      contactRec.setFieldValue('firstname', data.firstname);
      contactRec.setFieldValue('lastname', data.lastname);
      contactRec.setFieldValue('email', data.email);
      contactRec.setFieldValue('custentity_cpas_account_type',
        data.accounttype);//from the form it is data.accounttype

      nlapiSubmitRecord(contactRec);

      var customerRec = nlapiLoadRecord('customer', userId);
      var line = customerRec.findLineItemValue('contactroles', 'contact', id);

      customerRec.selectLineItem('contactroles', line);
      customerRec.setCurrentLineItemValue('contactroles', 'password',
        data.password);
      customerRec.setCurrentLineItemValue('contactroles', 'passwordconfirm',
        data.password2);
      customerRec.commitLineItem('contactroles');

      nlapiSubmitRecord(customerRec);

      // Returns the id fo the contact updated.
      return id;

    },

    // Deletes a Emloyee given its id
    delete: function(id) {
      //this.verifySession();

      try {
        const employee = nlapiLoadRecord('contact', id);

        employee.setFieldValue('isinactive', 'T');

        return nlapiSubmitRecord(employee);

      } catch (e) {
        nlapiLogExecution('ERROR', 'EMPLOYEE_DELETE_ERROR', JSON.stringify(e));
      }

    }

  });
});
