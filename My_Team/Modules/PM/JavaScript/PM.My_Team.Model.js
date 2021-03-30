define('PM.My_Team.Model', ['Backbone', 'underscore'], function PMMyTeamModel(Backbone, _) {
  'use strict';

  return Backbone.Model.extend({
    urlRoot: _.getAbsoluteUrl(getExtensionAssetsPath('services/PM.Service.ss')),
  });
});
