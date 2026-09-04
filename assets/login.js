(() => {
  'use strict';
  const button = document.getElementById('login');
  const status = document.getElementById('status');
  const endpoint = document.body.dataset.gasLoginUrl;
  let popup; let nonce; let requestId;
  const uuid = () => crypto.randomUUID();
  const show = text => { status.textContent = text || ''; };
  function openLogin() {
    if (!endpoint || !endpoint.startsWith('https://script.google.com/')) { show('尚未設定 GAS 登入網址。'); return; }
    nonce = uuid(); requestId = uuid();
    const target = new URL(endpoint);
    target.searchParams.set('mode', 'github-login'); target.searchParams.set('origin', location.origin);
    target.searchParams.set('nonce', nonce); target.searchParams.set('requestId', requestId);
    popup = window.open(target.toString(), 'githubLogin', 'popup,width=430,height=580');
    if (!popup) { sessionStorage.setItem('githubLoginNonce', nonce); location.assign(target.toString() + '&flow=mobile'); return; }
    show('請在登入視窗完成操作。');
  }
  window.addEventListener('message', event => {
    if (!endpoint || event.origin !== new URL(endpoint).origin || event.source !== popup) return;
    const data = event.data || {};
    if (data.version !== 'v1' || data.nonce !== nonce || data.requestId !== requestId) return;
    show(data.ok ? '登入完成。' : (data.message || '登入失敗。'));
  });
  button.addEventListener('click', openLogin);
})();
