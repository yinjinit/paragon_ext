
define(
	'TavanoTeam.HideFacetCategory.Category'
,   [

	]
,   function (
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			
			/** @type {LayoutComponent} */
			var layout = container.getComponent('Layout');
			
			if(layout)
			{
				if(window && window.location && window.location.href){
					var keyword = '?Brand=';
					var found = window.location.href.indexOf(keyword);

					if(found > -1){
						layout.removeChildView('Facets.Browse.CategoryHeading');
						layout.removeChildView('Facets.CategoryCells');
						layout.removeChildView('Facets.FacetsDisplay');
					}
				}
			}

		}
	};
});
