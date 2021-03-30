
define(
	'TavanoTeam.addCategoryMenu.shopByBrand'
,   [
		"Header.Menu.View"
	]
,   function (
		HeaderMenuView
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{

			_.extend(HeaderMenuView.prototype, {
				getContext : _.wrap(HeaderMenuView.prototype.getContext, function(fn) {

					var context = fn.apply(this, _.toArray(arguments).slice(1));

					var categories = context.categories;
					if(categories && categories[0].categories) {

						var found = _.find(categories[0].categories, function(subCat) {
							return subCat.id == "shop-by-brand";
						});

						if( ! found ) {
							categories[0].categories.push({
								'text': "Shop by Brand",
								'id' : 'shop-by-brand',
								'href': "",
								'dataTouchpoint': "home",
								'dataHashtag': "#/Brands",
								'data-touchpoint': "home",
								'data-hashtag': "#/Brands",
								'class': "header-menu-level2-anchor"
							});
						}
					}
					return context;
				}),
			})			

		}
	};
});
