define(
	'BigBang.Punchout2Go.PunchoutCart'
,   [
		'BigBang.Punchout2Go.PunchoutCart.View'
	,	'Profile.Model'
	]
,   function (
		PunchoutCartView
	,	ProfileModel
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container) {
			
			var cart = container.getComponent('Cart')
			, self = this
			, Layout = container.getComponent('Layout');  // 'layout' is already used as a global variable, so we use a capital L
			
			$.ajax({
				async : false,
				type : 'GET',
				url : _.getAbsoluteUrl(getExtensionAssetsPath('services/PunchoutServices.Service.ss')) + '?method=getSession',
				success : function(data) {
					self.sessionId = data.sessionId;
				},
				error : function(xhr, status, error) {
					self.sessionId = null;
				}
			});

			var isPunchoutSession = this.sessionId !== null && this.sessionId !== '';
			
			

			this.punchoutInformation = {
				isPunchoutSession : isPunchoutSession,
				punchoutURL : _.getAbsoluteUrl(getExtensionAssetsPath('services/PunchoutServices.Service.ss')) + '?method=transfer',
				allow : true
			};
			console.log('po2go container');
					
			if (cart) {
				if(isPunchoutSession) {
					// Add punchoutInformation to Cart.Summary.View	Context		
					Layout.addToViewContextDefinition('Cart.Summary.View', 'punchoutInformation', 'object', function() {
						return self.punchoutInformation;
					});
					
					// Add punchoutInformation to Cart.Detailed.View Context
					Layout.addToViewContextDefinition(cart.CART_VIEW, 'punchoutInformation', 'object', function() {
						return self.punchoutInformation;
					});			

					// Add punchoutInformation to Header.MiniCart.View Context
					Layout.addChildView('Header.MiniCart', function() {
						return new PunchoutCartView({
							cart : cart,
							punchoutInformation : self.punchoutInformation
						});
					});
					

					// Add event handler for when the Transfer button is clicked
					Layout.addToViewEventsDefinition('Cart.Summary.View', 'click [data-action="cart-summary-transfer-punchout"]', function(e) {
						jQuery(e.target).html('Transfering...').click(function(ev) {
							ev.preventDefault();
							return false;
						});
					});

					cart.on('afterAddLine', function(event) {						
						var changedButton = false;

						// Update button since the page is not reloaded when an item is added to the cart
						var checkExist = setInterval(function() {
							if (jQuery('.header-mini-cart-buttons-right').length) {
								jQuery('.header-mini-cart-buttons-right').empty();
								jQuery('.header-mini-cart-buttons-right').append('<a id="btn-transfer-checkout" data-action="cart-summary-transfer-punchout" href=' 
										+ self.punchoutInformation.punchoutURL + ' class="header-mini-cart-button-checkout">' + _('Transfer').translate());
								changedButton = true;
							}
							
							if (changedButton) {
								clearInterval(checkExist);
							}
							
						}, 500);
					});
				}
			}
		}
	};
});
