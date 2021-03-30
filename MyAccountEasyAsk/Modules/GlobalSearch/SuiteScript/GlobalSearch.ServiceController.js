
define(
	'Tavano.MyAccountEasyAsk.GlobalSearch.ServiceController'
,	[
		'ServiceController',
		'EasyAskSearch.Model'
	]
,	function(
		ServiceController,
		EasyAskSearchModel
	)
	{
		'use strict';

		return ServiceController.extend({

			name: 'Tavano.MyAccountEasyAsk.GlobalSearch.ServiceController'

			// The values in this object are the validation needed for the current service.
		,	options: {
				common: {
				}
			}

		,	get: function get()
			{
				var resultsPerPage = this.request.getParameter('per_page') || 24;
				var page = this.request.getParameter('page') || 1;
				var searchTerm = this.request.getParameter('q') || null;
				var urlEncodeSeoPath = this.request.getParameter('seo_path') || null;
				var nsCategoryId = this.request.getParameter('c_id');
				
				if(this.request.getParameter('selected_filters')) {
					var filters = JSON.parse(this.request.getParameter('selected_filters'));
					EasyAskSearchModel.setFilters(filters);
				}
				
				EasyAskSearchModel.generateEasyAskEndpoint(resultsPerPage, page, searchTerm, urlEncodeSeoPath, nsCategoryId);

				var out = {
					status : 'ERROR'
				}

				try {
					var data = EasyAskSearchModel.makeAPICall();
					out.status = 'OK',
					out.data = JSON.parse(data);
					out.url = EasyAskSearchModel.currentEndpoint;
				} catch (error) {
					out.error = {
						url : EasyAskSearchModel.currentEndpoint,
						message : error.message
					}
				}
				

				return out;
			}

		,	post: function post()
			{
				// not implemented
			}

		,	put: function put()
			{
				// not implemented
			}
			
		,	delete: function()
			{
				// not implemented
			}
		});
	}
);