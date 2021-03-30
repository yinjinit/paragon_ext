<section class="product-list-lists">

	<header class="product-list-lists-header">
		<h2 class="product-list-lists-title">{{translate 'Purchase Authorization: Rules'}}</h2>
		{{#if showCreateButton}}
            <button class="product-list-lists-button-add" data-action="add-new-purchaserule">{{translate 'Create New Purchase Rule'}}</button>
        {{/if}}
	</header>

	{{#if hasPurchaseRules}}
		<div class="product-list-lists-wrapper">
			<table class="product-list-lists-details">
                <thead class="transaction-history-list-headers">
                    <tr>
                        <th class="transaction-history-list-headers-number">
                            <span>{{translate 'Name'}}</span>
                        </th>
                        <th class="transaction-history-list-headers-date">
                            <span>{{translate 'Type'}}</span>
                        </th>
                        <th class="transaction-history-list-headers-amount">
                            <span>{{translate 'Employee'}}</span>
                        </th>
                        <th class="transaction-history-list-headers-amount">
                            <span>{{translate 'Approver'}}</span>
                        </th>                        
                        <th class="transaction-history-list-headers-status">
                            <span>{{translate 'Actions'}}</span>
                        </th>
                    </tr>
                </thead>                
				<tbody data-view="PurchaseRule.ListDetails"></tbody>
			</table>
		</div>
	{{else}}
        <div class="product-list-lists-subtitle">
            <h5>{{translate 'No Purchase Rules were found'}}</h5>
        </div>
	{{/if}}
</section>