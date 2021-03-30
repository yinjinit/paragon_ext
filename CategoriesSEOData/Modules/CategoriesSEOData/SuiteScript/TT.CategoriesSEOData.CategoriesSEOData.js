// TT.CategoriesSEOData.CategoriesSEOData.js
// Load all your starter dependencies in backend for your extension here
// ----------------

define('TT.CategoriesSEOData.CategoriesSEOData'
,	[        
        'Application'
	]
,	function (        
        Application
	)
{
    'use strict';
    
    Application.on('after:Category.get', function (Model, response) {
		try {

			addCategoryExtraFields(Model,response);

		}
		catch (e) {

			nlapiLogExecution('DEBUG', 'ERROR Extension', JSON.stringify(e));

		}
	});

	function addCategoryExtraFields(Model,response){

		var lookupResults = nlapiLookupField('commercecategory', response.internalid, [
			'metadescription','pagetitle','metakeywords'
		]);

		response.metadescription = lookupResults.metadescription;
		response.pagetitle = lookupResults.pagetitle;
		response.metakeywords = lookupResults.metakeywords;

    }
    
});