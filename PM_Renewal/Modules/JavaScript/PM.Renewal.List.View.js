// @module PM.Renewal
define('PM.Renewal.List.View', [
  'ListHeader.View',
  'PM.Renewal.Collection',
  'RecordViews.View',
  'SC.Configuration',
  'Transaction.List.View',
  'Profile.Model',
  'renewal_list.tpl',
  'Backbone',
  'Backbone.View',
  'Backbone.CompositeView',
  'Backbone.CollectionView',
  'underscore',
  'jQuery', 'Utils'
], function(
  ListHeader,
  RenewalCollection,
  RecordViewsView,
  Configuration,
  TransactionListView,
  ProfileModel,
  renewal_list_tpl,
  Backbone,
  BackboneView,
  BackboneCompositeView,
  BackboneCollectionView,
  _,
  jQuery
) {
  'use strict';
  //var renewal_list_tpl;
  // @class Quote.List.View @extends Backbone.View
  return TransactionListView.extend({

    //@property {Function} template
    template: renewal_list_tpl

    //@property {String} className
    , className: 'PM.RenewalModel'

    //@property {String} title
    , title: _('Renewal Reminders').translate()

    //@property {String} page_header
    , page_header: _('Renewal Reminders').translate()

    //@property {Object} attributes

    , attributes: {'class': 'PM.Renewal'}

    , events: {
      'click [data-action="exportCSV"]': 'exportCSV'
      , 'click [data-action="remove-renewal"]': 'remove'
    }
    //@method initialize/
    //@param {application:AplpicationSkeleton} options
    //@return {Void}

    , initialize: function(options) {
      //console.log(options);
      this.application = options.application;
      //console.log('application');

      var profile_model = ProfileModel.getInstance();
      var companyid_param = profile_model.get('internalid');
      var primary_contact_email = profile_model.get('email');
      this.primary_contact_email = profile_model.get('email');
      this.user = this.application.getUser();

      this.collection = new RenewalCollection();
      this.collection.on('reset', this.showContent, this);
      this.listenCollection();

      var primaryContactId = this.getPrimaryContact(primary_contact_email,
        companyid_param);

      var primaryContactParse = JSON.parse(primaryContactId);
      primaryContactId = primaryContactParse[0].id;

      //this checks if mine option has already been set
      var str = this.filterOptions[1].value;
      var n = str.search('-');
      if (n === -1) {
        this.filterOptions[1].value = this.filterOptions[1].value + '-' +
          primaryContactId;
      }

      this.listHeader = new ListHeader({
        view: this
        , application: this.application
        , collection: this.collection
        , filters: this.filterOptions
        , sorts: this.sortOptions
        , rangeFilter: 'date'
        , rangeFilterLabel: _('From').translate()
      });

      //console.log('listHeader');
      //console.log(this.listHeader);

    }
    , render: function() {
      //console.log('render');
      //this.beforeShowContent();
      BackboneView.prototype.render.apply(this, arguments);

      if (!_.isUndefined(this.inform_new_renewal)) {
        this.informNewCaseCreation();

        if (!this.isLoading) {
          delete this.inform_new_renewal;
        }
      }
    }

    , informNewCaseCreation: function() {
      this.highlightNewCase(this.new_renewal_internalid);
      //this.showConfirmationMessage(this.new_renewal_message, true);
      this.showConfirmationMessage(this.new_renewal_message);
    }

    , highlightNewCase: function(internalid) {
      var $list_dom = jQuery(this.el).find('a[data-id=' + internalid + ']');

      if ($list_dom && $list_dom.length === 1) {
        $list_dom.addClass('case-list-new-case-highlight');

        setTimeout(function() {
          $list_dom.removeClass('case-list-new-case-highlight');
        }, 3000);

      }
    }

    , beforeShowContent: function() {

      //console.log('list page - beforeShowContent');
      var self = this;
      if (self.application.getLayout().currentView) {
        var new_renewal_id = self.application.getLayout().currentView.newRenewalId;
        var new_renewal_message = self.application.getLayout().currentView.newRenewalMessage;
        if (!(
          _.isUndefined(new_renewal_message) && _.isUndefined(new_renewal_id)
        )) {
          self.new_renewal_message = new_renewal_message;
          self.new_renewal_internalid = new_renewal_id;
          self.inform_new_renewal = true;
          delete self.application.getLayout().currentView.newRenewalId;
          delete self.application.getLayout().currentView.newRenewalMessage;
        }
      }
      return jQuery.Deferred().resolve();
    }

    , getPrimaryContact: function(primary_contact_email, companyid_param) {
      var result = null;
      var scriptUrl = '/app/site/hosting/scriptlet.nl?script=611&deploy=1&email_param=' +
        primary_contact_email + '&companyid_param=' + companyid_param;
      jQuery.ajax({
        url: scriptUrl,
        type: 'get',
        dataType: 'html',
        async: false,
        success: function(data) {
          result = data;
        }
      });
      return result;
    }

    //@method listenCollection Attaches to the current collection events request and reset to indicate if it is loading data or not
    //@return {Void}
    , listenCollection: function() {
      this.setLoading(true);

      this.collection.on({
        request: _.bind(this.setLoading, this, true)
        , reset: _.bind(this.setLoading, this, false)
      });

    }

    //@method setupListHeader Initialize the list header component
    //@return {Void}
    , setupListHeader: function() {
      //console.log(' setupListHeader this.sortOptions');
      //console.log(this.sortOptions);
      // manges sorting and filtering of the collection
      this.listHeader = new ListHeaderView({
        view: this
        , application: this.application
        , collection: this.collection
        , filters: this.filterOptions
        , sorts: this.sortOptions
        , allowEmptyBoundaries: true
      });
    }

    //@method setLoading Set the loading status of the current view
    //@param {Boolean} is_loading
    //@return {Void}
    , setLoading: function(is_loading) {
      //@property {Boolean} isLoading
      this.isLoading = is_loading;
    }


    //console.log();
    //@property {Array<ListHeader.View.FilterOption>} filterOptions
    , filterOptions: [
      {
        value: 'all'
        , name: _('Show all reminders').translate()
        //,	selected: true
      }

      , {
        value: 'mine' //+ '-' + this.primaryContactId
        , name: _('Show my reminders').translate()
        , selected: true
        //,   primaryContact: 'Hello' //this.primary_contact_email
      }
    ]

    //@property {Array<ListHeader.View.SortOption>} sortOptions
    , sortOptions: [
      {
        value: 'custrecord_ng_rt_renewal_date'
        , name: _('by Renewal Date').translate()
        , selected: true
      }
      , {
        value: 'custrecord_ng_rt_start_date'
        , name: _('by Start Date').translate()
      }
      , {
        value: 'custrecord_ng_rt_item'
        , name: _('by Item').translate()
      }
    ]
    //custrecord_ng_rt_item_rec_name value: 'custrecord_ng_rt_item'
    //@method getSelectedMenu Indicates what my account menu is selected when this view is being rendered
    //@return {String}
    , getSelectedMenu: function() {
      return 'reminders';
    }

    //@method getBreadcrumbPages
    //@return {BreadcrumbPage}
    , getBreadcrumbPages: function() {
      return {
        text: this.title
        , href: '/renwals'
      };
    }

    //@property {ChildViews} childViews
    , childViews: {
      'PM.Renewal.List.Items': function() {
        return this._resultsView;
      }
      , 'List.Header': function() {
        return this.listHeader;
      }
    }

    , _buildResultsView: function() {
      var self = this;

      var records_collection = new Backbone.Collection(
        this.collection.map(function(renewal) {

          var renewal_internalid = renewal.get('internalid');
          var selectedColumns = [];

          //selectedColumns.push({label:'Qty', type:'request-date', name:'custrecord_ng_rt_quantity', id:'custrecord_ng_rt_quantity'});
          selectedColumns.push({
            label: 'Description',
            type: 'currency',
            name: 'custrecord_ng_rt_item_description',
            id: 'custrecord_ng_rt_item_description'
          });
          selectedColumns.push({
            label: 'Start Date',
            type: 'start-date',
            name: 'start-date',
            id: 'custrecord_ng_rt_start_date'
          });

          selectedColumns.push({
            label: 'Renewal Date',
            type: 'renewal-date',
            name: 'renewal-date',
            id: 'custrecord_ng_rt_renewal_date'
          });
          selectedColumns.push({
            label: 'Renewal Period',
            type: 'renewal-period',
            name: 'renewal-period',
            id: 'custrecord_ng_rt_renewal_period_name'
          });
          //selectedColumns.push({label:'Start date:', type:'satrt-date', name:'start-date', id:'custrecord_ng_rt_start_date', id:'custrecord_ng_rt_start_date'});

          return new Backbone.Model({
            touchpoint: 'customercenter'
            //, title: _('Renewal #$(0)').translate(renewal.get('custrecord_ng_rt_item'))

            , title: _('$(0)').translate(renewal.get('custrecord_ng_rt_item'))
            , detailsURL: '#showreminder/' + renewal.get('internalid')
            //, detailsURL: '#showreminder/' + renewal.get('internalid')
            , id: renewal_internalid
            , internalid: renewal_internalid

            , columns: self._buildColumns(selectedColumns, renewal)
          });
        }));

      return new BackboneCollectionView({
        childView: RecordViewsView
        , collection: records_collection
        , viewsPerRow: 1
      });

    }



    // @method getContext
    // @return {Quote.List.View.Context}
    , getContext: function() {

      function convertDate(d) {
        var element = jQuery(d);
        var dsplit = element[2].innerHTML;
        //find out the number
        dsplit = dsplit.split('/');
        var month = dsplit[0];
        var day = dsplit[1];
        var year = dsplit[2];
        if (day.length === 1) {
          day = '0' + day;
        }
        if (month.length === 1) {
          month = '0' + month;
        }

        return new Date(month + '/' + day + '/' + year);
      }

      function sortByDate(colnum, direction) {
        colnum = parseInt(colnum);

        var tbody = document.querySelector('tbody');

        // get trs as array for ease of use
        var rows = [].slice.call(tbody.querySelectorAll('tr'));
        if (rows.length > 0) {
          rows.sort(function(a, b) {
            //inverse
            if (direction === 'asc') {
              return convertDate(a.cells[colnum].innerHTML) -
                convertDate(b.cells[colnum].innerHTML);
            }
            if (direction === 'desc') {
              return convertDate(b.cells[colnum].innerHTML) -
                convertDate(a.cells[colnum].innerHTML);
            }

          });
          //console.log(rows);
          rows.forEach(function(v) {
            //console.log(v)
            tbody.appendChild(v); // note that .appendChild() *moves* elements
          });
        }
      }

      //sortByDate('3', 'asc');
      //sortByDate('3', desc');

      //sorts title
      function sortTable(direction) {
        var table, rows, switching, i, x, y, x_text, y_text, shouldSwitch;
        //table = document.getElementById("myTable");
        table = document.querySelector('.quote-list-quotes-table');
        if (table.rows.length > 0) {
          switching = true;

          /*Make a loop that will continue until
          no switching has been done:*/
          while (switching) {
            //start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            /*Loop through all table rows (except the
            first, which contains table headers):*/
            for (i = 1; i < (
              rows.length - 1
            ); i++) {
              //start by saying there should be no switching:
              shouldSwitch = false;
              /*Get the two elements you want to compare,
              one from current row and one from the next:*/
              x = rows[i].getElementsByTagName('TD')[0];
              y = rows[i + 1].getElementsByTagName('TD')[0];
              x_text = jQuery(x);
              y_text = jQuery(y);

              if (direction === 'asc' || direction === '') {
                if (x_text.text().toLowerCase() >
                  y_text.text().toLowerCase()) {
                  //if so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  break;
                }
              }
              if (direction === 'desc') {
                if (x_text.text().toLowerCase() <
                  y_text.text().toLowerCase()) {
                  //if so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  break;
                }
              }
            }
            if (shouldSwitch) {
              /*If a switch has been marked, make the switch
              and mark that a switch has been done:*/
              rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
              switching = true;
            }
          }
        }
      }

      //sortTable('asc');
      //sortTable('desc');

      //sortByDate('3');
      jQuery(document).ready(function() {

        jQuery('a.recordviews-title-anchor').each(function() {
          var title_text = jQuery(this).text();
          var data_id = jQuery(this).data('id');
          //console.log(title_text);
          //console.log(data_id);
          if (title_text) {
            title_text = title_text.replace(/&amp;/ig, '&');
            jQuery('[data-id="' + data_id + '"]').html(title_text);

          }
        });

        var rt_sort_list = jQuery(
          '[name="sort"].list-header-view-accordion-body-select')
          .children('option:selected')
          .val();
        var button_sort_up = jQuery(
          '.list-header-view-accordion-body-button-sort-up')
          .hasClass('listheader-filter-sortorder-arrow-selected');
        var button_sort_down = jQuery(
          '.list-header-view-accordion-body-button-sort-down')
          .hasClass('listheader-filter-sortorder-arrow-selected');

        //console.log('rt_sort_list: ' + rt_sort_list);
        if (button_sort_up === true) {
          if (rt_sort_list === 'custrecord_ng_rt_start_date') {
            sortByDate('2', 'desc');
          }

          if (rt_sort_list === 'custrecord_ng_rt_renewal_date') {
            sortByDate('3', 'desc');
          }

          if (rt_sort_list === 'custrecord_ng_rt_item') {
            //sortByDate('2');
            sortTable('asc');

          }
        }

        if (button_sort_down === true) {
          if (rt_sort_list === 'custrecord_ng_rt_start_date') {
            sortByDate('2', 'asc');
          }

          if (rt_sort_list === 'custrecord_ng_rt_renewal_date') {
            sortByDate('3', 'asc');
          }

          if (rt_sort_list === 'custrecord_ng_rt_item') {
            sortTable('desc');
          }
        }

        jQuery('[name="sort"].list-header-view-accordion-body-select')
          .on('change',
            '[name="sort"].list-header-view-accordion-body-select',
            function() {
              //e.preventDefault();
              //e.stopPropagation();
              //var rt_sort_list = jQuery(this).children("option:selected").val();
              var rt_sort_list = jQuery(
                '[name="sort"].list-header-view-accordion-body-select')
                .children('option:selected')
                .val();
              var button_sort_up = jQuery(
                '.list-header-view-accordion-body-button-sort-up')
                .hasClass('listheader-filter-sortorder-arrow-selected');
              var button_sort_down = jQuery(
                '.list-header-view-accordion-body-button-sort-down')
                .hasClass('listheader-filter-sortorder-arrow-selected');
              //console.log('button_sort_up:   '+ button_sort_up);
              //console.log('button_sort_down:   '+ button_sort_down);
              //console.log('rt_sort_list: ' + rt_sort_list);
              if (button_sort_up === true) {
                if (rt_sort_list === 'custrecord_ng_rt_start_date') {
                  sortByDate('2', 'desc');
                }

                if (rt_sort_list === 'custrecord_ng_rt_renewal_date') {
                  sortByDate('3', 'desc');
                }

                if (rt_sort_list === 'custrecord_ng_rt_item') {
                  //sortByDate('2');
                  sortTable('asc');

                }
              }

              if (button_sort_down === true) {
                if (rt_sort_list === 'custrecord_ng_rt_start_date') {
                  sortByDate('2', 'asc');
                }

                if (rt_sort_list === 'custrecord_ng_rt_renewal_date') {
                  sortByDate('3', 'asc');
                }

                if (rt_sort_list === 'custrecord_ng_rt_item') {
                  sortTable('desc');
                }
              }

              jQuery('[name="sort"].list-header-view-accordion-body-select')
                .blur();

              return false;

            });

        jQuery(
          '[data-action="toggle-sort"].list-header-view-accordion-body-button-sort')
          .on('click tap', '.list-header-view-accordion-body-button-sort',
            function() {

              jQuery(
                '[data-action="toggle-sort"].list-header-view-accordion-body-button-sort')
                .focus();

              var button_sort_up = jQuery(
                '.list-header-view-accordion-body-button-sort-up')
                .hasClass('listheader-filter-sortorder-arrow-selected');
              var button_sort_down = jQuery(
                '.list-header-view-accordion-body-button-sort-down')
                .hasClass('listheader-filter-sortorder-arrow-selected');
              var rt_sort_list = jQuery(
                '[name="sort"].list-header-view-accordion-body-select')
                .children('option:selected')
                .val();
              //console.log('button_sort_up:   '+ button_sort_up);
              //console.log('button_sort_down:   '+ button_sort_down);
              //console.log('rt_sort_list: ' + rt_sort_list);

              if (button_sort_up === true) {

                //console.log('rt_sort_list: ' + rt_sort_list);
                if (rt_sort_list === 'custrecord_ng_rt_start_date') {
                  sortByDate('2', 'desc');
                }

                if (rt_sort_list === 'custrecord_ng_rt_renewal_date') {
                  sortByDate('3', 'desc');
                }

                if (rt_sort_list === 'custrecord_ng_rt_item') {
                  sortTable('asc');
                }
                jQuery(
                  '.list-header-view-accordion-body-button-sort .list-header-view-accordion-body-button-sort-up')
                  .removeClass('listheader-filter-sortorder-arrow-selected');
                jQuery(
                  '.list-header-view-accordion-body-button-sort .list-header-view-accordion-body-button-sort-down')
                  .addClass('listheader-filter-sortorder-arrow-selected');
              }

              if (button_sort_down === true) {
                //jQuery('.list-header-view-accordion-body-button-sort-down').removeClass('listheader-filter-sortorder-arrow-selected');

                //console.log('rt_sort_list: ' + rt_sort_list);
                if (rt_sort_list === 'custrecord_ng_rt_start_date') {
                  sortByDate('2', 'asc');
                }

                if (rt_sort_list === 'custrecord_ng_rt_renewal_date') {
                  sortByDate('3', 'asc');
                }

                if (rt_sort_list === 'custrecord_ng_rt_item') {
                  sortTable('desc');
                }

                jQuery(
                  '.list-header-view-accordion-body-button-sort .list-header-view-accordion-body-button-sort-down')
                  .removeClass('listheader-filter-sortorder-arrow-selected');
                jQuery(
                  '.list-header-view-accordion-body-button-sort .list-header-view-accordion-body-button-sort-up')
                  .addClass('listheader-filter-sortorder-arrow-selected');

              }

              jQuery(
                '[data-action="toggle-sort"].list-header-view-accordion-body-button-sort')
                .blur();

              return false;
            });
      });

      this._resultsView = this._buildResultsView();
      var columns = [];
      if (this._resultsView.collection.length > 0) {
        columns = this._resultsView.collection.at(0).get('columns');

      }
      /*
      console.log('this');
      console.log(this);
      console.log('columns');
      console.log(columns);
      */
      // @class Quote.List.View.Context
      return {
        // @property {String} pageHeader
        pageHeader: this.page_header
        // @property {Array} collection
        ,
        collection: this.collection
        // @property {Boolean} collectionLength
        ,
        collectionLength: this.collection.length
        // @property {Boolean} isLoading
        ,
        isLoading: this.isLoading
        //@property {Boolean} showBackToAccount
        ,
        showBackToAccount: Configuration.get('siteSettings.sitetype') ===
          'STANDARD'
        //@property {Array<{}>} columns
        ,
        columns: columns
      };
      // @class Quote.List.View
    }

  });
});