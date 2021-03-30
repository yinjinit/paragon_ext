define('PMAdvancedReports.Model', [
    'Backbone',
    'underscore'
], function PMAdvancedReportsModel(
    Backbone,
    _
) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: _.getAbsoluteUrl(getExtensionAssetsPath('services/PMAdvancedReports.Service.ss')),
        checked: function checked() {}
    });
});
