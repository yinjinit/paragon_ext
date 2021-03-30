<div class="footer-simplified-content">
	<div class="footer-bottom-section">
		<div class="footer-content-copyright">
			{{translate '&copy; $(0) Paragon Micro. All rights reserved.' actualYear}}
		</div>
	</div>
</div>
<div data-view="Global.BackToTop"></div>
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
			jQuery('.tt-suggestions').css('display', 'none')
		});
</script>

{{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}
