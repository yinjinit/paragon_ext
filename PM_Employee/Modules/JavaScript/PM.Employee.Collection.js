// @module PM.Employee.Collection
define('PM.Employee.Collection', [
  'PM.Employee.Model',
  'Backbone',
  'underscore'
], function(
  PMEmployeeModel,
  Backbone,
  _
) {
  'use strict';

  // @class PM.Employee.Collection @extend Backbone.Collection
  return Backbone.Collection.extend({
    // @property {PM.Employee.Model}
    model: PMEmployeeModel,

    // @property {string} url
    url: _.getAbsoluteUrl(
      getExtensionAssetsPath('services/PM.Employee.Service.ss'))
  });
});
