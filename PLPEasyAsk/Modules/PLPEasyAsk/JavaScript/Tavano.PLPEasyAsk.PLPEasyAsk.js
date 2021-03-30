
define(
	'Tavano.PLPEasyAsk.PLPEasyAsk'
	, [

		'PLPEasyAsk.Item.KeyMapping',
		'PLP.EasyAsk.Facets.Item.Cell.View',
		'PLPEasyAsk.Facets.Browse.View',
		'PLP.EasyAsk.ItemSearcher.View',
		'EasyAskSearch.Model',
		'PLP.EasyAsk.Facets.Helper',
		'Categories',
		'underscore',
		'Backbone',
		'Utils',
		"NavigationHelper.Plugins.Modals"
	]
	, function (

		PLPEasyAskItemKeyMapping,
		PLPEasyAskFacetsItemCellView,
		PLPEasyAskFacetsBrowseView,
		PLPEasyAskItemSearcherView,
		EasyAskSearchModel,
		PLPEasyAskFacetsHelper,
		Categories,
		_,
		Backbone,
		Utils,
		NavigationHelper

	) {
		'use strict';

		return {
			mountToApp: function mountToApp(container) {

				// ------------------------------------------------------------------------------
				// Fix issue on quick view only on local version.
				// ------------------------------------------------------------------------------
				
				var _isLocal = window.location.href.indexOf('-local.ssp') >= 0;

				if( _isLocal ) {
					_.extend(NavigationHelper, {
						showInternalLinkInModal: function (e, href, $target, layout) {
	
							var self = this;
							var current_fragment = Backbone.history.fragment || '/';
							var original_view;
	
							layout.isShowContentRewritten = true;
							layout.originalShowContent = layout._showContent;
	
							if (this.ContentEnhancedViews) {
								this.originalOverrideViewSettings =
									this.ContentEnhancedViews.overrideViewSettings;
							}
	
							var layout_overlay = jQuery('<div class="layout-overlay"></div>');
							layout.$el.append(layout_overlay);
	
							layout.showContent = function (view) {
								return layout
									.cancelableTriggerUnsafe('beforeAppendView', view)
									.then(_.bind(_showContent, this, view))
									.fail(function () {
										layout_overlay.remove();
										this.undoNavigationHelperFunctionRewrite(layout);
									});
							};
	
							// Here we override the showContent function
							var _showContent = function _showContent(view) {
								layout_overlay.remove();
	
								var promise = jQuery.Deferred();
								// If you ever try to set a view that is not the original one
								// this code will catch it an do an undo
								if (!original_view) {
									original_view = view;
								} else if (original_view !== view) {
									promise = layout.originalShowContent.apply(layout, arguments);
	
									original_view &&
										original_view.$containerModal &&
										original_view.$containerModal
											.removeClass('fade')
											.modal('hide')
											.data('bs.modal', null);
									return promise;
								}
	
								if (view && _.isFunction(view.showInModal)) {
									// Then we just call the show in modal of the same view that we were passed in.
									promise = view.showInModal({
										className: $target.data('modal-class-name'),
										silence: true
									});
	
									// once this model closes we undo the override of the function
									view.$containerModal.on('hide.bs.modal', function () {
										self.undoNavigationHelperFunctionRewrite(layout);
									});
								} else {
									self.undoNavigationHelperFunctionRewrite(layout);
									Backbone.history.navigate(href, { trigger: false, replace: true });
								}
	
								return promise;
							};
	
							if (href.indexOf('?') === -1) {
								href += '?showinmodal=T';
							} else {
								href += '&showinmodal=T';
							}
	
							// ------------------------------------------------------------------------------
							// Issue with modal when searching with spaces chars in the URL
							// ------------------------------------------------------------------------------
							// Here we navigate to the url and we then change the url to what it was originaly set in page that opened the modal
	
							// original code
							// Backbone.history.navigate(href, { trigger: true, replace: true });
							// Backbone.history.navigate(current_fragment, { trigger: false, replace: true });
							// end original code 
	
							Backbone.history.navigate(href, { trigger: true, replace: true });
							Backbone.history.navigate(current_fragment, { trigger: false, replace: true });
	
							
							// ------------------------------------------------------------------------------
						}
					});
				}
				// ------------------------------------------------------------------------------

				// ------------------------------------------------------------------------------
				// Uncollapse selected facets, easy to see what filters are applied
				// Facets.FacetedNavigationItem.View
				// ------------------------------------------------------------------------------

				var layout = container.getComponent('Layout');
				// another way using contextDefinition
				if(layout)
				{
					layout.addToViewContextDefinition("Facets.FacetedNavigationItem.View", 'isCollapsed', 'boolean', function (context) {
					
						var isCollapsed = true;
						try{
							var values = context.displayValues;
							var hasSelectedValues = _.filter(values, function(facet){
								return facet.isActive;
							});
							
							if(hasSelectedValues.length > 0) {
								isCollapsed = false;
							}
						}catch(e){
							console.log(e);

						}

						return isCollapsed
					});

				}
					
				// ------------------------------------------------------------------------------

				// ------------------------------------------------------------------------------
				// Facets addition to application to handle the routes
				// ------------------------------------------------------------------------------
				/**
				 * TODO : Cache the facets or load only on application start
				 */
				var model = new EasyAskSearchModel();

				/**
				 * Since Backbone.history.fragment is not available,
				 * Nasty way to detect current backbone history fragment
				 */
				var hash = location.hash;
				var fullurl;

				// if we are running in a local environment, hash is available
				if (hash) {
					hash = hash.split("#");
					if (hash.length > 0)
						fullurl = hash[1];
				} else {
					fullurl = location.pathname;
					// remove '/'
					if (fullurl.length > 0)
						fullurl = fullurl.substr(1);
				}
				/**
				 * replicated logic from the Facets.Browse.View
				 */
				var url = (fullurl && fullurl.length) ? fullurl.split('?')[0] : "";

				var categoriesTopLevelUrl = Categories.getTopLevelCategoriesUrlComponent();

				var isCategoryPage = !!_.find(categoriesTopLevelUrl, function (categoryUrl) {
					categoryUrl = Utils.correctURL(categoryUrl);
					var caturl = Utils.correctURL(url);

					return caturl.indexOf(categoryUrl) === 0;
				});

				var translator = PLPEasyAskFacetsHelper.parseUrl(
					fullurl,
					container.translatorConfig,
					isCategoryPage
				);



				container.waitForPromise(
					model.fetch({
						data: PLPEasyAskFacetsHelper.getEasyAskApiParams(translator)
					}).then(function (data) {
						var facets = model.getFacets();

						var facetsArr = _.map(facets, function (item) {
							return item.attributeValueList[0].nodeString.split(":")[0]
						});

						var translatorFacets = _.map(facetsArr, function (item) {
							return {
								id: item,
								name: item.replace(/-/g, ' ')
							}
						});

						/**
						 * collapsed true for all elements
						 * remove '-' for name
						 */
						translatorFacets = _.map(translatorFacets, function (currentFacet) {
							var facetElement = {
								id: currentFacet.id,
								name: currentFacet.name.replace(/-/g, ' '),
								behavior: "multi",
								collapsed: true,
								isParameter: true
							}

							return facetElement;
						});


						container.translatorConfig.facets = container.translatorConfig.facets.concat(translatorFacets);
						SC.CONFIGURATION.facets = SC.CONFIGURATION.facets.concat(translatorFacets);

						var facetsJoin = facetsArr.join('|');

						var r = new RegExp("^\\b(" + facetsJoin + ")\\b$");
						var rr = new RegExp("^\\b(" + facetsJoin + ")\\b[\\/\?].*$");

						var pageType = container.getComponent('PageType');
						pageType.registerPageType({
							name: 'facet-browse',
							routes: [r, rr],
							view: PLPEasyAskFacetsBrowseView
						});

					}).fail(function (error) {

					})
				);
				// ------------------------------------------------------------------------------
				
				// Cart
				var cart = container.getComponent('Cart');
				if (cart) {
					cart.removeChildView("Correlated.Items");
				}


				// ------------------------------------------------------------------------------
				// Perform price change for product list page and additional operations
				// ------------------------------------------------------------------------------

				// remove sort and results per page
				var plp = container.getComponent('PLP');
				if (plp) {
					plp.removeChildView("Facets.ItemListSortSelector");
					plp.removeChildView("Facets.ItemListShowSelector");
				}
				// ------------------------------------------------------------------------------

			}
		};
	});
