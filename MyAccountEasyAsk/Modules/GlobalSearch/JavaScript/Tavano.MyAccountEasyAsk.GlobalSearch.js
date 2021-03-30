
define(
	'Tavano.MyAccountEasyAsk.GlobalSearch'
,   [
		'MyAccount.EasyAsk.ItemSearcher.View'
	]
,   function (
		MyAccountEasyAskItemSearcherView
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			//there is no need to add any logic just loading 'MyAccount.EasyAsk.ItemSearcher.View' as entry point

		}
	};
});
