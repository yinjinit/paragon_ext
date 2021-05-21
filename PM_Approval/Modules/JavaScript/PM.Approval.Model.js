// @module PM.Approval.Model
define('PM.Approval.Model', [
  'Backbone',
  'Utils',
  'underscore'
], function(
  Backbone,
  Utils,
  _
) {
  'use strict';

  // @class PM.Approval.Model @extend Backbone.Model
  return Backbone.Model.extend({
    validation: {
      custrecord_cpas_os_status: {
        required: true,
        msg: Utils.translate('Status is required')
      }
    },
    urlRoot: _.getAbsoluteUrl(
      getExtensionAssetsPath('services/PM.Approval.Service.ss'))
  });
});
