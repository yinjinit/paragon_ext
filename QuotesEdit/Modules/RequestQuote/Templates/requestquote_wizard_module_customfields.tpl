{{#unless hideContent}}
	<div class="requestquote-wizard-module-comments">
		<div class="requestquote-wizard-module-comments-box">

            {{#each fields}}
                <h3 class="requestquote-wizard-module-comments-title">
                    {{title}}
                    {{#if isMandatory}}
                        <span class="address-edit-fields-required">*</span>
                    {{/if}}
                </h3>
                {{#if isReadOnly}}
                    <div class="requestquote-wizard-module-comments-box-message">
                        <p>{{breaklines memo}}</p>
                    </div>
                {{else}}
                    {{#if isTextArea}}
                        <textarea data-action="validate-textarea-length" maxlength="{{maxLength}}" data-type="{{fieldId}}-input" class="requestquote-wizard-module-comments-box-textarea">{{memo}}</textarea>
                        <small class="requestquote-wizard-module-comments-box-textarea-length">{{translate 'Maximum 999 characters.'}}</small>
                    {{else}}
                        <input data-type="{{fieldId}}-input" class="requestquote-wizard-module-comments-box-input" value="{{memo}}"></input>
                    {{/if}}
                {{/if}}
            {{/each}}

		</div>
	</div>
{{/unless}}



{{!----
Use the following context variables when customizing this template:

	showTitle (Boolean)
	title (String)
	memo (String)
	isReadOnly (Boolean)
	maxLength (Number)

----}}
