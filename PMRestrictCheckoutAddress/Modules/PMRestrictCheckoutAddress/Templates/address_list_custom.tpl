{{#if showBackToAccount}}
  <a href="/" class="address-list-button-back">
    <i class="address-list-button-back-icon"></i>
    {{translate 'Back to Account'}}
  </a>
{{/if}}

<section class="address-list">
  <h2>{{pageHeader}}</h2>

  <div class="order-wizard-address-cell4">
    <a class="address-details-new-address"
      href="/addressbook/new"
      data-toggle="show-in-modal">
      <div class="address-details-new-address-title">
        <p><i class="address-details-new-address-plus-icon"></i></p>
        {{translate 'Add Address'}}
      </div>
    </a>
  </div>
  <div id="addressSearchDropdown" class="dropdown-content">
    <input type="text"
      placeholder="Search By Name, Address, City, State, Zip, Country"
      id="addrSearchInput">
    {{#each addressList}}
      <div class="addressItem">
        <div class="addressItemContent">
          <span>{{address}}</span>
          <a class="btn btn-primary selectAddress" data-action="remove"
            data-id="{{internalid}}" id="{{internalid}}"
            addrId="{{internalid}}">Remove</a>

          <button class="btn btn-primary updateAddress"
            addrId="{{internalid}}">Edit
          </button>
        </div>
      </div>
    {{/each}}
  </div>

  <div class="address-list-default-addresses">
    <div data-view="Addresses.Collection"></div>
  </div>
</section>




{{!----
Use the following context variables when customizing this template:

	pageHeader (String)
	isAddressCollectionLengthGreaterThan0 (Boolean)
	showBackToAccount (Boolean)

----}}
