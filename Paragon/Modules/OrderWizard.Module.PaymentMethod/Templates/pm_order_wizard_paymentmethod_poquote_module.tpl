<div class="order-wizard-paymentmethod-poquote-module">
  <h3 class="order-wizard-paymentmethod-poquote-module-title">
    {{translate 'Purchase Order & Quotes'}}
  </h3>
  <div class="row">
    <div class="col-md-6">
      <label>
        <span
          class="order-wizard-paymentmethod-poquote-module-label">{{translate
          'Purchase Order Number'}} <span
          class="order-wizard-paymentmethod-poquote-module-optional">{{ translate
          '(Optional)' }}</span></span>
        <input
          type="text"
          name="purchase-order-number"
          class="order-wizard-paymentmethod-poquote-module-value"
          value="{{purchaseNumber}}">
      </label>
    </div>
    <div class="col-md-6">
      <label>
        <span
          class="order-wizard-paymentmethod-poquote-module-label">{{translate
          'Cost Center'}} <span
          class="order-wizard-paymentmethod-poquote-module-optional">{{translate
          '(Optional)' }}</span></span>
        <input type="text" name="cost-centre"
          class="order-wizard-paymentmethod-poquote-module-value"
          value="{{costCenter}}">
      </label>
    </div>
    <div class="col-md-6">
      <label>
        <span
          class="order-wizard-paymentmethod-poquote-module-label">{{translate
          'Name'}} <span
          class="order-wizard-paymentmethod-poquote-module-optional">{{translate
          '(Optional)' }}</span></span>
        <input type="text" name="quote-name"
          class="order-wizard-paymentmethod-poquote-module-value"
          value="{{name}}">
      </label>
    </div>
    <div class="col-md-6">
      <label>
        <span
          class="order-wizard-paymentmethod-poquote-module-label">{{translate
          'Notes'}} <span
          class="order-wizard-paymentmethod-poquote-module-optional">{{translate
          '(Optional)' }}</span></span>
        <textarea name="quote-notes"
          class="order-wizard-paymentmethod-poquote-module-value">{{notes}}</textarea>
      </label>
    </div>
  </div>
</div>

{{!----
Use the following context variables when customizing this template:

  purchaseNumber (String)
  costCenter (String)
  name (String)
  notes (String)

----}}
