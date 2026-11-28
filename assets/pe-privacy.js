/* PE Studio — website analytics consent (basic mode, opt-in). */
(function () {
  'use strict';
  const ID = 'G-X1LNTFZR2N', KEY = 'pe_web_privacy_v1', DAYS = 180, DAY = 86400000;
  const translations = {"en":["Privacy choices","With your permission, PE Studio uses Google Analytics cookies to measure visits and improve its games website. No advertising personalization through Analytics. You can reject or change your choice at any time.","Accept analytics","Reject analytics","Cookie settings","Website privacy & cookies","Load this YouTube video? Google/YouTube may receive your IP address and use cookies or similar technologies, including for advertising. This is separate from website analytics.","Stop external video","Play YouTube video","Back to PE Studio"],"es":["Preferencias de privacidad","Con tu permiso, PE Studio utiliza cookies de Google Analytics para medir las visitas y mejorar su web de videojuegos. Sin publicidad personalizada de Analytics. Puedes rechazar o cambiar tu elección en cualquier momento.","Aceptar analíticas","Rechazar analíticas","Configurar cookies","Privacidad y cookies de la web","¿Cargar este vídeo de YouTube? Google/YouTube puede recibir tu IP y utilizar cookies o tecnologías similares, incluso para publicidad. Es independiente de las estadísticas de la web.","Detener vídeo externo","Reproducir vídeo de YouTube","Volver a PE Studio"],"de":["Datenschutzeinstellungen","Mit Ihrer Einwilligung verwendet PE Studio Google-Analytics-Cookies, um Besuche zu messen und die Spielewebsite zu verbessern. Keine personalisierte Werbung durch Analytics. Sie können ablehnen oder Ihre Wahl jederzeit ändern.","Analyse akzeptieren","Analyse ablehnen","Cookie-Einstellungen","Datenschutz & Cookies der Website","YouTube-Video laden? Google/YouTube kann Ihre IP-Adresse erhalten und Cookies oder ähnliche Technologien verwenden, auch für Werbung. Dies ist unabhängig von der Website-Analyse.","Externes Video stoppen","YouTube-Video abspielen","Zurück zu PE Studio"],"fr":["Préférences de confidentialité","Avec votre accord, PE Studio utilise des cookies Google Analytics pour mesurer les visites et améliorer son site de jeux. Pas de publicité personnalisée via Analytics. Vous pouvez refuser ou modifier votre choix à tout moment.","Accepter les statistiques","Refuser les statistiques","Paramètres des cookies","Confidentialité et cookies du site","Charger cette vidéo YouTube ? Google/YouTube peut recevoir votre adresse IP et utiliser des cookies ou technologies similaires, y compris à des fins publicitaires. Ce choix est indépendant des statistiques du site.","Arrêter la vidéo externe","Lire la vidéo YouTube","Retour à PE Studio"],"pt-br":["Preferências de privacidade","Com sua permissão, a PE Studio usa cookies do Google Analytics para medir visitas e melhorar o site de jogos. Sem personalização de anúncios pelo Analytics. Você pode recusar ou alterar sua escolha a qualquer momento.","Aceitar estatísticas","Recusar estatísticas","Configurar cookies","Privacidade e cookies do site","Carregar este vídeo do YouTube? O Google/YouTube pode receber seu endereço IP e usar cookies ou tecnologias semelhantes, inclusive para publicidade. Isso é independente das estatísticas do site.","Parar vídeo externo","Reproduzir vídeo do YouTube","Voltar à PE Studio"],"ru":["Настройки конфиденциальности","С вашего согласия PE Studio использует файлы cookie Google Analytics для подсчёта посещений и улучшения сайта игр. Персонализация рекламы в Analytics отключена. Вы можете отказаться или изменить выбор в любое время.","Принять аналитику","Отклонить аналитику","Настройки cookie","Конфиденциальность и cookie сайта","Загрузить видео YouTube? Google/YouTube может получить ваш IP-адрес и использовать cookie или похожие технологии, в том числе для рекламы. Это не связано с аналитикой сайта.","Остановить внешнее видео","Воспроизвести видео YouTube","Вернуться в PE Studio"],"ja":["プライバシー設定","PE Studio は、同意を得た場合に限り Google Analytics の Cookie を使用し、訪問数の測定とゲームサイトの改善を行います。Analytics による広告のパーソナライズは行いません。いつでも拒否・変更できます。","分析を許可","分析を拒否","Cookie 設定","ウェブサイトのプライバシーと Cookie","YouTube 動画を読み込みますか？ Google/YouTube は IP アドレスを受け取り、広告などの目的で Cookie や類似技術を使用する場合があります。サイトのアクセス解析とは別の選択です。","外部動画を停止","YouTube 動画を再生","PE Studio に戻る"],"zh-cn":["隐私设置","经您同意，PE Studio 使用 Google Analytics Cookie 统计访问并改善游戏网站。Analytics 不用于个性化广告。您可以随时拒绝或更改选择。","接受分析 Cookie","拒绝分析 Cookie","Cookie 设置","网站隐私与 Cookie","是否加载 YouTube 视频？Google/YouTube 可能接收您的 IP 地址，并使用 Cookie 或类似技术（包括广告用途）。此选择独立于网站访问统计。","停止外部视频","播放 YouTube 视频","返回 PE Studio"]};
  const raw = document.documentElement.lang.toLowerCase();
  const lang = raw === 'zh-hans' || raw.startsWith('zh') ? 'zh-cn' : raw === 'pt-br' ? 'pt-br' : (translations[raw] ? raw : 'en');
  const t = translations[lang], policy = lang === 'en' ? '/privacy/' : '/privacy/' + lang + '/';
  const noAnalytics = document.currentScript.hasAttribute('data-no-analytics');
  let current = null, running = false, banner, priorFocus, expiryTimer, memoryChoice = null;
  const disable = 'ga-disable-' + ID;
  window[disable] = true;
  function read() {
    try {
      const x = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (x && ['granted','denied'].includes(x.choice) && Number.isFinite(x.at) && x.at <= Date.now() && Date.now() - x.at < DAYS * DAY) return x;
      if (x) localStorage.removeItem(KEY);
      return null;
    } catch (_) { return memoryChoice; }
  }
  function save(choice) {
    const x = {choice: choice, at: Date.now()};
    memoryChoice = x;
    try { localStorage.setItem(KEY, JSON.stringify(x)); } catch (_) {}
    return x;
  }
  function clearGA() {
    document.cookie.split(';').map(x => x.trim().split('=')[0]).filter(n => n === '_ga' || n.startsWith('_ga_')).forEach(n => {
      ['', '; domain=' + location.hostname, '; domain=.pestudio.eu'].forEach(domain => {
        document.cookie = n + '=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + domain + '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
      });
    });
  }
  function start() {
    if (running || noAnalytics) return;
    running = true; window[disable] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    const denied = {analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
    window.gtag('consent','default',denied);
    window.gtag('consent','update',Object.assign({},denied,{analytics_storage:'granted'}));
    window.gtag('set', {'allow_google_signals':false,'allow_ad_personalization_signals':false});
    window.gtag('js',new Date());
    window.gtag('config',ID,{cookie_expires:5184000,cookie_update:false,cookie_flags:'SameSite=Lax;Secure',allow_google_signals:false,allow_ad_personalization_signals:false});
    const s = document.createElement('script');
    s.async = true; s.id = 'pe-ga4'; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
  }
  function stop() {
    window[disable] = true;
    clearGA();
    // Reload to unload the running library without switching to cookieless pings.
    if (running) { location.reload(); return true; }
    return false;
  }
  function make(tag, text, cls) {
    const x = document.createElement(tag); if (text) x.textContent = text; if (cls) x.className = cls; return x;
  }
  function hide() {
    if (!banner) return;
    const focused = banner.contains(document.activeElement);
    banner.remove(); banner = null;
    if (focused && priorFocus && priorFocus.isConnected && priorFocus !== document.body) priorFocus.focus();
  }
  function scheduleExpiry() {
    clearTimeout(expiryTimer);
    if (!current) return;
    expiryTimer = setTimeout(sync, Math.min(2147483647, Math.max(100, current.at + DAYS*DAY - Date.now())));
  }
  function choose(choice) {
    current = save(choice); hide(); scheduleExpiry();
    if (choice === 'granted') start(); else stop();
  }
  function show(focus) {
    if (banner) { if (focus) banner.querySelector('button').focus(); return; }
    priorFocus = document.activeElement;
    banner = make('aside',null,'pe-cookie-banner'); banner.id = 'pe-cookie-banner';
    banner.setAttribute('role','region'); banner.setAttribute('aria-labelledby','pe-cookie-title');
    const h = make('h2',t[0]); h.id='pe-cookie-title'; banner.append(h,make('p',t[1]));
    const link=make('a',t[5]); link.href=policy; banner.append(link);
    const actions=make('div',null,'pe-cookie-actions');
    [['granted',t[2]],['denied',t[3]]].forEach(([choice,label])=>{
      const b=make('button',label); b.type='button'; b.dataset.peChoice=choice; b.addEventListener('click',()=>choose(choice)); actions.append(b);
    });
    banner.append(actions); document.body.append(banner);
    if (focus) actions.querySelector('button').focus();
  }
  function sync() {
    const next=read(); current=next;
    if (next && next.choice==='granted') { hide(); start(); }
    else { if (stop()) return; if (next) hide(); else if (!noAnalytics) show(false); }
    scheduleExpiry();
  }
  const style=make('style'); style.textContent=" .pe-cookie-banner{position:fixed;z-index:2147483000;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));width:min(420px,calc(100% - 24px));max-height:calc(100dvh - 24px);overflow:auto;box-sizing:border-box;padding:18px;background:#0d1421;color:#eef6fa;border:1px solid #50717c;border-radius:12px;box-shadow:0 6px 24px #0009;font:15px/1.5 system-ui,sans-serif;text-align:left;letter-spacing:normal;text-transform:none}.pe-cookie-banner h2{margin:0 0 7px!important;font:600 17px/1.35 system-ui,sans-serif!important;color:#fff!important;letter-spacing:normal!important;text-transform:none!important}.pe-cookie-banner p{margin:0 0 8px!important;color:#e3edf4!important;font:inherit!important}.pe-cookie-banner a{color:#8be9ef!important;text-decoration:underline!important;font:inherit!important}.pe-cookie-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.pe-cookie-actions button{background:#1b3444;color:#fff;border:1px solid #89c4d2;border-radius:7px;padding:10px 6px;min-height:44px;font:600 14px/1.3 system-ui,sans-serif;cursor:pointer;white-space:normal;overflow-wrap:anywhere;letter-spacing:normal;text-transform:none}.pe-cookie-actions button:hover,.pe-cookie-actions button:focus-visible{background:#25475b}.pe-cookie-banner :focus-visible,.pe-cookie-settings:focus-visible,.pe-video-stop:focus-visible,.pe-video-link:focus-visible{outline:2px solid #8be9ef;outline-offset:3px}.pe-privacy-links{margin:.65rem auto 0;font:inherit;text-align:center}.pe-privacy-links a,.pe-cookie-settings{color:inherit;text-decoration:underline;text-underline-offset:2px}.pe-cookie-settings,.pe-video-stop{font:inherit;letter-spacing:normal;text-transform:none;cursor:pointer}.pe-cookie-settings{padding:4px 3px;border:0;background:transparent}.pe-cookie-settings[hidden]{display:none!important}.pe-video-stop{display:block;margin:.7rem auto;padding:8px 12px;color:#eef6fa;background:#172b3b;border:1px solid #779ba9;border-radius:5px}.pe-video-link{display:block;position:absolute;inset:0;color:white;background:#000}.pe-video-link img{width:100%;height:100%;object-fit:cover}.pe-video-link span{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:10px 15px;border:1px solid #94d9e7;border-radius:6px;color:white;background:#0d1421dd;text-align:center;font:600 15px/1.4 system-ui,sans-serif}"; document.head.append(style);
  document.querySelectorAll('[data-pe-cookie-settings]').forEach(b=>{
    b.hidden=false; b.addEventListener('click',()=>show(true));
  });
  window.addEventListener('storage',e=>{ if (e.key===KEY || e.key===null) { memoryChoice=null; sync(); } });
  window.addEventListener('pageshow',e=>{if(e.persisted) sync();});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible' && current && Date.now()-current.at>=DAYS*DAY) sync();});
  // Video consent is separate, per playback, and never enables website analytics.
  document.querySelectorAll('[data-pe-video]').forEach(a=>{
    const open=e=>{
      if (e.button!==0 && e.type==='click') return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if(!window.confirm(t[6])) return;
      const id=a.dataset.id;
      if(!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
      const f=make('iframe'); f.title=a.dataset.peVideoTitle || t[8];
      f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen=true; f.referrerPolicy='strict-origin-when-cross-origin';
      f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1&enablejsapi=1&origin='+encodeURIComponent(location.origin);
      const press=a.classList.contains('pe-video-link');
      let holder;
      if(press){holder=a.parentElement; a.replaceWith(f);}
      else {holder=make('div',null,a.className); a.replaceWith(holder); holder.append(f);}
      const close=make('button',t[7],'pe-video-stop');close.type='button';holder.after(close);
      close.addEventListener('click',()=>{if(press) f.replaceWith(a); else holder.replaceWith(a); close.remove(); a.focus();});
      close.focus();
      const hv=document.getElementById('heroVideo');if(hv)try{hv.pause();}catch(_){}
    };
    a.addEventListener('click',open);
  });
  sync();
})();
