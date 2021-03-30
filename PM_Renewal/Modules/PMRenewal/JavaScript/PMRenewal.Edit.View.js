// @module ParagonMicro.PM_Renewal.PMRenewal
	

define('ParagonMicro.PM_Renewal.PMRenewal.Edit.View'
,	[
		'SC.Configuration'
	,	'Transaction.Line.Views.Cell.Navigable.View'
	,	'PMRenewal.Model'
	,   'Profile.Model'

	,	'renewal_edit.tpl'

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

	,	renewal_edit_tpl
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

		template: renewal_edit_tpl

	,	className: 'PMRenewalModel'

		//@property {String} title
	,	title: _('Edit Renewal Tracker Reminder').translate()

		//@property {String} page_header
	,	page_header: _('Edit Renewal Tracker Reminder').translate()

		//@property {Object} attributes	

	,	initialize: function (options) {

			this.options = options;
			this.application = options.application;
			this.model = new PMRenewalModel({
				internalid: options.routerArguments[0]
			});

			//console.log('this.model initialize');
            //console.log(this.model);


			this.application = options.application;

			var profile_model = ProfileModel.getInstance();
			this.user = profile_model.get('internalid');
			//console.log('this.user: ' + this.user);
            
			this.model.on('save', jQuery.proxy(this, 'showSuccess'));	

		}

	,	beforeShowContent: function beforeShowContent() {
			
			return this.model.fetch({
				killerId: AjaxRequestsKiller.getKillerId()
			});
			
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
			return 'reminders';
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

	,	changeStart: function(e)
		{
			var startValue = this.formatDate(jQuery('#custrecord_ng_rt_start_date').val());
			jQuery('#custrecord_ng_rt_start_date_hidden').val(startValue);
			//jQuery('#custrecord_ng_rt_start_date_hidden').val(this.formatDateInput(startValue));

			//this.changeRenewal(e);
			var renewalText = jQuery('[name="custrecord_ng_rt_renewal_period"] :selected').html();

			if(renewalText != 'Custom'){
				var renewalArr = renewalText.split(" ");
				var months = renewalArr[0];
					//console.log(months);
				var	start_date = jQuery('[name="custrecord_ng_rt_start_date_hidden"]').val();
					//console.log(start_date);
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
		}

	,	changeReminderDate: function(e)
		{
			
			var remiderPeriodCheck = jQuery('[name="custrecord_ng_rt_reminder_period"]').val();
            //console.log('remiderPeriodCheck: ' + remiderPeriodCheck);

			if (jQuery('[name="custrecord_ng_rt_reminder_date"]').is(":visible") == true) {
				var startDate = jQuery('[name="custrecord_ng_rt_start_date_hidden"]').val();
				//custrecord_ng_rt_renewal_date_hidden"
				var renewalDateCheck = jQuery('[name="custrecord_ng_rt_renewal_date_hidden"]').val();
				//console.log('startDate: '+startDate);

			 //console.log("Reminder Date is visible");
			 var customReminderDate = jQuery('#custrecord_ng_rt_reminder_date').val();
			 console.log('change customReminderDate: '+customReminderDate);
			 
				 jQuery('#custrecord_ng_rt_reminder_date_hidden').val(this.formatDate(customReminderDate));
				 jQuery('[name="custrecord_ng_rt_reminder_period"]').val(7);

				 this.validateReminder();

			} else { 
				console.log("Reminder Date not visible"); 
			}

		}

	,	changeReminder: function(e)
		{
			var changeStart = this.$(e.target).data()['action'] == "change-start";
			var selectedIndex = !changeStart ? this.$(e.target).val() : jQuery('#custrecord_ng_rt_reminder_period').val();
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
			
			
			//console.log('changeReminder date add 30 days' + date.addDays(30));
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
            console.log('renewalPeriodCheck: ' + renewalPeriodCheck);

			if (jQuery('[name ="custrecord_ng_rt_renewal_date"]').is(":visible") == true) { 

					var customRenewalDate = jQuery('#custrecord_ng_rt_renewal_date').val();

                    //jQuery('[data-type="alert-placeholder"]').html(' ');
				    jQuery('#custrecord_ng_rt_renewal_date_hidden').val(this.formatDate(customRenewalDate));
				    jQuery('[name="custrecord_ng_rt_renewal_period"]').val(6);

					this.validateReminder();
				} else { 
					console.log("Renewal Date not visible"); 
				}
				//this.changeReminder(e);	
				
		}

	,	changeRenewal: function(e)
		{
			var changeStart = this.$(e.target).data()['action'] == "change-start";
			var selectedIndex = !changeStart ? this.$(e.target).val() : jQuery('#custrecord_ng_rt_renewal_period').val();

			var renewalText = jQuery('[name="custrecord_ng_rt_renewal_period"] :selected').html();

			if(renewalText != 'Custom'){
				var renewalArr = renewalText.split(" ");
				var months = renewalArr[0];
					console.log(months);
				var	start_date = jQuery('[name="custrecord_ng_rt_start_date_hidden"]').val();
					console.log(start_date);
				var date = new Date(start_date);
				console.log(date);


				var months = months*(1);
				date.setMonth(date.getMonth() + months);
				console.log('after set month');
				console.log(date);

				var date = new Date(date);
				console.log(date);
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
	
			//this.changeReminder(e);	
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

			var renewalDate = jQuery("#custrecord_ng_rt_renewal_date").val();
			//console.log('Renewal Date: ' + renewalDate);
			//console.log('changeReminder date add 3 Months: ' + this.addMonths(30, date));

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

			var dateVal = "";

			var selectName = jQuery(e.currentTarget).parent().find('[data-action="items-expander"] a i').toggleClass('icon-minus').end().find('.input-case-title').stop().attr('id');
			if(selectName == 'custrecord_ng_rt_renewal_date'){
				jQuery("#custrecord_ng_rt_renewal_period").val(6);

				dateVal = jQuery('#custrecord_ng_rt_renewal_date').val();

			} else if(selectName == 'custrecord_ng_rt_reminder_date'){
				jQuery("#custrecord_ng_rt_reminder_period").val(7);
				dateVal = jQuery('#custrecord_ng_rt_renewal_date').val();
			}
			//console.log('selectName:' + selectName);
			//console.log('customExpanderDate: ' + dateVal);
		}

	,	showContent: function ()
		{
			//console.log('inside show content page in edit');
			var self = this;

			var renewal_number = this.model.get('internalid');
			//console.log('renewal_number');
			//console.log(renewal_number);

			this.page_header =  _('Edit Renewal RT-$(0):').translate(renewal_number);
			this.title =_('Edit Renewal').translate();
			this.page_title = _('Edit Renewal RT-$(0):').translate(renewal_number);
			
			return Backbone.View.prototype.showContent.apply(this, arguments);
		
		}

	,	showSuccess: function()
		{	
			//console.log('Hey I am successful.');
			var renewal_link_name = _('Renewal Tracking #$(0)').translate(this.model.get('internalid'))
			,	new_renewal_internalid = this.model.get('internalid')
			,	renewal_link = '<a href="/reminders/' + new_renewal_internalid + '">' + renewal_link_name + '</a>'
			,	new_renewal_message = Utils.translate('Good! your <a href="/showreminder/$(0)">$(1)</a> was updated.', new_renewal_internalid, renewal_link_name);

			this.newRenewalId = new_renewal_internalid;
			this.newRenewalMessage = new_renewal_message;
            //console.log('new_renewal_message: ' + new_renewal_message);
			Backbone.history.navigate('reminders', {trigger: true});
		}

	,	formatDate: function formatDate(userDate) {
		  //console.log('userDate: ' + userDate)
		  var parts = userDate.split('/');
		  //console.log(parts);
		  var dateParse = parts[0] + '-' + parts[1] + '-' + parts[2];
		  var date = new Date(dateParse);
		  return date.getFullYear() + '-' + (date.getMonth()+1) +'-' + date.getDate();

		}

	,    formatDateInput: function(dateinput) {
	        var parts = dateinput.split('-');
	        //console.log('formatDateInput: ' + parts);
	        return parseInt(parts[0]) + '-' + parseInt(parts[1], 10) + '-' + parseInt(parts[2], 10); 
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

	,   addDays: function addDays(days, dateinput) {
	        var date = new Date(dateinput);
	        var days = days*(-1);
	        date.setDate(date.getDate() + days);
	        //console.log(date);
	        date = new Date(date);
	        
	        return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
	        //return date.getFullYear() + '-' + ('0' + (date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	    }

    ,   addMonths: function addMonths(months, dateinput) {
	        var date = new Date(dateinput);
	        date.setMonth(date.getMonth() + months);
	        
	        return date.getFullYear() + '-' + (date.getMonth()+1) + '-' +  date.getDate();
	        //return date.getFullYear() + '-' + ('0' + (date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	    }

   ,    currentDate: function currentDate(dateinput) {
	        var date = new Date(dateinput);
	        var date = new Date(dateinput);
	        //var dateString = dateinput.toISOString();
	        return date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	        //console.log('caurrent date date string: ' + dateString);
	    }

    ,    validateReminder: function validateReminder() {
			var start_date = jQuery('[name="custrecord_ng_rt_start_date_hidden"]').val();
			var renewal_date = jQuery('[name="custrecord_ng_rt_renewal_date_hidden"]').val();
			var customReminderDate = jQuery('[name="custrecord_ng_rt_reminder_date_hidden"]').val();
			//console.log('start_date: ' + start_date);
			//console.log('renewal_date: ' + renewal_date);
			//console.log('customReminderDate: ' + customReminderDate);
			//console.log('validate reminder');
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
			console.log('getContext');
			//@class ParagonMicro.PM_Renewal.PMRenewal.View.Context
			var renewedParsed = this.model.get('custrecord_ng_rt_renewed');
			if(renewedParsed == 'F'){
				renewedParsed = 'No';
			} else {
				renewedParsed = 'Yes';
			}

			//this.message = this.message
			var renewals = [{ id : '1', text : '3 Months'}, { id : '2', text : '6 Months'}, { id : '3', text : '12 Months'}, { id : '4', text : '18 Months'}, { id : '5', text : '24 Months'}, { id : '6', text : 'Custom'}];
			var renewalsIdFlag = this.model.get('custrecord_ng_rt_renewal_period_id');
		    var renewalSelect = '';
		    for (var r = 0; r < renewals.length; r++){
			    //console.log(renewals[r]);
			    if(renewalsIdFlag  === renewals[r].id){
			    	renewalSelect += '<option value="' + renewals[r].id + '" selected>' + renewals[r].text +'</option>\n';
			    } else {
			    	renewalSelect += '<option value="' + renewals[r].id + '">' + renewals[r].text +'</option>\n';
			    }
		    }
		    //console.log(renewalSelect);

		    var reminders = [{ id : '1', text : '30 Days Prior'}, { id : '2', text : '45 Days Prior'}, { id : '3', text : '60 Days Prior'}, { id : '4', text : '90 Days Prior'}, { id : '5', text : '120 Days Prior'}, { id : '6', text : '180 Days Prior'}, { id : '7', text : 'Custom'}];
		    var remindersIdFlag = this.model.get('custrecord_ng_rt_reminder_period_id');
		    var remindersSelect = '';
		    for (var i = 0; i < reminders.length; i++){
			    //console.log(renewals[r]);
			    if(remindersIdFlag === reminders[i].id ){
			    	remindersSelect += '<option value="' + reminders[i].id + '" selected>' + reminders[i].text +'</option>\n';
			    } else {
			    	remindersSelect += '<option value="' + reminders[i].id + '">' + reminders[i].text +'</option>\n';
			    }
		    }
            
            
            //var modelParse = this.model;
		    var manufacturersParse = this.model.get('manufacturers');
		    //console.log('manufacturersParse');
		    //console.log(manufacturersParse);
		    var manufacturerId = this.model.get('custrecord_ng_rt_manufacturer_id')
		    //console.log('manufacturers inside context on Edit View');
		    //console.log('(manufacturersParse.length: ' +  manufacturersParse.length);

		    var manufacturersTopPart = '<select name="custrecord_ng_rt_manufacturer" id="custrecord_ng_rt_manufacturer" class="form-control input-xlarge select-case-reminders case-new-form-input">';
            var manufacturersBottomPart = '</select>';
            var manufacturersSelect = '';
            //if(manufacturersParse.length > 1  && manufacturersParse.length != udefined){
		    for (var m = 0; m < manufacturersParse.length; m++){
		    //console.log(renewals[r]);
			    if(manufacturerId === manufacturersParse[m].id){
			    	manufacturersSelect += '<option value="' + manufacturersParse[m].id + '" selected>' + manufacturersParse[m].name +'</option>\n';
			    } else {
			    	manufacturersSelect += '<option value="' + manufacturersParse[m].id + '">' + manufacturersParse[m].name +'</option>\n';
				}
		    //}

		    var manufactureSelectBuild = manufacturersTopPart + manufacturersSelect + manufacturersBottomPart;
			}
			return {
				message: this.message

				,   model: this.model
				,   pageHeader: this.page_header 
				,   internalid: this.model.get('internalid')
				,	companyName: this.model.get('custrecord_ng_rt_company_name')
				,	companyID: this.model.get('custrecord_ng_rt_company_id')

				,   primaryContact: this.model.get('custrecord_ng_rt_primary_contact') 

				,   primaryContactID: this.model.get('custrecord_ng_rt_primary_contact_id')
				,   primaryContactName: this.model.get('custrecord_ng_rt_primary_contact_name')

				,	transactionID: this.model.get('custrecord_ng_rt_transaction_id')
				,	transactionName: this.model.get('custrecord_ng_rt_transaction_name')

				,	renewed: renewedParsed

				,	itemName: this.model.get('custrecord_ng_rt_item')

				,   itemRecName: this.model.get('custrecord_ng_rt_item_rec_name')

				,	quantity: this.model.get('custrecord_ng_rt_quantity')

				,	manufacturerId: this.model.get('custrecord_ng_rt_manufacturer_id')
				,	manufacturerName: this.model.get('custrecord_ng_rt_manufacturer_name')

			

				,   manufactureSelectBuild: manufactureSelectBuild

				,   renewalSelect: renewalSelect
			    ,   remindersSelect: remindersSelect

				,	mpn: this.model.get('custrecord_ng_rt_mpn')

				,	taskId: this.model.get('custrecord_ng_rt_task_id')
				,	taskName: this.model.get('custrecord_ng_rt_task_name')

				//,	renewalDate: this.model.get('custrecord_ng_rt_renewal_date')
				//,	reminderDate: this.model.get('custrecord_ng_rt_reminder_date')

				,	renewalPeriodId: this.model.get('custrecord_ng_rt_renewal_period_id')
				,	renewalPeriodName: this.model.get('custrecord_ng_rt_renewal_period_name')

                ,   reminderPeriodId:  this.model.get('custrecord_ng_rt_reminder_period_id')

				,   startDateHidden: this.formatDate(this.model.get('custrecord_ng_rt_start_date'))
				,   renewalDateHidden: this.formatDate(this.model.get('custrecord_ng_rt_renewal_date'))
				,   reminderDateHidden: this.formatDate(this.model.get('custrecord_ng_rt_reminder_date'))

				,   startDate: this.formatDisplayDate(this.formatDate(this.model.get('custrecord_ng_rt_start_date')))
				,   renewalDate: this.formatDisplayDate(this.formatDate(this.model.get('custrecord_ng_rt_renewal_date')))
				,   reminderDate: this.formatDisplayDate(this.formatDate(this.model.get('custrecord_ng_rt_reminder_date')))


				,   addedByCustomer: this.model.get('custrecord_ng_rt_added_by_customer')
				,   itemDescription: this.model.get('custrecord_ng_rt_item_description')
			};
		}
	});
});