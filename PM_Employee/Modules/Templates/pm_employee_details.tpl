<tr class="employee-detail" data-employee-id="{{internalid}}"
	data-id="{{internalid}}">
	<td class="employee-detail-info">{{lastname}}, {{firstname}}</td>
	<td class="employee-detail-info">{{email}}</td>
	<td class="employee-detail-info">{{accountType.name}}</td>
	<td class="employee-detail-actions">
		{{#if showEditButtons}}
			<button data-action="edit-employee"
				class="employee-detail-edit">{{translate 'Edit'}}</button>
			<button data-action="remove-employee"
				class="employee-detail-remove">{{translate 'Remove'}}</button>
		{{/if}}
	</td>
</tr>
