define('PM.ParagonServiceSolutionsMenu.View', ['paragon_service_solutions_menu.tpl', 'Backbone', 'jQuery'], function (
  paragon_service_solutions_menu_tpl,
  Backbone,
  jQuery
) {
  'use strict';

  return Backbone.View.extend({
    template: paragon_service_solutions_menu_tpl,

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

      $('.paragon-header-menu-hardware-details').removeClass('active');
      $(target).addClass('active');
    },

    getContext: function getContext() {
      var categories = [
        {
          active: true,
          title: 'Microsoft',
          dataTarget: '#paragon-header-menu-solutions-service-microsoft',
        },
        {
          title: 'Collaboration',
          dataTarget: '#paragon-header-menu-solutions-service-collaboration',
        },
        {
          title: 'Cybersecurity',
          dataTarget: '#paragon-header-menu-solutions-service-cybersecurity',
        },
        {
          title: 'Cloud Computing',
          dataTarget: '#paragon-header-menu-solutions-service-cloud-computing',
        },
        {
          title: 'Networking',
          dataTarget: '#paragon-header-menu-solutions-service-networking',
        },
        {
          title: 'Virtualization',
          dataTarget: '#paragon-header-menu-solutions-service-virtualization',
        },
        {
          title: 'Data Center Infrastructure',
          dataTarget: '#paragon-header-menu-solutions-service-data-center-infrastructure',
        },
        {
          title: 'Services',
          dataTarget: '#paragon-header-menu-solutions-service-services',
        },
      ];
      return {
        categories: categories,
      };
    },
  });
});
