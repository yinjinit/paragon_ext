<form action="#" class="product-list-new">
	{{#if inModal}}
	<div class="product-list-new-modal-body">
	{{/if}}

		<small class="product-list-new-required">
			{{translate 'Required <span class="product-list-new-form-required">*</span>'}}
		</small>

		<div data-type="alert-placeholder"></div>

        <div data-validation="control-group">
            <label for="employee-firstname" class="product-list-new-form-label">
                {{translate 'First Name <small class="product-list-new-form-required">*</small>'}}
            </label>
            <div class="product-list-new-form-controls" data-validation="control">
                <input type="text" name="firstname" id="employee-firstname" class="product-list-new-form-input" value="{{#if isEdit}}{{firstname}}{{/if}}">
            </div>
        </div>

        <div data-validation="control-group">
            <label for="employee-lastname" class="product-list-new-form-label">
                {{translate 'Last Name <small class="product-list-new-form-required">*</small>'}}
            </label>
            <div class="product-list-new-form-controls" data-validation="control">
                <input type="text" name="lastname" id="employee-lastname" class="product-list-new-form-input" value="{{#if isEdit}}{{lastname}}{{/if}}">
            </div>
        </div> 

		<div data-validation="control-group">
			<label for="employee-email" class="product-list-new-form-label">
				{{translate 'Email <small class="product-list-new-form-required">*</small>'}}
			</label>
			<div class="product-list-new-form-controls"  data-validation="control">
				<input id="employee-email" type="email" name="email" data-action="prevent-enter" class="product-list-new-form-input" value="{{#if isEdit}}{{email}}{{/if}}">
			</div>
		</div>

		<div data-validation="control-group">
			<label for="employee-confirm-email" class="product-list-new-form-label">
				{{translate 'Confirm Email <small class="product-list-new-form-required">*</small>'}}
			</label>
			<div class="product-list-new-form-controls"  data-validation="control">
				<input id="employee-confirm-email" type="email" name="confirmemail" data-action="prevent-enter" class="product-list-new-form-input">
			</div>
		</div>

		<div data-validation="control-group">
			<label for="employee-account-type" class="product-list-new-form-label">
				{{translate 'Account Type <small class="product-list-new-form-required">*</small>'}}
			</label>
			<div class="product-list-new-form-controls"  data-validation="control">
				<select class="global-views-countriesDropdown-select" id="employee-account-type" name="accounttype">
					<option value="">
						{{translate '-- Select an Account Type --'}}
					</option>
					{{#each accountType}}
						<option value="{{code}}" {{#if isActive}}selected{{/if}}>
							{{name}}
						</option>
					{{/each}}									
				</select>				
			</div>
		</div>

		<div data-validation="control-group">
			<label for="employee-password" class="product-list-new-form-label">
				{{translate 'Password <small class="product-list-new-form-required">*</small>'}}
			</label>
			<div class="product-list-new-form-controls"  data-validation="control">
				<input id="employee-password" type="password" name="password" data-action="prevent-enter" class="product-list-new-form-input" value="">
			</div>
		</div>

		<div data-validation="control-group">
			<label for="employee-password2" class="product-list-new-form-label">
				{{translate 'Confirm Password <small class="product-list-new-form-required">*</small>'}}
			</label>
			<div class="product-list-new-form-controls"  data-validation="control">
				<input id="employee-password2" type="password" name="password2" data-action="prevent-enter" class="product-list-new-form-input" value="">
			</div>
		</div>				
								                  

	{{#if inModal}}
	</div>
	{{/if}}

	<div class="{{#if inModal}}product-list-new-modal-footer{{/if}} product-list-new-form-controls-group">

		{{#if inModal}}
			<button class="product-list-new-form-cancel" data-dismiss="modal">{{translate 'Cancel'}}</button>
		{{/if}}
		<button type="submit" class="product-list-new-form-submit">
			{{translate 'Save Employee'}}
		</button>        
	</div>
</form>



{{!----
Use the following context variables when customizing this template: 
	
	inModal (Boolean)
	isEdit (Boolean)
	name (String)
	description (String)

----}}
