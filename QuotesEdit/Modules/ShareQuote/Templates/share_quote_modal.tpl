<div class="share-quote-modal-container">
    <form class="share-quote-form" action="sharequote.ss" method="POST">
        <fieldset>
        <div class="address-edit-fields-group" data-input="sendTo" data-validation="control-group">
            <label class="address-edit-fields-group-label" for="sendTo">
                {{translate 'Email'}} <span class="address-edit-fields-group-label-required">*</span>
            </label>
            <div  class="address-edit-fields-group-form-controls" data-validation="control">
                <input type="text" name="sendTo" id="sendTo" class="share-quote-email" value="{{sendTo}}">
            </div>
        </div>
        <div class="address-edit-fields-group" data-input="type" data-validation="control-group">
            <label class="address-edit-fields-group-label" for="type">
                {{translate 'Send quote as:'}} <span class="address-edit-fields-group-label-required">*</span>
            </label>
            <div  class="address-edit-fields-group-form-controls" data-validation="control">
                <label class="share-quote-type-label" for="type-link">
                    <input {{#ifEquals type 'link'}}checked{{/ifEquals}} id="type-link" type="radio" name="type" class="share-quote-radio" value="link">{{translate 'Link'}}
                </label>
                <label class="share-quote-type-label" for="type-pdf">
                    <input {{#ifEquals type 'pdf'}}checked{{/ifEquals}} id="type-pdf" type="radio" name="type" class="share-quote-radio" value="pdf">{{translate 'PDF'}}
                </label>
            </div>
        </div>
        </fieldset>
        <br>
        <button class="share-quote-button-link" type="submit">{{translate 'Share Quote'}}</button>
    </form>
</div>
