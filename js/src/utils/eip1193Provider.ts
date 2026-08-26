/**
 * 注入到 dApp 页面的 EIP-1193 provider 脚本。
 * 在 document start 执行，定义 window.ethereum 及 window.web3，
 * 把 request() 转成 window.fuickBridge.postMessage(...) 发往宿主（fuickjs），
 * 宿主处理完后通过 window.__fuickResolve(id, ok, resultJson) 回调本脚本。
 *
 * 注意：脚本会被 minify 并作为字符串注入，避免依赖任何外部变量。
 */
export const EIP1193_INJECT_SCRIPT = `(function(){
  if (window.ethereum) return;
  var HANDLER = 'fuickBridge';
  var pending = (window.__fuickPending = window.__fuickPending || {});
  var counter = 0;
  var listeners = {};

  function post(method, params, origin){
    counter += 1;
    var id = '0x' + counter.toString(16);
    return new Promise(function(resolve, reject){
      pending[id] = { resolve: resolve, reject: reject };
      try {
        if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
          window.flutter_inappwebview.callHandler(HANDLER, JSON.stringify({ id: id, method: method, params: params || [], origin: origin || location.origin }));
        } else {
          throw new Error('bridge not ready');
        }
      } catch (e) {
        delete pending[id];
        reject(e);
      }
    });
  }

  if (!window.__fuickResolve) {
    window.__fuickResolve = function(id, ok, dataJson){
      var p = pending[id];
      if (!p) return;
      delete pending[id];
      var data;
      try { data = (typeof dataJson === 'string') ? JSON.parse(dataJson) : dataJson; } catch (e) { data = null; }
      if (ok) p.resolve(data); else p.reject(new Error(data || 'rejected'));
    };
  }

  window.__fuickEmit = function(event, data){
    (listeners[event] || []).forEach(function(cb){ try { cb(data); } catch (e) {} });
  };

  function hexChain(chainId){ return '0x' + Number(chainId).toString(16); }

  var provider = {
    isFuick: true,
    isMetaMask: true,
    _chainId: null,
    _accounts: [],
    request: function(args){
      if (!args || !args.method) return Promise.reject(new Error('Invalid request'));
      return post(args.method, args.params || [], location.origin);
    },
    sendAsync: function(payload, cb){
      post(payload.method, payload.params || []).then(function(res){
        cb(null, { jsonrpc: '2.0', id: payload.id, result: res });
      }, function(err){
        cb(err, null);
      });
    },
    send: function(payload, cb){
      if (cb) { return this.sendAsync(payload, cb); }
      return this.request(payload);
    },
    on: function(event, cb){ (listeners[event] = listeners[event] || []).push(cb); },
    removeListener: function(event, cb){
      if (!listeners[event]) return;
      listeners[event] = listeners[event].filter(function(c){ return c !== cb; });
    },
    setChainId: function(chainId){ provider._chainId = hexChain(chainId); window.__fuickEmit('chainChanged', provider._chainId); },
    setAccounts: function(accounts){ provider._accounts = accounts || []; window.__fuickEmit('accountsChanged', provider._accounts); }
  };

  window.ethereum = provider;
  window.web3 = { currentProvider: provider, ethereum: provider };

  // EIP-6963: 让 RainbowKit / wagmi 等现代 dApp 自动发现钱包
  var eip6963Info = { uuid: 'f4a1c0de-0000-4000-8000-000000000001', name: 'Fuick Wallet', icon: 'data:image/svg+xml,', rdns: 'com.fuick.wallet' };
  function eip6963Announce(){
    try {
      window.dispatchEvent(new CustomEvent('eip6963:announceProvider', { detail: { info: eip6963Info, provider: provider } }));
    } catch (e) {}
  }
  window.addEventListener('eip6963:requestProvider', function(){ eip6963Announce(); });
  eip6963Announce();
})();`;
