{{#if showBackToAccount}}
  <a href="/" class="address-list-button-back">
    <i class="address-list-button-back-icon"></i>
    {{translate 'Back to Account'}}
  </a>
{{/if}}

<section class="address-list">
  <h2>{{pageHeader}}</h2>

  <div id="addressSearchDropdown" class="dropdown-content">
    <input type="text"
      placeholder="Search By Name, Address, City, State, Zip, Country"
      id="addrSearchInput">
    {{#each addressList}}
      <div class="addressItem">
        <span href="#">{{address}}</span>
        <a class="btn btn-primary selectAddress" data-action="select"
          data-id="{{internalid}}" id="{{internalid}}"
          style="float: right; margin-left: 5px;"
          addrId="{{internalid}}">Select</a>
        <button style="float: right;" class="btn btn-primary updateAddress"
          addrId="{{internalid}}">Edit
        </button>
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
