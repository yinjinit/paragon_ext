{{log this}} 
<section class="pmrenewal-info-card">
    <span class="pmrenewal-info-card-content">
      {{message}}
    </span>
</section>

<section class="content caseDetail">
    <header>
        <a href="/reminders" class="back-btn">translate '&lt; Back to Renewal Reminders'</a>        
    </header>   
    
    <hr class="divider-small" />
    
    <div data-confirm-message class="confirm-message"></div>

    <div data-type="alert-placeholder"></div>

    <hr class="divider-small" />    
    <form action="#">
        <div class="control-group case-detail-add-reply row-fluid">
            <div class="container" style="padding: 10px;">
                <div class="span6">
                    <span class="controls">
                        <strong style="padding-right: 5px;">Company:</strong>custrecord_ng_rt_company.name
                    </span>
                </div>
                <div class="span6">
                    <span class="controls">
                        <strong style="padding-right: 5px;">Transaction:</strong><a href="#ordershistory/view/custrecord_ng_rt_transaction'.id">custrecord_ng_rt_transaction.name</a> 
                    </span>
                </div>
            </div>
            <div class="container" style="padding: 10px;">
                <div class="span6">
                    <span class="controls">
                        <strong style="padding-right: 5px;">Renewed:</strong>(model.get('custrecord_ng_rt_renewed') == 'F') ? 'No' : 'Yes'
                    </span>
                </div>
                <div class="span6">
                    <span class="controls">
                        <strong style="padding-right: 5px;">Item:</strong>(model.get('custrecord_ng_rt_item').name) ? model.get('custrecord_ng_rt_item').name : model.get('custrecord_ng_rt_item')
                    </span>                 
                </div>              
            </div>      
            <div class="container" style="padding: 10px;">
                <div class="span6">
                    <span class="controls">
                        <strong style="padding-right: 5px;">Quantity:</strong>model.get('custrecord_ng_rt_quantity')
                    </span>
                </div>
                <div class="span6">
                    <span class="controls">
                        <strong style="padding-right: 5px;">Manufacturer:</strong> model.get('custrecord_ng_rt_manufacturer').name
                    </span>                 
                </div>              
            </div>  
            <div class="container" style="padding: 10px;">
                <div class="span6">
                    <span class="controls">
                        <strong style="padding-right: 5px;">MPN:</strong>model.get('custrecord_ng_rt_mpn')
                    </span>
                </div>
                <div class="span6">
                    <span class="controls">
                        <strong style="padding-right: 5px;">Reminder:</strong><a href="#reminder/model.get('custrecord_ng_rt_task').id">model.get('custrecord_ng_rt_task').name</a>
                    </span>                 
                </div>              
            </div>      
            <div class="container" style="padding: 10px;">
                <div class="span6">
                    <span class="controls">
                        <strong style="padding-right: 5px;">Renewal Date:</strong> model.get('custrecord_ng_rt_renewal_date') 
                    </span>
                </div>
                <div class="span6">
                    <span class="controls">
                        <strong style="padding-right: 5px;">Reminder Date:</strong> model.get('custrecord_ng_rt_reminder_date') 
                    </span>                 
                </div>              
            </div>  
            <div class="container" style="padding: 10px;">
                <div class="span6">
                    <span class="controls">
                        <strong style="padding-right: 5px;">Remind Every:</strong> model.get('custrecord_ng_rt_renewal_period').name 
                    </span>
                </div>
                <div class="span6">
                    <span class="controls">
                        <strong style="padding-right: 5px;">Start Date:</strong> model.get('custrecord_ng_rt_start_date') 
                    </span>                 
                </div>          
            </div>      
            <div class="container" style="padding: 10px;">
                <div class="span12">
                    <span class="controls">
                        <strong style="padding-right: 5px;">Description:</strong> model.get('custrecord_ng_rt_item_description') 
                    </span>
                </div>
            </div>                

<!--            <div class="row-fluid">
                <label for="title">Item</label>
                <span class="controls">
                    <input type="text" name="custrecord_ng_rt_item" id="custrecord_ng_rt_item" class="form-control input-large" value=" model.get('custrecord_ng_rt_item').name " maxlength="300">
                </span>
            </div>   -->  
            <div class="row-fluid case-detail-reply-section">
                {{#if isEdit}}
                 EDIT
                {{/if}}
                <a data-id="  model.get('internalid')  " data-action="edit-renewal" class="btn-reply btn btn-primary btn-expanded">Edit</a>
            </div>
        </div>
    </form>
    <br />  
</section>