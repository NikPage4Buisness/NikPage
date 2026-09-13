/* ============================================================
   NIKPAGE — ZGODA NA PLIKI COOKIE (Google Analytics)
   Statystyki wlaczaja sie dopiero po zgodzie. Wybor jest zapisany
   w localStorage ('nk-consent'). Zmiana w kazdej chwili: dowolny
   element z atrybutem data-cookie-settings otwiera okienko ponownie.
   ============================================================ */
(function(){
  'use strict';
  var GA_ID = 'G-S2J18H7SKJ';
  var KEY   = 'nk-consent';

  /* kolejka gtag istnieje zawsze — zdarzenia bez zgody nigdzie nie wychodza */
  window.dataLayer = window.dataLayer || [];
  if(typeof window.gtag !== 'function'){ window.gtag = function(){ window.dataLayer.push(arguments); }; }

  function read(){ try{ return window.localStorage.getItem(KEY); }catch(e){ return null; } }
  function save(v){ try{ window.localStorage.setItem(KEY, v); }catch(e){} }

  var gaLoaded = false, disabledByUs = false;
  function enableGA(){
    if(disabledByUs){ window['ga-disable-' + GA_ID] = false; disabledByUs = false; }
    if(gaLoaded) return;
    gaLoaded = true;
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {anonymize_ip: true});
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  function disableGA(){
    window['ga-disable-' + GA_ID] = true;
    disabledByUs = true;
    /* usun pliki cookie Google Analytics z tej domeny */
    var host = location.hostname, base = host.replace(/^www\./, '');
    document.cookie.split(';').forEach(function(c){
      var name = c.split('=')[0].trim();
      if(!/^_ga/.test(name)) return;
      ['', ';domain=' + host, ';domain=.' + base].forEach(function(d){
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' + d;
      });
    });
  }

  var STYLE =
    '.nk-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:480px;margin:0 auto;' +
      'padding:18px 20px 16px;border-radius:6px;background:rgba(20,16,14,.97);border:1px solid rgba(203,176,120,.28);' +
      'box-shadow:0 24px 60px -20px rgba(0,0,0,.9);color:#F4F0EA;text-align:left;' +
      "font-family:'Montserrat',-apple-system,BlinkMacSystemFont,sans-serif;font-weight:300;line-height:1.5;" +
      'opacity:0;transform:translateY(16px);transition:opacity .45s cubic-bezier(.22,1,.36,1),transform .45s cubic-bezier(.22,1,.36,1)}' +
    '.nk-consent.show{opacity:1;transform:none}' +
    '.nk-c-t{margin:0 0 8px;font-size:.62rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:#CBB078}' +
    '.nk-c-d{margin:0 0 14px;font-size:.82rem;line-height:1.55;color:#C8BFB0}' +
    '.nk-c-d a{color:#CBB078;text-decoration:underline;text-underline-offset:3px}' +
    '.nk-c-s{margin:-6px 0 12px;font-size:.72rem;color:#9E9088}' +
    '.nk-c-b{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px}' +
    '.nk-c-b button{min-height:44px;padding:11px 20px;border-radius:999px;cursor:pointer;font:inherit;font-size:.66rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase}' +
    '.nk-c-no{background:transparent;color:#F4F0EA;border:1px solid rgba(203,176,120,.45)}' +
    '.nk-c-yes{background:#B8944E;color:#0A0807;border:1px solid #B8944E}' +
    '.nk-c-b button:focus-visible,.nk-c-d a:focus-visible{outline:2px solid #E4CC96;outline-offset:3px}' +
    '@media(max-width:480px){.nk-c-b button{flex:1 1 0}}' +
    '@media(prefers-reduced-motion:reduce){.nk-consent{transition:none}}';

  var box = null;
  function injectStyle(){
    if(document.getElementById('nk-consent-style')) return;
    var st = document.createElement('style');
    st.id = 'nk-consent-style';
    st.textContent = STYLE;
    document.head.appendChild(st);
  }
  function hide(){
    if(!box) return;
    var b = box; box = null;
    b.classList.remove('show');
    setTimeout(function(){ if(b.parentNode) b.parentNode.removeChild(b); }, 450);
  }
  function choose(v){
    save(v);
    if(v === 'granted') enableGA(); else disableGA();
    hide();
  }
  function show(){
    if(box) return;
    injectStyle();
    var state = read();
    box = document.createElement('div');
    box.className = 'nk-consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.setAttribute('aria-label', 'Zgoda na pliki cookie');
    box.innerHTML =
      '<p class="nk-c-t">Pliki cookie</p>' +
      '<p class="nk-c-d">Za Twoją zgodą włączę Google Analytics, żeby widzieć, jak odwiedzający korzystają ze strony. ' +
      'Bez zgody wszystko działa tak samo. <a href="polityka-prywatnosci.html#cookies">Więcej informacji</a></p>' +
      (state ? '<p class="nk-c-s">Obecnie: ' + (state === 'granted' ? 'zgoda udzielona' : 'zgoda odrzucona') + '</p>' : '') +
      '<div class="nk-c-b"><button type="button" class="nk-c-no">Odrzuć</button><button type="button" class="nk-c-yes">Akceptuję</button></div>';
    box.querySelector('.nk-c-yes').addEventListener('click', function(){ choose('granted'); });
    box.querySelector('.nk-c-no').addEventListener('click', function(){ choose('denied'); });
    document.body.appendChild(box);
    setTimeout(function(){ if(box) box.classList.add('show'); }, 30);
  }

  function init(){
    var v = read();
    if(v === 'granted') enableGA();
    else if(v !== 'denied') setTimeout(show, 1200);
    document.addEventListener('click', function(e){
      var el = e.target && e.target.closest ? e.target.closest('[data-cookie-settings]') : null;
      if(!el) return;
      e.preventDefault();
      show();
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.NK_CONSENT = {open: show, state: read};
})();
