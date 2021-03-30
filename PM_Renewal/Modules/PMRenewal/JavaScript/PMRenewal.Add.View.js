// @module ParagonMicro.PM_Renewal.PMRenewal
	

define('ParagonMicro.PM_Renewal.PMRenewal.Add.View'
,	[
		'SC.Configuration'
	,	'Transaction.Line.Views.Cell.Navigable.View'
	,	'PMRenewal.Model'
	,   'Profile.Model'

	,	'renewal_new.tpl'

	,	'Utils'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'AjaxRequestsKiller'

	,	'jQuery'
	,	'underscore'
	]
,	function (
		Configuration
	,	TransactionLineViewsCellNavigableView
	,	PMRenewalModel
	,   ProfileModel

	,	renewal_new_tpl
	,	Utils

	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	AjaxRequestsKiller

	,	jQuery
	,	_
	)
{
	'use strict';

	// @class ParagonMicro.PM_Renewal.PMRenewal.View @extends Backbone.View
	return Backbone.View.extend({

		template: renewal_new_tpl

	,	className: 'PMRenewalModel'

		//@property {String} title
	,	title: _('Add Renewal Reminder').translate()

		//@property {String} page_header
	,	page_header: _('Add Renewal Reminder').translate()

		//@property {Object} attributes
		/*
	,	attributes: {
			'id': 'PMRenewalHistory'
		,	'class': 'PMRenewalistView'
		}

	,	attributes: {
			'class': 'PMRenewal'
		}  
*/		

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service 
				(you'll need to deploy and activate the extension first)
			*/
			//this.message = 'Hello World';
			// var service_url = Utils.getAbsoluteUrl(getExtensionAssetsPath('services/PMRenewal.Service.ss'));

			// jQuery.get(service_url)
			// .then((result) => {

			// 	this.message = result;
			// 	this.render();
			// });
			this.options = options;
			this.application = options.application;
			this.model = new PMRenewalModel();

			var profile_model = ProfileModel.getInstance();
			this.user = profile_model.get('internalid');
			var primary_contact_email = profile_model.get('email');
			this.primary_contact_email = profile_model.get('email');
			console.log('profile_model');
			console.log(profile_model);
			
			var primaryContactId = "";

			var primaryContactId = this.getPrimaryContactId();

			console.log('primaryContactId');
			console.log(primaryContactId);
			
			this.model.on('all', jQuery.proxy(this, 'correctDates'));
			this.model.on('sync', jQuery.proxy(this, 'showSuccess'));	

		}

	,	beforeShowContent: function beforeShowContent() {

			return jQuery.Deferred().resolve();
		}

	,	events: {
			'submit form': 'saveForm'
		,	'keypress [type="text"]': 'preventEnter'
		,	'change [data-action="change-renewal"]': 'changeRenewal'
		,   'change [data-action="change-renewal-date"]': 'changeRenewalDate'

		,	'change [data-action="change-reminder"]': 'changeReminder'
		,	'change [data-action="change-reminder-date"]': 'changeReminderDate'

		,	'change [data-action="change-start"]': 'changeStart'
		,   'click [data-action="items-expander"]': 'customExpander'
		}

	,	bindings: {
		}

	, 	childViews: {
			
		}

	,	getSelectedMenu: function ()
		{
			return 'addreminder';
		}

		//@method getBreadcrumbPages
		//@return {BreadcrumbPage}
	,	getBreadcrumbPages: function ()
		{
			return {
				text: this.title
			,	href: '/renwals'
			}
		}

	,   getPrimaryContactId: function()
		{
		    var primaryContactId = "";
            var primaryContact = "";
			var data = {
				email_param: this.primary_contact_email,
				companyid_param: this.user
				};

				//611 on production
				jQuery.getJSON("/app/site/hosting/scriptlet.nl?script=611&deploy=1", data, function (response) {
					//console.log('response');
				    //console.log(response[0].id);
				    return response;
				    //primaryContactId = response;
				    //primaryContactId = primaryContactId;
				    //eturn primaryContact;
				    //this.primaryConta	ctId = primaryContact;
				     //return response;
				    //console.log(response);
				   // console.log('primaryContactId: ' + primaryContactId);
				});
				return primaryContact;
		}

	,	changeStart: function(e)
		{
			var startValue = jQuery('#custrecord_ng_rt_start_date').val();

			//jQuery('#custrecord_ng_rt_start_date_hidden').val(this.formatDate(startValue));
			jQuery('#custrecord_ng_rt_start_date_hidden').val(this.formatDate(startValue));

			//this.changeRenewal(e);

			var renewalText = jQuery('[name="custrecord_ng_rt_renewal_period"] :selected').html();

			if(renewalText != 'Custom'){
				var renewalArr = renewalText.split(" ");
				var months = renewalArr[0];
					//console.log(months);
				var	start_date = jQuery('[name="custrecord_ng_rt_start_date_hidden"]').val();
					//console.log(start_date);
				var date = new Date(start_date);
				console.log(date);


				var months = months*(1);
				date.setMonth(date.getMonth() + months);
				//console.log('after set month');
				//console.log(date);

				var date = new Date(date);
				//console.log(date);
				var resultRenewal = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
				//console.log(resultRenewal);
				jQuery('#custrecord_ng_rt_renewal_date').val(this.formatDisplayDate(resultRenewal)); 
				jQuery('#custrecord_ng_rt_renewal_date_hidden').val(resultRenewal);

				//Reminders
				//this.changeReminder(e); I had to brute for this for change start
				var reminderText = jQuery('[name="custrecord_ng_rt_reminder_period"] :selected').html();

				if(reminderText != 'Custom'){
					var reminderArr = reminderText.split(" ");
					var days = reminderArr[0];
						//console.log(days);
					var	renewal_date = jQuery('[name="custrecord_ng_rt_renewal_date_hidden"]').val();
						//console.log(renewal_date);
					var date = new Date(renewal_date);
						//console.log(date);
					var days = days*(-1);
					date.setDate(date.getDate() + days);
					date = new Date(date);
					var result = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
					jQuery('#custrecord_ng_rt_reminder_date').val(this.formatDisplayDate(result)); 
					jQuery('#custrecord_ng_rt_reminder_date_hidden').val(result);
				}
			} else {

				var reminderText = jQuery('[name="custrecord_ng_rt_reminder_period"] :selected').html();

				if(reminderText != 'Custom'){
					var reminderArr = reminderText.split(" ");
					var days = reminderArr[0];
						//console.log(days);
					var	renewal_date = jQuery('[name="custrecord_ng_rt_renewal_date_hidden"]').val();
						//console.log(renewal_date);
					var date = new Date(renewal_date);
						//console.log(date);
					var days = days*(-1);
					date.setDate(date.getDate() + days);
					date = new Date(date);
					var result = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
					jQuery('#custrecord_ng_rt_reminder_date').val(this.formatDisplayDate(result)); 
					jQuery('#custrecord_ng_rt_reminder_date_hidden').val(result);
				}

			}
			
			


		}

	,	changeReminderDate: function(e)
		{
			//var startValue = jQuery('#custrecord_ng_rt_start_date_hidden').val().split('-'); 
			var remiderPeriodCheck = jQuery('[name="custrecord_ng_rt_reminder_period"]').val();
            //console.log('remiderPeriodCheck: ' + remiderPeriodCheck);

			if (jQuery('[name="custrecord_ng_rt_reminder_date"]').is(":visible") == true) {
				
			 //console.log("Reminder Date is visible");
			 var customReminderDate = jQuery('#custrecord_ng_rt_reminder_date').val();
				 
				 jQuery('#custrecord_ng_rt_reminder_date_hidden').val(this.formatDate(customReminderDate));
				 jQuery(['name="custrecord_ng_rt_reminder_period']).val(7);

				 this.validateReminder();

            //console.log('remiderPeriodCheck: ' + remiderPeriodCheck);
			} else { 
				console.log("Reminder Date not visible"); 
			}

		}

	,	changeReminder: function(e)
		{
			var changeStart = this.$(e.target).data()['action'] == "change-start";
			var selectedIndex = !changeStart ? this.$(e.target).val() : jQuery('#custrecord_ng_rt_reminder_period').val();

			//Reminders
				//this.changeReminder(e); I had to brute for this for change start
				var reminderText = jQuery('[name="custrecord_ng_rt_reminder_period"] :selected').html();

				if(reminderText != 'Custom'){
					var reminderArr = reminderText.split(" ");
					var days = reminderArr[0];
						//console.log(days);
					var	renewal_date = jQuery('[name="custrecord_ng_rt_renewal_date_hidden"]').val();
						//console.log(renewal_date);
					var date = new Date(renewal_date);
						//console.log(date);
					var days = days*(-1);
					date.setDate(date.getDate() + days);
					date = new Date(date);
					var result = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
					jQuery('#custrecord_ng_rt_reminder_date').val(this.formatDisplayDate(result)); 
					jQuery('#custrecord_ng_rt_reminder_date_hidden').val(result);
				}
			

			this.validateReminder();

			var reminderdate = jQuery("#custrecord_ng_rt_reminder_date").val();
			//console.log('Reminder Date: ' + reminderdate);
			var checkHidden = jQuery(e.currentTarget).parent().find('[data-action="items-expander"] a i').toggleClass('icon-minus').end().find('[data-content="items-body"]').stop().is(":hidden");
			//console.log('reminderVal:' + reminderVal);
			//console.log('checkHidden' + checkHidden);
			if(selectedIndex == 7 && checkHidden == true){		
					jQuery(e.currentTarget)
					.parent().find('[data-action="items-expander"] a i').toggleClass('icon-minus').end()
				    .find('[data-content="items-body"]').stop().slideToggle();

			} else if(selectedIndex != 7 && checkHidden == false) {
					jQuery(e.currentTarget)
					.parent().find('[data-action="items-expander"] a i').toggleClass('icon-minus').end()
				    .find('[data-content="items-body"]').stop().slideToggle();
			}
		}

    ,	changeRenewalDate: function(e)
		{
			//var startValue = jQuery('#custrecord_ng_rt_start_date_hidden').val().split('-'); 
			var renewalPeriodCheck = jQuery('[name="custrecord_ng_rt_renewal_period"]').val();
            //console.log('renewalPeriodCheck: ' + renewalPeriodCheck);

			if (jQuery('[name ="custrecord_ng_rt_renewal_date"]').is(":visible") == true) { 

					//console.log("Renewal Date is visible"); 
					var customRenewalDate = jQuery('#custrecord_ng_rt_renewal_date').val();
				    
				    jQuery('#custrecord_ng_rt_renewal_date_hidden').val(this.formatDate(customRenewalDate));
				    jQuery('[name="custrecord_ng_rt_renewal_period"]').val(6);
				    this.changeReminder(e);
				    this.validateReminder();


				} else { 
					console.log("Renewal Date not visible"); 
				}

		}

	,	changeRenewal: function(e)
		{
			var changeStart = this.$(e.target).data()['action'] == "change-start";
			var selectedIndex = !changeStart ? this.$(e.target).val() : jQuery('#custrecord_ng_rt_renewal_period').val();
			//var startValue = jQuery('#custrecord_ng_rt_start_date').val().split('-'); 
			var renewalText = jQuery('[name="custrecord_ng_rt_renewal_period"] :selected').html();

			if(renewalText != 'Custom'){
				var renewalArr = renewalText.split(" ");
				var months = renewalArr[0];
					console.log(months);
				var	start_date = jQuery('[name="custrecord_ng_rt_start_date_hidden"]').val();
					console.log(start_date);
				var date = new Date(start_date);
				//console.log(date);


				var months = months*(1);
				date.setMonth(date.getMonth() + months);
				//console.log('after set month');
				//console.log(date);

				var date = new Date(date);
				//console.log(date);
				var resultRenewal = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
				console.log(resultRenewal);
				jQuery('#custrecord_ng_rt_renewal_date').val(this.formatDisplayDate(resultRenewal)); 
				jQuery('#custrecord_ng_rt_renewal_date_hidden').val(resultRenewal);

				//Reminders
				//this.changeReminder(e); I had to brute for this for change start
				var reminderText = jQuery('[name="custrecord_ng_rt_reminder_period"] :selected').html();

				if(reminderText != 'Custom'){
					var reminderArr = reminderText.split(" ");
					var days = reminderArr[0];
						//console.log(days);
					var	renewal_date = jQuery('[name="custrecord_ng_rt_renewal_date_hidden"]').val();
						//console.log(renewal_date);
					var date = new Date(renewal_date);
						//console.log(date);
					var days = days*(-1);
					date.setDate(date.getDate() + days);
					date = new Date(date);
					var result = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
					jQuery('#custrecord_ng_rt_reminder_date').val(this.formatDisplayDate(result)); 
					jQuery('#custrecord_ng_rt_reminder_date_hidden').val(result);
				}
			} else {
				var reminderText = jQuery('[name="custrecord_ng_rt_reminder_period"] :selected').html();

				if(reminderText != 'Custom'){
					var reminderArr = reminderText.split(" ");
					var days = reminderArr[0];
						//console.log(days);
					var	renewal_date = jQuery('[name="custrecord_ng_rt_renewal_date_hidden"]').val();
						//console.log(renewal_date);
					var date = new Date(renewal_date);
						//console.log(date);
					var days = days*(-1);
					date.setDate(date.getDate() + days);
					date = new Date(date);
					var result = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
					jQuery('#custrecord_ng_rt_reminder_date').val(this.formatDisplayDate(result)); 
					jQuery('#custrecord_ng_rt_reminder_date_hidden').val(result);
				}
			}
			
			
			var renewalDate = jQuery("#custrecord_ng_rt_renewal_date").val();
			//console.log('Renewal Date: ' + renewalDate);
			var checkHiddenStatus = jQuery(e.currentTarget).parent().find('[data-action="items-expander"] a i').toggleClass('icon-minus').end().find('[data-content="items-body"]').stop().is(":hidden");
			//console.log('renewalVal:' + renewalVal);
			//console.log('checkHiddenStatus:' + checkHiddenStatus);
			if(selectedIndex == 6 && checkHiddenStatus == true){		
					jQuery(e.currentTarget)
					.parent().find('[data-action="items-expander"] a i').toggleClass('icon-minus').end()
				    .find('[data-content="items-body"]').stop().slideToggle();

			} else if(selectedIndex != 6 && checkHiddenStatus == false) {
					jQuery(e.currentTarget)
					.parent().find('[data-action="items-expander"] a i').toggleClass('icon-minus').end()
				    .find('[data-content="items-body"]').stop().slideToggle();
			}

			
			this.validateReminder();

		}

		// Prevents not desired behaviour when hitting enter
	,	preventEnter: function(event)
		{
			if (event.keyCode === 13) 
			{
				event.preventDefault();
			}
		}
     //customExpander
     ,	customExpander: function(e)
		{
			//var startValue = jQuery('#custrecord_ng_rt_start_date').val().split('-'); 
			//var date = new Date(startValue[0],startValue[1],startValue[2]);
			var dateVal = "";

			var selectName = jQuery(e.currentTarget).parent().find('[data-action="items-expander"] a i').toggleClass('icon-minus').end().find('.input-case-title').stop().attr('id');
			if(selectName == 'custrecord_ng_rt_renewal_date'){
				jQuery("#custrecord_ng_rt_renewal_period").val(6);

				//jQuery('#custrecord_ng_rt_renewal_date').val(date.addDays(0));
				dateVal = jQuery('#custrecord_ng_rt_renewal_date').val();

			} else if(selectName == 'custrecord_ng_rt_reminder_date'){
				jQuery("#custrecord_ng_rt_reminder_period").val(7);
				//jQuery('#custrecord_ng_rt_renewal_date').val(date.addDays(0));
				dateVal = jQuery('#custrecord_ng_rt_renewal_date').val();
			}
			//console.log('selectName:' + selectName);
			//console.log('customExpanderDate: ' + dateVal);
		}

	,	showContent: function ()
		{
			this.options.application.getLayout().showContent(this, 'newcase', [{
				text: this.title
			,	href: '/newreminder'
			}]);
		}

	,	showSuccess: function()
		{	
			//console.log('Hey I am successful.');
			var renewal_link_name = _('Renewal Tracking #$(0)').translate(this.model.get('internalid'))
			,	new_renewal_internalid = this.model.get('internalid')
			,	renewal_link = '<a href="/reminders/' + new_renewal_internalid + '">' + renewal_link_name + '</a>'
			,	new_renewal_message = Utils.translate('Good! your <a href="/showreminder/$(0)">$(1)</a> was submitted.', new_renewal_internalid, renewal_link_name);

			this.newRenewalId = new_renewal_internalid;
			this.newRenewalMessage = new_renewal_message;
            //console.log('new_renewal_message: ' + new_renewal_message);
			Backbone.history.navigate('reminders', {trigger: true});
		}

	,   correctDates: function() {
			console.log('correctDates');
			console.log(this);
	    }

	,	formatDate: function formatDate(userDate) {
		//console.log('userDate: ' + userDate)
		  var parts = userDate.split('/');
		  //console.log(parts);
		  
		  //if (parts[0].length == 1) parts[0] = '0' + parts[0];
		  //if (parts[1].length == 1) parts[1] = '0' + parts[1];

		  //return parts[2] + '-' + parts[0] + '-' + parts[1] + 'T00:00:00.000Z';
		  //console.log('formatDate: ' + parts[2] + '-' + parts[0] + '-' + parts[1]);
		  //var dateParse =
		  var dateParse = parts[0] + '-' + parts[1] + '-' + parts[2];
		  var date = new Date(dateParse);
		  //if(jQuery(element).is(":visible") == true || )
		  return date.getFullYear() + '-' + (date.getMonth()+1) +'-' + date.getDate();
		  //return date.getFullYear() + '-' + date.getMonth() +'-' + date.getDate();
		  //return parts[2] + '-' + parts[0] + '-' + parts[1];
		}

	,	formatDisplayDate: function formatDisplayDate(dateinput) {
			var parts = dateinput.split('-');
	        //console.log('formatDisplayDate:');
	        //console.log(parts);
	        var month = parseInt(parts[1], 10);

	        if(month < 10){
	            month = '0' + month;
	        }

	        var days = parseInt(parts[2], 10);

	        if(days < 10){
	            days = '0' + days;
	        }
	        //console.log('formatDisplayDateInit');
	        //console.log(month + '/' + days + '/' + parseInt(parts[0]));

	        return parseInt(month, 10) + '/' + parseInt(days, 10) + '/' + parseInt(parts[0]); 

	    }

	,    formatDateInput: function(dateinput) {
	        var parts = dateinput.split('-');
	        return parseInt(parts[0]) + '-' + parseInt(parts[1], 10) + '-' + parseInt(parts[2], 10); 
    	}

	,   addDays: function addDays(days, dateinput) {
	        var date = new Date(dateinput);
	        var days = days*(-1);
	        date.setDate(date.getDate() + days);
	        //var dateString = date.toISOString();
	        //console.log('date edit days date');
	        //console.log(date);
	        date = new Date(date);
	        //return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
	        return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
	        //return date.getFullYear() + '-' + ('0' + (date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	    }

    ,   addMonths: function addMonths(months, dateinput) {
	        var date = new Date(dateinput);
	        date.setMonth(date.getMonth() + months);

	    	//return date.getFullYear() + '-' + date.getMonth() + '-' +  date.getDate();
	        return date.getFullYear() + '-' + (date.getMonth()+1) + '-' +  date.getDate();
	        //return date.getFullYear() + '-' + ('0' + (date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	    }

   ,    currentDate: function currentDate(dateinput) {
   	        //console.log(dateinput);
	       var date = new Date(dateinput);
	        //var dateString = dateinput.toISOString();
	        return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
	        //return date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	        //console.log('caurrent date date string: ' + dateString);
	        //return dateString.substring(0, 10);
	    }

   ,    validateReminder: function validateReminder() {
			var start_date = jQuery('[name="custrecord_ng_rt_start_date_hidden"]').val();
			var renewal_date = jQuery('[name="custrecord_ng_rt_renewal_date_hidden"]').val();
			var customReminderDate = jQuery('[name="custrecord_ng_rt_reminder_date_hidden"]').val();
			//console.log('start_date: ' + start_date);
			//console.log('renewal_date: ' + renewal_date);
			//console.log('customReminderDate: ' + customReminderDate);
			//console.log('Valiidate reminder')
			    //jQuery('[name ="custrecord_ng_rt_reminder_date"]').val();
			    //|| (new Date(customReminderDate).getTime() <= new Date(renewalDateCheck).getTime())
			if((new Date(renewal_date).getTime() < new Date(start_date).getTime())){
				var errorMessage = '<div class="global-views-message global-views-message-error alert" role="alert"> <div> Renewal Date must be greater than the start date. </div> <button class="global-views-message-button" data-action="close-message" type="button" data-dismiss="alert">×</button></div>'; 
				jQuery('[data-type="alert-placeholder"]').html(errorMessage);
				jQuery('[type="submit"]').prop('disabled', true);
			} else if((new Date(customReminderDate).getTime() < new Date(start_date).getTime())){
				var errorMessage = '<div class="global-views-message global-views-message-error alert" role="alert"> <div> Reminder Date must be greater than the start date. </div> <button class="global-views-message-button" data-action="close-message" type="button" data-dismiss="alert">×</button></div>'; 
				jQuery('[data-type="alert-placeholder"]').html(errorMessage);
				jQuery('[type="submit"]').prop('disabled', true);
			} else if((new Date(customReminderDate).getTime() > new Date(renewal_date).getTime())){
				var errorMessage = '<div class="global-views-message global-views-message-error alert" role="alert"> <div> Reminder Date must be less than the renewal date. </div> <button class="global-views-message-button" data-action="close-message" type="button" data-dismiss="alert">×</button></div>'; 
				jQuery('[data-type="alert-placeholder"]').html(errorMessage);
				jQuery('[type="submit"]').prop('disabled', true);

			} else {
				jQuery('[type="submit"]').prop('disabled', false);
				jQuery('[data-type="alert-placeholder"]').empty();
			}
		}
   

		//@method getContext @return ParagonMicro.PM_Renewal.PMRenewal.View.Context
	,	getContext: function getContext()
		{
			//@class ParagonMicro.PM_Renewal.PMRenewal.View.Context
			//this.message = this.message
			var renewals = [{ id : '1', text : '3 Months'}, { id : '2', text : '6 Months'}, { id : '3', text : '12 Months'}, { id : '4', text : '18 Months'}, { id : '5', text : '24 Months'}, { id : '6', text : 'Custom'}];

		    var renewalSelect = '';
		    for (var r = 0; r < renewals.length; r++){
		    //console.log(renewals[r]);
		    renewalSelect += '<option value="' + renewals[r].id + '">' + renewals[r].text +'</option>\n';
		    }
		    //console.log(renewalSelect);
		    //jQuery(".select-case-renewals").html(renewalSelect);

		    var reminders = [{ id : '1', text : '30 Days Prior'}, { id : '2', text : '45 Days Prior'}, { id : '3', text : '60 Days Prior'}, { id : '4', text : '90 Days Prior'}, { id : '5', text : '120 Days Prior'}, { id : '6', text : '180 Days Prior'}, { id : '7', text : 'Custom'}];

		    var remindersSelect = '';
		    for (var i = 0; i < reminders.length; i++){
		    //console.log(renewals[r]);
		    remindersSelect += '<option value="' + reminders[i].id + '">' + reminders[i].text +'</option>\n';
		    }


		    var manufacturers = this.model.get('manufacturers');
		    //console.log('manufacturers inside context on Add View');
		    //console.log(manufacturers);
		    
		    /**/

		    var today = new Date();
		    //console.log('today' + today);

		    var initialStartDateHiddenParse = this.currentDate(today);
		    console.log('initialStartDateHiddenParse: ' + initialStartDateHiddenParse);

		    var initalRenewalDateHiddenParse = this.addMonths(3, initialStartDateHiddenParse);
		    var initalReminderHiddenDateParse = this.addDays(30, initalRenewalDateHiddenParse);

		    //console.log('initalRenewalDateHiddenParse: ' + initalRenewalDateHiddenParse);

		    var initialStartDateDisplayParse = this.formatDisplayDate(initialStartDateHiddenParse);
		    var initalRenewalDisplaylDateParse = this.formatDisplayDate(initalRenewalDateHiddenParse);
		    var initalReminderDisplayDateParse = this.formatDisplayDate(initalRenewalDateHiddenParse);


		    //var AddRenewalDate = 


		   
			return {
				message: this.message
				 // @property {String} pageHeader
			   //, manufactureSelectBuild
			   //primaryContactId, primaryContactID: primaryContactId
			   , renewalSelect: renewalSelect
			   , remindersSelect: remindersSelect
			   //, startDateHidden: addStartDateParse

			   , initialStartDateHidden: initialStartDateHiddenParse
			   , initalRenewalDateHidden: initalRenewalDateHiddenParse
			   , initalReminderHiddenDate: initalReminderHiddenDateParse

			   , initialStartDateDisplay: initialStartDateDisplayParse
			   , initalRenewalDisplaylDate: initalRenewalDisplaylDateParse
			   , initalReminderDisplayDate: initalReminderDisplayDateParse

			   , pageHeader: this.page_header
			   , user: this.user
			   , primaryContatEmail: this.primary_contact_email
			   //, primaryContactId: this.primaryContactId
			   , quantity: 1
			   , application: this.application
			   , options: this.options
			   , this: this
			};
		}
	});
});