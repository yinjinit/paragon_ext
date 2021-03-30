define('PMRenewal.Model', [
    'Backbone',
    'underscore'
], function PMRenewaltModel(
    Backbone,
    _
) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: _.getAbsoluteUrl(getExtensionAssetsPath('services/PMRenewal.Service.ss')),
        checked: function checked() {}
    });
});
