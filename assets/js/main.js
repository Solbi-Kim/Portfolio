/*
	Multiverse by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ]
		});

	// Hack: Enable IE workarounds.
		if (browser.name == 'ie')
			$body.addClass('ie');

	// Touch?
		if (browser.mobile)
			$body.addClass('touch');

	// Transitions supported?
		if (browser.canUse('transition')) {

			// Play initial animations on page load.
				$window.on('load', function() {
					window.setTimeout(function() {
						$body.removeClass('is-preload');
					}, 100);
				});

			// Prevent transitions/animations on resize.
				var resizeTimeout;

				$window.on('resize', function() {

					window.clearTimeout(resizeTimeout);

					$body.addClass('is-resizing');

					resizeTimeout = window.setTimeout(function() {
						$body.removeClass('is-resizing');
					}, 100);

				});

		}

	// Scroll back to top.
		$window.scrollTop(0);

	// Panels.
		var $panels = $('.panel');

		$panels.each(function() {

			var $this = $(this),
				$toggles = $('[href="#' + $this.attr('id') + '"]'),
				$closer = $('<div class="closer" />').appendTo($this);

			// Closer.
				$closer
					.on('click', function(event) {
						$this.trigger('---hide');
					});

			// Events.
				$this
					.on('click', function(event) {
						event.stopPropagation();
					})
					.on('---toggle', function() {

						if ($this.hasClass('active'))
							$this.triggerHandler('---hide');
						else
							$this.triggerHandler('---show');

					})
					.on('---show', function() {

						// Hide other content.
							if ($body.hasClass('content-active'))
								$panels.trigger('---hide');

						// Activate content, toggles.
							$this.addClass('active');
							$toggles.addClass('active');

						// Activate body.
							$body.addClass('content-active');

					})
					.on('---hide', function() {

						// Deactivate content, toggles.
							$this.removeClass('active');
							$toggles.removeClass('active');

						// Deactivate body.
							$body.removeClass('content-active');

					});

			// Toggles.
				$toggles
					.removeAttr('href')
					.css('cursor', 'pointer')
					.on('click', function(event) {

						event.preventDefault();
						event.stopPropagation();

						$this.trigger('---toggle');

					});

		});

		// Global events.
			$body
				.on('click', function(event) {

					if ($body.hasClass('content-active')) {

						event.preventDefault();
						event.stopPropagation();

						$panels.trigger('---hide');

					}

				});

			$window
				.on('keyup', function(event) {

					if (event.keyCode == 27
					&&	$body.hasClass('content-active')) {

						event.preventDefault();
						event.stopPropagation();

						$panels.trigger('---hide');

					}

				});

	// Header.
		var $header = $('#header');

		// Links.
			$header.find('a').each(function() {

				var $this = $(this),
					href = $this.attr('href');

				// Internal link? Skip.
					if (!href
					||	href.charAt(0) == '#')
						return;

				// Redirect on click.
					$this
						.removeAttr('href')
						.css('cursor', 'pointer')
						.on('click', function(event) {

							event.preventDefault();
							event.stopPropagation();

							window.location.href = href;

						});

			});

	// Footer.
		var $footer = $('#footer');

		// Copyright.
		// This basically just moves the copyright line to the end of the *last* sibling of its current parent
		// when the "medium" breakpoint activates, and moves it back when it deactivates.
			$footer.find('.copyright').each(function() {

				var $this = $(this),
					$parent = $this.parent(),
					$lastParent = $parent.parent().children().last();

				breakpoints.on('<=medium', function() {
					$this.appendTo($lastParent);
				});

				breakpoints.on('>medium', function() {
					$this.appendTo($parent);
				});

			});

	// Main.
		var $main = $('#main');

		// Thumbs.
			$main.children('.thumb').each(function() {

				var	$this = $(this),
					$image = $this.find('.image'), $image_img = $image.children('img'),
					x;

				// No image? Bail.
					if ($image.length == 0)
						return;

				// Image.
				// This sets the background of the "image" <span> to the image pointed to by its child
				// <img> (which is then hidden). Gives us way more flexibility.

					// Set background.
						$image.css('background-image', 'url(' + $image_img.attr('src') + ')');

					// Set background position.
						if (x = $image_img.data('position'))
							$image.css('background-position', x);

					// Hide original img.
						$image_img.hide();

			});

		// Poptrox.
			$main.poptrox({
				baseZIndex: 20000,
				caption: function($a) {

					var s = '';

					$a.nextAll().each(function() {
						s += this.outerHTML;
					});

					return s;

				},
				fadeSpeed: 300,
				onPopupClose: function() { $body.removeClass('modal-active'); },
				onPopupOpen: function() { $body.addClass('modal-active'); },
				overlayOpacity: 0,
				popupCloserText: '',
				popupHeight: 150,
				popupLoaderText: '',
				popupSpeed: 300,
				popupWidth: 150,
				selector: '.thumb > a.image',
				usePopupCaption: true,
				usePopupCloser: true,
				usePopupDefaultStyling: false,
				usePopupForceClose: true,
				usePopupLoader: true,
				usePopupNav: true,
				windowMargin: 10
			});

			// Hack: Set margins to 0 when 'xsmall' activates.
				breakpoints.on('<=xsmall', function() {
					$main[0]._poptrox.windowMargin = 0;
				});

				breakpoints.on('>xsmall', function() {
					$main[0]._poptrox.windowMargin = 50;
				});

		// 반응형 제목
		document.addEventListener("DOMContentLoaded", function () {
  			const text = "Portfolio";
  			const typedText = document.getElementById("typed-text");
  			const cursor = document.getElementById("typed-cursor");
  			let i = 0;
  		function type() {
    			if (i <= text.length) {
      				typedText.textContent = text.slice(0, i);
      				i++;
      				setTimeout(type, 120); // 타이핑 속도 조절(밀리초)
    			}
  		}
  		type();
		});


// 좋아요 숫자 카운터 불러오기(페이지 로드 시)
const counterKey = 'solbi-portfolio-2024/likes';
// 페이지 로드할때 이전 좋아요 숫자 get
fetch(`https://script.google.com/macros/s/AKfycbw6jrYpLM3nrZeXmAJsZOXyWg48TwJTrYlVXvcT01kvq0flhDipUV4E7BAOiaSu0iUxcw/exec`)
	.then(res => res.json())
	.then(res => {
		document.getElementById('like-count').textContent = res.value ?? 0;
	})
	.catch(() => {
		document.getElementById('like-count').textContent = 0;
	});

// 하트 애니메이션 및 숫자증가
const heartFxContainer = document.getElementById('heart-fx-container');
const heartBtn = document.getElementById('like-btn');

heartBtn.addEventListener('click', function() {
	// 하트 여러 개(6~12개) 랜덤 생성
	const hearts = Math.floor(Math.random()*7) + 6;
	for (let i = 0; i < count; i++) {
		createFloatingEmoji();
	}
	currentEmojiIndex = Math.floor(Math.random() * emojiList.length); //다른 이모지로 랜덤하게 바꾸기!

	// 좋아요 숫자 +1 증가
	fetch(`https://script.google.com/macros/s/AKfycbw6jrYpLM3nrZeXmAJsZOXyWg48TwJTrYlVXvcT01kvq0flhDipUV4E7BAOiaSu0iUxcw/exec?inc=1`)
		.then(res => res.json())
		.then(res => {
			document.getElementById('like-count').textContent = res.value;
		});
});

// 하트 애니메이션 함수 (wiggle/크기 랜덤 포함)
const emojiList = ['❤️', '😍', '🔥', '👏', '🤩', '✨', '💎', '😎'];
let currentEmojiIndex = 0;  // 전역 변수로 현재 이모지 기억

function createFloatingEmoji() {
	const emoji = document.createElement('div');
	emoji.className = 'heart-fx';
	emoji.innerHTML = emojiList[currentEmojiIndex];

	const left = 10 + Math.random() * 80;
	const top = 25 + Math.random() * 45;
	emoji.style.left = `${left}%`;
	emoji.style.top = `${top}%`;

	const rot = Math.floor(Math.random() * 60) - 30;
	const up = -120 - Math.random()*90;
	const wiggle = Math.floor(Math.random() * 70) - 35;

	emoji.style.fontSize = `${2.6 + Math.random()*2.0}em`;

	emoji.style.setProperty('--rot', `${rot}deg`);
	emoji.style.setProperty('--up', `${up}px`);
	emoji.style.setProperty('--wiggle', `${wiggle}px`);

	heartFxContainer.appendChild(emoji);
	emoji.addEventListener('animationend', () => emoji.remove());
}

})(jQuery);
