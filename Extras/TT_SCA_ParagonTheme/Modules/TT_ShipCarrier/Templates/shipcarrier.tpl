<div class="profile-information">
	<h2 class="profile-information-header">{{pageHeader}}</h2>

	<div data-type="alert-placeholder"></div>
	<section class="profile-information-row-fluid">

		<div class="profile-information-col">
			<form class="contact_info">
				<fieldset>

					<small class="profile-information-form-label">{{translate 'Required'}} <span
							class="profile-information-form-group-label-required">*</span></small>

					<div class="profile-information-row" data-input="carrier" data-validation="control-group">
						<label class="profile-information-label" for="carrier">{{translate 'Carrier'}}
							<span class="profile-information-input-required">*</span>
						</label>
						<div class="profile-information-group-form-controls" data-validation="control">
							<select class="global-views-countriesDropdown-select" id="carrier" name="carrier"
								data-action="select-account-type">
								<option value="">
									{{translate '-- Select a Carrier --'}}
								</option>
								{{#each carriers}}
								<option value="{{id}}">
									{{name}}
								</option>
								{{/each}}
							</select>
						</div>
					</div>

					<div class="profile-information-row" data-input="accountNumber" data-validation="control-group">
						<label class="profile-information-label" for="accountNumber">{{translate 'Account Number'}}
							<span class="profile-information-input-required">*</span>
						</label>
						<div class="profile-information-group-form-controls" data-validation="control">
							<input type="text" class="profile-information-input-large" id="accountNumber" name="accountNumber"
								value="{{accountNumber}}">
						</div>
					</div>

				</fieldset>
				<div class="profile-information-form-actions">
					<button type="submit" class="profile-information-button-update">{{translate 'Update'}}</button>
				</div>
			</form>
		</div>
	</section>
</div>




{{!----
Use the following context variables when customizing this template:

	accountNumber (String)
	carriers (Boolean)

----}}














<!-- 
<form action="#" class="shipcarrier-new">
	{{#if inModal}}
	<div class="shipcarrier-modal-body">
		{{/if}}

		<small class="shipcarrier-required">
			{{translate 'Required <span class="shipcarrier-form-required">*</span>'}}
		</small>

		<div data-type="alert-placeholder"></div>

		<div data-validation="control-group">
			<label for="carrier" class="shipcarrier-form-label">
				{{translate 'Carrier <small class="shipcarrier-form-required">*</small>'}}
			</label>
			<div class="shipcarrier-form-controls" data-validation="control">
				<select class="global-views-countriesDropdown-select" id="carrier" name="accountType"
					data-action="select-account-type">
					<option value="">
						{{translate '-- Select a Carrier --'}}
					</option>
					{{#each carriers}}
					<option value="{{id}}">
						{{name}}
					</option>
					{{/each}}
				</select>
			</div>
		</div>

		<div data-validation="control-group">
			<label for="accountNumber" class="shipcarrier-form-label">
				{{translate 'Account Number <small class="shipcarrier-form-required">*</small>'}}
			</label>
			<div class="shipcarrier-form-controls" data-validation="control">
				<input type="text" name="carrier" id="accountNumber" class="shipcarrier-form-input"
					value="{{#if isEdit}}{{accountNumber}}{{/if}}">
			</div>
		</div>

		{{#if inModal}}
	</div>
	{{/if}}

	<div class="{{#if inModal}}shipcarrier-modal-footer{{/if}} shipcarrier-form-controls-group">

		{{#if inModal}}
		<button class="shipcarrier-form-cancel" data-dismiss="modal">{{translate 'Cancel'}}</button>
		{{/if}}
		<button type="submit" class="shipcarrier-form-submit">
			{{translate 'Save'}}
		</button>
	</div>
</form>
-->