<script>
jQuery(document).ready(function(){

    jQuery('[name ="custrecord_ng_rt_start_date"]').val('{{{initialStartDateDisplay}}}');
    jQuery('[name ="custrecord_ng_rt_renewal_date"]').val('{{{initalRenewalDisplaylDate}}}');
    jQuery('[name ="custrecord_ng_rt_reminder_date"]').val('{{{initalReminderDisplayDate}}}');
});
    
</script>
<section class="newCase pm-renewal-section">
    <header>
        <h2>{{pageHeader}}
             <a class="pull-right btn btn-expanded btn-primary case-list-header-button-new" href="/reminders" data-touchpoint="customercenter" data-hashtag="#/reminders">
            {{translate '&lt; Back to Renewal Reminders'}}
        </a>
        </h2> 
         
    </header>

    <hr class="divider-small" />
    
    <div data-type="alert-placeholder"></div>

    <form action="#">
        <input type="hidden" name="custrecord_ng_rt_company" id="custrecord_ng_rt_company" value="{{user}}"></input>
        <!-- <input type="hidden" name="custrecord_ng_rt_primary_contact" id="custrecord_ng_rt_primary_contact" value=""></input> -->
        <input type="hidden" name="custrecord_ng_rt_primary_contact" id="custrecord_ng_rt_primary_contact" value="{{primaryContactId}}"></input> 
        <input type="hidden" name="custrecord_ng_rt_show_in_my_account" id="custrecord_ng_rt_show_in_my_account" value="T"></input>
        <input type="hidden" name="custrecord_ng_rt_added_by_customer" id="custrecord_ng_rt_added_by_customer" value="T"></input>
        <input type="hidden" name="custrecord_ng_rt_renewed" id="custrecord_ng_rt_renewed" value="F"></input>

        <input type="hidden" name="custrecord_ng_rt_start_date_hidden" id="custrecord_ng_rt_start_date_hidden" value="{{{initialStartDateHidden}}}"></input>
        <input type="hidden" name="custrecord_ng_rt_renewal_date_hidden" id="custrecord_ng_rt_renewal_date_hidden" value="{{{initalRenewalDateHidden}}}"></input>
        <input type="hidden" name="custrecord_ng_rt_reminder_date_hidden" id="custrecord_ng_rt_reminder_date_hidden" value="{{{initalReminderHiddenDate}}}"></input>
        
        <div class="case-new-subject control-group">
            <label for="custrecord_ng_rt_item" class="case-new-form-label"> {{translate 'Renewal Name'}} </label>
            <span class="controls">
                <input type="text" name="custrecord_ng_rt_item" id="custrecord_ng_rt_item" class="form-control input-xlarge input-case-title case-new-form-input" value="" maxlength="300"></input>
            </span>
        </div>

        <div class="case-new-subject control-group">
            <label for="custrecord_ng_rt_manufacturer" class="case-new-form-label">  {{translate 'Manufacturer'}} </label>
            <span class="controls">
                
                <input type="text" name="custrecord_ng_rt_manufacturer" id="custrecord_ng_rt_manufacturer" class="form-control input-xlarge input-case-title case-new-form-inpu" value="" maxlength="300"></input>
                
            </span>
        </div>

        <div class="case-new-subject control-group">
            <label for="custrecord_ng_rt_mpn" class="case-new-form-label"> {{translate 'MPN'}}  </label>
            <span class="controls">
                <input type="text" name="custrecord_ng_rt_mpn" id="custrecord_ng_rt_mpn" class="form-control input-xlarge input-case-title case-new-form-input" value="" maxlength="300"></input>
            </span>
        </div>

        <div class="case-new-message control-group">
            <label for="message" class="case-new-form-label">  {{translate 'Description'}} </label>
            <span class="controls">
                <textarea name="custrecord_ng_rt_item_description" id="custrecord_ng_rt_item_description" class="form-control input-xlarge input-custrecord_ng_rt_item_description case-new-form-textarea"></textarea>
            </span>
        </div>      

        <div class="case-new-subject control-group">
            <label for="custrecord_ng_rt_quantity" class="case-new-form-label">{{translate 'Quantity'}} </label>
            <span class="controls">
                <input type="number" name="custrecord_ng_rt_quantity" id="custrecord_ng_rt_quantity" class="form-control input-xlarge input-case-title case-new-form-input" value="{{quantity}}"></input>
            </span>
        </div>

        <div class="case-new-subject control-group">
            <label for="custrecord_ng_rt_start_date" class="case-new-form-label" class="case-new-form-label">  {{translate 'Start Date'}} </label>
            <span class="controls">
                <input type="date" name="custrecord_ng_rt_start_date" data-action="change-start" id="custrecord_ng_rt_start_date" class="form-control input-xlarge input-case-title case-new-form-input" value=""></input>
            </span>
        </div>    

        <div class="case-new-renewals control-group">                           
            <label for="renewals" class="case-new-form-label">  {{translate 'Renew In'}} </label>
            <select name="custrecord_ng_rt_renewal_period" data-action="change-renewal" id="custrecord_ng_rt_renewal_period" class="form-control input-xlarge select-case-renewals case-new-form-input">
                {{{renewalSelect}}}
            </select>
            <div class="row-fluid message-container" style="margin-top:-10px;" data-type="accordion">

                <a href="#" data-action="items-expander" style="font-size:small;"> {{translate 'Custom date? Add it here'}} <i class="icon-plus"></i></a>
                <div data-content="items-body" style="display: none;">
                    <div class="row-fluid nav-tabs">
                        <div class="span12">
                            <div class="main-container">
                                <div class="span12">
                                    <div class="message-content">
                                        <div class="quote-contact control-group">
                                            <div data-type="contact-form-placeholder">
                                                <div class="case-new-subject control-group">
                                                    <label for="custrecord_ng_rt_renewal_date" class="case-new-form-label"> {{translate 'Renewal Date'}} </label>
                                                    <span class="controls">
                                                        <input type="date" data-action="change-renewal-date" name="custrecord_ng_rt_renewal_date" id="custrecord_ng_rt_renewal_date" value="" placeholder="mm/dd/yyyy" class="form-control input-xlarge input-case-title case-new-form-input" value=""></input>
                                                    </span>
                                                </div>                                                  
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            
        </div>      



        <div class="case-new-reminders control-group">                          
            <label for="reminders" class="case-new-form-label">  {{translate 'Remind In'}} </label>
            <select name="custrecord_ng_rt_reminder_period" data-action="change-reminder" id="custrecord_ng_rt_reminder_period" class="form-control input-xlarge select-case-reminders case-new-form-input">
                {{{remindersSelect}}}
            </select>
            <div class="row-fluid message-container" style="margin-top:-10px;" data-type="accordion">

                <a href="#" data-action="items-expander" style="font-size:small;">{{translate 'Custom date? Add it here'}} <i class="icon-plus"></i></a>
                <div data-content="items-body" style="display: none;">
                    <div class="row-fluid nav-tabs">
                        <div class="span12">
                            <div class="main-container">
                                <div class="span12">
                                    <div class="message-content">
                                        <div class="quote-contact control-group">
                                            <div data-type="contact-form-placeholder">
                                                <div class="case-new-subject control-group">
                                                    <label for="custrecord_ng_rt_reminder_date" class="case-new-form-label">  {{translate 'Reminder Date'}}  </label>
                                                    <span class="controls">
                                                        <input type="date" data-action="change-reminder-date" name="custrecord_ng_rt_reminder_date" id="custrecord_ng_rt_reminder_date" value="" placeholder="mm/dd/yyyy" class="form-control input-xlarge input-case-title case-new-form-input" value="{{{initalReminderDisplayDate}}}"></input>
                                                    </span>
                                                </div>                                                 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>               
        </div>

        <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-case-submit case-new-button-submit">  {{translate 'Add Reminder'}} </button>
        </div>
    </form>
</section>
<script>
    
var slURL = '/app/site/hosting/scriptlet.nl?script=609&deploy=1';

 (function($) {
    jQuery.getJSON( slURL, function() {} )
        .done(function(response) {  
            //console.log(response );
            var selectTopPart = '<select name="custrecord_ng_rt_manufacturer" id="custrecord_ng_rt_manufacturer" class="form-control input-xlarge case-new-form-case-category">';
            var selectBottomPart = '</select>';
            var selectOptions = '';

            var manufacturerSelect = response;

            for (i = 0; i < manufacturerSelect.length; i++) {
               selectOptions += '<option value="' + manufacturerSelect[i].id + '">' + manufacturerSelect[i].name + '</option>';
            }

            var selectBuild = selectTopPart + selectOptions + selectBottomPart;
            //console.log(selectBuild);
            $(selectBuild).replaceAll("#custrecord_ng_rt_manufacturer");
     
        })
       

        .fail(function() {
            
            console.log( "error: no netsuite data?" );                   
        })

        .always(function() {
            console.log( "complete" );
            });             

})(jQuery);

</script>
<script>
    
    jQuery(document).ready(function(){

     var primaryContactId = "";

            var data = {
                email_param: '{{primaryContatEmail}}',
                companyid_param: '{{user}}'
                };

                //PM Primary Contact ID Search
                //primaryContactSelectSearch.js
                  // on production production
                 //app/site/hosting/scriptlet.nl?script=611&deploy=1                
                 //502 on sandbox
                jQuery.getJSON("/app/site/hosting/scriptlet.nl?script=611&deploy=1", data, function (response) {
                    //console.log('response');
                    //console.log(response);
                    var primaryContact = response;
                     primaryContactId = primaryContact[0].id;
                    //console.log(response);
                    jQuery('[name="custrecord_ng_rt_primary_contact"]').val(primaryContactId);
                    //console.log('primaryContactId: ' + primaryContactId);
                });          

            //console.log('primaryContactId: ' + primaryContactId);
        });
        
</script>   