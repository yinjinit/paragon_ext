// @module PM.Approval.Edit.View
define('PM.Approval.Edit.View', [
  'Backbone.View',
  'Backbone.FormView',
  'pm_approval_edit.tpl',
  'Utils',
  'underscore'
], function(
  BackboneView,
  BackboneFormView,
  approval_edit_tpl,
  Utils,
  _
) {
  'use strict';

  // @class PM.Approval.Edit.View @extends Backbone.View
  return BackboneView.extend({
    template: approval_edit_tpl,

    attributes: {class: 'product-list-new-wrapper'},

    events: {
      'submit form': 'saveForm',
      '[data-action="prevent-enter"]': 'preventEnter'
    },

    bindings: {
      '[name="custrecord_cpas_os_status"]': 'custrecord_cpas_os_status',
      '[name="custrecord_cpas_os_comments"]': 'custrecord_cpas_os_comments'
    },

    initialize: function(options) {
      this.application = options.application;
      this.parentView = options.parentView;
      this.model = options.model;
      this.isEdit = this.model.get('internalid');
      this.page_header = 'Approve Orders';
      this.inModal = options.inModal;

      //setting the role to be evaluated on Approval.Model.js
      var role;
      if (SC.published && SC.published.cpas_role) {
        role = SC.published.cpas_role;
      } else {
        role = SC.getPublishedObject('cpas_role');
      }
      this.model.set('role', role[0]);

      //seeting the contact id
      var contactid;
      if (SC.published && SC.published.contact_id) {
        contactid = SC.published.contact_id;
      } else {
        contactid = SC.getPublishedObject('contact_id');
      }
      this.model.set('contactid', contactid[0]);

      BackboneFormView.add(this);

      this.model.once('saveCompleted', _.bind(this.onSaveComplete, this));
    },

    // @method preventEnter Prevents not desired behavior when hitting enter
    preventEnter: function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
    },

    // Handles the form submit on save
    onSaveComplete: function() {

      const self = this;

      if (self.model.get('custrecord_cpas_os_status').code !== '1') {//not pending anymore - it was approved/declined
        self.parentView.collection.remove(self.model);
        self.parentView.render();
      }

    },

    // @method getContext @return {Approval.Edit.View.Context}
    getContext: function() {
      const {model} = this;

      var statusDropdown = [
        {
          code: '1',
          name: 'Pending',
          isActive: true
        },
        {
          code: '2',
          name: 'Declined',
          isActive: false
        },
        {
          code: '3',
          name: 'Approved',
          isActive: false
        }

      ];

      // @class Approval.Edit.View.Context
      return {
        // @property {Boolean} inModal
        inModal: !!this.inModal,
        // @property {String} custrecord_cpas_os_status
        custrecord_cpas_os_status: statusDropdown
      };
    }
  });
});
