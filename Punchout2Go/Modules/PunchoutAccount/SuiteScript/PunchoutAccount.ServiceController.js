
define(
	'BigBang.Punchout2Go.PunchoutAccount.ServiceController'
,	[
		'ServiceController'
	,	'BigBang.Punchout2Go.PunchoutAccount.Model'
	,	'CryptoJS'
	]
,	function(
		ServiceController
	,	PunchoutAccount
	,	CryptoJS
	)
{
		'use strict';

		return ServiceController.extend({

			name: 'BigBang.Punchout2Go.PunchoutAccount.ServiceController',
			AESBASE64Key : '/HzK5S41lQLWBBY5Iawnwr==' //The key to decrypt the data sent by punchout2go
				
		,	post : function() {
				var request = this.request;
				nlapiLogExecution('debug', 'PO2GO.Account.Login.ServiceController()', 'Executing...');
	
				var base64IV = this.data.iv || request.getParameter('iv');
				var pos = this.data.pos || request.getParameter('pos');
				var base64Params = this.data.params || request.getParameter('params');
	
				nlapiLogExecution('debug', 'base64Params', base64Params);
	
				var params = '{"header":{"to":' + CryptoJS.AES.decrypt(base64Params, CryptoJS.enc.Base64.parse(this.AESBASE64Key), {
					iv : CryptoJS.enc.Base64.parse(base64IV),
					salt : ''
				}).toString(CryptoJS.enc.Latin1).substring(16);
	
				var paramObject = JSON.parse(params);
	
				nlapiLogExecution('debug', 'decoded params', JSON.stringify(params));
	
				var email = paramObject.body.contact.data.punchoutemail;
				nlapiLogExecution('debug', 'PO2GO.Account.Login.ServiceController()', 'email: ' + email);
	
				var password = paramObject.body.contact.data.punchoutpassword;
				nlapiLogExecution('debug', 'PO2GO.Account.Login.ServiceController()', 'password: ' + password);
	
				var ret = PunchoutAccount.login(email, password, false, pos);
				nlapiLogExecution('debug', 'PO2GO.Account.Login.ServiceController()', 'ret: ' + ret);
	
				this.response.sendRedirect('EXTERNAL', ret.touchpoints.continueshopping);
			}
		
		,	handle : function(request, response) {
				this.request = request;
				this.response = response;
				this.method = this.getMethod();
				this.data = {};
				var contentType = this.request.getHeader('content-type');
	
				nlapiLogExecution('debug', 'contentType', contentType);
	
				if (contentType === 'application/x-www-form-urlencoded') {
					var parameters = request.getAllParameters();
					for ( var param in parameters) {
						this.data[param] = parameters[param];
						nlapiLogExecution('debug', param, parameters[param]);
					}
				}
				else if (contentType === 'application/json') {
					this.data = JSON.parse(this.request.getBody());
				}
	
				nlapiLogExecution('debug', 'this.data', JSON.stringify(this.data));
	
				try {
					this.validateRequest(this.getOptions(this.method));
					if (_.isFunction(this[this.method])) {
						var result = this[this.method]();
						if (result) {
							return this.sendContent(result);
						}
					}
					else {
						return this.sendError(methodNotAllowedError);
					}
				}
				catch (e) {
					return this.sendError(e);
				}
			}
		});
	}
);