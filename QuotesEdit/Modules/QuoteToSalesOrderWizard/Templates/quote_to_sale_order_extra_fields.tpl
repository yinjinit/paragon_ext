<div class="order-wizard-quote-to-sale-order-extra-fields">
    <h3 class="order-wizard-quote-to-sale-order-title">{{translate 'Quotes Extra Fields'}}</h3>
    <div class="order-wizard-quote-to-sale-order-row">
        <div class="order-wizard-quote-to-sale-order-column">
            <label for="purchase-order-number" class="order-wizard-quote-to-sale-order-label">
                {{translate 'PO Number'}}
            </label>
            {{#if isReview}}
                {{purchaseNumber}}
            {{else}}
                <input type="text" name="purchase-order-number" id="purchase-order-number"
                       class="order-wizard-quote-to-sale-order-value" value="{{purchaseNumber}}">
            {{/if}}
        </div>
        <div class="order-wizard-quote-to-sale-order-column">
            <label for="cost-centre" class="order-wizard-quote-to-sale-order-label">
                {{translate 'Cost Center'}} <span class="order-wizard-quote-to-sale-order-optional"> {{translate '(Optional)' }} </span>
            </label>
            {{#if isReview}}
                {{costCenter}}
            {{else}}
                <input type="text" name="cost-centre" id="cost-centre"
                       class="order-wizard-quote-to-sale-order-value" value="{{costCenter}}">
            {{/if}}
        </div>
    </div>
    <div class="order-wizard-quote-to-sale-order-row">
        <div class="order-wizard-quote-to-sale-order-column">
            <label for="quote-name" class="order-wizard-quote-to-sale-order-label">
                {{translate 'Name'}} <span class="order-wizard-quote-to-sale-order-optional">{{translate '(Optional)' }} </span>
            </label>
            {{#if isReview}}
                {{name}}
            {{else}}
                <input type="text" name="quote-name" id="quote-name"
                       class="order-wizard-quote-to-sale-order-value" value="{{name}}">
            {{/if}}
        </div>
        <div class="order-wizard-quote-to-sale-order-column">
            <label for="quote-notes" class="order-wizard-quote-to-sale-order-label">
                {{translate 'Notes'}} <span class="order-wizard-quote-to-sale-order-optional"> {{translate '(Optional)' }} </span>
            </label>
            {{#if isReview}}
                {{notes}}
            {{else}}
                <textarea name="quote-notes" id="quote-notes"
                          class="order-wizard-quote-to-sale-order-notes-value">{{notes}}</textarea>
            {{/if}}
        </div>
    </div>
</div>

