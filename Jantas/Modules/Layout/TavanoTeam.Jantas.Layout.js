
define(
    'TavanoTeam.Jantas.Layout'
    ,   [
            "jQuery"

        ]
    ,   function (jQuery

    )
    {
        'use strict';

        return {

            loadModule: function loadModule(container) {


                var layout = container.getComponent('Layout');
                layout.on('afterShowContent',function(view){
                
                    if(view && !view.inModal){
                        jQuery('#layout').removeClass().addClass('layout').addClass('sec_'+view);
                    }
                });
            }
        };
    });

