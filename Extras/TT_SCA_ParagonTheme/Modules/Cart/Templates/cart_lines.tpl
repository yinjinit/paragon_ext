{{!---- log this ----}}
{{!---- {{{linkAttributes}}} ----}}
<div id="{{lineId}}" data-item-id="{{itemId}}" data-type="order-item" class="{{#if showGeneralClass}} {{generalClass}} {{/if}} cart-lines-row">

	<div class="cart-lines-table-first">
		<div class="cart-lines-thumbnail">
			{{#if isNavigable}}
				<a href="" data-url="/product/{{item.custitem_pm_cnet_id}}?quantity={{line.quantity}}&mpn={{item._sku}}&price={{line.amount}}&cat={{item.custitem_gvo_category}}&name={{#if item.displayname}}{{item.displayname}}{{else}}{{item._name}}{{/if}}&stockmessage=In Stock&manufacturer={{item.manufacturer}}">
				{{#if item.custitem_item_thumbnail_url}}
					<img src="{{resizeImage item.custitem_item_thumbnail_url 'tinythumb'}}?resizeh=60" alt="{{thumbnail.altimagetext}}">
				{{else}}
					<img src="{{resizeImage thumbnail.url 'thumbnail'}}" alt="{{thumbnail.altimagetext}}">
				{{/if}}		
				</a>
			{{else}}
				{{#if item.custitem_item_thumbnail_url}}
					<img src="{{resizeImage item.custitem_item_thumbnail_url 'tinythumb'}}?resizeh=60" alt="{{thumbnail.altimagetext}}">
				{{else}}
					<img src="{{resizeImage thumbnail.url 'thumbnail'}}" alt="{{thumbnail.altimagetext}}">
				{{/if}}
			{{/if}}
		</div>
	</div>

	<div class="cart-lines-table-middle">
		<div class="cart-lines-name">
		{{#if isNavigable}}
			<a href="" data-url="/product/{{item.custitem_pm_cnet_id}}?quantity={{line.quantity}}&mpn={{item._sku}}&price={{line.amount}}&cat={{item.custitem_gvo_category}}&name={{#if item.displayname}}{{item.displayname}}{{else}}{{item._name}}{{/if}}&stockmessage=In Stock&manufacturer={{item.manufacturer}}" class="cart-lines-name-link">
				{{#if item.displayname}} {{item.displayname}} {{else}} {{item._name}} {{/if}}
			</a>
		{{else}}
				<span class="cart-lines-name-viewonly">{{#if item.displayname}} {{item.displayname}} {{else}} {{item._name}} {{/if}}</span>
		{{/if}}
		</div>
		<div class="cart-lines-price">
			<div data-view="Item.Price"></div>
		</div>
		<div data-view="Item.Sku"></div>
		<div data-view="Item.Tax.Info"></div>

		<div class="cart-lines-options">
			<div data-view="Item.SelectedOptions"></div>
		</div>
		{{#if showSummaryView}}
			<div class="cart-lines-summary" data-view="Item.Summary.View"></div>
		{{/if}}

		<div data-view="StockDescription"></div>

        <div class="cart-lines-item-actions-desktop" data-view="Item.Actions.View"></div>
	</div>
	<div class="cart-lines-table-last">
		<div class="cart-lines-item-actions-mobile" data-view="Item.Actions.View"></div>

        <div class="cart-lines-shipping-method" data-view="CartLines.PickupInStore"></div>

		<div class="cart-lines-stock" data-view="Product.Stock.Info"></div>

		{{#if showAlert}}
			<div class="cart-lines-alert-placeholder" data-type="alert-placeholder"></div>
		{{/if}}

		{{#if showCustomAlert}}
			<div class="alert alert-{{customAlertType}}">
				{{item._cartCustomAlert}}
			</div>
		{{/if}}
	</div>
</div>




{{!----
Use the following context variables when customizing this template:

	line (Object)
	line.item (Object)
	line.item.internalid (Number)
	line.item.type (String)
	line.quantity (Number)
	line.internalid (String)
	line.options (Array)
	line.location (String)
	line.fulfillmentChoice (String)
	lineId (String)
	item (Object)
	item.isinactive (Boolean)
	item.isinstock (Boolean)
	item.isonline (Boolean)
	item.matrixchilditems_detail (undefined)
	item.itemid (String)
	item.minimumquantity (undefined)
	item.ispurchasable (Boolean)
	item.stockdescription (String)
	item.isbackorderable (Boolean)
	item.itemimages_detail (Object)
	item.onlinecustomerprice_detail (Object)
	item.onlinecustomerprice_detail.onlinecustomerprice_formatted (String)
	item.onlinecustomerprice_detail.onlinecustomerprice (Number)
	item.internalid (Number)
	item.showoutofstockmessage (Boolean)
	item.itemtype (String)
	item.outofstockmessage (String)
	item.itemoptions_detail (Object)
	item.itemoptions_detail.fields (Array)
	item.itemoptions_detail.fields.0 (Object)
	item.itemoptions_detail.fields.0.internalid (String)
	item.itemoptions_detail.fields.0.label (String)
	item.itemoptions_detail.fields.0.type (String)
	item.displayname (String)
	item.storedisplayname2 (String)
	item.pricelevel1 (Number)
	item.pricelevel1_formatted (String)
	item.urlcomponent (String)
	item._optionsDetails (Object)
	item._optionsDetails.fields (Array)
	item._optionsDetails.fields.0 (Object)
	item._optionsDetails.fields.0.internalid (String)
	item._optionsDetails.fields.0.label (String)
	item._optionsDetails.fields.0.type (String)
	item._matrixParent (Object)
	item._matrixParent.options (Array)
	item.options (Array)
	item.options.0 (Object)
	item.options.0.cartOptionId (String)
	item.options.0.itemOptionId (String)
	item.options.0.label (String)
	item.options.0.type (String)
	item._url (String)
	item._isPurchasable (Boolean)
	item._name (String)
	item._priceDetails (Object)
	item._priceDetails.onlinecustomerprice_formatted (String)
	item._priceDetails.onlinecustomerprice (Number)
	item._comparePriceAgainst (Number)
	item._comparePriceAgainstFormated (String)
	item._isInStock (Boolean)
	item._outOfStockMessage (String)
	item._showOutOfStockMessage (Boolean)
	item._inStockMessage (String)
	item._showInStockMessage (Boolean)
	item._stockDescription (String)
	item._showStockDescription (Boolean)
	item._stockDescriptionClass (String)
	item._quantityavailableforstorepickup_detail (Array)
	item._showQuantityAvailable (Boolean)
	item._sku (String)
	item._minimumQuantity (Number)
	item._itemType (String)
	itemId (Number)
	linkAttributes (String)
	isNavigable (Boolean)
	showCustomAlert (Boolean)
	customAlertType (String)
	showActionsView (Boolean)
	showSummaryView (Boolean)
	showAlert (Boolean)
	showGeneralClass (Boolean)
	thumbnail (Object)
	thumbnail.url (String)
	thumbnail.altimagetext (String)

----}}
