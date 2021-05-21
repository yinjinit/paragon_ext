<form action="#" class="product-list-new">
	{{#if inModal}}
	<div class="product-list-new-modal-body">
	{{/if}}

		<small class="product-list-new-required">
			{{translate 'Required <span class="product-list-new-form-required">*</span>'}}
		</small>

		<div data-type="alert-placeholder"></div>

		{{!---- Status----}}
		<div data-validation="control-group">
			<label for="approval-status" class="product-list-new-form-label">
				{{translate 'Status <small class="product-list-new-form-required">*</small>'}}
			</label>
			<div class="product-list-new-form-controls"  data-validation="control">
				<select class="global-views-countriesDropdown-select" id="approval-status" name="custrecord_cpas_os_status">
					<option value="">
						{{translate '-- Select a status --'}}
					</option>
					{{#each custrecord_cpas_os_status}}
						<option value="{{code}}" {{#if isActive}}selected{{/if}}>
							{{name}}
						</option>
					{{/each}}									
				</select>				
			</div>
		</div>
		{{!---- Comments ----}}
        <div data-validation="control-group">
            <label for="approval-comments" class="product-list-new-form-label">
                {{translate 'Comments'}}
            </label>
            <div class="product-list-new-form-controls" data-validation="control">
                <input type="textarea" name="custrecord_cpas_os_comments" id="approval-comments" class="product-list-new-form-input">
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
