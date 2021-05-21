define(
  'FacetLoader',
  [
    'Facets.Browse.View',
    'underscore',
    'Utils'
  ],
  function(
    FacetsBrowseView,
    _,
    Utils
  ) {
    'use strict';

    _.extend(FacetsBrowseView.prototype, {

      initialize: _.wrap(FacetsBrowseView.prototype.initialize, function(fn) {

        this.turnOnLoader();

        var self = this;
        var ret = fn.apply(this, _.toArray(arguments).slice(1));

        this.on('afterViewRender', function() {

          _.defer(_.bind(self.turnOffLoader, this));

        }, this);

        return ret;
      }),

      turnOnLoader: function() {

        jQuery('#facet-wrapper-loader').show();

      },

      turnOffLoader: function() {

        jQuery('#facet-wrapper-loader').hide();
      }

    });
  });
