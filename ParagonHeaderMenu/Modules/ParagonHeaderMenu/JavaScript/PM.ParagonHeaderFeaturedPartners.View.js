define('PM.ParagonHeaderFeaturedPartners.View', [
  'paragon_header_menu_featured_partners.tpl',
  'Backbone',
  'jQuery',
  'HeaderMenu.Model'
], function (paragon_header_menu_featured_partners_tpl, Backbone, jQuery, HeaderMenuModel) {
  'use strict';

  return Backbone.View.extend({
    template: paragon_header_menu_featured_partners_tpl,

    initialize: function (options) {

      var configuration = options.Configuration; 
      var url = configuration.siteSettings.touchpoints.home;
      this.model = new HeaderMenuModel({
        url: url
      });

    },

    events: {},

    bindings: {},

    childViews: {},

    getContext: function getContext() {

      var url = this.model.get('url');
      return {
        url: url
      };
    },
  });
});
