/*
	Hugo Story by CaressOfSteel
	A (modular, highly tweakable) responsive one-page theme for Hugo.
	Ported from Story by HTML5UP.
	This Hugo theme is licensed under the Creative Commons Attribution 3.0 License.
*/

(function($) {
	var year = new Date().getFullYear()

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Navigation menu scroll behavior
		var $nav = $('#main-nav');
		var scrollThreshold = 100; // Show menu after scrolling 100px
		var lastScrollTop = 0;

		$window.on('scroll', function() {
			var scrollTop = $(this).scrollTop();
			
			// Show/hide menu based on scroll position
			if (scrollTop > scrollThreshold) {
				$nav.addClass('nav-visible');
			} else {
				$nav.removeClass('nav-visible');
			}
			
			lastScrollTop = scrollTop;
		});

	// Mobile menu toggle
		$('.nav-toggle').on('click', function() {
			$(this).toggleClass('active');
			$('.nav-menu').toggleClass('active');
		});

	// Close mobile menu when clicking on a link
		$('.nav-link').on('click', function() {
			$('.nav-toggle').removeClass('active');
			$('.nav-menu').removeClass('active');
		});

	// Phone validation and checkbox validation
		var $telephoneInput = $('#telephone');
		var $telephoneError = $('#telephone-error');
		var $phoneCheckbox = $('#phone');
		var $phoneCheckboxError = $('#phone-checkbox-error');

		// Phone validation function
		function validatePhone(phone) {
			// Remove all non-digit characters
			var digits = phone.replace(/\D/g, '');
			return digits.length > 7;
			
			// Check if it's a valid Brazilian phone number (10 or 11 digits)
			// if (digits.length === 10 || digits.length === 11) {
				// If 11 digits, first digit should be 9 (mobile) or 8 (landline)
				if (digits.length === 11) {
					return digits.charAt(2) === '9' || digits.charAt(2) === '8';
				}
				// If 10 digits, it's a landline
				return true;
			// }
			return false;
		}

		// Format phone number as user types
		$telephoneInput.on('input', function() {
			var value = $(this).val();
			var digits = value.replace(/\D/g, '');
			
			// Format the number
			var formatted = '';
			if (digits.length > 0) {
				formatted = digits;
			// 	formatted = '(' + digits.substring(0, 2);
			// 	if (digits.length > 2) {
			// 		formatted += ') ' + digits.substring(2, 7);
			// 		if (digits.length > 7) {
			// 			formatted += '-' + digits.substring(7, 11);
			// 		}
			// 	}
			}
			
			$(this).val(formatted);
			
			// Validate and show/hide error
			if (value.length > 0 && !validatePhone(value)) {
				$telephoneError.show();
				$(this).addClass('error');
			} else {
				$telephoneError.hide();
				$(this).removeClass('error');
			}
			
			// Check if phone checkbox validation is needed
			validatePhoneCheckbox();
		});

		// Phone checkbox validation
		function validatePhoneCheckbox() {
			var isPhoneChecked = $phoneCheckbox.is(':checked');
			var telephoneValue = $telephoneInput.val().trim();
			var isTelephoneValid = telephoneValue.length > 0 && validatePhone(telephoneValue);
			
			if (isPhoneChecked && !isTelephoneValid) {
				$phoneCheckboxError.show();
				$phoneCheckbox.addClass('error');
				return false;
			} else {
				$phoneCheckboxError.hide();
				$phoneCheckbox.removeClass('error');
				return true;
			}
		}

		// Phone checkbox change event
		$phoneCheckbox.on('change', function() {
			validatePhoneCheckbox();
		});

		// Form submission validation
		$('#contact-form').on('submit', function(e) {
			var isPhoneChecked = $phoneCheckbox.is(':checked');
			var telephoneValue = $telephoneInput.val().trim();
			var isTelephoneValid = telephoneValue.length === 0 || validatePhone(telephoneValue);
			
			// If phone checkbox is checked, telephone must be filled and valid
			if (isPhoneChecked && (!telephoneValue || !validatePhone(telephoneValue))) {
				e.preventDefault();
				$phoneCheckboxError.show();
				$phoneCheckbox.addClass('error');
				if (!telephoneValue) {
					$telephoneInput.addClass('error').focus();
				} else if (!validatePhone(telephoneValue)) {
					$telephoneError.show();
					$telephoneInput.addClass('error').focus();
				}
				return false;
			}
			
			// If validation passes, allow form submission
			return true;
		});

		// Email validation
		function validateEmail(email) {
			var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(email);
		}

		var $emailInput = $('#email');
		var $emailError = $('<span class="field-error">Por favor, insira um endereço de e-mail válido</span>').insertAfter($emailInput);
		$emailError.hide();

		$emailInput.on('blur', function() {
			var emailValue = $(this).val().trim();
			
			if (emailValue && !validateEmail(emailValue)) {
				$emailError.show();
				$(this).addClass('error');
			} else {
				$emailError.hide(); 
				$(this).removeClass('error');
			}
		});
		
		$nameInput = $('#name');
		var $nameError = $('<span class="field-error">Por favor, insira um nome válido</span>').insertAfter($nameInput);
		$nameError.hide();
		
		$nameInput.on('blur', function() {
			var nameValue = $(this).val().trim();
			
			if (!nameValue.includes(' ')) {
				$nameError.show();
				$(this).addClass('error');
			} else {
				$nameError.hide(); 
				$(this).removeClass('error');
			}
		});

		// Add email validation to form submission
		$('#contact-form').on('submit', function(e) {
			var emailValue = $emailInput.val().trim();
			
			if (!emailValue || !validateEmail(emailValue)) {
				e.preventDefault();
				$emailError.show();
				$emailInput.addClass('error').focus();
				return false;
			}
		});

	// Browser fixes.

		// IE: Flexbox min-height bug.
			if (browser.name == 'ie')
				(function() {

					var flexboxFixTimeoutId;

					$window.on('resize.flexbox-fix', function() {

						var $x = $('.fullscreen');

						clearTimeout(flexboxFixTimeoutId);

						flexboxFixTimeoutId = setTimeout(function() {

							if ($x.prop('scrollHeight') > $window.height())
								$x.css('height', 'auto');
							else
								$x.css('height', '100vh');

						}, 250);

					}).triggerHandler('resize.flexbox-fix');

				})();

		// Object fit workaround.
			if (!browser.canUse('object-fit'))
				(function() {

					$('.banner .image, .spotlight .image').each(function() {

						var $this = $(this),
							$img = $this.children('img'),
							positionClass = $this.parent().attr('class').match(/image-position-([a-z]+)/);

						// Set image.
							$this
								.css('background-image', 'url("' + $img.attr('src') + '")')
								.css('background-repeat', 'no-repeat')
								.css('background-size', 'cover');

						// Set position.
							switch (positionClass.length > 1 ? positionClass[1] : '') {

								case 'left':
									$this.css('background-position', 'left');
									break;

								case 'right':
									$this.css('background-position', 'right');
									break;

								default:
								case 'center':
									$this.css('background-position', 'center');
									break;

							}

						// Hide original.
							$img.css('opacity', '0');

					});

				})();

	// Smooth scroll.
		$('.smooth-scroll').scrolly();
		$('.smooth-scroll-middle').scrolly({ anchor: 'middle' });

	// Wrapper.
		$wrapper.children()
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			});

	// Items.
		$('.items')
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				delay:		50,
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			})
			.children()
				.wrapInner('<div class="inner"></div>');

	// Gallery.
		$('.gallery')
			.wrapInner('<div class="inner"></div>')
			.prepend(browser.mobile ? '' : '<div class="forward"></div><div class="backward"></div>')
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				delay:		50,
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			})
			.children('.inner')
				//.css('overflow', 'hidden')
				.css('overflow-y', browser.mobile ? 'visible' : 'hidden')
				.css('overflow-x', browser.mobile ? 'scroll' : 'hidden')
				.scrollLeft(0);

		// Style #1.
			// ...

		// Style #2.
			$('.gallery')
				.on('wheel', '.inner', function(event) {

					var	$this = $(this),
						delta = (event.originalEvent.deltaX * 10);

					// Cap delta.
						if (delta > 0)
							delta = Math.min(25, delta);
						else if (delta < 0)
							delta = Math.max(-25, delta);

					// Scroll.
						$this.scrollLeft( $this.scrollLeft() + delta );

				})
				.on('mouseenter', '.forward, .backward', function(event) {

					var $this = $(this),
						$inner = $this.siblings('.inner'),
						direction = ($this.hasClass('forward') ? 1 : -1);

					// Clear move interval.
						clearInterval(this._gallery_moveIntervalId);

					// Start interval.
						this._gallery_moveIntervalId = setInterval(function() {
							$inner.scrollLeft( $inner.scrollLeft() + (5 * direction) );
						}, 10);

				})
				.on('mouseleave', '.forward, .backward', function(event) {

					// Clear move interval.
						clearInterval(this._gallery_moveIntervalId);

				});

		// Lightbox.
			$('.gallery.lightbox')
				.on('click', 'a', function(event) {

					var $a = $(this),
						$gallery = $a.parents('.gallery'),
						$modal = $gallery.children('.modal'),
						$modalImg = $modal.find('img'),
						href = $a.attr('href');

					// Not an image? Bail.
						if (!href.match(/\.(jpg|gif|png|mp4|webp|avif)$/))
							return;

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Locked? Bail.
						if ($modal[0]._locked)
							return;

					// Lock.
						$modal[0]._locked = true;

					// Set src.
						$modalImg.attr('src', href);

					// Set visible.
						$modal.addClass('visible');

					// Focus.
						$modal.focus();

					// Delay.
						setTimeout(function() {

							// Unlock.
								$modal[0]._locked = false;

						}, 600);

				})
				.on('click', '.modal', function(event) {

					var $modal = $(this),
						$modalImg = $modal.find('img');

					// Locked? Bail.
						if ($modal[0]._locked)
							return;

					// Already hidden? Bail.
						if (!$modal.hasClass('visible'))
							return;

					// Lock.
						$modal[0]._locked = true;

					// Clear visible, loaded.
						$modal
							.removeClass('loaded')

					// Delay.
						setTimeout(function() {

							$modal
								.removeClass('visible')

							setTimeout(function() {

								// Clear src.
									$modalImg.attr('src', '');

								// Unlock.
									$modal[0]._locked = false;

								// Focus.
									$body.focus();

							}, 475);

						}, 125);

				})
				.on('keypress', '.modal', function(event) {

					var $modal = $(this);

					// Escape? Hide modal.
						if (event.keyCode == 27)
							$modal.trigger('click');

				})
				.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
					.find('img')
						.on('load', function(event) {

							var $modalImg = $(this),
								$modal = $modalImg.parents('.modal');

							setTimeout(function() {

								// No longer visible? Bail.
									if (!$modal.hasClass('visible'))
										return;

								// Set loaded.
									$modal.addClass('loaded');

							}, 275);

						});

					document.querySelector('[data-text=year]').textContent = year

})(jQuery);