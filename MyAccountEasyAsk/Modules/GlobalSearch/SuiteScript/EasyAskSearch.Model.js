define('EasyAskSearch.Model',[
    'SC.Model',
    'underscore'
], function(SCModel, _) {
    'use strict';


    return SCModel.extend({
        //prod is 9203
        name : 'EasyAskSearchModel',
        easyAskEndpoint : "https://prodea.paragonmicro.com:9203/EasyAsk/apps/Advisor.jsp?dct=paragonmicro&indexed=1&oneshot=1&disp=json",
        currentEndpoint : null,
        headers_session : {
            "Content-Type": "application/json",
            "Accept":'application/json'
        },
        _selectedFilters : {},
        _filtersURL : "",
        facets : [],
        products : [],
        category : null,

        /**
         * Generates the EasyAsk endpoint for search and for paginated types of search.
         *
         * @param {number} resultsPerPage The number of results per page
         * @param {number} page The page number for paginated results
         * @param {String} searchTerm The search provided
         * @param {String} urlEncodeSeoPath No idea what this is TODO: Ask about it
         * 
         * @returns {String} Returns and set the endpoint 
         */
        generateEasyAskEndpoint : function( resultsPerPage, page, searchTerm, urlEncodeSeoPath, nsCategoryId ) {

            var url = this.easyAskEndpoint;

            nlapiLogExecution('DEBUG', '-- Easy Ask Endpoint url --', url);
            nlapiLogExecution('DEBUG', '-- Easy Ask Endpoint resultsPerPage --', resultsPerPage);
            nlapiLogExecution('DEBUG', '-- Easy Ask Endpoint page --', page);
            nlapiLogExecution('DEBUG', '-- Easy Ask Endpoint searchTerm --', searchTerm);
            nlapiLogExecution('DEBUG', '-- Easy Ask Endpoint urlEncodeSeoPath --', url);
            nlapiLogExecution('DEBUG', '-- Easy Ask Endpoint nsCategoryId --', nsCategoryId);
            
            if( searchTerm && searchTerm !== "__global__") {
                // for search on EasyAsk (from documentation)
                // Search –https://<EasyAskServer>:<EasyAskPort>/EasyAsk/apps/Advisor.jsp?dct=<dictionaryname>&disp=json&indexed=1&oneshot=1
                // &q=<query>
                // &RequestAction=advisor
                // &ResultsPerPage=32
                // &CatPath=<urlencodeseoPath>
                // &RequestData=CA_Search
                url += "&RequestAction=advisor&RequestData=CA_Search";
                //url += "&CatPath=-" + encodeURIComponent(searchTerm) + this._filtersURL;
                url += "&q=" + encodeURIComponent(searchTerm) + this._filtersURL;

                if(page) {
                    url += "&forcepage=true&currentpage=" + page; 
                }

            } else {
                // paginated (from documentation)
                // https://<EasyAskServer>:<EasyAskPort>/EasyAsk/apps/Advisor.jsp?dct=<dictionaryname>&disp=json&indexed=1&oneshot=1
                // &RequestAction=navbar
                // &ResultsPerPage=32
                // &CatPath=<seoPath>
                // &RequestData=page<pageNumber>
                //&RequestAction=advisor
                //&RequestData=CA_BreadcrumbSelect
                //url += "&RequestAction=navbar";
                //https://prodea.paragonmicro.com:9200/EasyAsk/apps/Advisor.jsp?dct=paragonmicro&indexed=1&oneshot=1&disp=json&RequestAction=navbar&RequestData=page1&ResultsPerPage=24&CatPath=Systems
                if(page > 1){     
                    url += "&RequestAction=navbar";
                } else {
                    url += "&RequestAction=advisor&RequestData=CA_BreadcrumbSelect";
                }

                if(page) {
                    url += "&RequestData=page" + page; 
                }
            }

            // --------------------------------------------------------------------------
            // add the additional common parameters
            // --------------------------------------------------------------------------
            

            if(resultsPerPage && typeof resultsPerPage === 'number') {
                url += "&ResultsPerPage=" + resultsPerPage;
            } else {
                url += "&ResultsPerPage=32";
            }


            // search for Netsuite Category to see if we have a catPath
            nlapiLogExecution('DEBUG', '-- Before Category nsCategoryId --', nsCategoryId);
            //if( nsCategoryId ) {
            if(nsCategoryId && nsCategoryId !== '1'){

                var record = nlapiLoadRecord('commercecategory', nsCategoryId);
                var catPath = record.getFieldValue('custrecord_tt_easy_ask_catpath');

                if(catPath){
                    urlEncodeSeoPath = catPath;
                }
            }

            if(urlEncodeSeoPath && nsCategoryId !== '1'){
                url += "&CatPath=" + urlEncodeSeoPath + this._filtersURL;
            }

            //new for brand
            if(nsCategoryId === '1'){
                url += "&CatPath=" + this._filtersURL;
            }

            nlapiLogExecution('DEBUG', '-- after Category url --', url);

            this.currentEndpoint = url;

            
            // --------------------------------------------------------------------------

            return url;
        },


        /**
         * Set the filters and prepare for use it in the api call.
         * @param {Object} filters 
         * @returns {String} Returns the CatPath for use in api call.
         */
        setFilters : function(filters){

            this._filtersURL = "";

            // process the filters and unify the way we will be working on
            for( var key in filters ) {

                this._filtersURL += "/";

                // if the price is a range filter
                if( key === 'Price' && filters[key]['range'] ) {

                    this._selectedFilters[key] = filters[key]['range'].split(',');
                    // get the min, max and range
                    // first validate lenght
                    if( this._selectedFilters[key].length > 2 ) {
                        var min     = decodeURIComponent(this._selectedFilters[key][0]).replace('$', '');
                        var max     = decodeURIComponent(this._selectedFilters[key][1]).replace('$', '');
                        var range   = decodeURIComponent(this._selectedFilters[key][2]).replace('$', '');
    
                        this._filtersURL += key + ":" + min + "-" + max + '-' + range + '-' + max;
                    } 
                } else {
                    this._selectedFilters[key] = filters[key].split(',');
                    var len = this._selectedFilters[key].length;    

                    for( var i = 0; i < len; i++ ) {
                        this._filtersURL += key + ":" + decodeURIComponent(this._selectedFilters[key][i]).replace(/\s/g, '-') + ";";
                    }

                    if( this._filtersURL.charAt( this._filtersURL.length - 1 ) === ";" ) {
                        // remove the last char since it is a ';'
                        this._filtersURL = this._filtersURL.slice(0, this._filtersURL.length - 1);
                    }
                }
            }

            return this._filtersURL;
        },



        /**
         * Makes the api call to easy ask to return the results in JSON format.
         * Pre-condition : Call generateEasyAskEndpoint first.
         * 
         * @returns {Object} Returns the response from the api call.
         */
        makeAPICall : function(){
            var results = nlapiRequestURL(this.currentEndpoint, null, this.headers_session, "GET").getBody();

            try {
                var data = JSON.parse(results);
            } catch(error){

            }

            return results;
        }

    });
});