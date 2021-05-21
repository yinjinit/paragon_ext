<div class="address-search-control">
	<div class="address-search-input-wrapper">
		<input type="text" class="address-search-input" placeholder="{{translate
			'Search By Names, Address, City, State, Zip, Country'}}">
		{{#if addressesFiltered}}
			<i class="address-search-cancel icon-close"></i>
		{{/if}}
	</div>
	{{#if showKeywordNotice}}
		<span class="address-search-notice">{{translate
			'Search must be at least 3 characters in length.'}}</span>
	{{/if}}
	{{#if addressesFiltered}}
		<div class="address-search-list">
			{{#each addressesFiltered}}
				<div class="address-item">
					<span class="address-line">{{address}}</span>
					<button class="button-small button-primary button-select"
						data-id="{{internalid}}">{{translate 'Select'}}</button>
					<button class="button-small button-edit"
						data-id="{{internalid}}">{{translate 'Edit'}}</button>
				</div>
			{{/each}}
		</div>
	{{/if}}
</div>

<button class="button-primary button-small button-address-back"><i
	class="button-back-icon"></i>{{translate 'Back to Current Address'}}</button>

{{!----
Use the following context variables when customizing this template:

	addressesFiltered (Array)
	showKeywordNotice (Boolean)

----}}