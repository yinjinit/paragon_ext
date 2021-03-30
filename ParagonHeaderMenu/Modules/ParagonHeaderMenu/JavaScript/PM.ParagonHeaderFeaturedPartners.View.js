define('PM.ParagonHeaderFeaturedPartners.View', [
  'paragon_header_menu_featured_partners.tpl',
  'Backbone',
  'jQuery',
], function (paragon_header_menu_featured_partners_tpl, Backbone, jQuery) {
  'use strict';

  return Backbone.View.extend({
    template: paragon_header_menu_featured_partners_tpl,

    initialize: function (options) {},

    events: {},

    bindings: {},

    childViews: {},

    getContext: function getContext() {
      return {};
    },
  });
});
