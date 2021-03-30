/**
 * Utility Module to interact with Netsuite.
 */

// ---------------------------------------------------------------------------
// how to use it
// ---------------------------------------------------------------------------
/**
NetsuiteUtils.getItemFromNetsuite('PT640U-02G006', 'S13000595').then(function(data){
    // item in netsuite
    console.log(data)
}).fail(function(data){

    // item not created on netsuite
});
**/
// ---------------------------------------------------------------------------

define('NetsuiteUtils',[
    'CNetItem.Model',
    'underscore'
], function( CNetItemModel, _) {
    'use strict';
    
    return {
        
        /**
         * Check if the item is created on Netsuite.
         * If it is created it will return the product id, otherwise it will fail.
         * Remember this is a promise, use methods then and fail to interact with it.
         * @param {String} mpn Manufacturer part number
         * @param {String} mfn CNet Product id
         * @returns {Promise} 
         */
        getItemFromNetsuite : function( mpn, mfn ) {
            // ----------------------------------------------------------------------
			// **Example: checkItem
			// ----------------------------------------------------------------------
            var model = new CNetItemModel();

            model.set('mpn_id', mpn);
            model.set('cnet_id', mfn);

            return model.fetch({
                data : {
                    cnet_id : mfn,
                    mpn_id  : mpn
                }
            });
        },

        /**
         * Utility method to handle item creation on Netsuite.
         * 
         * @param {Object} data The data parameter has the required information for item creation:
         *      id : CNet item id
         *      price : Item price
         *      description : Item description
         *      mpn : Manufacturer part number
         *      cat : 2 digit category code
         *      weight : the item's weight
         * 
         * @returns {Promise}
         */
        createItem : function( data ) {

            // ----------------------------------------------------------------------
			// **Example: CreateItem
			// ----------------------------------------------------------------------
            var model = new CNetItemModel({
                id          : data.id,
                price       : data.price,
                description : data.description,
                mpn         : data.mpn,
                cat         : data.cat,
                weight      : data.weight
            });

            return model.save();
        }
    }
});