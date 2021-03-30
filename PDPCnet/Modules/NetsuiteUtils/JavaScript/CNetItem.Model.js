define('CNetItem.Model'
,	[
		'Utils'
	,	'Backbone'
	,	'Backbone.Model'
	,	'Item.Model'
	,	'underscore'
	]
,	function (
		Utils
	,	Backbone
	,	BackboneModel
	,	ItemModel
	,	_
	)
{
	'use strict';
	
	return BackboneModel.extend({
  		url : _.getAbsoluteUrl(getExtensionAssetsPath('services/NetsuiteUtils.Service.ss'))
	});
})