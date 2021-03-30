define(
    'ProductDetails.CanonicalFix',
    [
       'ProductDetails.Base.View',
       
       'Backbone',
       'underscore',
       'Utils'
       
    ],
    function (
       ProductDetailsBaseView,
       Backbone,
       _,
       Utils
    ) {
       'use strict';
 
 
 
       _.extend(ProductDetailsBaseView.prototype, {
 
            // @wrap
            // @desc for the product details page, we change the behavior of the default
            // getCanonical method to add parameters informations
            getCanonical: _.wrap(ProductDetailsBaseView.prototype.getCanonical, function (fn) {
                
                
                var ret = fn.apply(this, _.toArray(arguments).slice(1));
                
                ret = window.location.href
                
                return ret;
            }),
 
         
       });
    });
 