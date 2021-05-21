define('PM.AdvancedReports.Details.View', [
  'ListHeader.View',
  'PM.AdvancedReports.Collection',
  'RecordViews.View',
  'SC.Configuration',
  'Transaction.List.View',
  'PM.AdvancedReports.Model',
  'reports_details.tpl',
  'Backbone',
  'Backbone.CompositeView',
  'Backbone.CollectionView',
  'underscore',
  'Utils'
], function(
  ListHeader,
  AdvancedReportsCollection,
  RecordViewsView,
  Configuration,
  TransactionListView,
  AdvancedReportsModel,
  reports_details_tpl,
  Backbone,
  BackboneCompositeView,
  BackboneCollectionView,
  _
) {
  'use strict';
  //var renewal_list_tpl;
  // @class Quote.List.View @extends Backbone.View
  return TransactionListView.extend({

    //@property {Function} template
    template: reports_details_tpl

    //@property {String} className
    , className: 'PMReportsModel'

    //@property {String} title
    , title: _('Search Results').translate()

    //@property {String} page_header
    , page_header: _('Search Results').translate()

    , attributes: {'class': 'PMReports'}

    , events: {
      'click #downloadLink': 'exportCSV'
      , 'click [data-action="remove-renewal"]': 'remove'
    }

    , initialize: function(options) {
      //console.log(options);
      this.application = options.application;
      //this.collection = options.collection;
      //console.log(this.collection);
      //this.type = options.type;
      this.user = this.application.getUser();
      //console.log('user');
      //console.log(this.user);
      var self = this;
      var reportName = options.routerArguments[1];
      //console.log(options.routerArguments[0]);
      //console.log('checking options ' + options.routerArguments[1]);

      this.model = new AdvancedReportsModel({
        internalid: options.routerArguments[0]
      });
      //console.log(options.routerArguments[0]);
      //console.log('checking options ' + options.routerArguments[0]);
      //console.log(this.model);

      this.reportName = reportName;

      this.beforeShowContent();

      this.model.fetch().done(function() {
        self.render();
        //console.log('after self2');
      });

      this.collection = this.model;

    }

    , listenCollection: function() {
      this.setLoading(true);

      this.collection.on({
        request: _.bind(this.setLoading, this, true)
        , reset: _.bind(this.setLoading, this, false)
      });

    }

    , setupListHeader: function() {
      // manges sorting and filtering of the collection
      this.listHeader = new ListHeaderView({
        view: this
        , application: this.application
        , collection: this.collection
        , filters: this.filterOptions
        //,	sorts: this.sortOptions
        , allowEmptyBoundaries: true
      });
    }

    , setLoading: function(is_loading) {
      //@property {Boolean} isLoading
      this.isLoading = is_loading;
    }

    , exportCSV: function exportCSV(e) {

      var table = document.getElementById('custom-reports-table');
      var html = table.outerHTML;
      var reportName = this.reportName + '.xls';
      //console.log(' html table ' + reportName);
      var element = document.createElement('a');
      element.setAttribute('href',
        'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' +
        encodeURIComponent(html));
      element.setAttribute('download', reportName);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

    }
    , getSelectedMenu: function() {
      return 'pubreport';
    }

    //@method getBreadcrumbPages
    //@return {BreadcrumbPage}
    , getBreadcrumbPages: function() {
      return {
        text: this.title
        , href: '/pubreport'
      };
    }



    //originaly displayed
    , beforeShowContent: function beforeShowContent() {

      return jQuery.Deferred().resolve();
    }

    , getContext: function() {

      //console.log('Collection2');
      //console.log(this.collection.attributes);

      var data = {};
      var data = this.collection.toJSON();
      var columns = [];
      var values = [];
      columns = _.keys(data[0]);

      //console.log(" count " + Object.keys(this.collection).length);

      var totalCnt = 0;
      for (const property in this.collection.attributes) {
        totalCnt++;
      }

      for (var i = 0; i < totalCnt; i++) {
        //console.log('inside adding values');
        //values.push({values: _.values(data[i])});
        values.push({
          values: _.values(data[i])
        });
        //values.push(_.values(data[i]));

      }

      var reportName = this.reportName;//.replace(' ', '_');

      //reportName = reportName.replace(' ','_');

      //console.log(JSON.stringify(values));

      //console.log(JSON.stringify(columns));

      //console.log(reportName);

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

        ,
        valuesList: values

        ,
        reportName: reportName

        ,
        columnList: columns
        //@property {Boolean} showBackToAccount
        ,
        showBackToAccount: Configuration.get('siteSettings.sitetype') ===
          'STANDARD'
        //@property {Array<{}>} columns

      };
      // @class Quote.List.View
    }

  });
});