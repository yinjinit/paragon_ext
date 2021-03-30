<tr class="transaction-line-views-cell-navigable {{cellClassName}} item-{{itemId}}" data-id="{{itemId}}" data-item-type="{{itemType}}">
	<td class="transaction-line-views-cell-navigable-details" name="item-details">
		<p class="transaction-line-views-cell-navigable-product-img-container">
        {{#if isNavigable}}
        <a href data-url="/product/{{model.item.custitem_pm_cnet_id}}?quantity={{quantity}}&mpn={{model.item._sku}}&price={{model.amount}}&cat={{model.item.custitem_gvo_category}}&name={{model.item.displayname}}&stockmessage=In Stock&manufacturer={{model.item.manufacturer}}">
        	{{#if model.item.custitem_item_thumbnail_url}}
				<img src="{{resizeImage model.item.custitem_item_thumbnail_url 'thunbnail'}}?resizeh=60" alt="{{thumbnail.altimagetext}}">
			{{else}}
				<img src="{{resizeImage thumbnail.url 'thumbnail'}}?resizeh=60" alt="{{thumbnail.altimagetext}}">
			{{/if}}
		</a>
		{{else}}
		{{#if model.item.custitem_item_thumbnail_url}}
				<img src="{{resizeImage model.item.custitem_item_thumbnail_url 'thumbnail'}}?resizeh=60" alt="{{thumbnail.altimagetext}}">
			{{else}}
				<img src="{{resizeImage thumbnail.url 'thumbnail'}}?resizeh=60" alt="{{thumbnail.altimagetext}}">
			{{/if}}
		{{/if}}

        </p>
		<p class="transaction-line-views-cell-navigable-product-name">
			{{#if isNavigable}}
				<a href class="transaction-line-views-cell-navigable-product-title-anchor" data-url="/product/{{model.item.custitem_pm_cnet_id}}?quantity={{quantity}}&mpn={{model.item._sku}}&price={{model.amount}}&cat={{model.item.custitem_gvo_category}}&name={{model.item.displayname}}&stockmessage=In Stock&manufacturer={{model.item.manufacturer}}">{{#if model.item.displayname}} {{model.item.displayname}} {{else}} {{itemName}} {{/if}}</a>
			{{else}}
				<span class="transaction-line-views-cell-navigable-product-title">
					{{#if model.item.displayname}} {{model.item.displayname}} {{else}} {{itemName}} {{/if}}
				</span>
			{{/if}}
		</p>
		{{#unless isFreeGift}}
		<p>
			<div data-view="Item.Price"></div>
		</p>
		{{/unless}}
		<div class="transaction-line-views-cell-navigable-sku" data-view="Item.Sku"></div>
		<div data-view="Item.Tax.Info"></div>
		{{#if showOptions}}
			<div data-view="Item.Options"></div>
		{{/if}}
		<p>
			<span class="transaction-line-views-cell-navigable-stock" data-view="ItemViews.Stock.View">
		</p>

		<div data-view="StockDescription"></div>
	</td>
	{{#if showBlockDetail2}}
    <td class="transaction-line-views-cell-navigable-item-unit-price" name="item-unit-price">
        <p>
            <span class="transaction-line-views-cell-navigable-item-unit-price-label">{{detail2Title}}</span>
            <span class="transaction-line-views-cell-navigable-item-unit-price-value">{{detail2}}</span>
        </p>
    </td>
    {{/if}}
	<td class="transaction-line-views-cell-navigable-item-quantity" name="item-quantity">
		<p>
			<span class="transaction-line-views-cell-navigable-item-quantity-label">{{translate 'Quantity:'}} </span>
			<span class="transaction-line-views-cell-navigable-item-quantity-value">{{quantity}}</span>
		</p>
	</td>
	<td class="transaction-line-views-cell-navigable-amount" name="item-amount">
		<p>
		{{#if showDetail3Title}}
			<span class="transaction-line-views-cell-navigable-item-amount-label">{{detail3Title}}</span>
		{{/if}}
		<span class="transaction-line-views-cell-navigable-item-amount-value">{{detail3}}</span>
		{{#if showComparePrice}}
			<small class="transaction-line-views-cell-navigable-item-old-price">{{comparePriceFormatted}}</small>
		{{/if}}
		</p>
	</td>
</tr>




{{!----
Use the following context variables when customizing this template:

	model (Object)
	model.item (Object)
	model.item.internalid (Number)
	model.item.type (String)
	model.quantity (Number)
	model.internalid (String)
	model.options (Array)
	model.shipaddress (undefined)
	model.shipmethod (undefined)
	model.location (String)
	model.fulfillmentChoice (String)
	itemId (Number)
	itemName (String)
	isNavigable (Boolean)
	rateFormatted (String)
	showOptions (Boolean)
	itemURLAttributes (String)
	quantity (Number)
	showDetail2Title (Boolean)
	detail2Title (String)
	detail2 (String)
	showBlockDetail2 (Boolean)
	showDetail3Title (Boolean)
	detail3Title (String)
	detail3 (String)
	showComparePrice (Boolean)
	comparePriceFormatted (String)
	thumbnail (Object)
	thumbnail.url (String)
	thumbnail.altimagetext (String)

----}}