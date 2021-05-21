define('PM.AdvancedReports.Collection', [
  'PM.AdvancedReports.Model',
  'underscore',
  'Backbone',
  'Utils'
], function(
  AdvancedReportsModule,
  _,
  Backbone
) {
  'use strict';

  return Backbone.Collection.extend({

    model: AdvancedReportsModule,
    url: _.getAbsoluteUrl(
      getExtensionAssetsPath('services/PM.AdvancedReports.Service.ss'))
  });
});
