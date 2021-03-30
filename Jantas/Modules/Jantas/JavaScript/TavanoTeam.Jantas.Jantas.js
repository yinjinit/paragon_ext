define(
    'TavanoTeam.Jantas.Jantas'
    ,   [
        'TavanoTeam.Jantas.Footer',
        'TavanoTeam.Jantas.Layout'
    ]
    ,   function (
        TavanoTeamJantasFooter,
        TavanoTeamJantasLayout
    )
    {
        'use strict';

        return  {
            mountToApp: function mountToApp (container)
            {

                TavanoTeamJantasFooter.loadModule(container);
                TavanoTeamJantasLayout.loadModule(container);

            }
        };
    });