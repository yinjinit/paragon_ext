
define('PDPCnet.ImageGallery.View'
    ,	[
        'pdp_cnet_image_gallery.tpl'
        ,	'Utils'
        ,	'Backbone'
        ,	'jQuery'
        ,	'underscore'

    ]
    ,	function (
        pdp_cnet_image_gallery_tpl
        ,	Utils
        ,	Backbone
        ,	jQuery
        ,	_

    )
    {
        'use strict';


        return Backbone.View.extend({

            template: pdp_cnet_image_gallery_tpl

            ,	initialize: function (options)
            {
                


            }
            ,	getContext: function getContext()
            {

                return {};
            }

        });
    });