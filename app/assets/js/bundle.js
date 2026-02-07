var process=process||{env:{NODE_ENV:"production"}};if(typeof console==="undefined"){globalThis.console={log:function(){if(typeof print==='function')print([].slice.call(arguments).join(' '));},error:function(){if(typeof print==='function')print('[ERROR] '+[].slice.call(arguments).join(' '));},warn:function(){if(typeof print==='function')print('[WARN] '+[].slice.call(arguments).join(' '));},debug:function(){if(typeof print==='function')print('[DEBUG] '+[].slice.call(arguments).join(' '));}};}
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// globals:react
var require_react = __commonJS({
  "globals:react"(exports, module) {
    module.exports = globalThis.React;
  }
});

// globals:fuickjs
var require_fuickjs = __commonJS({
  "globals:fuickjs"(exports, module) {
    module.exports = globalThis.FuickFramework;
  }
});

// node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "node_modules/qrcode/lib/core/utils.js"(exports) {
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version) {
      if (!version) throw new Error('"version" cannot be null or undefined');
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
      return version * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
      return CODEWORDS_COUNT[version];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module.exports = BitBuffer;
  }
});

// node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version) {
      if (version === 1) return [];
      const posCount = Math.floor(version / 7) + 2;
      const size = getSymbolSize(version);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version) {
      const coords = [];
      const pos = exports.getRowColCoords(version);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version) {
      const size = getSymbolSize(version);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "node_modules/qrcode/lib/core/galois-field.js"(exports) {
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "node_modules/qrcode/lib/core/polynomial.js"(exports) {
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    module.exports = ReedSolomonEncoder;
  }
});

// node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "node_modules/qrcode/lib/core/version-check.js"(exports) {
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };
  }
});

// node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "node_modules/qrcode/lib/core/regex.js"(exports) {
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "node_modules/qrcode/lib/core/mode.js"(exports) {
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid version: " + version);
      }
      if (version >= 1 && version < 10) return mode.ccBits[0];
      else if (version < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "node_modules/qrcode/lib/core/version.js"(exports) {
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version) {
      return Mode.getCharCountIndicator(mode, version) + 4;
    }
    function getTotalBitsFromDataArray(segments, version) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version) {
      if (!VersionCheck.isValid(version) || version < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version << 12 | d;
    };
  }
});

// node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "node_modules/qrcode/lib/core/format-info.js"(exports) {
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };
    module.exports = NumericData;
  }
});

// node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module.exports = AlphanumericData;
  }
});

// node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "node_modules/dijkstrajs/dijkstra.js"(exports, module) {
    "use strict";
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value, cost) {
          var item = { value, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    if (typeof module !== "undefined") {
      module.exports = dijkstra;
    }
  }
});

// node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "node_modules/qrcode/lib/core/segments.js"(exports) {
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    };
  }
});

// node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "node_modules/qrcode/lib/core/qrcode.js"(exports) {
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version) {
      const pos = AlignmentPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version) {
        version = bestVersion;
      } else if (version < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version >= 7) {
        setupVersionInfo(modules, version);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version, errorCorrectionLevel, mask);
    };
  }
});

// src/polyfill.ts
if (typeof TextEncoder === "undefined") {
  class TextEncoderPolyfill {
    encode(str) {
      const arr = [];
      for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (code < 128) {
          arr.push(code);
        } else if (code < 2048) {
          arr.push(192 | code >> 6);
          arr.push(128 | code & 63);
        } else if (code < 55296 || code >= 57344) {
          arr.push(224 | code >> 12);
          arr.push(128 | code >> 6 & 63);
          arr.push(128 | code & 63);
        } else {
          i++;
          code = 65536 + ((code & 1023) << 10 | str.charCodeAt(i) & 1023);
          arr.push(240 | code >> 18);
          arr.push(128 | code >> 12 & 63);
          arr.push(128 | code >> 6 & 63);
          arr.push(128 | code & 63);
        }
      }
      return new Uint8Array(arr);
    }
  }
  globalThis.TextEncoder = TextEncoderPolyfill;
}

// src/app.ts
var import_react15 = __toESM(require_react());
var import_fuickjs15 = __toESM(require_fuickjs());

// src/pages/OnboardingPage.tsx
var import_react = __toESM(require_react());
var import_fuickjs = __toESM(require_fuickjs());
function OnboardingPage() {
  const navigator = (0, import_fuickjs.useNavigator)();
  return /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Scaffold, { backgroundColor: "white" }, /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Center, null, /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Padding, { padding: 32 }, /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Column, { crossAxisAlignment: "center", mainAxisAlignment: "center" }, /* @__PURE__ */ import_react.default.createElement(
    import_fuickjs.Container,
    {
      width: 100,
      height: 100,
      decoration: {
        color: "#2196F3",
        borderRadius: 20
      },
      alignment: "center"
    },
    /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Icon, { name: "account_balance_wallet", size: 60, color: "white" })
  ), /* @__PURE__ */ import_react.default.createElement(import_fuickjs.SizedBox, { height: 32 }), /* @__PURE__ */ import_react.default.createElement(
    import_fuickjs.Text,
    {
      text: "Fuick Wallet",
      fontSize: 28,
      fontWeight: "bold",
      color: "#333"
    }
  ), /* @__PURE__ */ import_react.default.createElement(import_fuickjs.SizedBox, { height: 12 }), /* @__PURE__ */ import_react.default.createElement(
    import_fuickjs.Text,
    {
      text: "\u5B89\u5168\u3001\u6613\u7528\u7684 Web3 \u94B1\u5305",
      fontSize: 16,
      color: "#666"
    }
  ), /* @__PURE__ */ import_react.default.createElement(import_fuickjs.SizedBox, { height: 60 }), /* @__PURE__ */ import_react.default.createElement(import_fuickjs.InkWell, { onTap: () => navigator.pushReplace("/wallet/create", { nextPath: "/wallet/home" }) }, /* @__PURE__ */ import_react.default.createElement(
    import_fuickjs.Container,
    {
      width: 240,
      height: 48,
      decoration: {
        color: "#2196F3",
        borderRadius: 24
      },
      alignment: "center"
    },
    /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Text, { text: "\u521B\u5EFA\u65B0\u94B1\u5305", color: "white", fontWeight: "bold" })
  )), /* @__PURE__ */ import_react.default.createElement(import_fuickjs.SizedBox, { height: 20 }), /* @__PURE__ */ import_react.default.createElement(import_fuickjs.InkWell, { onTap: () => navigator.pushReplace("/wallet/import", { nextPath: "/wallet/home" }) }, /* @__PURE__ */ import_react.default.createElement(
    import_fuickjs.Container,
    {
      width: 240,
      height: 48,
      decoration: {
        color: "#E3F2FD",
        borderRadius: 24
      },
      alignment: "center"
    },
    /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Text, { text: "\u5BFC\u5165\u94B1\u5305", color: "#1976D2", fontWeight: "bold" })
  ))))));
}

// src/pages/BootstrapPage.tsx
var import_react2 = __toESM(require_react());
var import_fuickjs2 = __toESM(require_fuickjs());

// src/services/StorageService.ts
var StorageService = class {
  static setItem(key, value) {
    return dartCallNativeAsync("Storage.setItem", { key, value });
  }
  static getItem(key) {
    return dartCallNativeAsync("Storage.getItem", { key });
  }
  static removeItem(key) {
    return dartCallNativeAsync("Storage.removeItem", { key });
  }
};
StorageService.WALLET_KEY = "fuick_wallet_data";

// src/services/WalletService.ts
var WalletService = class {
  static ping() {
    return dartCallNativeAsync("Wallet.ping", {});
  }
  static createWallet() {
    return dartCallNativeAsync("Wallet.createWallet", {});
  }
  static importWallet(mnemonic) {
    return dartCallNativeAsync("Wallet.importWallet", { mnemonic });
  }
  static getAccount(mnemonic, chainType) {
    return dartCallNativeAsync("Wallet.getAccount", { mnemonic, chainType });
  }
  static importPrivateKey(privateKey) {
    return dartCallNativeAsync("Wallet.importPrivateKey", { privateKey });
  }
  static getBalance(rpcUrl, address, chainType = "evm") {
    return dartCallNativeAsync("Wallet.getBalance", { rpcUrl, address, chainType });
  }
  static transfer(rpcUrl, privateKey, to, amount, chainType = "evm") {
    return dartCallNativeAsync("Wallet.transfer", { rpcUrl, privateKey, to, amount, chainType });
  }
};

// src/services/ChainRegistry.ts
var CHAINS = [
  {
    id: "eth-mainnet",
    name: "Ethereum Mainnet",
    type: "EVM",
    chainId: 1,
    rpcUrl: "https://rpc.ankr.com/eth",
    explorer: "https://etherscan.io",
    symbol: "ETH"
  },
  {
    id: "eth-sepolia",
    name: "Sepolia",
    type: "EVM",
    chainId: 11155111,
    rpcUrl: "https://sepolia.drpc.org",
    explorer: "https://sepolia.etherscan.io",
    symbol: "ETH"
  },
  {
    id: "bsc-mainnet",
    name: "BNB Smart Chain",
    type: "EVM",
    chainId: 56,
    rpcUrl: "https://bsc-dataseed.binance.org",
    explorer: "https://bscscan.com",
    symbol: "BNB"
  },
  {
    id: "polygon-mainnet",
    name: "Polygon",
    type: "EVM",
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com",
    symbol: "MATIC"
  },
  {
    id: "solana-mainnet",
    name: "Solana",
    type: "Solana",
    chainId: 101,
    rpcUrl: "https://api.mainnet-beta.solana.com",
    explorer: "https://solscan.io",
    symbol: "SOL"
  },
  {
    id: "solana-devnet",
    name: "Solana Devnet",
    type: "Solana",
    chainId: 103,
    rpcUrl: "https://api.devnet.solana.com",
    explorer: "https://solscan.io?cluster=devnet",
    symbol: "SOL"
  }
];
var SELECTED_KEY = "fuick_selected_chain";
var ChainRegistry = class {
  static list() {
    return CHAINS.slice();
  }
  static getById(id) {
    return CHAINS.find((c) => c.id === id);
  }
  static getDefault() {
    return this.getById("eth-sepolia") || CHAINS[0];
  }
};
async function getSelectedChain() {
  const saved = await StorageService.getItem(SELECTED_KEY);
  if (saved && saved.id) {
    const found = ChainRegistry.getById(saved.id);
    if (found) return found;
  }
  return ChainRegistry.getDefault();
}
async function setSelectedChain(chain) {
  await StorageService.setItem(SELECTED_KEY, { id: chain.id });
}

// src/services/WalletManager.ts
var _WalletManager = class _WalletManager {
  constructor() {
    this.wallets = [];
  }
  static getInstance() {
    if (!_WalletManager.instance) {
      _WalletManager.instance = new _WalletManager();
    }
    return _WalletManager.instance;
  }
  async init() {
    try {
      const list = await StorageService.getItem(_WalletManager.WALLET_LIST_KEY);
      if (list && Array.isArray(list)) {
        this.wallets = list;
      } else {
        this.wallets = [];
      }
      console.log("WalletManager initialized, wallets loaded:", this.wallets.length);
    } catch (e) {
      console.error("Failed to load wallets:", e);
      this.wallets = [];
    }
  }
  getWallets() {
    return this.wallets;
  }
  getWallet(id) {
    return this.wallets.find((w) => w.id === id);
  }
  async createWallet(name) {
    const { mnemonic } = await WalletService.createWallet();
    if (!mnemonic) throw new Error("Failed to create wallet");
    return this._saveNewWallet(name, mnemonic, "mnemonic" /* Mnemonic */);
  }
  async importWallet(name, mnemonic) {
    const { mnemonic: validMnemonic } = await WalletService.importWallet(mnemonic);
    if (!validMnemonic) throw new Error("Failed to import wallet");
    return this._saveNewWallet(name, validMnemonic, "mnemonic" /* Mnemonic */);
  }
  async importPrivateKeyWallet(name, privateKey) {
    const account = await WalletService.importPrivateKey(privateKey);
    return this._saveNewWallet(name, privateKey, "privateKey" /* PrivateKey */, account);
  }
  async _saveNewWallet(name, mnemonicOrPrivateKey, type, privateKeyAccount) {
    const id = this._generateId();
    const finalName = name || `Wallet ${id}`;
    const addresses = {};
    const privateKeys = {};
    let primaryAddress = "";
    if (type === "mnemonic" /* Mnemonic */) {
      const mnemonic = mnemonicOrPrivateKey;
      const protocols = Array.from(new Set(ChainRegistry.list().map((c) => c.type.toLowerCase())));
      for (const protocol of protocols) {
        try {
          const acc = await WalletService.getAccount(mnemonic, protocol);
          if (acc.address) {
            ChainRegistry.list().filter((c) => c.type.toLowerCase() === protocol).forEach((c) => {
              addresses[c.id] = acc.address;
            });
            if (acc.privateKey) {
              privateKeys[protocol] = acc.privateKey;
            }
            if (protocol === "evm") {
              primaryAddress = acc.address;
            } else if (!primaryAddress) {
              primaryAddress = acc.address;
            }
          }
        } catch (e) {
          console.error(`Failed to get account for protocol ${protocol}`, e);
        }
      }
    } else if (type === "privateKey" /* PrivateKey */ && privateKeyAccount) {
      const account = privateKeyAccount;
      if (account.address && account.privateKey) {
        primaryAddress = account.address;
        privateKeys["evm"] = account.privateKey;
        ChainRegistry.list().filter((c) => c.type.toLowerCase() === "evm").forEach((c) => {
          addresses[c.id] = account.address;
        });
      }
    }
    const info = {
      id,
      name: finalName,
      address: primaryAddress,
      type,
      addresses
    };
    const secret = {
      mnemonic: type === "mnemonic" /* Mnemonic */ ? mnemonicOrPrivateKey : void 0,
      privateKeys
    };
    await StorageService.setItem(this._getSecretKey(id), secret);
    this.wallets.push(info);
    await this._saveWalletsList();
    return info;
  }
  async deleteWallet(id) {
    const index = this.wallets.findIndex((w) => w.id === id);
    if (index === -1) return;
    this.wallets.splice(index, 1);
    await this._saveWalletsList();
    await StorageService.removeItem(this._getSecretKey(id));
  }
  async clearAllWallets() {
    for (const w of this.wallets) {
      await StorageService.removeItem(this._getSecretKey(w.id));
    }
    this.wallets = [];
    await StorageService.removeItem(_WalletManager.WALLET_LIST_KEY);
  }
  async getSecret(id) {
    return await StorageService.getItem(this._getSecretKey(id));
  }
  async _saveWalletsList() {
    await StorageService.setItem(_WalletManager.WALLET_LIST_KEY, this.wallets);
  }
  _getSecretKey(id) {
    return `${_WalletManager.SECRET_PREFIX}${id}`;
  }
  _generateId() {
    if (this.wallets.length === 0) {
      return "1";
    }
    const ids = this.wallets.map((w) => parseInt(w.id, 10)).filter((id) => !isNaN(id));
    if (ids.length === 0) {
      return (this.wallets.length + 1).toString();
    }
    const maxId = Math.max(...ids);
    return (maxId + 1).toString();
  }
  getAddressForChain(id, chainId) {
    const w = this.getWallet(id);
    if (!w) return void 0;
    return w.addresses && w.addresses[chainId] || w.address;
  }
};
_WalletManager.WALLET_LIST_KEY = "fuick_wallet_list_v2";
_WalletManager.SECRET_PREFIX = "fuick_wallet_secret_";
var WalletManager = _WalletManager;

// src/pages/BootstrapPage.tsx
function BootstrapPage() {
  const navigator = (0, import_fuickjs2.useNavigator)();
  (0, import_react2.useEffect)(() => {
    checkWallet();
  }, []);
  const checkWallet = async () => {
    try {
      await WalletManager.getInstance().init();
      const wallets = WalletManager.getInstance().getWallets();
      if (wallets.length > 0) {
        navigator.pushReplace("/wallet/home");
      } else {
        navigator.pushReplace("/wallet/onboarding", {});
      }
    } catch (e) {
      console.error("Bootstrap check failed", e);
      navigator.pushReplace("/wallet/onboarding", {});
    }
  };
  return /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Scaffold, null, /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Center, null, /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.CircularProgressIndicator, null)));
}

// src/pages/wallet/CreateWalletPage.tsx
var import_react3 = __toESM(require_react());
var import_fuickjs3 = __toESM(require_fuickjs());
function CreateWalletPage(props) {
  const navigator = (0, import_fuickjs3.useNavigator)();
  const [error, setError] = (0, import_react3.useState)("");
  (0, import_react3.useEffect)(() => {
    WalletService.ping().then((res) => console.log("Wallet Service Ping:", res)).catch((e) => console.error("Wallet Service Ping Failed:", e));
    const createAndNavigate = async () => {
      try {
        const w = await WalletManager.getInstance().createWallet();
        if (w) {
          if (props.nextPath) {
            navigator.pushReplace(props.nextPath, w);
          } else {
            navigator.pop(false, w);
          }
        } else {
          setError("Wallet creation returned null");
        }
      } catch (e) {
        console.error("Failed to create wallet", e);
        setError("Failed: " + (e.message || e.toString()));
      }
    };
    createAndNavigate();
  }, []);
  if (error) {
    return /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Scaffold, { appBar: /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.AppBar, { title: "Error" }) }, /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Center, null, /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Text, { text: error, color: "red" }), /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Container, { height: 20 }), /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Button, { text: "Retry", onTap: () => navigator.pop() })));
  }
  return /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Scaffold, { appBar: /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.AppBar, { title: "Creating Wallet" }) }, /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Center, null, /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Column, { mainAxisAlignment: "center", crossAxisAlignment: "center" }, /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.CircularProgressIndicator, null), /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Container, { height: 24 }), /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Text, { text: "Creating your secure wallet...", fontWeight: "bold", fontSize: 16 }), /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Container, { height: 8 }), /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Text, { text: "This may take a few seconds.", fontSize: 12, color: "#666666" }))));
}

// src/pages/wallet/ImportWalletPage.tsx
var import_react4 = __toESM(require_react());
var import_fuickjs4 = __toESM(require_fuickjs());
function ImportWalletPage(props) {
  const navigator = (0, import_fuickjs4.useNavigator)();
  const [name, setName] = (0, import_react4.useState)("");
  const [mnemonic, setMnemonic] = (0, import_react4.useState)("");
  const [loading, setLoading] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)("");
  const handleImport = () => {
    if (!mnemonic) {
      setError("Please enter a mnemonic phrase");
      return;
    }
    setLoading(true);
    setError("");
    WalletManager.getInstance().importWallet(name || void 0, mnemonic).then(async (wallet) => {
      setLoading(false);
      const hasAddresses = wallet && wallet.addresses && Object.keys(wallet.addresses).length > 0;
      if (hasAddresses) {
        console.log("Wallet imported:", wallet);
        if (props.nextPath) {
          navigator.pushReplace(props.nextPath, wallet);
        } else {
          navigator.pop(false, wallet);
        }
      } else {
        setError("Invalid mnemonic or import failed");
      }
    }).catch((e) => {
      console.error("Import failed", e);
      setLoading(false);
      setError("Import failed: " + (e.message || "Unknown error"));
    });
  };
  return /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Scaffold, { appBar: /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.AppBar, { title: "Import Wallet" }) }, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Padding, { padding: 20 }, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Text, { text: "Wallet Name (Optional):", fontWeight: "bold" }), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 10 }), /* @__PURE__ */ import_react4.default.createElement(
    import_fuickjs4.TextField,
    {
      text: name,
      onChanged: (val) => setName(val),
      decoration: {
        hintText: "e.g. My Savings",
        border: { width: 1, color: "#cccccc" }
      }
    }
  ), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 20 }), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Text, { text: "Enter Mnemonic Phrase:", fontWeight: "bold" }), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 10 }), /* @__PURE__ */ import_react4.default.createElement(
    import_fuickjs4.TextField,
    {
      text: mnemonic,
      onChanged: (val) => setMnemonic(val),
      maxLines: 3,
      decoration: {
        hintText: "separate words with spaces",
        border: { width: 1, color: "#cccccc" }
      }
    }
  ), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 20 }), error ? /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Text, { text: error, color: "red" }) : null, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 20 }), /* @__PURE__ */ import_react4.default.createElement(
    import_fuickjs4.Button,
    {
      text: loading ? "Importing..." : "Import Wallet",
      onTap: loading ? void 0 : handleImport
    }
  ))));
}

// src/pages/wallet/MainTabsPage.tsx
var import_react8 = __toESM(require_react());
var import_fuickjs8 = __toESM(require_fuickjs());

// src/pages/wallet/HomePage.tsx
var import_react5 = __toESM(require_react());
var import_fuickjs5 = __toESM(require_fuickjs());
var BANNERS = [
  "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&q=80",
  // Bitcoin
  "https://images.unsplash.com/photo-1622630998477-20aa696fa4a5?w=800&q=80",
  // Ethereum
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80"
  // DeFi
];
var ACTIONS = [
  { name: "\u8F6C\u8D26", icon: "send", color: "#2196F3" },
  { name: "\u6536\u6B3E", icon: "qr_code", color: "#4CAF50" },
  { name: "Swap", icon: "swap_horiz", color: "#FF9800" },
  { name: "\u4E70\u5E01", icon: "credit_card", color: "#9C27B0" }
];
function HomePage() {
  return /* @__PURE__ */ import_react5.default.createElement(
    import_fuickjs5.Scaffold,
    {
      appBar: /* @__PURE__ */ import_react5.default.createElement(
        import_fuickjs5.AppBar,
        {
          title: "Fuick Wallet",
          actions: [
            /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Icon, { name: "notifications", color: "white", size: 24 }),
            /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.SizedBox, { width: 16 }),
            /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Icon, { name: "qr_code_scanner", color: "white", size: 24 }),
            /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.SizedBox, { width: 16 })
          ]
        }
      )
    },
    /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { color: "#F5F5F5" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Column, null, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { height: 200 }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Stack, null, /* @__PURE__ */ import_react5.default.createElement(
      import_fuickjs5.Image,
      {
        url: BANNERS[0],
        fit: "cover",
        width: Infinity,
        height: 200
      }
    ), /* @__PURE__ */ import_react5.default.createElement(
      import_fuickjs5.Positioned,
      {
        bottom: 10,
        left: 20
      },
      /* @__PURE__ */ import_react5.default.createElement(
        import_fuickjs5.Container,
        {
          padding: 8,
          decoration: {
            color: "#00000066",
            borderRadius: 8
          }
        },
        /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: "\u63A2\u7D22 Web3 \u7684\u65E0\u9650\u53EF\u80FD", color: "white", fontWeight: "bold" })
      )
    ))), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Padding, { padding: 16 }, /* @__PURE__ */ import_react5.default.createElement(
      import_fuickjs5.Container,
      {
        decoration: {
          color: "white",
          borderRadius: 12
          // boxShadow: [{ color: "#0000001A", blurRadius: 10, offset: { dx: 0, dy: 4 } }]
        },
        padding: 20
      },
      /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Row, { mainAxisAlignment: "spaceBetween" }, ACTIONS.map((action, index) => /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Column, { key: index, mainAxisAlignment: "center", crossAxisAlignment: "center" }, /* @__PURE__ */ import_react5.default.createElement(
        import_fuickjs5.Container,
        {
          width: 48,
          height: 48,
          decoration: {
            color: action.color + "22",
            // 浅色背景
            borderRadius: 24
          },
          alignment: "center"
        },
        /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Icon, { name: action.icon, color: action.color, size: 28 })
      ), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.SizedBox, { height: 8 }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: action.name, fontSize: 12, color: "#333" }))))
    )), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Padding, { padding: { left: 16, right: 16, bottom: 16 } }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: "\u70ED\u95E8 DApps", fontSize: 18, fontWeight: "bold", margin: { bottom: 12 } }), /* @__PURE__ */ import_react5.default.createElement(
      import_fuickjs5.GridView,
      {
        crossAxisCount: 2,
        childAspectRatio: 1.5,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        shrinkWrap: true,
        children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ import_react5.default.createElement(
          import_fuickjs5.Container,
          {
            key: i,
            decoration: {
              color: "white",
              borderRadius: 8
            },
            padding: 12
          },
          /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Row, null, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { width: 40, height: 40, color: "#eee", decoration: { borderRadius: 20 } }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.SizedBox, { width: 10 }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Column, { mainAxisAlignment: "center" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: `DApp ${i}`, fontWeight: "bold" }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: "DeFi Protocol", fontSize: 10, color: "grey" })))
        ))
      }
    ))))
  );
}

// src/pages/wallet/MarketPage.tsx
var import_react6 = __toESM(require_react());
var import_fuickjs6 = __toESM(require_fuickjs());
var TABS = ["\u5168\u90E8", "\u81EA\u9009", "\u73B0\u8D27", "\u5408\u7EA6"];
var generateCryptos = (count) => {
  const cryptos = [];
  const baseSymbols = ["BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "DOGE", "DOT", "MATIC", "LTC"];
  const quotes = ["USDT", "USDC"];
  for (let i = 0; i < count; i++) {
    const base = baseSymbols[i % baseSymbols.length];
    const quote = quotes[i % quotes.length];
    const suffix = i >= baseSymbols.length ? ` ${i}` : "";
    const symbol = `${base}/${quote}${suffix}`;
    cryptos.push({
      symbol,
      name: base + suffix,
      price: 10 + Math.random() * 5e4,
      change: -10 + Math.random() * 20,
      volume: Math.floor(Math.random() * 1e6),
      marketCap: Math.floor(Math.random() * 1e9)
    });
  }
  return cryptos;
};
var ALL_CRYPTOS = generateCryptos(100);
var BANNERS2 = [
  "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&q=80",
  "https://images.unsplash.com/photo-1622630998477-20aa696fa4a5?w=800&q=80",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80"
];
var CATEGORIES = [
  { name: "\u6DA8\u5E45\u699C", icon: "trending_up", color: "#4CAF50" },
  { name: "\u8DCC\u5E45\u699C", icon: "trending_down", color: "#F44336" },
  { name: "\u65B0\u5E01", icon: "fiber_new", color: "#FF4081" },
  { name: "Defi", icon: "account_balance", color: "#9C27B0" },
  { name: "GameFi", icon: "games", color: "#795548" },
  { name: "NFT", icon: "image", color: "#FF9800" },
  { name: "Layer2", icon: "layers", color: "#2196F3" },
  { name: "\u66F4\u591A", icon: "apps", color: "#607D8B" }
];
function CryptoItem({ crypto }) {
  const isUp = crypto.change >= 0;
  const color = isUp ? "#4CAF50" : "#F44336";
  return /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Column, null, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.InkWell, { onTap: () => console.log(`Click crypto: ${crypto.symbol}`) }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Container, { color: "white" }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Padding, { padding: { left: 16, right: 16, top: 12, bottom: 12 } }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Row, null, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Text, { text: crypto.name, fontSize: 16, fontWeight: "bold" }), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SizedBox, { width: 6 }), /* @__PURE__ */ import_react6.default.createElement(
    import_fuickjs6.Container,
    {
      color: "#F5F5F5",
      borderRadius: 4,
      padding: { left: 4, right: 4, top: 1, bottom: 1 }
    },
    /* @__PURE__ */ import_react6.default.createElement(
      import_fuickjs6.Text,
      {
        text: "10X",
        fontSize: 10,
        color: "#666666"
      }
    )
  )), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SizedBox, { height: 4 }), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Text, { text: crypto.symbol, fontSize: 12, color: "#999999" })), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Row, null, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Column, { crossAxisAlignment: "end" }, /* @__PURE__ */ import_react6.default.createElement(
    import_fuickjs6.Text,
    {
      text: crypto.price.toFixed(2),
      fontSize: 17,
      fontWeight: "bold",
      color
    }
  ), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SizedBox, { height: 2 }), /* @__PURE__ */ import_react6.default.createElement(
    import_fuickjs6.Text,
    {
      text: (isUp ? "+" : "") + crypto.change.toFixed(2) + "%",
      fontSize: 12,
      color
    }
  ))))))), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Padding, { padding: { left: 16 } }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Divider, { height: 1, color: "#EEEEEE" })));
}
function MarketPage() {
  const [marketData, setMarketData] = (0, import_react6.useState)({
    tick: 0,
    bannerIndex: 0,
    cryptos: ALL_CRYPTOS
  });
  const [activeTabIndex, setActiveTabIndex] = (0, import_react6.useState)(0);
  const listRef = (0, import_react6.useRef)(null);
  const pageViewRef = (0, import_react6.useRef)(null);
  const { tick, cryptos: cryptosWithUpdate } = marketData;
  const filteredCryptos = (0, import_react6.useMemo)(() => {
    if (activeTabIndex === 0) return ALL_CRYPTOS;
    return ALL_CRYPTOS.filter((_, i) => i % (activeTabIndex + 1) === 0);
  }, [activeTabIndex]);
  (0, import_react6.useEffect)(() => {
    setMarketData((prev) => ({ ...prev, cryptos: filteredCryptos }));
  }, [filteredCryptos]);
  (0, import_react6.useEffect)(() => {
    const timer = setInterval(() => {
      setMarketData((prev) => {
        const nextCryptos = prev.cryptos.map((s) => ({
          ...s,
          price: s.price + (Math.random() - 0.5) * 10,
          change: s.change + (Math.random() - 0.5) * 0.1
        }));
        const nextBannerIndex = (prev.bannerIndex + 1) % BANNERS2.length;
        if (pageViewRef.current) {
          pageViewRef.current.animateToPage(nextBannerIndex);
        }
        if (listRef.current) {
          const updates = nextCryptos.map((crypto, index) => ({
            index,
            dsl: /* @__PURE__ */ import_react6.default.createElement(CryptoItem, { key: crypto.symbol, crypto, index })
          }));
          listRef.current.updateItems(updates);
        }
        return {
          tick: prev.tick + 1,
          bannerIndex: nextBannerIndex,
          cryptos: nextCryptos
        };
      });
    }, 3e3);
    return () => clearInterval(timer);
  }, []);
  const itemBuilder = (0, import_react6.useCallback)(
    (index) => {
      const crypto = cryptosWithUpdate[index];
      if (!crypto) return null;
      return /* @__PURE__ */ import_react6.default.createElement(CryptoItem, { key: crypto.symbol, crypto, index });
    },
    [cryptosWithUpdate]
  );
  const bannerItems = (0, import_react6.useMemo)(
    () => BANNERS2.map((url, i) => /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Image, { key: i, url, fit: "cover", width: Infinity, height: 150, borderRadius: 12 })),
    []
  );
  const categoriesGrid = (0, import_react6.useMemo)(
    () => CATEGORIES.map((cat, i) => /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Container, { key: i, color: "white", borderRadius: 12 }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Column, { mainAxisAlignment: "center" }, /* @__PURE__ */ import_react6.default.createElement(
      import_fuickjs6.Container,
      {
        width: 40,
        height: 40,
        borderRadius: 20,
        color: cat.color + "15"
      },
      /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Center, null, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Icon, { name: cat.icon, color: cat.color, size: 24 }))
    ), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SizedBox, { height: 8 }), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Text, { text: cat.name, fontSize: 12, color: "#333333" })))),
    []
  );
  const tabBarTabs = (0, import_react6.useMemo)(
    () => TABS.map((t) => /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Tab, { key: t, text: t })),
    []
  );
  return /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.DefaultTabController, { length: TABS.length, initialIndex: 0 }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Scaffold, { backgroundColor: "white" }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.CustomScrollView, null, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SliverAppBar, { pinned: true }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Container, { color: "#2196F3", isBoundary: true }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SafeArea, null, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Padding, { padding: { left: 16, right: 16, bottom: 8 } }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Column, { mainAxisAlignment: "center", crossAxisAlignment: "start" }, /* @__PURE__ */ import_react6.default.createElement(
    import_fuickjs6.Text,
    {
      text: "\u884C\u60C5",
      fontSize: 18,
      color: "white",
      fontWeight: "bold"
    }
  ), /* @__PURE__ */ import_react6.default.createElement(
    import_fuickjs6.Text,
    {
      text: `\u5B9E\u65F6\u884C\u60C5 \xB7 \u66F4\u65B0 ${tick}`,
      fontSize: 11,
      color: "white"
    }
  )))))), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SliverToBoxAdapter, null, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Padding, { padding: { left: 16, right: 16, top: 12, bottom: 0 } }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Container, { height: 44, color: "#F5F5F5", borderRadius: 22 }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Padding, { padding: { left: 16, right: 16 } }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Row, { crossAxisAlignment: "center" }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Icon, { name: "search", size: 20, color: "#999999" }), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SizedBox, { width: 8 }), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Flexible, null, /* @__PURE__ */ import_react6.default.createElement(
    import_fuickjs6.TextField,
    {
      hintText: "\u641C\u7D22\u5E01\u79CD",
      onChanged: (v) => console.log("Search:", v)
    }
  ))))))), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SliverToBoxAdapter, null, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Padding, { padding: { left: 16, right: 16, top: 16 } }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Container, { height: 150, borderRadius: 12 }, /* @__PURE__ */ import_react6.default.createElement(
    import_fuickjs6.PageView,
    {
      ref: pageViewRef,
      onPageChanged: (index) => setMarketData((prev) => ({ ...prev, bannerIndex: index }))
    },
    bannerItems
  )))), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SliverToBoxAdapter, null, /* @__PURE__ */ import_react6.default.createElement(
    import_fuickjs6.GridView,
    {
      padding: { left: 12, right: 12, bottom: 8 },
      crossAxisCount: 4,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 0.8,
      shrinkWrap: true,
      physics: "never"
    },
    categoriesGrid
  )), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SliverToBoxAdapter, null, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Padding, { padding: { left: 16, right: 16, top: 20, bottom: 0 } }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react6.default.createElement(
    import_fuickjs6.Text,
    {
      text: `${TABS[activeTabIndex]}\u699C\u5355`,
      fontSize: 18,
      fontWeight: "bold"
    }
  )))), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SliverPersistentHeader, { pinned: true, minExtent: 49, maxExtent: 49 }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Container, { color: "#FFFFFF" }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Column, null, /* @__PURE__ */ import_react6.default.createElement(
    import_fuickjs6.TabBar,
    {
      tabs: tabBarTabs,
      onTap: (index) => setActiveTabIndex(index),
      labelColor: "#2196F3",
      unselectedLabelColor: "#666666",
      indicatorColor: "#2196F3",
      indicatorWeight: 2
    }
  ), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Divider, { height: 1, color: "#EEEEEE" })))), /* @__PURE__ */ import_react6.default.createElement(
    import_fuickjs6.SliverList,
    {
      ref: listRef,
      itemCount: cryptosWithUpdate.length,
      itemBuilder
    }
  ), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SliverToBoxAdapter, null, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Container, { height: 60 }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Center, null, /* @__PURE__ */ import_react6.default.createElement(
    import_fuickjs6.Text,
    {
      text: `\u2014\u2014 \u5230\u5E95\u4E86\uFF0C\u5171 ${cryptosWithUpdate.length} \u4E2A\u5E01\u79CD \u2014\u2014`,
      color: "#CCCCCC",
      fontSize: 12
    }
  )))))));
}

// src/pages/wallet/WalletHomePage.tsx
var import_react7 = __toESM(require_react());
var import_fuickjs7 = __toESM(require_fuickjs());
function WalletHomePage() {
  const navigator = (0, import_fuickjs7.useNavigator)();
  const [wallet, setWallet] = (0, import_react7.useState)(null);
  const [balance, setBalance] = (0, import_react7.useState)("0.00");
  const [toAddress, setToAddress] = (0, import_react7.useState)("");
  const [amount, setAmount] = (0, import_react7.useState)("");
  const [txHash, setTxHash] = (0, import_react7.useState)("");
  const [loading, setLoading] = (0, import_react7.useState)(false);
  const [chain, setChain] = (0, import_react7.useState)(null);
  (0, import_react7.useEffect)(() => {
    loadWallet();
    (async () => {
      const c = await getSelectedChain();
      setChain(c);
    })();
  }, []);
  const loadWallet = () => {
    const wallets = WalletManager.getInstance().getWallets();
    if (wallets.length > 0) {
      setWallet(wallets[0]);
    } else {
      setWallet(null);
    }
  };
  (0, import_react7.useEffect)(() => {
    if (wallet && chain) {
      fetchBalance();
    }
  }, [wallet?.address, chain?.id]);
  const fetchBalance = () => {
    if (!wallet) return;
    setBalance("Loading...");
    const rpc = chain?.rpcUrl || "https://sepolia.drpc.org";
    const addr = wallet.addresses?.[chain?.id || ""] || wallet.address;
    const chainType = chain?.type?.toLowerCase() || "evm";
    WalletService.getBalance(rpc, addr, chainType).then((val) => {
      try {
        const num = parseFloat(val);
        setBalance(num.toFixed(4));
      } catch {
        setBalance(val);
      }
    }).catch((e) => setBalance("Error"));
  };
  const handleSwitchWallet = async () => {
    const result = await navigator.showModal("/wallet/list", {}, { maxHeight: 0.9 });
    if (result && result.id) {
      setWallet(result);
    } else {
      const wallets = WalletManager.getInstance().getWallets();
      if (wallet && !wallets.find((w) => w.id === wallet.id)) {
        setWallet(wallets.length > 0 ? wallets[0] : null);
      } else if (!wallet && wallets.length > 0) {
        setWallet(wallets[0]);
      }
    }
  };
  const handleTransfer = async () => {
    if (!wallet || !toAddress || !amount) return;
    setLoading(true);
    setTxHash("");
    try {
      const secret = await WalletManager.getInstance().getSecret(wallet.id);
      if (!secret) {
        throw new Error("Secret not found");
      }
      const rpc = chain?.rpcUrl || "https://sepolia.drpc.org";
      const chainType = chain?.type?.toLowerCase() || "evm";
      const privateKey = secret.privateKeys?.[chainType];
      if (!privateKey) {
        throw new Error(`Private key not found for ${chainType}`);
      }
      const hash = await WalletService.transfer(rpc, privateKey, toAddress, amount, chainType);
      setTxHash(hash);
      setLoading(false);
      fetchBalance();
    } catch (e) {
      console.error("Transfer failed", e);
      setLoading(false);
      setTxHash("Failed: " + (e.message || "Unknown error"));
    }
  };
  const ActionButton = ({ icon, label, onTap }) => /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.GestureDetector, { onTap }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Column, { crossAxisAlignment: "center" }, /* @__PURE__ */ import_react7.default.createElement(
    import_fuickjs7.Container,
    {
      width: 48,
      height: 48,
      decoration: { color: "#E0F7FA", borderRadius: 24 },
      alignment: "center"
    },
    /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Icon, { name: icon, color: "#006064", size: 24 })
  ), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { height: 8 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: label, fontSize: 12, color: "#333333" })));
  const TokenItem = ({ icon, symbol, name, balance: balance2, price, change }) => /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Column, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { padding: { top: 16, bottom: 16 } }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, { mainAxisAlignment: "spaceBetween", crossAxisAlignment: "center" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { width: 40, height: 40, decoration: { color: "#f0f0f0", borderRadius: 20 }, alignment: "center" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Icon, { name: icon, size: 24 })), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { width: 12 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: symbol, fontWeight: "bold", fontSize: 16 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: price, fontSize: 12, color: "#666666" }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { width: 4 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: change, fontSize: 12, color: change.startsWith("+") ? "green" : "red" })))), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Column, { crossAxisAlignment: "end" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: balance2, fontWeight: "bold", fontSize: 16 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: `$${(parseFloat(balance2) * parseFloat(price.replace("$", ""))).toFixed(2)}`, fontSize: 12, color: "#666666" })))), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { height: 1, color: "#f0f0f0" }));
  if (!wallet) {
    return /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Scaffold, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Center, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.CircularProgressIndicator, null), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { height: 16 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: "Loading Wallet..." })));
  }
  return /* @__PURE__ */ import_react7.default.createElement(
    import_fuickjs7.Scaffold,
    {
      appBar: /* @__PURE__ */ import_react7.default.createElement(
        import_fuickjs7.AppBar,
        {
          centerTitle: false,
          backgroundColor: "white",
          elevation: 0,
          title: /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.GestureDetector, { onTap: handleSwitchWallet }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, { crossAxisAlignment: "center" }, /* @__PURE__ */ import_react7.default.createElement(
            import_fuickjs7.Container,
            {
              width: 32,
              height: 32,
              decoration: { color: "#FFCDD2", borderRadius: 16 },
              alignment: "center",
              margin: { right: 8 }
            },
            /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Icon, { name: "account_balance_wallet", color: "#D32F2F", size: 18 })
          ), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: wallet.name, fontSize: 16, fontWeight: "bold", color: "black" }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Icon, { name: "keyboard_arrow_down", color: "#666666" }))),
          actions: [
            /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { padding: { right: 8 }, alignment: "center" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Icon, { name: "qr_code_scanner", color: "black" })),
            /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.GestureDetector, { onTap: async () => {
              const chosen = await navigator.showModal("/wallet/chain_select", {}, { maxHeight: 0.9 });
              if (chosen && chosen.id) {
                setChain(chosen);
              }
            } }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { padding: { right: 16 }, alignment: "center" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, { crossAxisAlignment: "center" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Icon, { name: "public", color: "#006064" }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { width: 4 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: chain?.name || "\u7F51\u7EDC", color: "#006064" }))))
          ]
        }
      )
    },
    /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Padding, { padding: { top: 0, left: 20, right: 20, bottom: 20 } }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { height: 24 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: `$${(parseFloat(balance === "Loading..." || balance === "Error" ? "0" : balance) * 2e3).toFixed(2)}`, fontSize: 32, fontWeight: "bold" }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, { crossAxisAlignment: "center" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: `+<0.01 (+0.36%) Today's PNL`, fontSize: 12, color: "green" })), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { height: 24 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react7.default.createElement(ActionButton, { icon: "send", label: "Transfer", onTap: () => {
    } }), /* @__PURE__ */ import_react7.default.createElement(ActionButton, { icon: "call_received", label: "Receive", onTap: () => {
      navigator.push("/wallet/receive", { wallet });
    } }), /* @__PURE__ */ import_react7.default.createElement(ActionButton, { icon: "history", label: "History" }), /* @__PURE__ */ import_react7.default.createElement(ActionButton, { icon: "more_horiz", label: "More", onTap: () => {
      navigator.push("/wallet/detail", { walletId: wallet?.id });
    } })), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { height: 24 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { width: 100, height: 80, decoration: { color: "#F5F5F5", borderRadius: 12 }, padding: 12 }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Icon, { name: "savings", color: "#8BC34A" }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Expanded, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, null)), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: "Earn", fontSize: 12, color: "#666666" }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: "$0.05", fontWeight: "bold", fontSize: 14 }))), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { width: 100, height: 80, decoration: { color: "#F5F5F5", borderRadius: 12 }, padding: 12 }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Icon, { name: "credit_card", color: "#FF9800" }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Expanded, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, null)), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: "Card", fontSize: 12, color: "#666666" }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: "No Fee", fontWeight: "bold", fontSize: 14 }))), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { width: 100, height: 80, decoration: { color: "#F5F5F5", borderRadius: 12 }, padding: 12 }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Icon, { name: "swap_horiz", color: "#2196F3" }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Expanded, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, null)), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: "Swap", fontSize: 12, color: "#666666" }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: "Trade", fontWeight: "bold", fontSize: 14 })))), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { height: 24 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, { mainAxisAlignment: "spaceBetween", crossAxisAlignment: "center" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: "Tokens $0.03", fontWeight: "bold", fontSize: 16 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Icon, { name: "tune", color: "#666666" })), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { height: 8 }), /* @__PURE__ */ import_react7.default.createElement(TokenItem, { icon: "currency_bitcoin", symbol: "BNB", name: "BNB", balance: "<0.0001", price: "$659.2", change: "+6.88%" }), /* @__PURE__ */ import_react7.default.createElement(TokenItem, { icon: "attach_money", symbol: "USDC", name: "USDC", balance: "0.0038", price: "$1.00", change: "0.00%" }), /* @__PURE__ */ import_react7.default.createElement(
      import_fuickjs7.Container,
      {
        margin: { top: 8, bottom: 8 },
        padding: 12,
        decoration: { color: "#E0F2F1", borderRadius: 8 }
      },
      /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: "Earn 10% APY", color: "#00695C", fontWeight: "bold", fontSize: 12 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Icon, { name: "chevron_right", color: "#00695C", size: 16 }))
    )))
  );
}

// src/pages/wallet/MainTabsPage.tsx
function MainTabsPage() {
  const [currentIndex, setCurrentIndex] = (0, import_react8.useState)(0);
  const pageViewRef = (0, import_react8.useRef)(null);
  const handleTabTap = (index) => {
    setCurrentIndex(index);
    pageViewRef.current?.jumpToPage(index);
  };
  const handlePageChanged = (index) => {
    setCurrentIndex(index);
  };
  return /* @__PURE__ */ import_react8.default.createElement(
    import_fuickjs8.Scaffold,
    {
      bottomNavigationBar: /* @__PURE__ */ import_react8.default.createElement(
        import_fuickjs8.BottomNavigationBar,
        {
          currentIndex,
          onTap: handleTabTap,
          items: [
            /* @__PURE__ */ import_react8.default.createElement(
              import_fuickjs8.BottomNavigationBarItem,
              {
                key: "home",
                icon: /* @__PURE__ */ import_react8.default.createElement(import_fuickjs8.Icon, { name: "home" }),
                label: "\u9996\u9875"
              }
            ),
            /* @__PURE__ */ import_react8.default.createElement(
              import_fuickjs8.BottomNavigationBarItem,
              {
                key: "market",
                icon: /* @__PURE__ */ import_react8.default.createElement(import_fuickjs8.Icon, { name: "show_chart" }),
                label: "\u884C\u60C5"
              }
            ),
            /* @__PURE__ */ import_react8.default.createElement(
              import_fuickjs8.BottomNavigationBarItem,
              {
                key: "assets",
                icon: /* @__PURE__ */ import_react8.default.createElement(import_fuickjs8.Icon, { name: "account_balance_wallet" }),
                label: "\u8D44\u4EA7"
              }
            )
          ]
        }
      )
    },
    /* @__PURE__ */ import_react8.default.createElement(
      import_fuickjs8.PageView,
      {
        physics: "never",
        ref: pageViewRef,
        onPageChanged: handlePageChanged,
        initialPage: 0
      },
      /* @__PURE__ */ import_react8.default.createElement(HomePage, null),
      /* @__PURE__ */ import_react8.default.createElement(MarketPage, null),
      /* @__PURE__ */ import_react8.default.createElement(WalletHomePage, null)
    )
  );
}

// src/pages/wallet/WalletListPage.tsx
var import_react11 = __toESM(require_react());
var import_fuickjs11 = __toESM(require_fuickjs());

// src/pages/wallet/WalletDeleteDialog.tsx
var import_react9 = __toESM(require_react());
var import_fuickjs9 = __toESM(require_fuickjs());
function WalletDeleteDialog(props) {
  const navigator = (0, import_fuickjs9.useNavigator)();
  const walletName = props.wallet ? props.wallet.name : "Wallet";
  const handleCancel = () => {
    navigator.pop(false);
  };
  const handleDelete = () => {
    navigator.pop(true);
  };
  return /* @__PURE__ */ import_react9.default.createElement(
    import_fuickjs9.AlertDialog,
    {
      title: /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Text, { text: "Delete Wallet?", fontWeight: "bold", fontSize: 18 }),
      content: /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Column, { mainAxisSize: "min", crossAxisAlignment: "start" }, /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Text, { text: `Are you sure you want to delete "${walletName}"?`, fontSize: 16 }), /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Container, { height: 8 }), /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Text, { text: "This action cannot be undone! Your private key will be lost permanently.", color: "red", fontSize: 14 })),
      actions: [
        /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.InkWell, { onTap: handleCancel }, /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Container, { padding: { horizontal: 16, vertical: 8 } }, /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Text, { text: "Cancel", color: "black", fontWeight: "bold" }))),
        /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.InkWell, { onTap: handleDelete }, /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Container, { padding: { horizontal: 16, vertical: 8 } }, /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Text, { text: "Delete", color: "red", fontWeight: "bold" })))
      ]
    }
  );
}

// src/pages/wallet/WalletClearDialog.tsx
var import_react10 = __toESM(require_react());
var import_fuickjs10 = __toESM(require_fuickjs());
function WalletClearDialog() {
  const navigator = (0, import_fuickjs10.useNavigator)();
  const handleCancel = () => {
    navigator.pop(false);
  };
  const handleClear = () => {
    navigator.pop(true);
  };
  return /* @__PURE__ */ import_react10.default.createElement(
    import_fuickjs10.AlertDialog,
    {
      title: /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Text, { text: "Clear All Wallets?", fontWeight: "bold", fontSize: 18 }),
      content: /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Column, { mainAxisSize: "min", crossAxisAlignment: "start" }, /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Text, { text: "Are you sure you want to delete ALL wallets?", fontSize: 16 }), /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Container, { height: 8 }), /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Text, { text: "This action cannot be undone! All private keys will be lost permanently.", color: "red", fontSize: 14 })),
      actions: [
        /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.InkWell, { onTap: handleCancel }, /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Container, { padding: { horizontal: 16, vertical: 8 } }, /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Text, { text: "Cancel", color: "black", fontWeight: "bold" }))),
        /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.InkWell, { onTap: handleClear }, /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Container, { padding: { horizontal: 16, vertical: 8 } }, /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Text, { text: "Delete All", color: "red", fontWeight: "bold" })))
      ]
    }
  );
}

// src/pages/wallet/WalletListPage.tsx
function WalletListPage(props) {
  const navigator = (0, import_fuickjs11.useNavigator)();
  const navigatorAny = navigator;
  const [wallets, setWallets] = (0, import_react11.useState)([]);
  const [chainId, setChainId] = (0, import_react11.useState)("");
  const isModal = props.onClose || props.presentation === "bottomSheet";
  (0, import_react11.useEffect)(() => {
    loadWallets();
    (async () => {
      const c = await getSelectedChain();
      setChainId(c.id);
    })();
  }, []);
  const loadWallets = () => {
    setWallets([...WalletManager.getInstance().getWallets()]);
  };
  const handleSelect = (wallet) => {
    if (props.onClose) {
      props.onClose(wallet);
    } else {
      navigator.pop(false, wallet);
    }
  };
  const handleCreate = async () => {
    const result = await navigator.push("/wallet/create");
    if (result) {
      if (props.onClose) {
        props.onClose(result);
      } else {
        navigator.pop(false, result);
      }
    } else {
      loadWallets();
    }
  };
  const handleImport = async () => {
    const result = await navigator.push("/wallet/import");
    if (result) {
      if (props.onClose) {
        props.onClose(result);
      } else {
        navigator.pop(false, result);
      }
    } else {
      loadWallets();
    }
  };
  const handleClearAll = async () => {
    const confirmed = await navigatorAny.showDialog(/* @__PURE__ */ import_react11.default.createElement(WalletClearDialog, null));
    if (confirmed) {
      await WalletManager.getInstance().clearAllWallets();
      loadWallets();
    }
  };
  const handleDeleteWallet = async (wallet) => {
    const confirmed = await navigatorAny.showDialog(/* @__PURE__ */ import_react11.default.createElement(WalletDeleteDialog, { wallet }));
    if (confirmed) {
      await WalletManager.getInstance().deleteWallet(wallet.id);
      loadWallets();
    }
  };
  const content = /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Column, null, isModal ? /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { padding: 16, alignment: "center" }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { width: 40, height: 4, decoration: { color: "#ddd", borderRadius: 2 } }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { height: 10 }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Text, { text: "Select Wallet", fontWeight: "bold", fontSize: 16 })) : /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { height: 1, color: "#eee" }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Expanded, null, /* @__PURE__ */ import_react11.default.createElement(
    import_fuickjs11.ListView,
    {
      itemCount: wallets.length,
      itemBuilder: (index) => {
        const w = wallets[index];
        return /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Column, null, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { padding: 16 }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Row, { mainAxisAlignment: "spaceBetween", crossAxisAlignment: "center" }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Expanded, null, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.InkWell, { onTap: () => handleSelect(w) }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Text, { text: w.name, fontWeight: "bold", fontSize: 16 }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { height: 4 }), /* @__PURE__ */ import_react11.default.createElement(
          import_fuickjs11.Text,
          {
            text: (() => {
              const addr = w.addresses && chainId ? w.addresses[chainId] || w.address : w.address;
              const head = addr.substring(0, 6);
              const tail = addr.substring(addr.length - 4);
              return head + "..." + tail;
            })(),
            fontSize: 14,
            color: "#666"
          }
        )))), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Row, null, w.type === "mnemonic" ? /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { padding: { horizontal: 8, vertical: 4 }, decoration: { color: "#E3F2FD", borderRadius: 4 } }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Text, { text: "HD", fontSize: 10, color: "#1976D2" })) : /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { padding: { horizontal: 8, vertical: 4 }, decoration: { color: "#FFF3E0", borderRadius: 4 } }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Text, { text: "PK", fontSize: 10, color: "#F57C00" })), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { width: 16 }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.GestureDetector, { onTap: () => handleDeleteWallet(w) }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { padding: 8 }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Icon, { name: "delete", color: "#aaa", size: 20 })))))), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { height: 1, color: "#f0f0f0" }));
      }
    }
  )), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Padding, { padding: 20 }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Column, null, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.InkWell, { onTap: handleCreate }, /* @__PURE__ */ import_react11.default.createElement(
    import_fuickjs11.Container,
    {
      height: 48,
      decoration: {
        color: "#2196F3",
        borderRadius: 24
      },
      alignment: "center"
    },
    /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Row, { mainAxisAlignment: "center" }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Icon, { name: "add", color: "white" }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { width: 8 }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Text, { text: "Create New Wallet", color: "white", fontWeight: "bold" }))
  )), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { height: 12 }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.InkWell, { onTap: handleImport }, /* @__PURE__ */ import_react11.default.createElement(
    import_fuickjs11.Container,
    {
      height: 48,
      decoration: {
        color: "white",
        borderRadius: 24,
        border: { width: 1, color: "#2196F3" }
      },
      alignment: "center"
    },
    /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Row, { mainAxisAlignment: "center" }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Icon, { name: "file_download", color: "#2196F3" }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { width: 8 }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Text, { text: "Import Wallet", color: "#2196F3", fontWeight: "bold" }))
  )), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { height: 20 }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.InkWell, { onTap: handleClearAll }, /* @__PURE__ */ import_react11.default.createElement(
    import_fuickjs11.Container,
    {
      height: 48,
      alignment: "center"
    },
    /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Text, { text: "Clear Local Wallets", color: "red" })
  )))));
  if (isModal) {
    return /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { decoration: { color: "white", borderRadius: { topLeft: 16, topRight: 16 } } }, content);
  }
  return /* @__PURE__ */ import_react11.default.createElement(
    import_fuickjs11.Scaffold,
    {
      appBar: /* @__PURE__ */ import_react11.default.createElement(
        import_fuickjs11.AppBar,
        {
          title: "Wallets"
        }
      )
    },
    content
  );
}

// src/pages/wallet/ChainSelectPage.tsx
var import_react12 = __toESM(require_react());
var import_fuickjs12 = __toESM(require_fuickjs());
function ChainSelectPage() {
  const navigator = (0, import_fuickjs12.useNavigator)();
  const [selected, setSelected] = (0, import_react12.useState)(null);
  const chains = ChainRegistry.list();
  (0, import_react12.useEffect)(() => {
    (async () => {
      const c = await getSelectedChain();
      setSelected(c);
    })();
  }, []);
  const onChoose = async (chain) => {
    await setSelectedChain(chain);
    navigator.pop(chain);
  };
  return /* @__PURE__ */ import_react12.default.createElement(
    import_fuickjs12.Scaffold,
    {
      appBar: /* @__PURE__ */ import_react12.default.createElement(
        import_fuickjs12.AppBar,
        {
          title: /* @__PURE__ */ import_react12.default.createElement(import_fuickjs12.Text, { text: "\u9009\u62E9\u7F51\u7EDC", fontWeight: "bold" }),
          centerTitle: true,
          elevation: 0
        }
      )
    },
    /* @__PURE__ */ import_react12.default.createElement(import_fuickjs12.Container, null, /* @__PURE__ */ import_react12.default.createElement(
      import_fuickjs12.ListView,
      {
        children: chains.map((c) => /* @__PURE__ */ import_react12.default.createElement(
          import_fuickjs12.ListTile,
          {
            title: /* @__PURE__ */ import_react12.default.createElement(import_fuickjs12.Text, { text: c.name }),
            subtitle: /* @__PURE__ */ import_react12.default.createElement(import_fuickjs12.Text, { text: `${c.symbol || ""} \xB7 ChainId ${c.chainId}`, color: "#666666" }),
            trailing: selected?.id === c.id ? /* @__PURE__ */ import_react12.default.createElement(import_fuickjs12.Icon, { name: "check", color: "#2196F3" }) : void 0,
            onTap: () => onChoose(c)
          }
        ))
      }
    ))
  );
}

// src/pages/wallet/WalletDetailPage.tsx
var import_react13 = __toESM(require_react());
var import_fuickjs13 = __toESM(require_fuickjs());
function WalletDetailPage({ walletId }) {
  const navigator = (0, import_fuickjs13.useNavigator)();
  const [wallet, setWallet] = (0, import_react13.useState)(null);
  const [secret, setSecret] = (0, import_react13.useState)(null);
  const [showMnemonic, setShowMnemonic] = (0, import_react13.useState)(false);
  const [showPrivateKey, setShowPrivateKey] = (0, import_react13.useState)(false);
  (0, import_react13.useEffect)(() => {
    const wm = WalletManager.getInstance();
    const id = walletId || wm.getWallets()[0]?.id;
    if (!id) return;
    const info = wm.getWallet(id);
    setWallet(info || null);
  }, [walletId]);
  const confirmReveal = async (type) => {
    const ok = await navigator.showDialog(
      import_react13.default.createElement(RiskRevealDialog, { type })
    );
    if (!ok) return;
    if (!wallet) return;
    const s = await WalletManager.getInstance().getSecret(wallet.id);
    setSecret(s);
    if (type === "mnemonic") setShowMnemonic(true);
    if (type === "privateKey") setShowPrivateKey(true);
  };
  return /* @__PURE__ */ import_react13.default.createElement(
    import_fuickjs13.Scaffold,
    {
      appBar: /* @__PURE__ */ import_react13.default.createElement(
        import_fuickjs13.AppBar,
        {
          title: /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: "\u94B1\u5305\u8BE6\u60C5", fontWeight: "bold" }),
          centerTitle: true,
          elevation: 0
        }
      )
    },
    /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.SingleChildScrollView, null, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Padding, { padding: { horizontal: 20, vertical: 12 } }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: "\u57FA\u672C\u4FE1\u606F", fontWeight: "bold", fontSize: 16 }), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { height: 8 }), wallet ? /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Row, { crossAxisAlignment: "center" }, /* @__PURE__ */ import_react13.default.createElement(
      import_fuickjs13.Container,
      {
        width: 36,
        height: 36,
        decoration: { color: "#E0F7FA", borderRadius: 18 },
        alignment: "center",
        margin: { right: 8 }
      },
      /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Icon, { name: "account_balance_wallet", color: "#006064" })
    ), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Expanded, null, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: wallet.name, fontWeight: "bold" }), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: wallet.address, color: "#666666", maxLines: 1, overflow: "ellipsis" })))), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { height: 20 }), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: "\u591A\u94FE\u5730\u5740", fontWeight: "bold", fontSize: 16 }), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { height: 8 }), /* @__PURE__ */ import_react13.default.createElement(
      import_fuickjs13.Container,
      {
        padding: 12,
        decoration: { color: "#FAFAFA", borderRadius: 8, border: { width: 1, color: "#EEEEEE" } }
      },
      /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Column, null, ChainRegistry.list().map((chain, index) => /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Column, { key: chain.id }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { padding: { vertical: 8 } }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: chain.name, fontSize: 12, color: "#666", fontWeight: "bold" }), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { height: 4 }), /* @__PURE__ */ import_react13.default.createElement(
        import_fuickjs13.Text,
        {
          text: wallet?.addresses?.[chain.id] || wallet?.address || "\u672A\u751F\u6210",
          fontSize: 13,
          color: "#333",
          maxLines: 2
        }
      ))), index < ChainRegistry.list().length - 1 && /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { height: 1, color: "#EEEEEE" }))))
    ), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { height: 20 }), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: "\u5B89\u5168\u4FE1\u606F", fontWeight: "bold", fontSize: 16 }), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { height: 8 }), /* @__PURE__ */ import_react13.default.createElement(
      import_fuickjs13.Container,
      {
        padding: 12,
        decoration: { color: "#FAFAFA", borderRadius: 8, border: { width: 1, color: "#EEEEEE" } }
      },
      /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Row, { mainAxisAlignment: "spaceBetween", crossAxisAlignment: "center" }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Expanded, null, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: "\u52A9\u8BB0\u8BCD", fontWeight: "bold" }), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { height: 4 }), /* @__PURE__ */ import_react13.default.createElement(
        import_fuickjs13.Text,
        {
          text: showMnemonic ? secret?.mnemonic || "\u65E0" : "******** ******** ******** ********",
          color: "#333333"
        }
      ))), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Button, { text: showMnemonic ? "\u9690\u85CF" : "\u663E\u793A", onTap: () => showMnemonic ? setShowMnemonic(false) : confirmReveal("mnemonic") }))
    ), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { height: 12 }), /* @__PURE__ */ import_react13.default.createElement(
      import_fuickjs13.Container,
      {
        padding: 12,
        decoration: { color: "#FAFAFA", borderRadius: 8, border: { width: 1, color: "#EEEEEE" } }
      },
      /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Row, { mainAxisAlignment: "spaceBetween", crossAxisAlignment: "center" }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Expanded, null, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: "\u79C1\u94A5", fontWeight: "bold" }), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { height: 4 }), showPrivateKey ? /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Column, null, Object.entries(secret?.privateKeys || {}).map(([k, v]) => /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Column, { key: k }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: `${k.toUpperCase()}:`, fontSize: 12, color: "#666", fontWeight: "bold" }), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: v, color: "#333333", fontSize: 12 }), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { height: 4 }))), (!secret?.privateKeys || Object.keys(secret?.privateKeys).length === 0) && /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: "\u65E0", color: "#333333" })) : /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: "0x********************************", color: "#333333" }))), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Button, { text: showPrivateKey ? "\u9690\u85CF" : "\u663E\u793A", onTap: () => showPrivateKey ? setShowPrivateKey(false) : confirmReveal("privateKey") }))
    )) : /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: "\u672A\u627E\u5230\u94B1\u5305" }))))
  );
}
function RiskRevealDialog({ type }) {
  const navigator = (0, import_fuickjs13.useNavigator)();
  const onCancel = () => navigator.pop(false);
  const onOk = () => navigator.pop(true);
  return /* @__PURE__ */ import_react13.default.createElement(
    import_fuickjs13.AlertDialog,
    {
      title: /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: "\u98CE\u9669\u63D0\u793A", fontWeight: "bold" }),
      content: /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Column, { crossAxisAlignment: "start", mainAxisSize: "min" }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: type === "mnemonic" ? "\u663E\u793A\u52A9\u8BB0\u8BCD\u5C06\u66B4\u9732\u6062\u590D\u6743\u9650\uFF0C\u8BF7\u786E\u4FDD\u5468\u56F4\u73AF\u5883\u5B89\u5168\u3002" : "\u663E\u793A\u79C1\u94A5\u5C06\u66B4\u9732\u8D44\u91D1\u63A7\u5236\u6743\uFF0C\u8BF7\u786E\u4FDD\u5468\u56F4\u73AF\u5883\u5B89\u5168\u3002" }), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { height: 8 }), /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: "\u8BF7\u52FF\u622A\u56FE\u6216\u968F\u610F\u5206\u4EAB\u3002\u6211\u4EEC\u4E0D\u4F1A\u8FDC\u7A0B\u4FDD\u5B58\u6B64\u4FE1\u606F\u3002", color: "red" })),
      actions: [
        /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.InkWell, { onTap: onCancel }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { padding: { horizontal: 16, vertical: 8 } }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: "\u53D6\u6D88" }))),
        /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.InkWell, { onTap: onOk }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Container, { padding: { horizontal: 16, vertical: 8 } }, /* @__PURE__ */ import_react13.default.createElement(import_fuickjs13.Text, { text: "\u786E\u8BA4\u663E\u793A", color: "red", fontWeight: "bold" })))
      ]
    }
  );
}

// src/pages/wallet/ReceivePage.tsx
var import_react14 = __toESM(require_react());
var import_fuickjs14 = __toESM(require_fuickjs());
var import_qrcode = __toESM(require_qrcode());
function ReceivePage(props) {
  const [chain, setChain] = (0, import_react14.useState)(null);
  const wallet = props.wallet;
  (0, import_react14.useEffect)(() => {
    (async () => {
      const c = await getSelectedChain();
      setChain(c);
    })();
  }, []);
  const address = wallet?.addresses?.[chain?.id || ""] || wallet?.address;
  const painter = (0, import_react14.useMemo)(() => {
    if (!address) return null;
    try {
      const qr = import_qrcode.default.create(address, { errorCorrectionLevel: "M" });
      const size = qr.modules.size;
      const data = qr.modules.data;
      const qrSize = 200;
      const containerSize = 220;
      const pixelSize = qrSize / size;
      const offset = (containerSize - qrSize) / 2;
      return new import_fuickjs14.CustomPainter((p) => {
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            if (data[y * size + x]) {
              p.drawRect(
                {
                  left: -qrSize / 2 + x * pixelSize,
                  top: -qrSize / 2 + y * pixelSize,
                  width: pixelSize + 0.5,
                  height: pixelSize + 0.5
                },
                { color: "#000000", style: "fill" }
              );
            }
          }
        }
      });
    } catch (e) {
      console.error("QR create error", e);
      return null;
    }
  }, [address]);
  return /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.Scaffold, { appBar: /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.AppBar, { title: "Receive" }) }, /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.Center, null, /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.Column, { mainAxisAlignment: "center", crossAxisAlignment: "center" }, /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.Text, { text: chain?.name || "Loading...", fontWeight: "bold", fontSize: 18 }), /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.Container, { height: 30 }), painter ? /* @__PURE__ */ import_react14.default.createElement(
    import_fuickjs14.Container,
    {
      width: 220,
      height: 220,
      alignment: "center",
      decoration: {
        color: "white",
        borderRadius: 10,
        boxShadow: { color: "#0000001A", blurRadius: 10, offset: { dx: 0, dy: 4 } }
      }
    },
    /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.CustomPaint, { painter, size: { width: 220, height: 220 } })
  ) : /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.Container, { width: 220, height: 220, color: "#f0f0f0", alignment: "center" }, /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.Text, { text: "Generating..." })), /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.Container, { height: 30 }), /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.Padding, { padding: { horizontal: 40 } }, /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.Container, { padding: 16, decoration: { color: "#f5f5f5", borderRadius: 8 } }, /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.Text, { text: address || "", textAlign: "center", color: "#333", fontSize: 14 }))), /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.Container, { height: 30 }), /* @__PURE__ */ import_react14.default.createElement(import_fuickjs14.Text, { text: "Scan QR code to receive assets", color: "#888", fontSize: 12 }))));
}

// src/app.ts
var CustomErrorUI = (error) => import_react15.default.createElement(
  import_fuickjs15.Container,
  { color: "#E0F7FA" },
  import_react15.default.createElement(
    import_fuickjs15.Column,
    {
      mainAxisAlignment: "center",
      crossAxisAlignment: "center",
      padding: 30
    },
    import_react15.default.createElement(import_fuickjs15.Text, {
      text: "Oops! Something went wrong",
      fontSize: 22,
      color: "#006064",
      fontWeight: "bold",
      margin: { bottom: 16 }
    }),
    import_react15.default.createElement(
      import_fuickjs15.Container,
      {
        padding: 12,
        decoration: {
          color: "#FFFFFF",
          borderRadius: 8,
          border: { width: 1, color: "#B2EBF2" }
        },
        margin: { bottom: 20 }
      },
      import_react15.default.createElement(import_fuickjs15.Text, {
        text: error?.message || "Unknown Error",
        fontSize: 14,
        color: "#00838F",
        maxLines: 5,
        overflow: "ellipsis"
      })
    ),
    import_react15.default.createElement(import_fuickjs15.Button, {
      text: "Retry",
      onTap: () => console.log("Retry...")
    })
  )
);
function initApp() {
  try {
    import_fuickjs15.Runtime.bindGlobals();
    (0, import_fuickjs15.setGlobalErrorFallback)(CustomErrorUI);
    import_fuickjs15.Router.register("/", (args) => import_react15.default.createElement(BootstrapPage, args));
    import_fuickjs15.Router.register("/wallet/onboarding", (args) => import_react15.default.createElement(OnboardingPage, args));
    import_fuickjs15.Router.register("/wallet/create", (args) => import_react15.default.createElement(CreateWalletPage, args));
    import_fuickjs15.Router.register("/wallet/import", (args) => import_react15.default.createElement(ImportWalletPage, args));
    import_fuickjs15.Router.register("/wallet/home", (args) => import_react15.default.createElement(MainTabsPage, args));
    import_fuickjs15.Router.register("/wallet/list", (args) => import_react15.default.createElement(WalletListPage, args));
    import_fuickjs15.Router.register("/_generic_dialog", (args) => import_react15.default.createElement(import_fuickjs15.GenericPage, args));
    import_fuickjs15.Router.register("/wallet/detail", (args) => import_react15.default.createElement(WalletDetailPage, args));
    import_fuickjs15.Router.register("/wallet/receive", (args) => import_react15.default.createElement(ReceivePage, args));
    import_fuickjs15.Router.register("/wallet/chain_select", (args) => import_react15.default.createElement(ChainSelectPage, args));
    console.log("Wallet App Initialized");
  } catch (e) {
    console.error("Failed to init app", e);
  }
}

// src/index.ts
globalThis.initApp = initApp;
initApp();
