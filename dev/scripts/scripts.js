document.addEventListener('DOMContentLoaded', function() {


	// Global Variables: Variables requiring a global scope
	// ----------------------------------------------------------------------------

	// --- Objects and Initial Setup --- \\

	// common objects
	var animationEvent  = whichAnimationEvent(),
		transitionEvent = whichTransitionEvent(),
		elHTML          = document.documentElement,
		elBody          = document.body,
		numWindowWidth  = window.innerWidth;


	// Helper: Check when a CSS animation or transition has ended
	// ----------------------------------------------------------------------------
	function whichAnimationEvent() {

		var anim,
			element    = document.createElement('fakeelement'),
			animations = {
				'animation'       : 'animationend',
				'OAnimation'      : 'oAnimationEnd',
				'MozAnimation'    : 'animationend',
				'WebkitAnimation' : 'webkitAnimationEnd'
			}

		for (anim in animations) {
			if (element.style[anim] !== undefined) {
				return animations[anim];
			}
		}

	}

	function whichTransitionEvent() {

		var trans,
			element     = document.createElement('fakeelement'),
			transitions = {
				'transition'       : 'transitionend',
				'OTransition'      : 'oTransitionEnd',
				'MozTransition'    : 'transitionend',
				'WebkitTransition' : 'webkitTransitionEnd'
			}

		for (trans in transitions) {
			if (element.style[trans] !== undefined) {
				return transitions[trans];
			}
		}

	}


	// Helper: Fire Window Resize Event Upon Finish
	// ----------------------------------------------------------------------------
	var waitForFinalEvent = (function() {

		var timers = {};

		return function(callback, ms, uniqueId) {

			if (!uniqueId) {
				uniqueId = 'beefchimi'; // Don't call this twice without a uniqueId
			}

			if (timers[uniqueId]) {
				clearTimeout(timers[uniqueId]);
			}

			timers[uniqueId] = setTimeout(callback, ms);

		};

	})();


	// injectSVG: Inject SVG data once document is ready
	// ----------------------------------------------------------------------------
	function injectSVG() {

		var ajax   = new XMLHttpRequest(),
			origin = window.location.origin,
			wpPath = '/wp-content/themes/northman/',
			ajaxPath = origin === 'http://localhost' ? '' : origin + wpPath;

		ajax.open('GET', ajaxPath + 'assets/img/svg.svg?v=2', true);
		ajax.send();
		ajax.onload = function(e) {

			var div = document.createElement('div');
			div.id = 'svgInject';
			div.innerHTML = ajax.responseText;
			document.body.insertBefore(div, document.body.childNodes[0]);

		}

	}


	// pageLoaded: Execute once the page has loaded and the FOUT animation has ended
	// ----------------------------------------------------------------------------
	function pageLoaded() {

		injectSVG(); // inject them SVGs

		rowHeight();

	}


	// rowHeight: Measure and set .wrap heights
	// ----------------------------------------------------------------------------
	function rowHeight() {

		// do not execute if single column
		if (numWindowWidth < 480) {
			return;
		}

		var arrRows = document.getElementsByClassName('row');

		for (var a = 0; a < arrRows.length; a++) {

			var arrWraps = arrRows[a].getElementsByClassName('wrap'),
				numTallestHeight = 0;

			// check each .wrap for tallest element
			for (var b = 0; b < arrWraps.length; b++) {




				if (numWindowWidth < 768) {

					console.log('go fuck yourself');

					var dataColumn = arrRows[a].getAttribute('data-columns');


					if (dataColumn === 'multiple') {

						console.log('yes');

					}

				}




				if (numTallestHeight < arrWraps[b].offsetHeight ) {
					numTallestHeight = arrWraps[b].offsetHeight;
				}





			}

			// now set the style attributes for each .wrap
			for (var c = 0; c < arrWraps.length; c++) {
				arrWraps[c].style.height = numTallestHeight + 'px';
			}




		}

	}


	// Window Events: On - Scroll, Resize
	// ----------------------------------------------------------------------------
	window.addEventListener('resize', function(e) {

		// do not fire resize event for every pixel... wait until finished
		waitForFinalEvent(function() {

			numWindowWidth = window.innerWidth;

			rowHeight();

		}, 500, 'unique string');

	}, false);


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	pageLoaded();


}, false);