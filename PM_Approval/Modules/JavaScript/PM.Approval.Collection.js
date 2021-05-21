// @module PM.Approval.Collection
define('PM.Approval.Collection', [
  'PM.Approval.Model',
  'Backbone',
  'underscore'
], function(
  Model,
  Backbone,
  _
) {
  'use strict';

  // @class PM.Approval.Collection @extend Backbone.Collection
  return Backbone.Collection.extend({
    // @property {PM.Approval.Model}
    model: Model,

    // @property {string} url
    url: _.getAbsoluteUrl(
      getExtensionAssetsPath('services/PM.Approval.Service.ss'))
  });
});
