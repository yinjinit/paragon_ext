<tr class="product-list-list-details-wrapper" data-purchaserule-id="{{internalid}}" data-id="{{internalid}}">
	<td class="product-list-list-details-info">
		<p class="product-list-list-details-last-update">
			<span class="product-list-list-details-last-update-value">{{name}}</span>
		</p>
	</td>
	<td class="product-list-list-details-info">
		<p class="product-list-list-details-last-update">
			<span class="product-list-list-details-last-update-value">{{custrecord_cpas_rules_type.name}}</span>
		</p>
	</td>    
	<td class="product-list-list-details-info">
		<p class="product-list-list-details-last-update">
			<span class="product-list-list-details-last-update-value">{{custrecord_cpas_rules_customerid.name}}</span>
		</p>
	</td>
	<td class="product-list-list-details-info">
		<p class="product-list-list-details-last-update">
			{{#if custrecord_cpas_rules_approver1.name}}<span class="product-list-list-details-last-update-value">{{custrecord_cpas_rules_approver1.name}}</span>{{/if}}
			{{#if custrecord_cpas_rules_approver2.name}}<span class="product-list-list-details-last-update-value">{{custrecord_cpas_rules_approver2.name}}</span>{{/if}}
			{{#if custrecord_cpas_rules_approver3.name}}<span class="product-list-list-details-last-update-value">{{custrecord_cpas_rules_approver3.name}}</span>{{/if}}
			{{#if custrecord_cpas_rules_approver4.name}}<span class="product-list-list-details-last-update-value">{{custrecord_cpas_rules_approver4.name}}</span>{{/if}}
			{{#if custrecord_cpas_rules_approver5.name}}<span class="product-list-list-details-last-update-value">{{custrecord_cpas_rules_approver5.name}}</span>{{/if}}
		</p>
	</td>    

	<td class="product-list-list-details-actions">
		{{#if showEditButtons}}
			<button data-action="edit-purchaserule" class="product-list-list-details-add-to-cart">{{translate 'Edit'}}</button>
        	<button data-action="remove-purchaserule" class="product-list-list-details-add-to-cart">{{translate 'Remove'}}</button>
		{{/if}}
	</td>
</tr>
