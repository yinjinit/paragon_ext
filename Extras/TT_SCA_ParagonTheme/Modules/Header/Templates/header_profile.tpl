{{#if showExtendedMenu}}


	{{#if showMyAccountMenu}}
		<ul class="header-profile-menu-myaccount-container">
			<li data-view="Header.Menu.MyAccount"></li>
		</ul>
	{{/if}}

{{else}}

	{{#if showLoginMenu}}
		{{#if showLogin}}
			<div class="header-profile-menu-login-container header-profile-menu-login-container-top">
				<ul class="header-profile-menu-login">
					<li>
						<a class="header-profile-login-link" data-touchpoint="login" data-hashtag="login-register" href="#">
							{{translate 'Login'}}
						</a>
					</li>
					{{#if showRegister}}
						<li> | </li>
						<li>
							<a class="header-profile-register-link" data-touchpoint="register" data-hashtag="login-register" href="#">
								{{translate 'Register'}}
							</a>
						</li>
					{{/if}}
				</ul>
			</div>
		{{/if}}
	{{else}}
		<a class="header-profile-loading-link">
			<i class="header-profile-loading-icon"></i>
			<span class="header-profile-loading-indicator"></span>
		</a>
	{{/if}}

{{/if}}





{{#if showExtendedMenu}}
			<a class="header-profile-welcome-link" title="{{translate 'Locations'}}" href="/location">
				<img src="/Images/Navbar Icons/Paragon Micro_Icon_Locations_White_20200514.png" alt=""
					class="header-profile-location-link-icon">
				&nbsp;&nbsp;{{translate '<strong class="header-profile-welcome-link-name">Locations</strong>'}}
			</a>

				<a class="header-profile-welcome-link" title="{{translate 'Careers'}}" href="/careers">
				<img src="/Images/Navbar Icons/Paragon Micro_Icon_Careers_White_20200514.png" alt=""
					class="header-profile-location-link-icon"/>
				&nbsp;&nbsp;{{translate '<strong class="header-profile-welcome-link-name">Careers</strong>'}}
				</a>
<a class="header-profile-welcome-link" href="#" data-toggle="dropdown">
	<i class="header-profile-welcome-user-icon"></i>
	 <strong class="header-profile-welcome-link-name">{{translate 'My Account'}}</strong>
	<i class="header-profile-welcome-carret-icon"></i>
</a>

{{#if showMyAccountMenu}}
<ul class="header-profile-menu-myaccount-container">
	<li data-view="Header.Menu.MyAccount"></li>
</ul>
{{/if}}

{{else}}

{{#if showLoginMenu}}
{{#if showLogin}}
<div class="header-profile-menu-login-container header-profile-menu-login-container-second">
	<ul class="header-profile-menu-login">
		<li class="header-profile-location-link-location">
			<a class="header-profile-welcome-link" title="{{translate 'Locations'}}" href="/location">
				<img src="/Images/Navbar Icons/Paragon Micro_Icon_Locations_White_20200514.png" alt=""
					class="header-profile-location-link-icon">
				&nbsp;&nbsp;{{translate '<strong class="header-profile-welcome-link-name">Locations</strong>'}}
			</a>
		</li>
		<li>
			<a class="header-profile-welcome-link" title="{{translate 'Careers'}}" href="/careers">
				<img src="/Images/Navbar Icons/Paragon Micro_Icon_Careers_White_20200514.png" alt=""
					class="header-profile-careers-link-icon">
				&nbsp;&nbsp;{{translate '<strong class="header-profile-welcome-link-name">Careers</strong>'}}
			</a>
		</li>
		<li>
			<a class="header-profile-login-link" data-touchpoint="login" data-hashtag="login-register" href="#">
				<img src="/Images/Navbar Icons/Paragon Micro_Icon_Log In_White_20200514.png" alt=""
					class="header-profile-login-link-icon">&nbsp;&nbsp;{{translate '<strong class="header-profile-welcome-link-name">Login</strong>'}}
			</a>
		</li>
		<!--	{{#if showRegister}}
		<li>
			<a class="header-profile-register-link" data-touchpoint="register" data-hashtag="login-register" href="#">
				{{!-- <span class="header-profile-register-text-small">Welcome.</span> --}}
				<img src="/Images/Navbar Icons/Paragon Micro_Icon_Create An Account_White_20200514.png" alt=""
					class="header-profile-register-link-icon"><span>&nbsp;&nbsp;{{translate 'Create Account'}}</span>
			</a>
		</li>
		{{/if}} -->
		<div class="mobile-close-btn" data-action="header-sidebar-hide"></div>
	</ul>
</div>
{{/if}}
{{else}}
<a class="header-profile-loading-link">
	<i class="header-profile-loading-icon"></i>
	<span class="header-profile-loading-indicator"></span>
</a>
{{/if}}

{{/if}}



{{!----
Use the following context variables when customizing this template:

	showExtendedMenu (Boolean)
	showLoginMenu (Boolean)
	showLoadingMenu (Boolean)
	showMyAccountMenu (Boolean)
	displayName (String)
	showLogin (Boolean)
	showRegister (Boolean)

----}}