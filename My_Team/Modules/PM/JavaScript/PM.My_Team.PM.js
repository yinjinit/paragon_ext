define('PM.My_Team.PM', ['PM.My_Team.PM.View'], function (PMView) {
  'use strict';

  return {
    mountToApp: function mountToApp(container) {
      // using the 'Layout' component we add a new child view inside the 'Header' existing view
      // (there will be a DOM element with the HTML attribute data-view="Header.Logo")
      // more documentation of the Extensibility API in
      // https://system.netsuite.com/help/helpcenter/en_US/APIs/SuiteCommerce/Extensibility/Frontend/index.html

      /** @type {LayoutComponent} */
      var pageType = container.getComponent('PageType');

      pageType.registerPageType({
        name: 'mysalesteam',
        routes: ['/myteam'],
        view: PMView,
        defaultTemplate: {
          name: 'pm_my_team_pm.tpl',
          displayName: 'My Sales Team',
          thumbnail: null,
        },
      });

      var myaccountmenu = container.getComponent('MyAccountMenu');

      var myteammenugroup = {
        id: 'myteam',
        name: 'My Team',
        index: 0,
        url: '/myteam',
      };



      myaccountmenu.addGroup(myteammenugroup);
      //myaccountmenu.addGroupEntry(myteamviewall);
    },
  };
});
