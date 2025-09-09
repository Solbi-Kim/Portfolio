/* scroll-ease.standalone.js — window-level smooth wheel (no jQuery)
   - Drop-in for sub pages when inline scripts are blocked or racing
   - Captures wheel at capture phase to avoid other handlers eating it
*/
(function(){
  if (window.__ScrollEaseLoaded) return;
  window.__ScrollEaseLoaded = true;

  function initInertiaScroll(opts = {}){
    try { document.documentElement.style.scrollBehavior = 'auto'; } catch(_){}

    // Respect reduced motion
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch && !opts.force) return;

    const docEl = document.scrollingElement || document.documentElement;
    const {
      friction = 0.88,    // lower -> quicker stop (0.86~0.92)
      wheelBoost = 0.22,  // lower -> shorter per notch (0.18~0.30)
      maxSpeed = 14,      // px per frame cap
      keyStep = 56,
      pageStepRatio = 0.9,
      wheelCap = 110,
      allowNativeInside = '[data-native-scroll], .scroll-native',
      force = false
    } = opts;

    let vy = 0, rafId = null;

    const clamp = (v,a,b)=>Math.min(b, Math.max(a,v));
    const maxScroll = ()=>Math.max(0, docEl.scrollHeight - innerHeight);

    function canScroll(el, delta){
      // skip inside explicitly native regions
      if (allowNativeInside && el && el.closest && el.closest(allowNativeInside)) return true;
      // skip when an ancestor is actually scrollable
      for (let n = el; n && n !== document.documentElement; n = n.parentElement){
        const cs = getComputedStyle(n);
        if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && n.scrollHeight > n.clientHeight){
          if (delta > 0 && n.scrollTop + n.clientHeight < n.scrollHeight) return true;
          if (delta < 0 && n.scrollTop > 0) return true;
        }
      }
      return false;
    }

    function tick(){
      if (Math.abs(vy) > 0.12){         // higher threshold -> earlier stop
        vy *= friction;
        const step = clamp(vy, -maxSpeed, maxSpeed);
        const next = clamp(Math.round(docEl.scrollTop + step), 0, maxScroll());
        if (next !== docEl.scrollTop) docEl.scrollTop = next;
        rafId = requestAnimationFrame(tick);
      } else {
        vy = 0; rafId = null;
      }
    }

    // Capture wheel early; passive:false so we can preventDefault
    window.addEventListener('wheel', (e)=>{
      const raw = e.deltaY || 0;
      if (!raw) return;
      if (canScroll(e.target, raw)) return; // let native take over inside inner scrollers
      e.preventDefault();
      const d = clamp(raw, -wheelCap, wheelCap);
      vy += d * wheelBoost;
      if (!rafId) rafId = requestAnimationFrame(tick);
    }, { capture:true, passive:false });

    // Keyboard fallback
    window.addEventListener('keydown', (e)=>{
      const tag = document.activeElement && document.activeElement.tagName && document.activeElement.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.defaultPrevented) return;
      let add = 0, h = innerHeight;
      if (e.key === 'ArrowDown') add = +keyStep;
      else if (e.key === 'ArrowUp') add = -keyStep;
      else if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) add = h * pageStepRatio;
      else if (e.key === 'PageUp'   || (e.key === ' ' &&  e.shiftKey)) add = -h * pageStepRatio;
      else if (e.key === 'Home')    { docEl.scrollTop = 0; return; }
      else if (e.key === 'End')     { docEl.scrollTop = maxScroll(); return; }
      if (add !== 0){ e.preventDefault(); vy += add; if (!rafId) rafId = requestAnimationFrame(tick); }
    }, { passive:false });

    window.__InertiaScrollInit = true;
    console.info('[scroll-ease] booted', { friction, wheelBoost, maxSpeed });
  }

  // expose
  window.initInertiaScroll = initInertiaScroll;

  // Boot as early as DOM is ready (CSP-safe since external file)
  const boot = ()=>{ if (!window.__InertiaScrollInit) initInertiaScroll({ force:true }); };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once:true });
  } else {
    boot();
  }
  window.addEventListener('pageshow', boot, { once:true });
})();
