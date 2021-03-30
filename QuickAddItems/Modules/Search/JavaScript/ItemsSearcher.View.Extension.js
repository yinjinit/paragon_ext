define(
    'ItemsSearcher.View.Extension',
    [
        'ItemsSearcher.View',
        'underscore'
    ],
    function(
        ItemsSearcherView,
        _
    ) {
        'use strict';

        //it was added to make it work on my account section
        _.extend(ItemsSearcherView.prototype, {

            events: {
                'focusout [data-type="search-input"]': 'removeSearchResults'
            },

            removeSearchResults: function(e) {
                var spanElement = jQuery('.tt-suggestions');
                spanElement.css('display', 'none');
        
            },            
        
        });
    });
