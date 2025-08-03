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
				windowMargin: 50
			});

			// Hack: Set margins to 0 when 'xsmall' activates.
				breakpoints.on('<=xsmall', function() {
					$main[0]._poptrox.windowMargin = 0;
				});

				breakpoints.on('>xsmall', function() {
					$main[0]._poptrox.windowMargin = 50;
				});
	
		// 영상 플레이어 iframe DOM
		const modal = document.getElementById("vimeoModal");
		const player = document.getElementById("vimeoPlayer");
		const closeBtn = document.getElementById("closeBtn");
		const prevBtn = document.getElementById("prevBtn");
		const nextBtn = document.getElementById("nextBtn");

		let currentIndex = 0;
		const thumbnails = document.querySelectorAll(".video-thumb");
		const videoIds = Array.from(thumbnails).map(el => el.dataset.video);

		// 썸네일 클릭 시
		thumbnails.forEach((thumb, index) => {
		  thumb.addEventListener("click", function (e) {
 		   e.preventDefault();
  		  currentIndex = index;
  		  openVideo(videoIds[currentIndex]);
		  });
		});

		function openVideo(id) {
		  player.src = `https://player.vimeo.com/video/${id}?autoplay=1&background=1&title=0&byline=0&portrait=0`;
		  modal.style.display = "block";
		}

		function closeModal() {
		  modal.style.display = "none";
		  player.src = "";
		}

		// X 버튼
		closeBtn.addEventListener("click", closeModal);

		// 바깥 클릭 시 닫기
		window.addEventListener("click", function (e) {
 		 if (e.target === modal) {
  		  closeModal();
 		 }
		});

		// 좌우 이동
		prevBtn.addEventListener("click", () => {
		  currentIndex = (currentIndex - 1 + videoIds.length) % videoIds.length;
		  openVideo(videoIds[currentIndex]);
		});

		nextBtn.addEventListener("click", () => {
		  currentIndex = (currentIndex + 1) % videoIds.length;
 		 openVideo(videoIds[currentIndex]);
		});

		const thumbs = Array.from(document.querySelectorAll(".video-thumb"));
		let currentIndex = 0;

		thumbs.forEach((thumb, index) => {
 		 thumb.addEventListener("click", function (e) {
  		  e.preventDefault();
		    currentIndex = index;
  		  const videoId = thumb.dataset.video;
  		  const videoURL = `https://player.vimeo.com/video/${videoId}?autoplay=1&background=1`;
  		  player.src = videoURL;
  		  modal.style.display = "block";
 		 });
		});

		function closeModal() {
 		 modal.style.display = "none";
 		 player.src = "";
		}

		window.addEventListener("click", function (e) {
 		 if (e.target === modal) closeModal();
		});

		function showVideoAt(index) {
 		 if (index < 0 || index >= thumbs.length) return;
		  const videoId = thumbs[index].dataset.video;
		  const videoURL = `https://player.vimeo.com/video/${videoId}?autoplay=1&background=1`;
		  player.src = videoURL;
 		 currentIndex = index;
		}

		function nextVideo() {
		  const nextIndex = currentIndex + 1;
		  if (nextIndex < thumbs.length) {
 		   showVideoAt(nextIndex);
		  }
		}

		function prevVideo() {
 		 const prevIndex = currentIndex - 1;
 		 if (prevIndex >= 0) {
   		 showVideoAt(prevIndex);
		  }
		}

})(jQuery);
