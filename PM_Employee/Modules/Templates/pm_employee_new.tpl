<form action="#" class="employee-new">
	{{#if inModal}}
	<div class="employee-new-modal-body">
	{{/if}}

	<small class="employee-new-required">{{translate
		'Required <span class="form-required">*</span>'}}</small>

	<div data-type="alert-placeholder"></div>

	<div class="control-group" data-validation="control-group">
		<label for="employee-firstname">{{translate 'First Name' }} <small
			class="form-required">*</small></label>
		<div class="form-control" data-validation="control">
			<input type="text" name="firstname" id="employee-firstname"
				class="form-input" value="{{#if isEdit}}{{firstname}}{{/if}}">
		</div>
	</div>

	<div class="control-group" data-validation="control-group">
		<label for="employee-lastname">{{translate 'Last Name' }} <small
			class="form-required">*</small></label>
		<div class="form-control" data-validation="control">
			<input type="text" name="lastname" id="employee-lastname"
				class="form-input" value="{{#if isEdit}}{{lastname}}{{/if}}">
		</div>
	</div>

	<div class="control-group" data-validation="control-group">
		<label for="employee-email">{{translate 'Email' }} <small
			class="form-required">*</small></label>
		<div class="form-control" data-validation="control">
			<input id="employee-email" type="email" name="email"
				data-action="prevent-enter" class="form-input"
				value="{{#if isEdit}}{{email}}{{/if}}">
		</div>
	</div>

	<div class="control-group" data-validation="control-group">
		<label for="employee-confirm-email">{{translate 'Confirm Email' }} <small
			class="form-required">*</small></label>
		<div class="form-control" data-validation="control">
			<input id="employee-confirm-email" type="email" name="confirmemail"
				data-action="prevent-enter" class="form-input">
		</div>
	</div>

	<div class="control-group" data-validation="control-group">
		<label for="employee-account-type">{{translate 'Account Type' }} <small
			class="form-required">*</small></label>
		<div class="form-control" data-validation="control">
			<select class="global-views-countriesDropdown-select"
				id="employee-account-type" name="accounttype">
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

	<div class="control-group" data-validation="control-group">
		<label for="employee-password">{{translate
			'Password'}} <small class="form-required">*</small></label>
		<div class="form-control" data-validation="control">
			<input id="employee-password" type="password" name="password"
				data-action="prevent-enter" class="form-input"
				aria-describedby="employee-password-help" value="">
		</div>
		<small id="employee-password-help">{{translate
			'Password must be at least 8 characters long.'}}</small>
	</div>

	<div class="control-group" data-validation="control-group">
		<label for="employee-password2">{{translate 'Confirm Password' }} <small
			class="form-required">*</small></label>
		<div class="form-control" data-validation="control">
			<input id="employee-password2" type="password" name="password2"
				data-action="prevent-enter" class="form-input" value="">
		</div>
	</div>

	{{#if inModal}}
	</div>
	{{/if}}

	<div
		class="{{#if inModal}}employee-new-modal-footer{{/if}} form-control-group">

		<button type="submit" class="employee-new-form-submit">{{translate
			'Save Employee'}}</button>

		{{#if inModal}}
			<button class="employee-new-form-cancel" data-dismiss="modal">{{translate
				'Cancel'}}</button>
		{{/if}}
	</div>
</form>

{{!----
Use the following context variables when customizing this template: 
	
	inModal (Boolean)
	isEdit (Boolean)
	name (String)
	description (String)

----}}
