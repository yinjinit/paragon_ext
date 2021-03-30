<section class="product-list-lists">

	<header class="product-list-lists-header">
		<h2 class="product-list-lists-title">{{translate 'Purchase Authorization: Approvals'}}</h2>
	</header>

	{{#if hasApprovals}}
		<div class="product-list-lists-wrapper">
			<table class="product-list-lists-details">
                <thead class="transaction-history-list-headers">
                    <tr>
                        <th class="transaction-history-list-headers-number">
                            <span>{{translate 'Order #'}}</span>
                        </th>
                        <th class="transaction-history-list-headers-date">
                            <span>{{translate 'Date'}}</span>
                        </th>
                        <th class="transaction-history-list-headers-amount">
                            <span>{{translate 'Total'}}</span>
                        </th>
                        <th class="transaction-history-list-headers-status">
                            <span>{{translate 'Status'}}</span>
                        </th>
                        <th class="transaction-history-list-headers-date">
                            <span>{{translate 'Employee'}}</span>
                        </th>
                        <th class="transaction-history-list-headers-amount">
                            <span>{{translate 'Approver'}}</span>
                        </th>
                        <th class="transaction-history-list-headers-status">
                            <span>{{translate 'Action'}}</span>
                        </th>
                    </tr>
                </thead>                
				<tbody data-view="Approvals.ListDetails"></tbody>
			</table>
		</div>
	{{else}}
        <div class="product-list-lists-subtitle">
            <h5>{{translate 'No Approvals were found'}}</h5>
        </div>
	{{/if}}
</section>