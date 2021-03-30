define(
	'BigBang.Punchout2Go.PunchoutServices.Model'
,	[
	 	'SC.Model'
	,	'Configuration'
	,	'Application'
	,	'Models.Init'
	,	'Profile.Model'
	,	'LiveOrder.Model'
	,	'SC.Models.Init'
	]
,	function(
		SCModel
	,	Configuration
	,	Application
	,	CommerceAPI
	,	Profile
	,	LiveOrder
	,	ModelsInit
	)
	{
    'use strict';

    return SCModel.extend({
        
    	name: 'PunchoutServices'
        	
    	//@method transfer : transfer the content of the cart to punchout
		//@returns null
	,	transfer : function() {
			var PUNCHOUTURL = 'https://connect.punchout2go.com/gateway/link/punchin/id/';
			var order = LiveOrder.get();
			var profile = Profile.get();

			nlapiLogExecution('debug', 'Transfer Order', JSON.stringify(order));
			nlapiLogExecution('debug', 'Transfer Profile', JSON.stringify(profile));

			var customerId = profile.internalid;
			var profileSearch = nlapiSearchRecord('contact', null, [['email', 'is', profile.email]], null);
			var contactId = profileSearch[0].getId();
			var nsResponse = nlapiRequestURL(nlapiResolveURL('SUITELET', 'customscript_ssu_getpunchoutsession', 'customdeploy_ssu_getpunchoutsession', true) + '&id=' + contactId);
			var sessionId = nsResponse.getBody();

			if (!sessionId || sessionId.length > 100) {
				throw new Error('Error while getting the PunchOut Session from NetSuite. Please check the Suitelet response.')
			}

			var customValues = profile.customfields;

			nlapiLogExecution('debug', 'sessionId', sessionId);

			var cartContent = this.getCartContent(order, profile);
			
			nlapiLogExecution('debug', 'PO2GO.Transfer.Model - CartContent', JSON.stringify(cartContent));

			this.updateCartItems(cartContent, customerId);

			var encodedCartContent = nlapiEncrypt(JSON.stringify(cartContent), 'base64');
			
			nlapiLogExecution('debug', 'PO2GO.Transfer.Model - encodedCartContent', encodedCartContent);
			
			this.postBackToPunchout(PUNCHOUTURL + sessionId, encodedCartContent);

			//Remove all item from the cart since they have been sent.
			this.removeAllItems(order);

			var profileFields = ModelsInit.customer.getFieldValues();
			var profileSearch = nlapiSearchRecord('contact', null, [['email', 'is', profileFields.email]], null);
			var contactInternalid = profileSearch[0].getId();

			nlapiSubmitField('contact', contactInternalid, 'custentity_po2go_sessionid', '');
			nlapiLogExecution('debug', 'PO2GO.Transfer.Model - Session - posted to Punchout', sessionId);

			return 'https://connect.punchout2go.com/gateway/link/return/id/' + sessionId + '?redirect=1';
		}
    
	,	getCartContent : function(order, profile) {
			var cartContent = {
				body : {
					edit_mode : 0,
					items : {
						items : []
					},
					total : order.summary.total,
					currency : profile.currency.code,
					tax : order.summary.taxtotal,
					shipping : order.summary.shippingcost
				}
			};

			nlapiLogExecution('debug', 'cartContent - before', JSON.stringify(cartContent));

			var itemList = order.lines;

			if (itemList) {
				for (var i = 0; i < itemList.length; i++) {
					nlapiLogExecution('debug', 'PO2GO.Transfer.Model - Line', JSON.stringify(itemList[i]));
					nlapiLogExecution('debug', 'itemList[i].item.itemid', itemList[i].item.itemid);
					cartContent.body.items.items.push({
						quantity : itemList[i].quantity,
						supplierid : itemList[i].item.itemid,
						supplierauxid : itemList[i].item.internalid,
						unitprice : itemList[i].rate,
						currency : profile.currency.code,
						classification : null,
						classdomain : null,
						uom : itemList[i].item.saleunit,
						description : itemList[i].item.displayname,
						language : 'en'
					});
				}
			}
			nlapiLogExecution('debug', 'cartContent - AFTER', JSON.stringify(cartContent));

			return cartContent;
		}
		
	,	updateCartItems : function(cartContent, customerId) {
			nlapiLogExecution('debug', 'customerId', customerId);
			for (var i = 0; i < cartContent.body.items.items.length; i++) {
				var supplierId = cartContent.body.items.items[i].supplierauxid;
				nlapiLogExecution('debug', 'cartContent.body.items.items[i].supplierauxid - BEFORE', cartContent.body.items.items[i].supplierauxid);
				cartContent.body.items.items[i].supplierauxid = supplierId + '/' + customerId;
				nlapiLogExecution('debug', 'cartContent.body.items.items[i].supplierauxid - AFTER', cartContent.body.items.items[i].supplierauxid);
			}
		}
	
	,	postBackToPunchout : function(url, params) {
			var APIKEY = 'He894eee7baa1646.57991b729f6e1';
			var punchOutResponse = nlapiRequestURL(url, {
				apikey : APIKEY,
				version : '1.0',
				params : params
			}, null, 'POST');
			
			nlapiLogExecution('debug', 'punchout response', punchOutResponse.getBody());
		}
	
	,	removeAllItems : function(order) {
			var itemList = order.lines;
			if (itemList) {
				for (var i = 0; i < itemList.length; i++) {
					LiveOrder.removeLine(itemList[i].internalid);
				}
			}
		}        
    });
});
