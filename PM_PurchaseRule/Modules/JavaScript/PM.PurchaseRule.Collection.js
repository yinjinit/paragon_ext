// @module PM.PurchaseRule.Collection
define('PM.PurchaseRule.Collection', [
  'PM.PurchaseRule.Model',
  'Backbone',
  'underscore'
], function(
  Model,
  Backbone,
  _
) {
  'use strict';

  // @class PM.PurchaseRule.Collection @extend Backbone.Collection
  return Backbone.Collection.extend({
    // @property {PM.PurchaseRule.Model}
    Model,

    // @property {string} url
    url: _.getAbsoluteUrl(
      getExtensionAssetsPath('services/PM.PurchaseRule.Service.ss'))
  });
});
