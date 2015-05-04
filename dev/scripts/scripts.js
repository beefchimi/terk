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

		ajax.open('GET', ajaxPath + 'assets/img/svg.svg?v=1', true);
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

		// injectSVG(); // inject them SVGs

		rowHeight();
		toggleShit();

	}


	// toggleShit: Measure and set .wrap heights
	// ----------------------------------------------------------------------------
	function toggleShit() {

		var elToggle = document.getElementById('toggler'),
			elNav = document.getElementById('navigation');

		elToggle.addEventListener('click', function(e) {

			classie.toggle(elNav, 'toggled');

			e.preventDefault();

		});

	}


	// rowHeight: Measure and set .wrap heights
	// ----------------------------------------------------------------------------
	function rowHeight() {

		// get all '.wrap' elements
		var arrWraps      = document.getElementsByClassName('wrap'),
			numWrapsCount = arrWraps.length;

		// if single column: reset '.wrap' height and exit function
		if (numWindowWidth < 480) {

			// reset height to 'auto'
			for (var a = 0; a < numWrapsCount; a++) {
				arrWraps[a].style.height = 'auto';
			}

			return; // tits or gtfo

		}

		// our variables to track height, position, current element
		var numCurrentTallest  = 0,
			numCurrentRowStart = 0,
			numTopPos          = 0,
			arrRowChildren     = new Array(),
			elThisWrap;

		for (var b = 0; b < numWrapsCount; b++) {

			// reference current iteration of '.wrap'
			elThisWrap = arrWraps[b];

			// reset height to 'auto'
			elThisWrap.style.height = 'auto';

			// calculate top offset relative to parent container ('.row' requires position: relative)
			numTopPos = elThisWrap.getBoundingClientRect().top; // elThisWrap.offsetTop;

			if (numCurrentRowStart != numTopPos) {

				for (var c = 0; c < arrRowChildren.length; c++) {
					arrRowChildren[c].style.height = numCurrentTallest + 'px';
				}

				arrRowChildren.length = 0; // empty the array
				numCurrentRowStart = numTopPos;
				numCurrentTallest = elThisWrap.offsetHeight;
				arrRowChildren.push(elThisWrap);

			} else {

				// add this '.wrap' to the row array
				arrRowChildren.push(elThisWrap);

				// compare current numCurrentTallest value against the current '.wrap' iteration's height
				numCurrentTallest = (numCurrentTallest < elThisWrap.offsetHeight) ? (elThisWrap.offsetHeight) : (numCurrentTallest);

			}

			for (var d = 0; d < arrRowChildren.length; d++) {
				arrRowChildren[d].style.height = numCurrentTallest + 'px';
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