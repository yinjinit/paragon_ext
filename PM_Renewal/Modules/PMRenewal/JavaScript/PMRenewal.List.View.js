
// @module ParagonMicro.PM_Renewal.PMRenewal
define(
	'ParagonMicro.PM_Renewal.PMRenewal.List.View'
,	[
		'ListHeader.View'
	,	'PMRenewal.Collection'
	,	'RecordViews.View'
	,	'SC.Configuration'
	,   'Transaction.List.View'

	,   'Profile.Model'

	,	'renewal_list.tpl'

	,	'Backbone'
	,   'Backbone.View'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'underscore'
	,	'jQuery'

	,	'Utils'
	]
,	function (
		ListHeader
	,	PMRenewalCollection
	,	RecordViewsView
	,	Configuration
	,   TransactionListView
	,   ProfileModel

	,	renewal_list_tpl

	,	Backbone
	,   BackboneView
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	_
	,   jQuery
	)
{
	'use strict';
     //var renewal_list_tpl;
	// @class Quote.List.View @extends Backbone.View
	return TransactionListView.extend({

		//@property {Function} template
		template: renewal_list_tpl

		//@property {String} className
	,	className: 'PMRenewalModel'

		//@property {String} title
	,	title: _('Renewal Reminders').translate()

		//@property {String} page_header
	,	page_header: _('Renewal Reminders').translate()

		//@property {Object} attributes

		,	attributes: { 'class': 'PMRenewal' }

		,	events: {
			'click [data-action="exportCSV"]': 'exportCSV'
		,	'click [data-action="remove-renewal"]': 'remove'
		}
		//@method initialize/
		//@param {application:AplpicationSkeleton} options
		//@return {Void}

	,	initialize: function (options)
		{
			//console.log(options);
			this.application = options.application;
			//console.log('application');

			var profile_model = ProfileModel.getInstance();
			var companyid_param = profile_model.get('internalid');
			var primary_contact_email = profile_model.get('email');
			this.primary_contact_email = profile_model.get('email');
			//console.log('this.primary_contact_email '+ this.primary_contact_email);
			//console.log('profile_model');
			//console.log(profile_model);
			//console.log('this.user: ' + this.user);
			//this.collection = options.collection;	
			//console.log(this.collection);		
			//this.type = options.type;
			this.user = this.application.getUser();
			//console.log('user ininatlize list view');
			//console.log(this.user);

			this.collection = new PMRenewalCollection();
			this.collection.on('reset', this.showContent, this);
			this.listenCollection();

			var today = new Date()
			,	isoDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

			//console.log('rangeFilterOptions');
			//console.log(this.rangeFilterOptions);

			var data = {
                email_param: primary_contact_email,
                companyid_param: companyid_param 
                };

                var  primaryContactId = this.getPrimaryContact(primary_contact_email, companyid_param);
                //console.log('AJAX primaryContactId');
                //console.log(JSON.parse(primaryContactId));
                var primaryContactParse = JSON.parse(primaryContactId);
                primaryContactId = primaryContactParse[0].id;

                //console.log('outside primaryContactId: ' + primaryContactId);
			    //console.log('this.custrecord_ng_rt_primary_contact ' + this.custrecord_ng_rt_primary_contact);
			    //console.log('this.filterOptions nside initalize');
			    console.log('this.filterOptions');
			    console.log(this.filterOptions);

			    //console.log(this.filterOptions[1].value);
			    //this checks if mine option has already been set
			    var str = this.filterOptions[1].value;
                var n = str.search("-");
                if(n == '-1'){
					    var myReminders = this.filterOptions[1].value + '-' + primaryContactId;
		                console.log('myReminders: ' + myReminders); 
					    this.filterOptions[1].value = myReminders;
			    	}
			    console.log('this.filterOptions');
			    console.log(this.filterOptions);

			    //console.log(this.filterOptions[1].itemValue);
			this.listHeader = new ListHeader({
				view: this
			,	application: this.application
			,	collection: this.collection
			,	filters: this.filterOptions
			,	sorts: this.sortOptions
			,	rangeFilter: 'date'
			,	rangeFilterLabel: _('From').translate()
			});
			console.log('listHeader');
			console.log(this.listHeader);

		}
	, render: function() {
		//console.log('render');
		//this.beforeShowContent();
	    BackboneView.prototype.render.apply(this, arguments);

	    if (!_.isUndefined(this.inform_new_renewal)) {
	        this.informNewCaseCreation();

	        if (!this.isLoading) {
	            delete this.inform_new_renewal;
	        }
	    }
	}

	, informNewCaseCreation: function() {
	    this.highlightNewCase(this.new_renewal_internalid);
	    //this.showConfirmationMessage(this.new_renewal_message, true);
	    this.showConfirmationMessage(this.new_renewal_message);
	}

	, highlightNewCase: function(internalid) {
    var $list_dom = jQuery(this.el).find('a[data-id=' + internalid + ']');
        
	    if ($list_dom && $list_dom.length === 1) {
	        $list_dom.addClass('case-list-new-case-highlight');

	        setTimeout(function() {
	            $list_dom.removeClass('case-list-new-case-highlight');
	        }, 3000);

	    }
	}

	,  beforeShowContent: function() {

		//console.log('list page - beforeShowContent');
		var self =  this;
		if(self.application.getLayout().currentView){
		    var new_renewal_id = self.application.getLayout().currentView.newRenewalId;
		    var new_renewal_message = self.application.getLayout().currentView.newRenewalMessage;
		    if (!(_.isUndefined(new_renewal_message) && _.isUndefined(new_renewal_id))) {
		        self.new_renewal_message = new_renewal_message;
		        self.new_renewal_internalid = new_renewal_id;
		        self.inform_new_renewal = true;
		        delete self.application.getLayout().currentView.newRenewalId;
		        delete self.application.getLayout().currentView.newRenewalMessage;
	   }
	}
	    return jQuery.Deferred().resolve();
	}

	,   getPrimaryContact: function(primary_contact_email, companyid_param)
	    {
	         var result = null;
	         var scriptUrl = "/app/site/hosting/scriptlet.nl?script=611&deploy=1&email_param=" + primary_contact_email + "&companyid_param=" + companyid_param;
	         jQuery.ajax({
	            url: scriptUrl,
	            type: 'get',
	            dataType: 'html',
	            async: false,
	            success: function(data) {
	                result = data;
	            } 
	         });
	         return result;
	       }

		//@method listenCollection Attaches to the current collection events request and reset to indicate if it is loading data or not
		//@return {Void}
	,	listenCollection: function ()
		{
			this.setLoading(true);
           
			this.collection.on({
				request: _.bind(this.setLoading, this, true)
			,	reset: _.bind(this.setLoading, this, false)
			});
			
		}

		//@method setupListHeader Initialize the list header component
		//@return {Void}
	,	setupListHeader: function ()
		{
			// manges sorting and filtering of the collection
			this.listHeader = new ListHeaderView({
				view: this
			,	application: this.application
			,	collection: this.collection
			,	filters: this.filterOptions
			,	sorts: this.sortOptions
			,   allowEmptyBoundaries: true
			});

			console.log('this.listHeader');
			console.log(this.listHeader);
		}

		//@method setLoading Set the loading status of the current view
		//@param {Boolean} is_loading
		//@return {Void}
	,	setLoading: function (is_loading)
		{
			//@property {Boolean} isLoading
			this.isLoading = is_loading;
		}
         

         //console.log();
		//@property {Array<ListHeader.View.FilterOption>} filterOptions
	,	filterOptions: [
			{
				value: 'all'
			,	name: _('Show all reminders').translate()
			//,	selected: true
			}

		,	{
				value: 'mine' //+ '-' + this.primaryContactId
			,	name: _('Show my reminders').translate()
			,	selected: true
			//,   primaryContact: 'Hello' //this.primary_contact_email
			}
		]

		//@property {Array<ListHeader.View.SortOption>} sortOptions
	,	sortOptions: [
			{
				value: 'custrecord_ng_rt_renewal_date'
			,	name: _('by Renewal Date').translate()
			,	selected: true
			}
		,	{
				value: 'custrecord_ng_rt_start_date'
			,	name: _('by Start Date').translate()
			}
		,	{
				value: 'custrecord_ng_rt_item'
			,	name: _('by Renewal Name').translate()
			}
		]
		//custrecord_ng_rt_item_rec_name value: 'custrecord_ng_rt_item'
		//@method getSelectedMenu Indicates what my account menu is selected when this view is being rendered
		//@return {String}
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

		//@property {ChildViews} childViews
	,	childViews: {
			'PMRenewal.List.Items': function ()
			{
				return this._resultsView;
			}
		,	'List.Header': function ()
			{
				return this.listHeader;
			}
		}

		, _buildResultsView: function () {
			var self = this;
			console.log('self _buildResultsView');
			console.log(self);
			
			
			var records_collection = new Backbone.Collection(this.collection.map(function (renewal) {
				
				var renewal_internalid = renewal.get('internalid');
				var selectedColumns = [];

				   // selectedColumns.push({label:'Qty', type:'request-date', name:'custrecord_ng_rt_quantity', id:'custrecord_ng_rt_quantity'});
					selectedColumns.push({label:'Description', type:'currency', name:'custrecord_ng_rt_item_description', id:'custrecord_ng_rt_item_description'});
					selectedColumns.push({label:'Start Date', type:'start-date', name:'start-date', id:'custrecord_ng_rt_start_date', id:'custrecord_ng_rt_start_date'});

					selectedColumns.push({label:'Renewal Date', type:'renewal-date', name:'renewal-date', id:'custrecord_ng_rt_renewal_date', id:'custrecord_ng_rt_renewal_date'});
					selectedColumns.push({label:'Renewal Period', type:'renewal-period', name:'renewal-period', id:'custrecord_ng_rt_renewal_period_name'});
					//selectedColumns.push({label:'Start date:', type:'satrt-date', name:'start-date', id:'custrecord_ng_rt_start_date', id:'custrecord_ng_rt_start_date'});
					
				return new Backbone.Model({
					touchpoint: 'customercenter'
					//, title: _('Renewal #$(0)').translate(renewal.get('custrecord_ng_rt_item'))

					, title: _('$(0)').translate(renewal.get('custrecord_ng_rt_item'))
					, detailsURL: '#showreminder/' + renewal.get('internalid')
					//, detailsURL: '#showreminder/' + renewal.get('internalid')
					, id: renewal_internalid 
					, internalid: renewal_internalid 

					, columns: self._buildColumns(selectedColumns, renewal)
				});
			}));
            
			return new BackboneCollectionView({
				childView: RecordViewsView
				, collection: records_collection
				, viewsPerRow: 1
			});
						
		}
    
  

		// @method getContext
		// @return {Quote.List.View.Context}
	,	getContext: function()
		{
			this._resultsView = this._buildResultsView();
			var columns = [];
			if (this._resultsView.collection.length > 0)
			{
				columns = this._resultsView.collection.at(0).get('columns');

				//console.log(columns);
			}
			// @class Quote.List.View.Context
			return {
				// @property {String} pageHeader
				pageHeader: this.page_header
				// @property {Array} collection
			,	collection: this.collection
				// @property {Boolean} collectionLength
			,	collectionLength: this.collection.length
				// @property {Boolean} isLoading
			,	isLoading: this.isLoading
				//@property {Boolean} showBackToAccount
			,	showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD'
				//@property {Array<{}>} columns
			, columns: columns
			};
			// @class Quote.List.View
		}
		
	});
});