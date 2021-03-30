<div class="quotes-save-modal-container">
    <p>{{translate 'To save your qoute enter a name for the quote and aditional notes if applicable'}}</p>
    <div class="address-edit-fields-group" data-input="name" data-validation="control-group">
        <label class="address-edit-fields-group-label" for="name">
            {{translate 'Name for Quote'}} <span class="address-edit-fields-group-label-required">*</span>
        </label>
        <div  class="address-edit-fields-group-form-controls" data-validation="control">
            <input type="text" class="address-edit-fields-group-input" id="name" name="name" value="{{name}}">
        </div>
    </div>
    <div class="address-edit-fields-group" data-input="notes" data-validation="control-group">
        <label class="address-edit-fields-group-label" for="notes">
            {{translate 'Notes'}} <span class="address-edit-fields-group-label-required">*</span>
        </label>
        <div  class="address-edit-fields-group-form-controls" data-validation="control">
            <textarea class="address-edit-fields-group-input" id="notes" name="notes">{{notes}}</textarea>
        </div>
    </div>
</div>