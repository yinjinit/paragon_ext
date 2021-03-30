<div class="product-list-control-item-label quote" data-quote-id="{{quoteId}}" {{#unless isChecked}}data-action="quote-item"{{/unless}}>
    {{#unless isChecked}}
    <span class="quote-icon-plus icon-plus"></span>
    {{/unless}}
    {{quoteNumber}}
    {{#if quoteDate}}- {{quoteDate}}{{/if}}
    {{#if quoteName}}- {{quoteName}}{{/if}}
</div>




{{!----
Use the following context variables when customizing this template: 
	
	isMoving (Boolean)
	isChecked (Boolean)
	isTypePredefined (Boolean)
	itemName (String)
	listId (String)

----}}
