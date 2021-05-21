define('PM.Renewal.Model', [
  'Backbone',
  'underscore'
], function(
  Backbone,
  _
) {
  'use strict';

  return Backbone.Model.extend({
    urlRoot: _.getAbsoluteUrl(
      getExtensionAssetsPath('services/PM.Renewal.Service.ss')),
    checked: function checked() {
    }
  });
});
