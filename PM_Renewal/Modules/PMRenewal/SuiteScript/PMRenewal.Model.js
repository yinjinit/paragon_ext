    /*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module PMRenewal
define(
	'PMRenewal.Model'
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

		//@property {String} name
		name: 'PMRenewal'
		
	,	dummy_date: new Date(1970, 1 ,1)


	    // Retrieves all Licenses for a given user
	    //customer_id, 
	,	search: function (list_header_data)
	    {
	        'use strict';

	        var customer_id = nlapiGetUser();
	        this.filters = {};
	        if (list_header_data.from && list_header_data.to) {
			   // this.filters.date_operator = 'and';

			    list_header_data.from = list_header_data.from.split('-');
			    list_header_data.to = list_header_data.to.split('-');

			    this.filters.date = new nlobjSearchFilter(
			        'custrecord_ng_rt_start_date',
			        null,
			        'within',
			        //new Date(list_header_data.from),
			        //new Date(list_header_data.to)
			        new Date(list_header_data.from[0], list_header_data.from[1] - 1, list_header_data.from[2]),
			        new Date(list_header_data.to[0], list_header_data.to[1] - 1, list_header_data.to[2])
			    );
			} else if (list_header_data.from) {
			   // this.filters.date_from_operator = 'and';

			    list_header_data.from = list_header_data.from.split('-');

			    this.filters.date_from = new nlobjSearchFilter(
			        'custrecord_ng_rt_start_date',
			        null,
			        'onOrAfter',
			        new Date(list_header_data.from[0], list_header_data.from[1] - 1, list_header_data.from[2])
			    );
			} else if (list_header_data.to) {
			   // this.filters.date_to_operator = 'and';

			    list_header_data.to = list_header_data.to.split('-');

			    this.filters.date_to = new nlobjSearchFilter(
			        'custrecord_ng_rt_start_date',
			        null,
			        'onOrBefore',
			        new Date(list_header_data.to[0], list_header_data.to[1] - 1, list_header_data.to[2])
			    );
			}
            
			//new filter added
            var selected_filter = list_header_data.filter;
            var selected_filter_parse = selected_filter.split('-');
            var selected_filter_flag = selected_filter_parse[0];
            var primaryContact = selected_filter_parse[1];
            if(selected_filter_flag === 'mine' && primaryContact !== ""){
                this.filters.filter = new nlobjSearchFilter(
                    'custrecord_ng_rt_primary_contact',
                    null,
                    'anyof',
                    parseInt(primaryContact)
                );
			}
            /*
			if (selected_filter === 'mine') { // assuming all adds no filter and mine adds a filter
			    filters.push(new nlobjSearchFilter('customer', null, 'anyof', nlapiGetUser())); // the filter you want to add
			} 
			*/
            //end new filter added
  
	        var search = nlapiLoadSearch('customrecord_ng_renewal_tracking', 'customsearch_ng_account_renewal_tracking')
	        ,   filters = []
	        ,   columns = search.getColumns()
	        ,   selected_filter = parseInt(list_header_data.filter, 10)
	        ,   selected_companyfilter = parseInt(list_header_data.companyfilter, 10);

	      
	        this.setSortOrder(list_header_data.sort, list_header_data.order, columns);

	        //new add this.setSortOrder(list_header_data.sort, list_header_data.order, columns);

	        return this.searchHelper(_.values(this.filters), columns, list_header_data.page, selected_filter, selected_companyfilter);
	    }

	,   sortAlphaNum: function(a, b) {
		  var aA = a.replace(reA, "");
		  var bA = b.replace(reA, "");
		  if (aA === bA) {
		    var aN = parseInt(a.replace(reN, ""), 10);
		    var bN = parseInt(b.replace(reN, ""), 10);
		    return aN === bN ? 0 : aN > bN ? 1 : -1;
		  } else {
		    return aA > bA ? 1 : -1;
		  }
		}

	,   setSortOrder: function(sort, order, columns) {
		    switch (sort) {
		        case 'custrecord_ng_rt_renewal_date':
		            //columns[3].setSort(order > 0);
		            break;
                
		        case 'custrecord_ng_rt_start_date':
		            //columns[2].setSort(order > 0);
		            break;

		        case 'custrecord_ng_rt_item':
		            //columns[0].setSort(order > 0);
		            break;

		        default:
		            //columns[3].setSort(order > 0);
		    }
		}

	,	getPrimaryContactID: function (email_param, companyid_param)
		{
			'use strict';

			var searchURL = nlapiResolveURL('SUITELET','customscript_pm_primary_contact_search','customdeploy_pm_primary_contact_search', 'external');

	        var primaryContactID = nlapiRequestURL(searchURL+'&email_param='+ email_param +'&companyid_param='+ companyid_param).getBody();
	        
            //this script outputs JSON do a JSON.pars on out put
            //var primaryContactId = JSON.parse(getPrimaryContactID('ddoughty@paragonmicro.com', '11706'));
            return primaryContactID;
		}


		// Returns a Case based on a given id
	,	getManufacturer: function ()
		{
			'use strict';

			//var manufacturerSelect = nlapiRequestURL(nlapiResolveURL('SUITELET', 'customscript_ng_manufacturer_search', 'customdeploy1', true)).getBody();
			var searchURL = nlapiResolveURL('SUITELET','customscript_ng_manufacturer_search','customdeploy1',true);

	        var manufacturerSelect = nlapiRequestURL(searchURL).getBody();
	        //var manufacturerSelect = nlapiSearchRecord("customlist_manufacturer", null, [ ["isinactive","is","F"] ], [new nlobjSearchColumn("internalid", null, null), new nlobjSearchColumn("name", null, null) ] );
			//console.log(JSON.stringify(record));
					//return record;	
			return manufacturerSelect;

		}

	,	get: function (id)
		{
			'use strict';

			var search = nlapiLoadSearch('customrecord_ng_renewal_tracking', 'customsearch_ng_account_renewal_tracking')
			,	filters = [new nlobjSearchFilter('internalid', null, 'anyof', id)]
			,	columns = search.getColumns()
			,	result = this.searchHelper(filters, columns, 1, true);


			if (result.records.length >= 1)
			{
				return result.records[0];
			}
			else
			{
				throw notFoundError;
			}
		} 


	 ,   searchHelper: function (filters, columns, page, selected_filter, selected_companyfilter)
        {
            'use strict';

    /*        if (selected_filter != 0)
            {
                filters.push(new nlobjSearchFilter('custrecord_l_status', null, 'anyof', selected_filter));
            } 
            else 
            {
                filters.push(new nlobjSearchFilter('custrecord_l_status', null, 'anyof', [1,3]));
            } 
    */
            if (selected_companyfilter) filters.push(new nlobjSearchFilter('custrecord_ng_rt_company', null, 'is', selected_companyfilter));  
            else filters.push(new nlobjSearchFilter('custrecord_ng_rt_company', null, 'is', nlapiGetUser()));
            
            var self = this
            ,   result = Application.getAllSearchResults('customrecord_ng_renewal_tracking', filters, columns);

            var renewals = {};
            var manufacturersSelect = JSON.parse(this.getManufacturer());

            renewals.records = _.map(result, function (renewal_record)
            {
                var current_record_id = renewal_record.getId()
                ,   created_date = nlapiStringToDate(renewal_record.getValue('createddate'))
                ,   renewal_start_date = nlapiStringToDate(renewal_record.getValue('custrecord_ng_rt_start_date'))
                ,   renewal_date = nlapiStringToDate(renewal_record.getValue('custrecord_ng_rt_renewal_date'))
                ,   renewal_reminder_date = nlapiStringToDate(renewal_record.getValue('custrecord_ng_rt_reminder_date'))
                ,   record = {
                        internalid: current_record_id
                    ,   custrecord_ng_rt_company: {
                            id: renewal_record.getValue('custrecord_ng_rt_company')
                        ,   name: renewal_record.getText('custrecord_ng_rt_company')
                        }
                    ,   custrecord_ng_rt_company_id: renewal_record.getValue('custrecord_ng_rt_company')
                    ,   custrecord_ng_rt_company_name: renewal_record.getText('custrecord_ng_rt_company')

                    ,   custrecord_ng_rt_primary_contact: {
                            id: renewal_record.getValue('custrecord_ng_rt_primary_contact')
                        ,   name: renewal_record.getText('custrecord_ng_rt_primary_contact')
                        }
                    ,   custrecord_ng_rt_primary_contact_id: renewal_record.getValue('custrecord_ng_rt_primary_contact')
                    ,   custrecord_ng_rt_primary_contact_name: renewal_record.getText('custrecord_ng_rt_primary_contact')
                    
                    ,   custrecord_ng_rt_transaction: {
                            id: renewal_record.getValue('custrecord_ng_rt_transaction')
                        ,   name: renewal_record.getText('custrecord_ng_rt_transaction')
                        }

                    ,   custrecord_ng_rt_transaction_id: renewal_record.getValue('custrecord_ng_rt_transaction')
                    ,   custrecord_ng_rt_transaction_name: renewal_record.getText('custrecord_ng_rt_transaction')

                    ,   custrecord_ng_rt_item: renewal_record.getValue('custrecord_ng_rt_item')

                    ,   custrecord_ng_rt_item_rec: {
                            id: renewal_record.getValue('custrecord_ng_rt_item_rec')
                        ,   name: renewal_record.getText('custrecord_ng_rt_item_rec')
                        }

                    ,   custrecord_ng_rt_item_rec_id: renewal_record.getValue('custrecord_ng_rt_item_rec')
                    ,   custrecord_ng_rt_item_rec_name: renewal_record.getText('custrecord_ng_rt_item_rec')

                    ,   custrecord_ng_rt_renewal_period: {
                            id: renewal_record.getValue('custrecord_ng_rt_renewal_period')
                        ,   name: renewal_record.getText('custrecord_ng_rt_renewal_period')
                        }
                    ,   custrecord_ng_rt_renewal_period_id: renewal_record.getValue('custrecord_ng_rt_renewal_period')
                    ,   custrecord_ng_rt_renewal_period_name: renewal_record.getText('custrecord_ng_rt_renewal_period')
	
       
                    ,   custrecord_ng_rt_reminder_period: {
                            id: renewal_record.getValue('custrecord_ng_rt_reminder_period')
                        ,   name: renewal_record.getText('custrecord_ng_rt_reminder_period')
                        }
                    ,	custrecord_ng_rt_reminder_period_id: renewal_record.getValue('custrecord_ng_rt_reminder_period')
                    ,	custrecord_ng_rt_reminder_period_name: renewal_record.getText('custrecord_ng_rt_reminder_period')
                        
                    ,   custrecord_ng_rt_task: {
                            id: renewal_record.getValue('custrecord_ng_rt_task')
                        ,   name: renewal_record.getText('custrecord_ng_rt_task')
                        }

                    ,   custrecord_ng_rt_task_id: renewal_record.getValue('custrecord_ng_rt_task')
                    ,   custrecord_ng_rt_task_name: renewal_record.getText('custrecord_ng_rt_task')

                    ,   custrecord_ng_rt_manufacturer: {
                            id: renewal_record.getValue('custrecord_ng_rt_manufacturer')
                        ,   name: renewal_record.getText('custrecord_ng_rt_manufacturer')
                        }
                    ,   custrecord_ng_rt_manufacturer_id: renewal_record.getValue('custrecord_ng_rt_manufacturer')
                    ,   custrecord_ng_rt_manufacturer_name: renewal_record.getText('custrecord_ng_rt_manufacturer')
                    ,   manufacturers:   manufacturersSelect                        
                    ,   createddate: nlapiDateToString(created_date ? created_date : self.dummy_date, 'date')
                    ,   custrecord_ng_rt_start_date: nlapiDateToString(renewal_start_date ? renewal_start_date : self.dummy_date, 'date')
                    ,   custrecord_ng_rt_renewal_date: nlapiDateToString(renewal_date ? renewal_date : self.dummy_date, 'date')
                    ,   custrecord_ng_rt_reminder_date: nlapiDateToString(renewal_reminder_date ? renewal_reminder_date : self.dummy_date, 'date')
                    ,   custrecord_ng_rt_mpn: renewal_record.getValue('custrecord_ng_rt_mpn')
                    ,   custrecord_ng_rt_quantity: renewal_record.getValue('custrecord_ng_rt_quantity')
                    ,   custrecord_ng_rt_renewed: renewal_record.getValue('custrecord_ng_rt_renewed')
                    ,   custrecord_ng_rt_added_by_customer: renewal_record.getValue('custrecord_ng_rt_added_by_customer')
                    ,   custrecord_ng_rt_item_description: renewal_record.getValue('custrecord_ng_rt_item_description')
                    };

                    //console.log(JSON.stringify(record));
                    return record;
            });

            return renewals;
        }    

		// Creates a new Case record
	,	create: function (customerId, data)
		{
			'use strict';

			customerId = customerId || nlapiGet() + '';

			var newTrackingRecord = nlapiCreateRecord('customrecord_ng_renewal_tracking');


			data.custrecord_ng_rt_quantity && newTrackingRecord.setFieldValue('custrecord_ng_rt_quantity', data.custrecord_ng_rt_quantity);
			data.custrecord_ng_rt_mpn && newTrackingRecord.setFieldValue('custrecord_ng_rt_mpn', data.custrecord_ng_rt_mpn);
			data.custrecord_ng_rt_manufacturer && newTrackingRecord.setFieldValue('custrecord_ng_rt_manufacturer', data.custrecord_ng_rt_manufacturer);
			data.custrecord_ng_rt_item && newTrackingRecord.setFieldValue('custrecord_ng_rt_item', data.custrecord_ng_rt_item);
			/*
			data.custrecord_ng_rt_reminder_date && newTrackingRecord.setFieldValue('custrecord_ng_rt_reminder_date', nlapiDateToString(this.createDate(data.custrecord_ng_rt_reminder_date)));
			data.custrecord_ng_rt_renewal_date && newTrackingRecord.setFieldValue('custrecord_ng_rt_renewal_date', nlapiDateToString(this.createDate(data.custrecord_ng_rt_renewal_date)));
			data.custrecord_ng_rt_start_date && newTrackingRecord.setFieldValue('custrecord_ng_rt_start_date', nlapiDateToString(this.createDate(data.custrecord_ng_rt_start_date)));
			*/
			data.custrecord_ng_rt_reminder_date && newTrackingRecord.setFieldValue('custrecord_ng_rt_reminder_date', nlapiDateToString(this.createDate(data.custrecord_ng_rt_reminder_date_hidden)));
			data.custrecord_ng_rt_renewal_date && newTrackingRecord.setFieldValue('custrecord_ng_rt_renewal_date', nlapiDateToString(this.createDate(data.custrecord_ng_rt_renewal_date_hidden)));
			data.custrecord_ng_rt_start_date && newTrackingRecord.setFieldValue('custrecord_ng_rt_start_date', nlapiDateToString(this.createDate(data.custrecord_ng_rt_start_date_hidden)));

			data.custrecord_ng_rt_reminder_period && newTrackingRecord.setFieldValue('custrecord_ng_rt_reminder_period', data.custrecord_ng_rt_reminder_period);
			data.custrecord_ng_rt_renewal_period && newTrackingRecord.setFieldValue('custrecord_ng_rt_renewal_period', data.custrecord_ng_rt_renewal_period);
			
			customerId && newTrackingRecord.setFieldValue('custrecord_ng_rt_company', customerId);
			data.custrecord_ng_rt_primary_contact && newTrackingRecord.setFieldValue('custrecord_ng_rt_primary_contact', data.custrecord_ng_rt_primary_contact);

			newTrackingRecord.setFieldValue('custrecord_ng_rt_added_by_customer', 'T'); 
			newTrackingRecord.setFieldValue('custrecord_ng_rt_show_in_my_account', 'T'); 
			newTrackingRecord.setFieldValue('custrecord_ng_rt_renewed', data.custrecord_ng_rt_renewed); 

			newTrackingRecord.setFieldValue('custrecord_ng_rt_item_description', data.custrecord_ng_rt_item_description); 

			

			return nlapiSubmitRecord(newTrackingRecord);
		}


	    // Updates a Renewal given its id
	,   update: function (id, data)
	    {
	        'use strict';

	        if (data && id)
	        {
	            nlapiSubmitField('customrecord_ng_renewal_tracking'
	            	, id
	            	, ['custrecord_ng_rt_item', 'custrecord_ng_rt_manufacturer','custrecord_ng_rt_mpn', 'custrecord_ng_rt_item_description', 'custrecord_ng_rt_quantity', 'custrecord_ng_rt_start_date', 'custrecord_ng_rt_renewal_date', 'custrecord_ng_rt_reminder_date', 'custrecord_ng_rt_reminder_period', 'custrecord_ng_rt_renewal_period']
	            	, [data.custrecord_ng_rt_item, data.custrecord_ng_rt_manufacturer, data.custrecord_ng_rt_mpn, data.custrecord_ng_rt_item_description, data.custrecord_ng_rt_quantity, nlapiDateToString(this.createDate(data.custrecord_ng_rt_start_date_hidden)), nlapiDateToString(this.createDate(data.custrecord_ng_rt_renewal_date_hidden)), nlapiDateToString(this.createDate(data.custrecord_ng_rt_reminder_date_hidden)), data.custrecord_ng_rt_reminder_period, data.custrecord_ng_rt_renewal_period]);
	                /*
	                , ['custrecord_ng_rt_item', 'custrecord_ng_rt_manufacturer','custrecord_ng_rt_mpn', 'custrecord_ng_rt_item_description', 'custrecord_ng_rt_quantity', 'custrecord_ng_rt_start_date', 'custrecord_ng_rt_renewal_date', 'custrecord_ng_rt_reminder_date', 'custrecord_ng_rt_reminder_period', 'custrecord_ng_rt_renewal_period']
	            	, [data.custrecord_ng_rt_item, data.custrecord_ng_rt_manufacturer, data.custrecord_ng_rt_mpn, data.custrecord_ng_rt_item_description, data.custrecord_ng_rt_quantity, nlapiDateToString(this.createDate(data.custrecord_ng_rt_start_date)), nlapiDateToString(this.createDate(data.custrecord_ng_rt_renewal_date)), nlapiDateToString(this.createDate(data.custrecord_ng_rt_reminder_date)), data.custrecord_ng_rt_reminder_period, data.custrecord_ng_rt_renewal_period]);
	            	*/
	        }
	    }

	, 	remove: function (id) 
		{
			 'use strict';
			 
	     	if(id){
				var id = nlapiDeleteRecord('customrecord_ng_renewal_tracking', id);
				//console.log("Remove ID:", id);
			}

		}

	,	createDate: function(dateStr)
		{

			var dateParts = dateStr.split('-');
			console.log(dateParts)
			var month = parseInt(dateParts[1]) - 1;
			var day = parseInt(dateParts[2]);
			var year = parseInt(dateParts[0]);
			return new Date(year,month,day);
		}

	    // Sanitize html input
	,   sanitize: function (text)
	    {
	        'use strict';

	        return text ? text.replace(/<br>/g, '\n').replace(/</g, '&lt;').replace(/\>/g, '&gt;') : '';
	    }

/*
	    }  
	  
	,   setSortOrder: function (sort, order, columns) 
	    {
	        'use strict';

	        switch (sort)
	        {
	            case 'createdDate':
	                columns[7].setSort(order > 0);
	            break;

	            case 'lastMessageDate':
	                columns[8].setSort(order > 0);
	            break;

	            default:
	                columns[1].setSort(order > 0);
	        }
	    }  
*/
});

});
