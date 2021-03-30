define('PM.ParagonSecondMenu.View', ['paragon_second_menu.tpl', 'Backbone', 'jQuery'], function (
  paragon_second_menu_tpl,
  Backbone,
  jQuery
) {
  'use strict';

  return Backbone.View.extend({
    template: paragon_second_menu_tpl,

    initialize: function (options) {
      this.container = options.container;
      this.menuItems = options.menuItems;
    },

    events: {},

    bindings: {},

    childViews: {},

    hideLevel2Menu: function (e) {
      console.log('hide menu');
      jQuery('.paragon-header-menu-level2-container').removeClass('active');
      jQuery('.paragon-header-second-menu-item').removeClass('active');
      jQuery('.paragon-header-menu-overlay').removeClass('active');
      jQuery('.paragon-header-menu-level1').find('li').removeClass('active');
    },

    getContext: function getContext() {
      return {
        menuItems: this.menuItems,
      };
    },
  });
});
