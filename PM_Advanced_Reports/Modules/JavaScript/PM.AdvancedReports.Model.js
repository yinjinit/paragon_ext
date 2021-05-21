define('PM.AdvancedReports.Model', [
  'Backbone',
  'underscore'
], function AdvancedReportsModel(
  Backbone,
  _
) {
  'use strict';

  return Backbone.Model.extend({
    urlRoot: _.getAbsoluteUrl(
      getExtensionAssetsPath('services/PM.AdvancedReports.Service.ss')),
    checked: function checked() {
    }
  });
});
