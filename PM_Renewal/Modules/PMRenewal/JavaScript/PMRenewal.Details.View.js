
// @module ParagonMicro.PM_Renewal.Details.View
//	'ParagonMicro.PM_Renewal.PMRenewal.Details.View'
define(
	'ParagonMicro.PM_Renewal.PMRenewal.Details.View'
,	[
	//	'PMRenewal.Collection'
	//,	'RecordViews.View'
		'SC.Configuration'
	,	'Transaction.Line.Views.Cell.Navigable.View'
	,	'PMRenewal.Model'
	,   'Profile.Model'

    ,   'GlobalViews.Confirmation.View'
	,	'renewal_details.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'underscore'
	,	'AjaxRequestsKiller'

	,	'Utils'
	,	'UrlHelper'
	]
,	function (
		Configuration
	,	TransactionLineViewsCellNavigableView
	,	PMRenewalModel
	,   ProfileModel

	,   GlobalViewsConfirmationView

	,	renewal_details_tpl

	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	_
	,	AjaxRequestsKiller
	)
{
	'use strict';

	// @class ParagonMicro.PM_Renewal.PMRenewal.View @extends Backbone.View
	return Backbone.View.extend({

		template: renewal_details_tpl

	,	attributes: {
			'id': 'PMRenewalDetail'
		,	'class': 'PMRenewalDetails'
		}

		//@property {String} title
	,	title: _('RENEWAL DETAILS').translate()

	,	initialize: function (options) {
		//console.log('options inside initlize');
		//console.log(options);


			this.model = new PMRenewalModel({
				internalid: options.routerArguments[0]
			});

			console.log('this.model initialize');
            console.log(this.model);

			this.application = options.application;
			var profile_model = ProfileModel.getInstance();
			this.user = profile_model.get('internalid');
			var primary_contact_email = profile_model.get('email');
			this.primary_contact_email = profile_model.get('email');
			//console.log('profile_model');
			//console.log(profile_model);
			//console.log('this.user: ' + this.user);
			//this.collection = options.collection;
			//this.user = this.application.getUser();
			this.model.on('destroy', jQuery.proxy(this, 'showSuccess'));
		}

	,	beforeShowContent: function beforeShowContent() {

			//return jQuery.Deferred().resolve();
			return this.model.fetch({
				killerId: AjaxRequestsKiller.getKillerId()
			});
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
			};
		}

	,	events: {

		 'click [data-action="remove-renewal"]': 'deleteRenewal'
		}

	,	bindings: {
		}

	, 	childViews: {
			
		}

	,  date_diff_indays: function(date1, date2) {
		var dt1 = new Date(date1);
		var dt2 = new Date(date2);
		return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
		}

	,	showContent: function ()
		{
			var self = this;

			var renewal_number = this.model.get('internalid');
			//console.log('renewal_number');
			//console.log(renewal_number);

			this.page_header =  _('Renewal Details RT-$(0)').translate(renewal_number);
			this.title =_('Renewal Details').translate();
			this.page_title = _('Renewal Details RT-$(0)').translate(renewal_number);

			return Backbone.View.prototype.showContent.apply(this, arguments);
		}

	,	showSuccess: function()
		{	
			//console.log('Hey I am successful.');
			var new_renewal_message = _.translate('Renewal Deleted');
			this.newRenewalMessage = new_renewal_message;
            //console.log('new_renewal_message: ' + new_renewal_message);
			Backbone.history.navigate('reminders', {trigger: true});
		}

	, deleteRenewal: function(e) {
		    this.deleteConfirmationView = new GlobalViewsConfirmationView({
		        callBackParameters: {
		            target: e.target,
		            context: this
		        },
		        callBack: this.deleteRenewalHandler,
		        title: _.translate('Delete'),
		        autohide: true,
		        body: _.translate('Are you sure you want to delete this renewal?')
		    });
		    this.application.getLayout().showInModal(this.deleteConfirmationView);
		}

	,deleteRenewalHandler: function(options) {
		    var self = options.context;    

		    self.model.destroy();
	}

		// @property {ChildViews} childViews
	,	childViews: {

			'Items.Collection': function ()
			{
				console.log('Child View');
				return new BackboneCollectionView({
					collection: this.model.get('lines')
				,	childView: TransactionLineViewsCellNavigableView
				,	viewsPerRow: 1
				,	childViewOptions: {
						navigable: true

					,	detail1Title: _('Qty:').translate()
					,	detail1: 'quantity'

					,	detail2Title: _('List price:').translate()
					,	detail2: 'rate_formatted'

					,	detail3Title: _('Amount:').translate()
					,	detail3: 'total_formatted'
					}
				});
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

            var itemNameParse = '';
			if(this.model.get('custrecord_ng_rt_item_name')){ 
		       itemNameParse = this.model.get('custrecord_ng_rt_item_name')
			} else {
			   itemNameParse = this.model.get('custrecord_ng_rt_item_rec_name');
			}
           // console.log('itemNameParse: ' + this.model.get('custrecord_ng_rt_item'));

            //Delete Check
		    var addedByCustomerCheck = this.model.get('custrecord_ng_rt_added_by_customer');
		    console.log('addedByCustomerCheck: ' + addedByCustomerCheck);
		    //var deleteInternalid = this.model.get('internalid');
		    var deleteButton = '';

		    if(addedByCustomerCheck  == "T"){
		    	deleteButton = '<a class="btn btn-expanded btn-primary case-new-button-submit" data-action="remove-renewal"> DELETE </a>'; 
		    } else {
		    	deleteButton;
		    }

		    //diff dates
		    var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; 
			var yyyy = today.getFullYear();
			if(dd<10) 
			{
			    dd='0'+dd;
			} 

			if(mm<10) 
			{
			    mm='0'+mm;
			} 
            var todayParsed = mm + "/" + dd + "/" + yyyy;

            //var todayParsed = "11/29/2020"
			var renewal_date_parse = this.model.get('custrecord_ng_rt_renewal_date');
			var reminder_date_parse = this.model.get('custrecord_ng_rt_reminder_date');
		    //console.log('deleteButton: ' + deleteButton);

		    //console.log('Days to Renewal: ' + this.date_diff_indays(todayParsed, renewal_date_parse));
			//console.log('Days to Reminder: ' + this.date_diff_indays(todayParsed, reminder_date_parse));

			var days_to_renewal = this.date_diff_indays(todayParsed, renewal_date_parse);
			var days_to_reminder = this.date_diff_indays(todayParsed, reminder_date_parse);

			//var str_rewal = this.filterOptions[1].value;
			
                var days_to_renewal_check = days_to_renewal.toString().search("-");
                if(days_to_renewal_check == '-1'){
                	days_to_renewal = days_to_renewal;
                } else {
                	days_to_renewal = "The renewal date has already passed."
                }

                var days_to_reminder_check = days_to_reminder.toString().search("-");
                if(days_to_reminder_check == '-1'){
                	days_to_reminder = days_to_reminder;
                } else {
                	days_to_reminder = "The reminder date has already passed."
                }
				
            //console.log('Days to Renewal: ' + days_to_renewal);
			//console.log('Days to Reminder: ' + days_to_reminder);
			          
            var pageHeaderParse =  _('Renewal Details').translate();

			//this.message = this.message
			return {
				message: this.message


				,   model: this.model
				,   pageHeader: this.page_header 
				,   internalid: this.model.get('internalid')
				,	companyName: this.model.get('custrecord_ng_rt_company_name')
				,	companyID: this.model.get('custrecord_ng_rt_company_id')

				,	transactionID: this.model.get('custrecord_ng_rt_transaction_id')
				,	transactionName: this.model.get('custrecord_ng_rt_transaction_name')

				,	renewed: renewedParsed

				,	itemName: this.model.get('custrecord_ng_rt_item')

				,   itemRecName: this.model.get('custrecord_ng_rt_item_rec_name')



				,	quantity: this.model.get('custrecord_ng_rt_quantity')

				,	manufacturerId: this.model.get('custrecord_ng_rt_manufacturer_id')
				,	manufacturerName: this.model.get('custrecord_ng_rt_manufacturer_name')

				,   manufacturers: this.model.get('manufacturers')

				,	mpn: this.model.get('custrecord_ng_rt_mpn')

				,	taskId: this.model.get('custrecord_ng_rt_task_id')
				,	taskName: this.model.get('custrecord_ng_rt_task_name')

				,	renewalDate: this.model.get('custrecord_ng_rt_renewal_date')
				,	reminderDate: this.model.get('custrecord_ng_rt_reminder_date')

				,   days_to_renewal: days_to_renewal
				,   days_to_reminder: days_to_reminder

				,	renewalPeriodId: this.model.get('custrecord_ng_rt_renewal_period_id')
				,	renewalPeriodName: this.model.get('custrecord_ng_rt_renewal_period_name')

				,   reminderPeirodName: this.model.get('custrecord_ng_rt_reminder_period_name')

				,   startDate: this.model.get('custrecord_ng_rt_start_date')
				,   renewalDate: this.model.get('custrecord_ng_rt_renewal_date')
				,   reminderDate: this.model.get('custrecord_ng_rt_reminder_date')
				,   createdById: this.model.get('custrecord_ng_rt_primary_contact_id')
				,   addedByCustomer: this.model.get('custrecord_ng_rt_added_by_customer')
				,   itemDescription: this.model.get('custrecord_ng_rt_item_description')
				,   deleteButton: deleteButton
			    ,   userContatEmail: this.primary_contact_email

			};
		}
	});
});