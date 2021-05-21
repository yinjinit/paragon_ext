
define(
	'PM.Renewal.Collection'
,	[
    'PM.Renewal.Model'

	, 'underscore'
	, 'Backbone'
	, 'Utils'
	]
,	function (
		RenewalModel
	,	_
	,	Backbone
	)
{
	'use strict';

	return Backbone.Collection.extend({

		model: RenewalModel

	,	url: _.getAbsoluteUrl(getExtensionAssetsPath('services/PM.Renewal.Service.ss'))

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