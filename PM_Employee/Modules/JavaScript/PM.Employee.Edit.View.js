// @module PM.Employee.Edit.View
define('PM.Employee.Edit.View', [
  'Backbone.View',
  'Backbone.FormView',
  'pm_employee_new.tpl',
  'Utils',
  'underscore'
], function(
  BackboneView,
  BackboneFormView,
  employee_new_tpl,
  Utils,
  _
) {
  'use strict';

  // @class PM.Employee.Edit.View @extends Backbone.View
  return BackboneView.extend({
    template: employee_new_tpl,

    events: {
      'submit form': 'saveForm',
      '[data-action="prevent-enter"]': 'preventEnter'
    },

    bindings: {
      '[name="firstname"]': 'firstname',
      '[name="lastname"]': 'lastname',
      '[name="email"]': 'email',
      '[name="confirmemail"]': 'confirmemail',
      '[name="accountType"]': 'accountType',
      '[name="password"]': 'password',
      '[name="password2"]': 'password2'
    },

    initialize: function(options) {
      this.application = options.application;
      this.parentView = options.parentView;
      this.model = options.model;
      this.isEdit = this.model.get('internalid');
      this.page_header = this.getTitle();
      this.inModal = options.inModal;

      BackboneFormView.add(this);

      this.model.once('saveCompleted', _.bind(this.onSaveComplete, this));
    },

    // @method preventEnter Prevents not desired behavior when hitting enter
    preventEnter: function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
    },

    // Sets focus on the name field and returns the correct title text
    getTitle: function() {
      //this.$('[name="name"]').focus();

      const editLabel = Utils.translate('Edit Employee');
      const newLabel = Utils.translate('New Employee');

      return this.isEdit ? editLabel : newLabel;
    },

    // Handles the form submit on save
    onSaveComplete: function() {

      const self = this;

      if (self.isEdit) {
        self.parentView.collection.add(self.model, {merge: true});
      } else {
        self.parentView.collection.add(self.model);
      }

      self.parentView.render();
    },

    // @method getContext @return {Employee.Edit.View.Context}
    getContext: function() {
      const {model} = this;

      var accountType;

      if (SC.published && SC.published.account_type) {
        accountType = SC.published.account_type;
      } else {
        accountType = SC.getPublishedObject('account_type');
      }

      if (!!this.isEdit) {

        //logic to identify which option is selected on edit mode
        accountType = accountType.map(function(option) {
          return {
            code: option.code,
            name: option.name,
            isActive: String(option.code) === model.get('accountType').code
          };
        });
      }

      // @class Employee.Edit.View.Context
      return {
        // @property {Boolean} inModal
        inModal: !!this.inModal,
        // @property {Boolean} isEdit
        isEdit: !!this.isEdit,
        // @property {String} name
        name: model.get('name'),
        // @property {String} firstname
        firstname: model.get('firstname'),
        // @property {String} lastname
        lastname: model.get('lastname'),
        // @property {String} name
        confirmemail: model.get('confirmemail'),
        // @property {String} email
        email: model.get('email'),
        // @property {Array} accountType
        accountType: accountType
      };
    }
  });
});
