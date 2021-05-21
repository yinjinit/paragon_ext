// @module PM.Employee.Model
define('PM.Employee.Model', [
  'Backbone',
  'Utils',
  'underscore'
], function(
  Backbone,
  Utils,
  _
) {
  'use strict';

  // @class PM.Employee.Model @extend Backbone.Model
  return Backbone.Model.extend({
    validation: {
      firstname: {
        required: true,
        msg: Utils.translate('First Name is required')
      },
      lastname: {
        required: true,
        msg: Utils.translate('Last Name is required')
      },
      email: [
        {
          required: true,
          msg: Utils.translate('Email is required')
        }, {
          pattern: 'email',
          msg: Utils.translate('Please enter a valid email')
        }
      ],
      confirmemail: function(confirmemail, attr, form) {
        if (
          Utils.trim(form.email) !== this.attributes.email &&
          Utils.trim(confirmemail) !== Utils.trim(form.email)
        ) {
          return Utils.translate('Emails must match');
        }
      },
      accounttype: {
        required: true,
        msg: Utils.translate('Please select the account type')
      },
      password: function(password) {
        //if create
        if (_.isNull(this.attributes.internalid) ||
          _.isUndefined(this.attributes.internalid) ||
          this.attributes.internalid === '') {
          if (_.isNull(password) || _.isUndefined(password) || password ===
            '') {
            return Utils.translate('Password is required');
          }
        }
      },
      password2: function(password2, attr, form) {
        //if create
        if (_.isNull(this.attributes.internalid) ||
          _.isUndefined(this.attributes.internalid) ||
          this.attributes.internalid === '') {
          if (_.isNull(password2) || _.isUndefined(password2) || password2 ===
            '') {
            return Utils.translate('Confirm Password is required');
          }
        }
        if (password2 !== form.password) {
          return Utils.translate('Password does not match');
        }
      }
    },
    urlRoot: _.getAbsoluteUrl(
      getExtensionAssetsPath('services/PM.Employee.Service.ss'))
  });
});
