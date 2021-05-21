// Tavano.PDPCnet.PDPCnet.js
// Load all your starter dependencies in backend for your extension here
// ----------------

define('Tavano.PDPCnet.PDPCnet'
,	[
		'Tavano.PDPCnet.PDPCnet.ServiceController',
		'Application',
		'NetsuiteUtils.Model',
		'underscore'
	]
,	function (
		PDPCnetServiceController,
		Application,
		NetsuiteUtilsModel,
		_
	)
{
	'use strict';

	Application.on('before:LiveOrder.addLines', function (model, data) {

		try {

			var line = data.length === 1 ? data[0] : null;

			if( line && line.item && typeof line.item.internalid  !== 'number' ) {
				processCNetDataAndCreateItem(line);
			} 
		}
		catch (e) {

			nlapiLogExecution('ERROR', 'before:LiveOrder.addLines Error', 'Review PDPCnet: ' + e.message);

		}
	});

	Application.on('before:ProductList.Item.create', function (model, user, line) {

		try {

			nlapiLogExecution('DEBUG', '-- WISHLIST --', JSON.stringify(line));

			if( line && line.item && typeof line.item.internalid  !== 'number' ) {

				// first check item in case the user wants to add on more than one list at the same time
				processCNetDataAndCreateItem(line, true);
			} 
		}
		catch (e) {

			nlapiLogExecution('ERROR', 'before:LiveOrder.addLines Error', 'Review PDPCnet: ' + e.message);

		}
	});

	function processCNetDataAndCreateItem(line, checkItem){
		var cnetData = _.find(line.options, function(option){
			return option.cartOptionId === "CNET_DATA";
		});

		if( cnetData ) {
			var cnetItem = cnetData.value;
			cnetItem.category = cnetItem.cat; // change the cat to use category

			cnetItem.price = cnetItem.price ? parseFloat(cnetItem.price.replace(/,/g, '')) : 0.0;
			cnetItem.weight = parseFloat(cnetItem.weight);

			// Item creation 
			NetsuiteUtilsModel.itemData = cnetItem;

			var itemCreatedId = null;

			if(checkItem) {
				var checkData = NetsuiteUtilsModel.checkItem();
				if(checkData.status === "OK" && checkData.data > 0) {
					itemCreatedId = checkData.data;
				}
			}

			if( itemCreatedId ) {
				line.item.internalid = itemCreatedId;
			} else {
				var item = NetsuiteUtilsModel.createItem();
				// end Item creation
	
				// set the correct item and perform line clean up.
				if( item.data && item.data > 0 ) {
					// change the internal id for the currently created item.
					line.item.internalid = item.data;
	
					// remove the item options since we are not going to use it anymore.
					line.options = _.filter(line.options, function(option){
						return option.cartOptionId !== "CNET_DATA";
					});
	
				} else {
					nlapiLogExecution('DEBUG', 'Error creating the item');
				}
			}
		}
	}
});