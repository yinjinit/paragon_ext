define('EasyAskSearch.Model',[
  'Backbone.CachedModel',
  'underscore'
], function(BackboneCachedModel, _) {
  'use strict';


  var original_fetch = BackboneCachedModel.prototype.fetch;

  /**
   *
   */
  return BackboneCachedModel.extend({
    url : _.getAbsoluteUrl(getExtensionAssetsPath('services/PLPEasyAsk.Service.ss')),

    // ------------------------------------------------------------------------------
    // Getters & Setters
    // ------------------------------------------------------------------------------
    getPaginationData : function(){
      return this.get('data') && this.get('data').source && this.get('data').source.products && this.get('data').source.products.itemDescription;
    },

    getProducts : function() {
      return this.get('data') && this.get('data').source && this.get('data').source.products && this.get('data').source.products.items;
    },

    getFacets : function(){

      try{
        var dataFacets = this.get('data');
        //var attribute_price = dataFacets.source.attributes.attribute
        //console.log(dataFacets);
        // if(dataFacets.source.attributes.attribute){
        var attribute_price = dataFacets.source.attributes.attribute;

        const needle = 'Price';
        const index = attribute_price.findIndex(attribute_price => attribute_price.name === needle);
        //console.log('index: ' + index);

        //var attribute_price_obj = $.grep(attribute_price, function(obj){return obj.name === 'Price';})[0];
        //console.log(attribute_price_obj.attributeValueList);
        //attribute_price_obj = attribute_price_obj.attributeValueList;
        //console.log(attribute_price);
        //.attributeValueList
        var attribute_price_obj = attribute_price[index].attributeValueList;
        //console.log(attribute_price_obj);

        attribute_price_obj.sort(function(a, b) {
          var a_parse_price = a.attributeValue;
          var a_parse_price = a_parse_price.replaceAll('$', '');
          if(a_parse_price == 'Under 25'){
            a_parse_price = "23-23"
          }
          if(a_parse_price == '3000 and above'){
            a_parse_price = "3005-3005"
          }

          var a_parse_price = a_parse_price.split("-");
          //console.log(a_parse_price);
          a = a_parse_price[0];
          var b_parse_price = b.attributeValue;
          var b_parse_price = b_parse_price.replaceAll('$', '');
          var b_parse_price = b_parse_price.split("-");
          //console.log(b_parse_price);
          var b = b_parse_price[0];


          //console.log('a');
          //console.log(a_parse_price.replaceAll('$', ''));
          //console.log(a);
          //console.log('b');
          //console.log(b);


          //console.log(b_parse_price.replaceAll('$', ''));
          //return parseFloat(a.price) - parseFloat(b.price);
          return parseFloat(a) - parseFloat(b);
        });

        this.data = dataFacets.source.attributes.attribute[index].attributeValueList = attribute_price_obj;
      }
      catch(err){
        //console.log(err);

      }

      //console.log(dataFacets.source.attributes.attribute);
      //console.log(this.get('data'));
      return this.get('data') && this.get('data').source && this.get('data').source.attributes && this.get('data').source.attributes.attribute;
    },

    getQuery : function() {
      return this.get('data') && this.get('data').source && this.get('data').source.originalQuestion;

    },
    getTotal : function(){
      return this.get('data') && this.get('data').source && this.get('data').source.products && this.get('data').source.products.itemDescription && this.get('data').source.products.itemDescription.totalItems
    }

    // @method fetch overrides fetch so we make sure that the cache is set to true, so we wrap it
    ,	fetch: function (options)
    {
      options = _.extend(options || {}, this.options);

      options.cache = true;

      return original_fetch.apply(this, arguments);
    }
    // ------------------------------------------------------------------------------
  });
});