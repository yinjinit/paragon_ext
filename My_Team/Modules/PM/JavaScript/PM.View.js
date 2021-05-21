// @module PM.My_Team.PM
define('PM.My_Team.PM.View', [
  'pm_my_team_pm.tpl',
  'Utils',
  'Backbone',
  'jQuery',
  'underscore',
  'Profile.Model',
  'PM.MyTeam.Collection'
], function(
  pm_my_team_pm_tpl,
  Utils,
  Backbone,
  jQuery,
  _,
  ProfileModel,
  PMMyTeamCollection
) {
  'use strict';

  return Backbone.View.extend({
    template: pm_my_team_pm_tpl,

    initialize: function(options) {
      this.message = '';
      var profile_model = ProfileModel.getInstance();
      this.user = profile_model.get('internalid');
      this.userName = profile_model.get('name');
      var userId = this.user;
      this.collection = new PMMyTeamCollection();

      var self = this;

      this.collection.fetch({data: {internalid: userId}}).done(function() {
        self.render();
      });
      this.collection.on('reset', this.showContent, this);
    },

    events: {},

    bindings: {},

    childViews: {},

    getContext: function getContext() {
      var salesRep = this.collection.models[0] ?
        this.collection.models[0].get('salesRep') : '[]';

      return {
        customerName: this.userName,
        salesRep: JSON.parse(salesRep)
      };
    }
  });
});
