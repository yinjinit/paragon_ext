// @module PM.Employee
define('PM.Employee', [
  'PM.Employee.List.View'
], function(
  EmployeeListView
) {
  'use strict';

  return {
    loadModule: function loadModule(container) {
      const pageType = container.getComponent('PageType');

      pageType.registerPageType({
        name: 'employees',
        routes: ['employees'],
        view: EmployeeListView,
        defaultTemplate: {
          name: 'pm_employee_list.tpl',
          displayName: 'Employee List',
          thumbnail: null
        }
      });
    }
  };
});

