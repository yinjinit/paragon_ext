
define('PDPCnet.ProductInformation.View'
    ,	[
        'pdp_cnet_product_information.tpl'
        ,	'Utils'
        ,	'Backbone'
        ,	'jQuery'
        ,	'underscore'

    ]
    ,	function (
        pdp_cnet_product_information
        ,	Utils
        ,	Backbone
        ,	jQuery
        ,	_

    )
    {
        'use strict';


        return Backbone.View.extend({

            template: pdp_cnet_product_information

            ,	initialize: function (options) {


            }

            ,	events: {
            }

            ,	bindings: {
            }

            , 	childViews: {

            }


            ,	getContext: function getContext()
            {

                return {

                };
            }
        });
    });