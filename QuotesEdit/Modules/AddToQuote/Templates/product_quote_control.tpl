	{{#if isMoving}}
		<button class="product-list-control-button-move" data-action="show-productlist-control" data-toggle="showFlyout" type="button">
			{{translate 'Move'}}
		</button>
	{{else}}
		<button class="product-list-control-button-wishlist" data-action="show-productlist-control" data-toggle="showFlyout" type="button" >
			{{translate 'Add to Quote'}}
		</button>
	{{/if}}
	<div class="product-list-control-flyout {{#if isMoving}}product-list-control-move{{/if}}" data-type="productlist-control" {{#if showControl}}style="display: block"{{/if}} data-dropdown-content>

	{{#unless isMoving}}
		<div data-confirm-message=""></div>
	{{/unless}}
    <div class="product-list-control-new-product-list-container">
        <a class="product-list-control-new-item-button-create" data-action="add-to-request-a-quote">
            {{translate 'New Quote Request'}}
        </a>
        <div class="quote-message quote-message-new"></div>
    </div>
	<h5 class="product-list-control-flyout-title">
        {{translate 'Add to quote:'}}
	</h5>
    {{#unless isEmptyToAdd}}
    <input type="text" placeholder="{{translate 'Search for quote..'}}" id="search-quote-value" class="search-quote-value">
    {{/unless}}
	<ul class="product-list-control-flyout-product-lists" id="list-quotes-to-add">
        {{#if isEmptyToAdd}}
            <li class="product-list-control-nolists-messages">
                {{translate 'There are no open quotes'}}
            </li>
        {{/if}}
	</ul>

    <h5 class="product-list-control-flyout-title">{{translate 'Already added on: '}}</h5>
    <ul class="product-list-control-flyout-product-lists" id="list-quotes-added">
        {{#if isEmptyAdded}}
            <li class="product-list-control-nolists-messages">
                {{translate 'None'}}
            </li>
        {{/if}}
    </ul>
    <div class="quote-message quote-message-list"></div>
    <br>
</div>




{{!----
Use the following context variables when customizing this template: 
	
	isMoving (Boolean)
	showControl (Boolean)
	isEmpty (Boolean)
	hasOneProductList (Boolean)
	hasProductLists (Boolean)
	productListLength (Number)

----}}
