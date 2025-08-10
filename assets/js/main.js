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
				onPopupOpen: function() { $body.addClass('modal-active'); 
											 $(document)
      											.off('click.px', '.poptrox-popup .caption, .poptrox-popup .caption a')
      											.on('click.px', '.poptrox-popup .caption, .poptrox-popup .caption a', function (e) {
        											e.stopPropagation();
      											});
  										},
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


		console.log("💥 poptrox 실행됨!", $('#main')[0]._poptrox);  //poptrox 디버그코드



// 타이핑 자막 애니메이션 함수
function startTypingAnimation() {
  const text = "Portfolio";
  const typedText = document.getElementById("typed-text");
  const cursor = document.getElementById("typed-cursor");
  let i = 0;

  function type() {
    if (i <= text.length) {
      typedText.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 120);
    }
  }

  type();
}


	
// 로켓 애니메이션 함수
function flyRocketAccurately() {
	console.log("🔥 flyRocketAccurately() 실행됨");
	
  const rocket = document.querySelector('.rocket-fly');
  const donut = document.querySelector('.donut-BG');

  if (!rocket) {
    console.warn("❌ rocket-fly 요소 없음");
    return;
  }

  if (!donut) {
    console.warn("❌ donut-BG 요소 없음");
    return;
  }


  console.log("🚀 로켓 발사 중!");

  // 안전하게 스타일 설정
 
    rocket.style.opacity = '1';
    rocket.style.zIndex = '9999';
    rocket.style.width = '200px';
    rocket.style.height = 'auto';
  
  const donutRect = donut.getBoundingClientRect();
  const donutCenterY = donutRect.top + window.scrollY + donutRect.height / 2;

  // 애니메이션 실행
  try {
    rocket.animate([
      { transform: `translate(-10vw, 100vh) rotate(-15deg)`, opacity: 0 },
      { transform: `translate(50vw, ${donutCenterY}px) rotate(0deg)`, opacity: 1 },
      { transform: `translate(110vw, -30vh) rotate(20deg)`, opacity: 0 }
    ], {
      duration: 4000,
      easing: 'ease-in-out',
      fill: 'forwards'
    });
  } 
  catch (e) {
    console.error("❌ 애니메이션 실행 실패", e);
  }
}


// 타이핑 애니메이션 함수
function startTypingAnimation() {
  const text = "Portfolio";
  const typedText = document.getElementById("typed-text");
  const cursor = document.getElementById("typed-cursor");
  let i = 0;

  function type() {
    if (i <= text.length) {
      typedText.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 120);
    }
  }

  type();
}

// ✅ 모든 DOM이 준비되면 한 번에 실행
document.addEventListener("DOMContentLoaded", () => {
  // 타이핑 감지
  const typingTarget = document.querySelector(".hero-title");
  if (typingTarget) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startTypingAnimation();
          observer.unobserve(entry.target); // 1번만 실행
        }
      });
    }, {
      threshold: 0.6
    });
    observer.observe(typingTarget);
  }
  // 로켓 클릭 이벤트
  const donut = document.querySelector('.donut-BG');
  if (donut) {
    console.log("✅ 도넛 요소 찾음");

    donut.addEventListener('click', () => {
      console.log("👆 도넛 클릭됨!");
      flyRocketAccurately(); // 로켓 발사 함수 호출
    });
  } else {
    console.warn("❌ 도넛 요소를 못 찾음");
  }

  // 리사이즈 대응
  window.addEventListener('resize', () => {
    console.log("창 크기 변경됨. 다음 발사 시 궤도에 반영됩니다.");
  });
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
	launchHearts();

	// 좋아요 숫자 +1 증가
	fetch(`https://script.google.com/macros/s/AKfycbw6jrYpLM3nrZeXmAJsZOXyWg48TwJTrYlVXvcT01kvq0flhDipUV4E7BAOiaSu0iUxcw/exec?inc=1`)
		.then(res => res.json())
		.then(res => {
			document.getElementById('like-count').textContent = res.value;
		});
});

// 하트 애니메이션 함수 (wiggle/크기 랜덤 포함)

function launchHearts() {    //랜덤 이모지 배열
	const emojis = ['❤️','💛','💜','💙','💚','🧡','🤍','💖','✨','🔥','😍','🌈','🎉','🥰','😎','👍','⭐️','🦄'];
	const emoji = emojis[Math.floor(Math.random() * emojis.length)];
	const hearts = Math.floor(Math.random() * 7) + 6; // 6~12개 랜덤
	for (let i = 0; i < hearts; i++) {
		createFloatingHeart(emoji); // 한 번 선택된 emoji로만 생성
	}
}

function createFloatingHeart(emoji) {
	const heart = document.createElement('div');
	heart.className = 'heart-fx';
	heart.innerHTML = emoji;  // 넘겨받은 이모지만 넣기!

	const left = 10 + Math.random() * 80;
	const top = 80 + Math.random() * 20;
	heart.style.left = `${left}%`;
	heart.style.top = `${top}%`;

	const rot = Math.floor(Math.random() * 60) - 30;
	const up = -120 - Math.random()*90;      // 위로 -120~-210px
	const wiggle = Math.floor(Math.random() * 70) - 35; // -35~+35px

	heart.style.fontSize = `${2.6 + Math.random()*2.0}em`;

	heart.style.setProperty('--rot', `${rot}deg`);
	heart.style.setProperty('--up', `${up}px`);
	heart.style.setProperty('--wiggle', `${wiggle}px`);

	heartFxContainer.appendChild(heart);

	(function animateSinCurve(heart, baseTop, up, left, wiggle, rot) {
		const duration = 1800;
		const start = performance.now();
		function frame(now) {
			let t = (now - start) / duration;
			if (t > 1) t = 1;
			const y = baseTop + up * t;
			const x = left + Math.sin(t * Math.PI * 2) * wiggle;
			heart.style.top = `${y}%`;
			heart.style.left = `${x}%`;
			heart.style.opacity = t < 0.1 ? t * 10 : t > 0.85 ? (1 - t) * 5 : 1;
			heart.style.transform = `scale(${1.1 - t*0.7}) rotate(${rot}deg)`;
			if (t < 1) requestAnimationFrame(frame);
			else heart.remove();
		}
		requestAnimationFrame(frame);
	})(heart, top, up, left, wiggle, rot);
}

//스크롤스냅
(function($) {
	const $window = $(window);

	function easeInOut(t) {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}

	function smoothScrollTo(targetY, duration = 1200) {
		const startY = window.scrollY;
		const diff = targetY - startY;
		const startTime = performance.now();

		function frame(currentTime) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = easeInOut(progress);
			window.scrollTo(0, startY + diff * eased);
			if (progress < 1) requestAnimationFrame(frame);
		}

		requestAnimationFrame(frame);
	}

	$window.on('load', function () {
		const $banner = $('.donut-banner');
		const $wrapper = $('#wrapper');
		//const $hero = $('.hero-title');

		let snappedBanner = false;
		let snappedHero = false;

		$window.on('wheel', function (e) {
			if (!snappedBanner && $banner.length && e.originalEvent.deltaY > 0) {
				const bannerBottom = $banner.offset().top + $banner.outerHeight();
				if (window.scrollY < bannerBottom - 100) {
					e.preventDefault();
					snappedBanner = true;
					smoothScrollTo($wrapper.offset().top);
					setTimeout(() => { snappedBanner = false }, 1400);
				}
			}
		});

		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting && !snappedHero) {
					snappedHero = true;
					smoothScrollTo(entry.target.offsetTop);
					setTimeout(() => { snappedHero = false }, 1400);
				}
			});
		}, { threshold: 0.6 });

		if ($hero.length) observer.observe($hero[0]);
		});
	})(jQuery);




})(jQuery);
