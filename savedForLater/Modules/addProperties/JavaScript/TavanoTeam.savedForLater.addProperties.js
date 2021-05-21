
define(
	'TavanoTeam.savedForLater.addProperties'
,   [

	]
,   function (

	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			// using the 'Layout' component we add a new child view inside the 'Header' existing view 
			// (there will be a DOM element with the HTML attribute data-view="Header.Logo")
			// more documentation of the Extensibility API in
			// https://system.netsuite.com/help/helpcenter/en_US/APIs/SuiteCommerce/Extensibility/Frontend/index.html
			
			/** @type {LayoutComponent} */
			var layout = container.getComponent('Layout');
			
			if(layout)
			{

				layout.addToViewContextDefinition('Cart.Lines.View', 'displayName', 'string', function (context)
				{

					if(context && context.linkAttributes && context.linkAttributes !== "" && context.linkAttributes !== undefined && context.linkAttributes !== null){
						var displayName = context.linkAttributes.match(/name=(.*?)\&/);
						displayName =  decodeURIComponent(displayName[1]);

						return displayName;
					}
				});	
				
				layout.addToViewContextDefinition('ProductList.DetailsLaterMacro.View', 'displayName', 'string', function (context)
				{ 

					if(context && context.itemDetailsUrl && context.itemDetailsUrl !== '' && context.itemDetailsUrl !== undefined && context.itemDetailsUrl !== null){
						var displayName = context.itemDetailsUrl.match(/name=(.*?)\&/);
						displayName =  decodeURIComponent(displayName[1]);

						return displayName;
					}
				});					
			}

		}
	};
});
