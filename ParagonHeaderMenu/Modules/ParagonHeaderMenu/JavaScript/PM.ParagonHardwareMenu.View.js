define('PM.ParagonHardwareMenu.View', ['paragon_hardware_menu.tpl', 'Backbone', 'jQuery'], function (
  paragon_hardware_menu_tpl,
  Backbone,
  jQuery
) {
  'use strict';

  return Backbone.View.extend({
    template: paragon_hardware_menu_tpl,

    initialize: function (options) {
      console.log('Hardware Menu View');
    },

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
      var hardwareCategories = [
        {
          active: true,
          title: 'Cables',
          dataTarget: '#paragon-header-menu-hardware-cables',
        },
        {
          title: 'Computer Accessories',
          dataTarget: '#paragon-header-menu-hardware-accessories',
        },
        {
          title: 'Desktops',
          dataTarget: '#paragon-header-menu-hardware-desktops',
        },
        {
          title: 'Notebooks',
          dataTarget: '#paragon-header-menu-hardware-notebooks',
        },
        {
          title: 'Data Storage Products',
          dataTarget: '#paragon-header-menu-hardware-data-storage',
        },
        {
          title: 'Electronics',
          dataTarget: '#paragon-header-menu-hardware-electronics',
        },
        {
          title: 'Memory',
          dataTarget: '#paragon-header-menu-hardware-memory',
        },
        {
          title: 'Monitors & Projectors',
          dataTarget: '#paragon-header-menu-hardware-monitors-projectors',
        },
        {
          title: 'Networking Products',
          dataTarget: '#paragon-header-menu-hardware-networking',
        },
        {
          title: 'Office Equipment & Supplies',
          dataTarget: '#paragon-header-menu-hardware-office-equip-supply',
        },
        {
          title: 'Phones & Video Conferencing',
          dataTarget: '#paragon-header-menu-hardware-phone-video',
        },
        {
          title: 'Power, Cooling & Racks',
          dataTarget: '#paragon-header-menu-hardware-power-cooling',
        },
        {
          title: 'Printers, Scanners & Print Supplies',
          dataTarget: '#paragon-header-menu-hardware-printer-scanner',
        },
        {
          title: 'Servers & Server Management',
          dataTarget: '#paragon-header-menu-hardware-server',
        },
        {
          title: 'Software',
          dataTarget: '#paragon-header-menu-hardware-software',
        },
      ];
      return {
        hardwares: hardwareCategories,
      };
    },
  });
});
