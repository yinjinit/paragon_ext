// @module PM.Employee.List.View
define('PM.Employee.List.View', [
  'PM.Employee.Model',
  'PM.Employee.Details.View',
  'PM.Employee.Edit.View',
  'PM.Employee.Collection',
  'Backbone',
  'Backbone.CompositeView',
  'Backbone.CollectionView',
  'GlobalViews.Confirmation.View',
  'AjaxRequestsKiller',
  'jQuery',
  'Utils',
  'pm_employee_list.tpl'
], function(
  EmployeeModel,
  EmployeeDetailsView,
  EmployeeEditView,
  EmployeeCollection,
  Backbone,
  BackboneCompositeView,
  BackboneCollectionView,
  GlobalViewsConfirmationView,
  AjaxRequestsKiller,
  $,
  Utils,
  employee_list_tpl
) {
  'use strict';

  // @class PM.Employee.List.View @extend BackboneView
  return Backbone.View.extend({
    template: employee_list_tpl,

    title: Utils.translate('Purchase Authorization: Employees'),

    events: {
      'click [data-action="add-new-employee"]': 'addNewEmployee',
      'click [data-action="edit-employee"]': 'editEmployeeHandler',
      'click [data-action="remove-employee"]': 'askDeleteEmployee'
    },

    initialize: function(options) {
      this.options = options;
      this.application = options.application;

      this.collection = new EmployeeCollection();

      BackboneCompositeView.add(this);
    },

    // @method getSelectedMenu
    getSelectedMenu: function() {
      return 'employees';
    },

    // @method getBreadcrumbPages
    getBreadcrumbPages: function() {
      return {
        text: Utils.translate('Employees'),
        href: '/employees'
      };
    },

    beforeShowContent: function beforeShowContent() {
      return this.collection.fetch({
        killerId: AjaxRequestsKiller.getKillerId()
      });
    },

    // @method addNewEmployee  create new employee modal form
    addNewEmployee: function() {
      this.newEmployeeView = new EmployeeEditView({
        application: this.application,
        parentView: this,
        model: new EmployeeModel() // create!
      });

      this.application.getLayout().showInModal(this.newEmployeeView);
    },

    // @method askDeleteEmployee starts the 'delete a employee' use case
    askDeleteEmployee: function(e) {
      this.deleteConfirmationView = new GlobalViewsConfirmationView({
        callBackParameters: {
          target: e.target,
          context: this
        },
        callBack: this.deleteEmployeeHandler,
        title: Utils.translate('Delete Employee'),
        autohide: true,
        body: Utils.translate('Are you sure you want to delete this employee?')
      });
      this.application.getLayout().showInModal(this.deleteConfirmationView);
    },

    // @method deleteEmployeeHandler called from the sub view when the user confirms he
    // wants to delete the product list.
    deleteEmployeeHandler: function(options) {
      const self = options.context;
      const {target} = options;
      const employee = self.getListFromDom($(target));
      self.collection.remove(employee);

      employee.destroy().done(function() {
        self.render();
      });

    },

    // @method editEmployeeHandler Edit Employee click handler
    editEmployeeHandler: function(e) {
      const employee = this.getListFromDom($(e.target));
      this.editEmployee(employee);
    },

    // @method getListFromDom Get the list (collection) from DOM @return {Employee.Model}
    getListFromDom: function($target) {
      const employee_id = $target.closest('[data-employee-id]')
        .data('employee-id') + '';
      return this.collection.where({internalid: employee_id})[0];
    },

    // @method editEmployee Edit list click handler (displays edit employee modal view)
    // @param {Employee.Model} list
    editEmployee: function(employee) {
      this.newEmployeeView = new EmployeeEditView({
        application: this.application,
        parentView: this,
        model: employee,
        inModal: true
      });

      this.application.getLayout().showInModal(this.newEmployeeView);
    },

    childViews: {
      'Employee.List.Details': function() {
        return new BackboneCollectionView({
          childView: EmployeeDetailsView,
          viewsPerRow: 1,
          collection: this.collection
        });
      }
    },

    // @method getContext @return {Employee.List.View.Context}
    getContext: function() {

      var role;

      if (SC.published && SC.published.cpas_role) {
        role = SC.published.cpas_role;
      } else {
        role = SC.getPublishedObject('cpas_role');
      }

      // @class Employee.List.View.Context
      return {
        // @property {Boolean} hasEmployees
        hasEmployees: this.collection.length,
        // @property {Boolean} showCreateButton
        showCreateButton: role[0] === '1' //if admin
      };
    }
  });
});
