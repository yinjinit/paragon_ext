<form action="#" class="product-list-new">
	{{#if inModal}}
	<div class="product-list-new-modal-body">
	{{/if}}

		<small class="product-list-new-required">
			{{translate 'Required <span class="product-list-new-form-required">*</span>'}}
		</small>

		<div data-type="alert-placeholder"></div>

		{{!---- Rule Name----}}
        <div data-validation="control-group">
            <label for="purchaserule-name" class="product-list-new-form-label">
                {{translate 'Rule Name <small class="product-list-new-form-required">*</small>'}}
            </label>
            <div class="product-list-new-form-controls" data-validation="control">
                <input type="text" name="name" id="purchaserule-name" class="product-list-new-form-input" value="{{#if isEdit}}{{name}}{{/if}}">
            </div>
        </div>
		{{!---- Employee----}}
		<div data-validation="control-group">
			<label for="purchaserule-employee" class="product-list-new-form-label">
				{{translate 'Employee <small class="product-list-new-form-required">*</small>'}}
			</label>
			<div class="product-list-new-form-controls"  data-validation="control">
				<select class="global-views-countriesDropdown-select" id="purchaserule-employee" name="custrecord_cpas_rules_customerid_">
					<option value="">
						{{translate '-- Select an Employee --'}}
					</option>
					{{#each custrecord_cpas_rules_customerid}}
						<option value="{{code}}" {{#if isActive}}selected{{/if}}>
							{{name}}
						</option>
					{{/each}}									
				</select>				
			</div>
		</div>
		{{!---- Rule Type----}}
		<div data-validation="control-group">
			<label for="purchaserule-ruletype" class="product-list-new-form-label">
				{{translate 'Rule Type <small class="product-list-new-form-required">*</small>'}}
			</label>
			<div class="product-list-new-form-controls"  data-validation="control">
				<select class="global-views-countriesDropdown-select" id="purchaserule-ruletype" name="custrecord_cpas_rules_type_">
					<option value="">
						{{translate '-- Select a Rule Type --'}}
					</option>
					{{#each custrecord_cpas_rules_type}}
						<option value="{{code}}" {{#if isActive}}selected{{/if}}>
							{{name}}
						</option>
					{{/each}}									
				</select>				
			</div>
		</div>
		{{!---- Amount Limit----}}
        <div data-validation="control-group">
            <label for="purchaserule-amount-limit" class="product-list-new-form-label">
                {{translate 'Amount Limit'}}
            </label>
            <div class="product-list-new-form-controls" data-validation="control">
                <input type="text" name="amountlimit" id="purchaserule-amount-limit" class="product-list-new-form-input" value="{{#if isEdit}}{{amountlimit}}{{/if}}">
            </div>
        </div>
		{{!---- Enforce Approval Order----}}
        <div data-validation="control-group">
            <label class="product-list-new-form-label">
				<input type="checkbox" id="purchaserule-enforce" value="T" data-unchecked-value="F" name="custrecord_cpas_rules_enforce_order" {{#if custrecord_cpas_rules_enforce_order}}checked{{/if}}>
				{{translate 'Enforce Approval Order'}}                
            </label>
        </div>		
		{{!---- Approver----}}
		<div data-validation="control-group">
			<label for="purchaserule-approver" class="product-list-new-form-label">
				{{translate 'Approver <small class="product-list-new-form-required">*</small>'}}
			</label>
			<div class="product-list-new-form-controls"  data-validation="control">
				<select class="global-views-countriesDropdown-select" id="purchaserule-approver" name="custrecord_cpas_rules_approver1_">
					<option value="">
						{{translate '-- Select an Approver --'}}
					</option>
					{{#each custrecord_cpas_rules_approver1}}
						<option value="{{code}}" {{#if isActive}}selected{{/if}}>
							{{name}}
						</option>
					{{/each}}									
				</select>				
			</div>
		</div>
		{{!---- Second Approver----}}
		<div data-validation="control-group">
			<label for="purchaserule-second-approver" class="product-list-new-form-label">
				{{translate 'Second Approver (optional)'}}
			</label>
			<div class="product-list-new-form-controls"  data-validation="control">
				<select class="global-views-countriesDropdown-select" id="purchaserule-second-approver" name="custrecord_cpas_rules_approver2_">
					<option value="">
						{{translate '-- Select an Approver --'}}
					</option>
					{{#each custrecord_cpas_rules_approver2}}
						<option value="{{code}}" {{#if isActive}}selected{{/if}}>
							{{name}}
						</option>
					{{/each}}									
				</select>				
			</div>
		</div>
		{{!----Third Approver----}}
		<div data-validation="control-group">
			<label for="purchaserule-third-approver" class="product-list-new-form-label">
				{{translate 'Third Approver (optional)'}}
			</label>
			<div class="product-list-new-form-controls"  data-validation="control">
				<select class="global-views-countriesDropdown-select" id="purchaserule-third-approver" name="custrecord_cpas_rules_approver3_">
					<option value="">
						{{translate '-- Select an Approver --'}}
					</option>
					{{#each custrecord_cpas_rules_approver3}}
						<option value="{{code}}" {{#if isActive}}selected{{/if}}>
							{{name}}
						</option>
					{{/each}}									
				</select>				
			</div>
		</div>
		{{!----Fourth Approver----}}
		<div data-validation="control-group">
			<label for="purchaserule-fourth-approver" class="product-list-new-form-label">
				{{translate 'Fourth Approver (optional)'}}
			</label>
			<div class="product-list-new-form-controls"  data-validation="control">
				<select class="global-views-countriesDropdown-select" id="purchaserule-fourth-approver" name="custrecord_cpas_rules_approver4_">
					<option value="">
						{{translate '-- Select an Approver --'}}
					</option>
					{{#each custrecord_cpas_rules_approver4}}
						<option value="{{code}}" {{#if isActive}}selected{{/if}}>
							{{name}}
						</option>
					{{/each}}									
				</select>				
			</div>
		</div>
		{{!----Fifth Approver----}}
		<div data-validation="control-group">
			<label for="purchaserule-fifth-approver" class="product-list-new-form-label">
				{{translate 'Fifth Approver (optional)'}}
			</label>
			<div class="product-list-new-form-controls"  data-validation="control">
				<select class="global-views-countriesDropdown-select" id="purchaserule-fifth-approver" name="custrecord_cpas_rules_approver5_">
					<option value="">
						{{translate '-- Select an Approver --'}}
					</option>
					{{#each custrecord_cpas_rules_approver5}}
						<option value="{{code}}" {{#if isActive}}selected{{/if}}>
							{{name}}
						</option>
					{{/each}}									
				</select>				
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
			{{translate 'Submit'}}
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
