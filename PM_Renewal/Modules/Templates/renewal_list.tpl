<div data-confirm-message class="cart-detailed-confirm-message"></div>
<section class="list">
	<header>
		<h2>
			  {{pageHeader}}	
			<div class="pull-right hidden-phone">
				<a class="pull-right btn btn-expanded btn-primary case-list-header-button-new" href="#" data-touchpoint="customercenter" data-hashtag="#/addreminder">
					  {{translate 'Create New Reminder'}}
				</a>
			</div>
		</h2>		
	</header>	
	
    <div data-view="List.Header"></div>
{{log this}}

<table class="quote-list-quotes-table">
				<thead class="quote-list-content-table">
					<tr class="quote-list-content-table-header-row">
						<th class="quote-list-content-table-header-row-title">
							<span>{{translate 'Renewal Name'}}</span>
						</th>
		
						{{#each columns}}
							<th class="quote-list-content-table-header-row-request-{{type}}">
								{{label}}
							</th>	
						{{/each}}
					</tr>
				</thead>
				<tbody data-view="PM.Renewal.List.Items"></tbody>
			</table>

		 
	</div>
</section>