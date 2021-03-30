define('PM.MyTeam.Collection', ['Backbone', 'PM.My_Team.Model', 'underscore'], function (Backbone, Model, _) {
  return Backbone.Collection.extend({
    model: Model,
    url: _.getAbsoluteUrl('services/PM.Service.ss'),
  });
});
