define(
	'BigBang.Punchout2Go.PunchoutServices.ServiceController'
,	[
		'ServiceController'
	,	'Profile.Model'
	,	'LiveOrder.Model'
    ,	'SC.Models.Init'
	,	'BigBang.Punchout2Go.PunchoutServices.Model'
	]
,	function(
		ServiceController
	,	Profile
	,	LiveOrder
    ,	ModelsInit
	,	PO2GOTransfer
	)
	{
		'use strict';

		return ServiceController.extend({

			name: 'BigBang.Punchout2Go.PunchoutServices.ServiceController'

		,	get : function get() {
				var request = this.request;
				var service = request.getParameter('method');
	
				nlapiLogExecution('debug', 'PO2GO.ServiceController - service', service);
	
				if (service === 'transfer') {
					nlapiLogExecution('debug', 'PO2GO.ServiceController - service', 'in transfer');
					var url = PO2GOTransfer.transfer();
					this.response.sendRedirect('EXTERNAL', url);
				}
				else if (service === 'getSession' && ModelsInit.session.isLoggedIn2() && ModelsInit.session.isRecognized()) {
					nlapiLogExecution('debug', 'ModelsInit.session.isLoggedIn2()', ModelsInit.session.isLoggedIn2());
					nlapiLogExecution('debug', 'ModelsInit.session.isRecognized()', ModelsInit.session.isRecognized());
				
					var sessionId;
	
					try {
						var profile = Profile.get();
						var col = new Array();
						col.push(new nlobjSearchColumn('custentity_po2go_sessionid'));
	
						var profileSearch = nlapiSearchRecord('contact', null, [['email', 'is', profile.email]], col);
						if (profileSearch !== null && profileSearch !== {} && profileSearch !== []) {
							sessionId = profileSearch[0].getValue('custentity_po2go_sessionid');
	
							nlapiLogExecution('debug', 'GET - profileSearch', JSON.stringify(profileSearch));
						}
					}
					catch (error) {
						sessionId = null;
					}
	
					return {
						'sessionId' : sessionId
					};
				}
	
				return null;
			}
		});
	}
);