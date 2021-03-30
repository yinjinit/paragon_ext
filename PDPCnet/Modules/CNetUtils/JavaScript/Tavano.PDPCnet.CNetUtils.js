
define(
	'Tavano.PDPCnet.CNetUtils'
,   [

        "underscore", "jQuery"
	]
,   function (
        _, jQuery
	)
{
	function loadCNetSnippet(product_id,mpn,cat){
        

        window.ccs_cc_args = window.ccs_cc_args || [];

        (function () {
            window.ccs_cc_args.push(['cpn', product_id]);
            window.ccs_cc_args.push(['pn', mpn]);
            window.ccs_cc_args.push(['lang', cat]);
            window.ccs_cc_args.push(['market', 'US']);
            window.ccs_cc_args.push(['ccid', 'AB']);
            var o = window.ccs_cc_args;
            o.push(['_SKey', '405ed8ad']);
            o.push(['_ZoneId', '211ac8040f']);
            var sc = document.createElement('script');
            sc.type = 'text/javascript';
            sc.async = true;
            sc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.cnetcontent.com/jsc/h.js';
            var n = document.getElementsByTagName('script')[0]; n.parentNode.insertBefore(sc, n);
        })(window,document);
	}

    var Utils = {
        loadCNetSnippet: loadCNetSnippet,

    };

    return Utils;


});
