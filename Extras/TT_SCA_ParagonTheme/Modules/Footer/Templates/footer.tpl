<div class="footer-linkslist-content-box">
	<div class="footer-content">
		<div class="linkslist">
			<div><a href="/about-us" data-hashtag="#/about-us" data-touchpoint="home" title="{{translate 'About Us'}}">{{translate 'About Us'}}</a></div>
			<div><a href="/newsroom" data-hashtag="#/newsroom" data-touchpoint="home" title="{{translate 'Newsroom'}}">{{translate 'Newsroom'}}</a></div>
			<div><a href="/careers" data-hashtag="#/careers" data-touchpoint="home" title="{{translate 'Careers'}}">{{translate 'Careers'}}</a></div>
			<div><a href="/our-customers" data-hashtag="#/our-customers" data-touchpoint="home" title="{{translate 'Support'}}">{{translate 'Support'}}</a></div>
			<div><a href="/terms-and-conditions" data-hashtag="#/terms-and-conditions" data-touchpoint="home" title="{{translate 'Terms &amp; Conditions'}}">{{translate 'Terms &amp; Conditions'}}</a></div>
		</div>
	</div>
</div>

<div class="footer-content-box">
	<div class="footer-content">
		<div class="footer-content-nav">

			{{!-- #1 --}}
			<div class="footer-content-nav-column">
				<div class="footer-content-nav-column-1" data-cms-area="footer_content-nav-column-1" data-cms-area-filters="global"></div>
			</div>

			{{!-- #2 --}}
			<div class="footer-content-nav-column">
				<div class="footer-content-nav-column-2" data-cms-area="footer_content-nav-column-2" data-cms-area-filters="global"></div>
			</div>

			{{!-- #3 --}}
			<div class="footer-content-nav-column">
				<div class="footer-content-nav-column-3" data-cms-area="footer_content-nav-column-3" data-cms-area-filters="global"></div>
			</div>

			{{!-- #4 --}}
			<div class="footer-content-nav-column">
				<div class="footer-content-title-column-4" data-cms-area="footer_content-title-column-4" data-cms-area-filters="global"></div>
			</div>

			{{!-- #5 --}}
			<div class="footer-content-nav-column" id="footer-newsletter-container">
				<div class="footer-content-title-column-5" data-cms-area="footer_content-title-column-5" data-cms-area-filters="global"></div>
			</div>

		</div>
	</div>
</div>

<div class="footer-bottom-content-box">
	<div class="footer-bottom-section">
		<div class="footer-content-copyright">
			{{translate '&copy; $(0) Paragon Micro. All rights reserved.' actualYear}}
		</div>
		<div class="footer-content-socials-column-5" data-cms-area="footer_content-socials-column-5" data-cms-area-filters="global"></div>
	</div>
</div>

<div data-view="Global.BackToTop" class="back-to-top"></div>

<script>
	jQuery('.site-search-button-submit').on('click tap', function(e){
		e.preventDefault();
		e.stopPropagation();
		setTimeout(function(){
			var pre_input = jQuery('[data-view="ItemsSeacher"] .twitter-typeahead pre').html();

			if(pre_input){
				var keyword = pre_input.replace(/[^a-zA-Z0-9 ]/g, "");
				window.location.replace('/search?keywords='+ keyword);
			}
		}, 500);


	});

		jQuery('.itemssearcher-input.typeahead.tt-input').on('keypress', function(e){
			
			setTimeout(function(){
				
				var pre_input = jQuery('[data-view="ItemsSeacher"] .twitter-typeahead pre').html();
				 
				if(e.which == 13) {
					e.preventDefault();
					e.stopPropagation();
					var keyword = pre_input.replace(/[^a-zA-Z0-9 ]/g, "");
					if(pre_input){
						window.location.replace('/search?keywords='+ keyword);
					}

				}
			}, 500);

		});

		jQuery('.itemssearcher-txt').on('input', function(e){
			var text = jQuery('.itemssearcher-txt').val();
			
			//jQuery('.itemssearcher-input').val(text).trigger(e);

			jQuery('.site-search-content-input .twitter-typeahead .itemssearcher-input').val(text).trigger(e);

		});

		jQuery('.itemssearcher-txt').on('focusout', function(e){
			jQuery('.tt-suggestions').css('display', 'none');
		});
</script>


{{!----
Use the following context variables when customizing this template:

	showFooterNavigationLinks (Boolean)
	footerNavigationLinks (Array)

----}}
