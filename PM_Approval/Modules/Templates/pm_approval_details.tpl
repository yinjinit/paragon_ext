<tr class="product-list-list-details-wrapper" data-approval-id="{{sales_order_id}}" data-id="{{sales_order_id}}">
	<td id="name" class="product-list-list-details-info">
		<p class="product-list-list-details-last-update">
			<span class="product-list-list-details-last-update-value">{{order_number}}</span>
		</p>
	</td>
	<td id="approver" class="product-list-list-details-info">
		<p class="product-list-list-details-last-update">
			<span class="product-list-list-details-last-update-value">{{order_date}}</span>
		</p>
	</td>
	<td id="order_number" class="product-list-list-details-info">
		<p class="product-list-list-details-last-update">
			<span class="product-list-list-details-last-update-value">{{order_total}}</span>
		</p>
	</td>    

	<td id="order_date" class="product-list-list-details-info">
		<p class="product-list-list-details-last-update">
			<span class="product-list-list-details-last-update-value">{{order_status}}</span>
		</p>
	</td>
	<td id="order_total" class="product-list-list-details-info">
		<p class="product-list-list-details-last-update">
			<span class="product-list-list-details-last-update-value">{{name}}</span>
		</p>
	</td>    
	<td id="order_status" class="product-list-list-details-info">
		<p class="product-list-list-details-last-update">
			<span class="product-list-list-details-last-update-value">{{approver}}</span>
		</p>
	</td>
	<td class="product-list-list-details-actions">
		{{#if showButtons}}	
			<a href="#" data-touchpoint="customercenter" data-id="{{orderid}}" data-hashtag="search_transaction/purchases/view/salesorder/{{orderid}}"><span class="tranid">{{translate 'Review'}}</span></a>		
			<button onclick="this.classList.add('active')" data-action="approve-decline-sale" class="product-list-list-details-add-to-cart" data-sales_order_id="{{sales_order_id}}">{{translate 'Approve/Decline'}}</button>
		{{/if}}				
	</td>
</tr>
