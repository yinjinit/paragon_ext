define('PM.ParagonIndustriesWebServeMenu.View', [
  'paragon_industries_web_serve_menu.tpl',
  'Backbone',
  'jQuery',
], function (paragon_industries_web_serve_menu_tpl, Backbone, jQuery) {
  'use strict';

  return Backbone.View.extend({
    template: paragon_industries_web_serve_menu_tpl,

    initialize: function (options) {},

    events: {
     'click .paragon-header-menu-level2-li': 'showLevel3Menu',
    },

    bindings: {},

    childViews: {},

    showLevel3Menu: function (e) {
      $(e.currentTarget).parent().find('li').removeClass('active');
      $(e.currentTarget).addClass('active');

      var target = $(e.currentTarget).data('target');

      $('.paragon-header-menu-education-details').removeClass('active');
      $(target).addClass('active');
    },

    getContext: function getContext() {
      var categories = [
        {
          active: true,
          title: 'Education',
          dataTarget: '#paragon-header-menu-industries-web-serve-education',
        },
        {
          title: 'Business',
          dataTarget: '#paragon-header-menu-industries-web-serve-business',
        },
        {
          title: 'Federal Government',
          dataTarget: '#paragon-header-menu-industries-web-serve-federal-government',
        },
        {
          title: 'Healthcare',
          dataTarget: '#paragon-header-menu-industries-web-serve-healthcare',
        },
        {
          title: 'State & Local Government',
          dataTarget: '#paragon-header-menu-industries-web-serve-government',
        },
      ];
      return {
        categories: categories,
      };
    },
  });
});
