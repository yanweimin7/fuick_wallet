/**
 * 纯 JS 的 base64 编解码，用于宿主（QuickJS）环境，
 * 不依赖浏览器的 atob/btoa（宿主运行时未必提供）。
 */

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function base64Encode(bytes: Uint8Array): string {
  let out = "";
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < len ? bytes[i + 1] : 0;
    const b2 = i + 2 < len ? bytes[i + 2] : 0;
    const e0 = b0 >> 2;
    const e1 = ((b0 & 3) << 4) | (b1 >> 4);
    const e2 = ((b1 & 15) << 2) | (b2 >> 6);
    const e3 = b2 & 63;
    out += CHARS[e0] + CHARS[e1];
    out += i + 1 < len ? CHARS[e2] : "=";
    out += i + 2 < len ? CHARS[e3] : "=";
  }
  return out;
}

export function base64Decode(b64: string): Uint8Array {
  const clean = b64.replace(/[^A-Za-z0-9+/]/g, "");
  const len = clean.length;
  const bytesLen = Math.floor((len * 3) / 4);
  const bytes = new Uint8Array(bytesLen);
  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const c0 = CHARS.indexOf(clean[i]);
    const c1 = CHARS.indexOf(clean[i + 1]);
    const c2 = CHARS.indexOf(clean[i + 2]);
    const c3 = CHARS.indexOf(clean[i + 3]);
    const b0 = (c0 << 2) | (c1 >> 4);
    const b1 = ((c1 & 15) << 4) | (c2 >> 2);
    const b2 = ((c2 & 3) << 6) | c3;
    bytes[p++] = b0;
    if (c2 !== -1 && clean[i + 2] !== "=") bytes[p++] = b1;
    if (c3 !== -1 && clean[i + 3] !== "=") bytes[p++] = b2;
  }
  return bytes.subarray(0, p);
}
