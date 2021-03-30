
define(
	'PMAdvancedReports.View'
,	[
		'ListHeader.View'
	,	'PMAdvancedReports.Collection'
	,	'RecordViews.View'
	,	'SC.Configuration'
	,   'Transaction.List.View'

	,	'reports_list.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'underscore'

	,	'Utils'
	]
,	function (
		ListHeader
	,	PMAdvancedReportsCollection
	,	RecordViewsView
	,	Configuration
	,   TransactionListView

	,	reports_list_tpl

	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	_
	)
{
	'use strict';
     //var renewal_list_tpl;
	// @class Quote.List.View @extends Backbone.View
	return TransactionListView.extend({

		//@property {Function} template
		template: reports_list_tpl

		//@property {String} className
	,	className: 'PMReportsModel'

		//@property {String} title
	,	title: _('View All').translate()

		//@property {String} page_header
	,	page_header: _('View All').translate()


		,	attributes: { 'class': 'PMReports' }

		,	events: {
			'click [data-action="exportCSV"]': 'exportCSV'
		,	'click [data-action="remove-renewal"]': 'remove'
		}
		//@method initialize/
		//@param {application:AplpicationSkeleton} options
		//@return {Void}

	,	initialize: function (options)
		{

			this.application = options.application;
			this.user = this.application.getUser();
			var self = this;
			this.collection = new PMAdvancedReportsCollection();
			this.collection.fetch().done(function (){
				self.render()
				console.log('after self');
		   });
			this.collection.on('reset', this.showContent, this);


		}

	,	listenCollection: function ()
		{
			this.setLoading(true);
           
			this.collection.on({
				request: _.bind(this.setLoading, this, true)
			,	reset: _.bind(this.setLoading, this, false)
			});
			
		}


	,	setLoading: function (is_loading)
		{
			
			this.isLoading = is_loading;
		}

		
	,	getSelectedMenu: function ()
		{
			return 'viewall';
		}


	,	getBreadcrumbPages: function ()
		{
			return {
				text: this.title
			,	href: '/viewall'
			};
		}



	,	getContext: function()
		{
			
			console.log('Collection');
			console.log(this.collection);
			
			return {
				
				pageHeader: this.page_header
				
			,	collection: this.collection
				
			,	collectionLength: this.collection.length
				
			,	isLoading: this.isLoading
				
			,	showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD'
				

			};
			
		}
		
	});
});