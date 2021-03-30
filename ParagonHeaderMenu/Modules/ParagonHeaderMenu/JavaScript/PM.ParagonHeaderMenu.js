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
              link: 'https://www.paragonmicro.com/solution-service',
            },
            {
              title: 'Cloud Solutions',
              icon: '',
              link: 'https://www.paragonmicro.com/cloud',
            },
            {
              title: 'Collaboration',
              icon: '',
              link: 'https://www.paragonmicro.com/collaboration',
            },
            {
              title: 'Cybersecurity Solutions',
              icon: '',
              link: 'https://www.paragonmicro.com/cyber-security',
            },
            {
              title: 'Data Center',
              icon: '',
              link: 'https://www.paragonmicro.com/data-center',
            },
            {
              title: 'Microsoft',
              icon: '',
              link: 'https://www.paragonmicro.com/microsoft',
            },
            {
              title: 'Networking',
              icon: '',
              link: 'https://www.paragonmicro.com/networking',
            },
            {
              title: 'Services',
              icon: '',
              link: 'https://www.paragonmicro.com/services',
            },
            {
              title: 'Virtualization',
              icon: '',
              link: 'https://www.paragonmicro.com/virtualization',
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
              link: 'https://www.paragonmicro.com/industries-we-serve',
            },
            {
              title: 'Education',
              icon: '',
              link: 'https://www.paragonmicro.com/education',
            },
            {
              title: 'Business',
              icon: '',
              link: 'https://www.paragonmicro.com/business',
            },
            {
              title: 'Federal Government',
              icon: '',
              link: 'https://www.paragonmicro.com/federal-gov',
            },
            {
              title: 'Health Care',
              icon: '',
              link: 'https://www.paragonmicro.com/healthcare',
            },
            {
              title: 'State & Local',
              icon: '',
              link: 'https://www.paragonmicro.com/state-local',
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
              link: 'https://www.paragonmicro.com/aboutus',
            },
            {
              title: 'Why Partner With Us',
              icon: '',
              link: 'https://www.paragonmicro.com/why-partner-with-us',
            },
            {
              title: 'Global Procurement',
              icon: '',
              link: 'https://www.paragonmicro.com/global-procurement',
            },

            {
              title: 'Careers',
              icon: '',
              link: 'https://www.paragonmicro.com/careers',
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
              link: 'https://www.paragonmicro.com/newsroom',
            },
            {
              title: 'Support',
              icon: '',
              link: 'https://www.paragonmicro.com/support',
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
