// @module PM.AjaxRequestsKiller
define('PM.AjaxRequestsKiller', [
  'underscore',
  'jQuery',
  'Backbone',
  'jQuery.ajaxSetup'
], function(
  _,
  $,
  Backbone,
  $ajaxSetup
) {
  'use strict';

  var killerId,
    lambsToBeKilled;

  // @class PM.AjaxRequestsKiller @extends ApplicationModule
  return {
    //@method getKillerId
    getKillerId: function() {
      return killerId;
    },
    //@method getLambsToBeKilled
    getLambsToBeKilled: function() {
      return lambsToBeKilled;
    },
    //@method loadModule
    loadModule: function loadModule(application) {
      // Sets the first Killer ID
      // Every time the url changes this will be reset,
      // but as we are the last listening to the url change event
      // this only happens after all request are made
      killerId = _.uniqueId('ajax_killer_');

      // Every time a request is made, a ref to it will be store in this collection.
      lambsToBeKilled = [];

      // Wraps the beforeSend function of the $ajaxSetup
      $ajaxSetup.beforeSend =
        _.wrap($ajaxSetup.beforeSend, function(fn, jqXhr, options) {
          // If the killerId is set we add it to the collection
          if (options.killerId) {
            jqXhr.killerId = options.killerId;
            lambsToBeKilled.push(jqXhr);
          }

          // Finally we call the original $ajaxSetup.beforeSend
          fn.apply(this, _.toArray(arguments).slice(1));
        });

      // We listen to the afterStart because Backbone.history is *potentially* not ready until after that
      application.on('afterStart', function() {
        // There is a timing issue involved,
        // the on all event happens after the 2nd requests is done
        Backbone.history.on('all', function() {
          // Check previous ongoing requests
          _.each(lambsToBeKilled, function(prev_jqXhr) {
            // if the new id is different than the old one, it means that there is a new killer id,
            // so we kill the old one if its still ongoing
            if (killerId && killerId !== prev_jqXhr.killerId) {
              if (prev_jqXhr.readyState !== 4) {

                // If we are killing this request we don't want the ErrorHandling.js to handle it
                prev_jqXhr.preventDefault = true;
                prev_jqXhr.abort();
              }

              // we take it off the lambsToBeKilled collection to free some space and processing.
              lambsToBeKilled = _.without(lambsToBeKilled, prev_jqXhr);
            }
          });

          // Generates a new id for the **next** request
          killerId = _.uniqueId('ajax_killer_');
        });
      });
    }
  };
});
