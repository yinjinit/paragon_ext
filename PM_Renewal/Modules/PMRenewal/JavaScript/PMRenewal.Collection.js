
define(
	'PMRenewal.Collection'
,	[	
		'PMRenewal.Model'

	,	'underscore'
	,	'Backbone'
	,	'Utils'
	]
,	function (
		PMRenewalModel
	,	_
	,	Backbone
	)
{
	'use strict';

	return Backbone.Collection.extend({

		model: PMRenewalModel

	,	url: _.getAbsoluteUrl(getExtensionAssetsPath('services/PMRenewal.Service.ss'))

	,	parse: function (response)
		{
			this.totalRecordsFound = response.totalRecordsFound;
			this.recordsPerPage = response.recordsPerPage;
			return response.records;
		}

	,	update: function (options)
		{
			//console.log(options);
			var range = options.range || {}
			,	from = range.from
			,	to = range.to;

			this.fetch({
				data: {
					filter: options.filter.value
				,   sort: options.sort.value
				,	order: options.order
				,	from: from || null
				,	to: to || null
				,	page: options.page
				}
			,	reset: true
			,	killerId: options.killerId
			});
		}
	});
});