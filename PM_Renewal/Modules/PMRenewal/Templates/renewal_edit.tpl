<script>
jQuery(document).ready(function(){
    jQuery('[name ="custrecord_ng_rt_start_date"]').val('{{{startDate}}}');
    jQuery('[name ="custrecord_ng_rt_renewal_date"]').val('{{{renewalDate}}}');
    jQuery('[name ="custrecord_ng_rt_reminder_date"]').val('{{{reminderDate}}}');

    var renewalPeriodId = '{{renewalPeriodId}}';
    if(parseInt(renewalPeriodId) === 6){
        //jQuery('.case-new-reminders [data-action="items-expander"]').trigger( "click" );
        //jQuery('.case-new-reminders a[data-action="items-expander"]').first().click();
        //jQuery('.case-new-reminders a.reminders-expander').trigger( "click" );
        
        jQuery('.case-new-renewals').first().find('a[data-action="items-expander"]').trigger("click");
    }

    var reminderPeriodId = '{{reminderPeriodId}}';
    if(parseInt(reminderPeriodId) === 7){
        //jQuery('.case-new-renewals [data-action="items-expander"]').trigger( "click" );
        //jQuery('.case-new-renewals').find('a[data-action="items-expander"]').click();
    //jQuery('.case-new-renewals [data-action="items-expander"]').first().click();
    //jQuery('.case-new-renewals').first().find('a[data-action="items-expander"]').trigger("click");
    jQuery('.case-new-reminders').first().find('a[data-action="items-expander"]').trigger("click");
    }
});
</script>

<section class="newCase pm-renewal-section">
    <header>
        <h2> 
        {{pageHeader}} 
        <a class="pull-right btn btn-expanded btn-primary case-list-header-button-new" href="/reminders" data-touchpoint="customercenter" data-hashtag="#/reminders">
            {{translate '&lt; Back to Renewal Reminders'}}
        </a>
        </h2>
            
    </header>
    <hr class="divider-small" />
   
    <div data-type="alert-placeholder"></div>

    <form action="#">
        <input type="hidden" name="custrecord_ng_rt_company" id="custrecord_ng_rt_company" value="{{userID}}"></input>
        <input type="hidden" name="internalid" id="internalid" value="{{internalid}}"></input>
        <input type="hidden" name="custrecord_ng_rt_primary_contact" id="custrecord_ng_rt_primary_contact" value="{{primaryContactID}}"></input>
        <input type="hidden" name="custrecord_ng_rt_show_in_my_account" id="custrecord_ng_rt_show_in_my_account" value="{{renewed}}"></input>
        <input type="hidden" name="custrecord_ng_rt_added_by_customer" id="custrecord_ng_rt_added_by_customer" value="T"></input>
        <input type="hidden" name="custrecord_ng_rt_renewed" id="custrecord_ng_rt_renewed" value="{{renewed}}"></input>
        
        <!-- dates -->
        <input type="hidden" name="custrecord_ng_rt_start_date_hidden" id="custrecord_ng_rt_start_date_hidden" value="{{startDateHidden}}"></input>
        <input type="hidden" name="custrecord_ng_rt_renewal_date_hidden" id="custrecord_ng_rt_renewal_date_hidden" value="{{renewalDateHidden}}"></input>
        <input type="hidden" name="custrecord_ng_rt_reminder_date_hidden" id="custrecord_ng_rt_reminder_date_hidden" value="{{reminderDateHidden}}"></input>

        <div class="case-new-subject control-group">
            <label for="custrecord_ng_rt_item" class="case-new-form-label"> {{translate 'Renewal Name'}} </label>
            <span class="controls">
                <input type="text" name="custrecord_ng_rt_item" id="custrecord_ng_rt_item" class="form-control input-xlarge input-case-title case-new-form-input" value="{{itemName}}" maxlength="300"></input>
            </span>
        </div>

        <div class="case-new-subject control-group">
            <label for="custrecord_ng_rt_manufacturer" class="case-new-form-label"> {{translate 'Manufacturer'}}  </label>
            <span class="controls">
            {{{manufactureSelectBuild}}}
            </span>
        </div>

        <div class="case-new-subject control-group">
            <label for="custrecord_ng_rt_mpn" class="case-new-form-label"> {{translate 'MPN'}}  </label>
            <span class="controls">
                <input type="text" name="custrecord_ng_rt_mpn" id="custrecord_ng_rt_mpn" class="form-control input-xlarge input-case-title case-new-form-input" value="{{mpn}}" maxlength="300"></input>
            </span>
        </div>

        <div class="case-new-message control-group">
            <label for="message" class="case-new-form-label"> {{translate 'Description'}}  : </label>
            <span class="controls">
                <textarea name="custrecord_ng_rt_item_description" id="custrecord_ng_rt_item_description" class="form-control input-xlarge input-custrecord_ng_rt_item_description input-custrecord_ng_rt_item_description case-new-form-textarea"> {{itemDescription}} </textarea>
            </span>
        </div>      

        <div class="case-new-subject control-group">
            <label for="custrecord_ng_rt_quantity" class="case-new-form-label">{{translate 'Quantity'}}  </label>
            <span class="controls">
                <input type="number" name="custrecord_ng_rt_quantity" id="custrecord_ng_rt_quantity" class="form-control input-xlarge input-case-title case-new-form-input" value="{{quantity}}"></input>
            </span>
        </div>

        <div class="case-new-subject control-group">
            <label for="custrecord_ng_rt_start_date" class="case-new-form-label"> {{translate 'Start Date'}}  </label>
            <span class="controls">
                <input type="date" name="custrecord_ng_rt_start_date" data-action="change-start" id="custrecord_ng_rt_start_date" class="form-control input-xlarge input-case-title case-new-form-input"></input>

            </span>
        </div>    
  



        <div class="case-new-renewals control-group">                           
            <label for="renewals" class="case-new-form-label"> {{translate 'Renew In'}}  </label>
            <select name="custrecord_ng_rt_renewal_period" data-action="change-renewal" id="custrecord_ng_rt_renewal_period" class="form-control input-xlarge select-case-renewals case-new-form-input">
                 {{{renewalSelect}}}
            </select>
            <div class="row-fluid message-container" style="margin-top:-10px;" data-type="accordion">

                <a href="#" class="renewals-expander" data-action="items-expander" style="font-size:small;"> {{translate 'Custom date? Add it here'}}  <i class="icon-plus"></i></a>
                <div data-content="items-body" style="display: none;">
                    <div class="row-fluid nav-tabs">
                        <div class="span12">
                            <div class="main-container">
                                <div class="span12">
                                    <div class="message-content">
                                        <div class="quote-contact control-group">
                                            <div data-type="contact-form-placeholder">
                                                <div class="case-new-subject control-group">
                                                    <label for="custrecord_ng_rt_renewal_date" class="case-new-form-label"> {{translate 'Renewal Date'}}  </label>
                                                    <span class="controls">
                                                        <input type="date" data-action="change-renewal-date" name="custrecord_ng_rt_renewal_date" id="custrecord_ng_rt_renewal_date" placeholder="mm/dd/yyyy" class="form-control input-xlarge input-case-title case-new-form-input case-new-form-input"></input>
                  
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
            <label for="reminders" class="case-new-form-label"> {{translate 'Remind In'}}  </label>
            <select name="custrecord_ng_rt_reminder_period" data-action="change-reminder" id="custrecord_ng_rt_reminder_period" class="form-control input-xlarge select-case-reminders case-new-form-input">
                {{{remindersSelect}}}
            </select>
            <div class="row-fluid message-container" style="margin-top:-10px;" data-type="accordion">

                <a href="#" class="reminder-expander" data-action="items-expander" style="font-size:small;"> {{translate 'Custom date? Add it here'}}  <i class="icon-plus"></i></a>
                <div data-content="items-body" style="display: none;">
                    <div class="row-fluid nav-tabs">
                        <div class="span12">
                            <div class="main-container">
                                <div class="span12">
                                    <div class="message-content">
                                        <div class="quote-contact control-group">
                                            <div data-type="contact-form-placeholder">
                                                <div class="case-new-subject control-group">
                                                    <label for="custrecord_ng_rt_reminder_date" class="case-new-form-label"> {{translate 'Reminder Date'}}   </label>
                                                    <span class="controls">
                                                        <input type="date" data-action="change-reminder-date" name="custrecord_ng_rt_reminder_date" id="custrecord_ng_rt_reminder_date" placeholder="mm/dd/yyyy" class="form-control input-xlarge input-case-title case-new-form-input" ></input>
                                                        
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
            <button type="submit" class="btn btn-primary btn-case-submit case-new-button-submit"> {{translate 'Update Reminder'}}  </button>
        </div>
    </form>
</section>