
define(
	'BigBang.Punchout2Go.PunchoutAccount.Model'
,	[
    	'SC.Model'
	,	'Application'
	,	'SC.Models.Init'
	,	'Profile.Model'
	,	'LiveOrder.Model'
	,	'Address.Model'
	,	'CreditCard.Model'
	,	'SiteSettings.Model'
	,	'underscore'
	]
,	function (
		SCModel
	,	Application
	,	ModelsInit
	,	Profile
	,	LiveOrder
	,	Address
	,	CreditCard
	,	SiteSettings
	,	_
	) 
{
    	'use strict';

    	return SCModel.extend({
    		
    		name: 'PunchoutAccount'

        ,	login: function (email, password, redirect, po2goSession) {
			    nlapiLogExecution('debug', 'PunchoutAccount.login', 'Executing...');

				ModelsInit.session.login({
					email : email,
					password : password
				});
	
				var user = Profile.get();
	
				user.isLoggedIn = ModelsInit.session.isLoggedIn2() ? 'T' : 'F';
				user.isRecognized = ModelsInit.session.isRecognized() ? 'T' : 'F';
	
				nlapiLogExecution('debug', 'po2goSession', po2goSession)
	
				if (po2goSession != null && po2goSession != '') {
					var profile = ModelsInit.customer.getFieldValues();
					var profileSearch = nlapiSearchRecord('contact', null, [['email', 'is', profile.email]], null);
					var contactInternalid = profileSearch[0].getId();
	
					nlapiSubmitField('contact', contactInternalid, 'custentity_po2go_sessionid', po2goSession);
				}
	
				var ret = {
					touchpoints : ModelsInit.session.getSiteSettings(['touchpoints']).touchpoints,
					user : user
				};
	
				if (!redirect) {
					var Environment = Application.getEnvironment(request), language = Environment && Environment.currentLanguage || {};
					language.url = language.locale && ModelsInit.session.getAbsoluteUrl('/languages/' + language.locale + '.js') || '';
					_.extend(ret, {
						cart : LiveOrder.get(),
						address : Address.list(),
						creditcard : CreditCard.list(),
						language : language,
						currency : Environment && Environment.currentCurrency || ''
					});
				}
	
				return ret;
            }  
    	});
	}
);
