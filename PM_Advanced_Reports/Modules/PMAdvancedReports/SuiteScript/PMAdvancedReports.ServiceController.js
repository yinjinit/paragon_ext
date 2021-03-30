
define(
	'PM.PM_Advanced_Reports.PMAdvancedReports.ServiceController'
,	[
		'ServiceController',
		'PMAdvancedReports.Model'
	]
,	function(
		ServiceController,
		PMAdvancedReportsModel
	)
	{
		'use strict';

		try
		{
		   return ServiceController.extend({
   
			   name: 'PM.PM_Advanced_Reports.PMAdvancedReports.ServiceController'
   
			   // The values in this object are the validation needed for the current service.
		   ,	options: {
				   common: {
					   requireLogin: true
				   }
			   }
   
		   ,	get: function get()
			   {
   
				   var id = this.request.getParameter('internalid');
				   var customer = nlapiGetUser();
				   console.log('DEBUG', 'id from service controller ' + id);				
				   console.log('DEBUG','get customer ' +  customer)
				   
				   if(id){
					   
					   return PMAdvancedReportsModel.getPub(id);
				   }
				   else {
					   return PMAdvancedReportsModel.get(customer);
				   }
						   
						   
					   
   
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
	   } catch(e){
		   console.warn('PMReports.Service.ss' + e.name, e);
		   this.sendError(e);
	   }
   
	   }
   );