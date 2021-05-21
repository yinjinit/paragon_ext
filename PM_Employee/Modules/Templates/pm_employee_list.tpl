<section class="employee-lists">
	<header class="employee-lists-header">
		<h2 class="employee-lists-title">{{translate
			'Purchase Authorization: Employees'}}</h2>
		{{#if showCreateButton}}
			<button class="employee-lists-button-add"
				data-action="add-new-employee">{{translate 'Add New Employee'}}</button>
		{{/if}}
	</header>

	{{#if hasEmployees}}
		<div class="employee-lists-wrapper">
			<table class="employee-lists-details">
				<thead class="transaction-history-list-headers">
				<tr>
					<th class="transaction-history-list-headers-number">
						<span>{{translate 'Name'}}</span>
					</th>
					<th class="transaction-history-list-headers-date">
						<span>{{translate 'Email'}}</span>
					</th>
					<th class="transaction-history-list-headers-amount">
						<span>{{translate 'Role'}}</span>
					</th>
					<th class="transaction-history-list-headers-status">
						<span>{{translate 'Actions'}}</span>
					</th>
				</tr>
				</thead>
				<tbody data-view="Employee.List.Details"></tbody>
			</table>
		</div>
	{{else}}
		<div class="employee-lists-subtitle">
			<h5>{{translate 'No employees were found'}}</h5>
		</div>
	{{/if}}
</section>