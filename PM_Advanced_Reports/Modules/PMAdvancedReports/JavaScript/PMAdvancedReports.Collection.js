
define(
	'PMAdvancedReports.Collection'
,	[	
		'PMAdvancedReports.Model'

	,	'underscore'
	,	'Backbone'
	,	'Utils'
	]
,	function (
		PMAdvancedReportsModule

	,	_
	,	Backbone
	)
{
	'use strict';

	return Backbone.Collection.extend({

		model: PMAdvancedReportsModule

	,	url: _.getAbsoluteUrl(getExtensionAssetsPath('services/PMAdvancedReports.Service.ss'))



	});
});
