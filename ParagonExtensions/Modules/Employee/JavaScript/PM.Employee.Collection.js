// @module PM.Employee.Collection
define('PM.Employee.Collection', [
  'PM.Employee.Model',
  'Backbone'
], function(
  Model,
  Backbone
) {
  'use strict';

  // @class PM.Employee.Collection @extend Backbone.Collection
  return Backbone.Collection.extend({
    // @property {PM.Employee.Model}
    model: Model,

    // @property {string} url
    url: 'services/Employee.Service.ss'
  });
});
