
define(
    'TavanoTeam.Jantas.Footer'
    ,   [

    ]
    ,   function (

    )
    {
        'use strict';

        return {

            loadModule: function loadModule(container) {


                var actualYear = new Date().getFullYear();


                var layout = container.getComponent('Layout');

                layout.addToViewContextDefinition('Footer.View', 'actualYear', 'string', function(context) {
                    return actualYear;
                });
            }
        };
    });

