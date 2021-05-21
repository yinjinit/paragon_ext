// @module PM.ShipCarrier.Model
define('PM.ShipCarrier.Model', [
  'Backbone',
  'Utils',
  'underscore'
], function(
  Backbone,
  Utils,
  _
) {
  'use strict';

  // @class PM.ShipCarrier.Model @extend Backbone.Model
  return Backbone.Model.extend({
    urlRoot: _.getAbsoluteUrl(
      getExtensionAssetsPath('services/PM.ShipCarrier.Service.ss'))
  });
});
