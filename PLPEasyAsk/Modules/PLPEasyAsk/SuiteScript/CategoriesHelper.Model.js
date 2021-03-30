define('CategoriesHelper.Model',[
    'SC.Model',
    'underscore'
], function(SCModel, _) {
    'use strict';


    return SCModel.extend({

        name : 'CategoriesHelperModel',

        get : function(id) {

            var record = nlapiLoadRecord('commercecategory', id);

            return record.fields;

        }

    });
});