    /*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/


define(
	'PM.AdvancedReports.Model'
	, [
		  'SC.Model'
		, 'Utils'
		, 'Application'
		, 'underscore'
		, 'Configuration'
	]
	, function (
		SCModel
		, Utils
		, Application
		, _
		, Configuration
	) {
		'use strict';
	    // @class Quote.Model Defines the model used by the Quote.Service.ss service
			// @extends Transaction.Model
		return SCModel.extend({

		
		name: 'PM.AdvancedReports'
		

	
			// get columns for published reports 
		, getColumns: function(search_id){
		
			//nlapiLogExecution('DEBUG', ' In get columns  ' + search_id);
				var data = {'columns': [], 'summary': false};
				var search = nlapiLoadSearch(null, search_id);
				var columns = search.getColumns();
				//nlapiLogExecution('DEBUG', ' In get columns  ', columns);
				for (var i = 0, count = columns.length ; i < count ; i++) {
					var temp = {
						'label': columns[i].getLabel() || columns[i].getName(),
						'name': columns[i].getName(),
						'join': columns[i].getJoin() || null,
						'summary': columns[i].getSummary() || null
					};
					
					//nlapiLogExecution('DEBUG', ' name ' ,  JSON.stringify(temp));
					data.columns.push(temp);
					if (temp['summary']) data['summary'] = true;
				}
	
			//nlapiLogExecution('DEBUG', ' data returned from get columns  ' , JSON.stringify(data));
				return data;
			
		}
	
		//get published reports 
		,    getPub: function(search_id){
	
	
	
			//nlapiLogExecution('DEBUG', ' Log search id  ' +  search_id);
	
			var columns = this.getColumns(search_id);
			
			//nlapiLogExecution('DEBUG', ' Log search id  ' +  columns[0]);
			var data = [], initial_index = 0;
			
			var filter = [new nlobjSearchFilter('internalidnumber', null, 'greaterthan', initial_index)];
			//var column = [new nlobjSearchColumn('internalid', null, columns['summary'] ? 'group' : null).setSort()];
			var results = nlapiSearchRecord(null, search_id, filter, columns) || [];
			for (var i = 0, count = results.length ; i < count ; i++) {
				var temp = {};
				for (var c = 0, count_c = columns.columns.length ; c < count_c ; c++) {
					var text = results[i].getText(columns['columns'][c]['name'], columns['columns'][c]['join'], columns['columns'][c]['summary']);
					var value = results[i].getValue(columns['columns'][c]['name'], columns['columns'][c]['join'], columns['columns'][c]['summary']);
                    nlapiLogExecution('DEBUG', ' Log column name  ' +  columns['columns'][c]['name']);
                    
                    if(columns['columns'][c]['name'] == 'custcol_tracking_no'){
                        if(value){
							value = 'Tracking Number:    ' + value;
                        }
                        
                    }
					temp[columns['columns'][c]['label']] = text || value;
					//nlapiLogExecution('DEBUG', ' Log temp length  ' +  JSON.stringify(temp));
				}
				data.push(temp);
				initial_index = parseFloat(results[i].getId(), 10);
				
			}
	
			//return JSON.stringify(data);
			return data;
	
			}
	
		,	get: function (customer)
			{
				'use strict';
	
	
				//nlapiLogExecution('DEBUG','Inside get searchs ' + customer);
				// Search for Published Searches, return specific records if Contact
				// argument has been populated 
				var data = [];
				var filter = [];
					filter.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
					filter.push(new nlobjSearchFilter('custrecord_publishsearch_customer', null, 'anyof', customer));
				var column = [];
					column.push(new nlobjSearchColumn('custrecord_publishsearch_contact', null, null));
					column.push(new nlobjSearchColumn('custrecord_publishsearch_search', null, null));
				var results = nlapiSearchRecord('customrecord_publishsearch', null, filter, column) || [];
				for (var i = 0, count = results.length ; i < count ; i++) {
					var temp = {
						'name': results[i].getText('custrecord_publishsearch_search', null, null),
						'internalid': results[i].getValue('custrecord_publishsearch_search', null, null)
					};
				   data.push(temp);
				}
						
					
				
				
				return data;
	
	
	
			} 


  


});

});
