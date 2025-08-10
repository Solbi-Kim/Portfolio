
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

  // Poptrox.
  $main.poptrox({
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
        if (ro) { try { ro.disconnect(); } catch(e) {} $popup.removeData('__capRO'); }
      } catch (err) {
        console.warn('[stacked] cleanup failed', err);
      }

      $body.removeClass("modal-active");
    },
    onPopupOpen: function () {
      $body.addClass("modal-active");
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

        // Recompute on resize
        var __stackedResizeHandler = function() { setCapHeight(); };
        window.addEventListener('resize', __stackedResizeHandler);

        // Recompute on caption reflow
        if (window.ResizeObserver && $cap[0]) {
          var __capRO = new ResizeObserver(function(){ setCapHeight(); });
          __capRO.observe($cap[0]);
          $popup.data('__capRO', __capRO);
        }
        $popup.data('__stackedResizeHandler', __stackedResizeHandler);
      } catch (err) {
        console.warn('[stacked] init failed', err);
      }

      $(document)
        .off("click.px", ".poptrox-popup .caption, .poptrox-popup .caption a")
        .on("click.px", ".poptrox-popup .caption, .poptrox-popup .caption a", function (e) {
          e.stopPropagation();
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
    windowMargin: 10,
  });

  // Hack: Set margins to 0 when 'xsmall' activates.
  breakpoints.on("<=xsmall", function () {
    $main[0]._poptrox.windowMargin = 0;
  });

  breakpoints.on(">xsmall", function () {
    $main[0]._poptrox.windowMargin = 50;
  });

  console.log("💥 poptrox 실행됨!", $("#main")[0]._poptrox);

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
})(jQuery);

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
      if (!$banner.length) return;
      if (!snappedBanner && e.originalEvent.deltaY > 0) {
        const bannerBottom = $banner.offset().top + $banner.outerHeight();
        if (window.scrollY < bannerBottom - 100) {
          e.preventDefault();
          snappedBanner = true;
          smoothScrollTo($wrapper.offset().top);
          setTimeout(() => {
            snappedBanner = false;
          }, 1400);
        }
      }
    });

    /*const $hero = $(".hero-title");
    if ($hero.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !snappedHero) {
              snappedHero = true;
              smoothScrollTo(entry.target.offsetTop);
              setTimeout(() => {
                snappedHero = false;
              }, 1400);
            }
          });
        },
        { threshold: 0.6 }
      );
      observer.observe($hero[0]);
    } */
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
  const duration = options.duration ?? 4200;
  const easing   = options.easing   ?? 'cubic-bezier(0.22, 1, 0.36, 1)';
  const rocket   = document.querySelector('.rocket-fly');
  const banner   = document.querySelector('.donut-banner');
  const donut    = document.querySelector('.donut-BG'); // donut center reference

  if (!rocket || !banner || !donut) {
    console.warn('[rocket] missing elements', { rocket, banner, donut });
    return;
  }

  const bannerRect = banner.getBoundingClientRect();
  const donutRect  = donut.getBoundingClientRect();

  // Convert donut center to banner coords
  const donutCX = (donutRect.left - bannerRect.left) + donutRect.width  / 2;
  const donutCY = (donutRect.top  - bannerRect.top)  + donutRect.height / 2;

  // Rocket size (px). offsetWidth resolves vw just fine.
  const rW = rocket.offsetWidth || 200;
  const rH = rocket.offsetHeight || (rW * 0.5);

  // Start / mid / end key points in banner coords
  const start = {
    x: -0.12 * bannerRect.width  - rW/2,
    y:  1.06 * bannerRect.height + rH/2
  };
  const mid = {
    x: donutCX - rW/2,
    y: donutCY - rH/2
  };
  const end = {
    x:  1.08 * bannerRect.width  + rW/2,
    y: -0.30 * bannerRect.height - rH/2
  };

  // Normalize base position so translate() is absolute
  rocket.style.left = '0px';
  rocket.style.top  = '0px';
  rocket.style.opacity = '1';
  rocket.style.zIndex  = '3'; // between donut-back(2) and donut-front(4)

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const _duration = prefersReduced ? Math.min(1200, duration) : duration;

  try { rocket.getAnimations().forEach(a => a.cancel()); } catch(e) {}

  try {
    const anim = rocket.animate([
      { transform: `translate(${start.x}px, ${start.y}px) rotate(-18deg)`, opacity: 0 },
      { offset: 0.48, transform: `translate(${mid.x}px, ${mid.y}px) rotate(0deg)`,   opacity: 1 },
      { transform: `translate(${end.x}px,   ${end.y}px)   rotate(22deg)`,  opacity: 0 }
    ], {
      duration: _duration,
      easing,
      fill: 'forwards'
    });
    return anim;
  } catch (e) {
    console.error('[rocket] animation failed', e);
  }
}

// Expose for manual triggering (console or other handlers)
window.flyRocketResponsive = flyRocketResponsive;

// Trigger on CLICK of the donut hover zone (or the banner as fallback)
document.addEventListener('DOMContentLoaded', () => {
  const zone = document.querySelector('.donut-hover-zone') || document.querySelector('.donut-banner');
  if (!zone) return;

  // Avoid overlapping launches
  let busy = false;

  function fire() {
    if (busy) return;
    busy = true;
    const anim = flyRocketResponsive();
    // When animation ends, release the lock
    if (anim && anim.finished) {
      anim.finished.finally(() => { busy = false; });
    } else {
      setTimeout(() => { busy = false; }, 4500);
    }
  }

  // Click triggers
  zone.addEventListener('click', fire);

  // Keyboard accessibility (if the zone is focusable in your markup)
  zone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); }
  });
});
