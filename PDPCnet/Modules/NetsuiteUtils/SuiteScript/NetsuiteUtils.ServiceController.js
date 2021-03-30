
define(
	'Tavano.PDPCnet.NetsuiteUtils.ServiceController'
,	[
		'ServiceController',
		'NetsuiteUtils.Model'
	]
,	function(
		ServiceController,
		NetsuiteUtilsModel
	)
	{
		'use strict';

		return ServiceController.extend({

			name: 'Tavano.PDPCnet.NetsuiteUtils.ServiceController'

			// The values in this object are the validation needed for the current service.
		,	options: {
				common: {
				}
			}

		,	get: function get()
			{
				// ----------------------------------------------------------------------
				// **Example: checkItem
				// ----------------------------------------------------------------------
				var cnet = this.request.getParameter('cnet_id');
				var mpn = this.request.getParameter('mpn_id');
				
				var utilsModel = NetsuiteUtilsModel;
				utilsModel.itemData = {
					mpn  : mpn,
					cent : cnet
				};

				return utilsModel.checkItem();
			}

			
		,	post: function post()
			{
				// ----------------------------------------------------------------------
				// **Example: CreateItem
				// ----------------------------------------------------------------------
				var item = {};
				item.id = this.data.id || null;
				item.price = this.data.price || null;
				item.description = this.data.description || null;
				item.mpn = this.data.mpn || null;
				item.category = this.data.cat || null;
				item.weight = this.data.weight || 0.99;
				item.action = "create";

				var utilsModel = NetsuiteUtilsModel;
				utilsModel.itemData = item;

				return utilsModel.createItem();
			}
		});
	}
);