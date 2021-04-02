<section class="content caseDetail pm-renewal-section-white">
    <header>
        <h2>
              {{pageHeader}}    
            <div class="pull-right hidden-phone">
                <a class="pull-right btn btn-expanded btn-primary case-list-header-button-new" href="/reminders" data-touchpoint="customercenter" data-hashtag="#/reminders">
                      {{translate '&lt; Back to Renewal Reminders'}}
                </a>
            </div>
        </h2>       
    </header>
    
      <!-- <hr class="divider-small" /> -->
    
    <div data-confirm-message class="confirm-message"></div>

    <div data-type="alert-placeholder"></div>
    
     
    <form action="#">
        <div class="control-group case-detail-add-reply row-fluid pm-renewal-spacing">

                <div name="custrecord_ng_rt_item_details" id="custrecord_ng_rt_item" class="control-group" >
                    <span class="controls">
                        {{itemName}} {{#if mpn}} <span name="pm-renewal-mpn-details-seperator">
                        (<strong class="strong-pad">MPN:</strong>{{mpn}})
                    </span> {{/if}}
                    </span>                 
                </div>
    
                <div class="case-new-message control-group">
                    <span class="controls">
                        <strong class="strong-pad">Manufacturer:</strong> {{manufacturerName}}
                    </span>                 
                </div>

                {{#if itemDescription}}
                <div class="case-new-message control-group">
                    <span class="controls">
                        {{itemDescription}} 
                    </span>
                </div> 
                {{/if}}
                
                <div class="case-new-message control-group">
                    <span class="controls">
                        <strong class="strong-pad">Quantity:</strong> {{quantity}}
                    </span>
                </div>
                
                
                <div name="pm-renewal-details-seperator">

                <div class="case-new-message control-group">
                    <span class="controls">
                        <strong class="strong-pad">Renewed:</strong> {{renewed}}
                       
                    </span>
                </div>

                <div class="case-new-message control-group">
                    <span class="controls">
                        <strong class="strong-pad">Renewal Life Cycle:</strong> {{startDate}} - {{renewalDate}}
                    </span>                 
                </div> 

                <div class="case-new-message control-group">
                    <span class="controls">
                        <strong class="strong-pad">Days to Renewal:</strong> {{days_to_renewal}} 
                    </span>                 
                </div>

                <div class="case-new-message control-group">
                    <span class="controls">
                        <strong class="strong-pad">Renewal Every:</strong> {{renewalPeriodName}} 
                    </span>
                </div>          
            
            <!--
                <div class="case-new-message control-group">
                    <span class="controls">
                        <strong class="strong-pad">Renewal Date:</strong> {{renewalDate}}
                    </span>
                </div>
            -->

                <div class="case-new-message control-group">
                    <span class="controls">
                        <strong class="strong-pad">Reminder Date:</strong> {{reminderDate}} 
                    </span>                 
                </div>   

                <div class="case-new-message control-group">
                    <span class="controls">
                        <strong class="strong-pad">Days to Reminder:</strong> {{days_to_reminder}} 
                    </span>                 
                </div>             

                <div class="case-new-message control-group">
                    <span class="controls">
                        <strong class="strong-pad">Reminder:</strong> {{reminderPeirodName}} 
                    </span>
                </div>
            </div>



                {{#if taskName}}
                <div class="case-new-message control-group">
                    <span class="controls">
                        <strong class="strong-pad">Reminder:</strong><a href="#reminder/{{taskId}}">{{taskName}}</a>
                    </span>                 
                </div>
                {{/if}}
                {{#if transactionID}}
                <div class="case-new-message control-group">
                    <span class="controls">
                        <strong class="strong-pad">{{translate 'Transaction:'}}</strong><a href="#ordershistory/view/{{transactionID}}">{{transactionName}}</a> 
                    </span>
                </div>
                {{/if}}

            <div class="row-fluid case-detail-reply-section renewal-actions">
                {{#if isEdit}}
                 EDIT
                {{/if}}
                <a class="btn btn-expanded btn-primary case-new-button-submit" data-action="edit-renewal" href="#" data-touchpoint="customercenter" data-hashtag="#editreminder/{{internalid}}">
                      EDIT
                </a>
                {{{deleteButton}}}
            </div>
        </div>
    </form>
    <br />  
</section>
<script>
    
    jQuery(document).ready(function(){

     var primaryContactId = "";

            var data = {
                email_param: '{{userContatEmail}}',
                companyid_param: '{{companyID}}'
                };
                //611 on production
                jQuery.getJSON("/app/site/hosting/scriptlet.nl?script=611&deploy=1", data, function (response) {
                    //console.log('response');
                    //console.log(response);
                    var primaryContact = response;
                    primaryContactId = primaryContact[0].id;
                    var createdByContactId = '{{createdById}}';
                    if(primaryContactId !== createdByContactId){ 
                        jQuery('[data-action="remove-renewal"]').remove();
                        jQuery('[data-action="edit-renewal"]').remove();
                        //console.log('users dont match - true'); 
                    }
                });

        });
        
</script>