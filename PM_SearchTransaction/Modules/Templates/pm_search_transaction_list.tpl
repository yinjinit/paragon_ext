<section class="transaction-history-list">
	<header class="transaction-history-list-header">
		<h2>{{pageHeader}}</h2>
	</header>

	<div data-view="ListHeader.View"></div>

	{{#if showPagination}}
		<div
			class="transaction-history-list-paginator transaction-history-list-paginator-top">
			<div data-view="GlobalViews.Pagination"></div>
			{{#if showCurrentPage}}
				<div data-view="GlobalViews.ShowCurrentPage"></div>
			{{/if}}
		</div>
	{{/if}}

	<div class="transaction-history-list-results-container">
		{{#if isThereAnyResult}}
			<table class="transaction-history-list-results-table">
				<thead class="transaction-history-list-headers">
				<tr>
					<th class="transaction-history-list-headers-number">
						<span>{{translate 'Number'}}</span>
					</th>
					<th class="transaction-history-list-headers-date">
						<span>{{translate 'Date'}}</span>
					</th>
					<th class="transaction-history-list-headers-amount">
						<span>{{translate 'Amount'}}</span>
					</th>
					<th class="transaction-history-list-headers-status">
						<span>{{translate 'Status'}}</span>
					</th>
				</tr>
				</thead>
				<tbody data-view="Records.Collection"></tbody>
			</table>
		{{else}}
			{{#if isLoading}}
				<p class="transaction-history-list-empty">{{translate 'Loading...'}}</p>
			{{else}}
				<div class="transaction-history-list-empty-section">
					<h5>{{translate 'No transactions were found'}}</h5>
				</div>
			{{/if}}
		{{/if}}
	</div>

</section>