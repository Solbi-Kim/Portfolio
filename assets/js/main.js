
/*
	Multiverse by HTML5 UP (customized)
	- Removed rocket-related code and duplicate typing function
	- Kept Poptrox/lightbox, panels, header/footer link handling, image bg setup
	- Kept typing animation (single definition) and init
	- Kept like-counter + heart FX
	- Kept scroll-snap (class .donut-banner is used only as a section hook; not animating donuts)
*/

(function ($) {
  var $window = $(window),
    $body = $("body"),
    $wrapper = $("#wrapper");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: [null, "480px"],
  });

  // Hack: Enable IE workarounds.
  if (browser.name == "ie") $body.addClass("ie");

  // Touch?
  if (browser.mobile) $body.addClass("touch");

  // Transitions supported?
  if (browser.canUse("transition")) {
    // Play initial animations on page load.
    $window.on("load", function () {
      window.setTimeout(function () {
        $body.removeClass("is-preload");
      }, 100);
    });

    // Prevent transitions/animations on resize.
    var resizeTimeout;

    $window.on("resize", function () {
      window.clearTimeout(resizeTimeout);
      $body.addClass("is-resizing");
      resizeTimeout = window.setTimeout(function () {
        $body.removeClass("is-resizing");
      }, 100);
    });
  }

  // Scroll back to top.
  $window.scrollTop(0);

  // Panels.
  var $panels = $(".panel");

  $panels.each(function () {
    var $this = $(this),
      $toggles = $('[href="#' + $this.attr("id") + '"]'),
      $closer = $('<div class="closer" />').appendTo($this);

    // Closer.
    $closer.on("click", function () {
      $this.trigger("---hide");
    });

    // Events.
    $this
      .on("click", function (event) {
        event.stopPropagation();
      })
      .on("---toggle", function () {
        if ($this.hasClass("active")) $this.triggerHandler("---hide");
        else $this.triggerHandler("---show");
      })
      .on("---show", function () {
        // Hide other content.
        if ($body.hasClass("content-active")) $panels.trigger("---hide");

        // Activate content, toggles.
        $this.addClass("active");
        $toggles.addClass("active");

        // Activate body.
        $body.addClass("content-active");
      })
      .on("---hide", function () {
        // Deactivate content, toggles.
        $this.removeClass("active");
        $toggles.removeClass("active");

        // Deactivate body.
        $body.removeClass("content-active");
      });

    // Toggles.
    $toggles
      .removeAttr("href")
      .css("cursor", "pointer")
      .on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $this.trigger("---toggle");
      });
  });

  // Global events.
  $body.on("click", function (event) {
    if ($body.hasClass("content-active")) {
      event.preventDefault();
      event.stopPropagation();
      $panels.trigger("---hide");
    }
  });

  $window.on("keyup", function (event) {
    if (event.keyCode == 27 && $body.hasClass("content-active")) {
      event.preventDefault();
      event.stopPropagation();
      $panels.trigger("---hide");
    }
  });

  // Header.
  var $header = $("#header");

  // Links.
  $header.find("a").each(function () {
    var $this = $(this),
      href = $this.attr("href");

    // Internal link? Skip.
    if (!href || href.charAt(0) == "#") return;

    // Redirect on click.
    $this
      .removeAttr("href")
      .css("cursor", "pointer")
      .on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = href;
      });
  });

  // Footer.
  var $footer = $("#footer");

  // Copyright reflow at medium
  $footer.find(".copyright").each(function () {
    var $this = $(this),
      $parent = $this.parent(),
      $lastParent = $parent.parent().children().last();

    breakpoints.on("<=medium", function () {
      $this.appendTo($lastParent);
    });

    breakpoints.on(">medium", function () {
      $this.appendTo($parent);
    });
  });

  // Main.
  var $main = $("#main");

  // Thumbs: set bg-image from <img>
  $main.children(".thumb").each(function () {
    var $this = $(this),
      $image = $this.find(".image"),
      $image_img = $image.children("img"),
      x;

    if ($image.length == 0) return;

    $image.css("background-image", "url(" + $image_img.attr("src") + ")");

    if ((x = $image_img.data("position"))) $image.css("background-position", x);

    $image_img.hide();
  });


	
// -- Poptrox.
	$main.poptrox({
		overlayCloser: true, // 팝업 외부 클릭 닫기 허용
		usePopupEasyClose: false, // 팝업 본체 클릭 시 닫기 방지
		baseZIndex: 20000,
		caption: function ($a) {
			var s = "";
			$a.nextAll().each(function () {
				s += this.outerHTML;
			});
			return s;
		},
		fadeSpeed: 300,
		onPopupClose: function () {
			/* PATCH[stacked]: cleanup */
			try {
				var $popup = $('.poptrox-popup');
				$popup.removeClass('stacked');
				if ($popup[0]) $popup[0].style.removeProperty('--cap-h');
				var handler = $popup.data('__stackedResizeHandler');
				if (handler) {
					window.removeEventListener('resize', handler);
					$popup.removeData('__stackedResizeHandler');
				}
				var ro = $popup.data('__capRO');
				if (ro) { 
					try { ro.disconnect(); } catch (e) {} 
					$popup.removeData('__capRO'); 
				}
			} catch (err) {
				console.warn('[stacked] cleanup failed', err);
			}
			$body.removeClass("modal-active");
		},
		onPopupOpen: function () {
			requestAnimationFrame(() => {
				$body.addClass("modal-active");
			});

			$(window).trigger('resize');
			// 이미지 max-height 직접 계산해서 적용
			var capHeight = $('.poptrox-popup .caption').outerHeight() || 140;
			$('.poptrox-popup .image').css('max-height', (window.innerHeight - capHeight) + 'px');

			/* PATCH[stacked]: enable vertical stack and set caption height CSS var */
			try {
				var $popup = $('.poptrox-popup');
				$popup.addClass('stacked');

				var $cap = $popup.find('.caption');
				function setCapHeight() {
					var capH = ($cap.outerHeight && $cap.outerHeight()) || ($cap[0] ? $cap[0].offsetHeight : 140) || 140;
					if ($popup[0]) $popup[0].style.setProperty('--cap-h', capH + 'px');
				}
				setCapHeight();

				var __stackedResizeHandler = function () { setCapHeight(); };
				window.addEventListener('resize', __stackedResizeHandler);

				if (window.ResizeObserver && $cap[0]) {
					var __capRO = new ResizeObserver(function () { setCapHeight(); });
					__capRO.observe($cap[0]);
					$popup.data('__capRO', __capRO);
				}
				$popup.data('__stackedResizeHandler', __stackedResizeHandler);

				// === 캡션을 .content 영역 안으로 이동 ===
				var $content = $popup.find('.content');
				if ($cap.length && $content.length) {
					$cap.appendTo($content);
				}
			} catch (err) {
				console.warn('[stacked] init failed', err);
			}

			// === 버튼/링크 클릭 시 닫기 방지 (정리 버전) ===
			$(document)
				.off('click.px', '.poptrox-popup .caption a, .poptrox-popup .caption button')
				.on('click.px', '.poptrox-popup .caption a, .poptrox-popup .caption button', function (e) {
					e.stopPropagation(); // 팝업 닫기 방지
					// 기본 동작 실행 (a면 링크 이동, button이면 버튼 동작)
				});
		},
		overlayOpacity: 0,
		popupCloserText: "",
		popupHeight: 150,
		popupLoaderText: "",
		popupSpeed: 300,
		popupWidth: 150,
		selector: ".thumb > a.image",
		usePopupCaption: true,
		usePopupCloser: true,
		usePopupDefaultStyling: false,
		usePopupForceClose: true,
		usePopupLoader: true,
		usePopupNav: true,
		windowMargin: 10
	});

	// -- Hack: Set margins to 0 when 'xsmall' activates.
	breakpoints.on("<=xsmall", function () {
		$main[0]._poptrox.windowMargin = 0;
	});
	breakpoints.on(">xsmall", function () {
		$main[0]._poptrox.windowMargin = 50;
	});

	console.log("💥 poptrox 실행됨!", $("#main")[0]._poptrox);  //수정됨



//  -------별자리 그리기 로직--------
// -------------------------
// 랜덤 별 생성 + 별자리 연결 로직
// -------------------------
function createStars(containerSelector, count = 512) {  //별 개수
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const starChars = ['\u2726', '\u2727', '\u2722']; // ✦, ✧, ✢
    let connectMode = false;
    let lastStar = null;
    let tempLine = null; // 마우스 따라가는 임시 선

    // SVG 레이어 생성
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("star-lines");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.zIndex = "0"; // 별보다 뒤에
    container.appendChild(svg);

    // 랜덤 별 생성
    for (let i = 0; i < count; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = starChars[Math.floor(Math.random() * starChars.length)];
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.fontSize = `${Math.random() * 11 + 3}px`; // 3~14px
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.pointerEvents = 'auto'; // 클릭 가능하게

        // 클릭 이벤트
        star.addEventListener('click', (e) => {
            e.stopPropagation();

            const rect = star.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const x = rect.left + rect.width / 2 - containerRect.left;
            const y = rect.top + rect.height / 2 - containerRect.top;

            if (!connectMode) {
                // 첫 클릭 → 연결 모드 켜기
                connectMode = true;
                lastStar = e.target;

                // 임시 선 생성
                tempLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                tempLine.classList.add("temp-line");
                tempLine.setAttribute("x1", x);
                tempLine.setAttribute("y1", y);
                tempLine.setAttribute("x2", x);
                tempLine.setAttribute("y2", y);
                svg.appendChild(tempLine);
            } else {
                // 두 번째 이후 클릭 → 선 그리기
                drawLine(lastStar, e.target);

                // 새 임시 선을 현재 별에서 시작
                lastStar = e.target;
                const rectNew = lastStar.getBoundingClientRect();
                const xNew = rectNew.left + rectNew.width / 2 - containerRect.left;
                const yNew = rectNew.top + rectNew.height / 2 - containerRect.top;
                tempLine.setAttribute("x1", xNew);
                tempLine.setAttribute("y1", yNew);
            }
        });

        container.appendChild(star);
    }

    // 마우스 이동 → 임시 선 끝점 따라감
    document.addEventListener('mousemove', (e) => {
        if (connectMode && tempLine && lastStar) {
            const rect1 = lastStar.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const x1 = rect1.left + rect1.width / 2 - containerRect.left;
            const y1 = rect1.top + rect1.height / 2 - containerRect.top;
            const x2 = e.clientX - containerRect.left;
            const y2 = e.clientY - containerRect.top;

            tempLine.setAttribute("x1", x1);
            tempLine.setAttribute("y1", y1);
            tempLine.setAttribute("x2", x2);
            tempLine.setAttribute("y2", y2);
        }
    });

    // 별 아닌 곳 클릭 시 모드 해제
    document.addEventListener('click', (e) => {
    // 클릭한 게 별이 아닐 때만
    if (!e.target.classList.contains('star')) {
        connectMode = false;
        lastStar = null;
        if (tempLine) {
            tempLine.remove();
            tempLine = null;
        }
    }
});
    // 선 그리기 함수
    function drawLine(star1, star2) {
        const rect1 = star1.getBoundingClientRect();
        const rect2 = star2.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const x1 = rect1.left + rect1.width / 2 - containerRect.left;
        const y1 = rect1.top + rect1.height / 2 - containerRect.top;
        const x2 = rect2.left + rect2.width / 2 - containerRect.left;
        const y2 = rect2.top + rect2.height / 2 - containerRect.top;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.classList.add("star-line");

        svg.appendChild(line);
    }
}

// 실행
createStars('.stars', 100);





  // ---- Typing animation (single definition) ----
  function startTypingAnimation() {
    const text = "Portfolio";
    const typedText = document.getElementById("typed-text");
    const cursor = document.getElementById("typed-cursor");
    let i = 0;

    function type() {
      if (!typedText) return;
      if (i <= text.length) {
        typedText.textContent = text.slice(0, i);
        i++;
        setTimeout(type, 120);
      }
    }

    type();
  }

  // Init on first intersection of .hero-title
  document.addEventListener("DOMContentLoaded", function () {
    const typingTarget = document.querySelector(".hero-title");
    if (typingTarget) {
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startTypingAnimation();
              observer.unobserve(entry.target); // run once
            }
          });
        },
        { threshold: 0.6 }
      );
      observer.observe(typingTarget);
    }
  });

/* ---------------- Like counter & Heart FX (plain JS) ---------------- */

const counterKey = "solbi-portfolio-2024/likes";

// Load like count on page load
fetch(
  "https://script.google.com/macros/s/AKfycbw6jrYpLM3nrZeXmAJsZOXyWg48TwJTrYlVXvcT01kvq0flhDipUV4E7BAOiaSu0iUxcw/exec"
)
  .then((res) => res.json())
  .then((res) => {
    const el = document.getElementById("like-count");
    if (el) el.textContent = res.value ?? 0;
  })
  .catch(() => {
    const el = document.getElementById("like-count");
    if (el) el.textContent = 0;
  });

const heartFxContainer = document.getElementById("heart-fx-container");
const heartBtn = document.getElementById("like-btn");

if (heartBtn) {
  heartBtn.addEventListener("click", function () {
    launchHearts();
    fetch(
      "https://script.google.com/macros/s/AKfycbw6jrYpLM3nrZeXmAJsZOXyWg48TwJTrYlVXvcT01kvq0flhDipUV4E7BAOiaSu0iUxcw/exec?inc=1"
    )
      .then((res) => res.json())
      .then((res) => {
        const el = document.getElementById("like-count");
        if (el) el.textContent = res.value;
      });
  });
}

function launchHearts() {
  const emojis = [
    "❤️",
    "💛",
    "💜",
    "💙",
    "💚",
    "🧡",
    "🤍",
    "💖",
    "✨",
    "🔥",
    "😍",
    "🌈",
    "🎉",
    "🥰",
    "😎",
    "👍",
    "⭐️",
    "🦄",
  ];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  const hearts = Math.floor(Math.random() * 7) + 6; // 6~12

  for (let i = 0; i < hearts; i++) createFloatingHeart(emoji);
}

function createFloatingHeart(emoji) {
  if (!heartFxContainer) return;
  const heart = document.createElement("div");
  heart.className = "heart-fx";
  heart.innerHTML = emoji;

  const left = 10 + Math.random() * 80;
  const top = 80 + Math.random() * 20;
  heart.style.left = `${left}%`;
  heart.style.top = `${top}%`;

  const rot = Math.floor(Math.random() * 60) - 30;
  const up = -120 - Math.random() * 90;
  const wiggle = Math.floor(Math.random() * 70) - 35;

  heart.style.fontSize = `${2.6 + Math.random() * 2.0}em`;

  heart.style.setProperty("--rot", `${rot}deg`);
  heart.style.setProperty("--up", `${up}px`);
  heart.style.setProperty("--wiggle", `${wiggle}px`);

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
      heart.style.transform = `scale(${1.1 - t * 0.7}) rotate(${rot}deg)`;
      if (t < 1) requestAnimationFrame(frame);
      else heart.remove();
    }
    requestAnimationFrame(frame);
  })(heart, top, up, left, wiggle, rot);
}

/* ---------------- Scroll Snap helper (uses .donut-banner as section hook) ---------------- */
(function ($) {
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

  $window.on("load", function () {
    const $banner = $(".donut-banner"); // name kept for compatibility
    const $wrapper = $("#wrapper");
    let snappedBanner = false;
    //let snappedHero = false;

    // wheel snap off banner to wrapper
    $window.on("wheel", function (e) {
      if (window.__InertiaScrollInit) return; // inertia active -> skip snap
      if (!$banner.length) return;
      if (!snappedBanner && e.originalEvent.deltaY > 0) {
        const bannerBottom = $banner.offset().top + $banner.outerHeight();
        if (window.scrollY < bannerBottom - 100) {
          e.stopImmediatePropagation();
      e.preventDefault();
          snappedBanner = true;
          smoothScrollTo($wrapper.offset().top);
          setTimeout(() => {
            snappedBanner = false;
          }, 1400);
        }
      }
    });

  });
})(jQuery);


// 터치 장치 여부 체크
function isTouchDevice() {
  return (
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    navigator.msMaxTouchPoints > 0
  );
}

// 화면 크기 기준으로 스마트폰 / 태블릿 구분 (대략적)
function getDeviceType() {
  const width = window.innerWidth;
  if (width <= 768) return 'smartphone';
  if (width <= 1200) return 'tablet';
  return 'desktop';
}

const html = document.documentElement;

if (isTouchDevice()) {
  html.classList.add('is-touch', getDeviceType());
} else {
  html.classList.add('is-desktop');
}

// -----------------------------------------------------------
// 🚀 Responsive rocket animation (absolute inside .donut-banner)
//    Trigger: CLICK on .donut-hover-zone (fallback: .donut-banner)
// -----------------------------------------------------------

/**
 * Fly the .rocket-fly from page bottom-left (off) → donut center → page top-right (off)
 * All points are computed in the .donut-banner coordinate system (px), so it works responsively.
 *
 * @param {Object} options
 *  - duration: number (ms)  default 4200
 *  - easing: string         default 'cubic-bezier(0.22, 1, 0.36, 1)'
 * @returns {Animation|undefined}
 */
function flyRocketResponsive(options = {}) {
  const duration = options.duration ?? 12000;
  const easing   = options.easing   ?? 'cubic-bezier(0.22, 1, 0.36, 1)';
  const rocket   = document.querySelector('.rocket-fly');
  const banner   = document.querySelector('.donut-banner');
  const donut    = document.querySelector('.donut-BG');

  if (!rocket || !banner || !donut) return;

  // 배너와 도넛 위치 정보
  const bannerRect = banner.getBoundingClientRect();
  const donutRect  = donut.getBoundingClientRect();

  // 도넛 중심 (배너 기준)
  const donutCX = (donutRect.left - bannerRect.left) + donutRect.width / 2;
  const donutCY = (donutRect.top - bannerRect.top) + donutRect.height / 2;

  // 로켓 크기
  const rW = rocket.offsetWidth  || 200;
  const rH = rocket.offsetHeight || (rW * 0.5);

  // **Y 좌표 보정**
  const yOffsetStart = bannerRect.height * -0.5;
  const yOffsetEnd   = bannerRect.height * -0.5;

  // 궤도 좌표
  const start = { x: -rW, y: bannerRect.height - rH/2 + yOffsetStart };
  const end   = { x: bannerRect.width + rW, y: -rH + yOffsetEnd };
  const mid   = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2  +bannerRect.height * 0.05};

  // 초기 상태
  rocket.style.left = '0px';
  rocket.style.top  = '0px';
  rocket.style.opacity = '1';

  const anim = rocket.animate([
    { 
      transform: `translate(${start.x}px, ${start.y}px) scale(1.6) rotate(18deg)`, 
      opacity: 0,
      easing: 'cubic-bezier(0.2, 0.6, 0.5, 1)' // scale 크게 시작 → 부드럽게 줄이기 시작
    },
    { 
      offset: 0.5, 
      transform: `translate(${mid.x}px, ${mid.y}px) scale(0.8) rotate(0deg)`, 
      opacity: 1,
      easing: 'cubic-bezier(0.42, 0, 0.58, 1)' // scale 안정화
    },
    { 
      transform: `translate(${end.x}px, ${end.y}px) scale(0.6) rotate(-18deg)`, 
      opacity: 0,
      easing: 'cubic-bezier(0.6, 0, 1, 1)' // 빠르게 사라짐
    }
  ], {
    duration,
    easing,
    fill: 'forwards'
  });

  return anim;
}

	//로켓 시퀀스 프레임순환
document.addEventListener('DOMContentLoaded', () => {
  const rocket = document.querySelector('.rocket-fly');
  const totalFrames = 15;  //마지막 프레임
  let current = 0;  //첫번째 프레임 
  let seqTimer = null;

  function startSequence() {
    if (seqTimer) return; // 이미 실행 중이면 무시
    current = 0;
    seqTimer = setInterval(() => {
      current = (current + 1) % (totalFrames + 1); // 0~15
      const frameNum = String(current).padStart(5, '0');
      rocket.src = `images/rocket_pngseq/rocket_${frameNum}.png`;
    }, 1000 / 30); // 30fps
  }

  function stopSequence() {
    if (seqTimer) {
      clearInterval(seqTimer);
      seqTimer = null;
      rocket.src = `images/rocket_pngseq/rocket_00000.png`; // 첫 프레임으로 고정
    }
  }

  // 발사 구역 클릭 시
  const zone = document.querySelector('.donut-hover-zone') || document.querySelector('.donut-banner');
  if (!zone) return;

  zone.addEventListener('click', () => {
    startSequence();           // 불꽃 시퀀스 시작
    flyRocketResponsive();     // 로켓 발사
    setTimeout(stopSequence, 3000); // 3초 후 불꽃 종료
  });
});

// ---------------로켓발사 클릭 트리거
document.addEventListener('DOMContentLoaded', () => {
  const zone = document.querySelector('.donut-hover-zone') || document.querySelector('.donut-banner');
  if (!zone) return;

  let busy = false;
  function fire() {
    if (busy) return;
    busy = true;
    flyRocketResponsive();
	setTimeout(() => { busy = false; }, 3000); // 3초후 재발사 가능
    }
	zone.addEventListener('click', fire);
});

// ===== Donut intro crossfade =====
document.addEventListener("DOMContentLoaded", () => {
	const banner = document.querySelector(".donut-banner");
	if (!banner) return;

	const video = banner.querySelector(".donut-intro");
	if (!video) return;

	// 영상 재생이 끝나면: 비디오 페이드아웃 + 이미지 페이드인
	video.addEventListener("ended", () => {
		banner.classList.add("reveal");
	});

	// 자동재생 실패나 에러 시: 바로 이미지로 폴백
	const revealFallback = () => banner.classList.add("reveal");
	video.addEventListener("error", revealFallback);

	// canplay 되면 한 번 더 재생 시도 (모바일 정책 대비)
	const tryPlay = () => {
		if (video.paused) {
			video.play().catch(revealFallback);
		}
	};
	video.addEventListener("canplay", tryPlay);
	video.addEventListener("canplaythrough", tryPlay);

	// 즉시 시도
	tryPlay();
});


//SorollEaseout
(() => {
  if (window.__InertiaScrollInit) return;
  window.__InertiaScrollInit = true;

  function initInertiaScroll(opts = {}) {
    // snap-from-banner → wrapper on first wheel down
    const __banner = document.querySelector('.donut-banner');
    const __wrapper = document.getElementById('wrapper');
    let __bannerSnapBusy = false;
    function __quickSnap(toY, dur=520){
      let startY = window.scrollY; const diff = toY - startY;
      const start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3); // easeOutCubic
      function raf(now){
        const p = Math.min(1, (now - start) / dur);
        const y = startY + diff * ease(p);
        window.scrollTo(0, y);
        if (p < 1) requestAnimationFrame(raf); else __bannerSnapBusy = false;
      }
      requestAnimationFrame(raf);
    }

    try { document.documentElement.style.scrollBehavior = 'auto'; } catch (e) {}
    const {
      friction = 0.92,      // 0.85~0.97에서 조절: 낮을수록 더 길게 흐름
      wheelBoost = 1.0,     // 휠 1틱당 가속도 배율
      maxSpeed = 60,        // 프레임당 최대 이동(px)
      allowNativeInside = '[data-native-scroll], .scroll-native',
    } = opts;

    // 접근성/터치 디바이스에서 비활성
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch && !opts.force) return;

    let rafId = 0;
    let vy = 0;                  // 세로 속도(픽셀/프레임)
    let targetY = window.scrollY;
    let animating = false;

    const clamp = (v,min,max)=>Math.min(max,Math.max(min,v));
    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    function canScroll(el, deltaY) {
      if (el.closest(allowNativeInside)) return true;
      let n = el;
      while (n && n !== document.documentElement) {
        const cs = getComputedStyle(n);
        const oy = cs.overflowY;
        const scrollable = (oy === 'auto' || oy === 'scroll');
        if (scrollable && n.scrollHeight > n.clientHeight) {
          if (deltaY > 0 && n.scrollTop + n.clientHeight < n.scrollHeight) return true;
          if (deltaY < 0 && n.scrollTop > 0) return true;
        }
        n = n.parentElement;
      }
      return false;
    }

    function loop() {
      // 감속 이징(관성)
      vy *= friction;
      if (Math.abs(vy) < 0.08) { // 거의 멈췄으면 종료
        animating = false;
        rafId = 0;
        return;
      }
      targetY = clamp(targetY + clamp(vy, -maxSpeed, maxSpeed), 0, maxScroll());
      window.scrollTo(0, targetY);
      rafId = requestAnimationFrame(loop);
    }

    window.addEventListener('wheel', (e) => {
      const delta = e.deltaY || 0;
      if (!delta) return;
      // --- banner → wrapper one-tick snap (down) ---
      if (!__bannerSnapBusy && __banner && __wrapper && delta > 0) {
        const bannerBottom = __banner.offsetTop + __banner.offsetHeight;
        // 트리거 영역: 배너 하단 - 100px 위까지
        if (window.scrollY < bannerBottom - 100) {
          e.stopImmediatePropagation();
          e.preventDefault();
          __bannerSnapBusy = true;
          // 관성 루프 중이면 정지
          try { vy = 0; } catch(_){ }
          try { animating = false; if (rafId) cancelAnimationFrame(rafId); } catch(_){ }
          __quickSnap(__wrapper.offsetTop);
          return; // 이 휠은 여기서 소비
        }
      }
      
      if (canScroll(e.target, delta)) return;  // 내부 스크롤 통과

      e.preventDefault();
      // 휠 입력 → 속도에 가산 (휠 멈춰도 vy가 남아 부드럽게 감속)
      vy += delta * wheelBoost * 0.2; // 0.2는 감도, 취향껏 0.15~0.3
      targetY = clamp(window.scrollY, 0, maxScroll());
      if (!animating) {
        animating = true;
        rafId = requestAnimationFrame(loop);
      }
    }, { capture: true, passive: false });

    // 키보드도 관성에 태움 (선택)
    window.addEventListener('keydown', (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      const h = window.innerHeight;
      let dy = 0;
      if (e.key === 'ArrowDown') dy = 80;
      if (e.key === 'ArrowUp')   dy = -80;
      if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) dy = h * 0.9;
      if (e.key === 'PageUp'   || (e.key === ' ' &&  e.shiftKey)) dy = -h * 0.9;
      if (e.key === 'Home')     targetY = 0;
      if (e.key === 'End')      targetY = maxScroll();
      if (!dy && e.key !== 'Home' && e.key !== 'End') return;

      e.preventDefault();
      if (dy) vy += dy * 0.25; // 키 입력도 관성에 합산
      if (!animating) {
        animating = true;
        rafId = requestAnimationFrame(loop);
      }
    }, { passive: false });

    // 리사이즈 보정
    addEventListener('resize', () => {
      targetY = clamp(targetY, 0, maxScroll());
      if (!animating) window.scrollTo(0, targetY);
    });
  }

  // 전역 노출
  window.initInertiaScroll = initInertiaScroll;
  // 바로 적용
  initInertiaScroll({
    friction: 0.945,    // 꼬리 더 길게
    wheelBoost: 0.5,   // 감도 
	keyStep: 64,          // ← 화살표 키 이동 px
  	pageRatio: 0.85,      // ← PageUp/Down 비율 
    maxSpeed: 70,
    force: true,        // 터치/트랙패드 환경에서도 강제 적용
    snap: { enabled: true, selector: '[data-snap]', thresholdPx: null , direction: 'down'},
	snapOnceDuration: 1100,
  	snapOnceEase: 'bezier(0.16, 1, 0.3, 1)'
  });

    function performSnapIfNeeded(){
      if (!snapCfg.enabled) return;
      const list = Array.from(document.querySelectorAll(snapCfg.selector));
      if (!list.length) return;
      const y = scroller.scrollTop;
      const vh = scroller.clientHeight;
      const th = snapCfg.thresholdPx != null ? snapCfg.thresholdPx : Math.round(vh * 0.12);
      let best = null;
      for (const el of list){
        const top = Math.max(0, el.offsetTop - snapCfg.headerOffset);
        const d = Math.abs(top - y);
        if (!best || d < best.d) best = {top, d};
      }
      if (best && best.d <= th){
        animateSnap(y, best.top);
      }
    }
    function animateSnap(from, to){
      snapping = true;
      const dur = 420;
      const ease = t => 1 - Math.pow(1 - t, 4); // easeOutQuart
      const start = performance.now();
      function raf(now){
        if (!snapping) return; // aborted by user
        const p = Math.min(1, (now - start) / dur);
        const y = from + (to - from) * ease(p);
        scroller.scrollTop = y;
        if (p < 1 && !running) requestAnimationFrame(raf);
        else snapping = false;
      }
      requestAnimationFrame(raf);
    }
})();




})(jQuery);  //necessary line



/* ===== Simple Threshold Snap (banner -> wrapper) — Addon =====
   작동 방식:
   - 도넛 배너(.donut-banner)에서 아래로 스크롤하다가
     메인(#wrapper)이 '살짝' 보이는 순간(THRESHOLD_PX) →
     짧게 대기(DELAY_MS) 후 #wrapper 최상단으로 부드럽게 정렬.
   - 관성 이징엔 간섭하지 않음. 애니메이션 중 사용자 입력이 들어오면 즉시 취소.
*/
(function(){
  const banner  = document.querySelector('.donut-banner');
  const wrapper = document.getElementById('wrapper');
  if (!banner || !wrapper) return;

  // ---- 튜닝 포인트 ----
  const HEADER_OFFSET = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
  const THRESHOLD_PX  = 24;     // 메인이 이만큼이라도 보이면 스냅 준비
  const DELAY_MS      = 90;     // 살짝 기다렸다가(관성 흘러가게) 스냅
  const DURATION_MS   = 1200;   // 스냅 시간
  const EASE_CURVE    = 'bezier(0.16, 1, 0.3, 1)'; // 느린 출발-긴 꼬리

  // ---- cubic-bezier helper ----
  function Bezier(mX1, mY1, mX2, mY2){
    const NEWTON_ITER=4, NEWTON_MIN_SLOPE=0.001, SUBDIV_MAX_ITER=10, SUBDIV_PRECISION=1e-7;
    const kSplineTableSize=11, kSampleStep=1.0/(kSplineTableSize-1);
    const sampleValues = typeof Float32Array==='function' ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    function A(a1,a2){return 1-3*a2+3*a1} function B(a1,a2){return 3*a2-6*a1} function C(a1){return 3*a1}
    function calcBezier(t,a1,a2){return ((A(a1,a2)*t + B(a1,a2))*t + C(a1))*t}
    function slope(t,a1,a2){return 3*A(a1,a2)*t*t + 2*B(a1,a2)*t + C(a1)}
    for (let i=0;i<kSplineTableSize;++i) sampleValues[i]=calcBezier(i*kSampleStep,mX1,mX2);
    function getTForX(x){
      let intervalStart=0, currentSample=1, lastSample=kSplineTableSize-1;
      for (; currentSample!==lastSample && sampleValues[currentSample] <= x; ++currentSample) intervalStart += kSampleStep;
      --currentSample;
      const dist=(x - sampleValues[currentSample])/(sampleValues[currentSample+1]-sampleValues[currentSample]);
      let guessForT=intervalStart + dist * kSampleStep;
      const initialSlope = slope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE){
        for (let i=0;i<NEWTON_ITER;++i){
          const s = slope(guessForT,mX1,mX2); if (s===0) return guessForT;
          const curX = calcBezier(guessForT,mX1,mX2)-x;
          guessForT -= curX / s;
        }
        return guessForT;
      } else if (initialSlope===0) return guessForT;
      let a=intervalStart, b=intervalStart+kSampleStep, curX, t, i=0;
      do { t=(a+b)/2; curX=calcBezier(t,mX1,mX2)-x; if (curX>0) b=t; else a=t; }
      while (Math.abs(curX)>SUBDIV_PRECISION && ++i<SUBDIV_MAX_ITER);
      return t;
    }
    return function(t){ if (t<=0) return 0; if (t>=1) return 1; const paramT = getTForX(t); return calcBezier(paramT, mY1, mY2); };
  }
  function parseEase(e){
    if (typeof e==='function') return e;
    if (Array.isArray(e) && e.length===4) return Bezier(e[0], e[1], e[2], e[3]);
    if (typeof e==='string' && e.startsWith('bezier(')){
      const n=e.slice(7,-1).split(',').map(s=>parseFloat(s));
      if (n.length===4 && n.every(v=>!Number.isNaN(v))) return Bezier(n[0],n[1],n[2],n[3]);
    }
    if (e==='cubic') return t=>1-Math.pow(1-t,3);
    if (e==='quart') return t=>1-Math.pow(1-t,4);
    if (e==='quint') return t=>1-Math.pow(1-t,5);
    return t=>1-Math.cos((t*Math.PI)/2); // sine
  }
  const ease = parseEase(EASE_CURVE);

  let isSnapping = false;
  let lastY = window.scrollY;
  let timer = null;

  function animateTo(targetY){
    const startY = window.scrollY;
    const start  = performance.now();
    isSnapping = true;
    function raf(now){
      if (!isSnapping) return;
      const p = Math.min(1, (now - start) / DURATION_MS);
      const y = startY + (targetY - startY) * ease(p);
      window.scrollTo(0, y);
      if (p < 1) requestAnimationFrame(raf);
      else isSnapping = false;
    }
    requestAnimationFrame(raf);
  }

  function onScroll(){ // passive
    const y = window.scrollY;
    const dir = Math.sign(y - lastY) || 0;
    lastY = y;
    if (isSnapping || dir <= 0) return; // 위로 올릴 땐 스냅 안 함

    const bannerBottom = banner.offsetTop + banner.offsetHeight - HEADER_OFFSET;
    const wrapperTop   = wrapper.offsetTop - HEADER_OFFSET;

    // "메인이 살짝 보였다" 판단: 배너 하단을 지나치면
    const crossed = y >= bannerBottom - THRESHOLD_PX && y < wrapperTop;
    if (!crossed){
      if (timer) { clearTimeout(timer); timer = null; }
      return;
    }

    // 잠깐 기다렸다가(관성 흘려보내고) 아직 조건 유지면 스냅
    if (!timer){
      timer = setTimeout(() => {
        timer = null;
        const y2 = window.scrollY;
        if (y2 >= bannerBottom - THRESHOLD_PX && y2 < wrapperTop && !isSnapping){
          animateTo(wrapperTop);
        }
      }, DELAY_MS);
    }
  }

  // 스냅 중 입력이 오면 즉시 취소 (사용자 우선)
  function cancel(){ if (isSnapping) isSnapping = false; }
  window.addEventListener('wheel', cancel, { capture:true, passive:false });
  window.addEventListener('touchstart', cancel, { capture:true, passive:true });
  window.addEventListener('keydown', cancel, { capture:true, passive:false });
  window.addEventListener('mousedown', cancel, { capture:true, passive:true });

  window.addEventListener('scroll', onScroll, { passive:true });
})();
