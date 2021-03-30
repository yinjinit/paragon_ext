<section class="overview-home">
	<div class="overview-home-orders" data-permissions="{{purchasesPermissions}}">

		{{!----adding extra links ----}}
		<a href="/quotes" class="overview-home-orders-title">
			<img src="/Images/my-account/recentquotes.gif">
			<span class="overview-home-orders-title-link">{{translate 'View Recent Quotes'}}</span>
		</a>
		<a href="/purchases" class="overview-home-orders-title">
			<img src="/Images/my-account/recentorders.gif">
			<span class="overview-home-orders-title-link">{{translate 'View Recent Orders'}}</span>
		</a>
		<a href="/wishlist"  class="overview-home-orders-title">
			<img src="/Images/my-account/myfavorites.gif">
			<span class="overview-home-orders-title-link">{{translate 'View My Product Lists'}}</span>
		</a>
		<a href="/invoices" class="overview-home-orders-title">
			<img src="/Images/my-account/invoicehistory.gif">
			<span class="overview-home-orders-title-link">{{translate 'View Invoice History'}}</span>
		</a>
		<a href="/returns" class="overview-home-orders-title">
			<img src="/Images/my-account/returnhistory.gif">
			<span class="overview-home-orders-title-link">{{translate 'View Return History'}}</span>
			</a>
		{{!----adding extra links ----}}
	</div>
</section>
<div data-view="Overview.Banner"></div>

{{#if hasCustomerSupportURL}}
	<div class="overview-home-header-links">
		{{translate 'Need Help? Contact <a href="$(0)">Customer Service</a>' customerSupportURL}}
	</div>
{{/if}}



{{!----
Use the following context variables when customizing this template:

	collectionLengthGreaterThan0 (Boolean)
	hasCustomerSupportURL (Boolean)
	customerSupportURL (String)
	firstName (String)
	isSCISIntegrationEnabled (Boolean)
	purchasesPermissions (String)

----}}
