<tr class="product-list-list-details-wrapper" data-employee-id="{{internalid}}" data-id="{{internalid}}">
	<td class="product-list-list-details-info">
		<p class="product-list-list-details-last-update">
			<span class="product-list-list-details-last-update-value">{{lastname}}, {{firstname}}</span>
		</p>
	</td>
	<td class="product-list-list-details-info">
		<p class="product-list-list-details-last-update">
			<span class="product-list-list-details-last-update-value">{{email}}</span>
		</p>
	</td>    
	<td class="product-list-list-details-info">
		<p class="product-list-list-details-last-update">
			<span class="product-list-list-details-last-update-value">{{accountType.name}}</span>
		</p>
	</td>

	<td class="product-list-list-details-actions">
		{{#if showEditButtons}}
			<button data-action="edit-employee" class="product-list-list-details-add-to-cart">{{translate 'Edit'}}</button>
        	<button data-action="remove-employee" class="product-list-list-details-add-to-cart">{{translate 'Remove'}}</button>
		{{/if}}			
	</td>
</tr>
