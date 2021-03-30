
define(
	'TavanoTeam.QuickAddItems.Search'
,   [
		'QuickAdd.ItemsSearcher.Plugins.Extension',
		'ItemsSearcher.View.Extension'
	]
,   function (
		QuickAddItemsSearcherPluginsExtension,
		ItemsSearcherViewExtension
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			//there is nothing to mount, just load the 'QuickAdd.ItemsSearcher.Plugins.Extension' module
			//there is nothing to mount, just load the 'ItemsSearcher.View.Extension' module

		}
	};
});
