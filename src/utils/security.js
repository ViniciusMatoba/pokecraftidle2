/**
 * PokéCraft Idle 2 - Módulo de Segurança e Anti-Cheat
 * Implementações puras em JS para garantir compatibilidade total com
 * navegadores e ambientes de teste (Vitest, JSDOM, Node.js).
 */

const SECRET_SALT = 'pkcraft_integrity_salt_v2_2026';

/**
 * Função pura SHA-256 (estática, sem efeitos de cache cruzado)
 */
export function sha256(str) {
  const utf8 = unescape(encodeURIComponent(str));
  const words = [];
  const len = utf8.length;
  for (let i = 0; i < len; i++) {
    words[i >> 2] |= utf8.charCodeAt(i) << ((3 - (i % 4)) * 8);
  }
  
  const bitLen = len * 8;
  words[len >> 2] |= 0x80 << ((3 - (len % 4)) * 8);
  
  while (((words.length * 4) % 64) !== 56) {
    words.push(0);
  }
  words.push(0);
  words.push(bitLen);

  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let H0 = 0x6a09e667, H1 = 0xbb67ae85, H2 = 0x3c6ef372, H3 = 0xa54ff53a,
      H4 = 0x510e527f, H5 = 0x9b05688c, H6 = 0x1f83d9ab, H7 = 0x5be0cd19;

  function rrot(x, n) {
    return (x >>> n) | (x << (32 - n));
  }

  for (let chunkIdx = 0; chunkIdx < words.length; chunkIdx += 16) {
    const w = new Array(64);
    for (let i = 0; i < 16; i++) {
      w[i] = words[chunkIdx + i] || 0;
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rrot(w[i - 15], 7) ^ rrot(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rrot(w[i - 2], 17) ^ rrot(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }

    let a = H0, b = H1, c = H2, d = H3, e = H4, f = H5, g = H6, h = H7;

    for (let i = 0; i < 64; i++) {
      const S1 = rrot(e, 6) ^ rrot(e, 11) ^ rrot(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + w[i]) | 0;
      const S0 = rrot(a, 2) ^ rrot(a, 13) ^ rrot(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    H0 = (H0 + a) | 0;
    H1 = (H1 + b) | 0;
    H2 = (H2 + c) | 0;
    H3 = (H3 + d) | 0;
    H4 = (H4 + e) | 0;
    H5 = (H5 + f) | 0;
    H6 = (H6 + g) | 0;
    H7 = (H7 + h) | 0;
  }

  function hex(num) {
    let s = "";
    for (let i = 24; i >= 0; i -= 8) {
      const byte = (num >>> i) & 0xff;
      s += (byte < 16 ? "0" : "") + byte.toString(16);
    }
    return s;
  }

  return hex(H0) + hex(H1) + hex(H2) + hex(H3) + hex(H4) + hex(H5) + hex(H6) + hex(H7);
}

/**
 * Função pura HMAC-SHA256
 */
export function hmacSha256(message, key) {
  let hashedKey = key;
  if (key.length > 64) {
    hashedKey = sha256(key);
  }

  const keyBuffer = [];
  for (let i = 0; i < 64; i++) {
    keyBuffer.push(i < hashedKey.length ? hashedKey.charCodeAt(i) : 0);
  }

  const oPad = [];
  const iPad = [];
  for (let i = 0; i < 64; i++) {
    oPad.push(keyBuffer[i] ^ 0x5c);
    iPad.push(keyBuffer[i] ^ 0x36);
  }

  const innerMsg = String.fromCharCode(...iPad) + message;
  const innerHash = sha256(innerMsg);

  let innerHashBin = '';
  for (let i = 0; i < innerHash.length; i += 2) {
    innerHashBin += String.fromCharCode(parseInt(innerHash.substring(i, i + 2), 16));
  }

  const outerMsg = String.fromCharCode(...oPad) + innerHashBin;
  return sha256(outerMsg);
}

/**
 * Cifra XOR Rotativa (Ofuscação)
 */
export function obfuscate(text) {
  let result = '';
  const saltLen = SECRET_SALT.length;
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const saltChar = SECRET_SALT.charCodeAt(i % saltLen);
    const obfuscated = charCode ^ saltChar ^ (i % 256);
    result += String.fromCharCode(obfuscated);
  }
  // Suporte universal a Unicode em ambientes de navegador e Node
  return btoa(unescape(encodeURIComponent(result)));
}

/**
 * Decifra XOR Rotativa (Desofuscação)
 */
export function deobfuscate(base64Text) {
  const decoded = decodeURIComponent(escape(atob(base64Text)));
  let result = '';
  const saltLen = SECRET_SALT.length;
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i);
    const saltChar = SECRET_SALT.charCodeAt(i % saltLen);
    const deobfuscated = charCode ^ saltChar ^ (i % 256);
    result += String.fromCharCode(deobfuscated);
  }
  return result;
}

/**
 * Assina e ofusca o envelope do save
 * Retorna no formato seguro: 'pksv1:<obfuscated_string>'
 */
export function secureSave(envelope) {
  const payloadStr = JSON.stringify(envelope);
  const signature = hmacSha256(payloadStr, SECRET_SALT);
  
  const signedEnvelope = {
    payload: payloadStr,
    signature: signature
  };
  
  const secureStr = JSON.stringify(signedEnvelope);
  return 'pksv1:' + obfuscate(secureStr);
}

/**
 * Desofusca e valida o save assinado.
 * Retorna o envelope caso válido, ou lança erro/retorna tampered flag se adulterado.
 */
export function readSecureSave(rawSecureStr) {
  if (!rawSecureStr.startsWith('pksv1:')) {
    throw new Error('Formato de save inseguro ou desconhecido');
  }
  
  const obfuscatedPart = rawSecureStr.substring(6);
  const secureStr = deobfuscate(obfuscatedPart);
  const signedEnvelope = JSON.parse(secureStr);
  
  if (!signedEnvelope || !signedEnvelope.payload || !signedEnvelope.signature) {
    throw new Error('Estrutura de save adulterada ou inválida');
  }
  
  const computedSignature = hmacSha256(signedEnvelope.payload, SECRET_SALT);
  const isValid = computedSignature === signedEnvelope.signature;
  
  const envelope = JSON.parse(signedEnvelope.payload);
  
  return {
    envelope,
    isValid
  };
}
