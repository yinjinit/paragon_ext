// @module BigBang.Punchout2Go.PunchoutCart
define('BigBang.Punchout2Go.PunchoutCart.View'
,	[
		'bigbang_punchout2go_punchoutcart.tpl'
	,	'Utils'
	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'jQuery'
	,	'underscore'
	]
,	function (
		bigbang_punchout2go_punchoutcart_tpl 
	,	Utils
	,	Backbone
	,	BackboneCompositeView
	,	jQuery
	,	_
	)
{
	'use strict';

	// @class BigBang.Punchout2Go.PunchoutCart.View @extends Backbone.View
	return Backbone.View.extend({

		template: bigbang_punchout2go_punchoutcart_tpl

	,	initialize: function (options) {
			BackboneCompositeView.add(this);
			this.options = options;
			this.on('afterCompositeViewRender', this.afterViewRender(options), this);
		}

	,	afterViewRender : function(options) {
			var changedButton = false;
			
			var checkExist = setInterval(function() {
				if (jQuery('.header-mini-cart-buttons-right').length) {
					jQuery('.header-mini-cart-buttons-right').empty();
					jQuery('.header-mini-cart-buttons-right').append('<a id="btn-transfer-checkout" data-action="cart-summary-transfer-punchout" href=' 
							+ options.punchoutInformation.punchoutURL + ' class="header-mini-cart-button-checkout">' + _('Transfer').translate());
					changedButton = true;
				}
				
				if (changedButton) {
					clearInterval(checkExist);
				}
				
			}, 500);
		}
	
	});
});