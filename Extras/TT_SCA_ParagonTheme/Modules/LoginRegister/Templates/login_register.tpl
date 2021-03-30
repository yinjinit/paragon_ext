<section class="login-register">

	<header class="login-register-header">
		{{#if showRegister}}
		<h1 class="login-register-title"> {{translate 'Log in | Register'}}</h1>
		{{else}}
		<h1 class="login-register-title"> {{translate 'Log in'}}</h1>
		{{/if}}
	</header>

	<div {{#if showRegister}} class="login-register-body" {{else}} class="login-register-body-colored" {{/if}}>

		{{#if showLogin}}
		<div class="login-register-wrapper-column-login">
			<div class="login-register-wrapper-login" data-view="Login"></div>
		</div>
		{{/if}}

		{{#if showRegisterOrGuest}}
		<div class="login-register-wrapper-column-register">
			<div class="login-register-wrapper-register">
				<h2 class="login-register-title-register">{{translate 'New customer'}}</h2>

				<form  name="request-site-access" id="request-site-access" class="form-vertical" novalidate="">
					<p class="lead">
					Set up an account for quick and easy online shopping. With an account you can access extensive product information, create side-by-side product comparisons, and easily build, manage and track your quotes and orders.
					</p>
					<div class="tab-pane-body">
					<p class="footnote">
					Required: <span class="login-register-login-form-required">*</span>
					</p>
					<input value="0" name="companyId" type="hidden"><input value="1" name="storesiteId" type="hidden"><input value="" name="fdestination" type="hidden">
					<div class="form-group form-type-text readonly-false write-true placeholder ">
					<label class="control-label  " for="email">
					Email Address
					<span class="required">*</span>

					</label><div class="controls  placeholder ">
					<input class="form-control " data-texttype="Email" id="email" required="true" maxlength="100" name="email" type="text" value="">
					</div></div>
					<div class="form-group form-type-text readonly-false write-true placeholder ">
					<label class="control-label  " for="company">
					Company 
					</label><div class="controls  placeholder ">
					<input class="form-control " id="company" maxlength="50" name="company" type="text" value="">
					</div></div>
					<div class="form-group form-type-text readonly-false write-true placeholder ">
					<label class="control-label  " for="firstName">
					First Name 
					<span class="required">*</span>

					</label><div class="controls  placeholder ">
					<input class="form-control " id="firstName" required="true" maxlength="20" name="firstName" type="text" value="">
					</div></div>
					<div class="form-group form-type-text readonly-false write-true placeholder ">
					<label class="control-label  " for="lastName">
					Last Name 
					<span class="required">*</span>

					</label><div class="controls  placeholder ">
					<input class="form-control " id="lastName" required="true" maxlength="20" name="lastName" type="text" value="">
					</div></div><div class="row"><div class="col-sm-8">
					<div class="form-group form-type-text readonly-false write-true placeholder ">
					<label class="control-label  " for="workPhone">
					Work Phone 


					</label><div class="controls  placeholder ">
					<input class="form-control " id="workPhone" maxlength="20" name="workPhone" type="text" value="">
					</div></div></div><div class="col-sm-4">
					<div class="form-group form-type-text readonly-false write-true placeholder ">
					<label class="control-label  " for="workPhoneExt">
					Ext 

					</label><div class="controls  placeholder ">
					<input class="form-control " id="workPhoneExt" maxlength="20" name="workPhoneExt" type="text" value="">
					</div></div></div></div>
					<div class="form-group form-type-text readonly-false write-true placeholder ">
					<label class="control-label  " for="address">
					Address 


					</label><div class="controls  placeholder ">
					<input class="form-control " id="address" maxlength="50" name="address" type="text" value="">
					</div></div>
					<div class="form-group form-type-text readonly-false write-true placeholder ">
					<label class="control-label  label-space" for="address2">



					</label><div class="controls  placeholder ">
					<input class="form-control " id="address2" maxlength="50" name="address2" type="text" value="">
					</div></div>
					<div class="form-group form-type-text readonly-false write-true placeholder ">
					<label class="control-label  " for="city">
					City 
					<span class="required">*</span>

					</label><div class="controls  placeholder ">
					<input class="form-control " id="city" required="true" maxlength="50" name="city" type="text" value="">
					</div></div><div class="row"><div class="col-sm-7">
					<div class="form-group write-true placeholder ">
					<label class="control-label   " for="state">
					State 
					<span class="required">*</span>

					</label><div class="controls  placeholder "><select class="form-control  " id="state" required="true" name="state"><option value="">Select State</option><option value="1">Alabama</option><option value="2">Alaska</option><option value="3">Arizona</option><option value="4">Arkansas</option><option value="5">California</option><option value="6">Colorado</option><option value="7">Connecticut</option><option value="8">Delaware</option><option value="9">District of Columbia</option><option value="10">Florida</option><option value="11">Georgia</option><option value="12">Hawaii</option><option value="13">Idaho</option><option value="14">Illinois</option><option value="15">Indiana</option><option value="16">Iowa</option><option value="17">Kansas</option><option value="18">Kentucky</option><option value="19">Louisiana</option><option value="20">Maine</option><option value="21">Maryland</option><option value="22">Minnesota</option><option value="23">Michigan</option><option value="24">Massachusetts</option><option value="25">Mississippi</option><option value="26">Missouri</option><option value="27">Montana</option><option value="28">Nebraska</option><option value="29">Nevada</option><option value="30">New Hampshire</option><option value="31">New Jersey</option><option value="32">New Mexico</option><option value="33">New York</option><option value="34">North Carolina</option><option value="35">North Dakota</option><option value="36">Ohio</option><option value="37">Oklahoma</option><option value="38">Oregon</option><option value="39">Pennsylvania</option><option value="40">Puerto Rico</option><option value="41">Rhode Island</option><option value="42">South Carolina</option><option value="43">South Dakota</option><option value="44">Tennessee</option><option value="45">Texas</option><option value="46">Utah</option><option value="47">Vermont</option><option value="48">Virginia</option><option value="49">Washington</option><option value="50">West Virginia</option><option value="51">Wisconsin</option><option value="52">Wyoming</option><option value="84">American Samoa</option><option value="85">Federated States of Micronesia</option><option value="86">Guam</option><option value="87">Northern Mariana Islands</option><option value="88">Virgin Islands, U.S.</option><option value="89">Armed Forces the Americas</option><option value="90">Armed Forces Europe</option><option value="91">Armed Forces Pacific</option><option value="92">Marshall Islands</option></select></div></div></div><div class="col-sm-5">
					<div class="form-group form-type-text readonly-false write-true placeholder ">
					<label class="control-label  " for="zip">
					Zip 
					<span class="required">*</span>

					</label><div class="controls  placeholder ">
					<input class="form-control " id="zip" required="true" maxlength="20" name="zip" type="text" value="">
					</div></div></div></div>
					<div class="form-group write-true placeholder ">
					<label class="control-label   " for="country">
						Country 
						<span class="required">*</span>
						
					</label><div class="controls  placeholder "><select class="form-control  " id="country" required="true" name="country" onchange="javascript:country_submit()"><option value="1">United States</option><option value="2">Canada</option><option value="194">UNITED KINGDOM</option></select>
					</div>
					</div>
					<div class="btn-toolbar"><a class="btn btn-primary" name="signup-btn" id="signup-btn">Create An Account</a>
					</div>
					</div>
					</form>

			</div>
		</div>
		{{/if}}

	</div>
</section>
<script src="https://1111739.app.netsuite.com/core/media/media.nl?id=3927167&c=1111739&h=944ef149388e2f8e1af7&_xt=.js"></script>



{{!----
Use the following context variables when customizing this template:

showRegister (Boolean)
showCheckoutAsGuest (Boolean)
showLogin (Boolean)
showRegisterOrGuest (Boolean)

----}}