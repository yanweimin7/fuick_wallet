/**
 * 注入到 dApp 页面的 Solana provider 脚本。
 * 同时挂载两种形态，最大化 dApp 兼容性：
 *  1) window.solana —— 兼容 Phantom / 旧版 @solana/wallet-adapter 的直接检测
 *  2) Wallet Standard —— 通过 wallet-standard:register-wallet 事件注册，
 *     让 Jupiter / Magic Eden 等现代 dApp 自动发现钱包
 *
 * 脚本在 document start 执行，把 connect / signMessage / signTransaction /
 * sendTransaction 转成 window.fuickBridge.postMessage(...) 发往宿主（fuickjs），
 * 宿主处理完后通过 window.__fuickResolve(id, ok, resultJson) 回调本脚本。
 *
 * 注意：脚本会被 minify 并作为字符串注入，避免依赖任何外部变量。
 */
export const SOLANA_INJECT_SCRIPT = `(function(){
  if (window.solana && window.solana.isFuick) return;
  var HANDLER = 'fuickBridge';
  var pending = (window.__fuickPending = window.__fuickPending || {});
  var counter = 0;
  var listeners = {};
  var _publicKey = null;
  var _connected = false;

  var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  function bs58Decode(str){
    if (typeof str !== 'string' || !str.length) return null;
    var bytes = [0];
    for (var i = 0; i < str.length; i++) {
      var value = BASE58.indexOf(str[i]);
      if (value < 0) return null;
      for (var j = 0; j < bytes.length; j++) {
        value += bytes[j] * 58;
        bytes[j] = value & 0xff;
        value >>= 8;
      }
      while (value > 0) { bytes.push(value & 0xff); value >>= 8; }
    }
    for (var k = 0; k < str.length && str[k] === '1'; k++) bytes.push(0);
    bytes.reverse();
    return bytes;
  }
  function bs58ToBytes(str){
    var arr = bs58Decode(str);
    if (!arr) return new Uint8Array(0);
    return Uint8Array.from(arr);
  }
  function b64ToBytes(b64){
    var bin = typeof atob === 'function' ? atob(b64) : '';
    var len = bin.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
  function bytesToB64(bytes){
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return typeof btoa === 'function' ? btoa(bin) : '';
  }
  function toB64(input){
    if (typeof input === 'string') return input;
    if (input instanceof Uint8Array) return bytesToB64(input);
    if (Array.isArray(input)) return bytesToB64(new Uint8Array(input));
    return input;
  }

  function post(method, params, origin){
    counter += 1;
    var id = 'sol_' + counter.toString(16);
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

  function emit(event, data){
    (listeners[event] || []).forEach(function(cb){ try { cb(data); } catch (e) {} });
    // Wallet Standard 的 standard:events 监听器监听 'change' 事件；
    // 任何账户变化都要同步通知，否则适配器拿不到最新 publicKey。
    if (event === 'connect' || event === 'disconnect' || event === 'accountChanged') {
      (listeners['change'] || []).forEach(function(cb){ try { cb({ accounts: currentAccounts() }); } catch (e) {} });
    }
  }

  // addr 可以是 base58 地址字符串，或 { address, publicKey }（publicKey 为 base64 字节）
  function makePublicKey(addr){
    if (!addr) return null;
    var address, b64;
    if (typeof addr === 'object') {
      address = addr.address || addr.publicKey || '';
      b64 = addr.publicKey;
    } else {
      address = addr;
      b64 = null;
    }
    var bytes = (function(){
      if (b64 && typeof b64 === 'string') {
        try { return b64ToBytes(b64); } catch (e) { return new Uint8Array(0); }
      }
      // 仅拿到地址字符串（如 setAccounts 传入的纯地址）时，用 base58 解码出公钥字节，
      // 否则公钥长度为 0，适配器 new PublicKey([]) 会抛错并立即断开连接。
      if (address && typeof address === 'string') {
        try { return bs58ToBytes(address); } catch (e) { return new Uint8Array(0); }
      }
      return new Uint8Array(0);
    })();
    return {
      toBase58: function(){ return address; },
      toBytes: function(){ return bytes; },
      toBuffer: function(){ return bytes; },
      equals: function(o){ return o && o.toBase58 && o.toBase58() === address; },
      toString: function(){ return address; }
    };
  }

  function currentAccounts(){
    if (!_publicKey) return [];
    return [{
      address: _publicKey.toBase58(),
      publicKey: _publicKey.toBytes(),
      chains: ['solana:mainnet', 'solana:testnet', 'solana:devnet'],
      features: ['solana:signMessage', 'solana:signTransaction', 'solana:signAndSendTransaction']
    }];
  }

  var provider = {
    isFuick: true,
    isPhantom: true,
    _events: listeners,
    get publicKey(){ return _publicKey; },
    get isConnected(){ return _connected; },
    connect: function(){
      return post('solana_connect', [], location.origin).then(function(res){
        _publicKey = makePublicKey(res);
        _connected = true;
        emit('connect', { publicKey: _publicKey });
        return { publicKey: _publicKey, accounts: currentAccounts() };
      });
    },
    disconnect: function(){
      return post('solana_disconnect', [], location.origin).then(function(){
        _publicKey = null;
        _connected = false;
        emit('disconnect', null);
        return null;
      });
    },
    signMessage: function(message){
      var b64 = toB64(message);
      return post('solana_signMessage', [b64], location.origin).then(function(res){
        var sig = b64ToBytes(res.signature);
        return { signature: sig, publicKey: _publicKey };
      });
    },
    signTransaction: function(tx){
      var b64 = toB64(typeof tx.serialize === 'function' ? tx.serialize() : tx);
      return post('solana_signTransaction', [b64], location.origin).then(function(signedB64){
        var bytes = b64ToBytes(signedB64);
        return {
          serialize: function(){ return bytes; },
          serializeMessage: function(){ return bytes; },
          _fuickSigned: signedB64,
          signatures: []
        };
      });
    },
    signAllTransactions: function(txs){
      var arr = Array.isArray(txs) ? txs : [txs];
      return Promise.all(arr.map(function(tx){ return provider.signTransaction(tx); }));
    },
    sendTransaction: function(tx){
      var b64 = toB64(typeof tx.serialize === 'function' ? tx.serialize() : tx);
      return post('solana_sendTransaction', [b64], location.origin);
    },
    request: function(args){
      if (!args || !args.method) return Promise.reject(new Error('Invalid request'));
      return post('solana_request', [args], location.origin);
    },
    on: function(event, cb){ (listeners[event] = listeners[event] || []).push(cb); },
    removeListener: function(event, cb){
      if (!listeners[event]) return;
      listeners[event] = listeners[event].filter(function(c){ return c !== cb; });
    },
    setChainId: function(chainId){ _connected = _connected; emit('chainChanged', chainId); },
    setAccounts: function(accounts){
      if (accounts && accounts.length) { _publicKey = makePublicKey(accounts[0]); _connected = true; }
      else { _publicKey = null; _connected = false; }
      emit('accountChanged', _publicKey);
    },
  };

  // 安装 provider 到全局；若被 dApp 自己的脚本覆盖，后续轮询会重新装回
  function install(){
    try {
      if (!(window.solana && window.solana.isFuick)) window.solana = provider;
      if (!window.phantom) window.phantom = {};
      window.phantom.solana = provider;
      window.phantom.isPhantom = true;
      window.phantom.isFuick = true;
    } catch (e) {}
  }

  install();

  // --------- Wallet Standard 注册 ---------
  function buildApi(){
    return {
      name: 'Fuick Wallet',
      icon: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2732%27 height=%2732%27%3E%3Crect width=%2732%27 height=%2732%27 rx=%278%27 fill=%27%237c5cff%27/%3E%3C/svg%3E',
      version: '1.0.0',
      chains: ['solana:mainnet', 'solana:testnet', 'solana:devnet'],
      // 必须是「实时」getter：适配器直接读取 wallet.accounts[0] 来取首个账户，
      // 若在这里一次性快照（buildApi 时 _publicKey 尚为 null），accounts 永远为
      // []，适配器连接时会因取不到账户抛出 WalletAccountError 而表现为「连接后断开」。
      get accounts() { return currentAccounts(); },
      features: {
        // 基础标准特性（@solana/wallet-adapter 的 isWalletAdapterCompatibleStandardWallet
        // 硬性要求 standard:connect + standard:events，否则钱包会被静默丢弃）
        'standard:connect': {
          version: '1.0.0',
          connect: function(){
            return provider.connect().then(function(){ return { accounts: currentAccounts() }; });
          }
        },
        'standard:disconnect': {
          version: '1.0.0',
          disconnect: function(){ return provider.disconnect(); }
        },
        'standard:events': {
          version: '1.0.0',
          on: function(event, listener){
            var key = event || 'change';
            var cb = function(change){ try { listener(change); } catch (e) {} };
            (listeners[key] = listeners[key] || []).push(cb);
            return function(){ listeners[key] = (listeners[key] || []).filter(function(c){ return c !== cb; }); };
          }
        },
        'solana:connect': {
          connect: function(){
            return provider.connect().then(function(r){ return { publicKey: r.publicKey, accounts: currentAccounts() }; });
          }
        },
        'solana:disconnect': {
          disconnect: function(){ return provider.disconnect(); }
        },
        'solana:signMessage': {
          signMessage: function(message){
            return provider.signMessage(message).then(function(r){
              return { signature: r.signature, signedMessage: message, publicKey: r.publicKey };
            });
          }
        },
        'solana:signTransaction': {
          supportedTransactionVersions: ['legacy'],
          signTransaction: function(tx){
            return provider.signTransaction(tx).then(function(wrapper){
              return { signedTransaction: wrapper.serialize() };
            });
          }
        },
        'solana:signAndSendTransaction': {
          supportedTransactionVersions: ['legacy'],
          signAndSendTransaction: function(tx){
            return provider.sendTransaction(tx).then(function(signature){
              return { signature: signature };
            });
          }
        }
      }
    };
  }

  // Wallet Standard 注册契约（双向兼容，确保无论钱包 / dApp 谁先加载都能被发现）：
  //  - dApp 监听 wallet-standard:register-wallet，收到后调用 event.detail(appRegister) 完成注册
  //  - 钱包（我们）派发 register-wallet，detail 为 (appRegister)=>appRegister(api)
  //  - 同时监听 app-ready 与 register-wallet：若 dApp 主动派发（detail 为其 register），
  //    我们直接调用 register(api)
  //  - 旧契约 navigator.wallets 数组：push 我们的 announce 回调
  function registerWalletStandard(api){
    if (typeof window === 'undefined') return;
    // 一旦被 dApp 成功注册，立即停止重复派发，否则每次 register-wallet 都会让
    // dApp 重建适配器实例，导致已建立的连接瞬间被重置（表现为「连接后马上断开」）。
    var announced = false;
    // 接收 dApp 的 register 函数（可能是函数本身，或 { register }）
    function acceptRegister(arg){
      var register = (arg && arg.register) ? arg.register : arg;
      if (typeof register === 'function') {
        try { register(api); announced = true; } catch (e) {}
      }
    }
    // 钱包主动注册：detail 为「接收 app register 并注册自己」的回调
    function announce(appRegister){ acceptRegister(appRegister); }

    function dispatch(){
      if (announced) return;
      try { window.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', { detail: announce })); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('wallet-standard:app-ready', { detail: announce })); } catch (e) {}
    }

    try {
      window.addEventListener('wallet-standard:register-wallet', function(e){ acceptRegister(e.detail); });
    } catch (e) {}
    try {
      window.addEventListener('wallet-standard:app-ready', function(e){ acceptRegister(e.detail); });
    } catch (e) {}

    try {
      if (window.navigator) {
        if (!Array.isArray(window.navigator.wallets)) { try { window.navigator.wallets = []; } catch (e) {} }
        if (Array.isArray(window.navigator.wallets)) {
          var has = false;
          for (var i = 0; i < window.navigator.wallets.length; i++) {
            if (window.navigator.wallets[i] === announce) { has = true; break; }
          }
          if (!has) window.navigator.wallets.push(announce);
        }
      }
    } catch (e) {}

    dispatch();
    if (window.addEventListener) {
      window.addEventListener('DOMContentLoaded', dispatch, false);
      window.addEventListener('load', dispatch, false);
      setTimeout(dispatch, 0);
      setTimeout(dispatch, 800);
    }

    // 关键容错：Android 上 AT_DOCUMENT_START 可能晚于 dApp 自身的检测脚本，
    // 导致 dApp 的 register-wallet 监听器在我们首次派发后才注册而错过。
    // 因此做有限次重派 + 持续重装 provider；但一旦被 dApp 注册成功（announced），
    // 必须立即停止注册事件派发，避免适配器被反复重建。
    var retries = 0;
    var timer = setInterval(function(){
      install();
      if (announced) { try { clearInterval(timer); } catch (e) {} return; }
      dispatch();
      retries++;
      if (retries >= 30) { try { clearInterval(timer); } catch (e) {} }
    }, 500);
  }

  registerWalletStandard(buildApi());

  try {
    console.log('[FuickSolana] injected solana=' + (!!window.solana) +
      ' phantom=' + (!!(window.phantom && window.phantom.solana)) +
      ' wallets=' + (window.navigator && window.navigator.wallets ? window.navigator.wallets.length : -1));
  } catch (e) {}
})();`
