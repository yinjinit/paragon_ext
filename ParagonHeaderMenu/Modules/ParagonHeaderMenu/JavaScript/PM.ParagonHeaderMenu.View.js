define('PM.ParagonHeaderMenu.View', ['paragon_header_menu.tpl', 'Backbone', 'jQuery'], function (
  paragon_header_menu_tpl,
  Backbone,
  jQuery
) {
  'use strict';

  return Backbone.View.extend({
    template: paragon_header_menu_tpl,

    initialize: function (options) {
      this.container = options;
    },

    events: {
      'click .paragon-header-second-menu-link': 'hideLevel2Menu',
      'click .paragon-header-menu-level1-anchor': 'showLevel2Menu',
      'click .paragon-header-menu-overlay': 'hideLevel2Menu',
      'click .paragon-header-menu-details-close': 'hideLevel2Menu',
      'click .paragon-header-menu-hardware-details-level3': 'hideLevel2Menu',
      'click .paragon-header-menu-shop-by-brands-btn': 'hideLevel2Menu',
      'click .paragon-header-menu-brand-link': 'hideLevel2Menu',
    },

    bindings: {},

    childViews: {},

    showLevel2Menu: function (e) {
      console.log('show level 2 menu');
      var selector = $(e.currentTarget).data('selector');
      if (selector == 'hardware') {
        $('.paragon-header-menu-level2-container').removeClass('active');
        $('#paragon-header-hardware-menu-view').addClass('active');
      } else if (selector == 'software') {
        $('.paragon-header-menu-level2-container').removeClass('active');
        $('#paragon-header-software-menu-view').addClass('active');
      } else if (selector == 'solutions-services') {
        $('.paragon-header-menu-level2-container').removeClass('active');
        $('#paragon-header-solutions-services-menu-view').addClass('active');
      } else if (selector == 'industries-web-service') {
        $('.paragon-header-menu-level2-container').removeClass('active');
        $('#paragon-header-industries-web-serve-menu-view').addClass('active');
      } else if (selector == 'about-us') {
        $('.paragon-header-menu-level2-container').removeClass('active');
        $('#paragon-header-about-us-menu-view').addClass('active');
      } else if (selector == 'resources') {
        $('.paragon-header-menu-level2-container').removeClass('active');
        $('#paragon-header-resource-menu-view').addClass('active');
      } else {
        $('.paragon-header-menu-level2-container').removeClass('active');
      }
      $('.paragon-header-menu-overlay').addClass('active');
      var levle1Parent = $(e.currentTarget).parent();
      levle1Parent.find('li').removeClass('active');
      jQuery(e.currentTarget).addClass('active');
    },

    hideLevel2Menu: function (e) {
      jQuery('.paragon-header-menu-level2-container').removeClass('active');
      jQuery('.paragon-header-second-menu-item').removeClass('active');
      jQuery('.paragon-header-menu-overlay').removeClass('active');
      jQuery('.paragon-header-menu-level1').find('li').removeClass('active');
    },

    getContext: function getContext() {
      return {};
    },
  });
});
