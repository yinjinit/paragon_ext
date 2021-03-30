/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('PM.My_Team.Model', ['SC.Model', 'Utils', 'Application', 'underscore', 'Configuration'], function (
  SCModel,
  Utils,
  Application,
  _,
  Configuration
) {
  'use strict';

  return SCModel.extend({
    getCust: function (id) {
      var url = nlapiResolveURL(
        'SUITELET',
        'customscript_pg_sca_cust_salesrep_detail',
        'customdeploy_pg_sca_cust_salesrep_detail',
        'external'
      );
      url += '&custId=' + id;
      var result = nlapiRequestURL(url);
      var salesRepArr = result.body;
      return {
        salesRep: salesRepArr,
      };
    },
  });
});
