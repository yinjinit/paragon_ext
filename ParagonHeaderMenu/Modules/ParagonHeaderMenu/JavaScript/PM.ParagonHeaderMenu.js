define('PM.ParagonHeaderMenu', [
  'PM.ParagonHeaderMenu.View',
  'PM.ParagonHardwareMenu.View',
  'PM.ParagonSoftwareMenu.View',
  'PM.ParagonServiceSolutionsMenu.View',
  'PM.ParagonIndustriesWebServeMenu.View',
  'PM.ParagonSecondMenu.View',
  'PM.ParagonHeaderFeaturedPartners.View',
  'SC.Configuration',
], function (
  PMParagonHeaderMenuView,
  hardwareMenuView,
  softwareMenu,
  serviceSolutionsMenu,
  industriesWebServeMenu,
  secondMenu,
  featuredBrandsView,
  Configuration
) {
  'use strict';

  return {
    mountToApp: function mountToApp(container) {
      var layout = container.getComponent('Layout');
      var configuration = container.Configuration; 
      var url = configuration.siteSettings.touchpoints.home;
      if (layout) {
        layout.addChildView('Global.ParagonHeaderMenu', function () {
          return new PMParagonHeaderMenuView(container);
        });

        layout.addChildView('ParagonHeader.HardwareMenu.View', function () {
          return new hardwareMenuView(container);
        });

        // layout.addChildView('ParagonHeader.SoftwareMenu.View', function () {
        //   return new softwareMenu(container);
        // });

        layout.addChildView('ParagonHeader.SolutionsServicesMenu.View', function () {
          var menuItems = [
            {
              title: 'Solution & Service',
              icon: '',
              link: url + '/solution-service',
            },
            {
              title: 'Cloud Solutions',
              icon: '',
              link: url + '/cloud',
            },
            {
              title: 'Collaboration',
              icon: '',
              link: url + '/collaboration',
            },
            {
              title: 'Cybersecurity Solutions',
              icon: '',
              link: url + '/cyber-security',
            },
            {
              title: 'Data Center',
              icon: '',
              link: url + '/data-center',
            },
            {
              title: 'Microsoft',
              icon: '',
              link: url + '/microsoft',
            },
            {
              title: 'Networking',
              icon: '',
              link: url + '/networking',
            },
            {
              title: 'Services',
              icon: '',
              link: url + '/services',
            },
            {
              title: 'Virtualization',
              icon: '',
              link: url + '/virtualization',
            },
          ];
          return new secondMenu({ container: container, menuItems: menuItems });
          //return new serviceSolutionsMenu(container);
        });

        layout.addChildView('ParagonHeader.IndustriesWebServeMenu.View', function () {
          var menuItems = [
            {
              title: 'Industries We Serve',
              icon: '',
              link: url + '/industries-we-serve',
            },
            {
              title: 'Education',
              icon: '',
              link: url + '/education',
            },
            {
              title: 'Business',
              icon: '',
              link: url + '/business',
            },
            {
              title: 'Federal Government',
              icon: '',
              link: url + '/federal-gov',
            },
            {
              title: 'Health Care',
              icon: '',
              link: url + '/healthcare',
            },
            {
              title: 'State & Local',
              icon: '',
              link: url + '/state-local',
            },
          ];
          return new secondMenu({ container: container, menuItems: menuItems });

          // return new industriesWebServeMenu(container);
        });

        layout.addChildView('ParagonHeader.AboutUsMenu.View', function () {
          var menuItems = [
            /*             {
                          title: 'Milestones',
                          icon: '',
                          link: '#',
                        }, 
                        {
                          title: 'Culture',
                          icon: '',
                          link: '#',
                        },*/

            {
              title: 'About Us',
              icon: '',
              link: url + '/aboutus',
            },
            {
              title: 'Why Partner With Us',
              icon: '',
              link: url + '/why-partner-with-us',
            },
            {
              title: 'Global Procurement',
              icon: '',
              link: url + '/global-procurement',
            },

            {
              title: 'Careers',
              icon: '',
              link: url + '/careers',
            },
            /*  {
               title: 'Awards',
               icon: '',
               link: '#',
             },
             {
               title: 'Leadership',
               icon: '',
               link: '#',
             },
             {
               title: 'Partnerships',
               icon: '',
               link: '#',
             },
             {
               title: 'Paragon Provides',
               icon: '',
               link: '#',
             },
             {
               title: 'Locations',
               icon: '',
               link: '/location',
             }, */
          ];
          return new secondMenu({ container: container, menuItems: menuItems });
        });

        layout.addChildView('ParagonHeader.ResourceMenu.View', function () {
          var menuItems = [
            /*           {
                          title: 'The Paragon Perspective',
                         icon: '',
                         link: '#',
                       },
                       {
                         title: 'Industry Insights',
                         icon: '',
                         link: '#',
                       },
                       {
                         title: 'Thought Leadership',
                         icon: '',
                         link: '#',
                       }, */
            {
              title: 'Newsroom',
              icon: '',
              link: url + '/newsroom',
            },
            {
              title: 'Support',
              icon: '',
              link: url + '/support',
            },
            /*             {
                          title: 'Success Stories',
                          icon: '',
                          link: '#',
                        }, */
          ];
          return new secondMenu({ container: container, menuItems: menuItems });
        });

        layout.addChildView('Global.ParagonHeaderFeaturedBrands.View', function () {
          return new featuredBrandsView(container);
        });
      }
    },
  };
});
