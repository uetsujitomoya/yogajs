(function e (t, n, r) { function s (o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require === 'function' && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = 'MODULE_NOT_FOUND', f } var l = n[o] = {exports: {}}; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n || e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require === 'function' && require; for (var o = 0; o < r.length; o++)s(r[o]); return s })({1: [function (require, module, exports) {

}, {}],
  2: [function (require, module, exports) {
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
    var util = require('util/')

    var pSlice = Array.prototype.slice
    var hasOwn = Object.prototype.hasOwnProperty

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

    var assert = module.exports = ok

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

    assert.AssertionError = function AssertionError (options) {
      this.name = 'AssertionError'
      this.actual = options.actual
      this.expected = options.expected
      this.operator = options.operator
      if (options.message) {
        this.message = options.message
        this.generatedMessage = false
      } else {
        this.message = getMessage(this)
        this.generatedMessage = true
      }
      var stackStartFunction = options.stackStartFunction || fail

      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, stackStartFunction)
      } else {
    // non v8 browsers so we can have a stacktrace
        var err = new Error()
        if (err.stack) {
          var out = err.stack

      // try to strip useless frames
          var fn_name = stackStartFunction.name
          var idx = out.indexOf('\n' + fn_name)
          if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
            var next_line = out.indexOf('\n', idx + 1)
            out = out.substring(next_line + 1)
          }

          this.stack = out
        }
      }
    }

// assert.AssertionError instanceof Error
    util.inherits(assert.AssertionError, Error)

    function replacer (key, value) {
      if (util.isUndefined(value)) {
        return '' + value
      }
      if (util.isNumber(value) && !isFinite(value)) {
        return value.toString()
      }
      if (util.isFunction(value) || util.isRegExp(value)) {
        return value.toString()
      }
      return value
    }

    function truncate (s, n) {
      if (util.isString(s)) {
        return s.length < n ? s : s.slice(0, n)
      } else {
        return s
      }
    }

    function getMessage (self) {
      return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128)
    }

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

    function fail (actual, expected, message, operator, stackStartFunction) {
      throw new assert.AssertionError({
        message: message,
        actual: actual,
        expected: expected,
        operator: operator,
        stackStartFunction: stackStartFunction
      })
    }

// EXTENSION! allows for well behaved errors defined elsewhere.
    assert.fail = fail

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

    function ok (value, message) {
      if (!value) fail(value, true, message, '==', assert.ok)
    }
    assert.ok = ok

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

    assert.equal = function equal (actual, expected, message) {
      if (actual != expected) fail(actual, expected, message, '==', assert.equal)
    }

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

    assert.notEqual = function notEqual (actual, expected, message) {
      if (actual == expected) {
        fail(actual, expected, message, '!=', assert.notEqual)
      }
    }

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

    assert.deepEqual = function deepEqual (actual, expected, message) {
      if (!_deepEqual(actual, expected)) {
        fail(actual, expected, message, 'deepEqual', assert.deepEqual)
      }
    }

    function _deepEqual (actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
      if (actual === expected) {
        return true
      } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
        if (actual.length != expected.length) return false

        for (var i = 0; i < actual.length; i++) {
          if (actual[i] !== expected[i]) return false
        }

        return true

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
      } else if (util.isDate(actual) && util.isDate(expected)) {
        return actual.getTime() === expected.getTime()

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
      } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
        return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
      } else if (!util.isObject(actual) && !util.isObject(expected)) {
        return actual == expected

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
      } else {
        return objEquiv(actual, expected)
      }
    }

    function isArguments (object) {
      return Object.prototype.toString.call(object) == '[object Arguments]'
    }

    function objEquiv (a, b) {
      if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b)) { return false }
  // an identical 'prototype' property.
      if (a.prototype !== b.prototype) return false
  // if one is a primitive, the other must be same
      if (util.isPrimitive(a) || util.isPrimitive(b)) {
        return a === b
      }
      var aIsArgs = isArguments(a),
        bIsArgs = isArguments(b)
      if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs)) { return false }
      if (aIsArgs) {
        a = pSlice.call(a)
        b = pSlice.call(b)
        return _deepEqual(a, b)
      }
      var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
      if (ka.length != kb.length) { return false }
  // the same set of keys (although not necessarily the same order),
      ka.sort()
      kb.sort()
  // ~~~cheap key test
      for (i = ka.length - 1; i >= 0; i--) {
        if (ka[i] != kb[i]) { return false }
      }
  // equivalent values for every corresponding key, and
  // ~~~possibly expensive deep test
      for (i = ka.length - 1; i >= 0; i--) {
        key = ka[i]
        if (!_deepEqual(a[key], b[key])) return false
      }
      return true
    }

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

    assert.notDeepEqual = function notDeepEqual (actual, expected, message) {
      if (_deepEqual(actual, expected)) {
        fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual)
      }
    }

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

    assert.strictEqual = function strictEqual (actual, expected, message) {
      if (actual !== expected) {
        fail(actual, expected, message, '===', assert.strictEqual)
      }
    }

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

    assert.notStrictEqual = function notStrictEqual (actual, expected, message) {
      if (actual === expected) {
        fail(actual, expected, message, '!==', assert.notStrictEqual)
      }
    }

    function expectedException (actual, expected) {
      if (!actual || !expected) {
        return false
      }

      if (Object.prototype.toString.call(expected) == '[object RegExp]') {
        return expected.test(actual)
      } else if (actual instanceof expected) {
        return true
      } else if (expected.call({}, actual) === true) {
        return true
      }

      return false
    }

    function _throws (shouldThrow, block, expected, message) {
      var actual

      if (util.isString(expected)) {
        message = expected
        expected = null
      }

      try {
        block()
      } catch (e) {
        actual = e
      }

      message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.')

      if (shouldThrow && !actual) {
        fail(actual, expected, 'Missing expected exception' + message)
      }

      if (!shouldThrow && expectedException(actual, expected)) {
        fail(actual, expected, 'Got unwanted exception' + message)
      }

      if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
        throw actual
      }
    }

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

    assert.throws = function (block, /* optional */error, /* optional */message) {
      _throws.apply(this, [true].concat(pSlice.call(arguments)))
    }

// EXTENSION! This is annoying to write outside this module.
    assert.doesNotThrow = function (block, /* optional */message) {
      _throws.apply(this, [false].concat(pSlice.call(arguments)))
    }

    assert.ifError = function (err) { if (err) { throw err } }

    var objectKeys = Object.keys || function (obj) {
      var keys = []
      for (var key in obj) {
        if (hasOwn.call(obj, key)) keys.push(key)
      }
      return keys
    }
  }, {'util/': 35}],
  3: [function (require, module, exports) {
    arguments[4][1][0].apply(exports, arguments)
  }, {'dup': 1}],
  4: [function (require, module, exports) {
    'use strict'

    var TYPED_OK = (typeof Uint8Array !== 'undefined') &&
                (typeof Uint16Array !== 'undefined') &&
                (typeof Int32Array !== 'undefined')

    exports.assign = function (obj /* from1, from2, from3, ... */) {
      var sources = Array.prototype.slice.call(arguments, 1)
      while (sources.length) {
        var source = sources.shift()
        if (!source) { continue }

        if (typeof source !== 'object') {
          throw new TypeError(source + 'must be non-object')
        }

        for (var p in source) {
          if (source.hasOwnProperty(p)) {
            obj[p] = source[p]
          }
        }
      }

      return obj
    }

// reduce buffer size, avoiding mem copy
    exports.shrinkBuf = function (buf, size) {
      if (buf.length === size) { return buf }
      if (buf.subarray) { return buf.subarray(0, size) }
      buf.length = size
      return buf
    }

    var fnTyped = {
      arraySet: function (dest, src, src_offs, len, dest_offs) {
        if (src.subarray && dest.subarray) {
          dest.set(src.subarray(src_offs, src_offs + len), dest_offs)
          return
        }
    // Fallback to ordinary array
        for (var i = 0; i < len; i++) {
          dest[dest_offs + i] = src[src_offs + i]
        }
      },
  // Join array of chunks to single array.
      flattenChunks: function (chunks) {
        var i, l, len, pos, chunk, result

    // calculate data length
        len = 0
        for (i = 0, l = chunks.length; i < l; i++) {
          len += chunks[i].length
        }

    // join chunks
        result = new Uint8Array(len)
        pos = 0
        for (i = 0, l = chunks.length; i < l; i++) {
          chunk = chunks[i]
          result.set(chunk, pos)
          pos += chunk.length
        }

        return result
      }
    }

    var fnUntyped = {
      arraySet: function (dest, src, src_offs, len, dest_offs) {
        for (var i = 0; i < len; i++) {
          dest[dest_offs + i] = src[src_offs + i]
        }
      },
  // Join array of chunks to single array.
      flattenChunks: function (chunks) {
        return [].concat.apply([], chunks)
      }
    }

// Enable/Disable typed arrays use, for testing
//
    exports.setTyped = function (on) {
      if (on) {
        exports.Buf8 = Uint8Array
        exports.Buf16 = Uint16Array
        exports.Buf32 = Int32Array
        exports.assign(exports, fnTyped)
      } else {
        exports.Buf8 = Array
        exports.Buf16 = Array
        exports.Buf32 = Array
        exports.assign(exports, fnUntyped)
      }
    }

    exports.setTyped(TYPED_OK)
  }, {}],
  5: [function (require, module, exports) {
    'use strict'

// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It doesn't worth to make additional optimizationa as in original.
// Small size is preferable.

    function adler32 (adler, buf, len, pos) {
      var s1 = (adler & 0xffff) | 0,
        s2 = ((adler >>> 16) & 0xffff) | 0,
        n = 0

      while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
        n = len > 2000 ? 2000 : len
        len -= n

        do {
          s1 = (s1 + buf[pos++]) | 0
          s2 = (s2 + s1) | 0
        } while (--n)

        s1 %= 65521
        s2 %= 65521
      }

      return (s1 | (s2 << 16)) | 0
    }

    module.exports = adler32
  }, {}],
  6: [function (require, module, exports) {
    module.exports = {

  /* Allowed flush values; see deflate() and inflate() below for details */
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_TREES: 6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
  // Z_MEM_ERROR:     -4,
      Z_BUF_ERROR: -5,
  // Z_VERSION_ERROR: -6,

  /* compression levels */
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,

      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,

  /* Possible values of the data_type field (though see inflate()) */
      Z_BINARY: 0,
      Z_TEXT: 1,
  // Z_ASCII:                1, // = Z_TEXT (deprecated)
      Z_UNKNOWN: 2,

  /* The deflate compression method */
      Z_DEFLATED: 8
  // Z_NULL:                 null // Use -1 or null inline, depending on var type
    }
  }, {}],
  7: [function (require, module, exports) {
    'use strict'

// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.

// Use ordinary array, since untyped makes no boost here
    function makeTable () {
      var c, table = []

      for (var n = 0; n < 256; n++) {
        c = n
        for (var k = 0; k < 8; k++) {
          c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1))
        }
        table[n] = c
      }

      return table
    }

// Create table on load. Just 255 signed longs. Not a problem.
    var crcTable = makeTable()

    function crc32 (crc, buf, len, pos) {
      var t = crcTable,
        end = pos + len

      crc = crc ^ (-1)

      for (var i = pos; i < end; i++) {
        crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF]
      }

      return (crc ^ (-1)) // >>> 0;
    }

    module.exports = crc32
  }, {}],
  8: [function (require, module, exports) {
    'use strict'

    var utils = require('../utils/common')
    var trees = require('./trees')
    var adler32 = require('./adler32')
    var crc32 = require('./crc32')
    var msg = require('./messages')

/* Public constants ========================================================== */
/* =========================================================================== */

/* Allowed flush values; see deflate() and inflate() below for details */
    var Z_NO_FLUSH = 0
    var Z_PARTIAL_FLUSH = 1
// var Z_SYNC_FLUSH    = 2;
    var Z_FULL_FLUSH = 3
    var Z_FINISH = 4
    var Z_BLOCK = 5
// var Z_TREES         = 6;

/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
    var Z_OK = 0
    var Z_STREAM_END = 1
// var Z_NEED_DICT     = 2;
// var Z_ERRNO         = -1;
    var Z_STREAM_ERROR = -2
    var Z_DATA_ERROR = -3
// var Z_MEM_ERROR     = -4;
    var Z_BUF_ERROR = -5
// var Z_VERSION_ERROR = -6;

/* compression levels */
// var Z_NO_COMPRESSION      = 0;
// var Z_BEST_SPEED          = 1;
// var Z_BEST_COMPRESSION    = 9;
    var Z_DEFAULT_COMPRESSION = -1

    var Z_FILTERED = 1
    var Z_HUFFMAN_ONLY = 2
    var Z_RLE = 3
    var Z_FIXED = 4
    var Z_DEFAULT_STRATEGY = 0

/* Possible values of the data_type field (though see inflate()) */
// var Z_BINARY              = 0;
// var Z_TEXT                = 1;
// var Z_ASCII               = 1; // = Z_TEXT
    var Z_UNKNOWN = 2

/* The deflate compression method */
    var Z_DEFLATED = 8

/* ============================================================================ */

    var MAX_MEM_LEVEL = 9
/* Maximum value for memLevel in deflateInit2 */
    var MAX_WBITS = 15
/* 32K LZ77 window */
    var DEF_MEM_LEVEL = 8

    var LENGTH_CODES = 29
/* number of length codes, not counting the special END_BLOCK code */
    var LITERALS = 256
/* number of literal bytes 0..255 */
    var L_CODES = LITERALS + 1 + LENGTH_CODES
/* number of Literal or Length codes, including the END_BLOCK code */
    var D_CODES = 30
/* number of distance codes */
    var BL_CODES = 19
/* number of codes used to transfer the bit lengths */
    var HEAP_SIZE = 2 * L_CODES + 1
/* maximum heap size */
    var MAX_BITS = 15
/* All codes must not exceed MAX_BITS bits */

    var MIN_MATCH = 3
    var MAX_MATCH = 258
    var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1)

    var PRESET_DICT = 0x20

    var INIT_STATE = 42
    var EXTRA_STATE = 69
    var NAME_STATE = 73
    var COMMENT_STATE = 91
    var HCRC_STATE = 103
    var BUSY_STATE = 113
    var FINISH_STATE = 666

    var BS_NEED_MORE = 1 /* block not completed, need more input or more output */
    var BS_BLOCK_DONE = 2 /* block flush performed */
    var BS_FINISH_STARTED = 3 /* finish started, need only more output at next deflate */
    var BS_FINISH_DONE = 4 /* finish done, accept no more input or output */

    var OS_CODE = 0x03 // Unix :) . Don't detect, use this default.

    function err (strm, errorCode) {
      strm.msg = msg[errorCode]
      return errorCode
    }

    function rank (f) {
      return ((f) << 1) - ((f) > 4 ? 9 : 0)
    }

    function zero (buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0 } }

/* =========================================================================
 * Flush as much pending output as possible. All deflate() output goes
 * through this function so some applications may wish to modify it
 * to avoid allocating a large strm->output buffer and copying into it.
 * (See also read_buf()).
 */
    function flush_pending (strm) {
      var s = strm.state

  // _tr_flush_bits(s);
      var len = s.pending
      if (len > strm.avail_out) {
        len = strm.avail_out
      }
      if (len === 0) { return }

      utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out)
      strm.next_out += len
      s.pending_out += len
      strm.total_out += len
      strm.avail_out -= len
      s.pending -= len
      if (s.pending === 0) {
        s.pending_out = 0
      }
    }

    function flush_block_only (s, last) {
      trees._tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last)
      s.block_start = s.strstart
      flush_pending(s.strm)
    }

    function put_byte (s, b) {
      s.pending_buf[s.pending++] = b
    }

/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
    function putShortMSB (s, b) {
//  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
      s.pending_buf[s.pending++] = (b >>> 8) & 0xff
      s.pending_buf[s.pending++] = b & 0xff
    }

/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
    function read_buf (strm, buf, start, size) {
      var len = strm.avail_in

      if (len > size) { len = size }
      if (len === 0) { return 0 }

      strm.avail_in -= len

      utils.arraySet(buf, strm.input, strm.next_in, len, start)
      if (strm.state.wrap === 1) {
        strm.adler = adler32(strm.adler, buf, len, start)
      } else if (strm.state.wrap === 2) {
        strm.adler = crc32(strm.adler, buf, len, start)
      }

      strm.next_in += len
      strm.total_in += len

      return len
    }

/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
    function longest_match (s, cur_match) {
      var chain_length = s.max_chain_length      /* max hash chain length */
      var scan = s.strstart /* current string */
      var match                       /* matched string */
      var len                           /* length of current match */
      var best_len = s.prev_length              /* best match length so far */
      var nice_match = s.nice_match             /* stop if match long enough */
      var limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD))
      ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/* NIL */

      var _win = s.window // shortcut

      var wmask = s.w_mask
      var prev = s.prev

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

      var strend = s.strstart + MAX_MATCH
      var scan_end1 = _win[scan + best_len - 1]
      var scan_end = _win[scan + best_len]

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
      if (s.prev_length >= s.good_match) {
        chain_length >>= 2
      }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
      if (nice_match > s.lookahead) { nice_match = s.lookahead }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

      do {
    // Assert(cur_match < s->strstart, "no future");
        match = cur_match

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

        if (_win[match + best_len] !== scan_end ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match] !== _win[scan] ||
        _win[++match] !== _win[scan + 1]) {
          continue
        }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
        scan += 2
        match++
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
        do {
      /* jshint noempty:false */
        } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend)

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

        len = MAX_MATCH - (strend - scan)
        scan = strend - MAX_MATCH

        if (len > best_len) {
          s.match_start = cur_match
          best_len = len
          if (len >= nice_match) {
            break
          }
          scan_end1 = _win[scan + best_len - 1]
          scan_end = _win[scan + best_len]
        }
      } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0)

      if (best_len <= s.lookahead) {
        return best_len
      }
      return s.lookahead
    }

/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
    function fill_window (s) {
      var _w_size = s.w_size
      var p, n, m, more, str

  // Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

      do {
        more = s.window_size - s.lookahead - s.strstart

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    // if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    // }

    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
        if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
          utils.arraySet(s.window, s.window, _w_size, _w_size, 0)
          s.match_start -= _w_size
          s.strstart -= _w_size
      /* we now have strstart >= MAX_DIST */
          s.block_start -= _w_size

      /* Slide the hash table (could be avoided with 32 bit values
       at the expense of memory usage). We slide even when level == 0
       to keep the hash table consistent if we switch back to level > 0
       later. (Using level 0 permanently is not an optimal usage of
       zlib, so we don't care about this pathological case.)
       */

          n = s.hash_size
          p = n
          do {
            m = s.head[--p]
            s.head[p] = (m >= _w_size ? m - _w_size : 0)
          } while (--n)

          n = _w_size
          p = n
          do {
            m = s.prev[--p]
            s.prev[p] = (m >= _w_size ? m - _w_size : 0)
        /* If n is not on any hash chain, prev[n] is garbage but
         * its value will never be used.
         */
          } while (--n)

          more += _w_size
        }
        if (s.strm.avail_in === 0) {
          break
        }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    // Assert(more >= 2, "more < 2");
        n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more)
        s.lookahead += n

    /* Initialize the hash value now that we have some input: */
        if (s.lookahead + s.insert >= MIN_MATCH) {
          str = s.strstart - s.insert
          s.ins_h = s.window[str]

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask
// #if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
// #endif
          while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
            s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask

            s.prev[str & s.w_mask] = s.head[s.ins_h]
            s.head[s.ins_h] = str
            str++
            s.insert--
            if (s.lookahead + s.insert < MIN_MATCH) {
              break
            }
          }
        }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */
      } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0)

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    var curr = s.strstart + s.lookahead;
//    var init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
    }

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 * This function does not insert new strings in the dictionary since
 * uncompressible data is probably not useful. This function is used
 * only for the level=0 compression option.
 * NOTE: this function should be optimized to avoid extra copying from
 * window to pending_buf.
 */
    function deflate_stored (s, flush) {
  /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
   * to pending_buf_size, and each stored block has a 5 byte header:
   */
      var max_block_size = 0xffff

      if (max_block_size > s.pending_buf_size - 5) {
        max_block_size = s.pending_buf_size - 5
      }

  /* Copy as much as possible from input to output: */
      for (;;) {
    /* Fill the window as much as possible: */
        if (s.lookahead <= 1) {
      // Assert(s->strstart < s->w_size+MAX_DIST(s) ||
      //  s->block_start >= (long)s->w_size, "slide too late");
//      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
//        s.block_start >= s.w_size)) {
//        throw  new Error("slide too late");
//      }

          fill_window(s)
          if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE
          }

          if (s.lookahead === 0) {
            break
          }
      /* flush the current block */
        }
    // Assert(s->block_start >= 0L, "block gone");
//    if (s.block_start < 0) throw new Error("block gone");

        s.strstart += s.lookahead
        s.lookahead = 0

    /* Emit a stored block if pending_buf will be full: */
        var max_start = s.block_start + max_block_size

        if (s.strstart === 0 || s.strstart >= max_start) {
      /* strstart == 0 is possible when wraparound on 16-bit machine */
          s.lookahead = s.strstart - max_start
          s.strstart = max_start
      /** * FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false)
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE
          }
      /***/
        }
    /* Flush if we may have to slide, otherwise block_start may become
     * negative and the data will be gone:
     */
        if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
      /** * FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false)
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE
          }
      /***/
        }
      }

      s.insert = 0

      if (flush === Z_FINISH) {
    /** * FLUSH_BLOCK(s, 1); ***/
        flush_block_only(s, true)
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED
        }
    /***/
        return BS_FINISH_DONE
      }

      if (s.strstart > s.block_start) {
    /** * FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false)
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE
        }
    /***/
      }

      return BS_NEED_MORE
    }

/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
    function deflate_fast (s, flush) {
      var hash_head        /* head of the hash chain */
      var bflush           /* set if current block must be flushed */

      for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s)
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE
          }
          if (s.lookahead === 0) {
            break /* flush the current block */
          }
        }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
        hash_head = 0/* NIL */
        if (s.lookahead >= MIN_MATCH) {
      /** * INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]
          s.head[s.ins_h] = s.strstart
      /***/
        }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
        if (hash_head !== 0/* NIL */ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
          s.match_length = longest_match(s, hash_head)
      /* longest_match() sets match_start */
        }
        if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /** * _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
          bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH)

          s.lookahead -= s.match_length

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
          if (s.match_length <= s.max_lazy_match/* max_insert_length */ && s.lookahead >= MIN_MATCH) {
            s.match_length-- /* string at strstart already in table */
            do {
              s.strstart++
          /** * INSERT_STRING(s, s.strstart, hash_head); ***/
              s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask
              hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]
              s.head[s.ins_h] = s.strstart
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
            } while (--s.match_length !== 0)
            s.strstart++
          } else {
            s.strstart += s.match_length
            s.match_length = 0
            s.ins_h = s.window[s.strstart]
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
            s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask

// #if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
// #endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
          }
        } else {
      /* No match, output a literal byte */
      // Tracevv((stderr,"%c", s.window[s.strstart]));
      /** * _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
          bflush = trees._tr_tally(s, 0, s.window[s.strstart])

          s.lookahead--
          s.strstart++
        }
        if (bflush) {
      /** * FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false)
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE
          }
      /***/
        }
      }
      s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1)
      if (flush === Z_FINISH) {
    /** * FLUSH_BLOCK(s, 1); ***/
        flush_block_only(s, true)
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED
        }
    /***/
        return BS_FINISH_DONE
      }
      if (s.last_lit) {
    /** * FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false)
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE
        }
    /***/
      }
      return BS_BLOCK_DONE
    }

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
    function deflate_slow (s, flush) {
      var hash_head          /* head of hash chain */
      var bflush              /* set if current block must be flushed */

      var max_insert

  /* Process the input block. */
      for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s)
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE
          }
          if (s.lookahead === 0) { break } /* flush the current block */
        }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
        hash_head = 0/* NIL */
        if (s.lookahead >= MIN_MATCH) {
      /** * INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]
          s.head[s.ins_h] = s.strstart
      /***/
        }

    /* Find the longest match, discarding those <= prev_length.
     */
        s.prev_length = s.match_length
        s.prev_match = s.match_start
        s.match_length = MIN_MATCH - 1

        if (hash_head !== 0/* NIL */ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/* MAX_DIST(s) */) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
          s.match_length = longest_match(s, hash_head)
      /* longest_match() sets match_start */

          if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/* TOO_FAR */))) {
        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
            s.match_length = MIN_MATCH - 1
          }
        }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
        if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
          max_insert = s.strstart + s.lookahead - MIN_MATCH
      /* Do not insert strings in hash table beyond this. */

      // check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /** *_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
          bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH)
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
          s.lookahead -= s.prev_length - 1
          s.prev_length -= 2
          do {
            if (++s.strstart <= max_insert) {
          /** * INSERT_STRING(s, s.strstart, hash_head); ***/
              s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask
              hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]
              s.head[s.ins_h] = s.strstart
          /***/
            }
          } while (--s.prev_length !== 0)
          s.match_available = 0
          s.match_length = MIN_MATCH - 1
          s.strstart++

          if (bflush) {
        /** * FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false)
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE
            }
        /***/
          }
        } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      // Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /** * _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
          bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1])

          if (bflush) {
        /** * FLUSH_BLOCK_ONLY(s, 0) ***/
            flush_block_only(s, false)
        /***/
          }
          s.strstart++
          s.lookahead--
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE
          }
        } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
          s.match_available = 1
          s.strstart++
          s.lookahead--
        }
      }
  // Assert (flush != Z_NO_FLUSH, "no flush?");
      if (s.match_available) {
    // Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /** * _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
        bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1])

        s.match_available = 0
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1
      if (flush === Z_FINISH) {
    /** * FLUSH_BLOCK(s, 1); ***/
        flush_block_only(s, true)
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED
        }
    /***/
        return BS_FINISH_DONE
      }
      if (s.last_lit) {
    /** * FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false)
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE
        }
    /***/
      }

      return BS_BLOCK_DONE
    }

/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
    function deflate_rle (s, flush) {
      var bflush            /* set if current block must be flushed */
      var prev              /* byte at distance one to match */
      var scan, strend      /* scan goes up to strend for length of run */

      var _win = s.window

      for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
        if (s.lookahead <= MAX_MATCH) {
          fill_window(s)
          if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE
          }
          if (s.lookahead === 0) { break } /* flush the current block */
        }

    /* See how many times the previous byte repeats */
        s.match_length = 0
        if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
          scan = s.strstart - 1
          prev = _win[scan]
          if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
            strend = s.strstart + MAX_MATCH
            do {
          /* jshint noempty:false */
            } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend)
            s.match_length = MAX_MATCH - (strend - scan)
            if (s.match_length > s.lookahead) {
              s.match_length = s.lookahead
            }
          }
      // Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
        }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
        if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /** * _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
          bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH)

          s.lookahead -= s.match_length
          s.strstart += s.match_length
          s.match_length = 0
        } else {
      /* No match, output a literal byte */
      // Tracevv((stderr,"%c", s->window[s->strstart]));
      /** * _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
          bflush = trees._tr_tally(s, 0, s.window[s.strstart])

          s.lookahead--
          s.strstart++
        }
        if (bflush) {
      /** * FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false)
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE
          }
      /***/
        }
      }
      s.insert = 0
      if (flush === Z_FINISH) {
    /** * FLUSH_BLOCK(s, 1); ***/
        flush_block_only(s, true)
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED
        }
    /***/
        return BS_FINISH_DONE
      }
      if (s.last_lit) {
    /** * FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false)
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE
        }
    /***/
      }
      return BS_BLOCK_DONE
    }

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
    function deflate_huff (s, flush) {
      var bflush             /* set if current block must be flushed */

      for (;;) {
    /* Make sure that we have a literal to write. */
        if (s.lookahead === 0) {
          fill_window(s)
          if (s.lookahead === 0) {
            if (flush === Z_NO_FLUSH) {
              return BS_NEED_MORE
            }
            break      /* flush the current block */
          }
        }

    /* Output a literal byte */
        s.match_length = 0
    // Tracevv((stderr,"%c", s->window[s->strstart]));
    /** * _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
        bflush = trees._tr_tally(s, 0, s.window[s.strstart])
        s.lookahead--
        s.strstart++
        if (bflush) {
      /** * FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false)
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE
          }
      /***/
        }
      }
      s.insert = 0
      if (flush === Z_FINISH) {
    /** * FLUSH_BLOCK(s, 1); ***/
        flush_block_only(s, true)
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED
        }
    /***/
        return BS_FINISH_DONE
      }
      if (s.last_lit) {
    /** * FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false)
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE
        }
    /***/
      }
      return BS_BLOCK_DONE
    }

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
    var Config = function (good_length, max_lazy, nice_length, max_chain, func) {
      this.good_length = good_length
      this.max_lazy = max_lazy
      this.nice_length = nice_length
      this.max_chain = max_chain
      this.func = func
    }

    var configuration_table

    configuration_table = [
  /*      good lazy nice chain */
      new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
      new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
      new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
      new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

      new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
      new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
      new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
      new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
      new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
      new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
    ]

/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
    function lm_init (s) {
      s.window_size = 2 * s.w_size

  /** * CLEAR_HASH(s); ***/
      zero(s.head) // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
      s.max_lazy_match = configuration_table[s.level].max_lazy
      s.good_match = configuration_table[s.level].good_length
      s.nice_match = configuration_table[s.level].nice_length
      s.max_chain_length = configuration_table[s.level].max_chain

      s.strstart = 0
      s.block_start = 0
      s.lookahead = 0
      s.insert = 0
      s.match_length = s.prev_length = MIN_MATCH - 1
      s.match_available = 0
      s.ins_h = 0
    }

    function DeflateState () {
      this.strm = null            /* pointer back to this zlib stream */
      this.status = 0            /* as the name implies */
      this.pending_buf = null      /* output still pending */
      this.pending_buf_size = 0  /* size of pending_buf */
      this.pending_out = 0       /* next pending byte to output to the stream */
      this.pending = 0           /* nb of bytes in the pending buffer */
      this.wrap = 0              /* bit 0 true for zlib, bit 1 true for gzip */
      this.gzhead = null         /* gzip header information to write */
      this.gzindex = 0           /* where in extra, name, or comment */
      this.method = Z_DEFLATED /* can only be DEFLATED */
      this.last_flush = -1   /* value of flush param for previous deflate call */

      this.w_size = 0  /* LZ77 window size (32K by default) */
      this.w_bits = 0  /* log2(w_size)  (8..16) */
      this.w_mask = 0  /* w_size - 1 */

      this.window = null
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

      this.window_size = 0
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

      this.prev = null
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

      this.head = null   /* Heads of the hash chains or NIL. */

      this.ins_h = 0       /* hash index of string to be inserted */
      this.hash_size = 0   /* number of elements in hash table */
      this.hash_bits = 0   /* log2(hash_size) */
      this.hash_mask = 0   /* hash_size-1 */

      this.hash_shift = 0
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

      this.block_start = 0
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

      this.match_length = 0      /* length of best match */
      this.prev_match = 0        /* previous match */
      this.match_available = 0   /* set if previous match exists */
      this.strstart = 0          /* start of string to insert */
      this.match_start = 0       /* start of matching string */
      this.lookahead = 0         /* number of valid bytes ahead in window */

      this.prev_length = 0
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

      this.max_chain_length = 0
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

      this.max_lazy_match = 0
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  // this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

      this.level = 0     /* compression level (1..9) */
      this.strategy = 0  /* favor or force Huffman coding */

      this.good_match = 0
  /* Use a faster search when the previous match is longer than this */

      this.nice_match = 0 /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
      this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2)
      this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2)
      this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2)
      zero(this.dyn_ltree)
      zero(this.dyn_dtree)
      zero(this.bl_tree)

      this.l_desc = null         /* desc. for literal tree */
      this.d_desc = null         /* desc. for distance tree */
      this.bl_desc = null         /* desc. for bit length tree */

  // ush bl_count[MAX_BITS+1];
      this.bl_count = new utils.Buf16(MAX_BITS + 1)
  /* number of codes at each bit length for an optimal tree */

  // int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
      this.heap = new utils.Buf16(2 * L_CODES + 1)  /* heap used to build the Huffman trees */
      zero(this.heap)

      this.heap_len = 0               /* number of elements in the heap */
      this.heap_max = 0               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

      this.depth = new utils.Buf16(2 * L_CODES + 1) // uch depth[2*L_CODES+1];
      zero(this.depth)
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

      this.l_buf = 0          /* buffer index for literals or lengths */

      this.lit_bufsize = 0
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

      this.last_lit = 0      /* running index in l_buf */

      this.d_buf = 0
  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */

      this.opt_len = 0       /* bit length of current block with optimal trees */
      this.static_len = 0    /* bit length of current block with static trees */
      this.matches = 0       /* number of string matches in current block */
      this.insert = 0        /* bytes at end of window left to insert */

      this.bi_buf = 0
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
      this.bi_valid = 0
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  // this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
    }

    function deflateResetKeep (strm) {
      var s

      if (!strm || !strm.state) {
        return err(strm, Z_STREAM_ERROR)
      }

      strm.total_in = strm.total_out = 0
      strm.data_type = Z_UNKNOWN

      s = strm.state
      s.pending = 0
      s.pending_out = 0

      if (s.wrap < 0) {
        s.wrap = -s.wrap
    /* was made negative by deflate(..., Z_FINISH); */
      }
      s.status = (s.wrap ? INIT_STATE : BUSY_STATE)
      strm.adler = (s.wrap === 2)
    ? 0  // crc32(0, Z_NULL, 0)
  : 1 // adler32(0, Z_NULL, 0)
      s.last_flush = Z_NO_FLUSH
      trees._tr_init(s)
      return Z_OK
    }

    function deflateReset (strm) {
      var ret = deflateResetKeep(strm)
      if (ret === Z_OK) {
        lm_init(strm.state)
      }
      return ret
    }

    function deflateSetHeader (strm, head) {
      if (!strm || !strm.state) { return Z_STREAM_ERROR }
      if (strm.state.wrap !== 2) { return Z_STREAM_ERROR }
      strm.state.gzhead = head
      return Z_OK
    }

    function deflateInit2 (strm, level, method, windowBits, memLevel, strategy) {
      if (!strm) { // === Z_NULL
        return Z_STREAM_ERROR
      }
      var wrap = 1

      if (level === Z_DEFAULT_COMPRESSION) {
        level = 6
      }

      if (windowBits < 0) { /* suppress zlib wrapper */
        wrap = 0
        windowBits = -windowBits
      } else if (windowBits > 15) {
        wrap = 2           /* write gzip wrapper instead */
        windowBits -= 16
      }

      if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED) {
        return err(strm, Z_STREAM_ERROR)
      }

      if (windowBits === 8) {
        windowBits = 9
      }
  /* until 256-byte window bug fixed */

      var s = new DeflateState()

      strm.state = s
      s.strm = strm

      s.wrap = wrap
      s.gzhead = null
      s.w_bits = windowBits
      s.w_size = 1 << s.w_bits
      s.w_mask = s.w_size - 1

      s.hash_bits = memLevel + 7
      s.hash_size = 1 << s.hash_bits
      s.hash_mask = s.hash_size - 1
      s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH)

      s.window = new utils.Buf8(s.w_size * 2)
      s.head = new utils.Buf16(s.hash_size)
      s.prev = new utils.Buf16(s.w_size)

  // Don't need mem init magic for JS.
  // s.high_water = 0;  /* nothing written to s->window yet */

      s.lit_bufsize = 1 << (memLevel + 6) /* 16K elements by default */

      s.pending_buf_size = s.lit_bufsize * 4
      s.pending_buf = new utils.Buf8(s.pending_buf_size)

      s.d_buf = s.lit_bufsize >> 1
      s.l_buf = (1 + 2) * s.lit_bufsize

      s.level = level
      s.strategy = strategy
      s.method = method

      return deflateReset(strm)
    }

    function deflateInit (strm, level) {
      return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY)
    }

    function deflate (strm, flush) {
      var old_flush, s
      var beg, val // for gzip header write only

      if (!strm || !strm.state ||
    flush > Z_BLOCK || flush < 0) {
        return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR
      }

      s = strm.state

      if (!strm.output ||
      (!strm.input && strm.avail_in !== 0) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH)) {
        return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR)
      }

      s.strm = strm /* just in case */
      old_flush = s.last_flush
      s.last_flush = flush

  /* Write the header */
      if (s.status === INIT_STATE) {
        if (s.wrap === 2) { // GZIP header
          strm.adler = 0  // crc32(0L, Z_NULL, 0);
          put_byte(s, 31)
          put_byte(s, 139)
          put_byte(s, 8)
          if (!s.gzhead) { // s->gzhead == Z_NULL
            put_byte(s, 0)
            put_byte(s, 0)
            put_byte(s, 0)
            put_byte(s, 0)
            put_byte(s, 0)
            put_byte(s, s.level === 9 ? 2
                    : (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2
                     ? 4 : 0))
            put_byte(s, OS_CODE)
            s.status = BUSY_STATE
          } else {
            put_byte(s, (s.gzhead.text ? 1 : 0) +
                    (s.gzhead.hcrc ? 2 : 0) +
                    (!s.gzhead.extra ? 0 : 4) +
                    (!s.gzhead.name ? 0 : 8) +
                    (!s.gzhead.comment ? 0 : 16)
                )
            put_byte(s, s.gzhead.time & 0xff)
            put_byte(s, (s.gzhead.time >> 8) & 0xff)
            put_byte(s, (s.gzhead.time >> 16) & 0xff)
            put_byte(s, (s.gzhead.time >> 24) & 0xff)
            put_byte(s, s.level === 9 ? 2
                    : (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2
                     ? 4 : 0))
            put_byte(s, s.gzhead.os & 0xff)
            if (s.gzhead.extra && s.gzhead.extra.length) {
              put_byte(s, s.gzhead.extra.length & 0xff)
              put_byte(s, (s.gzhead.extra.length >> 8) & 0xff)
            }
            if (s.gzhead.hcrc) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0)
            }
            s.gzindex = 0
            s.status = EXTRA_STATE
          }
        } else // DEFLATE header
    {
          var header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8
          var level_flags = -1

          if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
            level_flags = 0
          } else if (s.level < 6) {
            level_flags = 1
          } else if (s.level === 6) {
            level_flags = 2
          } else {
            level_flags = 3
          }
          header |= (level_flags << 6)
          if (s.strstart !== 0) { header |= PRESET_DICT }
          header += 31 - (header % 31)

          s.status = BUSY_STATE
          putShortMSB(s, header)

      /* Save the adler32 of the preset dictionary: */
          if (s.strstart !== 0) {
            putShortMSB(s, strm.adler >>> 16)
            putShortMSB(s, strm.adler & 0xffff)
          }
          strm.adler = 1 // adler32(0L, Z_NULL, 0);
        }
      }

// #ifdef GZIP
      if (s.status === EXTRA_STATE) {
        if (s.gzhead.extra/* != Z_NULL */) {
          beg = s.pending  /* start of bytes to update crc */

          while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
              }
              flush_pending(strm)
              beg = s.pending
              if (s.pending === s.pending_buf_size) {
                break
              }
            }
            put_byte(s, s.gzhead.extra[s.gzindex] & 0xff)
            s.gzindex++
          }
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
          }
          if (s.gzindex === s.gzhead.extra.length) {
            s.gzindex = 0
            s.status = NAME_STATE
          }
        } else {
          s.status = NAME_STATE
        }
      }
      if (s.status === NAME_STATE) {
        if (s.gzhead.name/* != Z_NULL */) {
          beg = s.pending  /* start of bytes to update crc */
      // int val;

          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
              }
              flush_pending(strm)
              beg = s.pending
              if (s.pending === s.pending_buf_size) {
                val = 1
                break
              }
            }
        // JS specific: little magic to add zero terminator to end of string
            if (s.gzindex < s.gzhead.name.length) {
              val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff
            } else {
              val = 0
            }
            put_byte(s, val)
          } while (val !== 0)

          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
          }
          if (val === 0) {
            s.gzindex = 0
            s.status = COMMENT_STATE
          }
        } else {
          s.status = COMMENT_STATE
        }
      }
      if (s.status === COMMENT_STATE) {
        if (s.gzhead.comment/* != Z_NULL */) {
          beg = s.pending  /* start of bytes to update crc */
      // int val;

          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
              }
              flush_pending(strm)
              beg = s.pending
              if (s.pending === s.pending_buf_size) {
                val = 1
                break
              }
            }
        // JS specific: little magic to add zero terminator to end of string
            if (s.gzindex < s.gzhead.comment.length) {
              val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff
            } else {
              val = 0
            }
            put_byte(s, val)
          } while (val !== 0)

          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
          }
          if (val === 0) {
            s.status = HCRC_STATE
          }
        } else {
          s.status = HCRC_STATE
        }
      }
      if (s.status === HCRC_STATE) {
        if (s.gzhead.hcrc) {
          if (s.pending + 2 > s.pending_buf_size) {
            flush_pending(strm)
          }
          if (s.pending + 2 <= s.pending_buf_size) {
            put_byte(s, strm.adler & 0xff)
            put_byte(s, (strm.adler >> 8) & 0xff)
            strm.adler = 0 // crc32(0L, Z_NULL, 0);
            s.status = BUSY_STATE
          }
        } else {
          s.status = BUSY_STATE
        }
      }
// #endif

  /* Flush as much pending output as possible */
      if (s.pending !== 0) {
        flush_pending(strm)
        if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
          s.last_flush = -1
          return Z_OK
        }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
      } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH) {
        return err(strm, Z_BUF_ERROR)
      }

  /* User must not provide more input after the first FINISH: */
      if (s.status === FINISH_STATE && strm.avail_in !== 0) {
        return err(strm, Z_BUF_ERROR)
      }

  /* Start a new block or continue the current one.
   */
      if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
        var bstate = (s.strategy === Z_HUFFMAN_ONLY) ? deflate_huff(s, flush)
      : (s.strategy === Z_RLE ? deflate_rle(s, flush)
        : configuration_table[s.level].func(s, flush))

        if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
          s.status = FINISH_STATE
        }
        if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
          if (strm.avail_out === 0) {
            s.last_flush = -1
        /* avoid BUF_ERROR next call, see above */
          }
          return Z_OK
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
        }
        if (bstate === BS_BLOCK_DONE) {
          if (flush === Z_PARTIAL_FLUSH) {
            trees._tr_align(s)
          } else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */
            trees._tr_stored_block(s, 0, 0, false)
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
            if (flush === Z_FULL_FLUSH) {
          /** * CLEAR_HASH(s); ***/             /* forget history */
              zero(s.head) // Fill with NIL (= 0);

              if (s.lookahead === 0) {
                s.strstart = 0
                s.block_start = 0
                s.insert = 0
              }
            }
          }
          flush_pending(strm)
          if (strm.avail_out === 0) {
            s.last_flush = -1 /* avoid BUF_ERROR at next call, see above */
            return Z_OK
          }
        }
      }
  // Assert(strm->avail_out > 0, "bug2");
  // if (strm.avail_out <= 0) { throw new Error("bug2");}

      if (flush !== Z_FINISH) { return Z_OK }
      if (s.wrap <= 0) { return Z_STREAM_END }

  /* Write the trailer */
      if (s.wrap === 2) {
        put_byte(s, strm.adler & 0xff)
        put_byte(s, (strm.adler >> 8) & 0xff)
        put_byte(s, (strm.adler >> 16) & 0xff)
        put_byte(s, (strm.adler >> 24) & 0xff)
        put_byte(s, strm.total_in & 0xff)
        put_byte(s, (strm.total_in >> 8) & 0xff)
        put_byte(s, (strm.total_in >> 16) & 0xff)
        put_byte(s, (strm.total_in >> 24) & 0xff)
      } else {
        putShortMSB(s, strm.adler >>> 16)
        putShortMSB(s, strm.adler & 0xffff)
      }

      flush_pending(strm)
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
      if (s.wrap > 0) { s.wrap = -s.wrap }
  /* write the trailer only once! */
      return s.pending !== 0 ? Z_OK : Z_STREAM_END
    }

    function deflateEnd (strm) {
      var status

      if (!strm/* == Z_NULL */ || !strm.state/* == Z_NULL */) {
        return Z_STREAM_ERROR
      }

      status = strm.state.status
      if (status !== INIT_STATE &&
    status !== EXTRA_STATE &&
    status !== NAME_STATE &&
    status !== COMMENT_STATE &&
    status !== HCRC_STATE &&
    status !== BUSY_STATE &&
    status !== FINISH_STATE
  ) {
        return err(strm, Z_STREAM_ERROR)
      }

      strm.state = null

      return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK
    }

/* =========================================================================
 * Copy the source state to the destination state
 */
// function deflateCopy(dest, source) {
//
// }

    exports.deflateInit = deflateInit
    exports.deflateInit2 = deflateInit2
    exports.deflateReset = deflateReset
    exports.deflateResetKeep = deflateResetKeep
    exports.deflateSetHeader = deflateSetHeader
    exports.deflate = deflate
    exports.deflateEnd = deflateEnd
    exports.deflateInfo = 'pako deflate (from Nodeca project)'

/* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateSetDictionary = deflateSetDictionary;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/
  }, {'../utils/common': 4, './adler32': 5, './crc32': 7, './messages': 12, './trees': 13}],
  9: [function (require, module, exports) {
    'use strict'

// See state defs from inflate.js
    var BAD = 30       /* got a data error -- remain here until reset */
    var TYPE = 12      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
    module.exports = function inflate_fast (strm, start) {
      var state
      var _in                    /* local strm.input */
      var last                   /* have enough input while in < last */
      var _out                   /* local strm.output */
      var beg                    /* inflate()'s initial strm.output */
      var end                    /* while out < end, enough space available */
// #ifdef INFLATE_STRICT
      var dmax                   /* maximum distance from zlib header */
// #endif
      var wsize                  /* window size or zero if not using window */
      var whave                  /* valid bytes in the window */
      var wnext                  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
      var s_window               /* allocated sliding window, if wsize != 0 */
      var hold                   /* local strm.hold */
      var bits                   /* local strm.bits */
      var lcode                  /* local strm.lencode */
      var dcode                  /* local strm.distcode */
      var lmask                  /* mask for first level of length codes */
      var dmask                  /* mask for first level of distance codes */
      var here                   /* retrieved table entry */
      var op                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
      var len                    /* match length, unused bytes */
      var dist                   /* match distance */
      var from                   /* where to copy match from */
      var from_source

      var input, output // JS specific, because we have no pointers

  /* copy state to local variables */
      state = strm.state
  // here = state.here;
      _in = strm.next_in
      input = strm.input
      last = _in + (strm.avail_in - 5)
      _out = strm.next_out
      output = strm.output
      beg = _out - (start - strm.avail_out)
      end = _out + (strm.avail_out - 257)
// #ifdef INFLATE_STRICT
      dmax = state.dmax
// #endif
      wsize = state.wsize
      whave = state.whave
      wnext = state.wnext
      s_window = state.window
      hold = state.hold
      bits = state.bits
      lcode = state.lencode
      dcode = state.distcode
      lmask = (1 << state.lenbits) - 1
      dmask = (1 << state.distbits) - 1

  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

      top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits
      bits += 8
      hold += input[_in++] << bits
      bits += 8
    }

    here = lcode[hold & lmask]

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/* here.bits */
      hold >>>= op
      bits -= op
      op = (here >>> 16) & 0xff/* here.op */
      if (op === 0) {                          /* literal */
        // Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/* here.val */
      } else if (op & 16) {                     /* length base */
        len = here & 0xffff/* here.val */
        op &= 15                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits
            bits += 8
          }
          len += hold & ((1 << op) - 1)
          hold >>>= op
          bits -= op
        }
        // Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits
          bits += 8
          hold += input[_in++] << bits
          bits += 8
        }
        here = dcode[hold & dmask]

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/* here.bits */
          hold >>>= op
          bits -= op
          op = (here >>> 16) & 0xff/* here.op */

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/* here.val */
            op &= 15                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits
              bits += 8
              if (bits < op) {
                hold += input[_in++] << bits
                bits += 8
              }
            }
            dist += hold & ((1 << op) - 1)
// #ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back'
              state.mode = BAD
              break top
            }
// #endif
            hold >>>= op
            bits -= op
            // Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back'
                  state.mode = BAD
                  break top
                }

// (!) This block is disabled in zlib defailts,
// don't enable it for binary compatibility
// #ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
// #endif
              }
              from = 0 // window index
              from_source = s_window
              if (wnext === 0) {           /* very common case */
                from += wsize - op
                if (op < len) {         /* some from window */
                  len -= op
                  do {
                    output[_out++] = s_window[from++]
                  } while (--op)
                  from = _out - dist  /* rest from output */
                  from_source = output
                }
              } else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op
                op -= wnext
                if (op < len) {         /* some from end of window */
                  len -= op
                  do {
                    output[_out++] = s_window[from++]
                  } while (--op)
                  from = 0
                  if (wnext < len) {  /* some from start of window */
                    op = wnext
                    len -= op
                    do {
                      output[_out++] = s_window[from++]
                    } while (--op)
                    from = _out - dist      /* rest from output */
                    from_source = output
                  }
                }
              } else {                      /* contiguous in window */
                from += wnext - op
                if (op < len) {         /* some from window */
                  len -= op
                  do {
                    output[_out++] = s_window[from++]
                  } while (--op)
                  from = _out - dist  /* rest from output */
                  from_source = output
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++]
                output[_out++] = from_source[from++]
                output[_out++] = from_source[from++]
                len -= 3
              }
              if (len) {
                output[_out++] = from_source[from++]
                if (len > 1) {
                  output[_out++] = from_source[from++]
                }
              }
            } else {
              from = _out - dist          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++]
                output[_out++] = output[from++]
                output[_out++] = output[from++]
                len -= 3
              } while (len > 2)
              if (len) {
                output[_out++] = output[from++]
                if (len > 1) {
                  output[_out++] = output[from++]
                }
              }
            }
          } else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/* here.val */ + (hold & ((1 << op) - 1))]
            continue dodist
          } else {
            strm.msg = 'invalid distance code'
            state.mode = BAD
            break top
          }

          break // need to emulate goto via "continue"
        }
      } else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/* here.val */ + (hold & ((1 << op) - 1))]
        continue dolen
      } else if (op & 32) {                     /* end-of-block */
        // Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE
        break top
      } else {
        strm.msg = 'invalid literal/length code'
        state.mode = BAD
        break top
      }

      break // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end)

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
      len = bits >> 3
      _in -= len
      bits -= len << 3
      hold &= (1 << bits) - 1

  /* update state and return */
      strm.next_in = _in
      strm.next_out = _out
      strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last))
      strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end))
      state.hold = hold
      state.bits = bits
    }
  }, {}],
  10: [function (require, module, exports) {
    'use strict'

    var utils = require('../utils/common')
    var adler32 = require('./adler32')
    var crc32 = require('./crc32')
    var inflate_fast = require('./inffast')
    var inflate_table = require('./inftrees')

    var CODES = 0
    var LENS = 1
    var DISTS = 2

/* Public constants ========================================================== */
/* =========================================================================== */

/* Allowed flush values; see deflate() and inflate() below for details */
// var Z_NO_FLUSH      = 0;
// var Z_PARTIAL_FLUSH = 1;
// var Z_SYNC_FLUSH    = 2;
// var Z_FULL_FLUSH    = 3;
    var Z_FINISH = 4
    var Z_BLOCK = 5
    var Z_TREES = 6

/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
    var Z_OK = 0
    var Z_STREAM_END = 1
    var Z_NEED_DICT = 2
// var Z_ERRNO         = -1;
    var Z_STREAM_ERROR = -2
    var Z_DATA_ERROR = -3
    var Z_MEM_ERROR = -4
    var Z_BUF_ERROR = -5
// var Z_VERSION_ERROR = -6;

/* The deflate compression method */
    var Z_DEFLATED = 8

/* STATES ==================================================================== */
/* =========================================================================== */

    var HEAD = 1       /* i: waiting for magic header */
    var FLAGS = 2      /* i: waiting for method and flags (gzip) */
    var TIME = 3       /* i: waiting for modification time (gzip) */
    var OS = 4         /* i: waiting for extra flags and operating system (gzip) */
    var EXLEN = 5      /* i: waiting for extra length (gzip) */
    var EXTRA = 6      /* i: waiting for extra bytes (gzip) */
    var NAME = 7       /* i: waiting for end of file name (gzip) */
    var COMMENT = 8    /* i: waiting for end of comment (gzip) */
    var HCRC = 9       /* i: waiting for header crc (gzip) */
    var DICTID = 10    /* i: waiting for dictionary check value */
    var DICT = 11      /* waiting for inflateSetDictionary() call */
    var TYPE = 12      /* i: waiting for type bits, including last-flag bit */
    var TYPEDO = 13    /* i: same, but skip check to exit inflate on new block */
    var STORED = 14    /* i: waiting for stored size (length and complement) */
    var COPY_ = 15     /* i/o: same as COPY below, but only first time in */
    var COPY = 16      /* i/o: waiting for input or output to copy stored block */
    var TABLE = 17     /* i: waiting for dynamic block table lengths */
    var LENLENS = 18   /* i: waiting for code length code lengths */
    var CODELENS = 19  /* i: waiting for length/lit and distance code lengths */
    var LEN_ = 20      /* i: same as LEN below, but only first time in */
    var LEN = 21       /* i: waiting for length/lit/eob code */
    var LENEXT = 22    /* i: waiting for length extra bits */
    var DIST = 23      /* i: waiting for distance code */
    var DISTEXT = 24   /* i: waiting for distance extra bits */
    var MATCH = 25     /* o: waiting for output space to copy string */
    var LIT = 26       /* o: waiting for output space to write literal */
    var CHECK = 27     /* i: waiting for 32-bit check value */
    var LENGTH = 28    /* i: waiting for 32-bit length (gzip) */
    var DONE = 29      /* finished check, done -- remain here until reset */
    var BAD = 30       /* got a data error -- remain here until reset */
    var MEM = 31       /* got an inflate() memory error -- remain here until reset */
    var SYNC = 32      /* looking for synchronization bytes to restart inflate() */

/* =========================================================================== */

    var ENOUGH_LENS = 852
    var ENOUGH_DISTS = 592
// var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

    var MAX_WBITS = 15
/* 32K LZ77 window */
    var DEF_WBITS = MAX_WBITS

    function ZSWAP32 (q) {
      return (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24))
    }

    function InflateState () {
      this.mode = 0             /* current inflate mode */
      this.last = false          /* true if processing last block */
      this.wrap = 0              /* bit 0 true for zlib, bit 1 true for gzip */
      this.havedict = false      /* true if dictionary provided */
      this.flags = 0             /* gzip header method and flags (0 if zlib) */
      this.dmax = 0              /* zlib header max distance (INFLATE_STRICT) */
      this.check = 0             /* protected copy of check value */
      this.total = 0             /* protected copy of output count */
  // TODO: may be {}
      this.head = null           /* where to save gzip header information */

  /* sliding window */
      this.wbits = 0             /* log base 2 of requested window size */
      this.wsize = 0             /* window size or zero if not using window */
      this.whave = 0             /* valid bytes in the window */
      this.wnext = 0             /* window write index */
      this.window = null         /* allocated sliding window, if needed */

  /* bit accumulator */
      this.hold = 0              /* input bit accumulator */
      this.bits = 0              /* number of bits in "in" */

  /* for string and stored block copying */
      this.length = 0            /* literal or length of data to copy */
      this.offset = 0            /* distance back to copy string from */

  /* for table and code decoding */
      this.extra = 0             /* extra bits needed */

  /* fixed and dynamic code tables */
      this.lencode = null          /* starting table for length/literal codes */
      this.distcode = null         /* starting table for distance codes */
      this.lenbits = 0           /* index bits for lencode */
      this.distbits = 0          /* index bits for distcode */

  /* dynamic table building */
      this.ncode = 0             /* number of code length code lengths */
      this.nlen = 0              /* number of length code lengths */
      this.ndist = 0             /* number of distance code lengths */
      this.have = 0              /* number of code lengths in lens[] */
      this.next = null              /* next available space in codes[] */

      this.lens = new utils.Buf16(320) /* temporary storage for code lengths */
      this.work = new utils.Buf16(288) /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  // this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
      this.lendyn = null              /* dynamic table for length/literal codes (JS specific) */
      this.distdyn = null             /* dynamic table for distance codes (JS specific) */
      this.sane = 0                   /* if false, allow invalid distance too far */
      this.back = 0                   /* bits back of last unprocessed length/lit */
      this.was = 0                    /* initial length of match */
    }

    function inflateResetKeep (strm) {
      var state

      if (!strm || !strm.state) { return Z_STREAM_ERROR }
      state = strm.state
      strm.total_in = strm.total_out = state.total = 0
      strm.msg = '' /* Z_NULL */
      if (state.wrap) {       /* to support ill-conceived Java test suite */
        strm.adler = state.wrap & 1
      }
      state.mode = HEAD
      state.last = 0
      state.havedict = 0
      state.dmax = 32768
      state.head = null/* Z_NULL */
      state.hold = 0
      state.bits = 0
  // state.lencode = state.distcode = state.next = state.codes;
      state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS)
      state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS)

      state.sane = 1
      state.back = -1
  // Tracev((stderr, "inflate: reset\n"));
      return Z_OK
    }

    function inflateReset (strm) {
      var state

      if (!strm || !strm.state) { return Z_STREAM_ERROR }
      state = strm.state
      state.wsize = 0
      state.whave = 0
      state.wnext = 0
      return inflateResetKeep(strm)
    }

    function inflateReset2 (strm, windowBits) {
      var wrap
      var state

  /* get the state */
      if (!strm || !strm.state) { return Z_STREAM_ERROR }
      state = strm.state

  /* extract wrap request from windowBits parameter */
      if (windowBits < 0) {
        wrap = 0
        windowBits = -windowBits
      } else {
        wrap = (windowBits >> 4) + 1
        if (windowBits < 48) {
          windowBits &= 15
        }
      }

  /* set number of window bits, free window if different */
      if (windowBits && (windowBits < 8 || windowBits > 15)) {
        return Z_STREAM_ERROR
      }
      if (state.window !== null && state.wbits !== windowBits) {
        state.window = null
      }

  /* update state and reset the rest of it */
      state.wrap = wrap
      state.wbits = windowBits
      return inflateReset(strm)
    }

    function inflateInit2 (strm, windowBits) {
      var ret
      var state

      if (!strm) { return Z_STREAM_ERROR }
  // strm.msg = Z_NULL;                 /* in case we return an error */

      state = new InflateState()

  // if (state === Z_NULL) return Z_MEM_ERROR;
  // Tracev((stderr, "inflate: allocated\n"));
      strm.state = state
      state.window = null/* Z_NULL */
      ret = inflateReset2(strm, windowBits)
      if (ret !== Z_OK) {
        strm.state = null/* Z_NULL */
      }
      return ret
    }

    function inflateInit (strm) {
      return inflateInit2(strm, DEF_WBITS)
    }

/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
    var virgin = true

    var lenfix, distfix // We have no pointers in JS, so keep tables separate

    function fixedtables (state) {
  /* build fixed huffman tables if first call (may not be thread safe) */
      if (virgin) {
        var sym

        lenfix = new utils.Buf32(512)
        distfix = new utils.Buf32(32)

    /* literal/length table */
        sym = 0
        while (sym < 144) { state.lens[sym++] = 8 }
        while (sym < 256) { state.lens[sym++] = 9 }
        while (sym < 280) { state.lens[sym++] = 7 }
        while (sym < 288) { state.lens[sym++] = 8 }

        inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, {bits: 9})

    /* distance table */
        sym = 0
        while (sym < 32) { state.lens[sym++] = 5 }

        inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, {bits: 5})

    /* do this just once */
        virgin = false
      }

      state.lencode = lenfix
      state.lenbits = 9
      state.distcode = distfix
      state.distbits = 5
    }

/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
    function updatewindow (strm, src, end, copy) {
      var dist
      var state = strm.state

  /* if it hasn't been done already, allocate space for the window */
      if (state.window === null) {
        state.wsize = 1 << state.wbits
        state.wnext = 0
        state.whave = 0

        state.window = new utils.Buf8(state.wsize)
      }

  /* copy state->wsize or less output bytes into the circular window */
      if (copy >= state.wsize) {
        utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0)
        state.wnext = 0
        state.whave = state.wsize
      } else {
        dist = state.wsize - state.wnext
        if (dist > copy) {
          dist = copy
        }
    // zmemcpy(state->window + state->wnext, end - copy, dist);
        utils.arraySet(state.window, src, end - copy, dist, state.wnext)
        copy -= dist
        if (copy) {
      // zmemcpy(state->window, end - copy, copy);
          utils.arraySet(state.window, src, end - copy, copy, 0)
          state.wnext = copy
          state.whave = state.wsize
        } else {
          state.wnext += dist
          if (state.wnext === state.wsize) { state.wnext = 0 }
          if (state.whave < state.wsize) { state.whave += dist }
        }
      }
      return 0
    }

    function inflate (strm, flush) {
      var state
      var input, output          // input/output buffers
      var next                   /* next input INDEX */
      var put                    /* next output INDEX */
      var have, left             /* available input and output */
      var hold                   /* bit buffer */
      var bits                   /* bits in bit buffer */
      var _in, _out              /* save starting available input and output */
      var copy                   /* number of stored or match bytes to copy */
      var from                   /* where to copy match bytes from */
      var from_source
      var here = 0               /* current decoding table entry */
      var here_bits, here_op, here_val // paked "here" denormalized (JS specific)
  // var last;                   /* parent table entry */
      var last_bits, last_op, last_val // paked "last" denormalized (JS specific)
      var len                    /* length to copy for repeats, bits to drop */
      var ret                    /* return code */
      var hbuf = new utils.Buf8(4)    /* buffer for gzip header crc calculation */
      var opts

      var n // temporary var for NEED_BITS

      var order = /* permutation of code lengths */
    [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]

      if (!strm || !strm.state || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
        return Z_STREAM_ERROR
      }

      state = strm.state
      if (state.mode === TYPE) { state.mode = TYPEDO }    /* skip check */

  // --- LOAD() ---
      put = strm.next_out
      output = strm.output
      left = strm.avail_out
      next = strm.next_in
      input = strm.input
      have = strm.avail_in
      hold = state.hold
      bits = state.bits
  // ---

      _in = have
      _out = left
      ret = Z_OK

      inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO
          break
        }
      // === NEEDBITS(16);
        while (bits < 16) {
          if (have === 0) { break inf_leave }
          have--
          hold += input[next++] << bits
          bits += 8
        }
      // ===//
        if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
          state.check = 0/* crc32(0L, Z_NULL, 0) */
        // === CRC2(state.check, hold);
          hbuf[0] = hold & 0xff
          hbuf[1] = (hold >>> 8) & 0xff
          state.check = crc32(state.check, hbuf, 2, 0)
        // ===//

        // === INITBITS();
          hold = 0
          bits = 0
        // ===//
          state.mode = FLAGS
          break
        }
        state.flags = 0           /* expect zlib header */
        if (state.head) {
          state.head.done = false
        }
        if (!(state.wrap & 1) ||   /* check if zlib header allowed */
        (((hold & 0xff)/* BITS(8) */ << 8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check'
          state.mode = BAD
          break
        }
        if ((hold & 0x0f)/* BITS(4) */ !== Z_DEFLATED) {
          strm.msg = 'unknown compression method'
          state.mode = BAD
          break
        }
      // --- DROPBITS(4) ---//
        hold >>>= 4
        bits -= 4
      // ---//
        len = (hold & 0x0f)/* BITS(4) */ + 8
        if (state.wbits === 0) {
          state.wbits = len
        } else if (len > state.wbits) {
          strm.msg = 'invalid window size'
          state.mode = BAD
          break
        }
        state.dmax = 1 << len
      // Tracev((stderr, "inflate:   zlib header ok\n"));
        strm.adler = state.check = 1/* adler32(0L, Z_NULL, 0) */
        state.mode = hold & 0x200 ? DICTID : TYPE
      // === INITBITS();
        hold = 0
        bits = 0
      // ===//
        break
      case FLAGS:
      // === NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave }
          have--
          hold += input[next++] << bits
          bits += 8
        }
      // ===//
        state.flags = hold
        if ((state.flags & 0xff) !== Z_DEFLATED) {
          strm.msg = 'unknown compression method'
          state.mode = BAD
          break
        }
        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set'
          state.mode = BAD
          break
        }
        if (state.head) {
          state.head.text = ((hold >> 8) & 1)
        }
        if (state.flags & 0x0200) {
        // === CRC2(state.check, hold);
          hbuf[0] = hold & 0xff
          hbuf[1] = (hold >>> 8) & 0xff
          state.check = crc32(state.check, hbuf, 2, 0)
        // ===//
        }
      // === INITBITS();
        hold = 0
        bits = 0
      // ===//
        state.mode = TIME
      /* falls through */
      case TIME:
      // === NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave }
          have--
          hold += input[next++] << bits
          bits += 8
        }
      // ===//
        if (state.head) {
          state.head.time = hold
        }
        if (state.flags & 0x0200) {
        // === CRC4(state.check, hold)
          hbuf[0] = hold & 0xff
          hbuf[1] = (hold >>> 8) & 0xff
          hbuf[2] = (hold >>> 16) & 0xff
          hbuf[3] = (hold >>> 24) & 0xff
          state.check = crc32(state.check, hbuf, 4, 0)
        // ===
        }
      // === INITBITS();
        hold = 0
        bits = 0
      // ===//
        state.mode = OS
      /* falls through */
      case OS:
      // === NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave }
          have--
          hold += input[next++] << bits
          bits += 8
        }
      // ===//
        if (state.head) {
          state.head.xflags = (hold & 0xff)
          state.head.os = (hold >> 8)
        }
        if (state.flags & 0x0200) {
        // === CRC2(state.check, hold);
          hbuf[0] = hold & 0xff
          hbuf[1] = (hold >>> 8) & 0xff
          state.check = crc32(state.check, hbuf, 2, 0)
        // ===//
        }
      // === INITBITS();
        hold = 0
        bits = 0
      // ===//
        state.mode = EXLEN
      /* falls through */
      case EXLEN:
        if (state.flags & 0x0400) {
        // === NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave }
            have--
            hold += input[next++] << bits
            bits += 8
          }
        // ===//
          state.length = hold
          if (state.head) {
            state.head.extra_len = hold
          }
          if (state.flags & 0x0200) {
          // === CRC2(state.check, hold);
            hbuf[0] = hold & 0xff
            hbuf[1] = (hold >>> 8) & 0xff
            state.check = crc32(state.check, hbuf, 2, 0)
          // ===//
          }
        // === INITBITS();
          hold = 0
          bits = 0
        // ===//
        } else if (state.head) {
          state.head.extra = null/* Z_NULL */
        }
        state.mode = EXTRA
      /* falls through */
      case EXTRA:
        if (state.flags & 0x0400) {
          copy = state.length
          if (copy > have) { copy = have }
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length
              if (!state.head.extra) {
              // Use untyped array for more conveniend processing later
                state.head.extra = new Array(state.head.extra_len)
              }
              utils.arraySet(
              state.head.extra,
              input,
              next,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              copy,
              /* len + copy > state.head.extra_max - len ? state.head.extra_max : copy, */
              len
            )
            // zmemcpy(state.head.extra + len, next,
            //        len + copy > state.head.extra_max ?
            //        state.head.extra_max - len : copy);
            }
            if (state.flags & 0x0200) {
              state.check = crc32(state.check, input, copy, next)
            }
            have -= copy
            next += copy
            state.length -= copy
          }
          if (state.length) { break inf_leave }
        }
        state.length = 0
        state.mode = NAME
      /* falls through */
      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) { break inf_leave }
          copy = 0
          do {
          // TODO: 2 or 1 bytes?
            len = input[next + copy++]
          /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
              (state.length < 65536 /* state.head.name_max */)) {
              state.head.name += String.fromCharCode(len)
            }
          } while (len && copy < have)

          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next)
          }
          have -= copy
          next += copy
          if (len) { break inf_leave }
        } else if (state.head) {
          state.head.name = null
        }
        state.length = 0
        state.mode = COMMENT
      /* falls through */
      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) { break inf_leave }
          copy = 0
          do {
            len = input[next + copy++]
          /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
              (state.length < 65536 /* state.head.comm_max */)) {
              state.head.comment += String.fromCharCode(len)
            }
          } while (len && copy < have)
          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next)
          }
          have -= copy
          next += copy
          if (len) { break inf_leave }
        } else if (state.head) {
          state.head.comment = null
        }
        state.mode = HCRC
      /* falls through */
      case HCRC:
        if (state.flags & 0x0200) {
        // === NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave }
            have--
            hold += input[next++] << bits
            bits += 8
          }
        // ===//
          if (hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch'
            state.mode = BAD
            break
          }
        // === INITBITS();
          hold = 0
          bits = 0
        // ===//
        }
        if (state.head) {
          state.head.hcrc = ((state.flags >> 9) & 1)
          state.head.done = true
        }
        strm.adler = state.check = 0 /* crc32(0L, Z_NULL, 0) */
        state.mode = TYPE
        break
      case DICTID:
      // === NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave }
          have--
          hold += input[next++] << bits
          bits += 8
        }
      // ===//
        strm.adler = state.check = ZSWAP32(hold)
      // === INITBITS();
        hold = 0
        bits = 0
      // ===//
        state.mode = DICT
      /* falls through */
      case DICT:
        if (state.havedict === 0) {
        // --- RESTORE() ---
          strm.next_out = put
          strm.avail_out = left
          strm.next_in = next
          strm.avail_in = have
          state.hold = hold
          state.bits = bits
        // ---
          return Z_NEED_DICT
        }
        strm.adler = state.check = 1/* adler32(0L, Z_NULL, 0) */
        state.mode = TYPE
      /* falls through */
      case TYPE:
        if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave }
      /* falls through */
      case TYPEDO:
        if (state.last) {
        // --- BYTEBITS() ---//
          hold >>>= bits & 7
          bits -= bits & 7
        // ---//
          state.mode = CHECK
          break
        }
      // === NEEDBITS(3); */
        while (bits < 3) {
          if (have === 0) { break inf_leave }
          have--
          hold += input[next++] << bits
          bits += 8
        }
      // ===//
        state.last = (hold & 0x01)/* BITS(1) */
      // --- DROPBITS(1) ---//
        hold >>>= 1
        bits -= 1
      // ---//

        switch ((hold & 0x03)/* BITS(2) */) {
          case 0:                             /* stored block */
        // Tracev((stderr, "inflate:     stored block%s\n",
        //        state.last ? " (last)" : ""));
            state.mode = STORED
            break
          case 1:                             /* fixed block */
            fixedtables(state)
        // Tracev((stderr, "inflate:     fixed codes block%s\n",
        //        state.last ? " (last)" : ""));
            state.mode = LEN_             /* decode codes */
            if (flush === Z_TREES) {
          // --- DROPBITS(2) ---//
              hold >>>= 2
              bits -= 2
          // ---//
              break inf_leave
            }
            break
          case 2:                             /* dynamic block */
        // Tracev((stderr, "inflate:     dynamic codes block%s\n",
        //        state.last ? " (last)" : ""));
            state.mode = TABLE
            break
          case 3:
            strm.msg = 'invalid block type'
            state.mode = BAD
        }
      // --- DROPBITS(2) ---//
        hold >>>= 2
        bits -= 2
      // ---//
        break
      case STORED:
      // --- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7
        bits -= bits & 7
      // ---//
      // === NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave }
          have--
          hold += input[next++] << bits
          bits += 8
        }
      // ===//
        if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths'
          state.mode = BAD
          break
        }
        state.length = hold & 0xffff
      // Tracev((stderr, "inflate:       stored length %u\n",
      //        state.length));
      // === INITBITS();
        hold = 0
        bits = 0
      // ===//
        state.mode = COPY_
        if (flush === Z_TREES) { break inf_leave }
      /* falls through */
      case COPY_:
        state.mode = COPY
      /* falls through */
      case COPY:
        copy = state.length
        if (copy) {
          if (copy > have) { copy = have }
          if (copy > left) { copy = left }
          if (copy === 0) { break inf_leave }
        // --- zmemcpy(put, next, copy); ---
          utils.arraySet(output, input, next, copy, put)
        // ---//
          have -= copy
          next += copy
          left -= copy
          put += copy
          state.length -= copy
          break
        }
      // Tracev((stderr, "inflate:       stored end\n"));
        state.mode = TYPE
        break
      case TABLE:
      // === NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) { break inf_leave }
          have--
          hold += input[next++] << bits
          bits += 8
        }
      // ===//
        state.nlen = (hold & 0x1f)/* BITS(5) */ + 257
      // --- DROPBITS(5) ---//
        hold >>>= 5
        bits -= 5
      // ---//
        state.ndist = (hold & 0x1f)/* BITS(5) */ + 1
      // --- DROPBITS(5) ---//
        hold >>>= 5
        bits -= 5
      // ---//
        state.ncode = (hold & 0x0f)/* BITS(4) */ + 4
      // --- DROPBITS(4) ---//
        hold >>>= 4
        bits -= 4
      // ---//
// #ifndef PKZIP_BUG_WORKAROUND
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols'
          state.mode = BAD
          break
        }
// #endif
      // Tracev((stderr, "inflate:       table sizes ok\n"));
        state.have = 0
        state.mode = LENLENS
      /* falls through */
      case LENLENS:
        while (state.have < state.ncode) {
        // === NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) { break inf_leave }
            have--
            hold += input[next++] << bits
            bits += 8
          }
        // ===//
          state.lens[order[state.have++]] = (hold & 0x07)// BITS(3);
        // --- DROPBITS(3) ---//
          hold >>>= 3
          bits -= 3
        // ---//
        }
        while (state.have < 19) {
          state.lens[order[state.have++]] = 0
        }
      // We have separate tables & no pointers. 2 commented lines below not needed.
      // state.next = state.codes;
      // state.lencode = state.next;
      // Switch to use dynamic table
        state.lencode = state.lendyn
        state.lenbits = 7

        opts = {bits: state.lenbits}
        ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts)
        state.lenbits = opts.bits

        if (ret) {
          strm.msg = 'invalid code lengths set'
          state.mode = BAD
          break
        }
      // Tracev((stderr, "inflate:       code lengths ok\n"));
        state.have = 0
        state.mode = CODELENS
      /* falls through */
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) - 1)]/* BITS(state.lenbits) */
            here_bits = here >>> 24
            here_op = (here >>> 16) & 0xff
            here_val = here & 0xffff

            if ((here_bits) <= bits) { break }
          // --- PULLBYTE() ---//
            if (have === 0) { break inf_leave }
            have--
            hold += input[next++] << bits
            bits += 8
          // ---//
          }
          if (here_val < 16) {
          // --- DROPBITS(here.bits) ---//
            hold >>>= here_bits
            bits -= here_bits
          // ---//
            state.lens[state.have++] = here_val
          } else {
            if (here_val === 16) {
            // === NEEDBITS(here.bits + 2);
              n = here_bits + 2
              while (bits < n) {
                if (have === 0) { break inf_leave }
                have--
                hold += input[next++] << bits
                bits += 8
              }
            // ===//
            // --- DROPBITS(here.bits) ---//
              hold >>>= here_bits
              bits -= here_bits
            // ---//
              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat'
                state.mode = BAD
                break
              }
              len = state.lens[state.have - 1]
              copy = 3 + (hold & 0x03)// BITS(2);
            // --- DROPBITS(2) ---//
              hold >>>= 2
              bits -= 2
            // ---//
            } else if (here_val === 17) {
            // === NEEDBITS(here.bits + 3);
              n = here_bits + 3
              while (bits < n) {
                if (have === 0) { break inf_leave }
                have--
                hold += input[next++] << bits
                bits += 8
              }
            // ===//
            // --- DROPBITS(here.bits) ---//
              hold >>>= here_bits
              bits -= here_bits
            // ---//
              len = 0
              copy = 3 + (hold & 0x07)// BITS(3);
            // --- DROPBITS(3) ---//
              hold >>>= 3
              bits -= 3
            // ---//
            } else {
            // === NEEDBITS(here.bits + 7);
              n = here_bits + 7
              while (bits < n) {
                if (have === 0) { break inf_leave }
                have--
                hold += input[next++] << bits
                bits += 8
              }
            // ===//
            // --- DROPBITS(here.bits) ---//
              hold >>>= here_bits
              bits -= here_bits
            // ---//
              len = 0
              copy = 11 + (hold & 0x7f)// BITS(7);
            // --- DROPBITS(7) ---//
              hold >>>= 7
              bits -= 7
            // ---//
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat'
              state.mode = BAD
              break
            }
            while (copy--) {
              state.lens[state.have++] = len
            }
          }
        }

      /* handle error breaks in while */
        if (state.mode === BAD) { break }

      /* check for end-of-block code (better have one) */
        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block'
          state.mode = BAD
          break
        }

      /* build code tables -- note: do not change the lenbits or distbits
         values here (9 and 6) without reading the comments in inftrees.h
         concerning the ENOUGH constants, which depend on those values */
        state.lenbits = 9

        opts = {bits: state.lenbits}
        ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts)
      // We have separate tables & no pointers. 2 commented lines below not needed.
      // state.next_index = opts.table_index;
        state.lenbits = opts.bits
      // state.lencode = state.next;

        if (ret) {
          strm.msg = 'invalid literal/lengths set'
          state.mode = BAD
          break
        }

        state.distbits = 6
      // state.distcode.copy(state.codes);
      // Switch to use dynamic table
        state.distcode = state.distdyn
        opts = {bits: state.distbits}
        ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts)
      // We have separate tables & no pointers. 2 commented lines below not needed.
      // state.next_index = opts.table_index;
        state.distbits = opts.bits
      // state.distcode = state.next;

        if (ret) {
          strm.msg = 'invalid distances set'
          state.mode = BAD
          break
        }
      // Tracev((stderr, 'inflate:       codes ok\n'));
        state.mode = LEN_
        if (flush === Z_TREES) { break inf_leave }
      /* falls through */
      case LEN_:
        state.mode = LEN
      /* falls through */
      case LEN:
        if (have >= 6 && left >= 258) {
        // --- RESTORE() ---
          strm.next_out = put
          strm.avail_out = left
          strm.next_in = next
          strm.avail_in = have
          state.hold = hold
          state.bits = bits
        // ---
          inflate_fast(strm, _out)
        // --- LOAD() ---
          put = strm.next_out
          output = strm.output
          left = strm.avail_out
          next = strm.next_in
          input = strm.input
          have = strm.avail_in
          hold = state.hold
          bits = state.bits
        // ---

          if (state.mode === TYPE) {
            state.back = -1
          }
          break
        }
        state.back = 0
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)]  /* BITS(state.lenbits) */
          here_bits = here >>> 24
          here_op = (here >>> 16) & 0xff
          here_val = here & 0xffff

          if (here_bits <= bits) { break }
        // --- PULLBYTE() ---//
          if (have === 0) { break inf_leave }
          have--
          hold += input[next++] << bits
          bits += 8
        // ---//
        }
        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits
          last_op = here_op
          last_val = here_val
          for (;;) {
            here = state.lencode[last_val +
                  ((hold & ((1 << (last_bits + last_op)) - 1))/* BITS(last.bits + last.op) */ >> last_bits)]
            here_bits = here >>> 24
            here_op = (here >>> 16) & 0xff
            here_val = here & 0xffff

            if ((last_bits + here_bits) <= bits) { break }
          // --- PULLBYTE() ---//
            if (have === 0) { break inf_leave }
            have--
            hold += input[next++] << bits
            bits += 8
          // ---//
          }
        // --- DROPBITS(last.bits) ---//
          hold >>>= last_bits
          bits -= last_bits
        // ---//
          state.back += last_bits
        }
      // --- DROPBITS(here.bits) ---//
        hold >>>= here_bits
        bits -= here_bits
      // ---//
        state.back += here_bits
        state.length = here_val
        if (here_op === 0) {
        // Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
          state.mode = LIT
          break
        }
        if (here_op & 32) {
        // Tracevv((stderr, "inflate:         end of block\n"));
          state.back = -1
          state.mode = TYPE
          break
        }
        if (here_op & 64) {
          strm.msg = 'invalid literal/length code'
          state.mode = BAD
          break
        }
        state.extra = here_op & 15
        state.mode = LENEXT
      /* falls through */
      case LENEXT:
        if (state.extra) {
        // === NEEDBITS(state.extra);
          n = state.extra
          while (bits < n) {
            if (have === 0) { break inf_leave }
            have--
            hold += input[next++] << bits
            bits += 8
          }
        // ===//
          state.length += hold & ((1 << state.extra) - 1)/* BITS(state.extra) */
        // --- DROPBITS(state.extra) ---//
          hold >>>= state.extra
          bits -= state.extra
        // ---//
          state.back += state.extra
        }
      // Tracevv((stderr, "inflate:         length %u\n", state.length));
        state.was = state.length
        state.mode = DIST
      /* falls through */
      case DIST:
        for (;;) {
          here = state.distcode[hold & ((1 << state.distbits) - 1)]/* BITS(state.distbits) */
          here_bits = here >>> 24
          here_op = (here >>> 16) & 0xff
          here_val = here & 0xffff

          if ((here_bits) <= bits) { break }
        // --- PULLBYTE() ---//
          if (have === 0) { break inf_leave }
          have--
          hold += input[next++] << bits
          bits += 8
        // ---//
        }
        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits
          last_op = here_op
          last_val = here_val
          for (;;) {
            here = state.distcode[last_val +
                  ((hold & ((1 << (last_bits + last_op)) - 1))/* BITS(last.bits + last.op) */ >> last_bits)]
            here_bits = here >>> 24
            here_op = (here >>> 16) & 0xff
            here_val = here & 0xffff

            if ((last_bits + here_bits) <= bits) { break }
          // --- PULLBYTE() ---//
            if (have === 0) { break inf_leave }
            have--
            hold += input[next++] << bits
            bits += 8
          // ---//
          }
        // --- DROPBITS(last.bits) ---//
          hold >>>= last_bits
          bits -= last_bits
        // ---//
          state.back += last_bits
        }
      // --- DROPBITS(here.bits) ---//
        hold >>>= here_bits
        bits -= here_bits
      // ---//
        state.back += here_bits
        if (here_op & 64) {
          strm.msg = 'invalid distance code'
          state.mode = BAD
          break
        }
        state.offset = here_val
        state.extra = (here_op) & 15
        state.mode = DISTEXT
      /* falls through */
      case DISTEXT:
        if (state.extra) {
        // === NEEDBITS(state.extra);
          n = state.extra
          while (bits < n) {
            if (have === 0) { break inf_leave }
            have--
            hold += input[next++] << bits
            bits += 8
          }
        // ===//
          state.offset += hold & ((1 << state.extra) - 1)/* BITS(state.extra) */
        // --- DROPBITS(state.extra) ---//
          hold >>>= state.extra
          bits -= state.extra
        // ---//
          state.back += state.extra
        }
// #ifdef INFLATE_STRICT
        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back'
          state.mode = BAD
          break
        }
// #endif
      // Tracevv((stderr, "inflate:         distance %u\n", state.offset));
        state.mode = MATCH
      /* falls through */
      case MATCH:
        if (left === 0) { break inf_leave }
        copy = _out - left
        if (state.offset > copy) {         /* copy from window */
          copy = state.offset - copy
          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = 'invalid distance too far back'
              state.mode = BAD
              break
            }
// (!) This block is disabled in zlib defailts,
// don't enable it for binary compatibility
// #ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= state.whave;
//          if (copy > state.length) { copy = state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (state.length === 0) { state.mode = LEN; }
//          break;
// #endif
          }
          if (copy > state.wnext) {
            copy -= state.wnext
            from = state.wsize - copy
          } else {
            from = state.wnext - copy
          }
          if (copy > state.length) { copy = state.length }
          from_source = state.window
        } else {                              /* copy from output */
          from_source = output
          from = put - state.offset
          copy = state.length
        }
        if (copy > left) { copy = left }
        left -= copy
        state.length -= copy
        do {
          output[put++] = from_source[from++]
        } while (--copy)
        if (state.length === 0) { state.mode = LEN }
        break
      case LIT:
        if (left === 0) { break inf_leave }
        output[put++] = state.length
        left--
        state.mode = LEN
        break
      case CHECK:
        if (state.wrap) {
        // === NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave }
            have--
          // Use '|' insdead of '+' to make sure that result is signed
            hold |= input[next++] << bits
            bits += 8
          }
        // ===//
          _out -= left
          strm.total_out += _out
          state.total += _out
          if (_out) {
            strm.adler = state.check =
              /* UPDATE(state.check, put - _out, _out); */
              (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out))
          }
          _out = left
        // NB: crc32 stored as signed 32-bit int, ZSWAP32 returns signed too
          if ((state.flags ? hold : ZSWAP32(hold)) !== state.check) {
            strm.msg = 'incorrect data check'
            state.mode = BAD
            break
          }
        // === INITBITS();
          hold = 0
          bits = 0
        // ===//
        // Tracev((stderr, "inflate:   check matches trailer\n"));
        }
        state.mode = LENGTH
      /* falls through */
      case LENGTH:
        if (state.wrap && state.flags) {
        // === NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave }
            have--
            hold += input[next++] << bits
            bits += 8
          }
        // ===//
          if (hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check'
            state.mode = BAD
            break
          }
        // === INITBITS();
          hold = 0
          bits = 0
        // ===//
        // Tracev((stderr, "inflate:   length matches trailer\n"));
        }
        state.mode = DONE
      /* falls through */
      case DONE:
        ret = Z_STREAM_END
        break inf_leave
      case BAD:
        ret = Z_DATA_ERROR
        break inf_leave
      case MEM:
        return Z_MEM_ERROR
      case SYNC:
      /* falls through */
      default:
        return Z_STREAM_ERROR
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  // --- RESTORE() ---
      strm.next_out = put
      strm.avail_out = left
      strm.next_in = next
      strm.avail_in = have
      state.hold = hold
      state.bits = bits
  // ---

      if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH))) {
        if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
          state.mode = MEM
          return Z_MEM_ERROR
        }
      }
      _in -= strm.avail_in
      _out -= strm.avail_out
      strm.total_in += _in
      strm.total_out += _out
      state.total += _out
      if (state.wrap && _out) {
        strm.adler = state.check = /* UPDATE(state.check, strm.next_out - _out, _out); */
      (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out))
      }
      strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0)
      if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) {
        ret = Z_BUF_ERROR
      }
      return ret
    }

    function inflateEnd (strm) {
      if (!strm || !strm.state /* || strm->zfree == (free_func)0 */) {
        return Z_STREAM_ERROR
      }

      var state = strm.state
      if (state.window) {
        state.window = null
      }
      strm.state = null
      return Z_OK
    }

    function inflateGetHeader (strm, head) {
      var state

  /* check state */
      if (!strm || !strm.state) { return Z_STREAM_ERROR }
      state = strm.state
      if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR }

  /* save header structure */
      state.head = head
      head.done = false
      return Z_OK
    }

    exports.inflateReset = inflateReset
    exports.inflateReset2 = inflateReset2
    exports.inflateResetKeep = inflateResetKeep
    exports.inflateInit = inflateInit
    exports.inflateInit2 = inflateInit2
    exports.inflate = inflate
    exports.inflateEnd = inflateEnd
    exports.inflateGetHeader = inflateGetHeader
    exports.inflateInfo = 'pako inflate (from Nodeca project)'

/* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSetDictionary = inflateSetDictionary;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/
  }, {'../utils/common': 4, './adler32': 5, './crc32': 7, './inffast': 9, './inftrees': 11}],
  11: [function (require, module, exports) {
    'use strict'

    var utils = require('../utils/common')

    var MAXBITS = 15
    var ENOUGH_LENS = 852
    var ENOUGH_DISTS = 592
// var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

    var CODES = 0
    var LENS = 1
    var DISTS = 2

    var lbase = [ /* Length codes 257..285 base */
      3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
      35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
    ]

    var lext = [ /* Length codes 257..285 extra */
      16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
      19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
    ]

    var dbase = [ /* Distance codes 0..29 base */
      1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
      257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
      8193, 12289, 16385, 24577, 0, 0
    ]

    var dext = [ /* Distance codes 0..29 extra */
      16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
      23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
      28, 28, 29, 29, 64, 64
    ]

    module.exports = function inflate_table (type, lens, lens_index, codes, table, table_index, work, opts) {
      var bits = opts.bits
      // here = opts.here; /* table entry for duplication */

      var len = 0               /* a code's length in bits */
      var sym = 0               /* index of code symbols */
      var min = 0, max = 0          /* minimum and maximum code lengths */
      var root = 0              /* number of index bits for root table */
      var curr = 0              /* number of index bits for current table */
      var drop = 0              /* code bits to drop for sub-table */
      var left = 0                   /* number of prefix codes available */
      var used = 0              /* code entries in table used */
      var huff = 0              /* Huffman code */
      var incr              /* for incrementing code, index */
      var fill              /* index for replicating entries */
      var low               /* low bits for current root entry */
      var mask              /* mask for low root bits */
      var next             /* next available space in table */
      var base = null     /* base value table to use */
      var base_index = 0
//  var shoextra;    /* extra bits table to use */
      var end                    /* use base and extra for symbol > end */
      var count = new utils.Buf16(MAXBITS + 1) // [MAXBITS+1];    /* number of codes of each length */
      var offs = new utils.Buf16(MAXBITS + 1) // [MAXBITS+1];     /* offsets in table for each length */
      var extra = null
      var extra_index = 0

      var here_bits, here_op, here_val

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
      for (len = 0; len <= MAXBITS; len++) {
        count[len] = 0
      }
      for (sym = 0; sym < codes; sym++) {
        count[lens[lens_index + sym]]++
      }

  /* bound code lengths, force root to be within code lengths */
      root = bits
      for (max = MAXBITS; max >= 1; max--) {
        if (count[max] !== 0) { break }
      }
      if (root > max) {
        root = max
      }
      if (max === 0) {                     /* no symbols to code at all */
    // table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    // table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    // table.val[opts.table_index++] = 0;   //here.val = (var short)0;
        table[table_index++] = (1 << 24) | (64 << 16) | 0

    // table.op[opts.table_index] = 64;
    // table.bits[opts.table_index] = 1;
    // table.val[opts.table_index++] = 0;
        table[table_index++] = (1 << 24) | (64 << 16) | 0

        opts.bits = 1
        return 0     /* no symbols, but wait for decoding to report error */
      }
      for (min = 1; min < max; min++) {
        if (count[min] !== 0) { break }
      }
      if (root < min) {
        root = min
      }

  /* check for an over-subscribed or incomplete set of lengths */
      left = 1
      for (len = 1; len <= MAXBITS; len++) {
        left <<= 1
        left -= count[len]
        if (left < 0) {
          return -1
        }        /* over-subscribed */
      }
      if (left > 0 && (type === CODES || max !== 1)) {
        return -1                      /* incomplete set */
      }

  /* generate offsets into symbol table for each length for sorting */
      offs[1] = 0
      for (len = 1; len < MAXBITS; len++) {
        offs[len + 1] = offs[len] + count[len]
      }

  /* sort symbols by length, by symbol order within each length */
      for (sym = 0; sym < codes; sym++) {
        if (lens[lens_index + sym] !== 0) {
          work[offs[lens[lens_index + sym]]++] = sym
        }
      }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
      if (type === CODES) {
        base = extra = work    /* dummy value--not used */
        end = 19
      } else if (type === LENS) {
        base = lbase
        base_index -= 257
        extra = lext
        extra_index -= 257
        end = 256
      } else {                    /* DISTS */
        base = dbase
        extra = dext
        end = -1
      }

  /* initialize opts for loop */
      huff = 0                   /* starting code */
      sym = 0                    /* starting code symbol */
      len = min                  /* starting code length */
      next = table_index              /* current table to fill in */
      curr = root                /* current table index bits */
      drop = 0                   /* current bits to drop from code for index */
      low = -1                   /* trigger new sub-table when len > root */
      used = 1 << root          /* use root table entries */
      mask = used - 1            /* mask for comparing low */

  /* check available table space */
      if ((type === LENS && used > ENOUGH_LENS) ||
    (type === DISTS && used > ENOUGH_DISTS)) {
        return 1
      }

      var i = 0
  /* process all codes and make table entries */
      for (;;) {
        i++
    /* create table entry */
        here_bits = len - drop
        if (work[sym] < end) {
          here_op = 0
          here_val = work[sym]
        } else if (work[sym] > end) {
          here_op = extra[extra_index + work[sym]]
          here_val = base[base_index + work[sym]]
        } else {
          here_op = 32 + 64         /* end of block */
          here_val = 0
        }

    /* replicate for those indices with low len bits equal to huff */
        incr = 1 << (len - drop)
        fill = 1 << curr
        min = fill                 /* save offset to next table */
        do {
          fill -= incr
          table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val | 0
        } while (fill !== 0)

    /* backwards increment the len-bit code huff */
        incr = 1 << (len - 1)
        while (huff & incr) {
          incr >>= 1
        }
        if (incr !== 0) {
          huff &= incr - 1
          huff += incr
        } else {
          huff = 0
        }

    /* go to next symbol, update count, len */
        sym++
        if (--count[len] === 0) {
          if (len === max) { break }
          len = lens[lens_index + work[sym]]
        }

    /* create new sub-table if needed */
        if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
          if (drop === 0) {
            drop = root
          }

      /* increment past last table */
          next += min            /* here min is 1 << curr */

      /* determine length of next table */
          curr = len - drop
          left = 1 << curr
          while (curr + drop < max) {
            left -= count[curr + drop]
            if (left <= 0) { break }
            curr++
            left <<= 1
          }

      /* check for enough space */
          used += 1 << curr
          if ((type === LENS && used > ENOUGH_LENS) ||
        (type === DISTS && used > ENOUGH_DISTS)) {
            return 1
          }

      /* point entry in root table to sub-table */
          low = huff & mask
      /* table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index; */
          table[low] = (root << 24) | (curr << 16) | (next - table_index) | 0
        }
      }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
      if (huff !== 0) {
    // table.op[next + huff] = 64;            /* invalid code marker */
    // table.bits[next + huff] = len - drop;
    // table.val[next + huff] = 0;
        table[next + huff] = ((len - drop) << 24) | (64 << 16) | 0
      }

  /* set return parameters */
  // opts.table_index += used;
      opts.bits = root
      return 0
    }
  }, {'../utils/common': 4}],
  12: [function (require, module, exports) {
    'use strict'

    module.exports = {
      '2': 'need dictionary',     /* Z_NEED_DICT       2  */
      '1': 'stream end',          /* Z_STREAM_END      1  */
      '0': '',                    /* Z_OK              0  */
      '-1': 'file error',          /* Z_ERRNO         (-1) */
      '-2': 'stream error',        /* Z_STREAM_ERROR  (-2) */
      '-3': 'data error',          /* Z_DATA_ERROR    (-3) */
      '-4': 'insufficient memory', /* Z_MEM_ERROR     (-4) */
      '-5': 'buffer error',        /* Z_BUF_ERROR     (-5) */
      '-6': 'incompatible version' /* Z_VERSION_ERROR (-6) */
    }
  }, {}],
  13: [function (require, module, exports) {
    'use strict'

    var utils = require('../utils/common')

/* Public constants ========================================================== */
/* =========================================================================== */

// var Z_FILTERED          = 1;
// var Z_HUFFMAN_ONLY      = 2;
// var Z_RLE               = 3;
    var Z_FIXED = 4
// var Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
    var Z_BINARY = 0
    var Z_TEXT = 1
// var Z_ASCII             = 1; // = Z_TEXT
    var Z_UNKNOWN = 2

/* ============================================================================ */

    function zero (buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0 } }

// From zutil.h

    var STORED_BLOCK = 0
    var STATIC_TREES = 1
    var DYN_TREES = 2
/* The three kinds of block type */

    var MIN_MATCH = 3
    var MAX_MATCH = 258
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

    var LENGTH_CODES = 29
/* number of length codes, not counting the special END_BLOCK code */

    var LITERALS = 256
/* number of literal bytes 0..255 */

    var L_CODES = LITERALS + 1 + LENGTH_CODES
/* number of Literal or Length codes, including the END_BLOCK code */

    var D_CODES = 30
/* number of distance codes */

    var BL_CODES = 19
/* number of codes used to transfer the bit lengths */

    var HEAP_SIZE = 2 * L_CODES + 1
/* maximum heap size */

    var MAX_BITS = 15
/* All codes must not exceed MAX_BITS bits */

    var Buf_size = 16
/* size of bit buffer in bi_buf */

/* ===========================================================================
 * Constants
 */

    var MAX_BL_BITS = 7
/* Bit length codes must not exceed MAX_BL_BITS bits */

    var END_BLOCK = 256
/* end of block literal code */

    var REP_3_6 = 16
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

    var REPZ_3_10 = 17
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

    var REPZ_11_138 = 18
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

    var extra_lbits =   /* extra bits for each length code */
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]

    var extra_dbits =   /* extra bits for each distance code */
  [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]

    var extra_blbits =  /* extra bits for each bit length code */
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]

    var bl_order =
  [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

    var DIST_CODE_LEN = 512 /* see definition of array dist_code below */

// !!!! Use flat array insdead of structure, Freq = i*2, Len = i*2+1
    var static_ltree = new Array((L_CODES + 2) * 2)
    zero(static_ltree)
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

    var static_dtree = new Array(D_CODES * 2)
    zero(static_dtree)
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

    var _dist_code = new Array(DIST_CODE_LEN)
    zero(_dist_code)
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

    var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1)
    zero(_length_code)
/* length code for each normalized match length (0 == MIN_MATCH) */

    var base_length = new Array(LENGTH_CODES)
    zero(base_length)
/* First normalized length for each code (0 = MIN_MATCH) */

    var base_dist = new Array(D_CODES)
    zero(base_dist)
/* First normalized distance for each code (0 = distance of 1) */

    var StaticTreeDesc = function (static_tree, extra_bits, extra_base, elems, max_length) {
      this.static_tree = static_tree  /* static tree or NULL */
      this.extra_bits = extra_bits   /* extra bits for each code or NULL */
      this.extra_base = extra_base   /* base index for extra_bits */
      this.elems = elems        /* max number of elements in the tree */
      this.max_length = max_length   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
      this.has_stree = static_tree && static_tree.length
    }

    var static_l_desc
    var static_d_desc
    var static_bl_desc

    var TreeDesc = function (dyn_tree, stat_desc) {
      this.dyn_tree = dyn_tree     /* the dynamic tree */
      this.max_code = 0            /* largest code with non zero frequency */
      this.stat_desc = stat_desc   /* the corresponding static tree */
    }

    function d_code (dist) {
      return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)]
    }

/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
    function put_short (s, w) {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
      s.pending_buf[s.pending++] = (w) & 0xff
      s.pending_buf[s.pending++] = (w >>> 8) & 0xff
    }

/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
    function send_bits (s, value, length) {
      if (s.bi_valid > (Buf_size - length)) {
        s.bi_buf |= (value << s.bi_valid) & 0xffff
        put_short(s, s.bi_buf)
        s.bi_buf = value >> (Buf_size - s.bi_valid)
        s.bi_valid += length - Buf_size
      } else {
        s.bi_buf |= (value << s.bi_valid) & 0xffff
        s.bi_valid += length
      }
    }

    function send_code (s, c, tree) {
      send_bits(s, tree[c * 2]/* .Code */, tree[c * 2 + 1]/* .Len */)
    }

/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
    function bi_reverse (code, len) {
      var res = 0
      do {
        res |= code & 1
        code >>>= 1
        res <<= 1
      } while (--len > 0)
      return res >>> 1
    }

/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
    function bi_flush (s) {
      if (s.bi_valid === 16) {
        put_short(s, s.bi_buf)
        s.bi_buf = 0
        s.bi_valid = 0
      } else if (s.bi_valid >= 8) {
        s.pending_buf[s.pending++] = s.bi_buf & 0xff
        s.bi_buf >>= 8
        s.bi_valid -= 8
      }
    }

/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
    function gen_bitlen (s, desc)
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */
{
      var tree = desc.dyn_tree
      var max_code = desc.max_code
      var stree = desc.stat_desc.static_tree
      var has_stree = desc.stat_desc.has_stree
      var extra = desc.stat_desc.extra_bits
      var base = desc.stat_desc.extra_base
      var max_length = desc.stat_desc.max_length
      var h              /* heap index */
      var n, m           /* iterate over the tree elements */
      var bits           /* bit length */
      var xbits          /* extra bits */
      var f              /* frequency */
      var overflow = 0   /* number of elements with bit length too large */

      for (bits = 0; bits <= MAX_BITS; bits++) {
        s.bl_count[bits] = 0
      }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
      tree[s.heap[s.heap_max] * 2 + 1]/* .Len */ = 0 /* root of the heap */

      for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
        n = s.heap[h]
        bits = tree[tree[n * 2 + 1]/* .Dad */ * 2 + 1]/* .Len */ + 1
        if (bits > max_length) {
          bits = max_length
          overflow++
        }
        tree[n * 2 + 1]/* .Len */ = bits
    /* We overwrite tree[n].Dad which is no longer needed */

        if (n > max_code) { continue } /* not a leaf node */

        s.bl_count[bits]++
        xbits = 0
        if (n >= base) {
          xbits = extra[n - base]
        }
        f = tree[n * 2]/* .Freq */
        s.opt_len += f * (bits + xbits)
        if (has_stree) {
          s.static_len += f * (stree[n * 2 + 1]/* .Len */ + xbits)
        }
      }
      if (overflow === 0) { return }

  // Trace((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
      do {
        bits = max_length - 1
        while (s.bl_count[bits] === 0) { bits-- }
        s.bl_count[bits]--      /* move one leaf down the tree */
        s.bl_count[bits + 1] += 2 /* move one overflow item as its brother */
        s.bl_count[max_length]--
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
        overflow -= 2
      } while (overflow > 0)

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
      for (bits = max_length; bits !== 0; bits--) {
        n = s.bl_count[bits]
        while (n !== 0) {
          m = s.heap[--h]
          if (m > max_code) { continue }
          if (tree[m * 2 + 1]/* .Len */ !== bits) {
        // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
            s.opt_len += (bits - tree[m * 2 + 1]/* .Len */) * tree[m * 2]/* .Freq */
            tree[m * 2 + 1]/* .Len */ = bits
          }
          n--
        }
      }
    }

/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
    function gen_codes (tree, max_code, bl_count)
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */
{
      var next_code = new Array(MAX_BITS + 1) /* next code value for each bit length */
      var code = 0              /* running code value */
      var bits                  /* bit index */
      var n                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
      for (bits = 1; bits <= MAX_BITS; bits++) {
        next_code[bits] = code = (code + bl_count[bits - 1]) << 1
      }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  // Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  // Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

      for (n = 0; n <= max_code; n++) {
        var len = tree[n * 2 + 1]/* .Len */
        if (len === 0) { continue }
    /* Now reverse the bits */
        tree[n * 2]/* .Code */ = bi_reverse(next_code[len]++, len)

    // Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
      }
    }

/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
    function tr_static_init () {
      var n        /* iterates over tree elements */
      var bits     /* bit counter */
      var length   /* length value */
      var code     /* code value */
      var dist     /* distance index */
      var bl_count = new Array(MAX_BITS + 1)
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  // if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/* #ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif */

  /* Initialize the mapping length (0..255) -> length code (0..28) */
      length = 0
      for (code = 0; code < LENGTH_CODES - 1; code++) {
        base_length[code] = length
        for (n = 0; n < (1 << extra_lbits[code]); n++) {
          _length_code[length++] = code
        }
      }
  // Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
      _length_code[length - 1] = code

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
      dist = 0
      for (code = 0; code < 16; code++) {
        base_dist[code] = dist
        for (n = 0; n < (1 << extra_dbits[code]); n++) {
          _dist_code[dist++] = code
        }
      }
  // Assert (dist == 256, "tr_static_init: dist != 256");
      dist >>= 7 /* from now on, all distances are divided by 128 */
      for (; code < D_CODES; code++) {
        base_dist[code] = dist << 7
        for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
          _dist_code[256 + dist++] = code
        }
      }
  // Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
      for (bits = 0; bits <= MAX_BITS; bits++) {
        bl_count[bits] = 0
      }

      n = 0
      while (n <= 143) {
        static_ltree[n * 2 + 1]/* .Len */ = 8
        n++
        bl_count[8]++
      }
      while (n <= 255) {
        static_ltree[n * 2 + 1]/* .Len */ = 9
        n++
        bl_count[9]++
      }
      while (n <= 279) {
        static_ltree[n * 2 + 1]/* .Len */ = 7
        n++
        bl_count[7]++
      }
      while (n <= 287) {
        static_ltree[n * 2 + 1]/* .Len */ = 8
        n++
        bl_count[8]++
      }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
      gen_codes(static_ltree, L_CODES + 1, bl_count)

  /* The static distance tree is trivial: */
      for (n = 0; n < D_CODES; n++) {
        static_dtree[n * 2 + 1]/* .Len */ = 5
        static_dtree[n * 2]/* .Code */ = bi_reverse(n, 5)
      }

  // Now data ready and we can init static trees
      static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS)
      static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS)
      static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS)

  // static_init_done = true;
    }

/* ===========================================================================
 * Initialize a new block.
 */
    function init_block (s) {
      var n /* iterates over tree elements */

  /* Initialize the trees. */
      for (n = 0; n < L_CODES; n++) { s.dyn_ltree[n * 2]/* .Freq */ = 0 }
      for (n = 0; n < D_CODES; n++) { s.dyn_dtree[n * 2]/* .Freq */ = 0 }
      for (n = 0; n < BL_CODES; n++) { s.bl_tree[n * 2]/* .Freq */ = 0 }

      s.dyn_ltree[END_BLOCK * 2]/* .Freq */ = 1
      s.opt_len = s.static_len = 0
      s.last_lit = s.matches = 0
    }

/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
    function bi_windup (s) {
      if (s.bi_valid > 8) {
        put_short(s, s.bi_buf)
      } else if (s.bi_valid > 0) {
    // put_byte(s, (Byte)s->bi_buf);
        s.pending_buf[s.pending++] = s.bi_buf
      }
      s.bi_buf = 0
      s.bi_valid = 0
    }

/* ===========================================================================
 * Copy a stored block, storing first the length and its
 * one's complement if requested.
 */
    function copy_block (s, buf, len, header)
// DeflateState *s;
// charf    *buf;    /* the input data */
// unsigned len;     /* its length */
// int      header;  /* true if block header must be written */
{
      bi_windup(s)        /* align on byte boundary */

      if (header) {
        put_short(s, len)
        put_short(s, ~len)
      }
//  while (len--) {
//    put_byte(s, *buf++);
//  }
      utils.arraySet(s.pending_buf, s.window, buf, len, s.pending)
      s.pending += len
    }

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
    function smaller (tree, n, m, depth) {
      var _n2 = n * 2
      var _m2 = m * 2
      return (tree[_n2]/* .Freq */ < tree[_m2]/* .Freq */ ||
         (tree[_n2]/* .Freq */ === tree[_m2]/* .Freq */ && depth[n] <= depth[m]))
    }

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
    function pqdownheap (s, tree, k)
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */
{
      var v = s.heap[k]
      var j = k << 1  /* left son of k */
      while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
        if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
          j++
        }
    /* Exit if v is smaller than both sons */
        if (smaller(tree, v, s.heap[j], s.depth)) { break }

    /* Exchange v with the smallest son */
        s.heap[k] = s.heap[j]
        k = j

    /* And continue down the tree, setting j to the left son of k */
        j <<= 1
      }
      s.heap[k] = v
    }

// inlined manually
// var SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
    function compress_block (s, ltree, dtree)
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */
{
      var dist           /* distance of matched string */
      var lc             /* match length or unmatched char (if dist == 0) */
      var lx = 0         /* running index in l_buf */
      var code           /* the code to send */
      var extra          /* number of extra bits to send */

      if (s.last_lit !== 0) {
        do {
          dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1])
          lc = s.pending_buf[s.l_buf + lx]
          lx++

          if (dist === 0) {
            send_code(s, lc, ltree) /* send a literal byte */
        // Tracecv(isgraph(lc), (stderr," '%c' ", lc));
          } else {
        /* Here, lc is the match length - MIN_MATCH */
            code = _length_code[lc]
            send_code(s, code + LITERALS + 1, ltree) /* send the length code */
            extra = extra_lbits[code]
            if (extra !== 0) {
              lc -= base_length[code]
              send_bits(s, lc, extra)       /* send the extra length bits */
            }
            dist-- /* dist is now the match distance - 1 */
            code = d_code(dist)
        // Assert (code < D_CODES, "bad d_code");

            send_code(s, code, dtree)       /* send the distance code */
            extra = extra_dbits[code]
            if (extra !== 0) {
              dist -= base_dist[code]
              send_bits(s, dist, extra)   /* send the extra distance bits */
            }
          } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
      // Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
      //       "pendingBuf overflow");
        } while (lx < s.last_lit)
      }

      send_code(s, END_BLOCK, ltree)
    }

/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
    function build_tree (s, desc)
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */
{
      var tree = desc.dyn_tree
      var stree = desc.stat_desc.static_tree
      var has_stree = desc.stat_desc.has_stree
      var elems = desc.stat_desc.elems
      var n, m          /* iterate over heap elements */
      var max_code = -1 /* largest code with non zero frequency */
      var node          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
      s.heap_len = 0
      s.heap_max = HEAP_SIZE

      for (n = 0; n < elems; n++) {
        if (tree[n * 2]/* .Freq */ !== 0) {
          s.heap[++s.heap_len] = max_code = n
          s.depth[n] = 0
        } else {
          tree[n * 2 + 1]/* .Len */ = 0
        }
      }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
      while (s.heap_len < 2) {
        node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0)
        tree[node * 2]/* .Freq */ = 1
        s.depth[node] = 0
        s.opt_len--

        if (has_stree) {
          s.static_len -= stree[node * 2 + 1]/* .Len */
        }
    /* node is 0 or 1 so it does not have extra bits */
      }
      desc.max_code = max_code

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
      for (n = (s.heap_len >> 1/* int /2 */); n >= 1; n--) { pqdownheap(s, tree, n) }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
      node = elems              /* next internal node of the tree */
      do {
    // pqremove(s, tree, n);  /* n = node of least frequency */
    /** * pqremove ***/
        n = s.heap[1/* SMALLEST */]
        s.heap[1/* SMALLEST */] = s.heap[s.heap_len--]
        pqdownheap(s, tree, 1/* SMALLEST */)
    /***/

        m = s.heap[1/* SMALLEST */] /* m = node of next least frequency */

        s.heap[--s.heap_max] = n /* keep the nodes sorted by frequency */
        s.heap[--s.heap_max] = m

    /* Create a new node father of n and m */
        tree[node * 2]/* .Freq */ = tree[n * 2]/* .Freq */ + tree[m * 2]/* .Freq */
        s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1
        tree[n * 2 + 1]/* .Dad */ = tree[m * 2 + 1]/* .Dad */ = node

    /* and insert the new node in the heap */
        s.heap[1/* SMALLEST */] = node++
        pqdownheap(s, tree, 1/* SMALLEST */)
      } while (s.heap_len >= 2)

      s.heap[--s.heap_max] = s.heap[1/* SMALLEST */]

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
      gen_bitlen(s, desc)

  /* The field len is now set, we can generate the bit codes */
      gen_codes(tree, max_code, s.bl_count)
    }

/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
    function scan_tree (s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */
{
      var n                     /* iterates over all tree elements */
      var prevlen = -1          /* last emitted length */
      var curlen                /* length of current code */

      var nextlen = tree[0 * 2 + 1]/* .Len */ /* length of next code */

      var count = 0             /* repeat count of the current code */
      var max_count = 7         /* max repeat count */
      var min_count = 4         /* min repeat count */

      if (nextlen === 0) {
        max_count = 138
        min_count = 3
      }
      tree[(max_code + 1) * 2 + 1]/* .Len */ = 0xffff /* guard */

      for (n = 0; n <= max_code; n++) {
        curlen = nextlen
        nextlen = tree[(n + 1) * 2 + 1]/* .Len */

        if (++count < max_count && curlen === nextlen) {
          continue
        } else if (count < min_count) {
          s.bl_tree[curlen * 2]/* .Freq */ += count
        } else if (curlen !== 0) {
          if (curlen !== prevlen) { s.bl_tree[curlen * 2]/* .Freq */++ }
          s.bl_tree[REP_3_6 * 2]/* .Freq */++
        } else if (count <= 10) {
          s.bl_tree[REPZ_3_10 * 2]/* .Freq */++
        } else {
          s.bl_tree[REPZ_11_138 * 2]/* .Freq */++
        }

        count = 0
        prevlen = curlen

        if (nextlen === 0) {
          max_count = 138
          min_count = 3
        } else if (curlen === nextlen) {
          max_count = 6
          min_count = 3
        } else {
          max_count = 7
          min_count = 4
        }
      }
    }

/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
    function send_tree (s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */
{
      var n                     /* iterates over all tree elements */
      var prevlen = -1          /* last emitted length */
      var curlen                /* length of current code */

      var nextlen = tree[0 * 2 + 1]/* .Len */ /* length of next code */

      var count = 0             /* repeat count of the current code */
      var max_count = 7         /* max repeat count */
      var min_count = 4         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
      if (nextlen === 0) {
        max_count = 138
        min_count = 3
      }

      for (n = 0; n <= max_code; n++) {
        curlen = nextlen
        nextlen = tree[(n + 1) * 2 + 1]/* .Len */

        if (++count < max_count && curlen === nextlen) {
          continue
        } else if (count < min_count) {
          do { send_code(s, curlen, s.bl_tree) } while (--count !== 0)
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            send_code(s, curlen, s.bl_tree)
            count--
          }
      // Assert(count >= 3 && count <= 6, " 3_6?");
          send_code(s, REP_3_6, s.bl_tree)
          send_bits(s, count - 3, 2)
        } else if (count <= 10) {
          send_code(s, REPZ_3_10, s.bl_tree)
          send_bits(s, count - 3, 3)
        } else {
          send_code(s, REPZ_11_138, s.bl_tree)
          send_bits(s, count - 11, 7)
        }

        count = 0
        prevlen = curlen
        if (nextlen === 0) {
          max_count = 138
          min_count = 3
        } else if (curlen === nextlen) {
          max_count = 6
          min_count = 3
        } else {
          max_count = 7
          min_count = 4
        }
      }
    }

/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
    function build_bl_tree (s) {
      var max_blindex  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
      scan_tree(s, s.dyn_ltree, s.l_desc.max_code)
      scan_tree(s, s.dyn_dtree, s.d_desc.max_code)

  /* Build the bit length tree: */
      build_tree(s, s.bl_desc)
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
      for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
        if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/* .Len */ !== 0) {
          break
        }
      }
  /* Update opt_len to include the bit length tree and counts */
      s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4
  // Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

      return max_blindex
    }

/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
    function send_all_trees (s, lcodes, dcodes, blcodes)
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
{
      var rank                    /* index in bl_order */

  // Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  // Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  // Tracev((stderr, "\nbl counts: "));
      send_bits(s, lcodes - 257, 5) /* not +255 as stated in appnote.txt */
      send_bits(s, dcodes - 1, 5)
      send_bits(s, blcodes - 4, 4) /* not -3 as stated in appnote.txt */
      for (rank = 0; rank < blcodes; rank++) {
    // Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
        send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/* .Len */, 3)
      }
  // Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

      send_tree(s, s.dyn_ltree, lcodes - 1) /* literal tree */
  // Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

      send_tree(s, s.dyn_dtree, dcodes - 1) /* distance tree */
  // Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
    }

/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "black list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
    function detect_data_type (s) {
  /* black_mask is the bit mask of black-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
      var black_mask = 0xf3ffc07f
      var n

  /* Check for non-textual ("black-listed") bytes. */
      for (n = 0; n <= 31; n++, black_mask >>>= 1) {
        if ((black_mask & 1) && (s.dyn_ltree[n * 2]/* .Freq */ !== 0)) {
          return Z_BINARY
        }
      }

  /* Check for textual ("white-listed") bytes. */
      if (s.dyn_ltree[9 * 2]/* .Freq */ !== 0 || s.dyn_ltree[10 * 2]/* .Freq */ !== 0 ||
      s.dyn_ltree[13 * 2]/* .Freq */ !== 0) {
        return Z_TEXT
      }
      for (n = 32; n < LITERALS; n++) {
        if (s.dyn_ltree[n * 2]/* .Freq */ !== 0) {
          return Z_TEXT
        }
      }

  /* There are no "black-listed" or "white-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
      return Z_BINARY
    }

    var static_init_done = false

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
    function _tr_init (s) {
      if (!static_init_done) {
        tr_static_init()
        static_init_done = true
      }

      s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc)
      s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc)
      s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc)

      s.bi_buf = 0
      s.bi_valid = 0

  /* Initialize the first block of the first file: */
      init_block(s)
    }

/* ===========================================================================
 * Send a stored block
 */
    function _tr_stored_block (s, buf, stored_len, last)
// DeflateState *s;
// charf *buf;       /* input block */
// ulg stored_len;   /* length of input block */
// int last;         /* one if this is the last block for a file */
{
      send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3)    /* send block type */
      copy_block(s, buf, stored_len, true) /* with header */
    }

/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
    function _tr_align (s) {
      send_bits(s, STATIC_TREES << 1, 3)
      send_code(s, END_BLOCK, static_ltree)
      bi_flush(s)
    }

/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 */
    function _tr_flush_block (s, buf, stored_len, last)
// DeflateState *s;
// charf *buf;       /* input block, or NULL if too old */
// ulg stored_len;   /* length of input block */
// int last;         /* one if this is the last block for a file */
{
      var opt_lenb, static_lenb  /* opt_len and static_len in bytes */
      var max_blindex = 0        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
      if (s.level > 0) {
    /* Check if the file is binary or text */
        if (s.strm.data_type === Z_UNKNOWN) {
          s.strm.data_type = detect_data_type(s)
        }

    /* Construct the literal and distance trees */
        build_tree(s, s.l_desc)
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

        build_tree(s, s.d_desc)
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
        max_blindex = build_bl_tree(s)

    /* Determine the best encoding. Compute the block lengths in bytes. */
        opt_lenb = (s.opt_len + 3 + 7) >>> 3
        static_lenb = (s.static_len + 3 + 7) >>> 3

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->last_lit));

        if (static_lenb <= opt_lenb) { opt_lenb = static_lenb }
      } else {
    // Assert(buf != (char*)0, "lost buf");
        opt_lenb = static_lenb = stored_len + 5 /* force a stored block */
      }

      if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
        _tr_stored_block(s, buf, stored_len, last)
      } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
        send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3)
        compress_block(s, static_ltree, static_dtree)
      } else {
        send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3)
        send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1)
        compress_block(s, s.dyn_ltree, s.dyn_dtree)
      }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
      init_block(s)

      if (last) {
        bi_windup(s)
      }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
    }

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
    function _tr_tally (s, dist, lc)
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
{
  // var out_length, in_length, dcode;

      s.pending_buf[s.d_buf + s.last_lit * 2] = (dist >>> 8) & 0xff
      s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff

      s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff
      s.last_lit++

      if (dist === 0) {
    /* lc is the unmatched char */
        s.dyn_ltree[lc * 2]/* .Freq */++
      } else {
        s.matches++
    /* Here, lc is the match length - MIN_MATCH */
        dist--             /* dist = match distance - 1 */
    // Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

        s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]/* .Freq */++
        s.dyn_dtree[d_code(dist) * 2]/* .Freq */++
      }

// (!) This block is disabled in zlib defailts,
// don't enable it for binary compatibility

// #ifdef TRUNCATE_BLOCK
//  /* Try to guess if it is profitable to stop the current block here */
//  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
//    /* Compute an upper bound for the compressed length */
//    out_length = s.last_lit*8;
//    in_length = s.strstart - s.block_start;
//
//    for (dcode = 0; dcode < D_CODES; dcode++) {
//      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
//    }
//    out_length >>>= 3;
//    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
//    //       s->last_lit, in_length, out_length,
//    //       100L - out_length*100L/in_length));
//    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
//      return true;
//    }
//  }
// #endif

      return (s.last_lit === s.lit_bufsize - 1)
  /* We avoid equality with lit_bufsize because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */
    }

    exports._tr_init = _tr_init
    exports._tr_stored_block = _tr_stored_block
    exports._tr_flush_block = _tr_flush_block
    exports._tr_tally = _tr_tally
    exports._tr_align = _tr_align
  }, {'../utils/common': 4}],
  14: [function (require, module, exports) {
    'use strict'

    function ZStream () {
  /* next input byte */
      this.input = null // JS specific, because we have no pointers
      this.next_in = 0
  /* number of bytes available at input */
      this.avail_in = 0
  /* total number of input bytes read so far */
      this.total_in = 0
  /* next output byte should be put there */
      this.output = null // JS specific, because we have no pointers
      this.next_out = 0
  /* remaining free space at output */
      this.avail_out = 0
  /* total number of bytes output so far */
      this.total_out = 0
  /* last error message, NULL if no error */
      this.msg = ''/* Z_NULL */
  /* not visible by applications */
      this.state = null
  /* best guess about the data type: binary or text */
      this.data_type = 2/* Z_UNKNOWN */
  /* adler32 value of the uncompressed data */
      this.adler = 0
    }

    module.exports = ZStream
  }, {}],
  15: [function (require, module, exports) {
    (function (process, Buffer) {
      var msg = require('pako/lib/zlib/messages')
      var zstream = require('pako/lib/zlib/zstream')
      var zlib_deflate = require('pako/lib/zlib/deflate.js')
      var zlib_inflate = require('pako/lib/zlib/inflate.js')
      var constants = require('pako/lib/zlib/constants')

      for (var key in constants) {
        exports[key] = constants[key]
      }

// zlib modes
      exports.NONE = 0
      exports.DEFLATE = 1
      exports.INFLATE = 2
      exports.GZIP = 3
      exports.GUNZIP = 4
      exports.DEFLATERAW = 5
      exports.INFLATERAW = 6
      exports.UNZIP = 7

/**
 * Emulate Node's zlib C++ layer for use by the JS layer in index.js
 */
      function Zlib (mode) {
        if (mode < exports.DEFLATE || mode > exports.UNZIP) { throw new TypeError('Bad argument') }

        this.mode = mode
        this.init_done = false
        this.write_in_progress = false
        this.pending_close = false
        this.windowBits = 0
        this.level = 0
        this.memLevel = 0
        this.strategy = 0
        this.dictionary = null
      }

      Zlib.prototype.init = function (windowBits, level, memLevel, strategy, dictionary) {
        this.windowBits = windowBits
        this.level = level
        this.memLevel = memLevel
        this.strategy = strategy
  // dictionary not supported.

        if (this.mode === exports.GZIP || this.mode === exports.GUNZIP) { this.windowBits += 16 }

        if (this.mode === exports.UNZIP) { this.windowBits += 32 }

        if (this.mode === exports.DEFLATERAW || this.mode === exports.INFLATERAW) { this.windowBits = -this.windowBits }

        this.strm = new zstream()

        switch (this.mode) {
          case exports.DEFLATE:
          case exports.GZIP:
          case exports.DEFLATERAW:
            var status = zlib_deflate.deflateInit2(
        this.strm,
        this.level,
        exports.Z_DEFLATED,
        this.windowBits,
        this.memLevel,
        this.strategy
      )
            break
          case exports.INFLATE:
          case exports.GUNZIP:
          case exports.INFLATERAW:
          case exports.UNZIP:
            var status = zlib_inflate.inflateInit2(
        this.strm,
        this.windowBits
      )
            break
          default:
            throw new Error('Unknown mode ' + this.mode)
        }

        if (status !== exports.Z_OK) {
          this._error(status)
          return
        }

        this.write_in_progress = false
        this.init_done = true
      }

      Zlib.prototype.params = function () {
        throw new Error('deflateParams Not supported')
      }

      Zlib.prototype._writeCheck = function () {
        if (!this.init_done) { throw new Error('write before init') }

        if (this.mode === exports.NONE) { throw new Error('already finalized') }

        if (this.write_in_progress) { throw new Error('write already in progress') }

        if (this.pending_close) { throw new Error('close is pending') }
      }

      Zlib.prototype.write = function (flush, input, in_off, in_len, out, out_off, out_len) {
        this._writeCheck()
        this.write_in_progress = true

        var self = this
        process.nextTick(function () {
          self.write_in_progress = false
          var res = self._write(flush, input, in_off, in_len, out, out_off, out_len)
          self.callback(res[0], res[1])

          if (self.pending_close) { self.close() }
        })

        return this
      }

// set method for Node buffers, used by pako
      function bufferSet (data, offset) {
        for (var i = 0; i < data.length; i++) {
          this[offset + i] = data[i]
        }
      }

      Zlib.prototype.writeSync = function (flush, input, in_off, in_len, out, out_off, out_len) {
        this._writeCheck()
        return this._write(flush, input, in_off, in_len, out, out_off, out_len)
      }

      Zlib.prototype._write = function (flush, input, in_off, in_len, out, out_off, out_len) {
        this.write_in_progress = true

        if (flush !== exports.Z_NO_FLUSH &&
      flush !== exports.Z_PARTIAL_FLUSH &&
      flush !== exports.Z_SYNC_FLUSH &&
      flush !== exports.Z_FULL_FLUSH &&
      flush !== exports.Z_FINISH &&
      flush !== exports.Z_BLOCK) {
          throw new Error('Invalid flush value')
        }

        if (input == null) {
          input = new Buffer(0)
          in_len = 0
          in_off = 0
        }

        if (out._set) { out.set = out._set } else { out.set = bufferSet }

        var strm = this.strm
        strm.avail_in = in_len
        strm.input = input
        strm.next_in = in_off
        strm.avail_out = out_len
        strm.output = out
        strm.next_out = out_off

        switch (this.mode) {
          case exports.DEFLATE:
          case exports.GZIP:
          case exports.DEFLATERAW:
            var status = zlib_deflate.deflate(strm, flush)
            break
          case exports.UNZIP:
          case exports.INFLATE:
          case exports.GUNZIP:
          case exports.INFLATERAW:
            var status = zlib_inflate.inflate(strm, flush)
            break
          default:
            throw new Error('Unknown mode ' + this.mode)
        }

        if (status !== exports.Z_STREAM_END && status !== exports.Z_OK) {
          this._error(status)
        }

        this.write_in_progress = false
        return [strm.avail_in, strm.avail_out]
      }

      Zlib.prototype.close = function () {
        if (this.write_in_progress) {
          this.pending_close = true
          return
        }

        this.pending_close = false

        if (this.mode === exports.DEFLATE || this.mode === exports.GZIP || this.mode === exports.DEFLATERAW) {
          zlib_deflate.deflateEnd(this.strm)
        } else {
          zlib_inflate.inflateEnd(this.strm)
        }

        this.mode = exports.NONE
      }

      Zlib.prototype.reset = function () {
        switch (this.mode) {
          case exports.DEFLATE:
          case exports.DEFLATERAW:
            var status = zlib_deflate.deflateReset(this.strm)
            break
          case exports.INFLATE:
          case exports.INFLATERAW:
            var status = zlib_inflate.inflateReset(this.strm)
            break
        }

        if (status !== exports.Z_OK) {
          this._error(status)
        }
      }

      Zlib.prototype._error = function (status) {
        this.onerror(msg[status] + ': ' + this.strm.msg, status)

        this.write_in_progress = false
        if (this.pending_close) { this.close() }
      }

      exports.Zlib = Zlib
    }).call(this, require('_process'), require('buffer').Buffer)
  }, {'_process': 24, 'buffer': 17, 'pako/lib/zlib/constants': 6, 'pako/lib/zlib/deflate.js': 8, 'pako/lib/zlib/inflate.js': 10, 'pako/lib/zlib/messages': 12, 'pako/lib/zlib/zstream': 14}],
  16: [function (require, module, exports) {
    (function (process, Buffer) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

      var Transform = require('_stream_transform')

      var binding = require('./binding')
      var util = require('util')
      var assert = require('assert').ok

// zlib doesn't provide these, so kludge them in following the same
// const naming scheme zlib uses.
      binding.Z_MIN_WINDOWBITS = 8
      binding.Z_MAX_WINDOWBITS = 15
      binding.Z_DEFAULT_WINDOWBITS = 15

// fewer than 64 bytes per chunk is stupid.
// technically it could work with as few as 8, but even 64 bytes
// is absurdly low.  Usually a MB or more is best.
      binding.Z_MIN_CHUNK = 64
      binding.Z_MAX_CHUNK = Infinity
      binding.Z_DEFAULT_CHUNK = (16 * 1024)

      binding.Z_MIN_MEMLEVEL = 1
      binding.Z_MAX_MEMLEVEL = 9
      binding.Z_DEFAULT_MEMLEVEL = 8

      binding.Z_MIN_LEVEL = -1
      binding.Z_MAX_LEVEL = 9
      binding.Z_DEFAULT_LEVEL = binding.Z_DEFAULT_COMPRESSION

// expose all the zlib constants
      Object.keys(binding).forEach(function (k) {
        if (k.match(/^Z/)) exports[k] = binding[k]
      })

// translation table for return codes.
      exports.codes = {
        Z_OK: binding.Z_OK,
        Z_STREAM_END: binding.Z_STREAM_END,
        Z_NEED_DICT: binding.Z_NEED_DICT,
        Z_ERRNO: binding.Z_ERRNO,
        Z_STREAM_ERROR: binding.Z_STREAM_ERROR,
        Z_DATA_ERROR: binding.Z_DATA_ERROR,
        Z_MEM_ERROR: binding.Z_MEM_ERROR,
        Z_BUF_ERROR: binding.Z_BUF_ERROR,
        Z_VERSION_ERROR: binding.Z_VERSION_ERROR
      }

      Object.keys(exports.codes).forEach(function (k) {
        exports.codes[exports.codes[k]] = k
      })

      exports.Deflate = Deflate
      exports.Inflate = Inflate
      exports.Gzip = Gzip
      exports.Gunzip = Gunzip
      exports.DeflateRaw = DeflateRaw
      exports.InflateRaw = InflateRaw
      exports.Unzip = Unzip

      exports.createDeflate = function (o) {
        return new Deflate(o)
      }

      exports.createInflate = function (o) {
        return new Inflate(o)
      }

      exports.createDeflateRaw = function (o) {
        return new DeflateRaw(o)
      }

      exports.createInflateRaw = function (o) {
        return new InflateRaw(o)
      }

      exports.createGzip = function (o) {
        return new Gzip(o)
      }

      exports.createGunzip = function (o) {
        return new Gunzip(o)
      }

      exports.createUnzip = function (o) {
        return new Unzip(o)
      }

// Convenience methods.
// compress/decompress a string or buffer in one step.
      exports.deflate = function (buffer, opts, callback) {
        if (typeof opts === 'function') {
          callback = opts
          opts = {}
        }
        return zlibBuffer(new Deflate(opts), buffer, callback)
      }

      exports.deflateSync = function (buffer, opts) {
        return zlibBufferSync(new Deflate(opts), buffer)
      }

      exports.gzip = function (buffer, opts, callback) {
        if (typeof opts === 'function') {
          callback = opts
          opts = {}
        }
        return zlibBuffer(new Gzip(opts), buffer, callback)
      }

      exports.gzipSync = function (buffer, opts) {
        return zlibBufferSync(new Gzip(opts), buffer)
      }

      exports.deflateRaw = function (buffer, opts, callback) {
        if (typeof opts === 'function') {
          callback = opts
          opts = {}
        }
        return zlibBuffer(new DeflateRaw(opts), buffer, callback)
      }

      exports.deflateRawSync = function (buffer, opts) {
        return zlibBufferSync(new DeflateRaw(opts), buffer)
      }

      exports.unzip = function (buffer, opts, callback) {
        if (typeof opts === 'function') {
          callback = opts
          opts = {}
        }
        return zlibBuffer(new Unzip(opts), buffer, callback)
      }

      exports.unzipSync = function (buffer, opts) {
        return zlibBufferSync(new Unzip(opts), buffer)
      }

      exports.inflate = function (buffer, opts, callback) {
        if (typeof opts === 'function') {
          callback = opts
          opts = {}
        }
        return zlibBuffer(new Inflate(opts), buffer, callback)
      }

      exports.inflateSync = function (buffer, opts) {
        return zlibBufferSync(new Inflate(opts), buffer)
      }

      exports.gunzip = function (buffer, opts, callback) {
        if (typeof opts === 'function') {
          callback = opts
          opts = {}
        }
        return zlibBuffer(new Gunzip(opts), buffer, callback)
      }

      exports.gunzipSync = function (buffer, opts) {
        return zlibBufferSync(new Gunzip(opts), buffer)
      }

      exports.inflateRaw = function (buffer, opts, callback) {
        if (typeof opts === 'function') {
          callback = opts
          opts = {}
        }
        return zlibBuffer(new InflateRaw(opts), buffer, callback)
      }

      exports.inflateRawSync = function (buffer, opts) {
        return zlibBufferSync(new InflateRaw(opts), buffer)
      }

      function zlibBuffer (engine, buffer, callback) {
        var buffers = []
        var nread = 0

        engine.on('error', onError)
        engine.on('end', onEnd)

        engine.end(buffer)
        flow()

        function flow () {
          var chunk
          while ((chunk = engine.read()) !== null) {
            buffers.push(chunk)
            nread += chunk.length
          }
          engine.once('readable', flow)
        }

        function onError (err) {
          engine.removeListener('end', onEnd)
          engine.removeListener('readable', flow)
          callback(err)
        }

        function onEnd () {
          var buf = Buffer.concat(buffers, nread)
          buffers = []
          callback(null, buf)
          engine.close()
        }
      }

      function zlibBufferSync (engine, buffer) {
        if (typeof buffer === 'string') { buffer = new Buffer(buffer) }
        if (!Buffer.isBuffer(buffer)) { throw new TypeError('Not a string or buffer') }

        var flushFlag = binding.Z_FINISH

        return engine._processChunk(buffer, flushFlag)
      }

// generic zlib
// minimal 2-byte header
      function Deflate (opts) {
        if (!(this instanceof Deflate)) return new Deflate(opts)
        Zlib.call(this, opts, binding.DEFLATE)
      }

      function Inflate (opts) {
        if (!(this instanceof Inflate)) return new Inflate(opts)
        Zlib.call(this, opts, binding.INFLATE)
      }

// gzip - bigger header, same deflate compression
      function Gzip (opts) {
        if (!(this instanceof Gzip)) return new Gzip(opts)
        Zlib.call(this, opts, binding.GZIP)
      }

      function Gunzip (opts) {
        if (!(this instanceof Gunzip)) return new Gunzip(opts)
        Zlib.call(this, opts, binding.GUNZIP)
      }

// raw - no header
      function DeflateRaw (opts) {
        if (!(this instanceof DeflateRaw)) return new DeflateRaw(opts)
        Zlib.call(this, opts, binding.DEFLATERAW)
      }

      function InflateRaw (opts) {
        if (!(this instanceof InflateRaw)) return new InflateRaw(opts)
        Zlib.call(this, opts, binding.INFLATERAW)
      }

// auto-detect header.
      function Unzip (opts) {
        if (!(this instanceof Unzip)) return new Unzip(opts)
        Zlib.call(this, opts, binding.UNZIP)
      }

// the Zlib class they all inherit from
// This thing manages the queue of requests, and returns
// true or false if there is anything in the queue when
// you call the .write() method.

      function Zlib (opts, mode) {
        this._opts = opts = opts || {}
        this._chunkSize = opts.chunkSize || exports.Z_DEFAULT_CHUNK

        Transform.call(this, opts)

        if (opts.flush) {
          if (opts.flush !== binding.Z_NO_FLUSH &&
        opts.flush !== binding.Z_PARTIAL_FLUSH &&
        opts.flush !== binding.Z_SYNC_FLUSH &&
        opts.flush !== binding.Z_FULL_FLUSH &&
        opts.flush !== binding.Z_FINISH &&
        opts.flush !== binding.Z_BLOCK) {
            throw new Error('Invalid flush flag: ' + opts.flush)
          }
        }
        this._flushFlag = opts.flush || binding.Z_NO_FLUSH

        if (opts.chunkSize) {
          if (opts.chunkSize < exports.Z_MIN_CHUNK ||
        opts.chunkSize > exports.Z_MAX_CHUNK) {
            throw new Error('Invalid chunk size: ' + opts.chunkSize)
          }
        }

        if (opts.windowBits) {
          if (opts.windowBits < exports.Z_MIN_WINDOWBITS ||
        opts.windowBits > exports.Z_MAX_WINDOWBITS) {
            throw new Error('Invalid windowBits: ' + opts.windowBits)
          }
        }

        if (opts.level) {
          if (opts.level < exports.Z_MIN_LEVEL ||
        opts.level > exports.Z_MAX_LEVEL) {
            throw new Error('Invalid compression level: ' + opts.level)
          }
        }

        if (opts.memLevel) {
          if (opts.memLevel < exports.Z_MIN_MEMLEVEL ||
        opts.memLevel > exports.Z_MAX_MEMLEVEL) {
            throw new Error('Invalid memLevel: ' + opts.memLevel)
          }
        }

        if (opts.strategy) {
          if (opts.strategy != exports.Z_FILTERED &&
        opts.strategy != exports.Z_HUFFMAN_ONLY &&
        opts.strategy != exports.Z_RLE &&
        opts.strategy != exports.Z_FIXED &&
        opts.strategy != exports.Z_DEFAULT_STRATEGY) {
            throw new Error('Invalid strategy: ' + opts.strategy)
          }
        }

        if (opts.dictionary) {
          if (!Buffer.isBuffer(opts.dictionary)) {
            throw new Error('Invalid dictionary: it should be a Buffer instance')
          }
        }

        this._binding = new binding.Zlib(mode)

        var self = this
        this._hadError = false
        this._binding.onerror = function (message, errno) {
    // there is no way to cleanly recover.
    // continuing only obscures problems.
          self._binding = null
          self._hadError = true

          var error = new Error(message)
          error.errno = errno
          error.code = exports.codes[errno]
          self.emit('error', error)
        }

        var level = exports.Z_DEFAULT_COMPRESSION
        if (typeof opts.level === 'number') level = opts.level

        var strategy = exports.Z_DEFAULT_STRATEGY
        if (typeof opts.strategy === 'number') strategy = opts.strategy

        this._binding.init(opts.windowBits || exports.Z_DEFAULT_WINDOWBITS,
                     level,
                     opts.memLevel || exports.Z_DEFAULT_MEMLEVEL,
                     strategy,
                     opts.dictionary)

        this._buffer = new Buffer(this._chunkSize)
        this._offset = 0
        this._closed = false
        this._level = level
        this._strategy = strategy

        this.once('end', this.close)
      }

      util.inherits(Zlib, Transform)

      Zlib.prototype.params = function (level, strategy, callback) {
        if (level < exports.Z_MIN_LEVEL ||
      level > exports.Z_MAX_LEVEL) {
          throw new RangeError('Invalid compression level: ' + level)
        }
        if (strategy != exports.Z_FILTERED &&
      strategy != exports.Z_HUFFMAN_ONLY &&
      strategy != exports.Z_RLE &&
      strategy != exports.Z_FIXED &&
      strategy != exports.Z_DEFAULT_STRATEGY) {
          throw new TypeError('Invalid strategy: ' + strategy)
        }

        if (this._level !== level || this._strategy !== strategy) {
          var self = this
          this.flush(binding.Z_SYNC_FLUSH, function () {
            self._binding.params(level, strategy)
            if (!self._hadError) {
              self._level = level
              self._strategy = strategy
              if (callback) callback()
            }
          })
        } else {
          process.nextTick(callback)
        }
      }

      Zlib.prototype.reset = function () {
        return this._binding.reset()
      }

// This is the _flush function called by the transform class,
// internally, when the last chunk has been written.
      Zlib.prototype._flush = function (callback) {
        this._transform(new Buffer(0), '', callback)
      }

      Zlib.prototype.flush = function (kind, callback) {
        var ws = this._writableState

        if (typeof kind === 'function' || (kind === void 0 && !callback)) {
          callback = kind
          kind = binding.Z_FULL_FLUSH
        }

        if (ws.ended) {
          if (callback) { process.nextTick(callback) }
        } else if (ws.ending) {
          if (callback) { this.once('end', callback) }
        } else if (ws.needDrain) {
          var self = this
          this.once('drain', function () {
            self.flush(callback)
          })
        } else {
          this._flushFlag = kind
          this.write(new Buffer(0), '', callback)
        }
      }

      Zlib.prototype.close = function (callback) {
        if (callback) { process.nextTick(callback) }

        if (this._closed) { return }

        this._closed = true

        this._binding.close()

        var self = this
        process.nextTick(function () {
          self.emit('close')
        })
      }

      Zlib.prototype._transform = function (chunk, encoding, cb) {
        var flushFlag
        var ws = this._writableState
        var ending = ws.ending || ws.ended
        var last = ending && (!chunk || ws.length === chunk.length)

        if (!chunk === null && !Buffer.isBuffer(chunk)) { return cb(new Error('invalid input')) }

  // If it's the last chunk, or a final flush, we use the Z_FINISH flush flag.
  // If it's explicitly flushing at some other time, then we use
  // Z_FULL_FLUSH. Otherwise, use Z_NO_FLUSH for maximum compression
  // goodness.
        if (last) { flushFlag = binding.Z_FINISH } else {
          flushFlag = this._flushFlag
    // once we've flushed the last of the queue, stop flushing and
    // go back to the normal behavior.
          if (chunk.length >= ws.length) {
            this._flushFlag = this._opts.flush || binding.Z_NO_FLUSH
          }
        }

        var self = this
        this._processChunk(chunk, flushFlag, cb)
      }

      Zlib.prototype._processChunk = function (chunk, flushFlag, cb) {
        var availInBefore = chunk && chunk.length
        var availOutBefore = this._chunkSize - this._offset
        var inOff = 0

        var self = this

        var async = typeof cb === 'function'

        if (!async) {
          var buffers = []
          var nread = 0

          var error
          this.on('error', function (er) {
            error = er
          })

          do {
            var res = this._binding.writeSync(flushFlag,
                                        chunk, // in
                                        inOff, // in_off
                                        availInBefore, // in_len
                                        this._buffer, // out
                                        this._offset, // out_off
                                        availOutBefore) // out_len
          } while (!this._hadError && callback(res[0], res[1]))

          if (this._hadError) {
            throw error
          }

          var buf = Buffer.concat(buffers, nread)
          this.close()

          return buf
        }

        var req = this._binding.write(flushFlag,
                                chunk, // in
                                inOff, // in_off
                                availInBefore, // in_len
                                this._buffer, // out
                                this._offset, // out_off
                                availOutBefore) // out_len

        req.buffer = chunk
        req.callback = callback

        function callback (availInAfter, availOutAfter) {
          if (self._hadError) { return }

          var have = availOutBefore - availOutAfter
          assert(have >= 0, 'have should not go down')

          if (have > 0) {
            var out = self._buffer.slice(self._offset, self._offset + have)
            self._offset += have
      // serve some output to the consumer.
            if (async) {
              self.push(out)
            } else {
              buffers.push(out)
              nread += out.length
            }
          }

    // exhausted the output buffer, or used all the input create a new one.
          if (availOutAfter === 0 || self._offset >= self._chunkSize) {
            availOutBefore = self._chunkSize
            self._offset = 0
            self._buffer = new Buffer(self._chunkSize)
          }

          if (availOutAfter === 0) {
      // Not actually done.  Need to reprocess.
      // Also, update the availInBefore to the availInAfter value,
      // so that if we have to hit it a third (fourth, etc.) time,
      // it'll have the correct byte counts.
            inOff += (availInBefore - availInAfter)
            availInBefore = availInAfter

            if (!async) { return true }

            var newReq = self._binding.write(flushFlag,
                                       chunk,
                                       inOff,
                                       availInBefore,
                                       self._buffer,
                                       self._offset,
                                       self._chunkSize)
            newReq.callback = callback // this same function
            newReq.buffer = chunk
            return
          }

          if (!async) { return false }

    // finished with the chunk.
          cb()
        }
      }

      util.inherits(Deflate, Zlib)
      util.inherits(Inflate, Zlib)
      util.inherits(Gzip, Zlib)
      util.inherits(Gunzip, Zlib)
      util.inherits(DeflateRaw, Zlib)
      util.inherits(InflateRaw, Zlib)
      util.inherits(Unzip, Zlib)
    }).call(this, require('_process'), require('buffer').Buffer)
  }, {'./binding': 15, '_process': 24, '_stream_transform': 32, 'assert': 2, 'buffer': 17, 'util': 35}],
  17: [function (require, module, exports) {
    (function (global) {
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

      var base64 = require('base64-js')
      var ieee754 = require('ieee754')
      var isArray = require('is-array')

      exports.Buffer = Buffer
      exports.SlowBuffer = SlowBuffer
      exports.INSPECT_MAX_BYTES = 50
      Buffer.poolSize = 8192 // not used by this implementation

      var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
      Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : (function () {
    function Bar () {}
    try {
      var arr = new Uint8Array(1)
      arr.foo = function () { return 42 }
      arr.constructor = Bar
      return arr.foo() === 42 && // typed array instances can be augmented
            arr.constructor === Bar && // constructor can be set
            typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
            arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
    } catch (e) {
      return false
    }
  })()

      function kMaxLength () {
        return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
      }

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
      function Buffer (arg) {
        if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
          if (arguments.length > 1) return new Buffer(arg, arguments[1])
          return new Buffer(arg)
        }

        this.length = 0
        this.parent = undefined

  // Common case.
        if (typeof arg === 'number') {
          return fromNumber(this, arg)
        }

  // Slightly less common case.
        if (typeof arg === 'string') {
          return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
        }

  // Unusual.
        return fromObject(this, arg)
      }

      function fromNumber (that, length) {
        that = allocate(that, length < 0 ? 0 : checked(length) | 0)
        if (!Buffer.TYPED_ARRAY_SUPPORT) {
          for (var i = 0; i < length; i++) {
            that[i] = 0
          }
        }
        return that
      }

      function fromString (that, string, encoding) {
        if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
        var length = byteLength(string, encoding) | 0
        that = allocate(that, length)

        that.write(string, encoding)
        return that
      }

      function fromObject (that, object) {
        if (Buffer.isBuffer(object)) return fromBuffer(that, object)

        if (isArray(object)) return fromArray(that, object)

        if (object == null) {
          throw new TypeError('must start with number, buffer, array or string')
        }

        if (typeof ArrayBuffer !== 'undefined') {
          if (object.buffer instanceof ArrayBuffer) {
            return fromTypedArray(that, object)
          }
          if (object instanceof ArrayBuffer) {
            return fromArrayBuffer(that, object)
          }
        }

        if (object.length) return fromArrayLike(that, object)

        return fromJsonObject(that, object)
      }

      function fromBuffer (that, buffer) {
        var length = checked(buffer.length) | 0
        that = allocate(that, length)
        buffer.copy(that, 0, 0, length)
        return that
      }

      function fromArray (that, array) {
        var length = checked(array.length) | 0
        that = allocate(that, length)
        for (var i = 0; i < length; i += 1) {
          that[i] = array[i] & 255
        }
        return that
      }

// Duplicate of fromArray() to keep fromArray() monomorphic.
      function fromTypedArray (that, array) {
        var length = checked(array.length) | 0
        that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
        for (var i = 0; i < length; i += 1) {
          that[i] = array[i] & 255
        }
        return that
      }

      function fromArrayBuffer (that, array) {
        if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
          array.byteLength
          that = Buffer._augment(new Uint8Array(array))
        } else {
    // Fallback: Return an object instance of the Buffer class
          that = fromTypedArray(that, new Uint8Array(array))
        }
        return that
      }

      function fromArrayLike (that, array) {
        var length = checked(array.length) | 0
        that = allocate(that, length)
        for (var i = 0; i < length; i += 1) {
          that[i] = array[i] & 255
        }
        return that
      }

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
      function fromJsonObject (that, object) {
        var array
        var length = 0

        if (object.type === 'Buffer' && isArray(object.data)) {
          array = object.data
          length = checked(array.length) | 0
        }
        that = allocate(that, length)

        for (var i = 0; i < length; i += 1) {
          that[i] = array[i] & 255
        }
        return that
      }

      if (Buffer.TYPED_ARRAY_SUPPORT) {
        Buffer.prototype.__proto__ = Uint8Array.prototype
        Buffer.__proto__ = Uint8Array
      }

      function allocate (that, length) {
        if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
          that = Buffer._augment(new Uint8Array(length))
          that.__proto__ = Buffer.prototype
        } else {
    // Fallback: Return an object instance of the Buffer class
          that.length = length
          that._isBuffer = true
        }

        var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
        if (fromPool) that.parent = rootParent

        return that
      }

      function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
        if (length >= kMaxLength()) {
          throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
        }
        return length | 0
      }

      function SlowBuffer (subject, encoding) {
        if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

        var buf = new Buffer(subject, encoding)
        delete buf.parent
        return buf
      }

      Buffer.isBuffer = function isBuffer (b) {
        return !!(b != null && b._isBuffer)
      }

      Buffer.compare = function compare (a, b) {
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
          throw new TypeError('Arguments must be Buffers')
        }

        if (a === b) return 0

        var x = a.length
        var y = b.length

        var i = 0
        var len = Math.min(x, y)
        while (i < len) {
          if (a[i] !== b[i]) break

          ++i
        }

        if (i !== len) {
          x = a[i]
          y = b[i]
        }

        if (x < y) return -1
        if (y < x) return 1
        return 0
      }

      Buffer.isEncoding = function isEncoding (encoding) {
        switch (String(encoding).toLowerCase()) {
          case 'hex':
          case 'utf8':
          case 'utf-8':
          case 'ascii':
          case 'binary':
          case 'base64':
          case 'raw':
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return true
          default:
            return false
        }
      }

      Buffer.concat = function concat (list, length) {
        if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

        if (list.length === 0) {
          return new Buffer(0)
        }

        var i
        if (length === undefined) {
          length = 0
          for (i = 0; i < list.length; i++) {
            length += list[i].length
          }
        }

        var buf = new Buffer(length)
        var pos = 0
        for (i = 0; i < list.length; i++) {
          var item = list[i]
          item.copy(buf, pos)
          pos += item.length
        }
        return buf
      }

      function byteLength (string, encoding) {
        if (typeof string !== 'string') string = '' + string

        var len = string.length
        if (len === 0) return 0

  // Use a for loop to avoid recursion
        var loweredCase = false
        for (;;) {
          switch (encoding) {
            case 'ascii':
            case 'binary':
      // Deprecated
            case 'raw':
            case 'raws':
              return len
            case 'utf8':
            case 'utf-8':
              return utf8ToBytes(string).length
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return len * 2
            case 'hex':
              return len >>> 1
            case 'base64':
              return base64ToBytes(string).length
            default:
              if (loweredCase) return utf8ToBytes(string).length // assume utf8
              encoding = ('' + encoding).toLowerCase()
              loweredCase = true
          }
        }
      }
      Buffer.byteLength = byteLength

// pre-set for values that may exist in the future
      Buffer.prototype.length = undefined
      Buffer.prototype.parent = undefined

      function slowToString (encoding, start, end) {
        var loweredCase = false

        start = start | 0
        end = end === undefined || end === Infinity ? this.length : end | 0

        if (!encoding) encoding = 'utf8'
        if (start < 0) start = 0
        if (end > this.length) end = this.length
        if (end <= start) return ''

        while (true) {
          switch (encoding) {
            case 'hex':
              return hexSlice(this, start, end)

            case 'utf8':
            case 'utf-8':
              return utf8Slice(this, start, end)

            case 'ascii':
              return asciiSlice(this, start, end)

            case 'binary':
              return binarySlice(this, start, end)

            case 'base64':
              return base64Slice(this, start, end)

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return utf16leSlice(this, start, end)

            default:
              if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
              encoding = (encoding + '').toLowerCase()
              loweredCase = true
          }
        }
      }

      Buffer.prototype.toString = function toString () {
        var length = this.length | 0
        if (length === 0) return ''
        if (arguments.length === 0) return utf8Slice(this, 0, length)
        return slowToString.apply(this, arguments)
      }

      Buffer.prototype.equals = function equals (b) {
        if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
        if (this === b) return true
        return Buffer.compare(this, b) === 0
      }

      Buffer.prototype.inspect = function inspect () {
        var str = ''
        var max = exports.INSPECT_MAX_BYTES
        if (this.length > 0) {
          str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
          if (this.length > max) str += ' ... '
        }
        return '<Buffer ' + str + '>'
      }

      Buffer.prototype.compare = function compare (b) {
        if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
        if (this === b) return 0
        return Buffer.compare(this, b)
      }

      Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
        if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
        else if (byteOffset < -0x80000000) byteOffset = -0x80000000
        byteOffset >>= 0

        if (this.length === 0) return -1
        if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
        if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

        if (typeof val === 'string') {
          if (val.length === 0) return -1 // special case: looking for empty string always fails
          return String.prototype.indexOf.call(this, val, byteOffset)
        }
        if (Buffer.isBuffer(val)) {
          return arrayIndexOf(this, val, byteOffset)
        }
        if (typeof val === 'number') {
          if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
            return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
          }
          return arrayIndexOf(this, [ val ], byteOffset)
        }

        function arrayIndexOf (arr, val, byteOffset) {
          var foundIndex = -1
          for (var i = 0; byteOffset + i < arr.length; i++) {
            if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
              if (foundIndex === -1) foundIndex = i
              if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
            } else {
              foundIndex = -1
            }
          }
          return -1
        }

        throw new TypeError('val must be string, number or Buffer')
      }

// `get` is deprecated
      Buffer.prototype.get = function get (offset) {
        console.log('.get() is deprecated. Access using array indexes instead.')
        return this.readUInt8(offset)
      }

// `set` is deprecated
      Buffer.prototype.set = function set (v, offset) {
        console.log('.set() is deprecated. Access using array indexes instead.')
        return this.writeUInt8(v, offset)
      }

      function hexWrite (buf, string, offset, length) {
        offset = Number(offset) || 0
        var remaining = buf.length - offset
        if (!length) {
          length = remaining
        } else {
          length = Number(length)
          if (length > remaining) {
            length = remaining
          }
        }

  // must be an even number of digits
        var strLen = string.length
        if (strLen % 2 !== 0) throw new Error('Invalid hex string')

        if (length > strLen / 2) {
          length = strLen / 2
        }
        for (var i = 0; i < length; i++) {
          var parsed = parseInt(string.substr(i * 2, 2), 16)
          if (isNaN(parsed)) throw new Error('Invalid hex string')
          buf[offset + i] = parsed
        }
        return i
      }

      function utf8Write (buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
      }

      function asciiWrite (buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length)
      }

      function binaryWrite (buf, string, offset, length) {
        return asciiWrite(buf, string, offset, length)
      }

      function base64Write (buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length)
      }

      function ucs2Write (buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
      }

      Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
        if (offset === undefined) {
          encoding = 'utf8'
          length = this.length
          offset = 0
  // Buffer#write(string, encoding)
        } else if (length === undefined && typeof offset === 'string') {
          encoding = offset
          length = this.length
          offset = 0
  // Buffer#write(string, offset[, length][, encoding])
        } else if (isFinite(offset)) {
          offset = offset | 0
          if (isFinite(length)) {
            length = length | 0
            if (encoding === undefined) encoding = 'utf8'
          } else {
            encoding = length
            length = undefined
          }
  // legacy write(string, encoding, offset, length) - remove in v0.13
        } else {
          var swap = encoding
          encoding = offset
          offset = length | 0
          length = swap
        }

        var remaining = this.length - offset
        if (length === undefined || length > remaining) length = remaining

        if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
          throw new RangeError('attempt to write outside buffer bounds')
        }

        if (!encoding) encoding = 'utf8'

        var loweredCase = false
        for (;;) {
          switch (encoding) {
            case 'hex':
              return hexWrite(this, string, offset, length)

            case 'utf8':
            case 'utf-8':
              return utf8Write(this, string, offset, length)

            case 'ascii':
              return asciiWrite(this, string, offset, length)

            case 'binary':
              return binaryWrite(this, string, offset, length)

            case 'base64':
        // Warning: maxLength not taken into account in base64Write
              return base64Write(this, string, offset, length)

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return ucs2Write(this, string, offset, length)

            default:
              if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
              encoding = ('' + encoding).toLowerCase()
              loweredCase = true
          }
        }
      }

      Buffer.prototype.toJSON = function toJSON () {
        return {
          type: 'Buffer',
          data: Array.prototype.slice.call(this._arr || this, 0)
        }
      }

      function base64Slice (buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf)
        } else {
          return base64.fromByteArray(buf.slice(start, end))
        }
      }

      function utf8Slice (buf, start, end) {
        end = Math.min(buf.length, end)
        var res = []

        var i = start
        while (i < end) {
          var firstByte = buf[i]
          var codePoint = null
          var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

          if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint

            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 0x80) {
                  codePoint = firstByte
                }
                break
              case 2:
                secondByte = buf[i + 1]
                if ((secondByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                  if (tempCodePoint > 0x7F) {
                    codePoint = tempCodePoint
                  }
                }
                break
              case 3:
                secondByte = buf[i + 1]
                thirdByte = buf[i + 2]
                if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                  if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                    codePoint = tempCodePoint
                  }
                }
                break
              case 4:
                secondByte = buf[i + 1]
                thirdByte = buf[i + 2]
                fourthByte = buf[i + 3]
                if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                  if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                    codePoint = tempCodePoint
                  }
                }
            }
          }

          if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
            codePoint = 0xFFFD
            bytesPerSequence = 1
          } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
            codePoint -= 0x10000
            res.push(codePoint >>> 10 & 0x3FF | 0xD800)
            codePoint = 0xDC00 | codePoint & 0x3FF
          }

          res.push(codePoint)
          i += bytesPerSequence
        }

        return decodeCodePointsArray(res)
      }

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
      var MAX_ARGUMENTS_LENGTH = 0x1000

      function decodeCodePointsArray (codePoints) {
        var len = codePoints.length
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
        }

  // Decode in chunks to avoid "call stack size exceeded".
        var res = ''
        var i = 0
        while (i < len) {
          res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
        }
        return res
      }

      function asciiSlice (buf, start, end) {
        var ret = ''
        end = Math.min(buf.length, end)

        for (var i = start; i < end; i++) {
          ret += String.fromCharCode(buf[i] & 0x7F)
        }
        return ret
      }

      function binarySlice (buf, start, end) {
        var ret = ''
        end = Math.min(buf.length, end)

        for (var i = start; i < end; i++) {
          ret += String.fromCharCode(buf[i])
        }
        return ret
      }

      function hexSlice (buf, start, end) {
        var len = buf.length

        if (!start || start < 0) start = 0
        if (!end || end < 0 || end > len) end = len

        var out = ''
        for (var i = start; i < end; i++) {
          out += toHex(buf[i])
        }
        return out
      }

      function utf16leSlice (buf, start, end) {
        var bytes = buf.slice(start, end)
        var res = ''
        for (var i = 0; i < bytes.length; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
        }
        return res
      }

      Buffer.prototype.slice = function slice (start, end) {
        var len = this.length
        start = ~~start
        end = end === undefined ? len : ~~end

        if (start < 0) {
          start += len
          if (start < 0) start = 0
        } else if (start > len) {
          start = len
        }

        if (end < 0) {
          end += len
          if (end < 0) end = 0
        } else if (end > len) {
          end = len
        }

        if (end < start) end = start

        var newBuf
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          newBuf = Buffer._augment(this.subarray(start, end))
        } else {
          var sliceLen = end - start
          newBuf = new Buffer(sliceLen, undefined)
          for (var i = 0; i < sliceLen; i++) {
            newBuf[i] = this[i + start]
          }
        }

        if (newBuf.length) newBuf.parent = this.parent || this

        return newBuf
      }

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
      function checkOffset (offset, ext, length) {
        if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
        if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
      }

      Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) checkOffset(offset, byteLength, this.length)

        var val = this[offset]
        var mul = 1
        var i = 0
        while (++i < byteLength && (mul *= 0x100)) {
          val += this[offset + i] * mul
        }

        return val
      }

      Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) {
          checkOffset(offset, byteLength, this.length)
        }

        var val = this[offset + --byteLength]
        var mul = 1
        while (byteLength > 0 && (mul *= 0x100)) {
          val += this[offset + --byteLength] * mul
        }

        return val
      }

      Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 1, this.length)
        return this[offset]
      }

      Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length)
        return this[offset] | (this[offset + 1] << 8)
      }

      Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length)
        return (this[offset] << 8) | this[offset + 1]
      }

      Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)

        return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
      }

      Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)

        return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
      }

      Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) checkOffset(offset, byteLength, this.length)

        var val = this[offset]
        var mul = 1
        var i = 0
        while (++i < byteLength && (mul *= 0x100)) {
          val += this[offset + i] * mul
        }
        mul *= 0x80

        if (val >= mul) val -= Math.pow(2, 8 * byteLength)

        return val
      }

      Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) checkOffset(offset, byteLength, this.length)

        var i = byteLength
        var mul = 1
        var val = this[offset + --i]
        while (i > 0 && (mul *= 0x100)) {
          val += this[offset + --i] * mul
        }
        mul *= 0x80

        if (val >= mul) val -= Math.pow(2, 8 * byteLength)

        return val
      }

      Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 1, this.length)
        if (!(this[offset] & 0x80)) return (this[offset])
        return ((0xff - this[offset] + 1) * -1)
      }

      Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length)
        var val = this[offset] | (this[offset + 1] << 8)
        return (val & 0x8000) ? val | 0xFFFF0000 : val
      }

      Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length)
        var val = this[offset + 1] | (this[offset] << 8)
        return (val & 0x8000) ? val | 0xFFFF0000 : val
      }

      Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)

        return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
      }

      Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)

        return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
      }

      Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)
        return ieee754.read(this, offset, true, 23, 4)
      }

      Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)
        return ieee754.read(this, offset, false, 23, 4)
      }

      Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 8, this.length)
        return ieee754.read(this, offset, true, 52, 8)
      }

      Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 8, this.length)
        return ieee754.read(this, offset, false, 52, 8)
      }

      function checkInt (buf, value, offset, ext, max, min) {
        if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
        if (value > max || value < min) throw new RangeError('value is out of bounds')
        if (offset + ext > buf.length) throw new RangeError('index out of range')
      }

      Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
        value = +value
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

        var mul = 1
        var i = 0
        this[offset] = value & 0xFF
        while (++i < byteLength && (mul *= 0x100)) {
          this[offset + i] = (value / mul) & 0xFF
        }

        return offset + byteLength
      }

      Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
        value = +value
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

        var i = byteLength - 1
        var mul = 1
        this[offset + i] = value & 0xFF
        while (--i >= 0 && (mul *= 0x100)) {
          this[offset + i] = (value / mul) & 0xFF
        }

        return offset + byteLength
      }

      Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
        if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
        this[offset] = value
        return offset + 1
      }

      function objectWriteUInt16 (buf, value, offset, littleEndian) {
        if (value < 0) value = 0xffff + value + 1
        for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
          buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
        }
      }

      Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value
          this[offset + 1] = (value >>> 8)
        } else {
          objectWriteUInt16(this, value, offset, true)
        }
        return offset + 2
      }

      Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = (value >>> 8)
          this[offset + 1] = value
        } else {
          objectWriteUInt16(this, value, offset, false)
        }
        return offset + 2
      }

      function objectWriteUInt32 (buf, value, offset, littleEndian) {
        if (value < 0) value = 0xffffffff + value + 1
        for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
          buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
        }
      }

      Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset + 3] = (value >>> 24)
          this[offset + 2] = (value >>> 16)
          this[offset + 1] = (value >>> 8)
          this[offset] = value
        } else {
          objectWriteUInt32(this, value, offset, true)
        }
        return offset + 4
      }

      Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = (value >>> 24)
          this[offset + 1] = (value >>> 16)
          this[offset + 2] = (value >>> 8)
          this[offset + 3] = value
        } else {
          objectWriteUInt32(this, value, offset, false)
        }
        return offset + 4
      }

      Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1)

          checkInt(this, value, offset, byteLength, limit - 1, -limit)
        }

        var i = 0
        var mul = 1
        var sub = value < 0 ? 1 : 0
        this[offset] = value & 0xFF
        while (++i < byteLength && (mul *= 0x100)) {
          this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
        }

        return offset + byteLength
      }

      Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1)

          checkInt(this, value, offset, byteLength, limit - 1, -limit)
        }

        var i = byteLength - 1
        var mul = 1
        var sub = value < 0 ? 1 : 0
        this[offset + i] = value & 0xFF
        while (--i >= 0 && (mul *= 0x100)) {
          this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
        }

        return offset + byteLength
      }

      Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
        if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
        if (value < 0) value = 0xff + value + 1
        this[offset] = value
        return offset + 1
      }

      Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value
          this[offset + 1] = (value >>> 8)
        } else {
          objectWriteUInt16(this, value, offset, true)
        }
        return offset + 2
      }

      Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = (value >>> 8)
          this[offset + 1] = value
        } else {
          objectWriteUInt16(this, value, offset, false)
        }
        return offset + 2
      }

      Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value
          this[offset + 1] = (value >>> 8)
          this[offset + 2] = (value >>> 16)
          this[offset + 3] = (value >>> 24)
        } else {
          objectWriteUInt32(this, value, offset, true)
        }
        return offset + 4
      }

      Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
        if (value < 0) value = 0xffffffff + value + 1
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = (value >>> 24)
          this[offset + 1] = (value >>> 16)
          this[offset + 2] = (value >>> 8)
          this[offset + 3] = value
        } else {
          objectWriteUInt32(this, value, offset, false)
        }
        return offset + 4
      }

      function checkIEEE754 (buf, value, offset, ext, max, min) {
        if (value > max || value < min) throw new RangeError('value is out of bounds')
        if (offset + ext > buf.length) throw new RangeError('index out of range')
        if (offset < 0) throw new RangeError('index out of range')
      }

      function writeFloat (buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4)
        return offset + 4
      }

      Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert)
      }

      Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert)
      }

      function writeDouble (buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8)
        return offset + 8
      }

      Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert)
      }

      Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert)
      }

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
      Buffer.prototype.copy = function copy (target, targetStart, start, end) {
        if (!start) start = 0
        if (!end && end !== 0) end = this.length
        if (targetStart >= target.length) targetStart = target.length
        if (!targetStart) targetStart = 0
        if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
        if (end === start) return 0
        if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
        if (targetStart < 0) {
          throw new RangeError('targetStart out of bounds')
        }
        if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
        if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
        if (end > this.length) end = this.length
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start
        }

        var len = end - start
        var i

        if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
          for (i = len - 1; i >= 0; i--) {
            target[i + targetStart] = this[i + start]
          }
        } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
          for (i = 0; i < len; i++) {
            target[i + targetStart] = this[i + start]
          }
        } else {
          target._set(this.subarray(start, start + len), targetStart)
        }

        return len
      }

// fill(value, start=0, end=buffer.length)
      Buffer.prototype.fill = function fill (value, start, end) {
        if (!value) value = 0
        if (!start) start = 0
        if (!end) end = this.length

        if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
        if (end === start) return
        if (this.length === 0) return

        if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
        if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

        var i
        if (typeof value === 'number') {
          for (i = start; i < end; i++) {
            this[i] = value
          }
        } else {
          var bytes = utf8ToBytes(value.toString())
          var len = bytes.length
          for (i = start; i < end; i++) {
            this[i] = bytes[i % len]
          }
        }

        return this
      }

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
      Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
        if (typeof Uint8Array !== 'undefined') {
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            return (new Buffer(this)).buffer
          } else {
            var buf = new Uint8Array(this.length)
            for (var i = 0, len = buf.length; i < len; i += 1) {
              buf[i] = this[i]
            }
            return buf.buffer
          }
        } else {
          throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
        }
      }

// HELPER FUNCTIONS
// ================

      var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
      Buffer._augment = function _augment (arr) {
        arr.constructor = Buffer
        arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
        arr._set = arr.set

  // deprecated
        arr.get = BP.get
        arr.set = BP.set

        arr.write = BP.write
        arr.toString = BP.toString
        arr.toLocaleString = BP.toString
        arr.toJSON = BP.toJSON
        arr.equals = BP.equals
        arr.compare = BP.compare
        arr.indexOf = BP.indexOf
        arr.copy = BP.copy
        arr.slice = BP.slice
        arr.readUIntLE = BP.readUIntLE
        arr.readUIntBE = BP.readUIntBE
        arr.readUInt8 = BP.readUInt8
        arr.readUInt16LE = BP.readUInt16LE
        arr.readUInt16BE = BP.readUInt16BE
        arr.readUInt32LE = BP.readUInt32LE
        arr.readUInt32BE = BP.readUInt32BE
        arr.readIntLE = BP.readIntLE
        arr.readIntBE = BP.readIntBE
        arr.readInt8 = BP.readInt8
        arr.readInt16LE = BP.readInt16LE
        arr.readInt16BE = BP.readInt16BE
        arr.readInt32LE = BP.readInt32LE
        arr.readInt32BE = BP.readInt32BE
        arr.readFloatLE = BP.readFloatLE
        arr.readFloatBE = BP.readFloatBE
        arr.readDoubleLE = BP.readDoubleLE
        arr.readDoubleBE = BP.readDoubleBE
        arr.writeUInt8 = BP.writeUInt8
        arr.writeUIntLE = BP.writeUIntLE
        arr.writeUIntBE = BP.writeUIntBE
        arr.writeUInt16LE = BP.writeUInt16LE
        arr.writeUInt16BE = BP.writeUInt16BE
        arr.writeUInt32LE = BP.writeUInt32LE
        arr.writeUInt32BE = BP.writeUInt32BE
        arr.writeIntLE = BP.writeIntLE
        arr.writeIntBE = BP.writeIntBE
        arr.writeInt8 = BP.writeInt8
        arr.writeInt16LE = BP.writeInt16LE
        arr.writeInt16BE = BP.writeInt16BE
        arr.writeInt32LE = BP.writeInt32LE
        arr.writeInt32BE = BP.writeInt32BE
        arr.writeFloatLE = BP.writeFloatLE
        arr.writeFloatBE = BP.writeFloatBE
        arr.writeDoubleLE = BP.writeDoubleLE
        arr.writeDoubleBE = BP.writeDoubleBE
        arr.fill = BP.fill
        arr.inspect = BP.inspect
        arr.toArrayBuffer = BP.toArrayBuffer

        return arr
      }

      var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

      function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
        str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
        if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
        while (str.length % 4 !== 0) {
          str = str + '='
        }
        return str
      }

      function stringtrim (str) {
        if (str.trim) return str.trim()
        return str.replace(/^\s+|\s+$/g, '')
      }

      function toHex (n) {
        if (n < 16) return '0' + n.toString(16)
        return n.toString(16)
      }

      function utf8ToBytes (string, units) {
        units = units || Infinity
        var codePoint
        var length = string.length
        var leadSurrogate = null
        var bytes = []

        for (var i = 0; i < length; i++) {
          codePoint = string.charCodeAt(i)

    // is surrogate component
          if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
            if (!leadSurrogate) {
        // no lead yet
              if (codePoint > 0xDBFF) {
          // unexpected trail
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                continue
              } else if (i + 1 === length) {
          // unpaired lead
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                continue
              }

        // valid lead
              leadSurrogate = codePoint

              continue
            }

      // 2 leads in a row
            if (codePoint < 0xDC00) {
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
              leadSurrogate = codePoint
              continue
            }

      // valid surrogate pair
            codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
          } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          }

          leadSurrogate = null

    // encode utf8
          if (codePoint < 0x80) {
            if ((units -= 1) < 0) break
            bytes.push(codePoint)
          } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break
            bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
          } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break
            bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
          } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break
            bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
          } else {
            throw new Error('Invalid code point')
          }
        }

        return bytes
      }

      function asciiToBytes (str) {
        var byteArray = []
        for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
          byteArray.push(str.charCodeAt(i) & 0xFF)
        }
        return byteArray
      }

      function utf16leToBytes (str, units) {
        var c, hi, lo
        var byteArray = []
        for (var i = 0; i < str.length; i++) {
          if ((units -= 2) < 0) break

          c = str.charCodeAt(i)
          hi = c >> 8
          lo = c % 256
          byteArray.push(lo)
          byteArray.push(hi)
        }

        return byteArray
      }

      function base64ToBytes (str) {
        return base64.toByteArray(base64clean(str))
      }

      function blitBuffer (src, dst, offset, length) {
        for (var i = 0; i < length; i++) {
          if ((i + offset >= dst.length) || (i >= src.length)) break
          dst[i + offset] = src[i]
        }
        return i
      }
    }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
  }, {'base64-js': 18, 'ieee754': 19, 'is-array': 20}],
  18: [function (require, module, exports) {
    var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

;(function (exports) {
  'use strict'

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

  var PLUS = '+'.charCodeAt(0)
  var SLASH = '/'.charCodeAt(0)
  var NUMBER = '0'.charCodeAt(0)
  var LOWER = 'a'.charCodeAt(0)
  var UPPER = 'A'.charCodeAt(0)
  var PLUS_URL_SAFE = '-'.charCodeAt(0)
  var SLASH_URL_SAFE = '_'.charCodeAt(0)

  function decode (elt) {
    var code = elt.charCodeAt(0)
    if (code === PLUS ||
		    code === PLUS_URL_SAFE) { return 62 } // '+'
    if (code === SLASH ||
		    code === SLASH_URL_SAFE) { return 63 } // '/'
    if (code < NUMBER) { return -1 } // no match
    if (code < NUMBER + 10) { return code - NUMBER + 26 + 26 }
    if (code < UPPER + 26) { return code - UPPER }
    if (code < LOWER + 26) { return code - LOWER + 26 }
  }

  function b64ToByteArray (b64) {
    var i, j, l, tmp, placeHolders, arr

    if (b64.length % 4 > 0) {
      throw new Error('Invalid string. Length must be a multiple of 4')
    }

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
    var len = b64.length
    placeHolders = b64.charAt(len - 2) === '=' ? 2 : b64.charAt(len - 1) === '=' ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
    arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
    l = placeHolders > 0 ? b64.length - 4 : b64.length

    var L = 0

    function push (v) {
      arr[L++] = v
    }

    for (i = 0, j = 0; i < l; i += 4, j += 3) {
      tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
      push((tmp & 0xFF0000) >> 16)
      push((tmp & 0xFF00) >> 8)
      push(tmp & 0xFF)
    }

    if (placeHolders === 2) {
      tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
      push(tmp & 0xFF)
    } else if (placeHolders === 1) {
      tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
      push((tmp >> 8) & 0xFF)
      push(tmp & 0xFF)
    }

    return arr
  }

  function uint8ToBase64 (uint8) {
    var i,
      extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
      output = '',
      temp, length

    function encode (num) {
      return lookup.charAt(num)
    }

    function tripletToBase64 (num) {
      return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
    }

		// go through the array every three bytes, we'll deal with trailing stuff later
    for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
      temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
      output += tripletToBase64(temp)
    }

		// pad the end with zeros, but make sure to not forget the extra bytes
    switch (extraBytes) {
      case 1:
        temp = uint8[uint8.length - 1]
        output += encode(temp >> 2)
        output += encode((temp << 4) & 0x3F)
        output += '=='
        break
      case 2:
        temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
        output += encode(temp >> 10)
        output += encode((temp >> 4) & 0x3F)
        output += encode((temp << 2) & 0x3F)
        output += '='
        break
    }

    return output
  }

  exports.toByteArray = b64ToByteArray
  exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))
  }, {}],
  19: [function (require, module, exports) {
    exports.read = function (buffer, offset, isLE, mLen, nBytes) {
      var e, m
      var eLen = nBytes * 8 - mLen - 1
      var eMax = (1 << eLen) - 1
      var eBias = eMax >> 1
      var nBits = -7
      var i = isLE ? (nBytes - 1) : 0
      var d = isLE ? -1 : 1
      var s = buffer[offset + i]

      i += d

      e = s & ((1 << (-nBits)) - 1)
      s >>= (-nBits)
      nBits += eLen
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

      m = e & ((1 << (-nBits)) - 1)
      e >>= (-nBits)
      nBits += mLen
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

      if (e === 0) {
        e = 1 - eBias
      } else if (e === eMax) {
        return m ? NaN : ((s ? -1 : 1) * Infinity)
      } else {
        m = m + Math.pow(2, mLen)
        e = e - eBias
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
    }

    exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c
      var eLen = nBytes * 8 - mLen - 1
      var eMax = (1 << eLen) - 1
      var eBias = eMax >> 1
      var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
      var i = isLE ? 0 : (nBytes - 1)
      var d = isLE ? 1 : -1
      var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

      value = Math.abs(value)

      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0
        e = eMax
      } else {
        e = Math.floor(Math.log(value) / Math.LN2)
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--
          c *= 2
        }
        if (e + eBias >= 1) {
          value += rt / c
        } else {
          value += rt * Math.pow(2, 1 - eBias)
        }
        if (value * c >= 2) {
          e++
          c /= 2
        }

        if (e + eBias >= eMax) {
          m = 0
          e = eMax
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen)
          e = e + eBias
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
          e = 0
        }
      }

      for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

      e = (e << mLen) | m
      eLen += mLen
      for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

      buffer[offset + i - d] |= s * 128
    }
  }, {}],
  20: [function (require, module, exports) {
/**
 * isArray
 */

    var isArray = Array.isArray

/**
 * toString
 */

    var str = Object.prototype.toString

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

    module.exports = isArray || function (val) {
      return !!val && str.call(val) == '[object Array]'
    }
  }, {}],
  21: [function (require, module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

    function EventEmitter () {
      this._events = this._events || {}
      this._maxListeners = this._maxListeners || undefined
    }
    module.exports = EventEmitter

// Backwards-compat with node 0.10.x
    EventEmitter.EventEmitter = EventEmitter

    EventEmitter.prototype._events = undefined
    EventEmitter.prototype._maxListeners = undefined

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
    EventEmitter.defaultMaxListeners = 10

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function (n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) { throw TypeError('n must be a positive number') }
      this._maxListeners = n
      return this
    }

    EventEmitter.prototype.emit = function (type) {
      var er, handler, len, args, i, listeners

      if (!this._events) { this._events = {} }

  // If there is no 'error' event listener then throw.
      if (type === 'error') {
        if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
          er = arguments[1]
          if (er instanceof Error) {
            throw er // Unhandled 'error' event
          }
          throw TypeError('Uncaught, unspecified "error" event.')
        }
      }

      handler = this._events[type]

      if (isUndefined(handler)) { return false }

      if (isFunction(handler)) {
        switch (arguments.length) {
      // fast cases
          case 1:
            handler.call(this)
            break
          case 2:
            handler.call(this, arguments[1])
            break
          case 3:
            handler.call(this, arguments[1], arguments[2])
            break
      // slower
          default:
            len = arguments.length
            args = new Array(len - 1)
            for (i = 1; i < len; i++) { args[i - 1] = arguments[i] }
            handler.apply(this, args)
        }
      } else if (isObject(handler)) {
        len = arguments.length
        args = new Array(len - 1)
        for (i = 1; i < len; i++) { args[i - 1] = arguments[i] }

        listeners = handler.slice()
        len = listeners.length
        for (i = 0; i < len; i++) { listeners[i].apply(this, args) }
      }

      return true
    }

    EventEmitter.prototype.addListener = function (type, listener) {
      var m

      if (!isFunction(listener)) { throw TypeError('listener must be a function') }

      if (!this._events) { this._events = {} }

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
      if (this._events.newListener) {
        this.emit('newListener', type,
              isFunction(listener.listener)
              ? listener.listener : listener)
      }

      if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    { this._events[type] = listener } else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    { this._events[type].push(listener) } else
    // Adding the second element, need to change to array.
    { this._events[type] = [this._events[type], listener] }

  // Check for listener leak
      if (isObject(this._events[type]) && !this._events[type].warned) {
        var m
        if (!isUndefined(this._maxListeners)) {
          m = this._maxListeners
        } else {
          m = EventEmitter.defaultMaxListeners
        }

        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true
          console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length)
          if (typeof console.trace === 'function') {
        // not supported in IE 10
            console.trace()
          }
        }
      }

      return this
    }

    EventEmitter.prototype.on = EventEmitter.prototype.addListener

    EventEmitter.prototype.once = function (type, listener) {
      if (!isFunction(listener)) { throw TypeError('listener must be a function') }

      var fired = false

      function g () {
        this.removeListener(type, g)

        if (!fired) {
          fired = true
          listener.apply(this, arguments)
        }
      }

      g.listener = listener
      this.on(type, g)

      return this
    }

// emits a 'removeListener' event iff the listener was removed
    EventEmitter.prototype.removeListener = function (type, listener) {
      var list, position, length, i

      if (!isFunction(listener)) { throw TypeError('listener must be a function') }

      if (!this._events || !this._events[type]) { return this }

      list = this._events[type]
      length = list.length
      position = -1

      if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
        delete this._events[type]
        if (this._events.removeListener) { this.emit('removeListener', type, listener) }
      } else if (isObject(list)) {
        for (i = length; i-- > 0;) {
          if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
            position = i
            break
          }
        }

        if (position < 0) { return this }

        if (list.length === 1) {
          list.length = 0
          delete this._events[type]
        } else {
          list.splice(position, 1)
        }

        if (this._events.removeListener) { this.emit('removeListener', type, listener) }
      }

      return this
    }

    EventEmitter.prototype.removeAllListeners = function (type) {
      var key, listeners

      if (!this._events) { return this }

  // not listening for removeListener, no need to emit
      if (!this._events.removeListener) {
        if (arguments.length === 0) { this._events = {} } else if (this._events[type]) { delete this._events[type] }
        return this
      }

  // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        for (key in this._events) {
          if (key === 'removeListener') continue
          this.removeAllListeners(key)
        }
        this.removeAllListeners('removeListener')
        this._events = {}
        return this
      }

      listeners = this._events[type]

      if (isFunction(listeners)) {
        this.removeListener(type, listeners)
      } else {
    // LIFO order
        while (listeners.length) { this.removeListener(type, listeners[listeners.length - 1]) }
      }
      delete this._events[type]

      return this
    }

    EventEmitter.prototype.listeners = function (type) {
      var ret
      if (!this._events || !this._events[type]) { ret = [] } else if (isFunction(this._events[type])) { ret = [this._events[type]] } else { ret = this._events[type].slice() }
      return ret
    }

    EventEmitter.listenerCount = function (emitter, type) {
      var ret
      if (!emitter._events || !emitter._events[type]) { ret = 0 } else if (isFunction(emitter._events[type])) { ret = 1 } else { ret = emitter._events[type].length }
      return ret
    }

    function isFunction (arg) {
      return typeof arg === 'function'
    }

    function isNumber (arg) {
      return typeof arg === 'number'
    }

    function isObject (arg) {
      return typeof arg === 'object' && arg !== null
    }

    function isUndefined (arg) {
      return arg === void 0
    }
  }, {}],
  22: [function (require, module, exports) {
    if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
      module.exports = function inherits (ctor, superCtor) {
        ctor.super_ = superCtor
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        })
      }
    } else {
  // old school shim for old browsers
      module.exports = function inherits (ctor, superCtor) {
        ctor.super_ = superCtor
        var TempCtor = function () {}
        TempCtor.prototype = superCtor.prototype
        ctor.prototype = new TempCtor()
        ctor.prototype.constructor = ctor
      }
    }
  }, {}],
  23: [function (require, module, exports) {
    module.exports = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]'
    }
  }, {}],
  24: [function (require, module, exports) {
// shim for using process in browser

    var process = module.exports = {}
    var queue = []
    var draining = false
    var currentQueue
    var queueIndex = -1

    function cleanUpNextTick () {
      draining = false
      if (currentQueue.length) {
        queue = currentQueue.concat(queue)
      } else {
        queueIndex = -1
      }
      if (queue.length) {
        drainQueue()
      }
    }

    function drainQueue () {
      if (draining) {
        return
      }
      var timeout = setTimeout(cleanUpNextTick)
      draining = true

      var len = queue.length
      while (len) {
        currentQueue = queue
        queue = []
        while (++queueIndex < len) {
          if (currentQueue) {
            currentQueue[queueIndex].run()
          }
        }
        queueIndex = -1
        len = queue.length
      }
      currentQueue = null
      draining = false
      clearTimeout(timeout)
    }

    process.nextTick = function (fun) {
      var args = new Array(arguments.length - 1)
      if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i]
        }
      }
      queue.push(new Item(fun, args))
      if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0)
      }
    }

// v8 likes predictible objects
    function Item (fun, array) {
      this.fun = fun
      this.array = array
    }
    Item.prototype.run = function () {
      this.fun.apply(null, this.array)
    }
    process.title = 'browser'
    process.browser = true
    process.env = {}
    process.argv = []
    process.version = '' // empty string to avoid regexp issues
    process.versions = {}

    function noop () {}

    process.on = noop
    process.addListener = noop
    process.once = noop
    process.off = noop
    process.removeListener = noop
    process.removeAllListeners = noop
    process.emit = noop

    process.binding = function (name) {
      throw new Error('process.binding is not supported')
    }

    process.cwd = function () { return '/' }
    process.chdir = function (dir) {
      throw new Error('process.chdir is not supported')
    }
    process.umask = function () { return 0 }
  }, {}],
  25: [function (require, module, exports) {
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

    'use strict'

/* <replacement> */
    var objectKeys = Object.keys || function (obj) {
      var keys = []
      for (var key in obj) keys.push(key)
      return keys
    }
/* </replacement> */

    module.exports = Duplex

/* <replacement> */
    var processNextTick = require('process-nextick-args')
/* </replacement> */

/* <replacement> */
    var util = require('core-util-is')
    util.inherits = require('inherits')
/* </replacement> */

    var Readable = require('./_stream_readable')
    var Writable = require('./_stream_writable')

    util.inherits(Duplex, Readable)

    var keys = objectKeys(Writable.prototype)
    for (var v = 0; v < keys.length; v++) {
      var method = keys[v]
      if (!Duplex.prototype[method]) { Duplex.prototype[method] = Writable.prototype[method] }
    }

    function Duplex (options) {
      if (!(this instanceof Duplex)) { return new Duplex(options) }

      Readable.call(this, options)
      Writable.call(this, options)

      if (options && options.readable === false) { this.readable = false }

      if (options && options.writable === false) { this.writable = false }

      this.allowHalfOpen = true
      if (options && options.allowHalfOpen === false) { this.allowHalfOpen = false }

      this.once('end', onend)
    }

// the no-half-open enforcer
    function onend () {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
      if (this.allowHalfOpen || this._writableState.ended) { return }

  // no more data can be written.
  // But allow more writes to happen in this tick.
      processNextTick(onEndNT, this)
    }

    function onEndNT (self) {
      self.end()
    }

    function forEach (xs, f) {
      for (var i = 0, l = xs.length; i < l; i++) {
        f(xs[i], i)
      }
    }
  }, {'./_stream_readable': 26, './_stream_writable': 28, 'core-util-is': 29, 'inherits': 22, 'process-nextick-args': 30}],
  26: [function (require, module, exports) {
    (function (process) {
      'use strict'

      module.exports = Readable

/* <replacement> */
      var processNextTick = require('process-nextick-args')
/* </replacement> */

/* <replacement> */
      var isArray = require('isarray')
/* </replacement> */

/* <replacement> */
      var Buffer = require('buffer').Buffer
/* </replacement> */

      Readable.ReadableState = ReadableState

      var EE = require('events').EventEmitter

/* <replacement> */
      if (!EE.listenerCount) {
        EE.listenerCount = function (emitter, type) {
          return emitter.listeners(type).length
        }
      }
/* </replacement> */

/* <replacement> */
      var Stream;
      (function () {
        try {
          Stream = require('st' + 'ream')
        } catch (_) {} finally {
          if (!Stream) { Stream = require('events').EventEmitter }
        }
      }())
/* </replacement> */

      var Buffer = require('buffer').Buffer

/* <replacement> */
      var util = require('core-util-is')
      util.inherits = require('inherits')
/* </replacement> */

/* <replacement> */
      var debug = require('util')
      if (debug && debug.debuglog) {
        debug = debug.debuglog('stream')
      } else {
        debug = function () {}
      }
/* </replacement> */

      var StringDecoder

      util.inherits(Readable, Stream)

      function ReadableState (options, stream) {
        var Duplex = require('./_stream_duplex')

        options = options || {}

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
        this.objectMode = !!options.objectMode

        if (stream instanceof Duplex) { this.objectMode = this.objectMode || !!options.readableObjectMode }

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
        var hwm = options.highWaterMark
        var defaultHwm = this.objectMode ? 16 : 16 * 1024
        this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm

  // cast to ints.
        this.highWaterMark = ~~this.highWaterMark

        this.buffer = []
        this.length = 0
        this.pipes = null
        this.pipesCount = 0
        this.flowing = null
        this.ended = false
        this.endEmitted = false
        this.reading = false

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
        this.sync = true

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
        this.needReadable = false
        this.emittedReadable = false
        this.readableListening = false

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
        this.defaultEncoding = options.defaultEncoding || 'utf8'

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
        this.ranOut = false

  // the number of writers that are awaiting a drain event in .pipe()s
        this.awaitDrain = 0

  // if true, a maybeReadMore has been scheduled
        this.readingMore = false

        this.decoder = null
        this.encoding = null
        if (options.encoding) {
          if (!StringDecoder) { StringDecoder = require('string_decoder/').StringDecoder }
          this.decoder = new StringDecoder(options.encoding)
          this.encoding = options.encoding
        }
      }

      function Readable (options) {
        var Duplex = require('./_stream_duplex')

        if (!(this instanceof Readable)) { return new Readable(options) }

        this._readableState = new ReadableState(options, this)

  // legacy
        this.readable = true

        if (options && typeof options.read === 'function') { this._read = options.read }

        Stream.call(this)
      }

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
      Readable.prototype.push = function (chunk, encoding) {
        var state = this._readableState

        if (!state.objectMode && typeof chunk === 'string') {
          encoding = encoding || state.defaultEncoding
          if (encoding !== state.encoding) {
            chunk = new Buffer(chunk, encoding)
            encoding = ''
          }
        }

        return readableAddChunk(this, state, chunk, encoding, false)
      }

// Unshift should *always* be something directly out of read()
      Readable.prototype.unshift = function (chunk) {
        var state = this._readableState
        return readableAddChunk(this, state, chunk, '', true)
      }

      Readable.prototype.isPaused = function () {
        return this._readableState.flowing === false
      }

      function readableAddChunk (stream, state, chunk, encoding, addToFront) {
        var er = chunkInvalid(state, chunk)
        if (er) {
          stream.emit('error', er)
        } else if (chunk === null) {
          state.reading = false
          onEofChunk(stream, state)
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (state.ended && !addToFront) {
            var e = new Error('stream.push() after EOF')
            stream.emit('error', e)
          } else if (state.endEmitted && addToFront) {
            var e = new Error('stream.unshift() after end event')
            stream.emit('error', e)
          } else {
            if (state.decoder && !addToFront && !encoding) { chunk = state.decoder.write(chunk) }

            if (!addToFront) { state.reading = false }

      // if we want the data now, just emit it.
            if (state.flowing && state.length === 0 && !state.sync) {
              stream.emit('data', chunk)
              stream.read(0)
            } else {
        // update the buffer info.
              state.length += state.objectMode ? 1 : chunk.length
              if (addToFront) { state.buffer.unshift(chunk) } else { state.buffer.push(chunk) }

              if (state.needReadable) { emitReadable(stream) }
            }

            maybeReadMore(stream, state)
          }
        } else if (!addToFront) {
          state.reading = false
        }

        return needMoreData(state)
      }

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
      function needMoreData (state) {
        return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0)
      }

// backwards compatibility.
      Readable.prototype.setEncoding = function (enc) {
        if (!StringDecoder) { StringDecoder = require('string_decoder/').StringDecoder }
        this._readableState.decoder = new StringDecoder(enc)
        this._readableState.encoding = enc
        return this
      }

// Don't raise the hwm > 128MB
      var MAX_HWM = 0x800000
      function roundUpToNextPowerOf2 (n) {
        if (n >= MAX_HWM) {
          n = MAX_HWM
        } else {
    // Get the next highest power of 2
          n--
          for (var p = 1; p < 32; p <<= 1) n |= n >> p
          n++
        }
        return n
      }

      function howMuchToRead (n, state) {
        if (state.length === 0 && state.ended) { return 0 }

        if (state.objectMode) { return n === 0 ? 0 : 1 }

        if (n === null || isNaN(n)) {
    // only flow one buffer at a time
          if (state.flowing && state.buffer.length) { return state.buffer[0].length } else { return state.length }
        }

        if (n <= 0) { return 0 }

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
        if (n > state.highWaterMark) { state.highWaterMark = roundUpToNextPowerOf2(n) }

  // don't have that much.  return null, unless we've ended.
        if (n > state.length) {
          if (!state.ended) {
            state.needReadable = true
            return 0
          } else {
            return state.length
          }
        }

        return n
      }

// you can override either this method, or the async _read(n) below.
      Readable.prototype.read = function (n) {
        debug('read', n)
        var state = this._readableState
        var nOrig = n

        if (typeof n !== 'number' || n > 0) { state.emittedReadable = false }

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
        if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
          debug('read: emitReadable', state.length, state.ended)
          if (state.length === 0 && state.ended) { endReadable(this) } else { emitReadable(this) }
          return null
        }

        n = howMuchToRead(n, state)

  // if we've ended, and we're now clear, then finish it up.
        if (n === 0 && state.ended) {
          if (state.length === 0) { endReadable(this) }
          return null
        }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
        var doRead = state.needReadable
        debug('need readable', doRead)

  // if we currently have less than the highWaterMark, then also read some
        if (state.length === 0 || state.length - n < state.highWaterMark) {
          doRead = true
          debug('length less than watermark', doRead)
        }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
        if (state.ended || state.reading) {
          doRead = false
          debug('reading or ended', doRead)
        }

        if (doRead) {
          debug('do read')
          state.reading = true
          state.sync = true
    // if the length is currently zero, then we *need* a readable event.
          if (state.length === 0) { state.needReadable = true }
    // call internal read method
          this._read(state.highWaterMark)
          state.sync = false
        }

  // If _read pushed data synchronously, then `reading` will be false,
  // and we need to re-evaluate how much data we can return to the user.
        if (doRead && !state.reading) { n = howMuchToRead(nOrig, state) }

        var ret
        if (n > 0) { ret = fromList(n, state) } else { ret = null }

        if (ret === null) {
          state.needReadable = true
          n = 0
        }

        state.length -= n

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
        if (state.length === 0 && !state.ended) { state.needReadable = true }

  // If we tried to read() past the EOF, then emit end on the next tick.
        if (nOrig !== n && state.ended && state.length === 0) { endReadable(this) }

        if (ret !== null) { this.emit('data', ret) }

        return ret
      }

      function chunkInvalid (state, chunk) {
        var er = null
        if (!(Buffer.isBuffer(chunk)) &&
      typeof chunk !== 'string' &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
          er = new TypeError('Invalid non-string/buffer chunk')
        }
        return er
      }

      function onEofChunk (stream, state) {
        if (state.ended) return
        if (state.decoder) {
          var chunk = state.decoder.end()
          if (chunk && chunk.length) {
            state.buffer.push(chunk)
            state.length += state.objectMode ? 1 : chunk.length
          }
        }
        state.ended = true

  // emit 'readable' now to make sure it gets picked up.
        emitReadable(stream)
      }

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
      function emitReadable (stream) {
        var state = stream._readableState
        state.needReadable = false
        if (!state.emittedReadable) {
          debug('emitReadable', state.flowing)
          state.emittedReadable = true
          if (state.sync) { processNextTick(emitReadable_, stream) } else { emitReadable_(stream) }
        }
      }

      function emitReadable_ (stream) {
        debug('emit readable')
        stream.emit('readable')
        flow(stream)
      }

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
      function maybeReadMore (stream, state) {
        if (!state.readingMore) {
          state.readingMore = true
          processNextTick(maybeReadMore_, stream, state)
        }
      }

      function maybeReadMore_ (stream, state) {
        var len = state.length
        while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
          debug('maybeReadMore read 0')
          stream.read(0)
          if (len === state.length)
      // didn't get any data, stop spinning.
      { break } else { len = state.length }
        }
        state.readingMore = false
      }

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
      Readable.prototype._read = function (n) {
        this.emit('error', new Error('not implemented'))
      }

      Readable.prototype.pipe = function (dest, pipeOpts) {
        var src = this
        var state = this._readableState

        switch (state.pipesCount) {
          case 0:
            state.pipes = dest
            break
          case 1:
            state.pipes = [state.pipes, dest]
            break
          default:
            state.pipes.push(dest)
            break
        }
        state.pipesCount += 1
        debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts)

        var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr

        var endFn = doEnd ? onend : cleanup
        if (state.endEmitted) { processNextTick(endFn) } else { src.once('end', endFn) }

        dest.on('unpipe', onunpipe)
        function onunpipe (readable) {
          debug('onunpipe')
          if (readable === src) {
            cleanup()
          }
        }

        function onend () {
          debug('onend')
          dest.end()
        }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
        var ondrain = pipeOnDrain(src)
        dest.on('drain', ondrain)

        function cleanup () {
          debug('cleanup')
    // cleanup event handlers once the pipe is broken
          dest.removeListener('close', onclose)
          dest.removeListener('finish', onfinish)
          dest.removeListener('drain', ondrain)
          dest.removeListener('error', onerror)
          dest.removeListener('unpipe', onunpipe)
          src.removeListener('end', onend)
          src.removeListener('end', cleanup)
          src.removeListener('data', ondata)

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
          if (state.awaitDrain &&
        (!dest._writableState || dest._writableState.needDrain)) { ondrain() }
        }

        src.on('data', ondata)
        function ondata (chunk) {
          debug('ondata')
          var ret = dest.write(chunk)
          if (ret === false) {
            debug('false write response, pause',
            src._readableState.awaitDrain)
            src._readableState.awaitDrain++
            src.pause()
          }
        }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
        function onerror (er) {
          debug('onerror', er)
          unpipe()
          dest.removeListener('error', onerror)
          if (EE.listenerCount(dest, 'error') === 0) { dest.emit('error', er) }
        }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
        if (!dest._events || !dest._events.error) { dest.on('error', onerror) } else if (isArray(dest._events.error)) { dest._events.error.unshift(onerror) } else { dest._events.error = [onerror, dest._events.error] }

  // Both close and finish should trigger unpipe, but only once.
        function onclose () {
          dest.removeListener('finish', onfinish)
          unpipe()
        }
        dest.once('close', onclose)
        function onfinish () {
          debug('onfinish')
          dest.removeListener('close', onclose)
          unpipe()
        }
        dest.once('finish', onfinish)

        function unpipe () {
          debug('unpipe')
          src.unpipe(dest)
        }

  // tell the dest that it's being piped to
        dest.emit('pipe', src)

  // start the flow if it hasn't been started already.
        if (!state.flowing) {
          debug('pipe resume')
          src.resume()
        }

        return dest
      }

      function pipeOnDrain (src) {
        return function () {
          var state = src._readableState
          debug('pipeOnDrain', state.awaitDrain)
          if (state.awaitDrain) { state.awaitDrain-- }
          if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
            state.flowing = true
            flow(src)
          }
        }
      }

      Readable.prototype.unpipe = function (dest) {
        var state = this._readableState

  // if we're not piping anywhere, then do nothing.
        if (state.pipesCount === 0) { return this }

  // just one destination.  most common case.
        if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
          if (dest && dest !== state.pipes) { return this }

          if (!dest) { dest = state.pipes }

    // got a match.
          state.pipes = null
          state.pipesCount = 0
          state.flowing = false
          if (dest) { dest.emit('unpipe', this) }
          return this
        }

  // slow case. multiple pipe destinations.

        if (!dest) {
    // remove all.
          var dests = state.pipes
          var len = state.pipesCount
          state.pipes = null
          state.pipesCount = 0
          state.flowing = false

          for (var i = 0; i < len; i++) { dests[i].emit('unpipe', this) }
          return this
        }

  // try to find the right one.
        var i = indexOf(state.pipes, dest)
        if (i === -1) { return this }

        state.pipes.splice(i, 1)
        state.pipesCount -= 1
        if (state.pipesCount === 1) { state.pipes = state.pipes[0] }

        dest.emit('unpipe', this)

        return this
      }

// set up data events if they are asked for
// Ensure readable listeners eventually get something
      Readable.prototype.on = function (ev, fn) {
        var res = Stream.prototype.on.call(this, ev, fn)

  // If listening to data, and it has not explicitly been paused,
  // then call resume to start the flow of data on the next tick.
        if (ev === 'data' && this._readableState.flowing !== false) {
          this.resume()
        }

        if (ev === 'readable' && this.readable) {
          var state = this._readableState
          if (!state.readableListening) {
            state.readableListening = true
            state.emittedReadable = false
            state.needReadable = true
            if (!state.reading) {
              processNextTick(nReadingNextTick, this)
            } else if (state.length) {
              emitReadable(this, state)
            }
          }
        }

        return res
      }
      Readable.prototype.addListener = Readable.prototype.on

      function nReadingNextTick (self) {
        debug('readable nexttick read 0')
        self.read(0)
      }

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
      Readable.prototype.resume = function () {
        var state = this._readableState
        if (!state.flowing) {
          debug('resume')
          state.flowing = true
          resume(this, state)
        }
        return this
      }

      function resume (stream, state) {
        if (!state.resumeScheduled) {
          state.resumeScheduled = true
          processNextTick(resume_, stream, state)
        }
      }

      function resume_ (stream, state) {
        if (!state.reading) {
          debug('resume read 0')
          stream.read(0)
        }

        state.resumeScheduled = false
        stream.emit('resume')
        flow(stream)
        if (state.flowing && !state.reading) { stream.read(0) }
      }

      Readable.prototype.pause = function () {
        debug('call pause flowing=%j', this._readableState.flowing)
        if (this._readableState.flowing !== false) {
          debug('pause')
          this._readableState.flowing = false
          this.emit('pause')
        }
        return this
      }

      function flow (stream) {
        var state = stream._readableState
        debug('flow', state.flowing)
        if (state.flowing) {
          do {
            var chunk = stream.read()
          } while (chunk !== null && state.flowing)
        }
      }

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
      Readable.prototype.wrap = function (stream) {
        var state = this._readableState
        var paused = false

        var self = this
        stream.on('end', function () {
          debug('wrapped end')
          if (state.decoder && !state.ended) {
            var chunk = state.decoder.end()
            if (chunk && chunk.length) { self.push(chunk) }
          }

          self.push(null)
        })

        stream.on('data', function (chunk) {
          debug('wrapped data')
          if (state.decoder) { chunk = state.decoder.write(chunk) }

    // don't skip over falsy values in objectMode
          if (state.objectMode && (chunk === null || chunk === undefined)) { return } else if (!state.objectMode && (!chunk || !chunk.length)) { return }

          var ret = self.push(chunk)
          if (!ret) {
            paused = true
            stream.pause()
          }
        })

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
        for (var i in stream) {
          if (this[i] === undefined && typeof stream[i] === 'function') {
            this[i] = (function (method) {
              return function () {
                return stream[method].apply(stream, arguments)
              }
            }(i))
          }
        }

  // proxy certain important events.
        var events = ['error', 'close', 'destroy', 'pause', 'resume']
        forEach(events, function (ev) {
          stream.on(ev, self.emit.bind(self, ev))
        })

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
        self._read = function (n) {
          debug('wrapped _read', n)
          if (paused) {
            paused = false
            stream.resume()
          }
        }

        return self
      }

// exposed for testing purposes only.
      Readable._fromList = fromList

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
      function fromList (n, state) {
        var list = state.buffer
        var length = state.length
        var stringMode = !!state.decoder
        var objectMode = !!state.objectMode
        var ret

  // nothing in the list, definitely empty.
        if (list.length === 0) { return null }

        if (length === 0) { ret = null } else if (objectMode) { ret = list.shift() } else if (!n || n >= length) {
    // read it all, truncate the array.
          if (stringMode) { ret = list.join('') } else { ret = Buffer.concat(list, length) }
          list.length = 0
        } else {
    // read just some of it.
          if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
            var buf = list[0]
            ret = buf.slice(0, n)
            list[0] = buf.slice(n)
          } else if (n === list[0].length) {
      // first list is a perfect match
            ret = list.shift()
          } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
            if (stringMode) { ret = '' } else { ret = new Buffer(n) }

            var c = 0
            for (var i = 0, l = list.length; i < l && c < n; i++) {
              var buf = list[0]
              var cpy = Math.min(n - c, buf.length)

              if (stringMode) { ret += buf.slice(0, cpy) } else { buf.copy(ret, c, 0, cpy) }

              if (cpy < buf.length) { list[0] = buf.slice(cpy) } else { list.shift() }

              c += cpy
            }
          }
        }

        return ret
      }

      function endReadable (stream) {
        var state = stream._readableState

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
        if (state.length > 0) { throw new Error('endReadable called on non-empty stream') }

        if (!state.endEmitted) {
          state.ended = true
          processNextTick(endReadableNT, state, stream)
        }
      }

      function endReadableNT (state, stream) {
  // Check that we didn't get one last unshift.
        if (!state.endEmitted && state.length === 0) {
          state.endEmitted = true
          stream.readable = false
          stream.emit('end')
        }
      }

      function forEach (xs, f) {
        for (var i = 0, l = xs.length; i < l; i++) {
          f(xs[i], i)
        }
      }

      function indexOf (xs, x) {
        for (var i = 0, l = xs.length; i < l; i++) {
          if (xs[i] === x) return i
        }
        return -1
      }
    }).call(this, require('_process'))
  }, {'./_stream_duplex': 25, '_process': 24, 'buffer': 17, 'core-util-is': 29, 'events': 21, 'inherits': 22, 'isarray': 23, 'process-nextick-args': 30, 'string_decoder/': 33, 'util': 3}],
  27: [function (require, module, exports) {
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

    'use strict'

    module.exports = Transform

    var Duplex = require('./_stream_duplex')

/* <replacement> */
    var util = require('core-util-is')
    util.inherits = require('inherits')
/* </replacement> */

    util.inherits(Transform, Duplex)

    function TransformState (stream) {
      this.afterTransform = function (er, data) {
        return afterTransform(stream, er, data)
      }

      this.needTransform = false
      this.transforming = false
      this.writecb = null
      this.writechunk = null
    }

    function afterTransform (stream, er, data) {
      var ts = stream._transformState
      ts.transforming = false

      var cb = ts.writecb

      if (!cb) { return stream.emit('error', new Error('no writecb in Transform class')) }

      ts.writechunk = null
      ts.writecb = null

      if (data !== null && data !== undefined) { stream.push(data) }

      if (cb) { cb(er) }

      var rs = stream._readableState
      rs.reading = false
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        stream._read(rs.highWaterMark)
      }
    }

    function Transform (options) {
      if (!(this instanceof Transform)) { return new Transform(options) }

      Duplex.call(this, options)

      this._transformState = new TransformState(this)

  // when the writable side finishes, then flush out anything remaining.
      var stream = this

  // start out asking for a readable event once data is transformed.
      this._readableState.needReadable = true

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
      this._readableState.sync = false

      if (options) {
        if (typeof options.transform === 'function') { this._transform = options.transform }

        if (typeof options.flush === 'function') { this._flush = options.flush }
      }

      this.once('prefinish', function () {
        if (typeof this._flush === 'function') {
          this._flush(function (er) {
            done(stream, er)
          })
        } else { done(stream) }
      })
    }

    Transform.prototype.push = function (chunk, encoding) {
      this._transformState.needTransform = false
      return Duplex.prototype.push.call(this, chunk, encoding)
    }

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
    Transform.prototype._transform = function (chunk, encoding, cb) {
      throw new Error('not implemented')
    }

    Transform.prototype._write = function (chunk, encoding, cb) {
      var ts = this._transformState
      ts.writecb = cb
      ts.writechunk = chunk
      ts.writeencoding = encoding
      if (!ts.transforming) {
        var rs = this._readableState
        if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark) { this._read(rs.highWaterMark) }
      }
    }

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
    Transform.prototype._read = function (n) {
      var ts = this._transformState

      if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
        ts.transforming = true
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform)
      } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
        ts.needTransform = true
      }
    }

    function done (stream, er) {
      if (er) { return stream.emit('error', er) }

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
      var ws = stream._writableState
      var ts = stream._transformState

      if (ws.length) { throw new Error('calling transform done when ws.length != 0') }

      if (ts.transforming) { throw new Error('calling transform done when still transforming') }

      return stream.push(null)
    }
  }, {'./_stream_duplex': 25, 'core-util-is': 29, 'inherits': 22}],
  28: [function (require, module, exports) {
// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

    'use strict'

    module.exports = Writable

/* <replacement> */
    var processNextTick = require('process-nextick-args')
/* </replacement> */

/* <replacement> */
    var Buffer = require('buffer').Buffer
/* </replacement> */

    Writable.WritableState = WritableState

/* <replacement> */
    var util = require('core-util-is')
    util.inherits = require('inherits')
/* </replacement> */

/* <replacement> */
    var Stream;
    (function () {
      try {
        Stream = require('st' + 'ream')
      } catch (_) {} finally {
        if (!Stream) { Stream = require('events').EventEmitter }
      }
    }())
/* </replacement> */

    var Buffer = require('buffer').Buffer

    util.inherits(Writable, Stream)

    function nop () {}

    function WriteReq (chunk, encoding, cb) {
      this.chunk = chunk
      this.encoding = encoding
      this.callback = cb
      this.next = null
    }

    function WritableState (options, stream) {
      var Duplex = require('./_stream_duplex')

      options = options || {}

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
      this.objectMode = !!options.objectMode

      if (stream instanceof Duplex) { this.objectMode = this.objectMode || !!options.writableObjectMode }

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
      var hwm = options.highWaterMark
      var defaultHwm = this.objectMode ? 16 : 16 * 1024
      this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm

  // cast to ints.
      this.highWaterMark = ~~this.highWaterMark

      this.needDrain = false
  // at the start of calling end()
      this.ending = false
  // when end() has been called, and returned
      this.ended = false
  // when 'finish' is emitted
      this.finished = false

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
      var noDecode = options.decodeStrings === false
      this.decodeStrings = !noDecode

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
      this.defaultEncoding = options.defaultEncoding || 'utf8'

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
      this.length = 0

  // a flag to see when we're in the middle of a write.
      this.writing = false

  // when true all writes will be buffered until .uncork() call
      this.corked = 0

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
      this.sync = true

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
      this.bufferProcessing = false

  // the callback that's passed to _write(chunk,cb)
      this.onwrite = function (er) {
        onwrite(stream, er)
      }

  // the callback that the user supplies to write(chunk,encoding,cb)
      this.writecb = null

  // the amount that is being written when _write is called.
      this.writelen = 0

      this.bufferedRequest = null
      this.lastBufferedRequest = null

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
      this.pendingcb = 0

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
      this.prefinished = false

  // True if the error was already emitted and should not be thrown again
      this.errorEmitted = false
    }

    WritableState.prototype.getBuffer = function writableStateGetBuffer () {
      var current = this.bufferedRequest
      var out = []
      while (current) {
        out.push(current)
        current = current.next
      }
      return out
    };

    (function () {
      try {
        Object.defineProperty(WritableState.prototype, 'buffer', {
          get: require('util-deprecate')(function () {
            return this.getBuffer()
          }, '_writableState.buffer is deprecated. Use ' +
      '_writableState.getBuffer() instead.')
        })
      } catch (_) {}
    }())

    function Writable (options) {
      var Duplex = require('./_stream_duplex')

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
      if (!(this instanceof Writable) && !(this instanceof Duplex)) { return new Writable(options) }

      this._writableState = new WritableState(options, this)

  // legacy.
      this.writable = true

      if (options) {
        if (typeof options.write === 'function') { this._write = options.write }

        if (typeof options.writev === 'function') { this._writev = options.writev }
      }

      Stream.call(this)
    }

// Otherwise people can pipe Writable streams, which is just wrong.
    Writable.prototype.pipe = function () {
      this.emit('error', new Error('Cannot pipe. Not readable.'))
    }

    function writeAfterEnd (stream, cb) {
      var er = new Error('write after end')
  // TODO: defer error events consistently everywhere, not just the cb
      stream.emit('error', er)
      processNextTick(cb, er)
    }

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
    function validChunk (stream, state, chunk, cb) {
      var valid = true

      if (!(Buffer.isBuffer(chunk)) &&
      typeof chunk !== 'string' &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
        var er = new TypeError('Invalid non-string/buffer chunk')
        stream.emit('error', er)
        processNextTick(cb, er)
        valid = false
      }
      return valid
    }

    Writable.prototype.write = function (chunk, encoding, cb) {
      var state = this._writableState
      var ret = false

      if (typeof encoding === 'function') {
        cb = encoding
        encoding = null
      }

      if (Buffer.isBuffer(chunk)) { encoding = 'buffer' } else if (!encoding) { encoding = state.defaultEncoding }

      if (typeof cb !== 'function') { cb = nop }

      if (state.ended) { writeAfterEnd(this, cb) } else if (validChunk(this, state, chunk, cb)) {
        state.pendingcb++
        ret = writeOrBuffer(this, state, chunk, encoding, cb)
      }

      return ret
    }

    Writable.prototype.cork = function () {
      var state = this._writableState

      state.corked++
    }

    Writable.prototype.uncork = function () {
      var state = this._writableState

      if (state.corked) {
        state.corked--

        if (!state.writing &&
        !state.corked &&
        !state.finished &&
        !state.bufferProcessing &&
        state.bufferedRequest) { clearBuffer(this, state) }
      }
    }

    Writable.prototype.setDefaultEncoding = function setDefaultEncoding (encoding) {
  // node::ParseEncoding() requires lower case.
      if (typeof encoding === 'string') { encoding = encoding.toLowerCase() }
      if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64',
        'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw']
.indexOf((encoding + '').toLowerCase()) > -1)) { throw new TypeError('Unknown encoding: ' + encoding) }
      this._writableState.defaultEncoding = encoding
    }

    function decodeChunk (state, chunk, encoding) {
      if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
        chunk = new Buffer(chunk, encoding)
      }
      return chunk
    }

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
    function writeOrBuffer (stream, state, chunk, encoding, cb) {
      chunk = decodeChunk(state, chunk, encoding)

      if (Buffer.isBuffer(chunk)) { encoding = 'buffer' }
      var len = state.objectMode ? 1 : chunk.length

      state.length += len

      var ret = state.length < state.highWaterMark
  // we must ensure that previous needDrain will not be reset to false.
      if (!ret) { state.needDrain = true }

      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest
        state.lastBufferedRequest = new WriteReq(chunk, encoding, cb)
        if (last) {
          last.next = state.lastBufferedRequest
        } else {
          state.bufferedRequest = state.lastBufferedRequest
        }
      } else {
        doWrite(stream, state, false, len, chunk, encoding, cb)
      }

      return ret
    }

    function doWrite (stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len
      state.writecb = cb
      state.writing = true
      state.sync = true
      if (writev) { stream._writev(chunk, state.onwrite) } else { stream._write(chunk, encoding, state.onwrite) }
      state.sync = false
    }

    function onwriteError (stream, state, sync, er, cb) {
      --state.pendingcb
      if (sync) { processNextTick(cb, er) } else { cb(er) }

      stream._writableState.errorEmitted = true
      stream.emit('error', er)
    }

    function onwriteStateUpdate (state) {
      state.writing = false
      state.writecb = null
      state.length -= state.writelen
      state.writelen = 0
    }

    function onwrite (stream, er) {
      var state = stream._writableState
      var sync = state.sync
      var cb = state.writecb

      onwriteStateUpdate(state)

      if (er) { onwriteError(stream, state, sync, er, cb) } else {
    // Check if we're actually ready to finish, but don't emit yet
        var finished = needFinish(state)

        if (!finished &&
        !state.corked &&
        !state.bufferProcessing &&
        state.bufferedRequest) {
          clearBuffer(stream, state)
        }

        if (sync) {
          processNextTick(afterWrite, stream, state, finished, cb)
        } else {
          afterWrite(stream, state, finished, cb)
        }
      }
    }

    function afterWrite (stream, state, finished, cb) {
      if (!finished) { onwriteDrain(stream, state) }
      state.pendingcb--
      cb()
      finishMaybe(stream, state)
    }

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
    function onwriteDrain (stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false
        stream.emit('drain')
      }
    }

// if there's something in the buffer waiting, then process it
    function clearBuffer (stream, state) {
      state.bufferProcessing = true
      var entry = state.bufferedRequest

      if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
        var buffer = []
        var cbs = []
        while (entry) {
          cbs.push(entry.callback)
          buffer.push(entry)
          entry = entry.next
        }

    // count the one we are adding, as well.
    // TODO(isaacs) clean this up
        state.pendingcb++
        state.lastBufferedRequest = null
        doWrite(stream, state, true, state.length, buffer, '', function (err) {
          for (var i = 0; i < cbs.length; i++) {
            state.pendingcb--
            cbs[i](err)
          }
        })

    // Clear buffer
      } else {
    // Slow case, write chunks one-by-one
        while (entry) {
          var chunk = entry.chunk
          var encoding = entry.encoding
          var cb = entry.callback
          var len = state.objectMode ? 1 : chunk.length

          doWrite(stream, state, false, len, chunk, encoding, cb)
          entry = entry.next
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
          if (state.writing) {
            break
          }
        }

        if (entry === null) { state.lastBufferedRequest = null }
      }
      state.bufferedRequest = entry
      state.bufferProcessing = false
    }

    Writable.prototype._write = function (chunk, encoding, cb) {
      cb(new Error('not implemented'))
    }

    Writable.prototype._writev = null

    Writable.prototype.end = function (chunk, encoding, cb) {
      var state = this._writableState

      if (typeof chunk === 'function') {
        cb = chunk
        chunk = null
        encoding = null
      } else if (typeof encoding === 'function') {
        cb = encoding
        encoding = null
      }

      if (chunk !== null && chunk !== undefined) { this.write(chunk, encoding) }

  // .end() fully uncorks
      if (state.corked) {
        state.corked = 1
        this.uncork()
      }

  // ignore unnecessary end() calls.
      if (!state.ending && !state.finished) { endWritable(this, state, cb) }
    }

    function needFinish (state) {
      return (state.ending &&
          state.length === 0 &&
          state.bufferedRequest === null &&
          !state.finished &&
          !state.writing)
    }

    function prefinish (stream, state) {
      if (!state.prefinished) {
        state.prefinished = true
        stream.emit('prefinish')
      }
    }

    function finishMaybe (stream, state) {
      var need = needFinish(state)
      if (need) {
        if (state.pendingcb === 0) {
          prefinish(stream, state)
          state.finished = true
          stream.emit('finish')
        } else {
          prefinish(stream, state)
        }
      }
      return need
    }

    function endWritable (stream, state, cb) {
      state.ending = true
      finishMaybe(stream, state)
      if (cb) {
        if (state.finished) { processNextTick(cb) } else { stream.once('finish', cb) }
      }
      state.ended = true
    }
  }, {'./_stream_duplex': 25, 'buffer': 17, 'core-util-is': 29, 'events': 21, 'inherits': 22, 'process-nextick-args': 30, 'util-deprecate': 31}],
  29: [function (require, module, exports) {
    (function (Buffer) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
      function isArray (ar) {
        return Array.isArray(ar)
      }
      exports.isArray = isArray

      function isBoolean (arg) {
        return typeof arg === 'boolean'
      }
      exports.isBoolean = isBoolean

      function isNull (arg) {
        return arg === null
      }
      exports.isNull = isNull

      function isNullOrUndefined (arg) {
        return arg == null
      }
      exports.isNullOrUndefined = isNullOrUndefined

      function isNumber (arg) {
        return typeof arg === 'number'
      }
      exports.isNumber = isNumber

      function isString (arg) {
        return typeof arg === 'string'
      }
      exports.isString = isString

      function isSymbol (arg) {
        return typeof arg === 'symbol'
      }
      exports.isSymbol = isSymbol

      function isUndefined (arg) {
        return arg === void 0
      }
      exports.isUndefined = isUndefined

      function isRegExp (re) {
        return isObject(re) && objectToString(re) === '[object RegExp]'
      }
      exports.isRegExp = isRegExp

      function isObject (arg) {
        return typeof arg === 'object' && arg !== null
      }
      exports.isObject = isObject

      function isDate (d) {
        return isObject(d) && objectToString(d) === '[object Date]'
      }
      exports.isDate = isDate

      function isError (e) {
        return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error)
      }
      exports.isError = isError

      function isFunction (arg) {
        return typeof arg === 'function'
      }
      exports.isFunction = isFunction

      function isPrimitive (arg) {
        return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined'
      }
      exports.isPrimitive = isPrimitive

      function isBuffer (arg) {
        return Buffer.isBuffer(arg)
      }
      exports.isBuffer = isBuffer

      function objectToString (o) {
        return Object.prototype.toString.call(o)
      }
    }).call(this, require('buffer').Buffer)
  }, {'buffer': 17}],
  30: [function (require, module, exports) {
    (function (process) {
      'use strict'
      module.exports = nextTick

      function nextTick (fn) {
        var args = new Array(arguments.length - 1)
        var i = 0
        while (i < args.length) {
          args[i++] = arguments[i]
        }
        process.nextTick(function afterTick () {
          fn.apply(null, args)
        })
      }
    }).call(this, require('_process'))
  }, {'_process': 24}],
  31: [function (require, module, exports) {
    (function (global) {
/**
 * Module exports.
 */

      module.exports = deprecate

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

      function deprecate (fn, msg) {
        if (config('noDeprecation')) {
          return fn
        }

        var warned = false
        function deprecated () {
          if (!warned) {
            if (config('throwDeprecation')) {
              throw new Error(msg)
            } else if (config('traceDeprecation')) {
              console.trace(msg)
            } else {
              console.warn(msg)
            }
            warned = true
          }
          return fn.apply(this, arguments)
        }

        return deprecated
      }

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

      function config (name) {
        if (!global.localStorage) return false
        var val = global.localStorage[name]
        if (val == null) return false
        return String(val).toLowerCase() === 'true'
      }
    }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
  }, {}],
  32: [function (require, module, exports) {
    module.exports = require('./lib/_stream_transform.js')
  }, {'./lib/_stream_transform.js': 27}],
  33: [function (require, module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

    var Buffer = require('buffer').Buffer

    var isBufferEncoding = Buffer.isEncoding ||
  function (encoding) {
    switch (encoding && encoding.toLowerCase()) {
      case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true
      default: return false
    }
  }

    function assertEncoding (encoding) {
      if (encoding && !isBufferEncoding(encoding)) {
        throw new Error('Unknown encoding: ' + encoding)
      }
    }

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
    var StringDecoder = exports.StringDecoder = function (encoding) {
      this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '')
      assertEncoding(encoding)
      switch (this.encoding) {
        case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
          this.surrogateSize = 3
          break
        case 'ucs2':
        case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
          this.surrogateSize = 2
          this.detectIncompleteChar = utf16DetectIncompleteChar
          break
        case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
          this.surrogateSize = 3
          this.detectIncompleteChar = base64DetectIncompleteChar
          break
        default:
          this.write = passThroughWrite
          return
      }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
      this.charBuffer = new Buffer(6)
  // Number of bytes received for the current incomplete multi-byte character.
      this.charReceived = 0
  // Number of bytes expected for the current incomplete multi-byte character.
      this.charLength = 0
    }

// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
    StringDecoder.prototype.write = function (buffer) {
      var charStr = ''
  // if our last write ended with an incomplete multibyte character
      while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
        var available = (buffer.length >= this.charLength - this.charReceived)
        ? this.charLength - this.charReceived
        : buffer.length

    // add the new bytes to the char buffer
        buffer.copy(this.charBuffer, this.charReceived, 0, available)
        this.charReceived += available

        if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
          return ''
        }

    // remove bytes belonging to the current character from the buffer
        buffer = buffer.slice(available, buffer.length)

    // get the character that was split
        charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding)

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
        var charCode = charStr.charCodeAt(charStr.length - 1)
        if (charCode >= 0xD800 && charCode <= 0xDBFF) {
          this.charLength += this.surrogateSize
          charStr = ''
          continue
        }
        this.charReceived = this.charLength = 0

    // if there are no more bytes in this buffer, just emit our char
        if (buffer.length === 0) {
          return charStr
        }
        break
      }

  // determine and set charLength / charReceived
      this.detectIncompleteChar(buffer)

      var end = buffer.length
      if (this.charLength) {
    // buffer the incomplete character bytes we got
        buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end)
        end -= this.charReceived
      }

      charStr += buffer.toString(this.encoding, 0, end)

      var end = charStr.length - 1
      var charCode = charStr.charCodeAt(end)
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
      if (charCode >= 0xD800 && charCode <= 0xDBFF) {
        var size = this.surrogateSize
        this.charLength += size
        this.charReceived += size
        this.charBuffer.copy(this.charBuffer, size, 0, size)
        buffer.copy(this.charBuffer, 0, 0, size)
        return charStr.substring(0, end)
      }

  // or just emit the charStr
      return charStr
    }

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
    StringDecoder.prototype.detectIncompleteChar = function (buffer) {
  // determine how many bytes we have to check at the end of this buffer
      var i = (buffer.length >= 3) ? 3 : buffer.length

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
      for (; i > 0; i--) {
        var c = buffer[buffer.length - i]

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
        if (i == 1 && c >> 5 == 0x06) {
          this.charLength = 2
          break
        }

    // 1110XXXX
        if (i <= 2 && c >> 4 == 0x0E) {
          this.charLength = 3
          break
        }

    // 11110XXX
        if (i <= 3 && c >> 3 == 0x1E) {
          this.charLength = 4
          break
        }
      }
      this.charReceived = i
    }

    StringDecoder.prototype.end = function (buffer) {
      var res = ''
      if (buffer && buffer.length) { res = this.write(buffer) }

      if (this.charReceived) {
        var cr = this.charReceived
        var buf = this.charBuffer
        var enc = this.encoding
        res += buf.slice(0, cr).toString(enc)
      }

      return res
    }

    function passThroughWrite (buffer) {
      return buffer.toString(this.encoding)
    }

    function utf16DetectIncompleteChar (buffer) {
      this.charReceived = buffer.length % 2
      this.charLength = this.charReceived ? 2 : 0
    }

    function base64DetectIncompleteChar (buffer) {
      this.charReceived = buffer.length % 3
      this.charLength = this.charReceived ? 3 : 0
    }
  }, {'buffer': 17}],
  34: [function (require, module, exports) {
    module.exports = function isBuffer (arg) {
      return arg && typeof arg === 'object' &&
    typeof arg.copy === 'function' &&
    typeof arg.fill === 'function' &&
    typeof arg.readUInt8 === 'function'
    }
  }, {}],
  35: [function (require, module, exports) {
    (function (process, global) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

      var formatRegExp = /%[sdj%]/g
      exports.format = function (f) {
        if (!isString(f)) {
          var objects = []
          for (var i = 0; i < arguments.length; i++) {
            objects.push(inspect(arguments[i]))
          }
          return objects.join(' ')
        }

        var i = 1
        var args = arguments
        var len = args.length
        var str = String(f).replace(formatRegExp, function (x) {
          if (x === '%%') return '%'
          if (i >= len) return x
          switch (x) {
            case '%s': return String(args[i++])
            case '%d': return Number(args[i++])
            case '%j':
              try {
                return JSON.stringify(args[i++])
              } catch (_) {
                return '[Circular]'
              }
            default:
              return x
          }
        })
        for (var x = args[i]; i < len; x = args[++i]) {
          if (isNull(x) || !isObject(x)) {
            str += ' ' + x
          } else {
            str += ' ' + inspect(x)
          }
        }
        return str
      }

// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
      exports.deprecate = function (fn, msg) {
  // Allow for deprecating things in the process of starting up.
        if (isUndefined(global.process)) {
          return function () {
            return exports.deprecate(fn, msg).apply(this, arguments)
          }
        }

        if (process.noDeprecation === true) {
          return fn
        }

        var warned = false
        function deprecated () {
          if (!warned) {
            if (process.throwDeprecation) {
              throw new Error(msg)
            } else if (process.traceDeprecation) {
              console.trace(msg)
            } else {
              console.error(msg)
            }
            warned = true
          }
          return fn.apply(this, arguments)
        }

        return deprecated
      }

      var debugs = {}
      var debugEnviron
      exports.debuglog = function (set) {
        if (isUndefined(debugEnviron)) { debugEnviron = process.env.NODE_DEBUG || '' }
        set = set.toUpperCase()
        if (!debugs[set]) {
          if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
            var pid = process.pid
            debugs[set] = function () {
              var msg = exports.format.apply(exports, arguments)
              console.error('%s %d: %s', set, pid, msg)
            }
          } else {
            debugs[set] = function () {}
          }
        }
        return debugs[set]
      }

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors */
      function inspect (obj, opts) {
  // default options
        var ctx = {
          seen: [],
          stylize: stylizeNoColor
        }
  // legacy...
        if (arguments.length >= 3) ctx.depth = arguments[2]
        if (arguments.length >= 4) ctx.colors = arguments[3]
        if (isBoolean(opts)) {
    // legacy...
          ctx.showHidden = opts
        } else if (opts) {
    // got an "options" object
          exports._extend(ctx, opts)
        }
  // set default options
        if (isUndefined(ctx.showHidden)) ctx.showHidden = false
        if (isUndefined(ctx.depth)) ctx.depth = 2
        if (isUndefined(ctx.colors)) ctx.colors = false
        if (isUndefined(ctx.customInspect)) ctx.customInspect = true
        if (ctx.colors) ctx.stylize = stylizeWithColor
        return formatValue(ctx, obj, ctx.depth)
      }
      exports.inspect = inspect

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
      inspect.colors = {
        'bold': [1, 22],
        'italic': [3, 23],
        'underline': [4, 24],
        'inverse': [7, 27],
        'white': [37, 39],
        'grey': [90, 39],
        'black': [30, 39],
        'blue': [34, 39],
        'cyan': [36, 39],
        'green': [32, 39],
        'magenta': [35, 39],
        'red': [31, 39],
        'yellow': [33, 39]
      }

// Don't use 'blue' not visible on cmd.exe
      inspect.styles = {
        'special': 'cyan',
        'number': 'yellow',
        'boolean': 'yellow',
        'undefined': 'grey',
        'null': 'bold',
        'string': 'green',
        'date': 'magenta',
  // "name": intentionally not styling
        'regexp': 'red'
      }

      function stylizeWithColor (str, styleType) {
        var style = inspect.styles[styleType]

        if (style) {
          return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm'
        } else {
          return str
        }
      }

      function stylizeNoColor (str, styleType) {
        return str
      }

      function arrayToHash (array) {
        var hash = {}

        array.forEach(function (val, idx) {
          hash[val] = true
        })

        return hash
      }

      function formatValue (ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
        if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
          var ret = value.inspect(recurseTimes, ctx)
          if (!isString(ret)) {
            ret = formatValue(ctx, ret, recurseTimes)
          }
          return ret
        }

  // Primitive types cannot have properties
        var primitive = formatPrimitive(ctx, value)
        if (primitive) {
          return primitive
        }

  // Look up the keys of the object.
        var keys = Object.keys(value)
        var visibleKeys = arrayToHash(keys)

        if (ctx.showHidden) {
          keys = Object.getOwnPropertyNames(value)
        }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
        if (isError(value) &&
      (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
          return formatError(value)
        }

  // Some type of object without properties can be shortcutted.
        if (keys.length === 0) {
          if (isFunction(value)) {
            var name = value.name ? ': ' + value.name : ''
            return ctx.stylize('[Function' + name + ']', 'special')
          }
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp')
          }
          if (isDate(value)) {
            return ctx.stylize(Date.prototype.toString.call(value), 'date')
          }
          if (isError(value)) {
            return formatError(value)
          }
        }

        var base = '', array = false, braces = ['{', '}']

  // Make Array say that they are Array
        if (isArray(value)) {
          array = true
          braces = ['[', ']']
        }

  // Make functions say that they are functions
        if (isFunction(value)) {
          var n = value.name ? ': ' + value.name : ''
          base = ' [Function' + n + ']'
        }

  // Make RegExps say that they are RegExps
        if (isRegExp(value)) {
          base = ' ' + RegExp.prototype.toString.call(value)
        }

  // Make dates with properties first say the date
        if (isDate(value)) {
          base = ' ' + Date.prototype.toUTCString.call(value)
        }

  // Make error with message first say the error
        if (isError(value)) {
          base = ' ' + formatError(value)
        }

        if (keys.length === 0 && (!array || value.length == 0)) {
          return braces[0] + base + braces[1]
        }

        if (recurseTimes < 0) {
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp')
          } else {
            return ctx.stylize('[Object]', 'special')
          }
        }

        ctx.seen.push(value)

        var output
        if (array) {
          output = formatArray(ctx, value, recurseTimes, visibleKeys, keys)
        } else {
          output = keys.map(function (key) {
            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array)
          })
        }

        ctx.seen.pop()

        return reduceToSingleString(output, base, braces)
      }

      function formatPrimitive (ctx, value) {
        if (isUndefined(value)) { return ctx.stylize('undefined', 'undefined') }
        if (isString(value)) {
          var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\''
          return ctx.stylize(simple, 'string')
        }
        if (isNumber(value)) { return ctx.stylize('' + value, 'number') }
        if (isBoolean(value)) { return ctx.stylize('' + value, 'boolean') }
  // For some reason typeof null is "object", so special case here.
        if (isNull(value)) { return ctx.stylize('null', 'null') }
      }

      function formatError (value) {
        return '[' + Error.prototype.toString.call(value) + ']'
      }

      function formatArray (ctx, value, recurseTimes, visibleKeys, keys) {
        var output = []
        for (var i = 0, l = value.length; i < l; ++i) {
          if (hasOwnProperty(value, String(i))) {
            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true))
          } else {
            output.push('')
          }
        }
        keys.forEach(function (key) {
          if (!key.match(/^\d+$/)) {
            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true))
          }
        })
        return output
      }

      function formatProperty (ctx, value, recurseTimes, visibleKeys, key, array) {
        var name, str, desc
        desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] }
        if (desc.get) {
          if (desc.set) {
            str = ctx.stylize('[Getter/Setter]', 'special')
          } else {
            str = ctx.stylize('[Getter]', 'special')
          }
        } else {
          if (desc.set) {
            str = ctx.stylize('[Setter]', 'special')
          }
        }
        if (!hasOwnProperty(visibleKeys, key)) {
          name = '[' + key + ']'
        }
        if (!str) {
          if (ctx.seen.indexOf(desc.value) < 0) {
            if (isNull(recurseTimes)) {
              str = formatValue(ctx, desc.value, null)
            } else {
              str = formatValue(ctx, desc.value, recurseTimes - 1)
            }
            if (str.indexOf('\n') > -1) {
              if (array) {
                str = str.split('\n').map(function (line) {
                  return '  ' + line
                }).join('\n').substr(2)
              } else {
                str = '\n' + str.split('\n').map(function (line) {
                  return '   ' + line
                }).join('\n')
              }
            }
          } else {
            str = ctx.stylize('[Circular]', 'special')
          }
        }
        if (isUndefined(name)) {
          if (array && key.match(/^\d+$/)) {
            return str
          }
          name = JSON.stringify('' + key)
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2)
            name = ctx.stylize(name, 'name')
          } else {
            name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'")
            name = ctx.stylize(name, 'string')
          }
        }

        return name + ': ' + str
      }

      function reduceToSingleString (output, base, braces) {
        var numLinesEst = 0
        var length = output.reduce(function (prev, cur) {
          numLinesEst++
          if (cur.indexOf('\n') >= 0) numLinesEst++
          return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1
        }, 0)

        if (length > 60) {
          return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1]
        }

        return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1]
      }

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
      function isArray (ar) {
        return Array.isArray(ar)
      }
      exports.isArray = isArray

      function isBoolean (arg) {
        return typeof arg === 'boolean'
      }
      exports.isBoolean = isBoolean

      function isNull (arg) {
        return arg === null
      }
      exports.isNull = isNull

      function isNullOrUndefined (arg) {
        return arg == null
      }
      exports.isNullOrUndefined = isNullOrUndefined

      function isNumber (arg) {
        return typeof arg === 'number'
      }
      exports.isNumber = isNumber

      function isString (arg) {
        return typeof arg === 'string'
      }
      exports.isString = isString

      function isSymbol (arg) {
        return typeof arg === 'symbol'
      }
      exports.isSymbol = isSymbol

      function isUndefined (arg) {
        return arg === void 0
      }
      exports.isUndefined = isUndefined

      function isRegExp (re) {
        return isObject(re) && objectToString(re) === '[object RegExp]'
      }
      exports.isRegExp = isRegExp

      function isObject (arg) {
        return typeof arg === 'object' && arg !== null
      }
      exports.isObject = isObject

      function isDate (d) {
        return isObject(d) && objectToString(d) === '[object Date]'
      }
      exports.isDate = isDate

      function isError (e) {
        return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error)
      }
      exports.isError = isError

      function isFunction (arg) {
        return typeof arg === 'function'
      }
      exports.isFunction = isFunction

      function isPrimitive (arg) {
        return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined'
      }
      exports.isPrimitive = isPrimitive

      exports.isBuffer = require('./support/isBuffer')

      function objectToString (o) {
        return Object.prototype.toString.call(o)
      }

      function pad (n) {
        return n < 10 ? '0' + n.toString(10) : n.toString(10)
      }

      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec']

// 26 Feb 16:19:34
      function timestamp () {
        var d = new Date()
        var time = [pad(d.getHours()),
          pad(d.getMinutes()),
          pad(d.getSeconds())].join(':')
        return [d.getDate(), months[d.getMonth()], time].join(' ')
      }

// log is just a thin wrapper to console.log that prepends a timestamp
      exports.log = function () {
        console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments))
      }

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
      exports.inherits = require('inherits')

      exports._extend = function (origin, add) {
  // Don't do anything if add isn't an object
        if (!add || !isObject(add)) return origin

        var keys = Object.keys(add)
        var i = keys.length
        while (i--) {
          origin[keys[i]] = add[keys[i]]
        }
        return origin
      }

      function hasOwnProperty (obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop)
      }
    }).call(this, require('_process'), typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
  }, {'./support/isBuffer': 34, '_process': 24, 'inherits': 22}],
  36: [function (require, module, exports) {
    !(function () {
      var d3 = {
        version: '3.5.6'
      }
      var d3_arraySlice = [].slice, d3_array = function (list) {
          return d3_arraySlice.call(list)
        }
      var d3_document = this.document
      function d3_documentElement (node) {
        return node && (node.ownerDocument || node.document || node).documentElement
      }
      function d3_window (node) {
        return node && (node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView)
      }
      if (d3_document) {
        try {
          d3_array(d3_document.documentElement.childNodes)[0].nodeType
        } catch (e) {
          d3_array = function (list) {
            var i = list.length, array = new Array(i)
            while (i--) array[i] = list[i]
            return array
          }
        }
      }
      if (!Date.now) {
        Date.now = function () {
          return +new Date()
        }
      }
      if (d3_document) {
        try {
          d3_document.createElement('DIV').style.setProperty('opacity', 0, '')
        } catch (error) {
          var d3_element_prototype = this.Element.prototype, d3_element_setAttribute = d3_element_prototype.setAttribute, d3_element_setAttributeNS = d3_element_prototype.setAttributeNS, d3_style_prototype = this.CSSStyleDeclaration.prototype, d3_style_setProperty = d3_style_prototype.setProperty
          d3_element_prototype.setAttribute = function (name, value) {
            d3_element_setAttribute.call(this, name, value + '')
          }
          d3_element_prototype.setAttributeNS = function (space, local, value) {
            d3_element_setAttributeNS.call(this, space, local, value + '')
          }
          d3_style_prototype.setProperty = function (name, value, priority) {
            d3_style_setProperty.call(this, name, value + '', priority)
          }
        }
      }
      d3.ascending = d3_ascending
      function d3_ascending (a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN
      }
      d3.descending = function (a, b) {
        return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN
      }
      d3.min = function (array, f) {
        var i = -1, n = array.length, a, b
        if (arguments.length === 1) {
          while (++i < n) {
            if ((b = array[i]) != null && b >= b) {
              a = b
              break
            }
          }
          while (++i < n) if ((b = array[i]) != null && a > b) a = b
        } else {
          while (++i < n) {
            if ((b = f.call(array, array[i], i)) != null && b >= b) {
              a = b
              break
            }
          }
          while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b
        }
        return a
      }
      d3.max = function (array, f) {
        var i = -1, n = array.length, a, b
        if (arguments.length === 1) {
          while (++i < n) {
            if ((b = array[i]) != null && b >= b) {
              a = b
              break
            }
          }
          while (++i < n) if ((b = array[i]) != null && b > a) a = b
        } else {
          while (++i < n) {
            if ((b = f.call(array, array[i], i)) != null && b >= b) {
              a = b
              break
            }
          }
          while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b
        }
        return a
      }
      d3.extent = function (array, f) {
        var i = -1, n = array.length, a, b, c
        if (arguments.length === 1) {
          while (++i < n) {
            if ((b = array[i]) != null && b >= b) {
              a = c = b
              break
            }
          }
          while (++i < n) {
            if ((b = array[i]) != null) {
              if (a > b) a = b
              if (c < b) c = b
            }
          }
        } else {
          while (++i < n) {
            if ((b = f.call(array, array[i], i)) != null && b >= b) {
              a = c = b
              break
            }
          }
          while (++i < n) {
            if ((b = f.call(array, array[i], i)) != null) {
              if (a > b) a = b
              if (c < b) c = b
            }
          }
        }
        return [ a, c ]
      }
      function d3_number (x) {
        return x === null ? NaN : +x
      }
      function d3_numeric (x) {
        return !isNaN(x)
      }
      d3.sum = function (array, f) {
        var s = 0, n = array.length, a, i = -1
        if (arguments.length === 1) {
          while (++i < n) if (d3_numeric(a = +array[i])) s += a
        } else {
          while (++i < n) if (d3_numeric(a = +f.call(array, array[i], i))) s += a
        }
        return s
      }
      d3.mean = function (array, f) {
        var s = 0, n = array.length, a, i = -1, j = n
        if (arguments.length === 1) {
          while (++i < n) if (d3_numeric(a = d3_number(array[i]))) s += a; else --j
        } else {
          while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) s += a; else --j
        }
        if (j) return s / j
      }
      d3.quantile = function (values, p) {
        var H = (values.length - 1) * p + 1, h = Math.floor(H), v = +values[h - 1], e = H - h
        return e ? v + e * (values[h] - v) : v
      }
      d3.median = function (array, f) {
        var numbers = [], n = array.length, a, i = -1
        if (arguments.length === 1) {
          while (++i < n) if (d3_numeric(a = d3_number(array[i]))) numbers.push(a)
        } else {
          while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) numbers.push(a)
        }
        if (numbers.length) return d3.quantile(numbers.sort(d3_ascending), 0.5)
      }
      d3.variance = function (array, f) {
        var n = array.length, m = 0, a, d, s = 0, i = -1, j = 0
        if (arguments.length === 1) {
          while (++i < n) {
            if (d3_numeric(a = d3_number(array[i]))) {
              d = a - m
              m += d / ++j
              s += d * (a - m)
            }
          }
        } else {
          while (++i < n) {
            if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) {
              d = a - m
              m += d / ++j
              s += d * (a - m)
            }
          }
        }
        if (j > 1) return s / (j - 1)
      }
      d3.deviation = function () {
        var v = d3.variance.apply(this, arguments)
        return v ? Math.sqrt(v) : v
      }
      function d3_bisector (compare) {
        return {
          left: function (a, x, lo, hi) {
            if (arguments.length < 3) lo = 0
            if (arguments.length < 4) hi = a.length
            while (lo < hi) {
              var mid = lo + hi >>> 1
              if (compare(a[mid], x) < 0) lo = mid + 1; else hi = mid
            }
            return lo
          },
          right: function (a, x, lo, hi) {
            if (arguments.length < 3) lo = 0
            if (arguments.length < 4) hi = a.length
            while (lo < hi) {
              var mid = lo + hi >>> 1
              if (compare(a[mid], x) > 0) hi = mid; else lo = mid + 1
            }
            return lo
          }
        }
      }
      var d3_bisect = d3_bisector(d3_ascending)
      d3.bisectLeft = d3_bisect.left
      d3.bisect = d3.bisectRight = d3_bisect.right
      d3.bisector = function (f) {
        return d3_bisector(f.length === 1 ? function (d, x) {
          return d3_ascending(f(d), x)
        } : f)
      }
      d3.shuffle = function (array, i0, i1) {
        if ((m = arguments.length) < 3) {
          i1 = array.length
          if (m < 2) i0 = 0
        }
        var m = i1 - i0, t, i
        while (m) {
          i = Math.random() * m-- | 0
          t = array[m + i0], array[m + i0] = array[i + i0], array[i + i0] = t
        }
        return array
      }
      d3.permute = function (array, indexes) {
        var i = indexes.length, permutes = new Array(i)
        while (i--) permutes[i] = array[indexes[i]]
        return permutes
      }
      d3.pairs = function (array) {
        var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n)
        while (i < n) pairs[i] = [ p0 = p1, p1 = array[++i] ]
        return pairs
      }
      d3.zip = function () {
        if (!(n = arguments.length)) return []
        for (var i = -1, m = d3.min(arguments, d3_zipLength), zips = new Array(m); ++i < m;) {
          for (var j = -1, n, zip = zips[i] = new Array(n); ++j < n;) {
            zip[j] = arguments[j][i]
          }
        }
        return zips
      }
      function d3_zipLength (d) {
        return d.length
      }
      d3.transpose = function (matrix) {
        return d3.zip.apply(d3, matrix)
      }
      d3.keys = function (map) {
        var keys = []
        for (var key in map) keys.push(key)
        return keys
      }
      d3.values = function (map) {
        var values = []
        for (var key in map) values.push(map[key])
        return values
      }
      d3.entries = function (map) {
        var entries = []
        for (var key in map) {
          entries.push({
            key: key,
            value: map[key]
          })
        }
        return entries
      }
      d3.merge = function (arrays) {
        var n = arrays.length, m, i = -1, j = 0, merged, array
        while (++i < n) j += arrays[i].length
        merged = new Array(j)
        while (--n >= 0) {
          array = arrays[n]
          m = array.length
          while (--m >= 0) {
            merged[--j] = array[m]
          }
        }
        return merged
      }
      var abs = Math.abs
      d3.range = function (start, stop, step) {
        if (arguments.length < 3) {
          step = 1
          if (arguments.length < 2) {
            stop = start
            start = 0
          }
        }
        if ((stop - start) / step === Infinity) throw new Error('infinite range')
        var range = [], k = d3_range_integerScale(abs(step)), i = -1, j
        start *= k, stop *= k, step *= k
        if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k)
        return range
      }
      function d3_range_integerScale (x) {
        var k = 1
        while (x * k % 1) k *= 10
        return k
      }
      function d3_class (ctor, properties) {
        for (var key in properties) {
          Object.defineProperty(ctor.prototype, key, {
            value: properties[key],
            enumerable: false
          })
        }
      }
      d3.map = function (object, f) {
        var map = new d3_Map()
        if (object instanceof d3_Map) {
          object.forEach(function (key, value) {
            map.set(key, value)
          })
        } else if (Array.isArray(object)) {
          var i = -1, n = object.length, o
          if (arguments.length === 1) while (++i < n) map.set(i, object[i]); else while (++i < n) map.set(f.call(object, o = object[i], i), o)
        } else {
          for (var key in object) map.set(key, object[key])
        }
        return map
      }
      function d3_Map () {
        this._ = Object.create(null)
      }
      var d3_map_proto = '__proto__', d3_map_zero = '\x00'
      d3_class(d3_Map, {
        has: d3_map_has,
        get: function (key) {
          return this._[d3_map_escape(key)]
        },
        set: function (key, value) {
          return this._[d3_map_escape(key)] = value
        },
        remove: d3_map_remove,
        keys: d3_map_keys,
        values: function () {
          var values = []
          for (var key in this._) values.push(this._[key])
          return values
        },
        entries: function () {
          var entries = []
          for (var key in this._) {
            entries.push({
              key: d3_map_unescape(key),
              value: this._[key]
            })
          }
          return entries
        },
        size: d3_map_size,
        empty: d3_map_empty,
        forEach: function (f) {
          for (var key in this._) f.call(this, d3_map_unescape(key), this._[key])
        }
      })
      function d3_map_escape (key) {
        return (key += '') === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + key : key
      }
      function d3_map_unescape (key) {
        return (key += '')[0] === d3_map_zero ? key.slice(1) : key
      }
      function d3_map_has (key) {
        return d3_map_escape(key) in this._
      }
      function d3_map_remove (key) {
        return (key = d3_map_escape(key)) in this._ && delete this._[key]
      }
      function d3_map_keys () {
        var keys = []
        for (var key in this._) keys.push(d3_map_unescape(key))
        return keys
      }
      function d3_map_size () {
        var size = 0
        for (var key in this._) ++size
        return size
      }
      function d3_map_empty () {
        for (var key in this._) return false
        return true
      }
      d3.nest = function () {
        var nest = {}, keys = [], sortKeys = [], sortValues, rollup
        function map (mapType, array, depth) {
          if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array
          var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new d3_Map(), values
          while (++i < n) {
            if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
              values.push(object)
            } else {
              valuesByKey.set(keyValue, [ object ])
            }
          }
          if (mapType) {
            object = mapType()
            setter = function (keyValue, values) {
              object.set(keyValue, map(mapType, values, depth))
            }
          } else {
            object = {}
            setter = function (keyValue, values) {
              object[keyValue] = map(mapType, values, depth)
            }
          }
          valuesByKey.forEach(setter)
          return object
        }
        function entries (map, depth) {
          if (depth >= keys.length) return map
          var array = [], sortKey = sortKeys[depth++]
          map.forEach(function (key, keyMap) {
            array.push({
              key: key,
              values: entries(keyMap, depth)
            })
          })
          return sortKey ? array.sort(function (a, b) {
            return sortKey(a.key, b.key)
          }) : array
        }
        nest.map = function (array, mapType) {
          return map(mapType, array, 0)
        }
        nest.entries = function (array) {
          return entries(map(d3.map, array, 0), 0)
        }
        nest.key = function (d) {
          keys.push(d)
          return nest
        }
        nest.sortKeys = function (order) {
          sortKeys[keys.length - 1] = order
          return nest
        }
        nest.sortValues = function (order) {
          sortValues = order
          return nest
        }
        nest.rollup = function (f) {
          rollup = f
          return nest
        }
        return nest
      }
      d3.set = function (array) {
        var set = new d3_Set()
        if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i])
        return set
      }
      function d3_Set () {
        this._ = Object.create(null)
      }
      d3_class(d3_Set, {
        has: d3_map_has,
        add: function (key) {
          this._[d3_map_escape(key += '')] = true
          return key
        },
        remove: d3_map_remove,
        values: d3_map_keys,
        size: d3_map_size,
        empty: d3_map_empty,
        forEach: function (f) {
          for (var key in this._) f.call(this, d3_map_unescape(key))
        }
      })
      d3.behavior = {}
      function d3_identity (d) {
        return d
      }
      d3.rebind = function (target, source) {
        var i = 1, n = arguments.length, method
        while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method])
        return target
      }
      function d3_rebind (target, source, method) {
        return function () {
          var value = method.apply(source, arguments)
          return value === source ? target : value
        }
      }
      function d3_vendorSymbol (object, name) {
        if (name in object) return name
        name = name.charAt(0).toUpperCase() + name.slice(1)
        for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
          var prefixName = d3_vendorPrefixes[i] + name
          if (prefixName in object) return prefixName
        }
      }
      var d3_vendorPrefixes = [ 'webkit', 'ms', 'moz', 'Moz', 'o', 'O' ]
      function d3_noop () {}
      d3.dispatch = function () {
        var dispatch = new d3_dispatch(), i = -1, n = arguments.length
        while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch)
        return dispatch
      }
      function d3_dispatch () {}
      d3_dispatch.prototype.on = function (type, listener) {
        var i = type.indexOf('.'), name = ''
        if (i >= 0) {
          name = type.slice(i + 1)
          type = type.slice(0, i)
        }
        if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener)
        if (arguments.length === 2) {
          if (listener == null) {
            for (type in this) {
              if (this.hasOwnProperty(type)) this[type].on(name, null)
            }
          }
          return this
        }
      }
      function d3_dispatch_event (dispatch) {
        var listeners = [], listenerByName = new d3_Map()
        function event () {
          var z = listeners, i = -1, n = z.length, l
          while (++i < n) if (l = z[i].on) l.apply(this, arguments)
          return dispatch
        }
        event.on = function (name, listener) {
          var l = listenerByName.get(name), i
          if (arguments.length < 2) return l && l.on
          if (l) {
            l.on = null
            listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1))
            listenerByName.remove(name)
          }
          if (listener) {
            listeners.push(listenerByName.set(name, {
              on: listener
            }))
          }
          return dispatch
        }
        return event
      }
      d3.event = null
      function d3_eventPreventDefault () {
        d3.event.preventDefault()
      }
      function d3_eventSource () {
        var e = d3.event, s
        while (s = e.sourceEvent) e = s
        return e
      }
      function d3_eventDispatch (target) {
        var dispatch = new d3_dispatch(), i = 0, n = arguments.length
        while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch)
        dispatch.of = function (thiz, argumentz) {
          return function (e1) {
            try {
              var e0 = e1.sourceEvent = d3.event
              e1.target = target
              d3.event = e1
              dispatch[e1.type].apply(thiz, argumentz)
            } finally {
              d3.event = e0
            }
          }
        }
        return dispatch
      }
      d3.requote = function (s) {
        return s.replace(d3_requote_re, '\\$&')
      }
      var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g
      var d3_subclass = {}.__proto__ ? function (object, prototype) {
        object.__proto__ = prototype
      } : function (object, prototype) {
        for (var property in prototype) object[property] = prototype[property]
      }
      function d3_selection (groups) {
        d3_subclass(groups, d3_selectionPrototype)
        return groups
      }
      var d3_select = function (s, n) {
          return n.querySelector(s)
        }, d3_selectAll = function (s, n) {
          return n.querySelectorAll(s)
        }, d3_selectMatches = function (n, s) {
          var d3_selectMatcher = n.matches || n[d3_vendorSymbol(n, 'matchesSelector')]
          d3_selectMatches = function (n, s) {
            return d3_selectMatcher.call(n, s)
          }
          return d3_selectMatches(n, s)
        }
      if (typeof Sizzle === 'function') {
        d3_select = function (s, n) {
          return Sizzle(s, n)[0] || null
        }
        d3_selectAll = Sizzle
        d3_selectMatches = Sizzle.matchesSelector
      }
      d3.selection = function () {
        return d3.select(d3_document.documentElement)
      }
      var d3_selectionPrototype = d3.selection.prototype = []
      d3_selectionPrototype.select = function (selector) {
        var subgroups = [], subgroup, subnode, group, node
        selector = d3_selection_selector(selector)
        for (var j = -1, m = this.length; ++j < m;) {
          subgroups.push(subgroup = [])
          subgroup.parentNode = (group = this[j]).parentNode
          for (var i = -1, n = group.length; ++i < n;) {
            if (node = group[i]) {
              subgroup.push(subnode = selector.call(node, node.__data__, i, j))
              if (subnode && '__data__' in node) subnode.__data__ = node.__data__
            } else {
              subgroup.push(null)
            }
          }
        }
        return d3_selection(subgroups)
      }
      function d3_selection_selector (selector) {
        return typeof selector === 'function' ? selector : function () {
          return d3_select(selector, this)
        }
      }
      d3_selectionPrototype.selectAll = function (selector) {
        var subgroups = [], subgroup, node
        selector = d3_selection_selectorAll(selector)
        for (var j = -1, m = this.length; ++j < m;) {
          for (var group = this[j], i = -1, n = group.length; ++i < n;) {
            if (node = group[i]) {
              subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)))
              subgroup.parentNode = node
            }
          }
        }
        return d3_selection(subgroups)
      }
      function d3_selection_selectorAll (selector) {
        return typeof selector === 'function' ? selector : function () {
          return d3_selectAll(selector, this)
        }
      }
      var d3_nsPrefix = {
        svg: 'http://www.w3.org/2000/svg',
        xhtml: 'http://www.w3.org/1999/xhtml',
        xlink: 'http://www.w3.org/1999/xlink',
        xml: 'http://www.w3.org/XML/1998/namespace',
        xmlns: 'http://www.w3.org/2000/xmlns/'
      }
      d3.ns = {
        prefix: d3_nsPrefix,
        qualify: function (name) {
          var i = name.indexOf(':'), prefix = name
          if (i >= 0) {
            prefix = name.slice(0, i)
            name = name.slice(i + 1)
          }
          return d3_nsPrefix.hasOwnProperty(prefix) ? {
            space: d3_nsPrefix[prefix],
            local: name
          } : name
        }
      }
      d3_selectionPrototype.attr = function (name, value) {
        if (arguments.length < 2) {
          if (typeof name === 'string') {
            var node = this.node()
            name = d3.ns.qualify(name)
            return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name)
          }
          for (value in name) this.each(d3_selection_attr(value, name[value]))
          return this
        }
        return this.each(d3_selection_attr(name, value))
      }
      function d3_selection_attr (name, value) {
        name = d3.ns.qualify(name)
        function attrNull () {
          this.removeAttribute(name)
        }
        function attrNullNS () {
          this.removeAttributeNS(name.space, name.local)
        }
        function attrConstant () {
          this.setAttribute(name, value)
        }
        function attrConstantNS () {
          this.setAttributeNS(name.space, name.local, value)
        }
        function attrFunction () {
          var x = value.apply(this, arguments)
          if (x == null) this.removeAttribute(name); else this.setAttribute(name, x)
        }
        function attrFunctionNS () {
          var x = value.apply(this, arguments)
          if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x)
        }
        return value == null ? name.local ? attrNullNS : attrNull : typeof value === 'function' ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant
      }
      function d3_collapse (s) {
        return s.trim().replace(/\s+/g, ' ')
      }
      d3_selectionPrototype.classed = function (name, value) {
        if (arguments.length < 2) {
          if (typeof name === 'string') {
            var node = this.node(), n = (name = d3_selection_classes(name)).length, i = -1
            if (value = node.classList) {
              while (++i < n) if (!value.contains(name[i])) return false
            } else {
              value = node.getAttribute('class')
              while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false
            }
            return true
          }
          for (value in name) this.each(d3_selection_classed(value, name[value]))
          return this
        }
        return this.each(d3_selection_classed(name, value))
      }
      function d3_selection_classedRe (name) {
        return new RegExp('(?:^|\\s+)' + d3.requote(name) + '(?:\\s+|$)', 'g')
      }
      function d3_selection_classes (name) {
        return (name + '').trim().split(/^|\s+/)
      }
      function d3_selection_classed (name, value) {
        name = d3_selection_classes(name).map(d3_selection_classedName)
        var n = name.length
        function classedConstant () {
          var i = -1
          while (++i < n) name[i](this, value)
        }
        function classedFunction () {
          var i = -1, x = value.apply(this, arguments)
          while (++i < n) name[i](this, x)
        }
        return typeof value === 'function' ? classedFunction : classedConstant
      }
      function d3_selection_classedName (name) {
        var re = d3_selection_classedRe(name)
        return function (node, value) {
          if (c = node.classList) return value ? c.add(name) : c.remove(name)
          var c = node.getAttribute('class') || ''
          if (value) {
            re.lastIndex = 0
            if (!re.test(c)) node.setAttribute('class', d3_collapse(c + ' ' + name))
          } else {
            node.setAttribute('class', d3_collapse(c.replace(re, ' ')))
          }
        }
      }
      d3_selectionPrototype.style = function (name, value, priority) {
        var n = arguments.length
        if (n < 3) {
          if (typeof name !== 'string') {
            if (n < 2) value = ''
            for (priority in name) this.each(d3_selection_style(priority, name[priority], value))
            return this
          }
          if (n < 2) {
            var node = this.node()
            return d3_window(node).getComputedStyle(node, null).getPropertyValue(name)
          }
          priority = ''
        }
        return this.each(d3_selection_style(name, value, priority))
      }
      function d3_selection_style (name, value, priority) {
        function styleNull () {
          this.style.removeProperty(name)
        }
        function styleConstant () {
          this.style.setProperty(name, value, priority)
        }
        function styleFunction () {
          var x = value.apply(this, arguments)
          if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority)
        }
        return value == null ? styleNull : typeof value === 'function' ? styleFunction : styleConstant
      }
      d3_selectionPrototype.property = function (name, value) {
        if (arguments.length < 2) {
          if (typeof name === 'string') return this.node()[name]
          for (value in name) this.each(d3_selection_property(value, name[value]))
          return this
        }
        return this.each(d3_selection_property(name, value))
      }
      function d3_selection_property (name, value) {
        function propertyNull () {
          delete this[name]
        }
        function propertyConstant () {
          this[name] = value
        }
        function propertyFunction () {
          var x = value.apply(this, arguments)
          if (x == null) delete this[name]; else this[name] = x
        }
        return value == null ? propertyNull : typeof value === 'function' ? propertyFunction : propertyConstant
      }
      d3_selectionPrototype.text = function (value) {
        return arguments.length ? this.each(typeof value === 'function' ? function () {
          var v = value.apply(this, arguments)
          this.textContent = v == null ? '' : v
        } : value == null ? function () {
          this.textContent = ''
        } : function () {
          this.textContent = value
        }) : this.node().textContent
      }
      d3_selectionPrototype.html = function (value) {
        return arguments.length ? this.each(typeof value === 'function' ? function () {
          var v = value.apply(this, arguments)
          this.innerHTML = v == null ? '' : v
        } : value == null ? function () {
          this.innerHTML = ''
        } : function () {
          this.innerHTML = value
        }) : this.node().innerHTML
      }
      d3_selectionPrototype.append = function (name) {
        name = d3_selection_creator(name)
        return this.select(function () {
          return this.appendChild(name.apply(this, arguments))
        })
      }
      function d3_selection_creator (name) {
        function create () {
          var document = this.ownerDocument, namespace = this.namespaceURI
          return namespace ? document.createElementNS(namespace, name) : document.createElement(name)
        }
        function createNS () {
          return this.ownerDocument.createElementNS(name.space, name.local)
        }
        return typeof name === 'function' ? name : (name = d3.ns.qualify(name)).local ? createNS : create
      }
      d3_selectionPrototype.insert = function (name, before) {
        name = d3_selection_creator(name)
        before = d3_selection_selector(before)
        return this.select(function () {
          return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null)
        })
      }
      d3_selectionPrototype.remove = function () {
        return this.each(d3_selectionRemove)
      }
      function d3_selectionRemove () {
        var parent = this.parentNode
        if (parent) parent.removeChild(this)
      }
      d3_selectionPrototype.data = function (value, key) {
        var i = -1, n = this.length, group, node
        if (!arguments.length) {
          value = new Array(n = (group = this[0]).length)
          while (++i < n) {
            if (node = group[i]) {
              value[i] = node.__data__
            }
          }
          return value
        }
        function bind (group, groupData) {
          var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData
          if (key) {
            var nodeByKeyValue = new d3_Map(), keyValues = new Array(n), keyValue
            for (i = -1; ++i < n;) {
              if (nodeByKeyValue.has(keyValue = key.call(node = group[i], node.__data__, i))) {
                exitNodes[i] = node
              } else {
                nodeByKeyValue.set(keyValue, node)
              }
              keyValues[i] = keyValue
            }
            for (i = -1; ++i < m;) {
              if (!(node = nodeByKeyValue.get(keyValue = key.call(groupData, nodeData = groupData[i], i)))) {
                enterNodes[i] = d3_selection_dataNode(nodeData)
              } else if (node !== true) {
                updateNodes[i] = node
                node.__data__ = nodeData
              }
              nodeByKeyValue.set(keyValue, true)
            }
            for (i = -1; ++i < n;) {
              if (nodeByKeyValue.get(keyValues[i]) !== true) {
                exitNodes[i] = group[i]
              }
            }
          } else {
            for (i = -1; ++i < n0;) {
              node = group[i]
              nodeData = groupData[i]
              if (node) {
                node.__data__ = nodeData
                updateNodes[i] = node
              } else {
                enterNodes[i] = d3_selection_dataNode(nodeData)
              }
            }
            for (;i < m; ++i) {
              enterNodes[i] = d3_selection_dataNode(groupData[i])
            }
            for (;i < n; ++i) {
              exitNodes[i] = group[i]
            }
          }
          enterNodes.update = updateNodes
          enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode
          enter.push(enterNodes)
          update.push(updateNodes)
          exit.push(exitNodes)
        }
        var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([])
        if (typeof value === 'function') {
          while (++i < n) {
            bind(group = this[i], value.call(group, group.parentNode.__data__, i))
          }
        } else {
          while (++i < n) {
            bind(group = this[i], value)
          }
        }
        update.enter = function () {
          return enter
        }
        update.exit = function () {
          return exit
        }
        return update
      }
      function d3_selection_dataNode (data) {
        return {
          __data__: data
        }
      }
      d3_selectionPrototype.datum = function (value) {
        return arguments.length ? this.property('__data__', value) : this.property('__data__')
      }
      d3_selectionPrototype.filter = function (filter) {
        var subgroups = [], subgroup, group, node
        if (typeof filter !== 'function') filter = d3_selection_filter(filter)
        for (var j = 0, m = this.length; j < m; j++) {
          subgroups.push(subgroup = [])
          subgroup.parentNode = (group = this[j]).parentNode
          for (var i = 0, n = group.length; i < n; i++) {
            if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
              subgroup.push(node)
            }
          }
        }
        return d3_selection(subgroups)
      }
      function d3_selection_filter (selector) {
        return function () {
          return d3_selectMatches(this, selector)
        }
      }
      d3_selectionPrototype.order = function () {
        for (var j = -1, m = this.length; ++j < m;) {
          for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
            if (node = group[i]) {
              if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next)
              next = node
            }
          }
        }
        return this
      }
      d3_selectionPrototype.sort = function (comparator) {
        comparator = d3_selection_sortComparator.apply(this, arguments)
        for (var j = -1, m = this.length; ++j < m;) this[j].sort(comparator)
        return this.order()
      }
      function d3_selection_sortComparator (comparator) {
        if (!arguments.length) comparator = d3_ascending
        return function (a, b) {
          return a && b ? comparator(a.__data__, b.__data__) : !a - !b
        }
      }
      d3_selectionPrototype.each = function (callback) {
        return d3_selection_each(this, function (node, i, j) {
          callback.call(node, node.__data__, i, j)
        })
      }
      function d3_selection_each (groups, callback) {
        for (var j = 0, m = groups.length; j < m; j++) {
          for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
            if (node = group[i]) callback(node, i, j)
          }
        }
        return groups
      }
      d3_selectionPrototype.call = function (callback) {
        var args = d3_array(arguments)
        callback.apply(args[0] = this, args)
        return this
      }
      d3_selectionPrototype.empty = function () {
        return !this.node()
      }
      d3_selectionPrototype.node = function () {
        for (var j = 0, m = this.length; j < m; j++) {
          for (var group = this[j], i = 0, n = group.length; i < n; i++) {
            var node = group[i]
            if (node) return node
          }
        }
        return null
      }
      d3_selectionPrototype.size = function () {
        var n = 0
        d3_selection_each(this, function () {
          ++n
        })
        return n
      }
      function d3_selection_enter (selection) {
        d3_subclass(selection, d3_selection_enterPrototype)
        return selection
      }
      var d3_selection_enterPrototype = []
      d3.selection.enter = d3_selection_enter
      d3.selection.enter.prototype = d3_selection_enterPrototype
      d3_selection_enterPrototype.append = d3_selectionPrototype.append
      d3_selection_enterPrototype.empty = d3_selectionPrototype.empty
      d3_selection_enterPrototype.node = d3_selectionPrototype.node
      d3_selection_enterPrototype.call = d3_selectionPrototype.call
      d3_selection_enterPrototype.size = d3_selectionPrototype.size
      d3_selection_enterPrototype.select = function (selector) {
        var subgroups = [], subgroup, subnode, upgroup, group, node
        for (var j = -1, m = this.length; ++j < m;) {
          upgroup = (group = this[j]).update
          subgroups.push(subgroup = [])
          subgroup.parentNode = group.parentNode
          for (var i = -1, n = group.length; ++i < n;) {
            if (node = group[i]) {
              subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j))
              subnode.__data__ = node.__data__
            } else {
              subgroup.push(null)
            }
          }
        }
        return d3_selection(subgroups)
      }
      d3_selection_enterPrototype.insert = function (name, before) {
        if (arguments.length < 2) before = d3_selection_enterInsertBefore(this)
        return d3_selectionPrototype.insert.call(this, name, before)
      }
      function d3_selection_enterInsertBefore (enter) {
        var i0, j0
        return function (d, i, j) {
          var group = enter[j].update, n = group.length, node
          if (j != j0) j0 = j, i0 = 0
          if (i >= i0) i0 = i + 1
          while (!(node = group[i0]) && ++i0 < n) ;
          return node
        }
      }
      d3.select = function (node) {
        var group
        if (typeof node === 'string') {
          group = [ d3_select(node, d3_document) ]
          group.parentNode = d3_document.documentElement
        } else {
          group = [ node ]
          group.parentNode = d3_documentElement(node)
        }
        return d3_selection([ group ])
      }
      d3.selectAll = function (nodes) {
        var group
        if (typeof nodes === 'string') {
          group = d3_array(d3_selectAll(nodes, d3_document))
          group.parentNode = d3_document.documentElement
        } else {
          group = nodes
          group.parentNode = null
        }
        return d3_selection([ group ])
      }
      d3_selectionPrototype.on = function (type, listener, capture) {
        var n = arguments.length
        if (n < 3) {
          if (typeof type !== 'string') {
            if (n < 2) listener = false
            for (capture in type) this.each(d3_selection_on(capture, type[capture], listener))
            return this
          }
          if (n < 2) return (n = this.node()['__on' + type]) && n._
          capture = false
        }
        return this.each(d3_selection_on(type, listener, capture))
      }
      function d3_selection_on (type, listener, capture) {
        var name = '__on' + type, i = type.indexOf('.'), wrap = d3_selection_onListener
        if (i > 0) type = type.slice(0, i)
        var filter = d3_selection_onFilters.get(type)
        if (filter) type = filter, wrap = d3_selection_onFilter
        function onRemove () {
          var l = this[name]
          if (l) {
            this.removeEventListener(type, l, l.$)
            delete this[name]
          }
        }
        function onAdd () {
          var l = wrap(listener, d3_array(arguments))
          onRemove.call(this)
          this.addEventListener(type, this[name] = l, l.$ = capture)
          l._ = listener
        }
        function removeAll () {
          var re = new RegExp('^__on([^.]+)' + d3.requote(type) + '$'), match
          for (var name in this) {
            if (match = name.match(re)) {
              var l = this[name]
              this.removeEventListener(match[1], l, l.$)
              delete this[name]
            }
          }
        }
        return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll
      }
      var d3_selection_onFilters = d3.map({
        mouseenter: 'mouseover',
        mouseleave: 'mouseout'
      })
      if (d3_document) {
        d3_selection_onFilters.forEach(function (k) {
          if ('on' + k in d3_document) d3_selection_onFilters.remove(k)
        })
      }
      function d3_selection_onListener (listener, argumentz) {
        return function (e) {
          var o = d3.event
          d3.event = e
          argumentz[0] = this.__data__
          try {
            listener.apply(this, argumentz)
          } finally {
            d3.event = o
          }
        }
      }
      function d3_selection_onFilter (listener, argumentz) {
        var l = d3_selection_onListener(listener, argumentz)
        return function (e) {
          var target = this, related = e.relatedTarget
          if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {
            l.call(target, e)
          }
        }
      }
      var d3_event_dragSelect, d3_event_dragId = 0
      function d3_event_dragSuppress (node) {
        var name = '.dragsuppress-' + ++d3_event_dragId, click = 'click' + name, w = d3.select(d3_window(node)).on('touchmove' + name, d3_eventPreventDefault).on('dragstart' + name, d3_eventPreventDefault).on('selectstart' + name, d3_eventPreventDefault)
        if (d3_event_dragSelect == null) {
          d3_event_dragSelect = 'onselectstart' in node ? false : d3_vendorSymbol(node.style, 'userSelect')
        }
        if (d3_event_dragSelect) {
          var style = d3_documentElement(node).style, select = style[d3_event_dragSelect]
          style[d3_event_dragSelect] = 'none'
        }
        return function (suppressClick) {
          w.on(name, null)
          if (d3_event_dragSelect) style[d3_event_dragSelect] = select
          if (suppressClick) {
            var off = function () {
              w.on(click, null)
            }
            w.on(click, function () {
              d3_eventPreventDefault()
              off()
            }, true)
            setTimeout(off, 0)
          }
        }
      }
      d3.mouse = function (container) {
        return d3_mousePoint(container, d3_eventSource())
      }
      var d3_mouse_bug44083 = this.navigator && /WebKit/.test(this.navigator.userAgent) ? -1 : 0
      function d3_mousePoint (container, e) {
        if (e.changedTouches) e = e.changedTouches[0]
        var svg = container.ownerSVGElement || container
        if (svg.createSVGPoint) {
          var point = svg.createSVGPoint()
          if (d3_mouse_bug44083 < 0) {
            var window = d3_window(container)
            if (window.scrollX || window.scrollY) {
              svg = d3.select('body').append('svg').style({
                position: 'absolute',
                top: 0,
                left: 0,
                margin: 0,
                padding: 0,
                border: 'none'
              }, 'important')
              var ctm = svg[0][0].getScreenCTM()
              d3_mouse_bug44083 = !(ctm.f || ctm.e)
              svg.remove()
            }
          }
          if (d3_mouse_bug44083) point.x = e.pageX, point.y = e.pageY; else {
            point.x = e.clientX,
      point.y = e.clientY
          }
          point = point.matrixTransform(container.getScreenCTM().inverse())
          return [ point.x, point.y ]
        }
        var rect = container.getBoundingClientRect()
        return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ]
      }
      d3.touch = function (container, touches, identifier) {
        if (arguments.length < 3) identifier = touches, touches = d3_eventSource().changedTouches
        if (touches) {
          for (var i = 0, n = touches.length, touch; i < n; ++i) {
            if ((touch = touches[i]).identifier === identifier) {
              return d3_mousePoint(container, touch)
            }
          }
        }
      }
      d3.behavior.drag = function () {
        var event = d3_eventDispatch(drag, 'drag', 'dragstart', 'dragend'), origin = null, mousedown = dragstart(d3_noop, d3.mouse, d3_window, 'mousemove', 'mouseup'), touchstart = dragstart(d3_behavior_dragTouchId, d3.touch, d3_identity, 'touchmove', 'touchend')
        function drag () {
          this.on('mousedown.drag', mousedown).on('touchstart.drag', touchstart)
        }
        function dragstart (id, position, subject, move, end) {
          return function () {
            var that = this, target = d3.event.target, parent = that.parentNode, dispatch = event.of(that, arguments), dragged = 0, dragId = id(), dragName = '.drag' + (dragId == null ? '' : '-' + dragId), dragOffset, dragSubject = d3.select(subject(target)).on(move + dragName, moved).on(end + dragName, ended), dragRestore = d3_event_dragSuppress(target), position0 = position(parent, dragId)
            if (origin) {
              dragOffset = origin.apply(that, arguments)
              dragOffset = [ dragOffset.x - position0[0], dragOffset.y - position0[1] ]
            } else {
              dragOffset = [ 0, 0 ]
            }
            dispatch({
              type: 'dragstart'
            })
            function moved () {
              var position1 = position(parent, dragId), dx, dy
              if (!position1) return
              dx = position1[0] - position0[0]
              dy = position1[1] - position0[1]
              dragged |= dx | dy
              position0 = position1
              dispatch({
                type: 'drag',
                x: position1[0] + dragOffset[0],
                y: position1[1] + dragOffset[1],
                dx: dx,
                dy: dy
              })
            }
            function ended () {
              if (!position(parent, dragId)) return
              dragSubject.on(move + dragName, null).on(end + dragName, null)
              dragRestore(dragged && d3.event.target === target)
              dispatch({
                type: 'dragend'
              })
            }
          }
        }
        drag.origin = function (x) {
          if (!arguments.length) return origin
          origin = x
          return drag
        }
        return d3.rebind(drag, event, 'on')
      }
      function d3_behavior_dragTouchId () {
        return d3.event.changedTouches[0].identifier
      }
      d3.touches = function (container, touches) {
        if (arguments.length < 2) touches = d3_eventSource().touches
        return touches ? d3_array(touches).map(function (touch) {
          var point = d3_mousePoint(container, touch)
          point.identifier = touch.identifier
          return point
        }) : []
      }
      var ε = 1e-6, ε2 = ε * ε, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2, d3_radians = π / 180, d3_degrees = 180 / π
      function d3_sgn (x) {
        return x > 0 ? 1 : x < 0 ? -1 : 0
      }
      function d3_cross2d (a, b, c) {
        return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
      }
      function d3_acos (x) {
        return x > 1 ? 0 : x < -1 ? π : Math.acos(x)
      }
      function d3_asin (x) {
        return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x)
      }
      function d3_sinh (x) {
        return ((x = Math.exp(x)) - 1 / x) / 2
      }
      function d3_cosh (x) {
        return ((x = Math.exp(x)) + 1 / x) / 2
      }
      function d3_tanh (x) {
        return ((x = Math.exp(2 * x)) - 1) / (x + 1)
      }
      function d3_haversin (x) {
        return (x = Math.sin(x / 2)) * x
      }
      var ρ = Math.SQRT2, ρ2 = 2, ρ4 = 4
      d3.interpolateZoom = function (p0, p1) {
        var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2]
        var dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1), b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1), dr = r1 - r0, S = (dr || Math.log(w1 / w0)) / ρ
        function interpolate (t) {
          var s = t * S
          if (dr) {
            var coshr0 = d3_cosh(r0), u = w0 / (ρ2 * d1) * (coshr0 * d3_tanh(ρ * s + r0) - d3_sinh(r0))
            return [ ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / d3_cosh(ρ * s + r0) ]
          }
          return [ ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(ρ * s) ]
        }
        interpolate.duration = S * 1e3
        return interpolate
      }
      d3.behavior.zoom = function () {
        var view = {
            x: 0,
            y: 0,
            k: 1
          }, translate0, center0, center, size = [ 960, 500 ], scaleExtent = d3_behavior_zoomInfinity, duration = 250, zooming = 0, mousedown = 'mousedown.zoom', mousemove = 'mousemove.zoom', mouseup = 'mouseup.zoom', mousewheelTimer, touchstart = 'touchstart.zoom', touchtime, event = d3_eventDispatch(zoom, 'zoomstart', 'zoom', 'zoomend'), x0, x1, y0, y1
        if (!d3_behavior_zoomWheel) {
          d3_behavior_zoomWheel = 'onwheel' in d3_document ? (d3_behavior_zoomDelta = function () {
            return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1)
          }, 'wheel') : 'onmousewheel' in d3_document ? (d3_behavior_zoomDelta = function () {
            return d3.event.wheelDelta
          }, 'mousewheel') : (d3_behavior_zoomDelta = function () {
            return -d3.event.detail
          }, 'MozMousePixelScroll')
        }
        function zoom (g) {
          g.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + '.zoom', mousewheeled).on('dblclick.zoom', dblclicked).on(touchstart, touchstarted)
        }
        zoom.event = function (g) {
          g.each(function () {
            var dispatch = event.of(this, arguments), view1 = view
            if (d3_transitionInheritId) {
              d3.select(this).transition().each('start.zoom', function () {
                view = this.__chart__ || {
                  x: 0,
                  y: 0,
                  k: 1
                }
                zoomstarted(dispatch)
              }).tween('zoom:zoom', function () {
                var dx = size[0], dy = size[1], cx = center0 ? center0[0] : dx / 2, cy = center0 ? center0[1] : dy / 2, i = d3.interpolateZoom([ (cx - view.x) / view.k, (cy - view.y) / view.k, dx / view.k ], [ (cx - view1.x) / view1.k, (cy - view1.y) / view1.k, dx / view1.k ])
                return function (t) {
                  var l = i(t), k = dx / l[2]
                  this.__chart__ = view = {
                    x: cx - l[0] * k,
                    y: cy - l[1] * k,
                    k: k
                  }
                  zoomed(dispatch)
                }
              }).each('interrupt.zoom', function () {
                zoomended(dispatch)
              }).each('end.zoom', function () {
                zoomended(dispatch)
              })
            } else {
              this.__chart__ = view
              zoomstarted(dispatch)
              zoomed(dispatch)
              zoomended(dispatch)
            }
          })
        }
        zoom.translate = function (_) {
          if (!arguments.length) return [ view.x, view.y ]
          view = {
            x: +_[0],
            y: +_[1],
            k: view.k
          }
          rescale()
          return zoom
        }
        zoom.scale = function (_) {
          if (!arguments.length) return view.k
          view = {
            x: view.x,
            y: view.y,
            k: +_
          }
          rescale()
          return zoom
        }
        zoom.scaleExtent = function (_) {
          if (!arguments.length) return scaleExtent
          scaleExtent = _ == null ? d3_behavior_zoomInfinity : [ +_[0], +_[1] ]
          return zoom
        }
        zoom.center = function (_) {
          if (!arguments.length) return center
          center = _ && [ +_[0], +_[1] ]
          return zoom
        }
        zoom.size = function (_) {
          if (!arguments.length) return size
          size = _ && [ +_[0], +_[1] ]
          return zoom
        }
        zoom.duration = function (_) {
          if (!arguments.length) return duration
          duration = +_
          return zoom
        }
        zoom.x = function (z) {
          if (!arguments.length) return x1
          x1 = z
          x0 = z.copy()
          view = {
            x: 0,
            y: 0,
            k: 1
          }
          return zoom
        }
        zoom.y = function (z) {
          if (!arguments.length) return y1
          y1 = z
          y0 = z.copy()
          view = {
            x: 0,
            y: 0,
            k: 1
          }
          return zoom
        }
        function location (p) {
          return [ (p[0] - view.x) / view.k, (p[1] - view.y) / view.k ]
        }
        function point (l) {
          return [ l[0] * view.k + view.x, l[1] * view.k + view.y ]
        }
        function scaleTo (s) {
          view.k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s))
        }
        function translateTo (p, l) {
          l = point(l)
          view.x += p[0] - l[0]
          view.y += p[1] - l[1]
        }
        function zoomTo (that, p, l, k) {
          that.__chart__ = {
            x: view.x,
            y: view.y,
            k: view.k
          }
          scaleTo(Math.pow(2, k))
          translateTo(center0 = p, l)
          that = d3.select(that)
          if (duration > 0) that = that.transition().duration(duration)
          that.call(zoom.event)
        }
        function rescale () {
          if (x1) {
            x1.domain(x0.range().map(function (x) {
              return (x - view.x) / view.k
            }).map(x0.invert))
          }
          if (y1) {
            y1.domain(y0.range().map(function (y) {
              return (y - view.y) / view.k
            }).map(y0.invert))
          }
        }
        function zoomstarted (dispatch) {
          if (!zooming++) {
            dispatch({
              type: 'zoomstart'
            })
          }
        }
        function zoomed (dispatch) {
          rescale()
          dispatch({
            type: 'zoom',
            scale: view.k,
            translate: [ view.x, view.y ]
          })
        }
        function zoomended (dispatch) {
          if (!--zooming) {
            dispatch({
              type: 'zoomend'
            }), center0 = null
          }
        }
        function mousedowned () {
          var that = this, target = d3.event.target, dispatch = event.of(that, arguments), dragged = 0, subject = d3.select(d3_window(that)).on(mousemove, moved).on(mouseup, ended), location0 = location(d3.mouse(that)), dragRestore = d3_event_dragSuppress(that)
          d3_selection_interrupt.call(that)
          zoomstarted(dispatch)
          function moved () {
            dragged = 1
            translateTo(d3.mouse(that), location0)
            zoomed(dispatch)
          }
          function ended () {
            subject.on(mousemove, null).on(mouseup, null)
            dragRestore(dragged && d3.event.target === target)
            zoomended(dispatch)
          }
        }
        function touchstarted () {
          var that = this, dispatch = event.of(that, arguments), locations0 = {}, distance0 = 0, scale0, zoomName = '.zoom-' + d3.event.changedTouches[0].identifier, touchmove = 'touchmove' + zoomName, touchend = 'touchend' + zoomName, targets = [], subject = d3.select(that), dragRestore = d3_event_dragSuppress(that)
          started()
          zoomstarted(dispatch)
          subject.on(mousedown, null).on(touchstart, started)
          function relocate () {
            var touches = d3.touches(that)
            scale0 = view.k
            touches.forEach(function (t) {
              if (t.identifier in locations0) locations0[t.identifier] = location(t)
            })
            return touches
          }
          function started () {
            var target = d3.event.target
            d3.select(target).on(touchmove, moved).on(touchend, ended)
            targets.push(target)
            var changed = d3.event.changedTouches
            for (var i = 0, n = changed.length; i < n; ++i) {
              locations0[changed[i].identifier] = null
            }
            var touches = relocate(), now = Date.now()
            if (touches.length === 1) {
              if (now - touchtime < 500) {
                var p = touches[0]
                zoomTo(that, p, locations0[p.identifier], Math.floor(Math.log(view.k) / Math.LN2) + 1)
                d3_eventPreventDefault()
              }
              touchtime = now
            } else if (touches.length > 1) {
              var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1]
              distance0 = dx * dx + dy * dy
            }
          }
          function moved () {
            var touches = d3.touches(that), p0, l0, p1, l1
            d3_selection_interrupt.call(that)
            for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {
              p1 = touches[i]
              if (l1 = locations0[p1.identifier]) {
                if (l0) break
                p0 = p1, l0 = l1
              }
            }
            if (l1) {
              var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1, scale1 = distance0 && Math.sqrt(distance1 / distance0)
              p0 = [ (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 ]
              l0 = [ (l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2 ]
              scaleTo(scale1 * scale0)
            }
            touchtime = null
            translateTo(p0, l0)
            zoomed(dispatch)
          }
          function ended () {
            if (d3.event.touches.length) {
              var changed = d3.event.changedTouches
              for (var i = 0, n = changed.length; i < n; ++i) {
                delete locations0[changed[i].identifier]
              }
              for (var identifier in locations0) {
                return void relocate()
              }
            }
            d3.selectAll(targets).on(zoomName, null)
            subject.on(mousedown, mousedowned).on(touchstart, touchstarted)
            dragRestore()
            zoomended(dispatch)
          }
        }
        function mousewheeled () {
          var dispatch = event.of(this, arguments)
          if (mousewheelTimer) clearTimeout(mousewheelTimer); else {
            d3_selection_interrupt.call(this),
      translate0 = location(center0 = center || d3.mouse(this)), zoomstarted(dispatch)
          }
          mousewheelTimer = setTimeout(function () {
            mousewheelTimer = null
            zoomended(dispatch)
          }, 50)
          d3_eventPreventDefault()
          scaleTo(Math.pow(2, d3_behavior_zoomDelta() * 0.002) * view.k)
          translateTo(center0, translate0)
          zoomed(dispatch)
        }
        function dblclicked () {
          var p = d3.mouse(this), k = Math.log(view.k) / Math.LN2
          zoomTo(this, p, location(p), d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1)
        }
        return d3.rebind(zoom, event, 'on')
      }
      var d3_behavior_zoomInfinity = [ 0, Infinity ], d3_behavior_zoomDelta, d3_behavior_zoomWheel
      d3.color = d3_color
      function d3_color () {}
      d3_color.prototype.toString = function () {
        return this.rgb() + ''
      }
      d3.hsl = d3_hsl
      function d3_hsl (h, s, l) {
        return this instanceof d3_hsl ? void (this.h = +h, this.s = +s, this.l = +l) : arguments.length < 2 ? h instanceof d3_hsl ? new d3_hsl(h.h, h.s, h.l) : d3_rgb_parse('' + h, d3_rgb_hsl, d3_hsl) : new d3_hsl(h, s, l)
      }
      var d3_hslPrototype = d3_hsl.prototype = new d3_color()
      d3_hslPrototype.brighter = function (k) {
        k = Math.pow(0.7, arguments.length ? k : 1)
        return new d3_hsl(this.h, this.s, this.l / k)
      }
      d3_hslPrototype.darker = function (k) {
        k = Math.pow(0.7, arguments.length ? k : 1)
        return new d3_hsl(this.h, this.s, k * this.l)
      }
      d3_hslPrototype.rgb = function () {
        return d3_hsl_rgb(this.h, this.s, this.l)
      }
      function d3_hsl_rgb (h, s, l) {
        var m1, m2
        h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h
        s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s
        l = l < 0 ? 0 : l > 1 ? 1 : l
        m2 = l <= 0.5 ? l * (1 + s) : l + s - l * s
        m1 = 2 * l - m2
        function v (h) {
          if (h > 360) h -= 360; else if (h < 0) h += 360
          if (h < 60) return m1 + (m2 - m1) * h / 60
          if (h < 180) return m2
          if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60
          return m1
        }
        function vv (h) {
          return Math.round(v(h) * 255)
        }
        return new d3_rgb(vv(h + 120), vv(h), vv(h - 120))
      }
      d3.hcl = d3_hcl
      function d3_hcl (h, c, l) {
        return this instanceof d3_hcl ? void (this.h = +h, this.c = +c, this.l = +l) : arguments.length < 2 ? h instanceof d3_hcl ? new d3_hcl(h.h, h.c, h.l) : h instanceof d3_lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : new d3_hcl(h, c, l)
      }
      var d3_hclPrototype = d3_hcl.prototype = new d3_color()
      d3_hclPrototype.brighter = function (k) {
        return new d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)))
      }
      d3_hclPrototype.darker = function (k) {
        return new d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)))
      }
      d3_hclPrototype.rgb = function () {
        return d3_hcl_lab(this.h, this.c, this.l).rgb()
      }
      function d3_hcl_lab (h, c, l) {
        if (isNaN(h)) h = 0
        if (isNaN(c)) c = 0
        return new d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c)
      }
      d3.lab = d3_lab
      function d3_lab (l, a, b) {
        return this instanceof d3_lab ? void (this.l = +l, this.a = +a, this.b = +b) : arguments.length < 2 ? l instanceof d3_lab ? new d3_lab(l.l, l.a, l.b) : l instanceof d3_hcl ? d3_hcl_lab(l.h, l.c, l.l) : d3_rgb_lab((l = d3_rgb(l)).r, l.g, l.b) : new d3_lab(l, a, b)
      }
      var d3_lab_K = 18
      var d3_lab_X = 0.95047, d3_lab_Y = 1, d3_lab_Z = 1.08883
      var d3_labPrototype = d3_lab.prototype = new d3_color()
      d3_labPrototype.brighter = function (k) {
        return new d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b)
      }
      d3_labPrototype.darker = function (k) {
        return new d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b)
      }
      d3_labPrototype.rgb = function () {
        return d3_lab_rgb(this.l, this.a, this.b)
      }
      function d3_lab_rgb (l, a, b) {
        var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200
        x = d3_lab_xyz(x) * d3_lab_X
        y = d3_lab_xyz(y) * d3_lab_Y
        z = d3_lab_xyz(z) * d3_lab_Z
        return new d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z), d3_xyz_rgb(-0.969266 * x + 1.8760108 * y + 0.041556 * z), d3_xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z))
      }
      function d3_lab_hcl (l, a, b) {
        return l > 0 ? new d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : new d3_hcl(NaN, NaN, l)
      }
      function d3_lab_xyz (x) {
        return x > 0.206893034 ? x * x * x : (x - 4 / 29) / 7.787037
      }
      function d3_xyz_lab (x) {
        return x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29
      }
      function d3_xyz_rgb (r) {
        return Math.round(255 * (r <= 0.00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055))
      }
      d3.rgb = d3_rgb
      function d3_rgb (r, g, b) {
        return this instanceof d3_rgb ? void (this.r = ~~r, this.g = ~~g, this.b = ~~b) : arguments.length < 2 ? r instanceof d3_rgb ? new d3_rgb(r.r, r.g, r.b) : d3_rgb_parse('' + r, d3_rgb, d3_hsl_rgb) : new d3_rgb(r, g, b)
      }
      function d3_rgbNumber (value) {
        return new d3_rgb(value >> 16, value >> 8 & 255, value & 255)
      }
      function d3_rgbString (value) {
        return d3_rgbNumber(value) + ''
      }
      var d3_rgbPrototype = d3_rgb.prototype = new d3_color()
      d3_rgbPrototype.brighter = function (k) {
        k = Math.pow(0.7, arguments.length ? k : 1)
        var r = this.r, g = this.g, b = this.b, i = 30
        if (!r && !g && !b) return new d3_rgb(i, i, i)
        if (r && r < i) r = i
        if (g && g < i) g = i
        if (b && b < i) b = i
        return new d3_rgb(Math.min(255, r / k), Math.min(255, g / k), Math.min(255, b / k))
      }
      d3_rgbPrototype.darker = function (k) {
        k = Math.pow(0.7, arguments.length ? k : 1)
        return new d3_rgb(k * this.r, k * this.g, k * this.b)
      }
      d3_rgbPrototype.hsl = function () {
        return d3_rgb_hsl(this.r, this.g, this.b)
      }
      d3_rgbPrototype.toString = function () {
        return '#' + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b)
      }
      function d3_rgb_hex (v) {
        return v < 16 ? '0' + Math.max(0, v).toString(16) : Math.min(255, v).toString(16)
      }
      function d3_rgb_parse (format, rgb, hsl) {
        format = format.toLowerCase()
        var r = 0, g = 0, b = 0, m1, m2, color
        m1 = /([a-z]+)\((.*)\)/.exec(format)
        if (m1) {
          m2 = m1[2].split(',')
          switch (m1[1]) {
            case 'hsl':
              {
                return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100)
              }

            case 'rgb':
              {
                return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]))
              }
          }
        }
        if (color = d3_rgb_names.get(format)) {
          return rgb(color.r, color.g, color.b)
        }
        if (format != null && format.charAt(0) === '#' && !isNaN(color = parseInt(format.slice(1), 16))) {
          if (format.length === 4) {
            r = (color & 3840) >> 4
            r = r >> 4 | r
            g = color & 240
            g = g >> 4 | g
            b = color & 15
            b = b << 4 | b
          } else if (format.length === 7) {
            r = (color & 16711680) >> 16
            g = (color & 65280) >> 8
            b = color & 255
          }
        }
        return rgb(r, g, b)
      }
      function d3_rgb_hsl (r, g, b) {
        var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2
        if (d) {
          s = l < 0.5 ? d / (max + min) : d / (2 - max - min)
          if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4
          h *= 60
        } else {
          h = NaN
          s = l > 0 && l < 1 ? 0 : h
        }
        return new d3_hsl(h, s, l)
      }
      function d3_rgb_lab (r, g, b) {
        r = d3_rgb_xyz(r)
        g = d3_rgb_xyz(g)
        b = d3_rgb_xyz(b)
        var x = d3_xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / d3_lab_X), y = d3_xyz_lab((0.2126729 * r + 0.7151522 * g + 0.072175 * b) / d3_lab_Y), z = d3_xyz_lab((0.0193339 * r + 0.119192 * g + 0.9503041 * b) / d3_lab_Z)
        return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z))
      }
      function d3_rgb_xyz (r) {
        return (r /= 255) <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
      }
      function d3_rgb_parseNumber (c) {
        var f = parseFloat(c)
        return c.charAt(c.length - 1) === '%' ? Math.round(f * 2.55) : f
      }
      var d3_rgb_names = d3.map({
        aliceblue: 15792383,
        antiquewhite: 16444375,
        aqua: 65535,
        aquamarine: 8388564,
        azure: 15794175,
        beige: 16119260,
        bisque: 16770244,
        black: 0,
        blanchedalmond: 16772045,
        blue: 255,
        blueviolet: 9055202,
        brown: 10824234,
        burlywood: 14596231,
        cadetblue: 6266528,
        chartreuse: 8388352,
        chocolate: 13789470,
        coral: 16744272,
        cornflowerblue: 6591981,
        cornsilk: 16775388,
        crimson: 14423100,
        cyan: 65535,
        darkblue: 139,
        darkcyan: 35723,
        darkgoldenrod: 12092939,
        darkgray: 11119017,
        darkgreen: 25600,
        darkgrey: 11119017,
        darkkhaki: 12433259,
        darkmagenta: 9109643,
        darkolivegreen: 5597999,
        darkorange: 16747520,
        darkorchid: 10040012,
        darkred: 9109504,
        darksalmon: 15308410,
        darkseagreen: 9419919,
        darkslateblue: 4734347,
        darkslategray: 3100495,
        darkslategrey: 3100495,
        darkturquoise: 52945,
        darkviolet: 9699539,
        deeppink: 16716947,
        deepskyblue: 49151,
        dimgray: 6908265,
        dimgrey: 6908265,
        dodgerblue: 2003199,
        firebrick: 11674146,
        floralwhite: 16775920,
        forestgreen: 2263842,
        fuchsia: 16711935,
        gainsboro: 14474460,
        ghostwhite: 16316671,
        gold: 16766720,
        goldenrod: 14329120,
        gray: 8421504,
        green: 32768,
        greenyellow: 11403055,
        grey: 8421504,
        honeydew: 15794160,
        hotpink: 16738740,
        indianred: 13458524,
        indigo: 4915330,
        ivory: 16777200,
        khaki: 15787660,
        lavender: 15132410,
        lavenderblush: 16773365,
        lawngreen: 8190976,
        lemonchiffon: 16775885,
        lightblue: 11393254,
        lightcoral: 15761536,
        lightcyan: 14745599,
        lightgoldenrodyellow: 16448210,
        lightgray: 13882323,
        lightgreen: 9498256,
        lightgrey: 13882323,
        lightpink: 16758465,
        lightsalmon: 16752762,
        lightseagreen: 2142890,
        lightskyblue: 8900346,
        lightslategray: 7833753,
        lightslategrey: 7833753,
        lightsteelblue: 11584734,
        lightyellow: 16777184,
        lime: 65280,
        limegreen: 3329330,
        linen: 16445670,
        magenta: 16711935,
        maroon: 8388608,
        mediumaquamarine: 6737322,
        mediumblue: 205,
        mediumorchid: 12211667,
        mediumpurple: 9662683,
        mediumseagreen: 3978097,
        mediumslateblue: 8087790,
        mediumspringgreen: 64154,
        mediumturquoise: 4772300,
        mediumvioletred: 13047173,
        midnightblue: 1644912,
        mintcream: 16121850,
        mistyrose: 16770273,
        moccasin: 16770229,
        navajowhite: 16768685,
        navy: 128,
        oldlace: 16643558,
        olive: 8421376,
        olivedrab: 7048739,
        orange: 16753920,
        orangered: 16729344,
        orchid: 14315734,
        palegoldenrod: 15657130,
        palegreen: 10025880,
        paleturquoise: 11529966,
        palevioletred: 14381203,
        papayawhip: 16773077,
        peachpuff: 16767673,
        peru: 13468991,
        pink: 16761035,
        plum: 14524637,
        powderblue: 11591910,
        purple: 8388736,
        rebeccapurple: 6697881,
        red: 16711680,
        rosybrown: 12357519,
        royalblue: 4286945,
        saddlebrown: 9127187,
        salmon: 16416882,
        sandybrown: 16032864,
        seagreen: 3050327,
        seashell: 16774638,
        sienna: 10506797,
        silver: 12632256,
        skyblue: 8900331,
        slateblue: 6970061,
        slategray: 7372944,
        slategrey: 7372944,
        snow: 16775930,
        springgreen: 65407,
        steelblue: 4620980,
        tan: 13808780,
        teal: 32896,
        thistle: 14204888,
        tomato: 16737095,
        turquoise: 4251856,
        violet: 15631086,
        wheat: 16113331,
        white: 16777215,
        whitesmoke: 16119285,
        yellow: 16776960,
        yellowgreen: 10145074
      })
      d3_rgb_names.forEach(function (key, value) {
        d3_rgb_names.set(key, d3_rgbNumber(value))
      })
      function d3_functor (v) {
        return typeof v === 'function' ? v : function () {
          return v
        }
      }
      d3.functor = d3_functor
      d3.xhr = d3_xhrType(d3_identity)
      function d3_xhrType (response) {
        return function (url, mimeType, callback) {
          if (arguments.length === 2 && typeof mimeType === 'function') {
            callback = mimeType,
      mimeType = null
          }
          return d3_xhr(url, mimeType, response, callback)
        }
      }
      function d3_xhr (url, mimeType, response, callback) {
        var xhr = {}, dispatch = d3.dispatch('beforesend', 'progress', 'load', 'error'), headers = {}, request = new XMLHttpRequest(), responseType = null
        if (this.XDomainRequest && !('withCredentials' in request) && /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest()
        'onload' in request ? request.onload = request.onerror = respond : request.onreadystatechange = function () {
          request.readyState > 3 && respond()
        }
        function respond () {
          var status = request.status, result
          if (!status && d3_xhrHasResponse(request) || status >= 200 && status < 300 || status === 304) {
            try {
              result = response.call(xhr, request)
            } catch (e) {
              dispatch.error.call(xhr, e)
              return
            }
            dispatch.load.call(xhr, result)
          } else {
            dispatch.error.call(xhr, request)
          }
        }
        request.onprogress = function (event) {
          var o = d3.event
          d3.event = event
          try {
            dispatch.progress.call(xhr, request)
          } finally {
            d3.event = o
          }
        }
        xhr.header = function (name, value) {
          name = (name + '').toLowerCase()
          if (arguments.length < 2) return headers[name]
          if (value == null) delete headers[name]; else headers[name] = value + ''
          return xhr
        }
        xhr.mimeType = function (value) {
          if (!arguments.length) return mimeType
          mimeType = value == null ? null : value + ''
          return xhr
        }
        xhr.responseType = function (value) {
          if (!arguments.length) return responseType
          responseType = value
          return xhr
        }
        xhr.response = function (value) {
          response = value
          return xhr
        };
        [ 'get', 'post' ].forEach(function (method) {
          xhr[method] = function () {
            return xhr.send.apply(xhr, [ method ].concat(d3_array(arguments)))
          }
        })
        xhr.send = function (method, data, callback) {
          if (arguments.length === 2 && typeof data === 'function') callback = data, data = null
          request.open(method, url, true)
          if (mimeType != null && !('accept' in headers)) headers['accept'] = mimeType + ',*/*'
          if (request.setRequestHeader) for (var name in headers) request.setRequestHeader(name, headers[name])
          if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType)
          if (responseType != null) request.responseType = responseType
          if (callback != null) {
            xhr.on('error', callback).on('load', function (request) {
              callback(null, request)
            })
          }
          dispatch.beforesend.call(xhr, request)
          request.send(data == null ? null : data)
          return xhr
        }
        xhr.abort = function () {
          request.abort()
          return xhr
        }
        d3.rebind(xhr, dispatch, 'on')
        return callback == null ? xhr : xhr.get(d3_xhr_fixCallback(callback))
      }
      function d3_xhr_fixCallback (callback) {
        return callback.length === 1 ? function (error, request) {
          callback(error == null ? request : null)
        } : callback
      }
      function d3_xhrHasResponse (request) {
        var type = request.responseType
        return type && type !== 'text' ? request.response : request.responseText
      }
      d3.dsv = function (delimiter, mimeType) {
        var reFormat = new RegExp('["' + delimiter + '\n]'), delimiterCode = delimiter.charCodeAt(0)
        function dsv (url, row, callback) {
          if (arguments.length < 3) callback = row, row = null
          var xhr = d3_xhr(url, mimeType, row == null ? response : typedResponse(row), callback)
          xhr.row = function (_) {
            return arguments.length ? xhr.response((row = _) == null ? response : typedResponse(_)) : row
          }
          return xhr
        }
        function response (request) {
          return dsv.parse(request.responseText)
        }
        function typedResponse (f) {
          return function (request) {
            return dsv.parse(request.responseText, f)
          }
        }
        dsv.parse = function (text, f) {
          var o
          return dsv.parseRows(text, function (row, i) {
            if (o) return o(row, i - 1)
            var a = new Function('d', 'return {' + row.map(function (name, i) {
              return JSON.stringify(name) + ': d[' + i + ']'
            }).join(',') + '}')
            o = f ? function (row, i) {
              return f(a(row), i)
            } : a
          })
        }
        dsv.parseRows = function (text, f) {
          var EOL = {}, EOF = {}, rows = [], N = text.length, I = 0, n = 0, t, eol
          function token () {
            if (I >= N) return EOF
            if (eol) return eol = false, EOL
            var j = I
            if (text.charCodeAt(j) === 34) {
              var i = j
              while (i++ < N) {
                if (text.charCodeAt(i) === 34) {
                  if (text.charCodeAt(i + 1) !== 34) break
                  ++i
                }
              }
              I = i + 2
              var c = text.charCodeAt(i + 1)
              if (c === 13) {
                eol = true
                if (text.charCodeAt(i + 2) === 10) ++I
              } else if (c === 10) {
                eol = true
              }
              return text.slice(j + 1, i).replace(/""/g, '"')
            }
            while (I < N) {
              var c = text.charCodeAt(I++), k = 1
              if (c === 10) eol = true; else if (c === 13) {
                eol = true
                if (text.charCodeAt(I) === 10) ++I, ++k
              } else if (c !== delimiterCode) continue
              return text.slice(j, I - k)
            }
            return text.slice(j)
          }
          while ((t = token()) !== EOF) {
            var a = []
            while (t !== EOL && t !== EOF) {
              a.push(t)
              t = token()
            }
            if (f && (a = f(a, n++)) == null) continue
            rows.push(a)
          }
          return rows
        }
        dsv.format = function (rows) {
          if (Array.isArray(rows[0])) return dsv.formatRows(rows)
          var fieldSet = new d3_Set(), fields = []
          rows.forEach(function (row) {
            for (var field in row) {
              if (!fieldSet.has(field)) {
                fields.push(fieldSet.add(field))
              }
            }
          })
          return [ fields.map(formatValue).join(delimiter) ].concat(rows.map(function (row) {
            return fields.map(function (field) {
              return formatValue(row[field])
            }).join(delimiter)
          })).join('\n')
        }
        dsv.formatRows = function (rows) {
          return rows.map(formatRow).join('\n')
        }
        function formatRow (row) {
          return row.map(formatValue).join(delimiter)
        }
        function formatValue (text) {
          return reFormat.test(text) ? '"' + text.replace(/\"/g, '""') + '"' : text
        }
        return dsv
      }
      d3.csv = d3.dsv(',', 'text/csv')
      d3.tsv = d3.dsv('	', 'text/tab-separated-values')
      var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_active, d3_timer_frame = this[d3_vendorSymbol(this, 'requestAnimationFrame')] || function (callback) {
          setTimeout(callback, 17)
        }
      d3.timer = function (callback, delay, then) {
        var n = arguments.length
        if (n < 2) delay = 0
        if (n < 3) then = Date.now()
        var time = then + delay, timer = {
            c: callback,
            t: time,
            f: false,
            n: null
          }
        if (d3_timer_queueTail) d3_timer_queueTail.n = timer; else d3_timer_queueHead = timer
        d3_timer_queueTail = timer
        if (!d3_timer_interval) {
          d3_timer_timeout = clearTimeout(d3_timer_timeout)
          d3_timer_interval = 1
          d3_timer_frame(d3_timer_step)
        }
      }
      function d3_timer_step () {
        var now = d3_timer_mark(), delay = d3_timer_sweep() - now
        if (delay > 24) {
          if (isFinite(delay)) {
            clearTimeout(d3_timer_timeout)
            d3_timer_timeout = setTimeout(d3_timer_step, delay)
          }
          d3_timer_interval = 0
        } else {
          d3_timer_interval = 1
          d3_timer_frame(d3_timer_step)
        }
      }
      d3.timer.flush = function () {
        d3_timer_mark()
        d3_timer_sweep()
      }
      function d3_timer_mark () {
        var now = Date.now()
        d3_timer_active = d3_timer_queueHead
        while (d3_timer_active) {
          if (now >= d3_timer_active.t) d3_timer_active.f = d3_timer_active.c(now - d3_timer_active.t)
          d3_timer_active = d3_timer_active.n
        }
        return now
      }
      function d3_timer_sweep () {
        var t0, t1 = d3_timer_queueHead, time = Infinity
        while (t1) {
          if (t1.f) {
            t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n
          } else {
            if (t1.t < time) time = t1.t
            t1 = (t0 = t1).n
          }
        }
        d3_timer_queueTail = t0
        return time
      }
      function d3_format_precision (x, p) {
        return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1)
      }
      d3.round = function (x, n) {
        return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x)
      }
      var d3_formatPrefixes = [ 'y', 'z', 'a', 'f', 'p', 'n', 'µ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y' ].map(d3_formatPrefix)
      d3.formatPrefix = function (value, precision) {
        var i = 0
        if (value) {
          if (value < 0) value *= -1
          if (precision) value = d3.round(value, d3_format_precision(value, precision))
          i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10)
          i = Math.max(-24, Math.min(24, Math.floor((i - 1) / 3) * 3))
        }
        return d3_formatPrefixes[8 + i / 3]
      }
      function d3_formatPrefix (d, i) {
        var k = Math.pow(10, abs(8 - i) * 3)
        return {
          scale: i > 8 ? function (d) {
            return d / k
          } : function (d) {
            return d * k
          },
          symbol: d
        }
      }
      function d3_locale_numberFormat (locale) {
        var locale_decimal = locale.decimal, locale_thousands = locale.thousands, locale_grouping = locale.grouping, locale_currency = locale.currency, formatGroup = locale_grouping && locale_thousands ? function (value, width) {
            var i = value.length, t = [], j = 0, g = locale_grouping[0], length = 0
            while (i > 0 && g > 0) {
              if (length + g + 1 > width) g = Math.max(1, width - length)
              t.push(value.substring(i -= g, i + g))
              if ((length += g + 1) > width) break
              g = locale_grouping[j = (j + 1) % locale_grouping.length]
            }
            return t.reverse().join(locale_thousands)
          } : d3_identity
        return function (specifier) {
          var match = d3_format_re.exec(specifier), fill = match[1] || ' ', align = match[2] || '>', sign = match[3] || '-', symbol = match[4] || '', zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, prefix = '', suffix = '', integer = false, exponent = true
          if (precision) precision = +precision.substring(1)
          if (zfill || fill === '0' && align === '=') {
            zfill = fill = '0'
            align = '='
          }
          switch (type) {
            case 'n':
              comma = true
              type = 'g'
              break

            case '%':
              scale = 100
              suffix = '%'
              type = 'f'
              break

            case 'p':
              scale = 100
              suffix = '%'
              type = 'r'
              break

            case 'b':
            case 'o':
            case 'x':
            case 'X':
              if (symbol === '#') prefix = '0' + type.toLowerCase()

            case 'c':
              exponent = false

            case 'd':
              integer = true
              precision = 0
              break

            case 's':
              scale = -1
              type = 'r'
              break
          }
          if (symbol === '$') prefix = locale_currency[0], suffix = locale_currency[1]
          if (type == 'r' && !precision) type = 'g'
          if (precision != null) {
            if (type == 'g') precision = Math.max(1, Math.min(21, precision)); else if (type == 'e' || type == 'f') precision = Math.max(0, Math.min(20, precision))
          }
          type = d3_format_types.get(type) || d3_format_typeDefault
          var zcomma = zfill && comma
          return function (value) {
            var fullSuffix = suffix
            if (integer && value % 1) return ''
            var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, '-') : sign === '-' ? '' : sign
            if (scale < 0) {
              var unit = d3.formatPrefix(value, precision)
              value = unit.scale(value)
              fullSuffix = unit.symbol + suffix
            } else {
              value *= scale
            }
            value = type(value, precision)
            var i = value.lastIndexOf('.'), before, after
            if (i < 0) {
              var j = exponent ? value.lastIndexOf('e') : -1
              if (j < 0) before = value, after = ''; else before = value.substring(0, j), after = value.substring(j)
            } else {
              before = value.substring(0, i)
              after = locale_decimal + value.substring(i + 1)
            }
            if (!zfill && comma) before = formatGroup(before, Infinity)
            var length = prefix.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = length < width ? new Array(length = width - length + 1).join(fill) : ''
            if (zcomma) before = formatGroup(padding + before, padding.length ? width - after.length : Infinity)
            negative += prefix
            value = before + after
            return (align === '<' ? negative + value + padding : align === '>' ? padding + negative + value : align === '^' ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + fullSuffix
          }
        }
      }
      var d3_format_re = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i
      var d3_format_types = d3.map({
        b: function (x) {
          return x.toString(2)
        },
        c: function (x) {
          return String.fromCharCode(x)
        },
        o: function (x) {
          return x.toString(8)
        },
        x: function (x) {
          return x.toString(16)
        },
        X: function (x) {
          return x.toString(16).toUpperCase()
        },
        g: function (x, p) {
          return x.toPrecision(p)
        },
        e: function (x, p) {
          return x.toExponential(p)
        },
        f: function (x, p) {
          return x.toFixed(p)
        },
        r: function (x, p) {
          return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p))))
        }
      })
      function d3_format_typeDefault (x) {
        return x + ''
      }
      var d3_time = d3.time = {}, d3_date = Date
      function d3_date_utc () {
        this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0])
      }
      d3_date_utc.prototype = {
        getDate: function () {
          return this._.getUTCDate()
        },
        getDay: function () {
          return this._.getUTCDay()
        },
        getFullYear: function () {
          return this._.getUTCFullYear()
        },
        getHours: function () {
          return this._.getUTCHours()
        },
        getMilliseconds: function () {
          return this._.getUTCMilliseconds()
        },
        getMinutes: function () {
          return this._.getUTCMinutes()
        },
        getMonth: function () {
          return this._.getUTCMonth()
        },
        getSeconds: function () {
          return this._.getUTCSeconds()
        },
        getTime: function () {
          return this._.getTime()
        },
        getTimezoneOffset: function () {
          return 0
        },
        valueOf: function () {
          return this._.valueOf()
        },
        setDate: function () {
          d3_time_prototype.setUTCDate.apply(this._, arguments)
        },
        setDay: function () {
          d3_time_prototype.setUTCDay.apply(this._, arguments)
        },
        setFullYear: function () {
          d3_time_prototype.setUTCFullYear.apply(this._, arguments)
        },
        setHours: function () {
          d3_time_prototype.setUTCHours.apply(this._, arguments)
        },
        setMilliseconds: function () {
          d3_time_prototype.setUTCMilliseconds.apply(this._, arguments)
        },
        setMinutes: function () {
          d3_time_prototype.setUTCMinutes.apply(this._, arguments)
        },
        setMonth: function () {
          d3_time_prototype.setUTCMonth.apply(this._, arguments)
        },
        setSeconds: function () {
          d3_time_prototype.setUTCSeconds.apply(this._, arguments)
        },
        setTime: function () {
          d3_time_prototype.setTime.apply(this._, arguments)
        }
      }
      var d3_time_prototype = Date.prototype
      function d3_time_interval (local, step, number) {
        function round (date) {
          var d0 = local(date), d1 = offset(d0, 1)
          return date - d0 < d1 - date ? d0 : d1
        }
        function ceil (date) {
          step(date = local(new d3_date(date - 1)), 1)
          return date
        }
        function offset (date, k) {
          step(date = new d3_date(+date), k)
          return date
        }
        function range (t0, t1, dt) {
          var time = ceil(t0), times = []
          if (dt > 1) {
            while (time < t1) {
              if (!(number(time) % dt)) times.push(new Date(+time))
              step(time, 1)
            }
          } else {
            while (time < t1) times.push(new Date(+time)), step(time, 1)
          }
          return times
        }
        function range_utc (t0, t1, dt) {
          try {
            d3_date = d3_date_utc
            var utc = new d3_date_utc()
            utc._ = t0
            return range(utc, t1, dt)
          } finally {
            d3_date = Date
          }
        }
        local.floor = local
        local.round = round
        local.ceil = ceil
        local.offset = offset
        local.range = range
        var utc = local.utc = d3_time_interval_utc(local)
        utc.floor = utc
        utc.round = d3_time_interval_utc(round)
        utc.ceil = d3_time_interval_utc(ceil)
        utc.offset = d3_time_interval_utc(offset)
        utc.range = range_utc
        return local
      }
      function d3_time_interval_utc (method) {
        return function (date, k) {
          try {
            d3_date = d3_date_utc
            var utc = new d3_date_utc()
            utc._ = date
            return method(utc, k)._
          } finally {
            d3_date = Date
          }
        }
      }
      d3_time.year = d3_time_interval(function (date) {
        date = d3_time.day(date)
        date.setMonth(0, 1)
        return date
      }, function (date, offset) {
        date.setFullYear(date.getFullYear() + offset)
      }, function (date) {
        return date.getFullYear()
      })
      d3_time.years = d3_time.year.range
      d3_time.years.utc = d3_time.year.utc.range
      d3_time.day = d3_time_interval(function (date) {
        var day = new d3_date(2e3, 0)
        day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
        return day
      }, function (date, offset) {
        date.setDate(date.getDate() + offset)
      }, function (date) {
        return date.getDate() - 1
      })
      d3_time.days = d3_time.day.range
      d3_time.days.utc = d3_time.day.utc.range
      d3_time.dayOfYear = function (date) {
        var year = d3_time.year(date)
        return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5)
      };
      [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ].forEach(function (day, i) {
        i = 7 - i
        var interval = d3_time[day] = d3_time_interval(function (date) {
          (date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7)
          return date
        }, function (date, offset) {
          date.setDate(date.getDate() + Math.floor(offset) * 7)
        }, function (date) {
          var day = d3_time.year(date).getDay()
          return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i)
        })
        d3_time[day + 's'] = interval.range
        d3_time[day + 's'].utc = interval.utc.range
        d3_time[day + 'OfYear'] = function (date) {
          var day = d3_time.year(date).getDay()
          return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7)
        }
      })
      d3_time.week = d3_time.sunday
      d3_time.weeks = d3_time.sunday.range
      d3_time.weeks.utc = d3_time.sunday.utc.range
      d3_time.weekOfYear = d3_time.sundayOfYear
      function d3_locale_timeFormat (locale) {
        var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_days = locale.days, locale_shortDays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths
        function d3_time_format (template) {
          var n = template.length
          function format (date) {
            var string = [], i = -1, j = 0, c, p, f
            while (++i < n) {
              if (template.charCodeAt(i) === 37) {
                string.push(template.slice(j, i))
                if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i)
                if (f = d3_time_formats[c]) c = f(date, p == null ? c === 'e' ? ' ' : '0' : p)
                string.push(c)
                j = i + 1
              }
            }
            string.push(template.slice(j, i))
            return string.join('')
          }
          format.parse = function (string) {
            var d = {
                y: 1900,
                m: 0,
                d: 1,
                H: 0,
                M: 0,
                S: 0,
                L: 0,
                Z: null
              }, i = d3_time_parse(d, template, string, 0)
            if (i != string.length) return null
            if ('p' in d) d.H = d.H % 12 + d.p * 12
            var localZ = d.Z != null && d3_date !== d3_date_utc, date = new (localZ ? d3_date_utc : d3_date)()
            if ('j' in d) date.setFullYear(d.y, 0, d.j); else if ('w' in d && ('W' in d || 'U' in d)) {
              date.setFullYear(d.y, 0, 1)
              date.setFullYear(d.y, 0, 'W' in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7)
            } else date.setFullYear(d.y, d.m, d.d)
            date.setHours(d.H + (d.Z / 100 | 0), d.M + d.Z % 100, d.S, d.L)
            return localZ ? date._ : date
          }
          format.toString = function () {
            return template
          }
          return format
        }
        function d3_time_parse (date, template, string, j) {
          var c, p, t, i = 0, n = template.length, m = string.length
          while (i < n) {
            if (j >= m) return -1
            c = template.charCodeAt(i++)
            if (c === 37) {
              t = template.charAt(i++)
              p = d3_time_parsers[t in d3_time_formatPads ? template.charAt(i++) : t]
              if (!p || (j = p(date, string, j)) < 0) return -1
            } else if (c != string.charCodeAt(j++)) {
              return -1
            }
          }
          return j
        }
        d3_time_format.utc = function (template) {
          var local = d3_time_format(template)
          function format (date) {
            try {
              d3_date = d3_date_utc
              var utc = new d3_date()
              utc._ = date
              return local(utc)
            } finally {
              d3_date = Date
            }
          }
          format.parse = function (string) {
            try {
              d3_date = d3_date_utc
              var date = local.parse(string)
              return date && date._
            } finally {
              d3_date = Date
            }
          }
          format.toString = local.toString
          return format
        }
        d3_time_format.multi = d3_time_format.utc.multi = d3_time_formatMulti
        var d3_time_periodLookup = d3.map(), d3_time_dayRe = d3_time_formatRe(locale_days), d3_time_dayLookup = d3_time_formatLookup(locale_days), d3_time_dayAbbrevRe = d3_time_formatRe(locale_shortDays), d3_time_dayAbbrevLookup = d3_time_formatLookup(locale_shortDays), d3_time_monthRe = d3_time_formatRe(locale_months), d3_time_monthLookup = d3_time_formatLookup(locale_months), d3_time_monthAbbrevRe = d3_time_formatRe(locale_shortMonths), d3_time_monthAbbrevLookup = d3_time_formatLookup(locale_shortMonths)
        locale_periods.forEach(function (p, i) {
          d3_time_periodLookup.set(p.toLowerCase(), i)
        })
        var d3_time_formats = {
          a: function (d) {
            return locale_shortDays[d.getDay()]
          },
          A: function (d) {
            return locale_days[d.getDay()]
          },
          b: function (d) {
            return locale_shortMonths[d.getMonth()]
          },
          B: function (d) {
            return locale_months[d.getMonth()]
          },
          c: d3_time_format(locale_dateTime),
          d: function (d, p) {
            return d3_time_formatPad(d.getDate(), p, 2)
          },
          e: function (d, p) {
            return d3_time_formatPad(d.getDate(), p, 2)
          },
          H: function (d, p) {
            return d3_time_formatPad(d.getHours(), p, 2)
          },
          I: function (d, p) {
            return d3_time_formatPad(d.getHours() % 12 || 12, p, 2)
          },
          j: function (d, p) {
            return d3_time_formatPad(1 + d3_time.dayOfYear(d), p, 3)
          },
          L: function (d, p) {
            return d3_time_formatPad(d.getMilliseconds(), p, 3)
          },
          m: function (d, p) {
            return d3_time_formatPad(d.getMonth() + 1, p, 2)
          },
          M: function (d, p) {
            return d3_time_formatPad(d.getMinutes(), p, 2)
          },
          p: function (d) {
            return locale_periods[+(d.getHours() >= 12)]
          },
          S: function (d, p) {
            return d3_time_formatPad(d.getSeconds(), p, 2)
          },
          U: function (d, p) {
            return d3_time_formatPad(d3_time.sundayOfYear(d), p, 2)
          },
          w: function (d) {
            return d.getDay()
          },
          W: function (d, p) {
            return d3_time_formatPad(d3_time.mondayOfYear(d), p, 2)
          },
          x: d3_time_format(locale_date),
          X: d3_time_format(locale_time),
          y: function (d, p) {
            return d3_time_formatPad(d.getFullYear() % 100, p, 2)
          },
          Y: function (d, p) {
            return d3_time_formatPad(d.getFullYear() % 1e4, p, 4)
          },
          Z: d3_time_zone,
          '%': function () {
            return '%'
          }
        }
        var d3_time_parsers = {
          a: d3_time_parseWeekdayAbbrev,
          A: d3_time_parseWeekday,
          b: d3_time_parseMonthAbbrev,
          B: d3_time_parseMonth,
          c: d3_time_parseLocaleFull,
          d: d3_time_parseDay,
          e: d3_time_parseDay,
          H: d3_time_parseHour24,
          I: d3_time_parseHour24,
          j: d3_time_parseDayOfYear,
          L: d3_time_parseMilliseconds,
          m: d3_time_parseMonthNumber,
          M: d3_time_parseMinutes,
          p: d3_time_parseAmPm,
          S: d3_time_parseSeconds,
          U: d3_time_parseWeekNumberSunday,
          w: d3_time_parseWeekdayNumber,
          W: d3_time_parseWeekNumberMonday,
          x: d3_time_parseLocaleDate,
          X: d3_time_parseLocaleTime,
          y: d3_time_parseYear,
          Y: d3_time_parseFullYear,
          Z: d3_time_parseZone,
          '%': d3_time_parseLiteralPercent
        }
        function d3_time_parseWeekdayAbbrev (date, string, i) {
          d3_time_dayAbbrevRe.lastIndex = 0
          var n = d3_time_dayAbbrevRe.exec(string.slice(i))
          return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1
        }
        function d3_time_parseWeekday (date, string, i) {
          d3_time_dayRe.lastIndex = 0
          var n = d3_time_dayRe.exec(string.slice(i))
          return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1
        }
        function d3_time_parseMonthAbbrev (date, string, i) {
          d3_time_monthAbbrevRe.lastIndex = 0
          var n = d3_time_monthAbbrevRe.exec(string.slice(i))
          return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1
        }
        function d3_time_parseMonth (date, string, i) {
          d3_time_monthRe.lastIndex = 0
          var n = d3_time_monthRe.exec(string.slice(i))
          return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1
        }
        function d3_time_parseLocaleFull (date, string, i) {
          return d3_time_parse(date, d3_time_formats.c.toString(), string, i)
        }
        function d3_time_parseLocaleDate (date, string, i) {
          return d3_time_parse(date, d3_time_formats.x.toString(), string, i)
        }
        function d3_time_parseLocaleTime (date, string, i) {
          return d3_time_parse(date, d3_time_formats.X.toString(), string, i)
        }
        function d3_time_parseAmPm (date, string, i) {
          var n = d3_time_periodLookup.get(string.slice(i, i += 2).toLowerCase())
          return n == null ? -1 : (date.p = n, i)
        }
        return d3_time_format
      }
      var d3_time_formatPads = {
          '-': '',
          _: ' ',
          '0': '0'
        }, d3_time_numberRe = /^\s*\d+/, d3_time_percentRe = /^%/
      function d3_time_formatPad (value, fill, width) {
        var sign = value < 0 ? '-' : '', string = (sign ? -value : value) + '', length = string.length
        return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string)
      }
      function d3_time_formatRe (names) {
        return new RegExp('^(?:' + names.map(d3.requote).join('|') + ')', 'i')
      }
      function d3_time_formatLookup (names) {
        var map = new d3_Map(), i = -1, n = names.length
        while (++i < n) map.set(names[i].toLowerCase(), i)
        return map
      }
      function d3_time_parseWeekdayNumber (date, string, i) {
        d3_time_numberRe.lastIndex = 0
        var n = d3_time_numberRe.exec(string.slice(i, i + 1))
        return n ? (date.w = +n[0], i + n[0].length) : -1
      }
      function d3_time_parseWeekNumberSunday (date, string, i) {
        d3_time_numberRe.lastIndex = 0
        var n = d3_time_numberRe.exec(string.slice(i))
        return n ? (date.U = +n[0], i + n[0].length) : -1
      }
      function d3_time_parseWeekNumberMonday (date, string, i) {
        d3_time_numberRe.lastIndex = 0
        var n = d3_time_numberRe.exec(string.slice(i))
        return n ? (date.W = +n[0], i + n[0].length) : -1
      }
      function d3_time_parseFullYear (date, string, i) {
        d3_time_numberRe.lastIndex = 0
        var n = d3_time_numberRe.exec(string.slice(i, i + 4))
        return n ? (date.y = +n[0], i + n[0].length) : -1
      }
      function d3_time_parseYear (date, string, i) {
        d3_time_numberRe.lastIndex = 0
        var n = d3_time_numberRe.exec(string.slice(i, i + 2))
        return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1
      }
      function d3_time_parseZone (date, string, i) {
        return /^[+-]\d{4}$/.test(string = string.slice(i, i + 5)) ? (date.Z = -string,
    i + 5) : -1
      }
      function d3_time_expandYear (d) {
        return d + (d > 68 ? 1900 : 2e3)
      }
      function d3_time_parseMonthNumber (date, string, i) {
        d3_time_numberRe.lastIndex = 0
        var n = d3_time_numberRe.exec(string.slice(i, i + 2))
        return n ? (date.m = n[0] - 1, i + n[0].length) : -1
      }
      function d3_time_parseDay (date, string, i) {
        d3_time_numberRe.lastIndex = 0
        var n = d3_time_numberRe.exec(string.slice(i, i + 2))
        return n ? (date.d = +n[0], i + n[0].length) : -1
      }
      function d3_time_parseDayOfYear (date, string, i) {
        d3_time_numberRe.lastIndex = 0
        var n = d3_time_numberRe.exec(string.slice(i, i + 3))
        return n ? (date.j = +n[0], i + n[0].length) : -1
      }
      function d3_time_parseHour24 (date, string, i) {
        d3_time_numberRe.lastIndex = 0
        var n = d3_time_numberRe.exec(string.slice(i, i + 2))
        return n ? (date.H = +n[0], i + n[0].length) : -1
      }
      function d3_time_parseMinutes (date, string, i) {
        d3_time_numberRe.lastIndex = 0
        var n = d3_time_numberRe.exec(string.slice(i, i + 2))
        return n ? (date.M = +n[0], i + n[0].length) : -1
      }
      function d3_time_parseSeconds (date, string, i) {
        d3_time_numberRe.lastIndex = 0
        var n = d3_time_numberRe.exec(string.slice(i, i + 2))
        return n ? (date.S = +n[0], i + n[0].length) : -1
      }
      function d3_time_parseMilliseconds (date, string, i) {
        d3_time_numberRe.lastIndex = 0
        var n = d3_time_numberRe.exec(string.slice(i, i + 3))
        return n ? (date.L = +n[0], i + n[0].length) : -1
      }
      function d3_time_zone (d) {
        var z = d.getTimezoneOffset(), zs = z > 0 ? '-' : '+', zh = abs(z) / 60 | 0, zm = abs(z) % 60
        return zs + d3_time_formatPad(zh, '0', 2) + d3_time_formatPad(zm, '0', 2)
      }
      function d3_time_parseLiteralPercent (date, string, i) {
        d3_time_percentRe.lastIndex = 0
        var n = d3_time_percentRe.exec(string.slice(i, i + 1))
        return n ? i + n[0].length : -1
      }
      function d3_time_formatMulti (formats) {
        var n = formats.length, i = -1
        while (++i < n) formats[i][0] = this(formats[i][0])
        return function (date) {
          var i = 0, f = formats[i]
          while (!f[1](date)) f = formats[++i]
          return f[0](date)
        }
      }
      d3.locale = function (locale) {
        return {
          numberFormat: d3_locale_numberFormat(locale),
          timeFormat: d3_locale_timeFormat(locale)
        }
      }
      var d3_locale_enUS = d3.locale({
        decimal: '.',
        thousands: ',',
        grouping: [ 3 ],
        currency: [ '$', '' ],
        dateTime: '%a %b %e %X %Y',
        date: '%m/%d/%Y',
        time: '%H:%M:%S',
        periods: [ 'AM', 'PM' ],
        days: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        shortDays: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
        months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        shortMonths: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
      })
      d3.format = d3_locale_enUS.numberFormat
      d3.geo = {}
      function d3_adder () {}
      d3_adder.prototype = {
        s: 0,
        t: 0,
        add: function (y) {
          d3_adderSum(y, this.t, d3_adderTemp)
          d3_adderSum(d3_adderTemp.s, this.s, this)
          if (this.s) this.t += d3_adderTemp.t; else this.s = d3_adderTemp.t
        },
        reset: function () {
          this.s = this.t = 0
        },
        valueOf: function () {
          return this.s
        }
      }
      var d3_adderTemp = new d3_adder()
      function d3_adderSum (a, b, o) {
        var x = o.s = a + b, bv = x - a, av = x - bv
        o.t = a - av + (b - bv)
      }
      d3.geo.stream = function (object, listener) {
        if (object && d3_geo_streamObjectType.hasOwnProperty(object.type)) {
          d3_geo_streamObjectType[object.type](object, listener)
        } else {
          d3_geo_streamGeometry(object, listener)
        }
      }
      function d3_geo_streamGeometry (geometry, listener) {
        if (geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)) {
          d3_geo_streamGeometryType[geometry.type](geometry, listener)
        }
      }
      var d3_geo_streamObjectType = {
        Feature: function (feature, listener) {
          d3_geo_streamGeometry(feature.geometry, listener)
        },
        FeatureCollection: function (object, listener) {
          var features = object.features, i = -1, n = features.length
          while (++i < n) d3_geo_streamGeometry(features[i].geometry, listener)
        }
      }
      var d3_geo_streamGeometryType = {
        Sphere: function (object, listener) {
          listener.sphere()
        },
        Point: function (object, listener) {
          object = object.coordinates
          listener.point(object[0], object[1], object[2])
        },
        MultiPoint: function (object, listener) {
          var coordinates = object.coordinates, i = -1, n = coordinates.length
          while (++i < n) object = coordinates[i], listener.point(object[0], object[1], object[2])
        },
        LineString: function (object, listener) {
          d3_geo_streamLine(object.coordinates, listener, 0)
        },
        MultiLineString: function (object, listener) {
          var coordinates = object.coordinates, i = -1, n = coordinates.length
          while (++i < n) d3_geo_streamLine(coordinates[i], listener, 0)
        },
        Polygon: function (object, listener) {
          d3_geo_streamPolygon(object.coordinates, listener)
        },
        MultiPolygon: function (object, listener) {
          var coordinates = object.coordinates, i = -1, n = coordinates.length
          while (++i < n) d3_geo_streamPolygon(coordinates[i], listener)
        },
        GeometryCollection: function (object, listener) {
          var geometries = object.geometries, i = -1, n = geometries.length
          while (++i < n) d3_geo_streamGeometry(geometries[i], listener)
        }
      }
      function d3_geo_streamLine (coordinates, listener, closed) {
        var i = -1, n = coordinates.length - closed, coordinate
        listener.lineStart()
        while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1], coordinate[2])
        listener.lineEnd()
      }
      function d3_geo_streamPolygon (coordinates, listener) {
        var i = -1, n = coordinates.length
        listener.polygonStart()
        while (++i < n) d3_geo_streamLine(coordinates[i], listener, 1)
        listener.polygonEnd()
      }
      d3.geo.area = function (object) {
        d3_geo_areaSum = 0
        d3.geo.stream(object, d3_geo_area)
        return d3_geo_areaSum
      }
      var d3_geo_areaSum, d3_geo_areaRingSum = new d3_adder()
      var d3_geo_area = {
        sphere: function () {
          d3_geo_areaSum += 4 * π
        },
        point: d3_noop,
        lineStart: d3_noop,
        lineEnd: d3_noop,
        polygonStart: function () {
          d3_geo_areaRingSum.reset()
          d3_geo_area.lineStart = d3_geo_areaRingStart
        },
        polygonEnd: function () {
          var area = 2 * d3_geo_areaRingSum
          d3_geo_areaSum += area < 0 ? 4 * π + area : area
          d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop
        }
      }
      function d3_geo_areaRingStart () {
        var λ00, φ00, λ0, cosφ0, sinφ0
        d3_geo_area.point = function (λ, φ) {
          d3_geo_area.point = nextPoint
          λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4),
      sinφ0 = Math.sin(φ)
        }
        function nextPoint (λ, φ) {
          λ *= d3_radians
          φ = φ * d3_radians / 2 + π / 4
          var dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, cosφ = Math.cos(φ), sinφ = Math.sin(φ), k = sinφ0 * sinφ, u = cosφ0 * cosφ + k * Math.cos(adλ), v = k * sdλ * Math.sin(adλ)
          d3_geo_areaRingSum.add(Math.atan2(v, u))
          λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ
        }
        d3_geo_area.lineEnd = function () {
          nextPoint(λ00, φ00)
        }
      }
      function d3_geo_cartesian (spherical) {
        var λ = spherical[0], φ = spherical[1], cosφ = Math.cos(φ)
        return [ cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ) ]
      }
      function d3_geo_cartesianDot (a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
      }
      function d3_geo_cartesianCross (a, b) {
        return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ]
      }
      function d3_geo_cartesianAdd (a, b) {
        a[0] += b[0]
        a[1] += b[1]
        a[2] += b[2]
      }
      function d3_geo_cartesianScale (vector, k) {
        return [ vector[0] * k, vector[1] * k, vector[2] * k ]
      }
      function d3_geo_cartesianNormalize (d) {
        var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2])
        d[0] /= l
        d[1] /= l
        d[2] /= l
      }
      function d3_geo_spherical (cartesian) {
        return [ Math.atan2(cartesian[1], cartesian[0]), d3_asin(cartesian[2]) ]
      }
      function d3_geo_sphericalEqual (a, b) {
        return abs(a[0] - b[0]) < ε && abs(a[1] - b[1]) < ε
      }
      d3.geo.bounds = (function () {
        var λ0, φ0, λ1, φ1, λ_, λ__, φ__, p0, dλSum, ranges, range
        var bound = {
          point: point,
          lineStart: lineStart,
          lineEnd: lineEnd,
          polygonStart: function () {
            bound.point = ringPoint
            bound.lineStart = ringStart
            bound.lineEnd = ringEnd
            dλSum = 0
            d3_geo_area.polygonStart()
          },
          polygonEnd: function () {
            d3_geo_area.polygonEnd()
            bound.point = point
            bound.lineStart = lineStart
            bound.lineEnd = lineEnd
            if (d3_geo_areaRingSum < 0) λ0 = -(λ1 = 180), φ0 = -(φ1 = 90); else if (dλSum > ε) φ1 = 90; else if (dλSum < -ε) φ0 = -90
            range[0] = λ0, range[1] = λ1
          }
        }
        function point (λ, φ) {
          ranges.push(range = [ λ0 = λ, λ1 = λ ])
          if (φ < φ0) φ0 = φ
          if (φ > φ1) φ1 = φ
        }
        function linePoint (λ, φ) {
          var p = d3_geo_cartesian([ λ * d3_radians, φ * d3_radians ])
          if (p0) {
            var normal = d3_geo_cartesianCross(p0, p), equatorial = [ normal[1], -normal[0], 0 ], inflection = d3_geo_cartesianCross(equatorial, normal)
            d3_geo_cartesianNormalize(inflection)
            inflection = d3_geo_spherical(inflection)
            var dλ = λ - λ_, s = dλ > 0 ? 1 : -1, λi = inflection[0] * d3_degrees * s, antimeridian = abs(dλ) > 180
            if (antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
              var φi = inflection[1] * d3_degrees
              if (φi > φ1) φ1 = φi
            } else if (λi = (λi + 360) % 360 - 180, antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
              var φi = -inflection[1] * d3_degrees
              if (φi < φ0) φ0 = φi
            } else {
              if (φ < φ0) φ0 = φ
              if (φ > φ1) φ1 = φ
            }
            if (antimeridian) {
              if (λ < λ_) {
                if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ
              } else {
                if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ
              }
            } else {
              if (λ1 >= λ0) {
                if (λ < λ0) λ0 = λ
                if (λ > λ1) λ1 = λ
              } else {
                if (λ > λ_) {
                  if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ
                } else {
                  if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ
                }
              }
            }
          } else {
            point(λ, φ)
          }
          p0 = p, λ_ = λ
        }
        function lineStart () {
          bound.point = linePoint
        }
        function lineEnd () {
          range[0] = λ0, range[1] = λ1
          bound.point = point
          p0 = null
        }
        function ringPoint (λ, φ) {
          if (p0) {
            var dλ = λ - λ_
            dλSum += abs(dλ) > 180 ? dλ + (dλ > 0 ? 360 : -360) : dλ
          } else λ__ = λ, φ__ = φ
          d3_geo_area.point(λ, φ)
          linePoint(λ, φ)
        }
        function ringStart () {
          d3_geo_area.lineStart()
        }
        function ringEnd () {
          ringPoint(λ__, φ__)
          d3_geo_area.lineEnd()
          if (abs(dλSum) > ε) λ0 = -(λ1 = 180)
          range[0] = λ0, range[1] = λ1
          p0 = null
        }
        function angle (λ0, λ1) {
          return (λ1 -= λ0) < 0 ? λ1 + 360 : λ1
        }
        function compareRanges (a, b) {
          return a[0] - b[0]
        }
        function withinRange (x, range) {
          return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x
        }
        return function (feature) {
          φ1 = λ1 = -(λ0 = φ0 = Infinity)
          ranges = []
          d3.geo.stream(feature, bound)
          var n = ranges.length
          if (n) {
            ranges.sort(compareRanges)
            for (var i = 1, a = ranges[0], b, merged = [ a ]; i < n; ++i) {
              b = ranges[i]
              if (withinRange(b[0], a) || withinRange(b[1], a)) {
                if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1]
                if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0]
              } else {
                merged.push(a = b)
              }
            }
            var best = -Infinity, dλ
            for (var n = merged.length - 1, i = 0, a = merged[n], b; i <= n; a = b, ++i) {
              b = merged[i]
              if ((dλ = angle(a[1], b[0])) > best) best = dλ, λ0 = b[0], λ1 = a[1]
            }
          }
          ranges = range = null
          return λ0 === Infinity || φ0 === Infinity ? [ [ NaN, NaN ], [ NaN, NaN ] ] : [ [ λ0, φ0 ], [ λ1, φ1 ] ]
        }
      }())
      d3.geo.centroid = function (object) {
        d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0
        d3.geo.stream(object, d3_geo_centroid)
        var x = d3_geo_centroidX2, y = d3_geo_centroidY2, z = d3_geo_centroidZ2, m = x * x + y * y + z * z
        if (m < ε2) {
          x = d3_geo_centroidX1, y = d3_geo_centroidY1, z = d3_geo_centroidZ1
          if (d3_geo_centroidW1 < ε) x = d3_geo_centroidX0, y = d3_geo_centroidY0, z = d3_geo_centroidZ0
          m = x * x + y * y + z * z
          if (m < ε2) return [ NaN, NaN ]
        }
        return [ Math.atan2(y, x) * d3_degrees, d3_asin(z / Math.sqrt(m)) * d3_degrees ]
      }
      var d3_geo_centroidW0, d3_geo_centroidW1, d3_geo_centroidX0, d3_geo_centroidY0, d3_geo_centroidZ0, d3_geo_centroidX1, d3_geo_centroidY1, d3_geo_centroidZ1, d3_geo_centroidX2, d3_geo_centroidY2, d3_geo_centroidZ2
      var d3_geo_centroid = {
        sphere: d3_noop,
        point: d3_geo_centroidPoint,
        lineStart: d3_geo_centroidLineStart,
        lineEnd: d3_geo_centroidLineEnd,
        polygonStart: function () {
          d3_geo_centroid.lineStart = d3_geo_centroidRingStart
        },
        polygonEnd: function () {
          d3_geo_centroid.lineStart = d3_geo_centroidLineStart
        }
      }
      function d3_geo_centroidPoint (λ, φ) {
        λ *= d3_radians
        var cosφ = Math.cos(φ *= d3_radians)
        d3_geo_centroidPointXYZ(cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ))
      }
      function d3_geo_centroidPointXYZ (x, y, z) {
        ++d3_geo_centroidW0
        d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0
        d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0
        d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0
      }
      function d3_geo_centroidLineStart () {
        var x0, y0, z0
        d3_geo_centroid.point = function (λ, φ) {
          λ *= d3_radians
          var cosφ = Math.cos(φ *= d3_radians)
          x0 = cosφ * Math.cos(λ)
          y0 = cosφ * Math.sin(λ)
          z0 = Math.sin(φ)
          d3_geo_centroid.point = nextPoint
          d3_geo_centroidPointXYZ(x0, y0, z0)
        }
        function nextPoint (λ, φ) {
          λ *= d3_radians
          var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), w = Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z)
          d3_geo_centroidW1 += w
          d3_geo_centroidX1 += w * (x0 + (x0 = x))
          d3_geo_centroidY1 += w * (y0 + (y0 = y))
          d3_geo_centroidZ1 += w * (z0 + (z0 = z))
          d3_geo_centroidPointXYZ(x0, y0, z0)
        }
      }
      function d3_geo_centroidLineEnd () {
        d3_geo_centroid.point = d3_geo_centroidPoint
      }
      function d3_geo_centroidRingStart () {
        var λ00, φ00, x0, y0, z0
        d3_geo_centroid.point = function (λ, φ) {
          λ00 = λ, φ00 = φ
          d3_geo_centroid.point = nextPoint
          λ *= d3_radians
          var cosφ = Math.cos(φ *= d3_radians)
          x0 = cosφ * Math.cos(λ)
          y0 = cosφ * Math.sin(λ)
          z0 = Math.sin(φ)
          d3_geo_centroidPointXYZ(x0, y0, z0)
        }
        d3_geo_centroid.lineEnd = function () {
          nextPoint(λ00, φ00)
          d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd
          d3_geo_centroid.point = d3_geo_centroidPoint
        }
        function nextPoint (λ, φ) {
          λ *= d3_radians
          var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = Math.sqrt(cx * cx + cy * cy + cz * cz), u = x0 * x + y0 * y + z0 * z, v = m && -d3_acos(u) / m, w = Math.atan2(m, u)
          d3_geo_centroidX2 += v * cx
          d3_geo_centroidY2 += v * cy
          d3_geo_centroidZ2 += v * cz
          d3_geo_centroidW1 += w
          d3_geo_centroidX1 += w * (x0 + (x0 = x))
          d3_geo_centroidY1 += w * (y0 + (y0 = y))
          d3_geo_centroidZ1 += w * (z0 + (z0 = z))
          d3_geo_centroidPointXYZ(x0, y0, z0)
        }
      }
      function d3_geo_compose (a, b) {
        function compose (x, y) {
          return x = a(x, y), b(x[0], x[1])
        }
        if (a.invert && b.invert) {
          compose.invert = function (x, y) {
            return x = b.invert(x, y), x && a.invert(x[0], x[1])
          }
        }
        return compose
      }
      function d3_true () {
        return true
      }
      function d3_geo_clipPolygon (segments, compare, clipStartInside, interpolate, listener) {
        var subject = [], clip = []
        segments.forEach(function (segment) {
          if ((n = segment.length - 1) <= 0) return
          var n, p0 = segment[0], p1 = segment[n]
          if (d3_geo_sphericalEqual(p0, p1)) {
            listener.lineStart()
            for (var i = 0; i < n; ++i) listener.point((p0 = segment[i])[0], p0[1])
            listener.lineEnd()
            return
          }
          var a = new d3_geo_clipPolygonIntersection(p0, segment, null, true), b = new d3_geo_clipPolygonIntersection(p0, null, a, false)
          a.o = b
          subject.push(a)
          clip.push(b)
          a = new d3_geo_clipPolygonIntersection(p1, segment, null, false)
          b = new d3_geo_clipPolygonIntersection(p1, null, a, true)
          a.o = b
          subject.push(a)
          clip.push(b)
        })
        clip.sort(compare)
        d3_geo_clipPolygonLinkCircular(subject)
        d3_geo_clipPolygonLinkCircular(clip)
        if (!subject.length) return
        for (var i = 0, entry = clipStartInside, n = clip.length; i < n; ++i) {
          clip[i].e = entry = !entry
        }
        var start = subject[0], points, point
        while (1) {
          var current = start, isSubject = true
          while (current.v) if ((current = current.n) === start) return
          points = current.z
          listener.lineStart()
          do {
            current.v = current.o.v = true
            if (current.e) {
              if (isSubject) {
                for (var i = 0, n = points.length; i < n; ++i) listener.point((point = points[i])[0], point[1])
              } else {
                interpolate(current.x, current.n.x, 1, listener)
              }
              current = current.n
            } else {
              if (isSubject) {
                points = current.p.z
                for (var i = points.length - 1; i >= 0; --i) listener.point((point = points[i])[0], point[1])
              } else {
                interpolate(current.x, current.p.x, -1, listener)
              }
              current = current.p
            }
            current = current.o
            points = current.z
            isSubject = !isSubject
          } while (!current.v)
          listener.lineEnd()
        }
      }
      function d3_geo_clipPolygonLinkCircular (array) {
        if (!(n = array.length)) return
        var n, i = 0, a = array[0], b
        while (++i < n) {
          a.n = b = array[i]
          b.p = a
          a = b
        }
        a.n = b = array[0]
        b.p = a
      }
      function d3_geo_clipPolygonIntersection (point, points, other, entry) {
        this.x = point
        this.z = points
        this.o = other
        this.e = entry
        this.v = false
        this.n = this.p = null
      }
      function d3_geo_clip (pointVisible, clipLine, interpolate, clipStart) {
        return function (rotate, listener) {
          var line = clipLine(listener), rotatedClipStart = rotate.invert(clipStart[0], clipStart[1])
          var clip = {
            point: point,
            lineStart: lineStart,
            lineEnd: lineEnd,
            polygonStart: function () {
              clip.point = pointRing
              clip.lineStart = ringStart
              clip.lineEnd = ringEnd
              segments = []
              polygon = []
            },
            polygonEnd: function () {
              clip.point = point
              clip.lineStart = lineStart
              clip.lineEnd = lineEnd
              segments = d3.merge(segments)
              var clipStartInside = d3_geo_pointInPolygon(rotatedClipStart, polygon)
              if (segments.length) {
                if (!polygonStarted) listener.polygonStart(), polygonStarted = true
                d3_geo_clipPolygon(segments, d3_geo_clipSort, clipStartInside, interpolate, listener)
              } else if (clipStartInside) {
                if (!polygonStarted) listener.polygonStart(), polygonStarted = true
                listener.lineStart()
                interpolate(null, null, 1, listener)
                listener.lineEnd()
              }
              if (polygonStarted) listener.polygonEnd(), polygonStarted = false
              segments = polygon = null
            },
            sphere: function () {
              listener.polygonStart()
              listener.lineStart()
              interpolate(null, null, 1, listener)
              listener.lineEnd()
              listener.polygonEnd()
            }
          }
          function point (λ, φ) {
            var point = rotate(λ, φ)
            if (pointVisible(λ = point[0], φ = point[1])) listener.point(λ, φ)
          }
          function pointLine (λ, φ) {
            var point = rotate(λ, φ)
            line.point(point[0], point[1])
          }
          function lineStart () {
            clip.point = pointLine
            line.lineStart()
          }
          function lineEnd () {
            clip.point = point
            line.lineEnd()
          }
          var segments
          var buffer = d3_geo_clipBufferListener(), ringListener = clipLine(buffer), polygonStarted = false, polygon, ring
          function pointRing (λ, φ) {
            ring.push([ λ, φ ])
            var point = rotate(λ, φ)
            ringListener.point(point[0], point[1])
          }
          function ringStart () {
            ringListener.lineStart()
            ring = []
          }
          function ringEnd () {
            pointRing(ring[0][0], ring[0][1])
            ringListener.lineEnd()
            var clean = ringListener.clean(), ringSegments = buffer.buffer(), segment, n = ringSegments.length
            ring.pop()
            polygon.push(ring)
            ring = null
            if (!n) return
            if (clean & 1) {
              segment = ringSegments[0]
              var n = segment.length - 1, i = -1, point
              if (n > 0) {
                if (!polygonStarted) listener.polygonStart(), polygonStarted = true
                listener.lineStart()
                while (++i < n) listener.point((point = segment[i])[0], point[1])
                listener.lineEnd()
              }
              return
            }
            if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()))
            segments.push(ringSegments.filter(d3_geo_clipSegmentLength1))
          }
          return clip
        }
      }
      function d3_geo_clipSegmentLength1 (segment) {
        return segment.length > 1
      }
      function d3_geo_clipBufferListener () {
        var lines = [], line
        return {
          lineStart: function () {
            lines.push(line = [])
          },
          point: function (λ, φ) {
            line.push([ λ, φ ])
          },
          lineEnd: d3_noop,
          buffer: function () {
            var buffer = lines
            lines = []
            line = null
            return buffer
          },
          rejoin: function () {
            if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()))
          }
        }
      }
      function d3_geo_clipSort (a, b) {
        return ((a = a.x)[0] < 0 ? a[1] - halfπ - ε : halfπ - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfπ - ε : halfπ - b[1])
      }
      var d3_geo_clipAntimeridian = d3_geo_clip(d3_true, d3_geo_clipAntimeridianLine, d3_geo_clipAntimeridianInterpolate, [ -π, -π / 2 ])
      function d3_geo_clipAntimeridianLine (listener) {
        var λ0 = NaN, φ0 = NaN, sλ0 = NaN, clean
        return {
          lineStart: function () {
            listener.lineStart()
            clean = 1
          },
          point: function (λ1, φ1) {
            var sλ1 = λ1 > 0 ? π : -π, dλ = abs(λ1 - λ0)
            if (abs(dλ - π) < ε) {
              listener.point(λ0, φ0 = (φ0 + φ1) / 2 > 0 ? halfπ : -halfπ)
              listener.point(sλ0, φ0)
              listener.lineEnd()
              listener.lineStart()
              listener.point(sλ1, φ0)
              listener.point(λ1, φ0)
              clean = 0
            } else if (sλ0 !== sλ1 && dλ >= π) {
              if (abs(λ0 - sλ0) < ε) λ0 -= sλ0 * ε
              if (abs(λ1 - sλ1) < ε) λ1 -= sλ1 * ε
              φ0 = d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1)
              listener.point(sλ0, φ0)
              listener.lineEnd()
              listener.lineStart()
              listener.point(sλ1, φ0)
              clean = 0
            }
            listener.point(λ0 = λ1, φ0 = φ1)
            sλ0 = sλ1
          },
          lineEnd: function () {
            listener.lineEnd()
            λ0 = φ0 = NaN
          },
          clean: function () {
            return 2 - clean
          }
        }
      }
      function d3_geo_clipAntimeridianIntersect (λ0, φ0, λ1, φ1) {
        var cosφ0, cosφ1, sinλ0_λ1 = Math.sin(λ0 - λ1)
        return abs(sinλ0_λ1) > ε ? Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)) : (φ0 + φ1) / 2
      }
      function d3_geo_clipAntimeridianInterpolate (from, to, direction, listener) {
        var φ
        if (from == null) {
          φ = direction * halfπ
          listener.point(-π, φ)
          listener.point(0, φ)
          listener.point(π, φ)
          listener.point(π, 0)
          listener.point(π, -φ)
          listener.point(0, -φ)
          listener.point(-π, -φ)
          listener.point(-π, 0)
          listener.point(-π, φ)
        } else if (abs(from[0] - to[0]) > ε) {
          var s = from[0] < to[0] ? π : -π
          φ = direction * s / 2
          listener.point(-s, φ)
          listener.point(0, φ)
          listener.point(s, φ)
        } else {
          listener.point(to[0], to[1])
        }
      }
      function d3_geo_pointInPolygon (point, polygon) {
        var meridian = point[0], parallel = point[1], meridianNormal = [ Math.sin(meridian), -Math.cos(meridian), 0 ], polarAngle = 0, winding = 0
        d3_geo_areaRingSum.reset()
        for (var i = 0, n = polygon.length; i < n; ++i) {
          var ring = polygon[i], m = ring.length
          if (!m) continue
          var point0 = ring[0], λ0 = point0[0], φ0 = point0[1] / 2 + π / 4, sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), j = 1
          while (true) {
            if (j === m) j = 0
            point = ring[j]
            var λ = point[0], φ = point[1] / 2 + π / 4, sinφ = Math.sin(φ), cosφ = Math.cos(φ), dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, antimeridian = adλ > π, k = sinφ0 * sinφ
            d3_geo_areaRingSum.add(Math.atan2(k * sdλ * Math.sin(adλ), cosφ0 * cosφ + k * Math.cos(adλ)))
            polarAngle += antimeridian ? dλ + sdλ * τ : dλ
            if (antimeridian ^ λ0 >= meridian ^ λ >= meridian) {
              var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point))
              d3_geo_cartesianNormalize(arc)
              var intersection = d3_geo_cartesianCross(meridianNormal, arc)
              d3_geo_cartesianNormalize(intersection)
              var φarc = (antimeridian ^ dλ >= 0 ? -1 : 1) * d3_asin(intersection[2])
              if (parallel > φarc || parallel === φarc && (arc[0] || arc[1])) {
                winding += antimeridian ^ dλ >= 0 ? 1 : -1
              }
            }
            if (!j++) break
            λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ, point0 = point
          }
        }
        return (polarAngle < -ε || polarAngle < ε && d3_geo_areaRingSum < 0) ^ winding & 1
      }
      function d3_geo_clipCircle (radius) {
        var cr = Math.cos(radius), smallRadius = cr > 0, notHemisphere = abs(cr) > ε, interpolate = d3_geo_circleInterpolate(radius, 6 * d3_radians)
        return d3_geo_clip(visible, clipLine, interpolate, smallRadius ? [ 0, -radius ] : [ -π, radius - π ])
        function visible (λ, φ) {
          return Math.cos(λ) * Math.cos(φ) > cr
        }
        function clipLine (listener) {
          var point0, c0, v0, v00, clean
          return {
            lineStart: function () {
              v00 = v0 = false
              clean = 1
            },
            point: function (λ, φ) {
              var point1 = [ λ, φ ], point2, v = visible(λ, φ), c = smallRadius ? v ? 0 : code(λ, φ) : v ? code(λ + (λ < 0 ? π : -π), φ) : 0
              if (!point0 && (v00 = v0 = v)) listener.lineStart()
              if (v !== v0) {
                point2 = intersect(point0, point1)
                if (d3_geo_sphericalEqual(point0, point2) || d3_geo_sphericalEqual(point1, point2)) {
                  point1[0] += ε
                  point1[1] += ε
                  v = visible(point1[0], point1[1])
                }
              }
              if (v !== v0) {
                clean = 0
                if (v) {
                  listener.lineStart()
                  point2 = intersect(point1, point0)
                  listener.point(point2[0], point2[1])
                } else {
                  point2 = intersect(point0, point1)
                  listener.point(point2[0], point2[1])
                  listener.lineEnd()
                }
                point0 = point2
              } else if (notHemisphere && point0 && smallRadius ^ v) {
                var t
                if (!(c & c0) && (t = intersect(point1, point0, true))) {
                  clean = 0
                  if (smallRadius) {
                    listener.lineStart()
                    listener.point(t[0][0], t[0][1])
                    listener.point(t[1][0], t[1][1])
                    listener.lineEnd()
                  } else {
                    listener.point(t[1][0], t[1][1])
                    listener.lineEnd()
                    listener.lineStart()
                    listener.point(t[0][0], t[0][1])
                  }
                }
              }
              if (v && (!point0 || !d3_geo_sphericalEqual(point0, point1))) {
                listener.point(point1[0], point1[1])
              }
              point0 = point1, v0 = v, c0 = c
            },
            lineEnd: function () {
              if (v0) listener.lineEnd()
              point0 = null
            },
            clean: function () {
              return clean | (v00 && v0) << 1
            }
          }
        }
        function intersect (a, b, two) {
          var pa = d3_geo_cartesian(a), pb = d3_geo_cartesian(b)
          var n1 = [ 1, 0, 0 ], n2 = d3_geo_cartesianCross(pa, pb), n2n2 = d3_geo_cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2
          if (!determinant) return !two && a
          var c1 = cr * n2n2 / determinant, c2 = -cr * n1n2 / determinant, n1xn2 = d3_geo_cartesianCross(n1, n2), A = d3_geo_cartesianScale(n1, c1), B = d3_geo_cartesianScale(n2, c2)
          d3_geo_cartesianAdd(A, B)
          var u = n1xn2, w = d3_geo_cartesianDot(A, u), uu = d3_geo_cartesianDot(u, u), t2 = w * w - uu * (d3_geo_cartesianDot(A, A) - 1)
          if (t2 < 0) return
          var t = Math.sqrt(t2), q = d3_geo_cartesianScale(u, (-w - t) / uu)
          d3_geo_cartesianAdd(q, A)
          q = d3_geo_spherical(q)
          if (!two) return q
          var λ0 = a[0], λ1 = b[0], φ0 = a[1], φ1 = b[1], z
          if (λ1 < λ0) z = λ0, λ0 = λ1, λ1 = z
          var δλ = λ1 - λ0, polar = abs(δλ - π) < ε, meridian = polar || δλ < ε
          if (!polar && φ1 < φ0) z = φ0, φ0 = φ1, φ1 = z
          if (meridian ? polar ? φ0 + φ1 > 0 ^ q[1] < (abs(q[0] - λ0) < ε ? φ0 : φ1) : φ0 <= q[1] && q[1] <= φ1 : δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)) {
            var q1 = d3_geo_cartesianScale(u, (-w + t) / uu)
            d3_geo_cartesianAdd(q1, A)
            return [ q, d3_geo_spherical(q1) ]
          }
        }
        function code (λ, φ) {
          var r = smallRadius ? radius : π - radius, code = 0
          if (λ < -r) code |= 1; else if (λ > r) code |= 2
          if (φ < -r) code |= 4; else if (φ > r) code |= 8
          return code
        }
      }
      function d3_geom_clipLine (x0, y0, x1, y1) {
        return function (line) {
          var a = line.a, b = line.b, ax = a.x, ay = a.y, bx = b.x, by = b.y, t0 = 0, t1 = 1, dx = bx - ax, dy = by - ay, r
          r = x0 - ax
          if (!dx && r > 0) return
          r /= dx
          if (dx < 0) {
            if (r < t0) return
            if (r < t1) t1 = r
          } else if (dx > 0) {
            if (r > t1) return
            if (r > t0) t0 = r
          }
          r = x1 - ax
          if (!dx && r < 0) return
          r /= dx
          if (dx < 0) {
            if (r > t1) return
            if (r > t0) t0 = r
          } else if (dx > 0) {
            if (r < t0) return
            if (r < t1) t1 = r
          }
          r = y0 - ay
          if (!dy && r > 0) return
          r /= dy
          if (dy < 0) {
            if (r < t0) return
            if (r < t1) t1 = r
          } else if (dy > 0) {
            if (r > t1) return
            if (r > t0) t0 = r
          }
          r = y1 - ay
          if (!dy && r < 0) return
          r /= dy
          if (dy < 0) {
            if (r > t1) return
            if (r > t0) t0 = r
          } else if (dy > 0) {
            if (r < t0) return
            if (r < t1) t1 = r
          }
          if (t0 > 0) {
            line.a = {
              x: ax + t0 * dx,
              y: ay + t0 * dy
            }
          }
          if (t1 < 1) {
            line.b = {
              x: ax + t1 * dx,
              y: ay + t1 * dy
            }
          }
          return line
        }
      }
      var d3_geo_clipExtentMAX = 1e9
      d3.geo.clipExtent = function () {
        var x0, y0, x1, y1, stream, clip, clipExtent = {
            stream: function (output) {
              if (stream) stream.valid = false
              stream = clip(output)
              stream.valid = true
              return stream
            },
            extent: function (_) {
              if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ]
              clip = d3_geo_clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1])
              if (stream) stream.valid = false, stream = null
              return clipExtent
            }
          }
        return clipExtent.extent([ [ 0, 0 ], [ 960, 500 ] ])
      }
      function d3_geo_clipExtent (x0, y0, x1, y1) {
        return function (listener) {
          var listener_ = listener, bufferListener = d3_geo_clipBufferListener(), clipLine = d3_geom_clipLine(x0, y0, x1, y1), segments, polygon, ring
          var clip = {
            point: point,
            lineStart: lineStart,
            lineEnd: lineEnd,
            polygonStart: function () {
              listener = bufferListener
              segments = []
              polygon = []
              clean = true
            },
            polygonEnd: function () {
              listener = listener_
              segments = d3.merge(segments)
              var clipStartInside = insidePolygon([ x0, y1 ]), inside = clean && clipStartInside, visible = segments.length
              if (inside || visible) {
                listener.polygonStart()
                if (inside) {
                  listener.lineStart()
                  interpolate(null, null, 1, listener)
                  listener.lineEnd()
                }
                if (visible) {
                  d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener)
                }
                listener.polygonEnd()
              }
              segments = polygon = ring = null
            }
          }
          function insidePolygon (p) {
            var wn = 0, n = polygon.length, y = p[1]
            for (var i = 0; i < n; ++i) {
              for (var j = 1, v = polygon[i], m = v.length, a = v[0], b; j < m; ++j) {
                b = v[j]
                if (a[1] <= y) {
                  if (b[1] > y && d3_cross2d(a, b, p) > 0) ++wn
                } else {
                  if (b[1] <= y && d3_cross2d(a, b, p) < 0) --wn
                }
                a = b
              }
            }
            return wn !== 0
          }
          function interpolate (from, to, direction, listener) {
            var a = 0, a1 = 0
            if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoints(from, to) < 0 ^ direction > 0) {
              do {
                listener.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0)
              } while ((a = (a + direction + 4) % 4) !== a1)
            } else {
              listener.point(to[0], to[1])
            }
          }
          function pointVisible (x, y) {
            return x0 <= x && x <= x1 && y0 <= y && y <= y1
          }
          function point (x, y) {
            if (pointVisible(x, y)) listener.point(x, y)
          }
          var x__, y__, v__, x_, y_, v_, first, clean
          function lineStart () {
            clip.point = linePoint
            if (polygon) polygon.push(ring = [])
            first = true
            v_ = false
            x_ = y_ = NaN
          }
          function lineEnd () {
            if (segments) {
              linePoint(x__, y__)
              if (v__ && v_) bufferListener.rejoin()
              segments.push(bufferListener.buffer())
            }
            clip.point = point
            if (v_) listener.lineEnd()
          }
          function linePoint (x, y) {
            x = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, x))
            y = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, y))
            var v = pointVisible(x, y)
            if (polygon) ring.push([ x, y ])
            if (first) {
              x__ = x, y__ = y, v__ = v
              first = false
              if (v) {
                listener.lineStart()
                listener.point(x, y)
              }
            } else {
              if (v && v_) listener.point(x, y); else {
                var l = {
                  a: {
                    x: x_,
                    y: y_
                  },
                  b: {
                    x: x,
                    y: y
                  }
                }
                if (clipLine(l)) {
                  if (!v_) {
                    listener.lineStart()
                    listener.point(l.a.x, l.a.y)
                  }
                  listener.point(l.b.x, l.b.y)
                  if (!v) listener.lineEnd()
                  clean = false
                } else if (v) {
                  listener.lineStart()
                  listener.point(x, y)
                  clean = false
                }
              }
            }
            x_ = x, y_ = y, v_ = v
          }
          return clip
        }
        function corner (p, direction) {
          return abs(p[0] - x0) < ε ? direction > 0 ? 0 : 3 : abs(p[0] - x1) < ε ? direction > 0 ? 2 : 1 : abs(p[1] - y0) < ε ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2
        }
        function compare (a, b) {
          return comparePoints(a.x, b.x)
        }
        function comparePoints (a, b) {
          var ca = corner(a, 1), cb = corner(b, 1)
          return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0]
        }
      }
      function d3_geo_conic (projectAt) {
        var φ0 = 0, φ1 = π / 3, m = d3_geo_projectionMutator(projectAt), p = m(φ0, φ1)
        p.parallels = function (_) {
          if (!arguments.length) return [ φ0 / π * 180, φ1 / π * 180 ]
          return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180)
        }
        return p
      }
      function d3_geo_conicEqualArea (φ0, φ1) {
        var sinφ0 = Math.sin(φ0), n = (sinφ0 + Math.sin(φ1)) / 2, C = 1 + sinφ0 * (2 * n - sinφ0), ρ0 = Math.sqrt(C) / n
        function forward (λ, φ) {
          var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n
          return [ ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ) ]
        }
        forward.invert = function (x, y) {
          var ρ0_y = ρ0 - y
          return [ Math.atan2(x, ρ0_y) / n, d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n)) ]
        }
        return forward
      }
      (d3.geo.conicEqualArea = function () {
        return d3_geo_conic(d3_geo_conicEqualArea)
      }).raw = d3_geo_conicEqualArea
      d3.geo.albers = function () {
        return d3.geo.conicEqualArea().rotate([ 96, 0 ]).center([ -0.6, 38.7 ]).parallels([ 29.5, 45.5 ]).scale(1070)
      }
      d3.geo.albersUsa = function () {
        var lower48 = d3.geo.albers()
        var alaska = d3.geo.conicEqualArea().rotate([ 154, 0 ]).center([ -2, 58.5 ]).parallels([ 55, 65 ])
        var hawaii = d3.geo.conicEqualArea().rotate([ 157, 0 ]).center([ -3, 19.9 ]).parallels([ 8, 18 ])
        var point, pointStream = {
            point: function (x, y) {
              point = [ x, y ]
            }
          }, lower48Point, alaskaPoint, hawaiiPoint
        function albersUsa (coordinates) {
          var x = coordinates[0], y = coordinates[1]
          point = null;
          (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y)
          return point
        }
        albersUsa.invert = function (coordinates) {
          var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k
          return (y >= 0.12 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii : lower48).invert(coordinates)
        }
        albersUsa.stream = function (stream) {
          var lower48Stream = lower48.stream(stream), alaskaStream = alaska.stream(stream), hawaiiStream = hawaii.stream(stream)
          return {
            point: function (x, y) {
              lower48Stream.point(x, y)
              alaskaStream.point(x, y)
              hawaiiStream.point(x, y)
            },
            sphere: function () {
              lower48Stream.sphere()
              alaskaStream.sphere()
              hawaiiStream.sphere()
            },
            lineStart: function () {
              lower48Stream.lineStart()
              alaskaStream.lineStart()
              hawaiiStream.lineStart()
            },
            lineEnd: function () {
              lower48Stream.lineEnd()
              alaskaStream.lineEnd()
              hawaiiStream.lineEnd()
            },
            polygonStart: function () {
              lower48Stream.polygonStart()
              alaskaStream.polygonStart()
              hawaiiStream.polygonStart()
            },
            polygonEnd: function () {
              lower48Stream.polygonEnd()
              alaskaStream.polygonEnd()
              hawaiiStream.polygonEnd()
            }
          }
        }
        albersUsa.precision = function (_) {
          if (!arguments.length) return lower48.precision()
          lower48.precision(_)
          alaska.precision(_)
          hawaii.precision(_)
          return albersUsa
        }
        albersUsa.scale = function (_) {
          if (!arguments.length) return lower48.scale()
          lower48.scale(_)
          alaska.scale(_ * 0.35)
          hawaii.scale(_)
          return albersUsa.translate(lower48.translate())
        }
        albersUsa.translate = function (_) {
          if (!arguments.length) return lower48.translate()
          var k = lower48.scale(), x = +_[0], y = +_[1]
          lower48Point = lower48.translate(_).clipExtent([ [ x - 0.455 * k, y - 0.238 * k ], [ x + 0.455 * k, y + 0.238 * k ] ]).stream(pointStream).point
          alaskaPoint = alaska.translate([ x - 0.307 * k, y + 0.201 * k ]).clipExtent([ [ x - 0.425 * k + ε, y + 0.12 * k + ε ], [ x - 0.214 * k - ε, y + 0.234 * k - ε ] ]).stream(pointStream).point
          hawaiiPoint = hawaii.translate([ x - 0.205 * k, y + 0.212 * k ]).clipExtent([ [ x - 0.214 * k + ε, y + 0.166 * k + ε ], [ x - 0.115 * k - ε, y + 0.234 * k - ε ] ]).stream(pointStream).point
          return albersUsa
        }
        return albersUsa.scale(1070)
      }
      var d3_geo_pathAreaSum, d3_geo_pathAreaPolygon, d3_geo_pathArea = {
          point: d3_noop,
          lineStart: d3_noop,
          lineEnd: d3_noop,
          polygonStart: function () {
            d3_geo_pathAreaPolygon = 0
            d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart
          },
          polygonEnd: function () {
            d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop
            d3_geo_pathAreaSum += abs(d3_geo_pathAreaPolygon / 2)
          }
        }
      function d3_geo_pathAreaRingStart () {
        var x00, y00, x0, y0
        d3_geo_pathArea.point = function (x, y) {
          d3_geo_pathArea.point = nextPoint
          x00 = x0 = x, y00 = y0 = y
        }
        function nextPoint (x, y) {
          d3_geo_pathAreaPolygon += y0 * x - x0 * y
          x0 = x, y0 = y
        }
        d3_geo_pathArea.lineEnd = function () {
          nextPoint(x00, y00)
        }
      }
      var d3_geo_pathBoundsX0, d3_geo_pathBoundsY0, d3_geo_pathBoundsX1, d3_geo_pathBoundsY1
      var d3_geo_pathBounds = {
        point: d3_geo_pathBoundsPoint,
        lineStart: d3_noop,
        lineEnd: d3_noop,
        polygonStart: d3_noop,
        polygonEnd: d3_noop
      }
      function d3_geo_pathBoundsPoint (x, y) {
        if (x < d3_geo_pathBoundsX0) d3_geo_pathBoundsX0 = x
        if (x > d3_geo_pathBoundsX1) d3_geo_pathBoundsX1 = x
        if (y < d3_geo_pathBoundsY0) d3_geo_pathBoundsY0 = y
        if (y > d3_geo_pathBoundsY1) d3_geo_pathBoundsY1 = y
      }
      function d3_geo_pathBuffer () {
        var pointCircle = d3_geo_pathBufferCircle(4.5), buffer = []
        var stream = {
          point: point,
          lineStart: function () {
            stream.point = pointLineStart
          },
          lineEnd: lineEnd,
          polygonStart: function () {
            stream.lineEnd = lineEndPolygon
          },
          polygonEnd: function () {
            stream.lineEnd = lineEnd
            stream.point = point
          },
          pointRadius: function (_) {
            pointCircle = d3_geo_pathBufferCircle(_)
            return stream
          },
          result: function () {
            if (buffer.length) {
              var result = buffer.join('')
              buffer = []
              return result
            }
          }
        }
        function point (x, y) {
          buffer.push('M', x, ',', y, pointCircle)
        }
        function pointLineStart (x, y) {
          buffer.push('M', x, ',', y)
          stream.point = pointLine
        }
        function pointLine (x, y) {
          buffer.push('L', x, ',', y)
        }
        function lineEnd () {
          stream.point = point
        }
        function lineEndPolygon () {
          buffer.push('Z')
        }
        return stream
      }
      function d3_geo_pathBufferCircle (radius) {
        return 'm0,' + radius + 'a' + radius + ',' + radius + ' 0 1,1 0,' + -2 * radius + 'a' + radius + ',' + radius + ' 0 1,1 0,' + 2 * radius + 'z'
      }
      var d3_geo_pathCentroid = {
        point: d3_geo_pathCentroidPoint,
        lineStart: d3_geo_pathCentroidLineStart,
        lineEnd: d3_geo_pathCentroidLineEnd,
        polygonStart: function () {
          d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart
        },
        polygonEnd: function () {
          d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint
          d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart
          d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd
        }
      }
      function d3_geo_pathCentroidPoint (x, y) {
        d3_geo_centroidX0 += x
        d3_geo_centroidY0 += y
        ++d3_geo_centroidZ0
      }
      function d3_geo_pathCentroidLineStart () {
        var x0, y0
        d3_geo_pathCentroid.point = function (x, y) {
          d3_geo_pathCentroid.point = nextPoint
          d3_geo_pathCentroidPoint(x0 = x, y0 = y)
        }
        function nextPoint (x, y) {
          var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy)
          d3_geo_centroidX1 += z * (x0 + x) / 2
          d3_geo_centroidY1 += z * (y0 + y) / 2
          d3_geo_centroidZ1 += z
          d3_geo_pathCentroidPoint(x0 = x, y0 = y)
        }
      }
      function d3_geo_pathCentroidLineEnd () {
        d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint
      }
      function d3_geo_pathCentroidRingStart () {
        var x00, y00, x0, y0
        d3_geo_pathCentroid.point = function (x, y) {
          d3_geo_pathCentroid.point = nextPoint
          d3_geo_pathCentroidPoint(x00 = x0 = x, y00 = y0 = y)
        }
        function nextPoint (x, y) {
          var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy)
          d3_geo_centroidX1 += z * (x0 + x) / 2
          d3_geo_centroidY1 += z * (y0 + y) / 2
          d3_geo_centroidZ1 += z
          z = y0 * x - x0 * y
          d3_geo_centroidX2 += z * (x0 + x)
          d3_geo_centroidY2 += z * (y0 + y)
          d3_geo_centroidZ2 += z * 3
          d3_geo_pathCentroidPoint(x0 = x, y0 = y)
        }
        d3_geo_pathCentroid.lineEnd = function () {
          nextPoint(x00, y00)
        }
      }
      function d3_geo_pathContext (context) {
        var pointRadius = 4.5
        var stream = {
          point: point,
          lineStart: function () {
            stream.point = pointLineStart
          },
          lineEnd: lineEnd,
          polygonStart: function () {
            stream.lineEnd = lineEndPolygon
          },
          polygonEnd: function () {
            stream.lineEnd = lineEnd
            stream.point = point
          },
          pointRadius: function (_) {
            pointRadius = _
            return stream
          },
          result: d3_noop
        }
        function point (x, y) {
          context.moveTo(x + pointRadius, y)
          context.arc(x, y, pointRadius, 0, τ)
        }
        function pointLineStart (x, y) {
          context.moveTo(x, y)
          stream.point = pointLine
        }
        function pointLine (x, y) {
          context.lineTo(x, y)
        }
        function lineEnd () {
          stream.point = point
        }
        function lineEndPolygon () {
          context.closePath()
        }
        return stream
      }
      function d3_geo_resample (project) {
        var δ2 = 0.5, cosMinDistance = Math.cos(30 * d3_radians), maxDepth = 16
        function resample (stream) {
          return (maxDepth ? resampleRecursive : resampleNone)(stream)
        }
        function resampleNone (stream) {
          return d3_geo_transformPoint(stream, function (x, y) {
            x = project(x, y)
            stream.point(x[0], x[1])
          })
        }
        function resampleRecursive (stream) {
          var λ00, φ00, x00, y00, a00, b00, c00, λ0, x0, y0, a0, b0, c0
          var resample = {
            point: point,
            lineStart: lineStart,
            lineEnd: lineEnd,
            polygonStart: function () {
              stream.polygonStart()
              resample.lineStart = ringStart
            },
            polygonEnd: function () {
              stream.polygonEnd()
              resample.lineStart = lineStart
            }
          }
          function point (x, y) {
            x = project(x, y)
            stream.point(x[0], x[1])
          }
          function lineStart () {
            x0 = NaN
            resample.point = linePoint
            stream.lineStart()
          }
          function linePoint (λ, φ) {
            var c = d3_geo_cartesian([ λ, φ ]), p = project(λ, φ)
            resampleLineTo(x0, y0, λ0, a0, b0, c0, x0 = p[0], y0 = p[1], λ0 = λ, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream)
            stream.point(x0, y0)
          }
          function lineEnd () {
            resample.point = point
            stream.lineEnd()
          }
          function ringStart () {
            lineStart()
            resample.point = ringPoint
            resample.lineEnd = ringEnd
          }
          function ringPoint (λ, φ) {
            linePoint(λ00 = λ, φ00 = φ), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0
            resample.point = linePoint
          }
          function ringEnd () {
            resampleLineTo(x0, y0, λ0, a0, b0, c0, x00, y00, λ00, a00, b00, c00, maxDepth, stream)
            resample.lineEnd = lineEnd
            lineEnd()
          }
          return resample
        }
        function resampleLineTo (x0, y0, λ0, a0, b0, c0, x1, y1, λ1, a1, b1, c1, depth, stream) {
          var dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy
          if (d2 > 4 * δ2 && depth--) {
            var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = Math.sqrt(a * a + b * b + c * c), φ2 = Math.asin(c /= m), λ2 = abs(abs(c) - 1) < ε || abs(λ0 - λ1) < ε ? (λ0 + λ1) / 2 : Math.atan2(b, a), p = project(λ2, φ2), x2 = p[0], y2 = p[1], dx2 = x2 - x0, dy2 = y2 - y0, dz = dy * dx2 - dx * dy2
            if (dz * dz / d2 > δ2 || abs((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {
              resampleLineTo(x0, y0, λ0, a0, b0, c0, x2, y2, λ2, a /= m, b /= m, c, depth, stream)
              stream.point(x2, y2)
              resampleLineTo(x2, y2, λ2, a, b, c, x1, y1, λ1, a1, b1, c1, depth, stream)
            }
          }
        }
        resample.precision = function (_) {
          if (!arguments.length) return Math.sqrt(δ2)
          maxDepth = (δ2 = _ * _) > 0 && 16
          return resample
        }
        return resample
      }
      d3.geo.path = function () {
        var pointRadius = 4.5, projection, context, projectStream, contextStream, cacheStream
        function path (object) {
          if (object) {
            if (typeof pointRadius === 'function') contextStream.pointRadius(+pointRadius.apply(this, arguments))
            if (!cacheStream || !cacheStream.valid) cacheStream = projectStream(contextStream)
            d3.geo.stream(object, cacheStream)
          }
          return contextStream.result()
        }
        path.area = function (object) {
          d3_geo_pathAreaSum = 0
          d3.geo.stream(object, projectStream(d3_geo_pathArea))
          return d3_geo_pathAreaSum
        }
        path.centroid = function (object) {
          d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0
          d3.geo.stream(object, projectStream(d3_geo_pathCentroid))
          return d3_geo_centroidZ2 ? [ d3_geo_centroidX2 / d3_geo_centroidZ2, d3_geo_centroidY2 / d3_geo_centroidZ2 ] : d3_geo_centroidZ1 ? [ d3_geo_centroidX1 / d3_geo_centroidZ1, d3_geo_centroidY1 / d3_geo_centroidZ1 ] : d3_geo_centroidZ0 ? [ d3_geo_centroidX0 / d3_geo_centroidZ0, d3_geo_centroidY0 / d3_geo_centroidZ0 ] : [ NaN, NaN ]
        }
        path.bounds = function (object) {
          d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = Infinity)
          d3.geo.stream(object, projectStream(d3_geo_pathBounds))
          return [ [ d3_geo_pathBoundsX0, d3_geo_pathBoundsY0 ], [ d3_geo_pathBoundsX1, d3_geo_pathBoundsY1 ] ]
        }
        path.projection = function (_) {
          if (!arguments.length) return projection
          projectStream = (projection = _) ? _.stream || d3_geo_pathProjectStream(_) : d3_identity
          return reset()
        }
        path.context = function (_) {
          if (!arguments.length) return context
          contextStream = (context = _) == null ? new d3_geo_pathBuffer() : new d3_geo_pathContext(_)
          if (typeof pointRadius !== 'function') contextStream.pointRadius(pointRadius)
          return reset()
        }
        path.pointRadius = function (_) {
          if (!arguments.length) return pointRadius
          pointRadius = typeof _ === 'function' ? _ : (contextStream.pointRadius(+_), +_)
          return path
        }
        function reset () {
          cacheStream = null
          return path
        }
        return path.projection(d3.geo.albersUsa()).context(null)
      }
      function d3_geo_pathProjectStream (project) {
        var resample = d3_geo_resample(function (x, y) {
          return project([ x * d3_degrees, y * d3_degrees ])
        })
        return function (stream) {
          return d3_geo_projectionRadians(resample(stream))
        }
      }
      d3.geo.transform = function (methods) {
        return {
          stream: function (stream) {
            var transform = new d3_geo_transform(stream)
            for (var k in methods) transform[k] = methods[k]
            return transform
          }
        }
      }
      function d3_geo_transform (stream) {
        this.stream = stream
      }
      d3_geo_transform.prototype = {
        point: function (x, y) {
          this.stream.point(x, y)
        },
        sphere: function () {
          this.stream.sphere()
        },
        lineStart: function () {
          this.stream.lineStart()
        },
        lineEnd: function () {
          this.stream.lineEnd()
        },
        polygonStart: function () {
          this.stream.polygonStart()
        },
        polygonEnd: function () {
          this.stream.polygonEnd()
        }
      }
      function d3_geo_transformPoint (stream, point) {
        return {
          point: point,
          sphere: function () {
            stream.sphere()
          },
          lineStart: function () {
            stream.lineStart()
          },
          lineEnd: function () {
            stream.lineEnd()
          },
          polygonStart: function () {
            stream.polygonStart()
          },
          polygonEnd: function () {
            stream.polygonEnd()
          }
        }
      }
      d3.geo.projection = d3_geo_projection
      d3.geo.projectionMutator = d3_geo_projectionMutator
      function d3_geo_projection (project) {
        return d3_geo_projectionMutator(function () {
          return project
        })()
      }
      function d3_geo_projectionMutator (projectAt) {
        var project, rotate, projectRotate, projectResample = d3_geo_resample(function (x, y) {
            x = project(x, y)
            return [ x[0] * k + δx, δy - x[1] * k ]
          }), k = 150, x = 480, y = 250, λ = 0, φ = 0, δλ = 0, δφ = 0, δγ = 0, δx, δy, preclip = d3_geo_clipAntimeridian, postclip = d3_identity, clipAngle = null, clipExtent = null, stream
        function projection (point) {
          point = projectRotate(point[0] * d3_radians, point[1] * d3_radians)
          return [ point[0] * k + δx, δy - point[1] * k ]
        }
        function invert (point) {
          point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k)
          return point && [ point[0] * d3_degrees, point[1] * d3_degrees ]
        }
        projection.stream = function (output) {
          if (stream) stream.valid = false
          stream = d3_geo_projectionRadians(preclip(rotate, projectResample(postclip(output))))
          stream.valid = true
          return stream
        }
        projection.clipAngle = function (_) {
          if (!arguments.length) return clipAngle
          preclip = _ == null ? (clipAngle = _, d3_geo_clipAntimeridian) : d3_geo_clipCircle((clipAngle = +_) * d3_radians)
          return invalidate()
        }
        projection.clipExtent = function (_) {
          if (!arguments.length) return clipExtent
          clipExtent = _
          postclip = _ ? d3_geo_clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : d3_identity
          return invalidate()
        }
        projection.scale = function (_) {
          if (!arguments.length) return k
          k = +_
          return reset()
        }
        projection.translate = function (_) {
          if (!arguments.length) return [ x, y ]
          x = +_[0]
          y = +_[1]
          return reset()
        }
        projection.center = function (_) {
          if (!arguments.length) return [ λ * d3_degrees, φ * d3_degrees ]
          λ = _[0] % 360 * d3_radians
          φ = _[1] % 360 * d3_radians
          return reset()
        }
        projection.rotate = function (_) {
          if (!arguments.length) return [ δλ * d3_degrees, δφ * d3_degrees, δγ * d3_degrees ]
          δλ = _[0] % 360 * d3_radians
          δφ = _[1] % 360 * d3_radians
          δγ = _.length > 2 ? _[2] % 360 * d3_radians : 0
          return reset()
        }
        d3.rebind(projection, projectResample, 'precision')
        function reset () {
          projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ, δφ, δγ), project)
          var center = project(λ, φ)
          δx = x - center[0] * k
          δy = y + center[1] * k
          return invalidate()
        }
        function invalidate () {
          if (stream) stream.valid = false, stream = null
          return projection
        }
        return function () {
          project = projectAt.apply(this, arguments)
          projection.invert = project.invert && invert
          return reset()
        }
      }
      function d3_geo_projectionRadians (stream) {
        return d3_geo_transformPoint(stream, function (x, y) {
          stream.point(x * d3_radians, y * d3_radians)
        })
      }
      function d3_geo_equirectangular (λ, φ) {
        return [ λ, φ ]
      }
      (d3.geo.equirectangular = function () {
        return d3_geo_projection(d3_geo_equirectangular)
      }).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular
      d3.geo.rotation = function (rotate) {
        rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians, rotate[1] * d3_radians, rotate.length > 2 ? rotate[2] * d3_radians : 0)
        function forward (coordinates) {
          coordinates = rotate(coordinates[0] * d3_radians, coordinates[1] * d3_radians)
          return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates
        }
        forward.invert = function (coordinates) {
          coordinates = rotate.invert(coordinates[0] * d3_radians, coordinates[1] * d3_radians)
          return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates
        }
        return forward
      }
      function d3_geo_identityRotation (λ, φ) {
        return [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ]
      }
      d3_geo_identityRotation.invert = d3_geo_equirectangular
      function d3_geo_rotation (δλ, δφ, δγ) {
        return δλ ? δφ || δγ ? d3_geo_compose(d3_geo_rotationλ(δλ), d3_geo_rotationφγ(δφ, δγ)) : d3_geo_rotationλ(δλ) : δφ || δγ ? d3_geo_rotationφγ(δφ, δγ) : d3_geo_identityRotation
      }
      function d3_geo_forwardRotationλ (δλ) {
        return function (λ, φ) {
          return λ += δλ, [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ]
        }
      }
      function d3_geo_rotationλ (δλ) {
        var rotation = d3_geo_forwardRotationλ(δλ)
        rotation.invert = d3_geo_forwardRotationλ(-δλ)
        return rotation
      }
      function d3_geo_rotationφγ (δφ, δγ) {
        var cosδφ = Math.cos(δφ), sinδφ = Math.sin(δφ), cosδγ = Math.cos(δγ), sinδγ = Math.sin(δγ)
        function rotation (λ, φ) {
          var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδφ + x * sinδφ
          return [ Math.atan2(y * cosδγ - k * sinδγ, x * cosδφ - z * sinδφ), d3_asin(k * cosδγ + y * sinδγ) ]
        }
        rotation.invert = function (λ, φ) {
          var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδγ - y * sinδγ
          return [ Math.atan2(y * cosδγ + z * sinδγ, x * cosδφ + k * sinδφ), d3_asin(k * cosδφ - x * sinδφ) ]
        }
        return rotation
      }
      d3.geo.circle = function () {
        var origin = [ 0, 0 ], angle, precision = 6, interpolate
        function circle () {
          var center = typeof origin === 'function' ? origin.apply(this, arguments) : origin, rotate = d3_geo_rotation(-center[0] * d3_radians, -center[1] * d3_radians, 0).invert, ring = []
          interpolate(null, null, 1, {
            point: function (x, y) {
              ring.push(x = rotate(x, y))
              x[0] *= d3_degrees, x[1] *= d3_degrees
            }
          })
          return {
            type: 'Polygon',
            coordinates: [ ring ]
          }
        }
        circle.origin = function (x) {
          if (!arguments.length) return origin
          origin = x
          return circle
        }
        circle.angle = function (x) {
          if (!arguments.length) return angle
          interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians, precision * d3_radians)
          return circle
        }
        circle.precision = function (_) {
          if (!arguments.length) return precision
          interpolate = d3_geo_circleInterpolate(angle * d3_radians, (precision = +_) * d3_radians)
          return circle
        }
        return circle.angle(90)
      }
      function d3_geo_circleInterpolate (radius, precision) {
        var cr = Math.cos(radius), sr = Math.sin(radius)
        return function (from, to, direction, listener) {
          var step = direction * precision
          if (from != null) {
            from = d3_geo_circleAngle(cr, from)
            to = d3_geo_circleAngle(cr, to)
            if (direction > 0 ? from < to : from > to) from += direction * τ
          } else {
            from = radius + direction * τ
            to = radius - 0.5 * step
          }
          for (var point, t = from; direction > 0 ? t > to : t < to; t -= step) {
            listener.point((point = d3_geo_spherical([ cr, -sr * Math.cos(t), -sr * Math.sin(t) ]))[0], point[1])
          }
        }
      }
      function d3_geo_circleAngle (cr, point) {
        var a = d3_geo_cartesian(point)
        a[0] -= cr
        d3_geo_cartesianNormalize(a)
        var angle = d3_acos(-a[1])
        return ((-a[2] < 0 ? -angle : angle) + 2 * Math.PI - ε) % (2 * Math.PI)
      }
      d3.geo.distance = function (a, b) {
        var Δλ = (b[0] - a[0]) * d3_radians, φ0 = a[1] * d3_radians, φ1 = b[1] * d3_radians, sinΔλ = Math.sin(Δλ), cosΔλ = Math.cos(Δλ), sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), t
        return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ)
      }
      d3.geo.graticule = function () {
        var x1, x0, X1, X0, y1, y0, Y1, Y0, dx = 10, dy = dx, DX = 90, DY = 360, x, y, X, Y, precision = 2.5
        function graticule () {
          return {
            type: 'MultiLineString',
            coordinates: lines()
          }
        }
        function lines () {
          return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function (x) {
            return abs(x % DX) > ε
          }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function (y) {
            return abs(y % DY) > ε
          }).map(y))
        }
        graticule.lines = function () {
          return lines().map(function (coordinates) {
            return {
              type: 'LineString',
              coordinates: coordinates
            }
          })
        }
        graticule.outline = function () {
          return {
            type: 'Polygon',
            coordinates: [ X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1)) ]
          }
        }
        graticule.extent = function (_) {
          if (!arguments.length) return graticule.minorExtent()
          return graticule.majorExtent(_).minorExtent(_)
        }
        graticule.majorExtent = function (_) {
          if (!arguments.length) return [ [ X0, Y0 ], [ X1, Y1 ] ]
          X0 = +_[0][0], X1 = +_[1][0]
          Y0 = +_[0][1], Y1 = +_[1][1]
          if (X0 > X1) _ = X0, X0 = X1, X1 = _
          if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _
          return graticule.precision(precision)
        }
        graticule.minorExtent = function (_) {
          if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ]
          x0 = +_[0][0], x1 = +_[1][0]
          y0 = +_[0][1], y1 = +_[1][1]
          if (x0 > x1) _ = x0, x0 = x1, x1 = _
          if (y0 > y1) _ = y0, y0 = y1, y1 = _
          return graticule.precision(precision)
        }
        graticule.step = function (_) {
          if (!arguments.length) return graticule.minorStep()
          return graticule.majorStep(_).minorStep(_)
        }
        graticule.majorStep = function (_) {
          if (!arguments.length) return [ DX, DY ]
          DX = +_[0], DY = +_[1]
          return graticule
        }
        graticule.minorStep = function (_) {
          if (!arguments.length) return [ dx, dy ]
          dx = +_[0], dy = +_[1]
          return graticule
        }
        graticule.precision = function (_) {
          if (!arguments.length) return precision
          precision = +_
          x = d3_geo_graticuleX(y0, y1, 90)
          y = d3_geo_graticuleY(x0, x1, precision)
          X = d3_geo_graticuleX(Y0, Y1, 90)
          Y = d3_geo_graticuleY(X0, X1, precision)
          return graticule
        }
        return graticule.majorExtent([ [ -180, -90 + ε ], [ 180, 90 - ε ] ]).minorExtent([ [ -180, -80 - ε ], [ 180, 80 + ε ] ])
      }
      function d3_geo_graticuleX (y0, y1, dy) {
        var y = d3.range(y0, y1 - ε, dy).concat(y1)
        return function (x) {
          return y.map(function (y) {
            return [ x, y ]
          })
        }
      }
      function d3_geo_graticuleY (x0, x1, dx) {
        var x = d3.range(x0, x1 - ε, dx).concat(x1)
        return function (y) {
          return x.map(function (x) {
            return [ x, y ]
          })
        }
      }
      function d3_source (d) {
        return d.source
      }
      function d3_target (d) {
        return d.target
      }
      d3.geo.greatArc = function () {
        var source = d3_source, source_, target = d3_target, target_
        function greatArc () {
          return {
            type: 'LineString',
            coordinates: [ source_ || source.apply(this, arguments), target_ || target.apply(this, arguments) ]
          }
        }
        greatArc.distance = function () {
          return d3.geo.distance(source_ || source.apply(this, arguments), target_ || target.apply(this, arguments))
        }
        greatArc.source = function (_) {
          if (!arguments.length) return source
          source = _, source_ = typeof _ === 'function' ? null : _
          return greatArc
        }
        greatArc.target = function (_) {
          if (!arguments.length) return target
          target = _, target_ = typeof _ === 'function' ? null : _
          return greatArc
        }
        greatArc.precision = function () {
          return arguments.length ? greatArc : 0
        }
        return greatArc
      }
      d3.geo.interpolate = function (source, target) {
        return d3_geo_interpolate(source[0] * d3_radians, source[1] * d3_radians, target[0] * d3_radians, target[1] * d3_radians)
      }
      function d3_geo_interpolate (x0, y0, x1, y1) {
        var cy0 = Math.cos(y0), sy0 = Math.sin(y0), cy1 = Math.cos(y1), sy1 = Math.sin(y1), kx0 = cy0 * Math.cos(x0), ky0 = cy0 * Math.sin(x0), kx1 = cy1 * Math.cos(x1), ky1 = cy1 * Math.sin(x1), d = 2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))), k = 1 / Math.sin(d)
        var interpolate = d ? function (t) {
          var B = Math.sin(t *= d) * k, A = Math.sin(d - t) * k, x = A * kx0 + B * kx1, y = A * ky0 + B * ky1, z = A * sy0 + B * sy1
          return [ Math.atan2(y, x) * d3_degrees, Math.atan2(z, Math.sqrt(x * x + y * y)) * d3_degrees ]
        } : function () {
          return [ x0 * d3_degrees, y0 * d3_degrees ]
        }
        interpolate.distance = d
        return interpolate
      }
      d3.geo.length = function (object) {
        d3_geo_lengthSum = 0
        d3.geo.stream(object, d3_geo_length)
        return d3_geo_lengthSum
      }
      var d3_geo_lengthSum
      var d3_geo_length = {
        sphere: d3_noop,
        point: d3_noop,
        lineStart: d3_geo_lengthLineStart,
        lineEnd: d3_noop,
        polygonStart: d3_noop,
        polygonEnd: d3_noop
      }
      function d3_geo_lengthLineStart () {
        var λ0, sinφ0, cosφ0
        d3_geo_length.point = function (λ, φ) {
          λ0 = λ * d3_radians, sinφ0 = Math.sin(φ *= d3_radians), cosφ0 = Math.cos(φ)
          d3_geo_length.point = nextPoint
        }
        d3_geo_length.lineEnd = function () {
          d3_geo_length.point = d3_geo_length.lineEnd = d3_noop
        }
        function nextPoint (λ, φ) {
          var sinφ = Math.sin(φ *= d3_radians), cosφ = Math.cos(φ), t = abs((λ *= d3_radians) - λ0), cosΔλ = Math.cos(t)
          d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ)
          λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ
        }
      }
      function d3_geo_azimuthal (scale, angle) {
        function azimuthal (λ, φ) {
          var cosλ = Math.cos(λ), cosφ = Math.cos(φ), k = scale(cosλ * cosφ)
          return [ k * cosφ * Math.sin(λ), k * Math.sin(φ) ]
        }
        azimuthal.invert = function (x, y) {
          var ρ = Math.sqrt(x * x + y * y), c = angle(ρ), sinc = Math.sin(c), cosc = Math.cos(c)
          return [ Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ) ]
        }
        return azimuthal
      }
      var d3_geo_azimuthalEqualArea = d3_geo_azimuthal(function (cosλcosφ) {
        return Math.sqrt(2 / (1 + cosλcosφ))
      }, function (ρ) {
        return 2 * Math.asin(ρ / 2)
      });
      (d3.geo.azimuthalEqualArea = function () {
        return d3_geo_projection(d3_geo_azimuthalEqualArea)
      }).raw = d3_geo_azimuthalEqualArea
      var d3_geo_azimuthalEquidistant = d3_geo_azimuthal(function (cosλcosφ) {
        var c = Math.acos(cosλcosφ)
        return c && c / Math.sin(c)
      }, d3_identity);
      (d3.geo.azimuthalEquidistant = function () {
        return d3_geo_projection(d3_geo_azimuthalEquidistant)
      }).raw = d3_geo_azimuthalEquidistant
      function d3_geo_conicConformal (φ0, φ1) {
        var cosφ0 = Math.cos(φ0), t = function (φ) {
            return Math.tan(π / 4 + φ / 2)
          }, n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)), F = cosφ0 * Math.pow(t(φ0), n) / n
        if (!n) return d3_geo_mercator
        function forward (λ, φ) {
          if (F > 0) {
            if (φ < -halfπ + ε) φ = -halfπ + ε
          } else {
            if (φ > halfπ - ε) φ = halfπ - ε
          }
          var ρ = F / Math.pow(t(φ), n)
          return [ ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ) ]
        }
        forward.invert = function (x, y) {
          var ρ0_y = F - y, ρ = d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y)
          return [ Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - halfπ ]
        }
        return forward
      }
      (d3.geo.conicConformal = function () {
        return d3_geo_conic(d3_geo_conicConformal)
      }).raw = d3_geo_conicConformal
      function d3_geo_conicEquidistant (φ0, φ1) {
        var cosφ0 = Math.cos(φ0), n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0), G = cosφ0 / n + φ0
        if (abs(n) < ε) return d3_geo_equirectangular
        function forward (λ, φ) {
          var ρ = G - φ
          return [ ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ) ]
        }
        forward.invert = function (x, y) {
          var ρ0_y = G - y
          return [ Math.atan2(x, ρ0_y) / n, G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y) ]
        }
        return forward
      }
      (d3.geo.conicEquidistant = function () {
        return d3_geo_conic(d3_geo_conicEquidistant)
      }).raw = d3_geo_conicEquidistant
      var d3_geo_gnomonic = d3_geo_azimuthal(function (cosλcosφ) {
        return 1 / cosλcosφ
      }, Math.atan);
      (d3.geo.gnomonic = function () {
        return d3_geo_projection(d3_geo_gnomonic)
      }).raw = d3_geo_gnomonic
      function d3_geo_mercator (λ, φ) {
        return [ λ, Math.log(Math.tan(π / 4 + φ / 2)) ]
      }
      d3_geo_mercator.invert = function (x, y) {
        return [ x, 2 * Math.atan(Math.exp(y)) - halfπ ]
      }
      function d3_geo_mercatorProjection (project) {
        var m = d3_geo_projection(project), scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, clipAuto
        m.scale = function () {
          var v = scale.apply(m, arguments)
          return v === m ? clipAuto ? m.clipExtent(null) : m : v
        }
        m.translate = function () {
          var v = translate.apply(m, arguments)
          return v === m ? clipAuto ? m.clipExtent(null) : m : v
        }
        m.clipExtent = function (_) {
          var v = clipExtent.apply(m, arguments)
          if (v === m) {
            if (clipAuto = _ == null) {
              var k = π * scale(), t = translate()
              clipExtent([ [ t[0] - k, t[1] - k ], [ t[0] + k, t[1] + k ] ])
            }
          } else if (clipAuto) {
            v = null
          }
          return v
        }
        return m.clipExtent(null)
      }
      (d3.geo.mercator = function () {
        return d3_geo_mercatorProjection(d3_geo_mercator)
      }).raw = d3_geo_mercator
      var d3_geo_orthographic = d3_geo_azimuthal(function () {
        return 1
      }, Math.asin);
      (d3.geo.orthographic = function () {
        return d3_geo_projection(d3_geo_orthographic)
      }).raw = d3_geo_orthographic
      var d3_geo_stereographic = d3_geo_azimuthal(function (cosλcosφ) {
        return 1 / (1 + cosλcosφ)
      }, function (ρ) {
        return 2 * Math.atan(ρ)
      });
      (d3.geo.stereographic = function () {
        return d3_geo_projection(d3_geo_stereographic)
      }).raw = d3_geo_stereographic
      function d3_geo_transverseMercator (λ, φ) {
        return [ Math.log(Math.tan(π / 4 + φ / 2)), -λ ]
      }
      d3_geo_transverseMercator.invert = function (x, y) {
        return [ -y, 2 * Math.atan(Math.exp(x)) - halfπ ]
      };
      (d3.geo.transverseMercator = function () {
        var projection = d3_geo_mercatorProjection(d3_geo_transverseMercator), center = projection.center, rotate = projection.rotate
        projection.center = function (_) {
          return _ ? center([ -_[1], _[0] ]) : (_ = center(), [ _[1], -_[0] ])
        }
        projection.rotate = function (_) {
          return _ ? rotate([ _[0], _[1], _.length > 2 ? _[2] + 90 : 90 ]) : (_ = rotate(),
      [ _[0], _[1], _[2] - 90 ])
        }
        return rotate([ 0, 0, 90 ])
      }).raw = d3_geo_transverseMercator
      d3.geom = {}
      function d3_geom_pointX (d) {
        return d[0]
      }
      function d3_geom_pointY (d) {
        return d[1]
      }
      d3.geom.hull = function (vertices) {
        var x = d3_geom_pointX, y = d3_geom_pointY
        if (arguments.length) return hull(vertices)
        function hull (data) {
          if (data.length < 3) return []
          var fx = d3_functor(x), fy = d3_functor(y), i, n = data.length, points = [], flippedPoints = []
          for (i = 0; i < n; i++) {
            points.push([ +fx.call(this, data[i], i), +fy.call(this, data[i], i), i ])
          }
          points.sort(d3_geom_hullOrder)
          for (i = 0; i < n; i++) flippedPoints.push([ points[i][0], -points[i][1] ])
          var upper = d3_geom_hullUpper(points), lower = d3_geom_hullUpper(flippedPoints)
          var skipLeft = lower[0] === upper[0], skipRight = lower[lower.length - 1] === upper[upper.length - 1], polygon = []
          for (i = upper.length - 1; i >= 0; --i) polygon.push(data[points[upper[i]][2]])
          for (i = +skipLeft; i < lower.length - skipRight; ++i) polygon.push(data[points[lower[i]][2]])
          return polygon
        }
        hull.x = function (_) {
          return arguments.length ? (x = _, hull) : x
        }
        hull.y = function (_) {
          return arguments.length ? (y = _, hull) : y
        }
        return hull
      }
      function d3_geom_hullUpper (points) {
        var n = points.length, hull = [ 0, 1 ], hs = 2
        for (var i = 2; i < n; i++) {
          while (hs > 1 && d3_cross2d(points[hull[hs - 2]], points[hull[hs - 1]], points[i]) <= 0) --hs
          hull[hs++] = i
        }
        return hull.slice(0, hs)
      }
      function d3_geom_hullOrder (a, b) {
        return a[0] - b[0] || a[1] - b[1]
      }
      d3.geom.polygon = function (coordinates) {
        d3_subclass(coordinates, d3_geom_polygonPrototype)
        return coordinates
      }
      var d3_geom_polygonPrototype = d3.geom.polygon.prototype = []
      d3_geom_polygonPrototype.area = function () {
        var i = -1, n = this.length, a, b = this[n - 1], area = 0
        while (++i < n) {
          a = b
          b = this[i]
          area += a[1] * b[0] - a[0] * b[1]
        }
        return area * 0.5
      }
      d3_geom_polygonPrototype.centroid = function (k) {
        var i = -1, n = this.length, x = 0, y = 0, a, b = this[n - 1], c
        if (!arguments.length) k = -1 / (6 * this.area())
        while (++i < n) {
          a = b
          b = this[i]
          c = a[0] * b[1] - b[0] * a[1]
          x += (a[0] + b[0]) * c
          y += (a[1] + b[1]) * c
        }
        return [ x * k, y * k ]
      }
      d3_geom_polygonPrototype.clip = function (subject) {
        var input, closed = d3_geom_polygonClosed(subject), i = -1, n = this.length - d3_geom_polygonClosed(this), j, m, a = this[n - 1], b, c, d
        while (++i < n) {
          input = subject.slice()
          subject.length = 0
          b = this[i]
          c = input[(m = input.length - closed) - 1]
          j = -1
          while (++j < m) {
            d = input[j]
            if (d3_geom_polygonInside(d, a, b)) {
              if (!d3_geom_polygonInside(c, a, b)) {
                subject.push(d3_geom_polygonIntersect(c, d, a, b))
              }
              subject.push(d)
            } else if (d3_geom_polygonInside(c, a, b)) {
              subject.push(d3_geom_polygonIntersect(c, d, a, b))
            }
            c = d
          }
          if (closed) subject.push(subject[0])
          a = b
        }
        return subject
      }
      function d3_geom_polygonInside (p, a, b) {
        return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0])
      }
      function d3_geom_polygonIntersect (c, d, a, b) {
        var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21)
        return [ x1 + ua * x21, y1 + ua * y21 ]
      }
      function d3_geom_polygonClosed (coordinates) {
        var a = coordinates[0], b = coordinates[coordinates.length - 1]
        return !(a[0] - b[0] || a[1] - b[1])
      }
      var d3_geom_voronoiEdges, d3_geom_voronoiCells, d3_geom_voronoiBeaches, d3_geom_voronoiBeachPool = [], d3_geom_voronoiFirstCircle, d3_geom_voronoiCircles, d3_geom_voronoiCirclePool = []
      function d3_geom_voronoiBeach () {
        d3_geom_voronoiRedBlackNode(this)
        this.edge = this.site = this.circle = null
      }
      function d3_geom_voronoiCreateBeach (site) {
        var beach = d3_geom_voronoiBeachPool.pop() || new d3_geom_voronoiBeach()
        beach.site = site
        return beach
      }
      function d3_geom_voronoiDetachBeach (beach) {
        d3_geom_voronoiDetachCircle(beach)
        d3_geom_voronoiBeaches.remove(beach)
        d3_geom_voronoiBeachPool.push(beach)
        d3_geom_voronoiRedBlackNode(beach)
      }
      function d3_geom_voronoiRemoveBeach (beach) {
        var circle = beach.circle, x = circle.x, y = circle.cy, vertex = {
            x: x,
            y: y
          }, previous = beach.P, next = beach.N, disappearing = [ beach ]
        d3_geom_voronoiDetachBeach(beach)
        var lArc = previous
        while (lArc.circle && abs(x - lArc.circle.x) < ε && abs(y - lArc.circle.cy) < ε) {
          previous = lArc.P
          disappearing.unshift(lArc)
          d3_geom_voronoiDetachBeach(lArc)
          lArc = previous
        }
        disappearing.unshift(lArc)
        d3_geom_voronoiDetachCircle(lArc)
        var rArc = next
        while (rArc.circle && abs(x - rArc.circle.x) < ε && abs(y - rArc.circle.cy) < ε) {
          next = rArc.N
          disappearing.push(rArc)
          d3_geom_voronoiDetachBeach(rArc)
          rArc = next
        }
        disappearing.push(rArc)
        d3_geom_voronoiDetachCircle(rArc)
        var nArcs = disappearing.length, iArc
        for (iArc = 1; iArc < nArcs; ++iArc) {
          rArc = disappearing[iArc]
          lArc = disappearing[iArc - 1]
          d3_geom_voronoiSetEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex)
        }
        lArc = disappearing[0]
        rArc = disappearing[nArcs - 1]
        rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, rArc.site, null, vertex)
        d3_geom_voronoiAttachCircle(lArc)
        d3_geom_voronoiAttachCircle(rArc)
      }
      function d3_geom_voronoiAddBeach (site) {
        var x = site.x, directrix = site.y, lArc, rArc, dxl, dxr, node = d3_geom_voronoiBeaches._
        while (node) {
          dxl = d3_geom_voronoiLeftBreakPoint(node, directrix) - x
          if (dxl > ε) node = node.L; else {
            dxr = x - d3_geom_voronoiRightBreakPoint(node, directrix)
            if (dxr > ε) {
              if (!node.R) {
                lArc = node
                break
              }
              node = node.R
            } else {
              if (dxl > -ε) {
                lArc = node.P
                rArc = node
              } else if (dxr > -ε) {
                lArc = node
                rArc = node.N
              } else {
                lArc = rArc = node
              }
              break
            }
          }
        }
        var newArc = d3_geom_voronoiCreateBeach(site)
        d3_geom_voronoiBeaches.insert(lArc, newArc)
        if (!lArc && !rArc) return
        if (lArc === rArc) {
          d3_geom_voronoiDetachCircle(lArc)
          rArc = d3_geom_voronoiCreateBeach(lArc.site)
          d3_geom_voronoiBeaches.insert(newArc, rArc)
          newArc.edge = rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site)
          d3_geom_voronoiAttachCircle(lArc)
          d3_geom_voronoiAttachCircle(rArc)
          return
        }
        if (!rArc) {
          newArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site)
          return
        }
        d3_geom_voronoiDetachCircle(lArc)
        d3_geom_voronoiDetachCircle(rArc)
        var lSite = lArc.site, ax = lSite.x, ay = lSite.y, bx = site.x - ax, by = site.y - ay, rSite = rArc.site, cx = rSite.x - ax, cy = rSite.y - ay, d = 2 * (bx * cy - by * cx), hb = bx * bx + by * by, hc = cx * cx + cy * cy, vertex = {
            x: (cy * hb - by * hc) / d + ax,
            y: (bx * hc - cx * hb) / d + ay
          }
        d3_geom_voronoiSetEdgeEnd(rArc.edge, lSite, rSite, vertex)
        newArc.edge = d3_geom_voronoiCreateEdge(lSite, site, null, vertex)
        rArc.edge = d3_geom_voronoiCreateEdge(site, rSite, null, vertex)
        d3_geom_voronoiAttachCircle(lArc)
        d3_geom_voronoiAttachCircle(rArc)
      }
      function d3_geom_voronoiLeftBreakPoint (arc, directrix) {
        var site = arc.site, rfocx = site.x, rfocy = site.y, pby2 = rfocy - directrix
        if (!pby2) return rfocx
        var lArc = arc.P
        if (!lArc) return -Infinity
        site = lArc.site
        var lfocx = site.x, lfocy = site.y, plby2 = lfocy - directrix
        if (!plby2) return lfocx
        var hl = lfocx - rfocx, aby2 = 1 / pby2 - 1 / plby2, b = hl / plby2
        if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx
        return (rfocx + lfocx) / 2
      }
      function d3_geom_voronoiRightBreakPoint (arc, directrix) {
        var rArc = arc.N
        if (rArc) return d3_geom_voronoiLeftBreakPoint(rArc, directrix)
        var site = arc.site
        return site.y === directrix ? site.x : Infinity
      }
      function d3_geom_voronoiCell (site) {
        this.site = site
        this.edges = []
      }
      d3_geom_voronoiCell.prototype.prepare = function () {
        var halfEdges = this.edges, iHalfEdge = halfEdges.length, edge
        while (iHalfEdge--) {
          edge = halfEdges[iHalfEdge].edge
          if (!edge.b || !edge.a) halfEdges.splice(iHalfEdge, 1)
        }
        halfEdges.sort(d3_geom_voronoiHalfEdgeOrder)
        return halfEdges.length
      }
      function d3_geom_voronoiCloseCells (extent) {
        var x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], x2, y2, x3, y3, cells = d3_geom_voronoiCells, iCell = cells.length, cell, iHalfEdge, halfEdges, nHalfEdges, start, end
        while (iCell--) {
          cell = cells[iCell]
          if (!cell || !cell.prepare()) continue
          halfEdges = cell.edges
          nHalfEdges = halfEdges.length
          iHalfEdge = 0
          while (iHalfEdge < nHalfEdges) {
            end = halfEdges[iHalfEdge].end(), x3 = end.x, y3 = end.y
            start = halfEdges[++iHalfEdge % nHalfEdges].start(), x2 = start.x, y2 = start.y
            if (abs(x3 - x2) > ε || abs(y3 - y2) > ε) {
              halfEdges.splice(iHalfEdge, 0, new d3_geom_voronoiHalfEdge(d3_geom_voronoiCreateBorderEdge(cell.site, end, abs(x3 - x0) < ε && y1 - y3 > ε ? {
                x: x0,
                y: abs(x2 - x0) < ε ? y2 : y1
              } : abs(y3 - y1) < ε && x1 - x3 > ε ? {
                x: abs(y2 - y1) < ε ? x2 : x1,
                y: y1
              } : abs(x3 - x1) < ε && y3 - y0 > ε ? {
                x: x1,
                y: abs(x2 - x1) < ε ? y2 : y0
              } : abs(y3 - y0) < ε && x3 - x0 > ε ? {
                x: abs(y2 - y0) < ε ? x2 : x0,
                y: y0
              } : null), cell.site, null))
              ++nHalfEdges
            }
          }
        }
      }
      function d3_geom_voronoiHalfEdgeOrder (a, b) {
        return b.angle - a.angle
      }
      function d3_geom_voronoiCircle () {
        d3_geom_voronoiRedBlackNode(this)
        this.x = this.y = this.arc = this.site = this.cy = null
      }
      function d3_geom_voronoiAttachCircle (arc) {
        var lArc = arc.P, rArc = arc.N
        if (!lArc || !rArc) return
        var lSite = lArc.site, cSite = arc.site, rSite = rArc.site
        if (lSite === rSite) return
        var bx = cSite.x, by = cSite.y, ax = lSite.x - bx, ay = lSite.y - by, cx = rSite.x - bx, cy = rSite.y - by
        var d = 2 * (ax * cy - ay * cx)
        if (d >= -ε2) return
        var ha = ax * ax + ay * ay, hc = cx * cx + cy * cy, x = (cy * ha - ay * hc) / d, y = (ax * hc - cx * ha) / d, cy = y + by
        var circle = d3_geom_voronoiCirclePool.pop() || new d3_geom_voronoiCircle()
        circle.arc = arc
        circle.site = cSite
        circle.x = x + bx
        circle.y = cy + Math.sqrt(x * x + y * y)
        circle.cy = cy
        arc.circle = circle
        var before = null, node = d3_geom_voronoiCircles._
        while (node) {
          if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {
            if (node.L) node = node.L; else {
              before = node.P
              break
            }
          } else {
            if (node.R) node = node.R; else {
              before = node
              break
            }
          }
        }
        d3_geom_voronoiCircles.insert(before, circle)
        if (!before) d3_geom_voronoiFirstCircle = circle
      }
      function d3_geom_voronoiDetachCircle (arc) {
        var circle = arc.circle
        if (circle) {
          if (!circle.P) d3_geom_voronoiFirstCircle = circle.N
          d3_geom_voronoiCircles.remove(circle)
          d3_geom_voronoiCirclePool.push(circle)
          d3_geom_voronoiRedBlackNode(circle)
          arc.circle = null
        }
      }
      function d3_geom_voronoiClipEdges (extent) {
        var edges = d3_geom_voronoiEdges, clip = d3_geom_clipLine(extent[0][0], extent[0][1], extent[1][0], extent[1][1]), i = edges.length, e
        while (i--) {
          e = edges[i]
          if (!d3_geom_voronoiConnectEdge(e, extent) || !clip(e) || abs(e.a.x - e.b.x) < ε && abs(e.a.y - e.b.y) < ε) {
            e.a = e.b = null
            edges.splice(i, 1)
          }
        }
      }
      function d3_geom_voronoiConnectEdge (edge, extent) {
        var vb = edge.b
        if (vb) return true
        var va = edge.a, x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], lSite = edge.l, rSite = edge.r, lx = lSite.x, ly = lSite.y, rx = rSite.x, ry = rSite.y, fx = (lx + rx) / 2, fy = (ly + ry) / 2, fm, fb
        if (ry === ly) {
          if (fx < x0 || fx >= x1) return
          if (lx > rx) {
            if (!va) {
              va = {
                x: fx,
                y: y0
              }
            } else if (va.y >= y1) return
            vb = {
              x: fx,
              y: y1
            }
          } else {
            if (!va) {
              va = {
                x: fx,
                y: y1
              }
            } else if (va.y < y0) return
            vb = {
              x: fx,
              y: y0
            }
          }
        } else {
          fm = (lx - rx) / (ry - ly)
          fb = fy - fm * fx
          if (fm < -1 || fm > 1) {
            if (lx > rx) {
              if (!va) {
                va = {
                  x: (y0 - fb) / fm,
                  y: y0
                }
              } else if (va.y >= y1) return
              vb = {
                x: (y1 - fb) / fm,
                y: y1
              }
            } else {
              if (!va) {
                va = {
                  x: (y1 - fb) / fm,
                  y: y1
                }
              } else if (va.y < y0) return
              vb = {
                x: (y0 - fb) / fm,
                y: y0
              }
            }
          } else {
            if (ly < ry) {
              if (!va) {
                va = {
                  x: x0,
                  y: fm * x0 + fb
                }
              } else if (va.x >= x1) return
              vb = {
                x: x1,
                y: fm * x1 + fb
              }
            } else {
              if (!va) {
                va = {
                  x: x1,
                  y: fm * x1 + fb
                }
              } else if (va.x < x0) return
              vb = {
                x: x0,
                y: fm * x0 + fb
              }
            }
          }
        }
        edge.a = va
        edge.b = vb
        return true
      }
      function d3_geom_voronoiEdge (lSite, rSite) {
        this.l = lSite
        this.r = rSite
        this.a = this.b = null
      }
      function d3_geom_voronoiCreateEdge (lSite, rSite, va, vb) {
        var edge = new d3_geom_voronoiEdge(lSite, rSite)
        d3_geom_voronoiEdges.push(edge)
        if (va) d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, va)
        if (vb) d3_geom_voronoiSetEdgeEnd(edge, rSite, lSite, vb)
        d3_geom_voronoiCells[lSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, lSite, rSite))
        d3_geom_voronoiCells[rSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, rSite, lSite))
        return edge
      }
      function d3_geom_voronoiCreateBorderEdge (lSite, va, vb) {
        var edge = new d3_geom_voronoiEdge(lSite, null)
        edge.a = va
        edge.b = vb
        d3_geom_voronoiEdges.push(edge)
        return edge
      }
      function d3_geom_voronoiSetEdgeEnd (edge, lSite, rSite, vertex) {
        if (!edge.a && !edge.b) {
          edge.a = vertex
          edge.l = lSite
          edge.r = rSite
        } else if (edge.l === rSite) {
          edge.b = vertex
        } else {
          edge.a = vertex
        }
      }
      function d3_geom_voronoiHalfEdge (edge, lSite, rSite) {
        var va = edge.a, vb = edge.b
        this.edge = edge
        this.site = lSite
        this.angle = rSite ? Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x) : edge.l === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y)
      }
      d3_geom_voronoiHalfEdge.prototype = {
        start: function () {
          return this.edge.l === this.site ? this.edge.a : this.edge.b
        },
        end: function () {
          return this.edge.l === this.site ? this.edge.b : this.edge.a
        }
      }
      function d3_geom_voronoiRedBlackTree () {
        this._ = null
      }
      function d3_geom_voronoiRedBlackNode (node) {
        node.U = node.C = node.L = node.R = node.P = node.N = null
      }
      d3_geom_voronoiRedBlackTree.prototype = {
        insert: function (after, node) {
          var parent, grandpa, uncle
          if (after) {
            node.P = after
            node.N = after.N
            if (after.N) after.N.P = node
            after.N = node
            if (after.R) {
              after = after.R
              while (after.L) after = after.L
              after.L = node
            } else {
              after.R = node
            }
            parent = after
          } else if (this._) {
            after = d3_geom_voronoiRedBlackFirst(this._)
            node.P = null
            node.N = after
            after.P = after.L = node
            parent = after
          } else {
            node.P = node.N = null
            this._ = node
            parent = null
          }
          node.L = node.R = null
          node.U = parent
          node.C = true
          after = node
          while (parent && parent.C) {
            grandpa = parent.U
            if (parent === grandpa.L) {
              uncle = grandpa.R
              if (uncle && uncle.C) {
                parent.C = uncle.C = false
                grandpa.C = true
                after = grandpa
              } else {
                if (after === parent.R) {
                  d3_geom_voronoiRedBlackRotateLeft(this, parent)
                  after = parent
                  parent = after.U
                }
                parent.C = false
                grandpa.C = true
                d3_geom_voronoiRedBlackRotateRight(this, grandpa)
              }
            } else {
              uncle = grandpa.L
              if (uncle && uncle.C) {
                parent.C = uncle.C = false
                grandpa.C = true
                after = grandpa
              } else {
                if (after === parent.L) {
                  d3_geom_voronoiRedBlackRotateRight(this, parent)
                  after = parent
                  parent = after.U
                }
                parent.C = false
                grandpa.C = true
                d3_geom_voronoiRedBlackRotateLeft(this, grandpa)
              }
            }
            parent = after.U
          }
          this._.C = false
        },
        remove: function (node) {
          if (node.N) node.N.P = node.P
          if (node.P) node.P.N = node.N
          node.N = node.P = null
          var parent = node.U, sibling, left = node.L, right = node.R, next, red
          if (!left) next = right; else if (!right) next = left; else next = d3_geom_voronoiRedBlackFirst(right)
          if (parent) {
            if (parent.L === node) parent.L = next; else parent.R = next
          } else {
            this._ = next
          }
          if (left && right) {
            red = next.C
            next.C = node.C
            next.L = left
            left.U = next
            if (next !== right) {
              parent = next.U
              next.U = node.U
              node = next.R
              parent.L = node
              next.R = right
              right.U = next
            } else {
              next.U = parent
              parent = next
              node = next.R
            }
          } else {
            red = node.C
            node = next
          }
          if (node) node.U = parent
          if (red) return
          if (node && node.C) {
            node.C = false
            return
          }
          do {
            if (node === this._) break
            if (node === parent.L) {
              sibling = parent.R
              if (sibling.C) {
                sibling.C = false
                parent.C = true
                d3_geom_voronoiRedBlackRotateLeft(this, parent)
                sibling = parent.R
              }
              if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
                if (!sibling.R || !sibling.R.C) {
                  sibling.L.C = false
                  sibling.C = true
                  d3_geom_voronoiRedBlackRotateRight(this, sibling)
                  sibling = parent.R
                }
                sibling.C = parent.C
                parent.C = sibling.R.C = false
                d3_geom_voronoiRedBlackRotateLeft(this, parent)
                node = this._
                break
              }
            } else {
              sibling = parent.L
              if (sibling.C) {
                sibling.C = false
                parent.C = true
                d3_geom_voronoiRedBlackRotateRight(this, parent)
                sibling = parent.L
              }
              if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
                if (!sibling.L || !sibling.L.C) {
                  sibling.R.C = false
                  sibling.C = true
                  d3_geom_voronoiRedBlackRotateLeft(this, sibling)
                  sibling = parent.L
                }
                sibling.C = parent.C
                parent.C = sibling.L.C = false
                d3_geom_voronoiRedBlackRotateRight(this, parent)
                node = this._
                break
              }
            }
            sibling.C = true
            node = parent
            parent = parent.U
          } while (!node.C)
          if (node) node.C = false
        }
      }
      function d3_geom_voronoiRedBlackRotateLeft (tree, node) {
        var p = node, q = node.R, parent = p.U
        if (parent) {
          if (parent.L === p) parent.L = q; else parent.R = q
        } else {
          tree._ = q
        }
        q.U = parent
        p.U = q
        p.R = q.L
        if (p.R) p.R.U = p
        q.L = p
      }
      function d3_geom_voronoiRedBlackRotateRight (tree, node) {
        var p = node, q = node.L, parent = p.U
        if (parent) {
          if (parent.L === p) parent.L = q; else parent.R = q
        } else {
          tree._ = q
        }
        q.U = parent
        p.U = q
        p.L = q.R
        if (p.L) p.L.U = p
        q.R = p
      }
      function d3_geom_voronoiRedBlackFirst (node) {
        while (node.L) node = node.L
        return node
      }
      function d3_geom_voronoi (sites, bbox) {
        var site = sites.sort(d3_geom_voronoiVertexOrder).pop(), x0, y0, circle
        d3_geom_voronoiEdges = []
        d3_geom_voronoiCells = new Array(sites.length)
        d3_geom_voronoiBeaches = new d3_geom_voronoiRedBlackTree()
        d3_geom_voronoiCircles = new d3_geom_voronoiRedBlackTree()
        while (true) {
          circle = d3_geom_voronoiFirstCircle
          if (site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)) {
            if (site.x !== x0 || site.y !== y0) {
              d3_geom_voronoiCells[site.i] = new d3_geom_voronoiCell(site)
              d3_geom_voronoiAddBeach(site)
              x0 = site.x, y0 = site.y
            }
            site = sites.pop()
          } else if (circle) {
            d3_geom_voronoiRemoveBeach(circle.arc)
          } else {
            break
          }
        }
        if (bbox) d3_geom_voronoiClipEdges(bbox), d3_geom_voronoiCloseCells(bbox)
        var diagram = {
          cells: d3_geom_voronoiCells,
          edges: d3_geom_voronoiEdges
        }
        d3_geom_voronoiBeaches = d3_geom_voronoiCircles = d3_geom_voronoiEdges = d3_geom_voronoiCells = null
        return diagram
      }
      function d3_geom_voronoiVertexOrder (a, b) {
        return b.y - a.y || b.x - a.x
      }
      d3.geom.voronoi = function (points) {
        var x = d3_geom_pointX, y = d3_geom_pointY, fx = x, fy = y, clipExtent = d3_geom_voronoiClipExtent
        if (points) return voronoi(points)
        function voronoi (data) {
          var polygons = new Array(data.length), x0 = clipExtent[0][0], y0 = clipExtent[0][1], x1 = clipExtent[1][0], y1 = clipExtent[1][1]
          d3_geom_voronoi(sites(data), clipExtent).cells.forEach(function (cell, i) {
            var edges = cell.edges, site = cell.site, polygon = polygons[i] = edges.length ? edges.map(function (e) {
                var s = e.start()
                return [ s.x, s.y ]
              }) : site.x >= x0 && site.x <= x1 && site.y >= y0 && site.y <= y1 ? [ [ x0, y1 ], [ x1, y1 ], [ x1, y0 ], [ x0, y0 ] ] : []
            polygon.point = data[i]
          })
          return polygons
        }
        function sites (data) {
          return data.map(function (d, i) {
            return {
              x: Math.round(fx(d, i) / ε) * ε,
              y: Math.round(fy(d, i) / ε) * ε,
              i: i
            }
          })
        }
        voronoi.links = function (data) {
          return d3_geom_voronoi(sites(data)).edges.filter(function (edge) {
            return edge.l && edge.r
          }).map(function (edge) {
            return {
              source: data[edge.l.i],
              target: data[edge.r.i]
            }
          })
        }
        voronoi.triangles = function (data) {
          var triangles = []
          d3_geom_voronoi(sites(data)).cells.forEach(function (cell, i) {
            var site = cell.site, edges = cell.edges.sort(d3_geom_voronoiHalfEdgeOrder), j = -1, m = edges.length, e0, s0, e1 = edges[m - 1].edge, s1 = e1.l === site ? e1.r : e1.l
            while (++j < m) {
              e0 = e1
              s0 = s1
              e1 = edges[j].edge
              s1 = e1.l === site ? e1.r : e1.l
              if (i < s0.i && i < s1.i && d3_geom_voronoiTriangleArea(site, s0, s1) < 0) {
                triangles.push([ data[i], data[s0.i], data[s1.i] ])
              }
            }
          })
          return triangles
        }
        voronoi.x = function (_) {
          return arguments.length ? (fx = d3_functor(x = _), voronoi) : x
        }
        voronoi.y = function (_) {
          return arguments.length ? (fy = d3_functor(y = _), voronoi) : y
        }
        voronoi.clipExtent = function (_) {
          if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent
          clipExtent = _ == null ? d3_geom_voronoiClipExtent : _
          return voronoi
        }
        voronoi.size = function (_) {
          if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent && clipExtent[1]
          return voronoi.clipExtent(_ && [ [ 0, 0 ], _ ])
        }
        return voronoi
      }
      var d3_geom_voronoiClipExtent = [ [ -1e6, -1e6 ], [ 1e6, 1e6 ] ]
      function d3_geom_voronoiTriangleArea (a, b, c) {
        return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y)
      }
      d3.geom.delaunay = function (vertices) {
        return d3.geom.voronoi().triangles(vertices)
      }
      d3.geom.quadtree = function (points, x1, y1, x2, y2) {
        var x = d3_geom_pointX, y = d3_geom_pointY, compat
        if (compat = arguments.length) {
          x = d3_geom_quadtreeCompatX
          y = d3_geom_quadtreeCompatY
          if (compat === 3) {
            y2 = y1
            x2 = x1
            y1 = x1 = 0
          }
          return quadtree(points)
        }
        function quadtree (data) {
          var d, fx = d3_functor(x), fy = d3_functor(y), xs, ys, i, n, x1_, y1_, x2_, y2_
          if (x1 != null) {
            x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2
          } else {
            x2_ = y2_ = -(x1_ = y1_ = Infinity)
            xs = [], ys = []
            n = data.length
            if (compat) {
              for (i = 0; i < n; ++i) {
                d = data[i]
                if (d.x < x1_) x1_ = d.x
                if (d.y < y1_) y1_ = d.y
                if (d.x > x2_) x2_ = d.x
                if (d.y > y2_) y2_ = d.y
                xs.push(d.x)
                ys.push(d.y)
              }
            } else {
              for (i = 0; i < n; ++i) {
                var x_ = +fx(d = data[i], i), y_ = +fy(d, i)
                if (x_ < x1_) x1_ = x_
                if (y_ < y1_) y1_ = y_
                if (x_ > x2_) x2_ = x_
                if (y_ > y2_) y2_ = y_
                xs.push(x_)
                ys.push(y_)
              }
            }
          }
          var dx = x2_ - x1_, dy = y2_ - y1_
          if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy
          function insert (n, d, x, y, x1, y1, x2, y2) {
            if (isNaN(x) || isNaN(y)) return
            if (n.leaf) {
              var nx = n.x, ny = n.y
              if (nx != null) {
                if (abs(nx - x) + abs(ny - y) < 0.01) {
                  insertChild(n, d, x, y, x1, y1, x2, y2)
                } else {
                  var nPoint = n.point
                  n.x = n.y = n.point = null
                  insertChild(n, nPoint, nx, ny, x1, y1, x2, y2)
                  insertChild(n, d, x, y, x1, y1, x2, y2)
                }
              } else {
                n.x = x, n.y = y, n.point = d
              }
            } else {
              insertChild(n, d, x, y, x1, y1, x2, y2)
            }
          }
          function insertChild (n, d, x, y, x1, y1, x2, y2) {
            var xm = (x1 + x2) * 0.5, ym = (y1 + y2) * 0.5, right = x >= xm, below = y >= ym, i = below << 1 | right
            n.leaf = false
            n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode())
            if (right) x1 = xm; else x2 = xm
            if (below) y1 = ym; else y2 = ym
            insert(n, d, x, y, x1, y1, x2, y2)
          }
          var root = d3_geom_quadtreeNode()
          root.add = function (d) {
            insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_)
          }
          root.visit = function (f) {
            d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_)
          }
          root.find = function (point) {
            return d3_geom_quadtreeFind(root, point[0], point[1], x1_, y1_, x2_, y2_)
          }
          i = -1
          if (x1 == null) {
            while (++i < n) {
              insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_)
            }
            --i
          } else data.forEach(root.add)
          xs = ys = data = d = null
          return root
        }
        quadtree.x = function (_) {
          return arguments.length ? (x = _, quadtree) : x
        }
        quadtree.y = function (_) {
          return arguments.length ? (y = _, quadtree) : y
        }
        quadtree.extent = function (_) {
          if (!arguments.length) return x1 == null ? null : [ [ x1, y1 ], [ x2, y2 ] ]
          if (_ == null) x1 = y1 = x2 = y2 = null; else {
            x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0],
      y2 = +_[1][1]
          }
          return quadtree
        }
        quadtree.size = function (_) {
          if (!arguments.length) return x1 == null ? null : [ x2 - x1, y2 - y1 ]
          if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = y1 = 0, x2 = +_[0], y2 = +_[1]
          return quadtree
        }
        return quadtree
      }
      function d3_geom_quadtreeCompatX (d) {
        return d.x
      }
      function d3_geom_quadtreeCompatY (d) {
        return d.y
      }
      function d3_geom_quadtreeNode () {
        return {
          leaf: true,
          nodes: [],
          point: null,
          x: null,
          y: null
        }
      }
      function d3_geom_quadtreeVisit (f, node, x1, y1, x2, y2) {
        if (!f(node, x1, y1, x2, y2)) {
          var sx = (x1 + x2) * 0.5, sy = (y1 + y2) * 0.5, children = node.nodes
          if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy)
          if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy)
          if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2)
          if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2)
        }
      }
      function d3_geom_quadtreeFind (root, x, y, x0, y0, x3, y3) {
        var minDistance2 = Infinity, closestPoint;
        (function find (node, x1, y1, x2, y2) {
          if (x1 > x3 || y1 > y3 || x2 < x0 || y2 < y0) return
          if (point = node.point) {
            var point, dx = x - node.x, dy = y - node.y, distance2 = dx * dx + dy * dy
            if (distance2 < minDistance2) {
              var distance = Math.sqrt(minDistance2 = distance2)
              x0 = x - distance, y0 = y - distance
              x3 = x + distance, y3 = y + distance
              closestPoint = point
            }
          }
          var children = node.nodes, xm = (x1 + x2) * 0.5, ym = (y1 + y2) * 0.5, right = x >= xm, below = y >= ym
          for (var i = below << 1 | right, j = i + 4; i < j; ++i) {
            if (node = children[i & 3]) {
              switch (i & 3) {
                case 0:
                  find(node, x1, y1, xm, ym)
                  break

                case 1:
                  find(node, xm, y1, x2, ym)
                  break

                case 2:
                  find(node, x1, ym, xm, y2)
                  break

                case 3:
                  find(node, xm, ym, x2, y2)
                  break
              }
            }
          }
        })(root, x0, y0, x3, y3)
        return closestPoint
      }
      d3.interpolateRgb = d3_interpolateRgb
      function d3_interpolateRgb (a, b) {
        a = d3.rgb(a)
        b = d3.rgb(b)
        var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab
        return function (t) {
          return '#' + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t))
        }
      }
      d3.interpolateObject = d3_interpolateObject
      function d3_interpolateObject (a, b) {
        var i = {}, c = {}, k
        for (k in a) {
          if (k in b) {
            i[k] = d3_interpolate(a[k], b[k])
          } else {
            c[k] = a[k]
          }
        }
        for (k in b) {
          if (!(k in a)) {
            c[k] = b[k]
          }
        }
        return function (t) {
          for (k in i) c[k] = i[k](t)
          return c
        }
      }
      d3.interpolateNumber = d3_interpolateNumber
      function d3_interpolateNumber (a, b) {
        a = +a, b = +b
        return function (t) {
          return a * (1 - t) + b * t
        }
      }
      d3.interpolateString = d3_interpolateString
      function d3_interpolateString (a, b) {
        var bi = d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = []
        a = a + '', b = b + ''
        while ((am = d3_interpolate_numberA.exec(a)) && (bm = d3_interpolate_numberB.exec(b))) {
          if ((bs = bm.index) > bi) {
            bs = b.slice(bi, bs)
            if (s[i]) s[i] += bs; else s[++i] = bs
          }
          if ((am = am[0]) === (bm = bm[0])) {
            if (s[i]) s[i] += bm; else s[++i] = bm
          } else {
            s[++i] = null
            q.push({
              i: i,
              x: d3_interpolateNumber(am, bm)
            })
          }
          bi = d3_interpolate_numberB.lastIndex
        }
        if (bi < b.length) {
          bs = b.slice(bi)
          if (s[i]) s[i] += bs; else s[++i] = bs
        }
        return s.length < 2 ? q[0] ? (b = q[0].x, function (t) {
          return b(t) + ''
        }) : function () {
          return b
        } : (b = q.length, function (t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t)
          return s.join('')
        })
      }
      var d3_interpolate_numberA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, d3_interpolate_numberB = new RegExp(d3_interpolate_numberA.source, 'g')
      d3.interpolate = d3_interpolate
      function d3_interpolate (a, b) {
        var i = d3.interpolators.length, f
        while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;
        return f
      }
      d3.interpolators = [ function (a, b) {
        var t = typeof b
        return (t === 'string' ? d3_rgb_names.has(b.toLowerCase()) || /^(#|rgb\(|hsl\()/i.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_color ? d3_interpolateRgb : Array.isArray(b) ? d3_interpolateArray : t === 'object' && isNaN(b) ? d3_interpolateObject : d3_interpolateNumber)(a, b)
      } ]
      d3.interpolateArray = d3_interpolateArray
      function d3_interpolateArray (a, b) {
        var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i
        for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]))
        for (;i < na; ++i) c[i] = a[i]
        for (;i < nb; ++i) c[i] = b[i]
        return function (t) {
          for (i = 0; i < n0; ++i) c[i] = x[i](t)
          return c
        }
      }
      var d3_ease_default = function () {
        return d3_identity
      }
      var d3_ease = d3.map({
        linear: d3_ease_default,
        poly: d3_ease_poly,
        quad: function () {
          return d3_ease_quad
        },
        cubic: function () {
          return d3_ease_cubic
        },
        sin: function () {
          return d3_ease_sin
        },
        exp: function () {
          return d3_ease_exp
        },
        circle: function () {
          return d3_ease_circle
        },
        elastic: d3_ease_elastic,
        back: d3_ease_back,
        bounce: function () {
          return d3_ease_bounce
        }
      })
      var d3_ease_mode = d3.map({
        'in': d3_identity,
        out: d3_ease_reverse,
        'in-out': d3_ease_reflect,
        'out-in': function (f) {
          return d3_ease_reflect(d3_ease_reverse(f))
        }
      })
      d3.ease = function (name) {
        var i = name.indexOf('-'), t = i >= 0 ? name.slice(0, i) : name, m = i >= 0 ? name.slice(i + 1) : 'in'
        t = d3_ease.get(t) || d3_ease_default
        m = d3_ease_mode.get(m) || d3_identity
        return d3_ease_clamp(m(t.apply(null, d3_arraySlice.call(arguments, 1))))
      }
      function d3_ease_clamp (f) {
        return function (t) {
          return t <= 0 ? 0 : t >= 1 ? 1 : f(t)
        }
      }
      function d3_ease_reverse (f) {
        return function (t) {
          return 1 - f(1 - t)
        }
      }
      function d3_ease_reflect (f) {
        return function (t) {
          return 0.5 * (t < 0.5 ? f(2 * t) : 2 - f(2 - 2 * t))
        }
      }
      function d3_ease_quad (t) {
        return t * t
      }
      function d3_ease_cubic (t) {
        return t * t * t
      }
      function d3_ease_cubicInOut (t) {
        if (t <= 0) return 0
        if (t >= 1) return 1
        var t2 = t * t, t3 = t2 * t
        return 4 * (t < 0.5 ? t3 : 3 * (t - t2) + t3 - 0.75)
      }
      function d3_ease_poly (e) {
        return function (t) {
          return Math.pow(t, e)
        }
      }
      function d3_ease_sin (t) {
        return 1 - Math.cos(t * halfπ)
      }
      function d3_ease_exp (t) {
        return Math.pow(2, 10 * (t - 1))
      }
      function d3_ease_circle (t) {
        return 1 - Math.sqrt(1 - t * t)
      }
      function d3_ease_elastic (a, p) {
        var s
        if (arguments.length < 2) p = 0.45
        if (arguments.length) s = p / τ * Math.asin(1 / a); else a = 1, s = p / 4
        return function (t) {
          return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p)
        }
      }
      function d3_ease_back (s) {
        if (!s) s = 1.70158
        return function (t) {
          return t * t * ((s + 1) * t - s)
        }
      }
      function d3_ease_bounce (t) {
        return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375 : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
      }
      d3.interpolateHcl = d3_interpolateHcl
      function d3_interpolateHcl (a, b) {
        a = d3.hcl(a)
        b = d3.hcl(b)
        var ah = a.h, ac = a.c, al = a.l, bh = b.h - ah, bc = b.c - ac, bl = b.l - al
        if (isNaN(bc)) bc = 0, ac = isNaN(ac) ? b.c : ac
        if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360
        return function (t) {
          return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + ''
        }
      }
      d3.interpolateHsl = d3_interpolateHsl
      function d3_interpolateHsl (a, b) {
        a = d3.hsl(a)
        b = d3.hsl(b)
        var ah = a.h, as = a.s, al = a.l, bh = b.h - ah, bs = b.s - as, bl = b.l - al
        if (isNaN(bs)) bs = 0, as = isNaN(as) ? b.s : as
        if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360
        return function (t) {
          return d3_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + ''
        }
      }
      d3.interpolateLab = d3_interpolateLab
      function d3_interpolateLab (a, b) {
        a = d3.lab(a)
        b = d3.lab(b)
        var al = a.l, aa = a.a, ab = a.b, bl = b.l - al, ba = b.a - aa, bb = b.b - ab
        return function (t) {
          return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + ''
        }
      }
      d3.interpolateRound = d3_interpolateRound
      function d3_interpolateRound (a, b) {
        b -= a
        return function (t) {
          return Math.round(a + b * t)
        }
      }
      d3.transform = function (string) {
        var g = d3_document.createElementNS(d3.ns.prefix.svg, 'g')
        return (d3.transform = function (string) {
          if (string != null) {
            g.setAttribute('transform', string)
            var t = g.transform.baseVal.consolidate()
          }
          return new d3_transform(t ? t.matrix : d3_transformIdentity)
        })(string)
      }
      function d3_transform (m) {
        var r0 = [ m.a, m.b ], r1 = [ m.c, m.d ], kx = d3_transformNormalize(r0), kz = d3_transformDot(r0, r1), ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0
        if (r0[0] * r1[1] < r1[0] * r0[1]) {
          r0[0] *= -1
          r0[1] *= -1
          kx *= -1
          kz *= -1
        }
        this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees
        this.translate = [ m.e, m.f ]
        this.scale = [ kx, ky ]
        this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0
      }
      d3_transform.prototype.toString = function () {
        return 'translate(' + this.translate + ')rotate(' + this.rotate + ')skewX(' + this.skew + ')scale(' + this.scale + ')'
      }
      function d3_transformDot (a, b) {
        return a[0] * b[0] + a[1] * b[1]
      }
      function d3_transformNormalize (a) {
        var k = Math.sqrt(d3_transformDot(a, a))
        if (k) {
          a[0] /= k
          a[1] /= k
        }
        return k
      }
      function d3_transformCombine (a, b, k) {
        a[0] += k * b[0]
        a[1] += k * b[1]
        return a
      }
      var d3_transformIdentity = {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: 0,
        f: 0
      }
      d3.interpolateTransform = d3_interpolateTransform
      function d3_interpolateTransform (a, b) {
        var s = [], q = [], n, A = d3.transform(a), B = d3.transform(b), ta = A.translate, tb = B.translate, ra = A.rotate, rb = B.rotate, wa = A.skew, wb = B.skew, ka = A.scale, kb = B.scale
        if (ta[0] != tb[0] || ta[1] != tb[1]) {
          s.push('translate(', null, ',', null, ')')
          q.push({
            i: 1,
            x: d3_interpolateNumber(ta[0], tb[0])
          }, {
            i: 3,
            x: d3_interpolateNumber(ta[1], tb[1])
          })
        } else if (tb[0] || tb[1]) {
          s.push('translate(' + tb + ')')
        } else {
          s.push('')
        }
        if (ra != rb) {
          if (ra - rb > 180) rb += 360; else if (rb - ra > 180) ra += 360
          q.push({
            i: s.push(s.pop() + 'rotate(', null, ')') - 2,
            x: d3_interpolateNumber(ra, rb)
          })
        } else if (rb) {
          s.push(s.pop() + 'rotate(' + rb + ')')
        }
        if (wa != wb) {
          q.push({
            i: s.push(s.pop() + 'skewX(', null, ')') - 2,
            x: d3_interpolateNumber(wa, wb)
          })
        } else if (wb) {
          s.push(s.pop() + 'skewX(' + wb + ')')
        }
        if (ka[0] != kb[0] || ka[1] != kb[1]) {
          n = s.push(s.pop() + 'scale(', null, ',', null, ')')
          q.push({
            i: n - 4,
            x: d3_interpolateNumber(ka[0], kb[0])
          }, {
            i: n - 2,
            x: d3_interpolateNumber(ka[1], kb[1])
          })
        } else if (kb[0] != 1 || kb[1] != 1) {
          s.push(s.pop() + 'scale(' + kb + ')')
        }
        n = q.length
        return function (t) {
          var i = -1, o
          while (++i < n) s[(o = q[i]).i] = o.x(t)
          return s.join('')
        }
      }
      function d3_uninterpolateNumber (a, b) {
        b = (b -= a = +a) || 1 / b
        return function (x) {
          return (x - a) / b
        }
      }
      function d3_uninterpolateClamp (a, b) {
        b = (b -= a = +a) || 1 / b
        return function (x) {
          return Math.max(0, Math.min(1, (x - a) / b))
        }
      }
      d3.layout = {}
      d3.layout.bundle = function () {
        return function (links) {
          var paths = [], i = -1, n = links.length
          while (++i < n) paths.push(d3_layout_bundlePath(links[i]))
          return paths
        }
      }
      function d3_layout_bundlePath (link) {
        var start = link.source, end = link.target, lca = d3_layout_bundleLeastCommonAncestor(start, end), points = [ start ]
        while (start !== lca) {
          start = start.parent
          points.push(start)
        }
        var k = points.length
        while (end !== lca) {
          points.splice(k, 0, end)
          end = end.parent
        }
        return points
      }
      function d3_layout_bundleAncestors (node) {
        var ancestors = [], parent = node.parent
        while (parent != null) {
          ancestors.push(node)
          node = parent
          parent = parent.parent
        }
        ancestors.push(node)
        return ancestors
      }
      function d3_layout_bundleLeastCommonAncestor (a, b) {
        if (a === b) return a
        var aNodes = d3_layout_bundleAncestors(a), bNodes = d3_layout_bundleAncestors(b), aNode = aNodes.pop(), bNode = bNodes.pop(), sharedNode = null
        while (aNode === bNode) {
          sharedNode = aNode
          aNode = aNodes.pop()
          bNode = bNodes.pop()
        }
        return sharedNode
      }
      d3.layout.chord = function () {
        var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords
        function relayout () {
          var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j
          chords = []
          groups = []
          k = 0, i = -1
          while (++i < n) {
            x = 0, j = -1
            while (++j < n) {
              x += matrix[i][j]
            }
            groupSums.push(x)
            subgroupIndex.push(d3.range(n))
            k += x
          }
          if (sortGroups) {
            groupIndex.sort(function (a, b) {
              return sortGroups(groupSums[a], groupSums[b])
            })
          }
          if (sortSubgroups) {
            subgroupIndex.forEach(function (d, i) {
              d.sort(function (a, b) {
                return sortSubgroups(matrix[i][a], matrix[i][b])
              })
            })
          }
          k = (τ - padding * n) / k
          x = 0, i = -1
          while (++i < n) {
            x0 = x, j = -1
            while (++j < n) {
              var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k
              subgroups[di + '-' + dj] = {
                index: di,
                subindex: dj,
                startAngle: a0,
                endAngle: a1,
                value: v
              }
            }
            groups[di] = {
              index: di,
              startAngle: x0,
              endAngle: x,
              value: (x - x0) / k
            }
            x += padding
          }
          i = -1
          while (++i < n) {
            j = i - 1
            while (++j < n) {
              var source = subgroups[i + '-' + j], target = subgroups[j + '-' + i]
              if (source.value || target.value) {
                chords.push(source.value < target.value ? {
                  source: target,
                  target: source
                } : {
                  source: source,
                  target: target
                })
              }
            }
          }
          if (sortChords) resort()
        }
        function resort () {
          chords.sort(function (a, b) {
            return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2)
          })
        }
        chord.matrix = function (x) {
          if (!arguments.length) return matrix
          n = (matrix = x) && matrix.length
          chords = groups = null
          return chord
        }
        chord.padding = function (x) {
          if (!arguments.length) return padding
          padding = x
          chords = groups = null
          return chord
        }
        chord.sortGroups = function (x) {
          if (!arguments.length) return sortGroups
          sortGroups = x
          chords = groups = null
          return chord
        }
        chord.sortSubgroups = function (x) {
          if (!arguments.length) return sortSubgroups
          sortSubgroups = x
          chords = null
          return chord
        }
        chord.sortChords = function (x) {
          if (!arguments.length) return sortChords
          sortChords = x
          if (chords) resort()
          return chord
        }
        chord.chords = function () {
          if (!chords) relayout()
          return chords
        }
        chord.groups = function () {
          if (!groups) relayout()
          return groups
        }
        return chord
      }
      d3.layout.force = function () {
        var force = {}, event = d3.dispatch('start', 'tick', 'end'), size = [ 1, 1 ], drag, alpha, friction = 0.9, linkDistance = d3_layout_forceLinkDistance, linkStrength = d3_layout_forceLinkStrength, charge = -30, chargeDistance2 = d3_layout_forceChargeDistance2, gravity = 0.1, theta2 = 0.64, nodes = [], links = [], distances, strengths, charges
        function repulse (node) {
          return function (quad, x1, _, x2) {
            if (quad.point !== node) {
              var dx = quad.cx - node.x, dy = quad.cy - node.y, dw = x2 - x1, dn = dx * dx + dy * dy
              if (dw * dw / theta2 < dn) {
                if (dn < chargeDistance2) {
                  var k = quad.charge / dn
                  node.px -= dx * k
                  node.py -= dy * k
                }
                return true
              }
              if (quad.point && dn && dn < chargeDistance2) {
                var k = quad.pointCharge / dn
                node.px -= dx * k
                node.py -= dy * k
              }
            }
            return !quad.charge
          }
        }
        force.tick = function () {
          if ((alpha *= 0.99) < 0.005) {
            event.end({
              type: 'end',
              alpha: alpha = 0
            })
            return true
          }
          var n = nodes.length, m = links.length, q, i, o, s, t, l, k, x, y
          for (i = 0; i < m; ++i) {
            o = links[i]
            s = o.source
            t = o.target
            x = t.x - s.x
            y = t.y - s.y
            if (l = x * x + y * y) {
              l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l
              x *= l
              y *= l
              t.x -= x * (k = s.weight / (t.weight + s.weight))
              t.y -= y * k
              s.x += x * (k = 1 - k)
              s.y += y * k
            }
          }
          if (k = alpha * gravity) {
            x = size[0] / 2
            y = size[1] / 2
            i = -1
            if (k) {
              while (++i < n) {
                o = nodes[i]
                o.x += (x - o.x) * k
                o.y += (y - o.y) * k
              }
            }
          }
          if (charge) {
            d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges)
            i = -1
            while (++i < n) {
              if (!(o = nodes[i]).fixed) {
                q.visit(repulse(o))
              }
            }
          }
          i = -1
          while (++i < n) {
            o = nodes[i]
            if (o.fixed) {
              o.x = o.px
              o.y = o.py
            } else {
              o.x -= (o.px - (o.px = o.x)) * friction
              o.y -= (o.py - (o.py = o.y)) * friction
            }
          }
          event.tick({
            type: 'tick',
            alpha: alpha
          })
        }
        force.nodes = function (x) {
          if (!arguments.length) return nodes
          nodes = x
          return force
        }
        force.links = function (x) {
          if (!arguments.length) return links
          links = x
          return force
        }
        force.size = function (x) {
          if (!arguments.length) return size
          size = x
          return force
        }
        force.linkDistance = function (x) {
          if (!arguments.length) return linkDistance
          linkDistance = typeof x === 'function' ? x : +x
          return force
        }
        force.distance = force.linkDistance
        force.linkStrength = function (x) {
          if (!arguments.length) return linkStrength
          linkStrength = typeof x === 'function' ? x : +x
          return force
        }
        force.friction = function (x) {
          if (!arguments.length) return friction
          friction = +x
          return force
        }
        force.charge = function (x) {
          if (!arguments.length) return charge
          charge = typeof x === 'function' ? x : +x
          return force
        }
        force.chargeDistance = function (x) {
          if (!arguments.length) return Math.sqrt(chargeDistance2)
          chargeDistance2 = x * x
          return force
        }
        force.gravity = function (x) {
          if (!arguments.length) return gravity
          gravity = +x
          return force
        }
        force.theta = function (x) {
          if (!arguments.length) return Math.sqrt(theta2)
          theta2 = x * x
          return force
        }
        force.alpha = function (x) {
          if (!arguments.length) return alpha
          x = +x
          if (alpha) {
            if (x > 0) alpha = x; else alpha = 0
          } else if (x > 0) {
            event.start({
              type: 'start',
              alpha: alpha = x
            })
            d3.timer(force.tick)
          }
          return force
        }
        force.start = function () {
          var i, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o
          for (i = 0; i < n; ++i) {
            (o = nodes[i]).index = i
            o.weight = 0
          }
          for (i = 0; i < m; ++i) {
            o = links[i]
            if (typeof o.source === 'number') o.source = nodes[o.source]
            if (typeof o.target === 'number') o.target = nodes[o.target]
            ++o.source.weight
            ++o.target.weight
          }
          for (i = 0; i < n; ++i) {
            o = nodes[i]
            if (isNaN(o.x)) o.x = position('x', w)
            if (isNaN(o.y)) o.y = position('y', h)
            if (isNaN(o.px)) o.px = o.x
            if (isNaN(o.py)) o.py = o.y
          }
          distances = []
          if (typeof linkDistance === 'function') for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; i < m; ++i) distances[i] = linkDistance
          strengths = []
          if (typeof linkStrength === 'function') for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; i < m; ++i) strengths[i] = linkStrength
          charges = []
          if (typeof charge === 'function') for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; i < n; ++i) charges[i] = charge
          function position (dimension, size) {
            if (!neighbors) {
              neighbors = new Array(n)
              for (j = 0; j < n; ++j) {
                neighbors[j] = []
              }
              for (j = 0; j < m; ++j) {
                var o = links[j]
                neighbors[o.source.index].push(o.target)
                neighbors[o.target.index].push(o.source)
              }
            }
            var candidates = neighbors[i], j = -1, l = candidates.length, x
            while (++j < l) if (!isNaN(x = candidates[j][dimension])) return x
            return Math.random() * size
          }
          return force.resume()
        }
        force.resume = function () {
          return force.alpha(0.1)
        }
        force.stop = function () {
          return force.alpha(0)
        }
        force.drag = function () {
          if (!drag) drag = d3.behavior.drag().origin(d3_identity).on('dragstart.force', d3_layout_forceDragstart).on('drag.force', dragmove).on('dragend.force', d3_layout_forceDragend)
          if (!arguments.length) return drag
          this.on('mouseover.force', d3_layout_forceMouseover).on('mouseout.force', d3_layout_forceMouseout).call(drag)
        }
        function dragmove (d) {
          d.px = d3.event.x, d.py = d3.event.y
          force.resume()
        }
        return d3.rebind(force, event, 'on')
      }
      function d3_layout_forceDragstart (d) {
        d.fixed |= 2
      }
      function d3_layout_forceDragend (d) {
        d.fixed &= ~6
      }
      function d3_layout_forceMouseover (d) {
        d.fixed |= 4
        d.px = d.x, d.py = d.y
      }
      function d3_layout_forceMouseout (d) {
        d.fixed &= ~4
      }
      function d3_layout_forceAccumulate (quad, alpha, charges) {
        var cx = 0, cy = 0
        quad.charge = 0
        if (!quad.leaf) {
          var nodes = quad.nodes, n = nodes.length, i = -1, c
          while (++i < n) {
            c = nodes[i]
            if (c == null) continue
            d3_layout_forceAccumulate(c, alpha, charges)
            quad.charge += c.charge
            cx += c.charge * c.cx
            cy += c.charge * c.cy
          }
        }
        if (quad.point) {
          if (!quad.leaf) {
            quad.point.x += Math.random() - 0.5
            quad.point.y += Math.random() - 0.5
          }
          var k = alpha * charges[quad.point.index]
          quad.charge += quad.pointCharge = k
          cx += k * quad.point.x
          cy += k * quad.point.y
        }
        quad.cx = cx / quad.charge
        quad.cy = cy / quad.charge
      }
      var d3_layout_forceLinkDistance = 20, d3_layout_forceLinkStrength = 1, d3_layout_forceChargeDistance2 = Infinity
      d3.layout.hierarchy = function () {
        var sort = d3_layout_hierarchySort, children = d3_layout_hierarchyChildren, value = d3_layout_hierarchyValue
        function hierarchy (root) {
          var stack = [ root ], nodes = [], node
          root.depth = 0
          while ((node = stack.pop()) != null) {
            nodes.push(node)
            if ((childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {
              var n, childs, child
              while (--n >= 0) {
                stack.push(child = childs[n])
                child.parent = node
                child.depth = node.depth + 1
              }
              if (value) node.value = 0
              node.children = childs
            } else {
              if (value) node.value = +value.call(hierarchy, node, node.depth) || 0
              delete node.children
            }
          }
          d3_layout_hierarchyVisitAfter(root, function (node) {
            var childs, parent
            if (sort && (childs = node.children)) childs.sort(sort)
            if (value && (parent = node.parent)) parent.value += node.value
          })
          return nodes
        }
        hierarchy.sort = function (x) {
          if (!arguments.length) return sort
          sort = x
          return hierarchy
        }
        hierarchy.children = function (x) {
          if (!arguments.length) return children
          children = x
          return hierarchy
        }
        hierarchy.value = function (x) {
          if (!arguments.length) return value
          value = x
          return hierarchy
        }
        hierarchy.revalue = function (root) {
          if (value) {
            d3_layout_hierarchyVisitBefore(root, function (node) {
              if (node.children) node.value = 0
            })
            d3_layout_hierarchyVisitAfter(root, function (node) {
              var parent
              if (!node.children) node.value = +value.call(hierarchy, node, node.depth) || 0
              if (parent = node.parent) parent.value += node.value
            })
          }
          return root
        }
        return hierarchy
      }
      function d3_layout_hierarchyRebind (object, hierarchy) {
        d3.rebind(object, hierarchy, 'sort', 'children', 'value')
        object.nodes = object
        object.links = d3_layout_hierarchyLinks
        return object
      }
      function d3_layout_hierarchyVisitBefore (node, callback) {
        var nodes = [ node ]
        while ((node = nodes.pop()) != null) {
          callback(node)
          if ((children = node.children) && (n = children.length)) {
            var n, children
            while (--n >= 0) nodes.push(children[n])
          }
        }
      }
      function d3_layout_hierarchyVisitAfter (node, callback) {
        var nodes = [ node ], nodes2 = []
        while ((node = nodes.pop()) != null) {
          nodes2.push(node)
          if ((children = node.children) && (n = children.length)) {
            var i = -1, n, children
            while (++i < n) nodes.push(children[i])
          }
        }
        while ((node = nodes2.pop()) != null) {
          callback(node)
        }
      }
      function d3_layout_hierarchyChildren (d) {
        return d.children
      }
      function d3_layout_hierarchyValue (d) {
        return d.value
      }
      function d3_layout_hierarchySort (a, b) {
        return b.value - a.value
      }
      function d3_layout_hierarchyLinks (nodes) {
        return d3.merge(nodes.map(function (parent) {
          return (parent.children || []).map(function (child) {
            return {
              source: parent,
              target: child
            }
          })
        }))
      }
      d3.layout.partition = function () {
        var hierarchy = d3.layout.hierarchy(), size = [ 1, 1 ]
        function position (node, x, dx, dy) {
          var children = node.children
          node.x = x
          node.y = node.depth * dy
          node.dx = dx
          node.dy = dy
          if (children && (n = children.length)) {
            var i = -1, n, c, d
            dx = node.value ? dx / node.value : 0
            while (++i < n) {
              position(c = children[i], x, d = c.value * dx, dy)
              x += d
            }
          }
        }
        function depth (node) {
          var children = node.children, d = 0
          if (children && (n = children.length)) {
            var i = -1, n
            while (++i < n) d = Math.max(d, depth(children[i]))
          }
          return 1 + d
        }
        function partition (d, i) {
          var nodes = hierarchy.call(this, d, i)
          position(nodes[0], 0, size[0], size[1] / depth(nodes[0]))
          return nodes
        }
        partition.size = function (x) {
          if (!arguments.length) return size
          size = x
          return partition
        }
        return d3_layout_hierarchyRebind(partition, hierarchy)
      }
      d3.layout.pie = function () {
        var value = Number, sort = d3_layout_pieSortByValue, startAngle = 0, endAngle = τ, padAngle = 0
        function pie (data) {
          var n = data.length, values = data.map(function (d, i) {
              return +value.call(pie, d, i)
            }), a = +(typeof startAngle === 'function' ? startAngle.apply(this, arguments) : startAngle), da = (typeof endAngle === 'function' ? endAngle.apply(this, arguments) : endAngle) - a, p = Math.min(Math.abs(da) / n, +(typeof padAngle === 'function' ? padAngle.apply(this, arguments) : padAngle)), pa = p * (da < 0 ? -1 : 1), k = (da - n * pa) / d3.sum(values), index = d3.range(n), arcs = [], v
          if (sort != null) {
            index.sort(sort === d3_layout_pieSortByValue ? function (i, j) {
              return values[j] - values[i]
            } : function (i, j) {
              return sort(data[i], data[j])
            })
          }
          index.forEach(function (i) {
            arcs[i] = {
              data: data[i],
              value: v = values[i],
              startAngle: a,
              endAngle: a += v * k + pa,
              padAngle: p
            }
          })
          return arcs
        }
        pie.value = function (_) {
          if (!arguments.length) return value
          value = _
          return pie
        }
        pie.sort = function (_) {
          if (!arguments.length) return sort
          sort = _
          return pie
        }
        pie.startAngle = function (_) {
          if (!arguments.length) return startAngle
          startAngle = _
          return pie
        }
        pie.endAngle = function (_) {
          if (!arguments.length) return endAngle
          endAngle = _
          return pie
        }
        pie.padAngle = function (_) {
          if (!arguments.length) return padAngle
          padAngle = _
          return pie
        }
        return pie
      }
      var d3_layout_pieSortByValue = {}
      d3.layout.stack = function () {
        var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero, out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY
        function stack (data, index) {
          if (!(n = data.length)) return data
          var series = data.map(function (d, i) {
            return values.call(stack, d, i)
          })
          var points = series.map(function (d) {
            return d.map(function (v, i) {
              return [ x.call(stack, v, i), y.call(stack, v, i) ]
            })
          })
          var orders = order.call(stack, points, index)
          series = d3.permute(series, orders)
          points = d3.permute(points, orders)
          var offsets = offset.call(stack, points, index)
          var m = series[0].length, n, i, j, o
          for (j = 0; j < m; ++j) {
            out.call(stack, series[0][j], o = offsets[j], points[0][j][1])
            for (i = 1; i < n; ++i) {
              out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1])
            }
          }
          return data
        }
        stack.values = function (x) {
          if (!arguments.length) return values
          values = x
          return stack
        }
        stack.order = function (x) {
          if (!arguments.length) return order
          order = typeof x === 'function' ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault
          return stack
        }
        stack.offset = function (x) {
          if (!arguments.length) return offset
          offset = typeof x === 'function' ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero
          return stack
        }
        stack.x = function (z) {
          if (!arguments.length) return x
          x = z
          return stack
        }
        stack.y = function (z) {
          if (!arguments.length) return y
          y = z
          return stack
        }
        stack.out = function (z) {
          if (!arguments.length) return out
          out = z
          return stack
        }
        return stack
      }
      function d3_layout_stackX (d) {
        return d.x
      }
      function d3_layout_stackY (d) {
        return d.y
      }
      function d3_layout_stackOut (d, y0, y) {
        d.y0 = y0
        d.y = y
      }
      var d3_layout_stackOrders = d3.map({
        'inside-out': function (data) {
          var n = data.length, i, j, max = data.map(d3_layout_stackMaxIndex), sums = data.map(d3_layout_stackReduceSum), index = d3.range(n).sort(function (a, b) {
              return max[a] - max[b]
            }), top = 0, bottom = 0, tops = [], bottoms = []
          for (i = 0; i < n; ++i) {
            j = index[i]
            if (top < bottom) {
              top += sums[j]
              tops.push(j)
            } else {
              bottom += sums[j]
              bottoms.push(j)
            }
          }
          return bottoms.reverse().concat(tops)
        },
        reverse: function (data) {
          return d3.range(data.length).reverse()
        },
        'default': d3_layout_stackOrderDefault
      })
      var d3_layout_stackOffsets = d3.map({
        silhouette: function (data) {
          var n = data.length, m = data[0].length, sums = [], max = 0, i, j, o, y0 = []
          for (j = 0; j < m; ++j) {
            for (i = 0, o = 0; i < n; i++) o += data[i][j][1]
            if (o > max) max = o
            sums.push(o)
          }
          for (j = 0; j < m; ++j) {
            y0[j] = (max - sums[j]) / 2
          }
          return y0
        },
        wiggle: function (data) {
          var n = data.length, x = data[0], m = x.length, i, j, k, s1, s2, s3, dx, o, o0, y0 = []
          y0[0] = o = o0 = 0
          for (j = 1; j < m; ++j) {
            for (i = 0, s1 = 0; i < n; ++i) s1 += data[i][j][1]
            for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {
              for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {
                s3 += (data[k][j][1] - data[k][j - 1][1]) / dx
              }
              s2 += s3 * data[i][j][1]
            }
            y0[j] = o -= s1 ? s2 / s1 * dx : 0
            if (o < o0) o0 = o
          }
          for (j = 0; j < m; ++j) y0[j] -= o0
          return y0
        },
        expand: function (data) {
          var n = data.length, m = data[0].length, k = 1 / n, i, j, o, y0 = []
          for (j = 0; j < m; ++j) {
            for (i = 0, o = 0; i < n; i++) o += data[i][j][1]
            if (o) for (i = 0; i < n; i++) data[i][j][1] /= o; else for (i = 0; i < n; i++) data[i][j][1] = k
          }
          for (j = 0; j < m; ++j) y0[j] = 0
          return y0
        },
        zero: d3_layout_stackOffsetZero
      })
      function d3_layout_stackOrderDefault (data) {
        return d3.range(data.length)
      }
      function d3_layout_stackOffsetZero (data) {
        var j = -1, m = data[0].length, y0 = []
        while (++j < m) y0[j] = 0
        return y0
      }
      function d3_layout_stackMaxIndex (array) {
        var i = 1, j = 0, v = array[0][1], k, n = array.length
        for (;i < n; ++i) {
          if ((k = array[i][1]) > v) {
            j = i
            v = k
          }
        }
        return j
      }
      function d3_layout_stackReduceSum (d) {
        return d.reduce(d3_layout_stackSum, 0)
      }
      function d3_layout_stackSum (p, d) {
        return p + d[1]
      }
      d3.layout.histogram = function () {
        var frequency = true, valuer = Number, ranger = d3_layout_histogramRange, binner = d3_layout_histogramBinSturges
        function histogram (data, i) {
          var bins = [], values = data.map(valuer, this), range = ranger.call(this, values, i), thresholds = binner.call(this, range, values, i), bin, i = -1, n = values.length, m = thresholds.length - 1, k = frequency ? 1 : 1 / n, x
          while (++i < m) {
            bin = bins[i] = []
            bin.dx = thresholds[i + 1] - (bin.x = thresholds[i])
            bin.y = 0
          }
          if (m > 0) {
            i = -1
            while (++i < n) {
              x = values[i]
              if (x >= range[0] && x <= range[1]) {
                bin = bins[d3.bisect(thresholds, x, 1, m) - 1]
                bin.y += k
                bin.push(data[i])
              }
            }
          }
          return bins
        }
        histogram.value = function (x) {
          if (!arguments.length) return valuer
          valuer = x
          return histogram
        }
        histogram.range = function (x) {
          if (!arguments.length) return ranger
          ranger = d3_functor(x)
          return histogram
        }
        histogram.bins = function (x) {
          if (!arguments.length) return binner
          binner = typeof x === 'number' ? function (range) {
            return d3_layout_histogramBinFixed(range, x)
          } : d3_functor(x)
          return histogram
        }
        histogram.frequency = function (x) {
          if (!arguments.length) return frequency
          frequency = !!x
          return histogram
        }
        return histogram
      }
      function d3_layout_histogramBinSturges (range, values) {
        return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1))
      }
      function d3_layout_histogramBinFixed (range, n) {
        var x = -1, b = +range[0], m = (range[1] - b) / n, f = []
        while (++x <= n) f[x] = m * x + b
        return f
      }
      function d3_layout_histogramRange (values) {
        return [ d3.min(values), d3.max(values) ]
      }
      d3.layout.pack = function () {
        var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort), padding = 0, size = [ 1, 1 ], radius
        function pack (d, i) {
          var nodes = hierarchy.call(this, d, i), root = nodes[0], w = size[0], h = size[1], r = radius == null ? Math.sqrt : typeof radius === 'function' ? radius : function () {
              return radius
            }
          root.x = root.y = 0
          d3_layout_hierarchyVisitAfter(root, function (d) {
            d.r = +r(d.value)
          })
          d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings)
          if (padding) {
            var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2
            d3_layout_hierarchyVisitAfter(root, function (d) {
              d.r += dr
            })
            d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings)
            d3_layout_hierarchyVisitAfter(root, function (d) {
              d.r -= dr
            })
          }
          d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h))
          return nodes
        }
        pack.size = function (_) {
          if (!arguments.length) return size
          size = _
          return pack
        }
        pack.radius = function (_) {
          if (!arguments.length) return radius
          radius = _ == null || typeof _ === 'function' ? _ : +_
          return pack
        }
        pack.padding = function (_) {
          if (!arguments.length) return padding
          padding = +_
          return pack
        }
        return d3_layout_hierarchyRebind(pack, hierarchy)
      }
      function d3_layout_packSort (a, b) {
        return a.value - b.value
      }
      function d3_layout_packInsert (a, b) {
        var c = a._pack_next
        a._pack_next = b
        b._pack_prev = a
        b._pack_next = c
        c._pack_prev = b
      }
      function d3_layout_packSplice (a, b) {
        a._pack_next = b
        b._pack_prev = a
      }
      function d3_layout_packIntersects (a, b) {
        var dx = b.x - a.x, dy = b.y - a.y, dr = a.r + b.r
        return 0.999 * dr * dr > dx * dx + dy * dy
      }
      function d3_layout_packSiblings (node) {
        if (!(nodes = node.children) || !(n = nodes.length)) return
        var nodes, xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, a, b, c, i, j, k, n
        function bound (node) {
          xMin = Math.min(node.x - node.r, xMin)
          xMax = Math.max(node.x + node.r, xMax)
          yMin = Math.min(node.y - node.r, yMin)
          yMax = Math.max(node.y + node.r, yMax)
        }
        nodes.forEach(d3_layout_packLink)
        a = nodes[0]
        a.x = -a.r
        a.y = 0
        bound(a)
        if (n > 1) {
          b = nodes[1]
          b.x = b.r
          b.y = 0
          bound(b)
          if (n > 2) {
            c = nodes[2]
            d3_layout_packPlace(a, b, c)
            bound(c)
            d3_layout_packInsert(a, c)
            a._pack_prev = c
            d3_layout_packInsert(c, b)
            b = a._pack_next
            for (i = 3; i < n; i++) {
              d3_layout_packPlace(a, b, c = nodes[i])
              var isect = 0, s1 = 1, s2 = 1
              for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {
                if (d3_layout_packIntersects(j, c)) {
                  isect = 1
                  break
                }
              }
              if (isect == 1) {
                for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {
                  if (d3_layout_packIntersects(k, c)) {
                    break
                  }
                }
              }
              if (isect) {
                if (s1 < s2 || s1 == s2 && b.r < a.r) d3_layout_packSplice(a, b = j); else d3_layout_packSplice(a = k, b)
                i--
              } else {
                d3_layout_packInsert(a, c)
                b = c
                bound(c)
              }
            }
          }
        }
        var cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2, cr = 0
        for (i = 0; i < n; i++) {
          c = nodes[i]
          c.x -= cx
          c.y -= cy
          cr = Math.max(cr, c.r + Math.sqrt(c.x * c.x + c.y * c.y))
        }
        node.r = cr
        nodes.forEach(d3_layout_packUnlink)
      }
      function d3_layout_packLink (node) {
        node._pack_next = node._pack_prev = node
      }
      function d3_layout_packUnlink (node) {
        delete node._pack_next
        delete node._pack_prev
      }
      function d3_layout_packTransform (node, x, y, k) {
        var children = node.children
        node.x = x += k * node.x
        node.y = y += k * node.y
        node.r *= k
        if (children) {
          var i = -1, n = children.length
          while (++i < n) d3_layout_packTransform(children[i], x, y, k)
        }
      }
      function d3_layout_packPlace (a, b, c) {
        var db = a.r + c.r, dx = b.x - a.x, dy = b.y - a.y
        if (db && (dx || dy)) {
          var da = b.r + c.r, dc = dx * dx + dy * dy
          da *= da
          db *= db
          var x = 0.5 + (db - da) / (2 * dc), y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc)
          c.x = a.x + x * dx + y * dy
          c.y = a.y + x * dy - y * dx
        } else {
          c.x = a.x + db
          c.y = a.y
        }
      }
      d3.layout.tree = function () {
        var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = null
        function tree (d, i) {
          var nodes = hierarchy.call(this, d, i), root0 = nodes[0], root1 = wrapTree(root0)
          d3_layout_hierarchyVisitAfter(root1, firstWalk), root1.parent.m = -root1.z
          d3_layout_hierarchyVisitBefore(root1, secondWalk)
          if (nodeSize) d3_layout_hierarchyVisitBefore(root0, sizeNode); else {
            var left = root0, right = root0, bottom = root0
            d3_layout_hierarchyVisitBefore(root0, function (node) {
              if (node.x < left.x) left = node
              if (node.x > right.x) right = node
              if (node.depth > bottom.depth) bottom = node
            })
            var tx = separation(left, right) / 2 - left.x, kx = size[0] / (right.x + separation(right, left) / 2 + tx), ky = size[1] / (bottom.depth || 1)
            d3_layout_hierarchyVisitBefore(root0, function (node) {
              node.x = (node.x + tx) * kx
              node.y = node.depth * ky
            })
          }
          return nodes
        }
        function wrapTree (root0) {
          var root1 = {
              A: null,
              children: [ root0 ]
            }, queue = [ root1 ], node1
          while ((node1 = queue.pop()) != null) {
            for (var children = node1.children, child, i = 0, n = children.length; i < n; ++i) {
              queue.push((children[i] = child = {
                _: children[i],
                parent: node1,
                children: (child = children[i].children) && child.slice() || [],
                A: null,
                a: null,
                z: 0,
                m: 0,
                c: 0,
                s: 0,
                t: null,
                i: i
              }).a = child)
            }
          }
          return root1.children[0]
        }
        function firstWalk (v) {
          var children = v.children, siblings = v.parent.children, w = v.i ? siblings[v.i - 1] : null
          if (children.length) {
            d3_layout_treeShift(v)
            var midpoint = (children[0].z + children[children.length - 1].z) / 2
            if (w) {
              v.z = w.z + separation(v._, w._)
              v.m = v.z - midpoint
            } else {
              v.z = midpoint
            }
          } else if (w) {
            v.z = w.z + separation(v._, w._)
          }
          v.parent.A = apportion(v, w, v.parent.A || siblings[0])
        }
        function secondWalk (v) {
          v._.x = v.z + v.parent.m
          v.m += v.parent.m
        }
        function apportion (v, w, ancestor) {
          if (w) {
            var vip = v, vop = v, vim = w, vom = vip.parent.children[0], sip = vip.m, sop = vop.m, sim = vim.m, som = vom.m, shift
            while (vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip) {
              vom = d3_layout_treeLeft(vom)
              vop = d3_layout_treeRight(vop)
              vop.a = v
              shift = vim.z + sim - vip.z - sip + separation(vim._, vip._)
              if (shift > 0) {
                d3_layout_treeMove(d3_layout_treeAncestor(vim, v, ancestor), v, shift)
                sip += shift
                sop += shift
              }
              sim += vim.m
              sip += vip.m
              som += vom.m
              sop += vop.m
            }
            if (vim && !d3_layout_treeRight(vop)) {
              vop.t = vim
              vop.m += sim - sop
            }
            if (vip && !d3_layout_treeLeft(vom)) {
              vom.t = vip
              vom.m += sip - som
              ancestor = v
            }
          }
          return ancestor
        }
        function sizeNode (node) {
          node.x *= size[0]
          node.y = node.depth * size[1]
        }
        tree.separation = function (x) {
          if (!arguments.length) return separation
          separation = x
          return tree
        }
        tree.size = function (x) {
          if (!arguments.length) return nodeSize ? null : size
          nodeSize = (size = x) == null ? sizeNode : null
          return tree
        }
        tree.nodeSize = function (x) {
          if (!arguments.length) return nodeSize ? size : null
          nodeSize = (size = x) == null ? null : sizeNode
          return tree
        }
        return d3_layout_hierarchyRebind(tree, hierarchy)
      }
      function d3_layout_treeSeparation (a, b) {
        return a.parent == b.parent ? 1 : 2
      }
      function d3_layout_treeLeft (v) {
        var children = v.children
        return children.length ? children[0] : v.t
      }
      function d3_layout_treeRight (v) {
        var children = v.children, n
        return (n = children.length) ? children[n - 1] : v.t
      }
      function d3_layout_treeMove (wm, wp, shift) {
        var change = shift / (wp.i - wm.i)
        wp.c -= change
        wp.s += shift
        wm.c += change
        wp.z += shift
        wp.m += shift
      }
      function d3_layout_treeShift (v) {
        var shift = 0, change = 0, children = v.children, i = children.length, w
        while (--i >= 0) {
          w = children[i]
          w.z += shift
          w.m += shift
          shift += w.s + (change += w.c)
        }
      }
      function d3_layout_treeAncestor (vim, v, ancestor) {
        return vim.a.parent === v.parent ? vim.a : ancestor
      }
      d3.layout.cluster = function () {
        var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false
        function cluster (d, i) {
          var nodes = hierarchy.call(this, d, i), root = nodes[0], previousNode, x = 0
          d3_layout_hierarchyVisitAfter(root, function (node) {
            var children = node.children
            if (children && children.length) {
              node.x = d3_layout_clusterX(children)
              node.y = d3_layout_clusterY(children)
            } else {
              node.x = previousNode ? x += separation(node, previousNode) : 0
              node.y = 0
              previousNode = node
            }
          })
          var left = d3_layout_clusterLeft(root), right = d3_layout_clusterRight(root), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2
          d3_layout_hierarchyVisitAfter(root, nodeSize ? function (node) {
            node.x = (node.x - root.x) * size[0]
            node.y = (root.y - node.y) * size[1]
          } : function (node) {
            node.x = (node.x - x0) / (x1 - x0) * size[0]
            node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1]
          })
          return nodes
        }
        cluster.separation = function (x) {
          if (!arguments.length) return separation
          separation = x
          return cluster
        }
        cluster.size = function (x) {
          if (!arguments.length) return nodeSize ? null : size
          nodeSize = (size = x) == null
          return cluster
        }
        cluster.nodeSize = function (x) {
          if (!arguments.length) return nodeSize ? size : null
          nodeSize = (size = x) != null
          return cluster
        }
        return d3_layout_hierarchyRebind(cluster, hierarchy)
      }
      function d3_layout_clusterY (children) {
        return 1 + d3.max(children, function (child) {
          return child.y
        })
      }
      function d3_layout_clusterX (children) {
        return children.reduce(function (x, child) {
          return x + child.x
        }, 0) / children.length
      }
      function d3_layout_clusterLeft (node) {
        var children = node.children
        return children && children.length ? d3_layout_clusterLeft(children[0]) : node
      }
      function d3_layout_clusterRight (node) {
        var children = node.children, n
        return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node
      }
      d3.layout.treemap = function () {
        var hierarchy = d3.layout.hierarchy(), round = Math.round, size = [ 1, 1 ], padding = null, pad = d3_layout_treemapPadNull, sticky = false, stickies, mode = 'squarify', ratio = 0.5 * (1 + Math.sqrt(5))
        function scale (children, k) {
          var i = -1, n = children.length, child, area
          while (++i < n) {
            area = (child = children[i]).value * (k < 0 ? 0 : k)
            child.area = isNaN(area) || area <= 0 ? 0 : area
          }
        }
        function squarify (node) {
          var children = node.children
          if (children && children.length) {
            var rect = pad(node), row = [], remaining = children.slice(), child, best = Infinity, score, u = mode === 'slice' ? rect.dx : mode === 'dice' ? rect.dy : mode === 'slice-dice' ? node.depth & 1 ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy), n
            scale(remaining, rect.dx * rect.dy / node.value)
            row.area = 0
            while ((n = remaining.length) > 0) {
              row.push(child = remaining[n - 1])
              row.area += child.area
              if (mode !== 'squarify' || (score = worst(row, u)) <= best) {
                remaining.pop()
                best = score
              } else {
                row.area -= row.pop().area
                position(row, u, rect, false)
                u = Math.min(rect.dx, rect.dy)
                row.length = row.area = 0
                best = Infinity
              }
            }
            if (row.length) {
              position(row, u, rect, true)
              row.length = row.area = 0
            }
            children.forEach(squarify)
          }
        }
        function stickify (node) {
          var children = node.children
          if (children && children.length) {
            var rect = pad(node), remaining = children.slice(), child, row = []
            scale(remaining, rect.dx * rect.dy / node.value)
            row.area = 0
            while (child = remaining.pop()) {
              row.push(child)
              row.area += child.area
              if (child.z != null) {
                position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length)
                row.length = row.area = 0
              }
            }
            children.forEach(stickify)
          }
        }
        function worst (row, u) {
          var s = row.area, r, rmax = 0, rmin = Infinity, i = -1, n = row.length
          while (++i < n) {
            if (!(r = row[i].area)) continue
            if (r < rmin) rmin = r
            if (r > rmax) rmax = r
          }
          s *= s
          u *= u
          return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity
        }
        function position (row, u, rect, flush) {
          var i = -1, n = row.length, x = rect.x, y = rect.y, v = u ? round(row.area / u) : 0, o
          if (u == rect.dx) {
            if (flush || v > rect.dy) v = rect.dy
            while (++i < n) {
              o = row[i]
              o.x = x
              o.y = y
              o.dy = v
              x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0)
            }
            o.z = true
            o.dx += rect.x + rect.dx - x
            rect.y += v
            rect.dy -= v
          } else {
            if (flush || v > rect.dx) v = rect.dx
            while (++i < n) {
              o = row[i]
              o.x = x
              o.y = y
              o.dx = v
              y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0)
            }
            o.z = false
            o.dy += rect.y + rect.dy - y
            rect.x += v
            rect.dx -= v
          }
        }
        function treemap (d) {
          var nodes = stickies || hierarchy(d), root = nodes[0]
          root.x = 0
          root.y = 0
          root.dx = size[0]
          root.dy = size[1]
          if (stickies) hierarchy.revalue(root)
          scale([ root ], root.dx * root.dy / root.value);
          (stickies ? stickify : squarify)(root)
          if (sticky) stickies = nodes
          return nodes
        }
        treemap.size = function (x) {
          if (!arguments.length) return size
          size = x
          return treemap
        }
        treemap.padding = function (x) {
          if (!arguments.length) return padding
          function padFunction (node) {
            var p = x.call(treemap, node, node.depth)
            return p == null ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, typeof p === 'number' ? [ p, p, p, p ] : p)
          }
          function padConstant (node) {
            return d3_layout_treemapPad(node, x)
          }
          var type
          pad = (padding = x) == null ? d3_layout_treemapPadNull : (type = typeof x) === 'function' ? padFunction : type === 'number' ? (x = [ x, x, x, x ],
      padConstant) : padConstant
          return treemap
        }
        treemap.round = function (x) {
          if (!arguments.length) return round != Number
          round = x ? Math.round : Number
          return treemap
        }
        treemap.sticky = function (x) {
          if (!arguments.length) return sticky
          sticky = x
          stickies = null
          return treemap
        }
        treemap.ratio = function (x) {
          if (!arguments.length) return ratio
          ratio = x
          return treemap
        }
        treemap.mode = function (x) {
          if (!arguments.length) return mode
          mode = x + ''
          return treemap
        }
        return d3_layout_hierarchyRebind(treemap, hierarchy)
      }
      function d3_layout_treemapPadNull (node) {
        return {
          x: node.x,
          y: node.y,
          dx: node.dx,
          dy: node.dy
        }
      }
      function d3_layout_treemapPad (node, padding) {
        var x = node.x + padding[3], y = node.y + padding[0], dx = node.dx - padding[1] - padding[3], dy = node.dy - padding[0] - padding[2]
        if (dx < 0) {
          x += dx / 2
          dx = 0
        }
        if (dy < 0) {
          y += dy / 2
          dy = 0
        }
        return {
          x: x,
          y: y,
          dx: dx,
          dy: dy
        }
      }
      d3.random = {
        normal: function (µ, σ) {
          var n = arguments.length
          if (n < 2) σ = 1
          if (n < 1) µ = 0
          return function () {
            var x, y, r
            do {
              x = Math.random() * 2 - 1
              y = Math.random() * 2 - 1
              r = x * x + y * y
            } while (!r || r > 1)
            return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r)
          }
        },
        logNormal: function () {
          var random = d3.random.normal.apply(d3, arguments)
          return function () {
            return Math.exp(random())
          }
        },
        bates: function (m) {
          var random = d3.random.irwinHall(m)
          return function () {
            return random() / m
          }
        },
        irwinHall: function (m) {
          return function () {
            for (var s = 0, j = 0; j < m; j++) s += Math.random()
            return s
          }
        }
      }
      d3.scale = {}
      function d3_scaleExtent (domain) {
        var start = domain[0], stop = domain[domain.length - 1]
        return start < stop ? [ start, stop ] : [ stop, start ]
      }
      function d3_scaleRange (scale) {
        return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range())
      }
      function d3_scale_bilinear (domain, range, uninterpolate, interpolate) {
        var u = uninterpolate(domain[0], domain[1]), i = interpolate(range[0], range[1])
        return function (x) {
          return i(u(x))
        }
      }
      function d3_scale_nice (domain, nice) {
        var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], dx
        if (x1 < x0) {
          dx = i0, i0 = i1, i1 = dx
          dx = x0, x0 = x1, x1 = dx
        }
        domain[i0] = nice.floor(x0)
        domain[i1] = nice.ceil(x1)
        return domain
      }
      function d3_scale_niceStep (step) {
        return step ? {
          floor: function (x) {
            return Math.floor(x / step) * step
          },
          ceil: function (x) {
            return Math.ceil(x / step) * step
          }
        } : d3_scale_niceIdentity
      }
      var d3_scale_niceIdentity = {
        floor: d3_identity,
        ceil: d3_identity
      }
      function d3_scale_polylinear (domain, range, uninterpolate, interpolate) {
        var u = [], i = [], j = 0, k = Math.min(domain.length, range.length) - 1
        if (domain[k] < domain[0]) {
          domain = domain.slice().reverse()
          range = range.slice().reverse()
        }
        while (++j <= k) {
          u.push(uninterpolate(domain[j - 1], domain[j]))
          i.push(interpolate(range[j - 1], range[j]))
        }
        return function (x) {
          var j = d3.bisect(domain, x, 1, k) - 1
          return i[j](u[j](x))
        }
      }
      d3.scale.linear = function () {
        return d3_scale_linear([ 0, 1 ], [ 0, 1 ], d3_interpolate, false)
      }
      function d3_scale_linear (domain, range, interpolate, clamp) {
        var output, input
        function rescale () {
          var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear, uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber
          output = linear(domain, range, uninterpolate, interpolate)
          input = linear(range, domain, uninterpolate, d3_interpolate)
          return scale
        }
        function scale (x) {
          return output(x)
        }
        scale.invert = function (y) {
          return input(y)
        }
        scale.domain = function (x) {
          if (!arguments.length) return domain
          domain = x.map(Number)
          return rescale()
        }
        scale.range = function (x) {
          if (!arguments.length) return range
          range = x
          return rescale()
        }
        scale.rangeRound = function (x) {
          return scale.range(x).interpolate(d3_interpolateRound)
        }
        scale.clamp = function (x) {
          if (!arguments.length) return clamp
          clamp = x
          return rescale()
        }
        scale.interpolate = function (x) {
          if (!arguments.length) return interpolate
          interpolate = x
          return rescale()
        }
        scale.ticks = function (m) {
          return d3_scale_linearTicks(domain, m)
        }
        scale.tickFormat = function (m, format) {
          return d3_scale_linearTickFormat(domain, m, format)
        }
        scale.nice = function (m) {
          d3_scale_linearNice(domain, m)
          return rescale()
        }
        scale.copy = function () {
          return d3_scale_linear(domain, range, interpolate, clamp)
        }
        return rescale()
      }
      function d3_scale_linearRebind (scale, linear) {
        return d3.rebind(scale, linear, 'range', 'rangeRound', 'interpolate', 'clamp')
      }
      function d3_scale_linearNice (domain, m) {
        return d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]))
      }
      function d3_scale_linearTickRange (domain, m) {
        if (m == null) m = 10
        var extent = d3_scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step
        if (err <= 0.15) step *= 10; else if (err <= 0.35) step *= 5; else if (err <= 0.75) step *= 2
        extent[0] = Math.ceil(extent[0] / step) * step
        extent[1] = Math.floor(extent[1] / step) * step + step * 0.5
        extent[2] = step
        return extent
      }
      function d3_scale_linearTicks (domain, m) {
        return d3.range.apply(d3, d3_scale_linearTickRange(domain, m))
      }
      function d3_scale_linearTickFormat (domain, m, format) {
        var range = d3_scale_linearTickRange(domain, m)
        if (format) {
          var match = d3_format_re.exec(format)
          match.shift()
          if (match[8] === 's') {
            var prefix = d3.formatPrefix(Math.max(abs(range[0]), abs(range[1])))
            if (!match[7]) match[7] = '.' + d3_scale_linearPrecision(prefix.scale(range[2]))
            match[8] = 'f'
            format = d3.format(match.join(''))
            return function (d) {
              return format(prefix.scale(d)) + prefix.symbol
            }
          }
          if (!match[7]) match[7] = '.' + d3_scale_linearFormatPrecision(match[8], range)
          format = match.join('')
        } else {
          format = ',.' + d3_scale_linearPrecision(range[2]) + 'f'
        }
        return d3.format(format)
      }
      var d3_scale_linearFormatSignificant = {
        s: 1,
        g: 1,
        p: 1,
        r: 1,
        e: 1
      }
      function d3_scale_linearPrecision (value) {
        return -Math.floor(Math.log(value) / Math.LN10 + 0.01)
      }
      function d3_scale_linearFormatPrecision (type, range) {
        var p = d3_scale_linearPrecision(range[2])
        return type in d3_scale_linearFormatSignificant ? Math.abs(p - d3_scale_linearPrecision(Math.max(abs(range[0]), abs(range[1])))) + +(type !== 'e') : p - (type === '%') * 2
      }
      d3.scale.log = function () {
        return d3_scale_log(d3.scale.linear().domain([ 0, 1 ]), 10, true, [ 1, 10 ])
      }
      function d3_scale_log (linear, base, positive, domain) {
        function log (x) {
          return (positive ? Math.log(x < 0 ? 0 : x) : -Math.log(x > 0 ? 0 : -x)) / Math.log(base)
        }
        function pow (x) {
          return positive ? Math.pow(base, x) : -Math.pow(base, -x)
        }
        function scale (x) {
          return linear(log(x))
        }
        scale.invert = function (x) {
          return pow(linear.invert(x))
        }
        scale.domain = function (x) {
          if (!arguments.length) return domain
          positive = x[0] >= 0
          linear.domain((domain = x.map(Number)).map(log))
          return scale
        }
        scale.base = function (_) {
          if (!arguments.length) return base
          base = +_
          linear.domain(domain.map(log))
          return scale
        }
        scale.nice = function () {
          var niced = d3_scale_nice(domain.map(log), positive ? Math : d3_scale_logNiceNegative)
          linear.domain(niced)
          domain = niced.map(pow)
          return scale
        }
        scale.ticks = function () {
          var extent = d3_scaleExtent(domain), ticks = [], u = extent[0], v = extent[1], i = Math.floor(log(u)), j = Math.ceil(log(v)), n = base % 1 ? 2 : base
          if (isFinite(j - i)) {
            if (positive) {
              for (;i < j; i++) for (var k = 1; k < n; k++) ticks.push(pow(i) * k)
              ticks.push(pow(i))
            } else {
              ticks.push(pow(i))
              for (;i++ < j;) for (var k = n - 1; k > 0; k--) ticks.push(pow(i) * k)
            }
            for (i = 0; ticks[i] < u; i++) {}
            for (j = ticks.length; ticks[j - 1] > v; j--) {}
            ticks = ticks.slice(i, j)
          }
          return ticks
        }
        scale.tickFormat = function (n, format) {
          if (!arguments.length) return d3_scale_logFormat
          if (arguments.length < 2) format = d3_scale_logFormat; else if (typeof format !== 'function') format = d3.format(format)
          var k = Math.max(0.1, n / scale.ticks().length), f = positive ? (e = 1e-12, Math.ceil) : (e = -1e-12,
      Math.floor), e
          return function (d) {
            return d / pow(f(log(d) + e)) <= k ? format(d) : ''
          }
        }
        scale.copy = function () {
          return d3_scale_log(linear.copy(), base, positive, domain)
        }
        return d3_scale_linearRebind(scale, linear)
      }
      var d3_scale_logFormat = d3.format('.0e'), d3_scale_logNiceNegative = {
          floor: function (x) {
            return -Math.ceil(-x)
          },
          ceil: function (x) {
            return -Math.floor(-x)
          }
        }
      d3.scale.pow = function () {
        return d3_scale_pow(d3.scale.linear(), 1, [ 0, 1 ])
      }
      function d3_scale_pow (linear, exponent, domain) {
        var powp = d3_scale_powPow(exponent), powb = d3_scale_powPow(1 / exponent)
        function scale (x) {
          return linear(powp(x))
        }
        scale.invert = function (x) {
          return powb(linear.invert(x))
        }
        scale.domain = function (x) {
          if (!arguments.length) return domain
          linear.domain((domain = x.map(Number)).map(powp))
          return scale
        }
        scale.ticks = function (m) {
          return d3_scale_linearTicks(domain, m)
        }
        scale.tickFormat = function (m, format) {
          return d3_scale_linearTickFormat(domain, m, format)
        }
        scale.nice = function (m) {
          return scale.domain(d3_scale_linearNice(domain, m))
        }
        scale.exponent = function (x) {
          if (!arguments.length) return exponent
          powp = d3_scale_powPow(exponent = x)
          powb = d3_scale_powPow(1 / exponent)
          linear.domain(domain.map(powp))
          return scale
        }
        scale.copy = function () {
          return d3_scale_pow(linear.copy(), exponent, domain)
        }
        return d3_scale_linearRebind(scale, linear)
      }
      function d3_scale_powPow (e) {
        return function (x) {
          return x < 0 ? -Math.pow(-x, e) : Math.pow(x, e)
        }
      }
      d3.scale.sqrt = function () {
        return d3.scale.pow().exponent(0.5)
      }
      d3.scale.ordinal = function () {
        return d3_scale_ordinal([], {
          t: 'range',
          a: [ [] ]
        })
      }
      function d3_scale_ordinal (domain, ranger) {
        var index, range, rangeBand
        function scale (x) {
          return range[((index.get(x) || (ranger.t === 'range' ? index.set(x, domain.push(x)) : NaN)) - 1) % range.length]
        }
        function steps (start, step) {
          return d3.range(domain.length).map(function (i) {
            return start + step * i
          })
        }
        scale.domain = function (x) {
          if (!arguments.length) return domain
          domain = []
          index = new d3_Map()
          var i = -1, n = x.length, xi
          while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi))
          return scale[ranger.t].apply(scale, ranger.a)
        }
        scale.range = function (x) {
          if (!arguments.length) return range
          range = x
          rangeBand = 0
          ranger = {
            t: 'range',
            a: arguments
          }
          return scale
        }
        scale.rangePoints = function (x, padding) {
          if (arguments.length < 2) padding = 0
          var start = x[0], stop = x[1], step = domain.length < 2 ? (start = (start + stop) / 2,
      0) : (stop - start) / (domain.length - 1 + padding)
          range = steps(start + step * padding / 2, step)
          rangeBand = 0
          ranger = {
            t: 'rangePoints',
            a: arguments
          }
          return scale
        }
        scale.rangeRoundPoints = function (x, padding) {
          if (arguments.length < 2) padding = 0
          var start = x[0], stop = x[1], step = domain.length < 2 ? (start = stop = Math.round((start + stop) / 2),
      0) : (stop - start) / (domain.length - 1 + padding) | 0
          range = steps(start + Math.round(step * padding / 2 + (stop - start - (domain.length - 1 + padding) * step) / 2), step)
          rangeBand = 0
          ranger = {
            t: 'rangeRoundPoints',
            a: arguments
          }
          return scale
        }
        scale.rangeBands = function (x, padding, outerPadding) {
          if (arguments.length < 2) padding = 0
          if (arguments.length < 3) outerPadding = padding
          var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding)
          range = steps(start + step * outerPadding, step)
          if (reverse) range.reverse()
          rangeBand = step * (1 - padding)
          ranger = {
            t: 'rangeBands',
            a: arguments
          }
          return scale
        }
        scale.rangeRoundBands = function (x, padding, outerPadding) {
          if (arguments.length < 2) padding = 0
          if (arguments.length < 3) outerPadding = padding
          var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding))
          range = steps(start + Math.round((stop - start - (domain.length - padding) * step) / 2), step)
          if (reverse) range.reverse()
          rangeBand = Math.round(step * (1 - padding))
          ranger = {
            t: 'rangeRoundBands',
            a: arguments
          }
          return scale
        }
        scale.rangeBand = function () {
          return rangeBand
        }
        scale.rangeExtent = function () {
          return d3_scaleExtent(ranger.a[0])
        }
        scale.copy = function () {
          return d3_scale_ordinal(domain, ranger)
        }
        return scale.domain(domain)
      }
      d3.scale.category10 = function () {
        return d3.scale.ordinal().range(d3_category10)
      }
      d3.scale.category20 = function () {
        return d3.scale.ordinal().range(d3_category20)
      }
      d3.scale.category20b = function () {
        return d3.scale.ordinal().range(d3_category20b)
      }
      d3.scale.category20c = function () {
        return d3.scale.ordinal().range(d3_category20c)
      }
      var d3_category10 = [ 2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175 ].map(d3_rgbString)
      var d3_category20 = [ 2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725 ].map(d3_rgbString)
      var d3_category20b = [ 3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654 ].map(d3_rgbString)
      var d3_category20c = [ 3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081 ].map(d3_rgbString)
      d3.scale.quantile = function () {
        return d3_scale_quantile([], [])
      }
      function d3_scale_quantile (domain, range) {
        var thresholds
        function rescale () {
          var k = 0, q = range.length
          thresholds = []
          while (++k < q) thresholds[k - 1] = d3.quantile(domain, k / q)
          return scale
        }
        function scale (x) {
          if (!isNaN(x = +x)) return range[d3.bisect(thresholds, x)]
        }
        scale.domain = function (x) {
          if (!arguments.length) return domain
          domain = x.map(d3_number).filter(d3_numeric).sort(d3_ascending)
          return rescale()
        }
        scale.range = function (x) {
          if (!arguments.length) return range
          range = x
          return rescale()
        }
        scale.quantiles = function () {
          return thresholds
        }
        scale.invertExtent = function (y) {
          y = range.indexOf(y)
          return y < 0 ? [ NaN, NaN ] : [ y > 0 ? thresholds[y - 1] : domain[0], y < thresholds.length ? thresholds[y] : domain[domain.length - 1] ]
        }
        scale.copy = function () {
          return d3_scale_quantile(domain, range)
        }
        return rescale()
      }
      d3.scale.quantize = function () {
        return d3_scale_quantize(0, 1, [ 0, 1 ])
      }
      function d3_scale_quantize (x0, x1, range) {
        var kx, i
        function scale (x) {
          return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))]
        }
        function rescale () {
          kx = range.length / (x1 - x0)
          i = range.length - 1
          return scale
        }
        scale.domain = function (x) {
          if (!arguments.length) return [ x0, x1 ]
          x0 = +x[0]
          x1 = +x[x.length - 1]
          return rescale()
        }
        scale.range = function (x) {
          if (!arguments.length) return range
          range = x
          return rescale()
        }
        scale.invertExtent = function (y) {
          y = range.indexOf(y)
          y = y < 0 ? NaN : y / kx + x0
          return [ y, y + 1 / kx ]
        }
        scale.copy = function () {
          return d3_scale_quantize(x0, x1, range)
        }
        return rescale()
      }
      d3.scale.threshold = function () {
        return d3_scale_threshold([ 0.5 ], [ 0, 1 ])
      }
      function d3_scale_threshold (domain, range) {
        function scale (x) {
          if (x <= x) return range[d3.bisect(domain, x)]
        }
        scale.domain = function (_) {
          if (!arguments.length) return domain
          domain = _
          return scale
        }
        scale.range = function (_) {
          if (!arguments.length) return range
          range = _
          return scale
        }
        scale.invertExtent = function (y) {
          y = range.indexOf(y)
          return [ domain[y - 1], domain[y] ]
        }
        scale.copy = function () {
          return d3_scale_threshold(domain, range)
        }
        return scale
      }
      d3.scale.identity = function () {
        return d3_scale_identity([ 0, 1 ])
      }
      function d3_scale_identity (domain) {
        function identity (x) {
          return +x
        }
        identity.invert = identity
        identity.domain = identity.range = function (x) {
          if (!arguments.length) return domain
          domain = x.map(identity)
          return identity
        }
        identity.ticks = function (m) {
          return d3_scale_linearTicks(domain, m)
        }
        identity.tickFormat = function (m, format) {
          return d3_scale_linearTickFormat(domain, m, format)
        }
        identity.copy = function () {
          return d3_scale_identity(domain)
        }
        return identity
      }
      d3.svg = {}
      function d3_zero () {
        return 0
      }
      d3.svg.arc = function () {
        var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, cornerRadius = d3_zero, padRadius = d3_svg_arcAuto, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle, padAngle = d3_svg_arcPadAngle
        function arc () {
          var r0 = Math.max(0, +innerRadius.apply(this, arguments)), r1 = Math.max(0, +outerRadius.apply(this, arguments)), a0 = startAngle.apply(this, arguments) - halfπ, a1 = endAngle.apply(this, arguments) - halfπ, da = Math.abs(a1 - a0), cw = a0 > a1 ? 0 : 1
          if (r1 < r0) rc = r1, r1 = r0, r0 = rc
          if (da >= τε) return circleSegment(r1, cw) + (r0 ? circleSegment(r0, 1 - cw) : '') + 'Z'
          var rc, cr, rp, ap, p0 = 0, p1 = 0, x0, y0, x1, y1, x2, y2, x3, y3, path = []
          if (ap = (+padAngle.apply(this, arguments) || 0) / 2) {
            rp = padRadius === d3_svg_arcAuto ? Math.sqrt(r0 * r0 + r1 * r1) : +padRadius.apply(this, arguments)
            if (!cw) p1 *= -1
            if (r1) p1 = d3_asin(rp / r1 * Math.sin(ap))
            if (r0) p0 = d3_asin(rp / r0 * Math.sin(ap))
          }
          if (r1) {
            x0 = r1 * Math.cos(a0 + p1)
            y0 = r1 * Math.sin(a0 + p1)
            x1 = r1 * Math.cos(a1 - p1)
            y1 = r1 * Math.sin(a1 - p1)
            var l1 = Math.abs(a1 - a0 - 2 * p1) <= π ? 0 : 1
            if (p1 && d3_svg_arcSweep(x0, y0, x1, y1) === cw ^ l1) {
              var h1 = (a0 + a1) / 2
              x0 = r1 * Math.cos(h1)
              y0 = r1 * Math.sin(h1)
              x1 = y1 = null
            }
          } else {
            x0 = y0 = 0
          }
          if (r0) {
            x2 = r0 * Math.cos(a1 - p0)
            y2 = r0 * Math.sin(a1 - p0)
            x3 = r0 * Math.cos(a0 + p0)
            y3 = r0 * Math.sin(a0 + p0)
            var l0 = Math.abs(a0 - a1 + 2 * p0) <= π ? 0 : 1
            if (p0 && d3_svg_arcSweep(x2, y2, x3, y3) === 1 - cw ^ l0) {
              var h0 = (a0 + a1) / 2
              x2 = r0 * Math.cos(h0)
              y2 = r0 * Math.sin(h0)
              x3 = y3 = null
            }
          } else {
            x2 = y2 = 0
          }
          if ((rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments))) > 0.001) {
            cr = r0 < r1 ^ cw ? 0 : 1
            var oc = x3 == null ? [ x2, y2 ] : x1 == null ? [ x0, y0 ] : d3_geom_polygonIntersect([ x0, y0 ], [ x3, y3 ], [ x1, y1 ], [ x2, y2 ]), ax = x0 - oc[0], ay = y0 - oc[1], bx = x1 - oc[0], by = y1 - oc[1], kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2), lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1])
            if (x1 != null) {
              var rc1 = Math.min(rc, (r1 - lc) / (kc + 1)), t30 = d3_svg_arcCornerTangents(x3 == null ? [ x2, y2 ] : [ x3, y3 ], [ x0, y0 ], r1, rc1, cw), t12 = d3_svg_arcCornerTangents([ x1, y1 ], [ x2, y2 ], r1, rc1, cw)
              if (rc === rc1) {
                path.push('M', t30[0], 'A', rc1, ',', rc1, ' 0 0,', cr, ' ', t30[1], 'A', r1, ',', r1, ' 0 ', 1 - cw ^ d3_svg_arcSweep(t30[1][0], t30[1][1], t12[1][0], t12[1][1]), ',', cw, ' ', t12[1], 'A', rc1, ',', rc1, ' 0 0,', cr, ' ', t12[0])
              } else {
                path.push('M', t30[0], 'A', rc1, ',', rc1, ' 0 1,', cr, ' ', t12[0])
              }
            } else {
              path.push('M', x0, ',', y0)
            }
            if (x3 != null) {
              var rc0 = Math.min(rc, (r0 - lc) / (kc - 1)), t03 = d3_svg_arcCornerTangents([ x0, y0 ], [ x3, y3 ], r0, -rc0, cw), t21 = d3_svg_arcCornerTangents([ x2, y2 ], x1 == null ? [ x0, y0 ] : [ x1, y1 ], r0, -rc0, cw)
              if (rc === rc0) {
                path.push('L', t21[0], 'A', rc0, ',', rc0, ' 0 0,', cr, ' ', t21[1], 'A', r0, ',', r0, ' 0 ', cw ^ d3_svg_arcSweep(t21[1][0], t21[1][1], t03[1][0], t03[1][1]), ',', 1 - cw, ' ', t03[1], 'A', rc0, ',', rc0, ' 0 0,', cr, ' ', t03[0])
              } else {
                path.push('L', t21[0], 'A', rc0, ',', rc0, ' 0 0,', cr, ' ', t03[0])
              }
            } else {
              path.push('L', x2, ',', y2)
            }
          } else {
            path.push('M', x0, ',', y0)
            if (x1 != null) path.push('A', r1, ',', r1, ' 0 ', l1, ',', cw, ' ', x1, ',', y1)
            path.push('L', x2, ',', y2)
            if (x3 != null) path.push('A', r0, ',', r0, ' 0 ', l0, ',', 1 - cw, ' ', x3, ',', y3)
          }
          path.push('Z')
          return path.join('')
        }
        function circleSegment (r1, cw) {
          return 'M0,' + r1 + 'A' + r1 + ',' + r1 + ' 0 1,' + cw + ' 0,' + -r1 + 'A' + r1 + ',' + r1 + ' 0 1,' + cw + ' 0,' + r1
        }
        arc.innerRadius = function (v) {
          if (!arguments.length) return innerRadius
          innerRadius = d3_functor(v)
          return arc
        }
        arc.outerRadius = function (v) {
          if (!arguments.length) return outerRadius
          outerRadius = d3_functor(v)
          return arc
        }
        arc.cornerRadius = function (v) {
          if (!arguments.length) return cornerRadius
          cornerRadius = d3_functor(v)
          return arc
        }
        arc.padRadius = function (v) {
          if (!arguments.length) return padRadius
          padRadius = v == d3_svg_arcAuto ? d3_svg_arcAuto : d3_functor(v)
          return arc
        }
        arc.startAngle = function (v) {
          if (!arguments.length) return startAngle
          startAngle = d3_functor(v)
          return arc
        }
        arc.endAngle = function (v) {
          if (!arguments.length) return endAngle
          endAngle = d3_functor(v)
          return arc
        }
        arc.padAngle = function (v) {
          if (!arguments.length) return padAngle
          padAngle = d3_functor(v)
          return arc
        }
        arc.centroid = function () {
          var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - halfπ
          return [ Math.cos(a) * r, Math.sin(a) * r ]
        }
        return arc
      }
      var d3_svg_arcAuto = 'auto'
      function d3_svg_arcInnerRadius (d) {
        return d.innerRadius
      }
      function d3_svg_arcOuterRadius (d) {
        return d.outerRadius
      }
      function d3_svg_arcStartAngle (d) {
        return d.startAngle
      }
      function d3_svg_arcEndAngle (d) {
        return d.endAngle
      }
      function d3_svg_arcPadAngle (d) {
        return d && d.padAngle
      }
      function d3_svg_arcSweep (x0, y0, x1, y1) {
        return (x0 - x1) * y0 - (y0 - y1) * x0 > 0 ? 0 : 1
      }
      function d3_svg_arcCornerTangents (p0, p1, r1, rc, cw) {
        var x01 = p0[0] - p1[0], y01 = p0[1] - p1[1], lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x1 = p0[0] + ox, y1 = p0[1] + oy, x2 = p1[0] + ox, y2 = p1[1] + oy, x3 = (x1 + x2) / 2, y3 = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, d2 = dx * dx + dy * dy, r = r1 - rc, D = x1 * y2 - x2 * y1, d = (dy < 0 ? -1 : 1) * Math.sqrt(r * r * d2 - D * D), cx0 = (D * dy - dx * d) / d2, cy0 = (-D * dx - dy * d) / d2, cx1 = (D * dy + dx * d) / d2, cy1 = (-D * dx + dy * d) / d2, dx0 = cx0 - x3, dy0 = cy0 - y3, dx1 = cx1 - x3, dy1 = cy1 - y3
        if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1
        return [ [ cx0 - ox, cy0 - oy ], [ cx0 * r1 / r, cy0 * r1 / r ] ]
      }
      function d3_svg_line (projection) {
        var x = d3_geom_pointX, y = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, tension = 0.7
        function line (data) {
          var segments = [], points = [], i = -1, n = data.length, d, fx = d3_functor(x), fy = d3_functor(y)
          function segment () {
            segments.push('M', interpolate(projection(points), tension))
          }
          while (++i < n) {
            if (defined.call(this, d = data[i], i)) {
              points.push([ +fx.call(this, d, i), +fy.call(this, d, i) ])
            } else if (points.length) {
              segment()
              points = []
            }
          }
          if (points.length) segment()
          return segments.length ? segments.join('') : null
        }
        line.x = function (_) {
          if (!arguments.length) return x
          x = _
          return line
        }
        line.y = function (_) {
          if (!arguments.length) return y
          y = _
          return line
        }
        line.defined = function (_) {
          if (!arguments.length) return defined
          defined = _
          return line
        }
        line.interpolate = function (_) {
          if (!arguments.length) return interpolateKey
          if (typeof _ === 'function') interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key
          return line
        }
        line.tension = function (_) {
          if (!arguments.length) return tension
          tension = _
          return line
        }
        return line
      }
      d3.svg.line = function () {
        return d3_svg_line(d3_identity)
      }
      var d3_svg_lineInterpolators = d3.map({
        linear: d3_svg_lineLinear,
        'linear-closed': d3_svg_lineLinearClosed,
        step: d3_svg_lineStep,
        'step-before': d3_svg_lineStepBefore,
        'step-after': d3_svg_lineStepAfter,
        basis: d3_svg_lineBasis,
        'basis-open': d3_svg_lineBasisOpen,
        'basis-closed': d3_svg_lineBasisClosed,
        bundle: d3_svg_lineBundle,
        cardinal: d3_svg_lineCardinal,
        'cardinal-open': d3_svg_lineCardinalOpen,
        'cardinal-closed': d3_svg_lineCardinalClosed,
        monotone: d3_svg_lineMonotone
      })
      d3_svg_lineInterpolators.forEach(function (key, value) {
        value.key = key
        value.closed = /-closed$/.test(key)
      })
      function d3_svg_lineLinear (points) {
        return points.join('L')
      }
      function d3_svg_lineLinearClosed (points) {
        return d3_svg_lineLinear(points) + 'Z'
      }
      function d3_svg_lineStep (points) {
        var i = 0, n = points.length, p = points[0], path = [ p[0], ',', p[1] ]
        while (++i < n) path.push('H', (p[0] + (p = points[i])[0]) / 2, 'V', p[1])
        if (n > 1) path.push('H', p[0])
        return path.join('')
      }
      function d3_svg_lineStepBefore (points) {
        var i = 0, n = points.length, p = points[0], path = [ p[0], ',', p[1] ]
        while (++i < n) path.push('V', (p = points[i])[1], 'H', p[0])
        return path.join('')
      }
      function d3_svg_lineStepAfter (points) {
        var i = 0, n = points.length, p = points[0], path = [ p[0], ',', p[1] ]
        while (++i < n) path.push('H', (p = points[i])[0], 'V', p[1])
        return path.join('')
      }
      function d3_svg_lineCardinalOpen (points, tension) {
        return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, -1), d3_svg_lineCardinalTangents(points, tension))
      }
      function d3_svg_lineCardinalClosed (points, tension) {
        return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite((points.push(points[0]),
    points), d3_svg_lineCardinalTangents([ points[points.length - 2] ].concat(points, [ points[1] ]), tension))
      }
      function d3_svg_lineCardinal (points, tension) {
        return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension))
      }
      function d3_svg_lineHermite (points, tangents) {
        if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {
          return d3_svg_lineLinear(points)
        }
        var quad = points.length != tangents.length, path = '', p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1
        if (quad) {
          path += 'Q' + (p[0] - t0[0] * 2 / 3) + ',' + (p[1] - t0[1] * 2 / 3) + ',' + p[0] + ',' + p[1]
          p0 = points[1]
          pi = 2
        }
        if (tangents.length > 1) {
          t = tangents[1]
          p = points[pi]
          pi++
          path += 'C' + (p0[0] + t0[0]) + ',' + (p0[1] + t0[1]) + ',' + (p[0] - t[0]) + ',' + (p[1] - t[1]) + ',' + p[0] + ',' + p[1]
          for (var i = 2; i < tangents.length; i++, pi++) {
            p = points[pi]
            t = tangents[i]
            path += 'S' + (p[0] - t[0]) + ',' + (p[1] - t[1]) + ',' + p[0] + ',' + p[1]
          }
        }
        if (quad) {
          var lp = points[pi]
          path += 'Q' + (p[0] + t[0] * 2 / 3) + ',' + (p[1] + t[1] * 2 / 3) + ',' + lp[0] + ',' + lp[1]
        }
        return path
      }
      function d3_svg_lineCardinalTangents (points, tension) {
        var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length
        while (++i < n) {
          p0 = p1
          p1 = p2
          p2 = points[i]
          tangents.push([ a * (p2[0] - p0[0]), a * (p2[1] - p0[1]) ])
        }
        return tangents
      }
      function d3_svg_lineBasis (points) {
        if (points.length < 3) return d3_svg_lineLinear(points)
        var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [ x0, x0, x0, (pi = points[1])[0] ], py = [ y0, y0, y0, pi[1] ], path = [ x0, ',', y0, 'L', d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ',', d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ]
        points.push(points[n - 1])
        while (++i <= n) {
          pi = points[i]
          px.shift()
          px.push(pi[0])
          py.shift()
          py.push(pi[1])
          d3_svg_lineBasisBezier(path, px, py)
        }
        points.pop()
        path.push('L', pi)
        return path.join('')
      }
      function d3_svg_lineBasisOpen (points) {
        if (points.length < 4) return d3_svg_lineLinear(points)
        var path = [], i = -1, n = points.length, pi, px = [ 0 ], py = [ 0 ]
        while (++i < 3) {
          pi = points[i]
          px.push(pi[0])
          py.push(pi[1])
        }
        path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + ',' + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py))
        --i
        while (++i < n) {
          pi = points[i]
          px.shift()
          px.push(pi[0])
          py.shift()
          py.push(pi[1])
          d3_svg_lineBasisBezier(path, px, py)
        }
        return path.join('')
      }
      function d3_svg_lineBasisClosed (points) {
        var path, i = -1, n = points.length, m = n + 4, pi, px = [], py = []
        while (++i < 4) {
          pi = points[i % n]
          px.push(pi[0])
          py.push(pi[1])
        }
        path = [ d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ',', d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ]
        --i
        while (++i < m) {
          pi = points[i % n]
          px.shift()
          px.push(pi[0])
          py.shift()
          py.push(pi[1])
          d3_svg_lineBasisBezier(path, px, py)
        }
        return path.join('')
      }
      function d3_svg_lineBundle (points, tension) {
        var n = points.length - 1
        if (n) {
          var x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1, p, t
          while (++i <= n) {
            p = points[i]
            t = i / n
            p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx)
            p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy)
          }
        }
        return d3_svg_lineBasis(points)
      }
      function d3_svg_lineDot4 (a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
      }
      var d3_svg_lineBasisBezier1 = [ 0, 2 / 3, 1 / 3, 0 ], d3_svg_lineBasisBezier2 = [ 0, 1 / 3, 2 / 3, 0 ], d3_svg_lineBasisBezier3 = [ 0, 1 / 6, 2 / 3, 1 / 6 ]
      function d3_svg_lineBasisBezier (path, x, y) {
        path.push('C', d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), ',', d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), ',', d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), ',', d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), ',', d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), ',', d3_svg_lineDot4(d3_svg_lineBasisBezier3, y))
      }
      function d3_svg_lineSlope (p0, p1) {
        return (p1[1] - p0[1]) / (p1[0] - p0[0])
      }
      function d3_svg_lineFiniteDifferences (points) {
        var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = d3_svg_lineSlope(p0, p1)
        while (++i < j) {
          m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2
        }
        m[i] = d
        return m
      }
      function d3_svg_lineMonotoneTangents (points) {
        var tangents = [], d, a, b, s, m = d3_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1
        while (++i < j) {
          d = d3_svg_lineSlope(points[i], points[i + 1])
          if (abs(d) < ε) {
            m[i] = m[i + 1] = 0
          } else {
            a = m[i] / d
            b = m[i + 1] / d
            s = a * a + b * b
            if (s > 9) {
              s = d * 3 / Math.sqrt(s)
              m[i] = s * a
              m[i + 1] = s * b
            }
          }
        }
        i = -1
        while (++i <= j) {
          s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]))
          tangents.push([ s || 0, m[i] * s || 0 ])
        }
        return tangents
      }
      function d3_svg_lineMonotone (points) {
        return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points))
      }
      d3.svg.line.radial = function () {
        var line = d3_svg_line(d3_svg_lineRadial)
        line.radius = line.x, delete line.x
        line.angle = line.y, delete line.y
        return line
      }
      function d3_svg_lineRadial (points) {
        var point, i = -1, n = points.length, r, a
        while (++i < n) {
          point = points[i]
          r = point[0]
          a = point[1] - halfπ
          point[0] = r * Math.cos(a)
          point[1] = r * Math.sin(a)
        }
        return points
      }
      function d3_svg_area (projection) {
        var x0 = d3_geom_pointX, x1 = d3_geom_pointX, y0 = 0, y1 = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, interpolateReverse = interpolate, L = 'L', tension = 0.7
        function area (data) {
          var segments = [], points0 = [], points1 = [], i = -1, n = data.length, d, fx0 = d3_functor(x0), fy0 = d3_functor(y0), fx1 = x0 === x1 ? function () {
              return x
            } : d3_functor(x1), fy1 = y0 === y1 ? function () {
              return y
            } : d3_functor(y1), x, y
          function segment () {
            segments.push('M', interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), 'Z')
          }
          while (++i < n) {
            if (defined.call(this, d = data[i], i)) {
              points0.push([ x = +fx0.call(this, d, i), y = +fy0.call(this, d, i) ])
              points1.push([ +fx1.call(this, d, i), +fy1.call(this, d, i) ])
            } else if (points0.length) {
              segment()
              points0 = []
              points1 = []
            }
          }
          if (points0.length) segment()
          return segments.length ? segments.join('') : null
        }
        area.x = function (_) {
          if (!arguments.length) return x1
          x0 = x1 = _
          return area
        }
        area.x0 = function (_) {
          if (!arguments.length) return x0
          x0 = _
          return area
        }
        area.x1 = function (_) {
          if (!arguments.length) return x1
          x1 = _
          return area
        }
        area.y = function (_) {
          if (!arguments.length) return y1
          y0 = y1 = _
          return area
        }
        area.y0 = function (_) {
          if (!arguments.length) return y0
          y0 = _
          return area
        }
        area.y1 = function (_) {
          if (!arguments.length) return y1
          y1 = _
          return area
        }
        area.defined = function (_) {
          if (!arguments.length) return defined
          defined = _
          return area
        }
        area.interpolate = function (_) {
          if (!arguments.length) return interpolateKey
          if (typeof _ === 'function') interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key
          interpolateReverse = interpolate.reverse || interpolate
          L = interpolate.closed ? 'M' : 'L'
          return area
        }
        area.tension = function (_) {
          if (!arguments.length) return tension
          tension = _
          return area
        }
        return area
      }
      d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter
      d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore
      d3.svg.area = function () {
        return d3_svg_area(d3_identity)
      }
      d3.svg.area.radial = function () {
        var area = d3_svg_area(d3_svg_lineRadial)
        area.radius = area.x, delete area.x
        area.innerRadius = area.x0, delete area.x0
        area.outerRadius = area.x1, delete area.x1
        area.angle = area.y, delete area.y
        area.startAngle = area.y0, delete area.y0
        area.endAngle = area.y1, delete area.y1
        return area
      }
      d3.svg.chord = function () {
        var source = d3_source, target = d3_target, radius = d3_svg_chordRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle
        function chord (d, i) {
          var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i)
          return 'M' + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + 'Z'
        }
        function subgroup (self, f, d, i) {
          var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) - halfπ, a1 = endAngle.call(self, subgroup, i) - halfπ
          return {
            r: r,
            a0: a0,
            a1: a1,
            p0: [ r * Math.cos(a0), r * Math.sin(a0) ],
            p1: [ r * Math.cos(a1), r * Math.sin(a1) ]
          }
        }
        function equals (a, b) {
          return a.a0 == b.a0 && a.a1 == b.a1
        }
        function arc (r, p, a) {
          return 'A' + r + ',' + r + ' 0 ' + +(a > π) + ',1 ' + p
        }
        function curve (r0, p0, r1, p1) {
          return 'Q 0,0 ' + p1
        }
        chord.radius = function (v) {
          if (!arguments.length) return radius
          radius = d3_functor(v)
          return chord
        }
        chord.source = function (v) {
          if (!arguments.length) return source
          source = d3_functor(v)
          return chord
        }
        chord.target = function (v) {
          if (!arguments.length) return target
          target = d3_functor(v)
          return chord
        }
        chord.startAngle = function (v) {
          if (!arguments.length) return startAngle
          startAngle = d3_functor(v)
          return chord
        }
        chord.endAngle = function (v) {
          if (!arguments.length) return endAngle
          endAngle = d3_functor(v)
          return chord
        }
        return chord
      }
      function d3_svg_chordRadius (d) {
        return d.radius
      }
      d3.svg.diagonal = function () {
        var source = d3_source, target = d3_target, projection = d3_svg_diagonalProjection
        function diagonal (d, i) {
          var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [ p0, {
              x: p0.x,
              y: m
            }, {
              x: p3.x,
              y: m
            }, p3 ]
          p = p.map(projection)
          return 'M' + p[0] + 'C' + p[1] + ' ' + p[2] + ' ' + p[3]
        }
        diagonal.source = function (x) {
          if (!arguments.length) return source
          source = d3_functor(x)
          return diagonal
        }
        diagonal.target = function (x) {
          if (!arguments.length) return target
          target = d3_functor(x)
          return diagonal
        }
        diagonal.projection = function (x) {
          if (!arguments.length) return projection
          projection = x
          return diagonal
        }
        return diagonal
      }
      function d3_svg_diagonalProjection (d) {
        return [ d.x, d.y ]
      }
      d3.svg.diagonal.radial = function () {
        var diagonal = d3.svg.diagonal(), projection = d3_svg_diagonalProjection, projection_ = diagonal.projection
        diagonal.projection = function (x) {
          return arguments.length ? projection_(d3_svg_diagonalRadialProjection(projection = x)) : projection
        }
        return diagonal
      }
      function d3_svg_diagonalRadialProjection (projection) {
        return function () {
          var d = projection.apply(this, arguments), r = d[0], a = d[1] - halfπ
          return [ r * Math.cos(a), r * Math.sin(a) ]
        }
      }
      d3.svg.symbol = function () {
        var type = d3_svg_symbolType, size = d3_svg_symbolSize
        function symbol (d, i) {
          return (d3_svg_symbols.get(type.call(this, d, i)) || d3_svg_symbolCircle)(size.call(this, d, i))
        }
        symbol.type = function (x) {
          if (!arguments.length) return type
          type = d3_functor(x)
          return symbol
        }
        symbol.size = function (x) {
          if (!arguments.length) return size
          size = d3_functor(x)
          return symbol
        }
        return symbol
      }
      function d3_svg_symbolSize () {
        return 64
      }
      function d3_svg_symbolType () {
        return 'circle'
      }
      function d3_svg_symbolCircle (size) {
        var r = Math.sqrt(size / π)
        return 'M0,' + r + 'A' + r + ',' + r + ' 0 1,1 0,' + -r + 'A' + r + ',' + r + ' 0 1,1 0,' + r + 'Z'
      }
      var d3_svg_symbols = d3.map({
        circle: d3_svg_symbolCircle,
        cross: function (size) {
          var r = Math.sqrt(size / 5) / 2
          return 'M' + -3 * r + ',' + -r + 'H' + -r + 'V' + -3 * r + 'H' + r + 'V' + -r + 'H' + 3 * r + 'V' + r + 'H' + r + 'V' + 3 * r + 'H' + -r + 'V' + r + 'H' + -3 * r + 'Z'
        },
        diamond: function (size) {
          var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)), rx = ry * d3_svg_symbolTan30
          return 'M0,' + -ry + 'L' + rx + ',0' + ' 0,' + ry + ' ' + -rx + ',0' + 'Z'
        },
        square: function (size) {
          var r = Math.sqrt(size) / 2
          return 'M' + -r + ',' + -r + 'L' + r + ',' + -r + ' ' + r + ',' + r + ' ' + -r + ',' + r + 'Z'
        },
        'triangle-down': function (size) {
          var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2
          return 'M0,' + ry + 'L' + rx + ',' + -ry + ' ' + -rx + ',' + -ry + 'Z'
        },
        'triangle-up': function (size) {
          var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2
          return 'M0,' + -ry + 'L' + rx + ',' + ry + ' ' + -rx + ',' + ry + 'Z'
        }
      })
      d3.svg.symbolTypes = d3_svg_symbols.keys()
      var d3_svg_symbolSqrt3 = Math.sqrt(3), d3_svg_symbolTan30 = Math.tan(30 * d3_radians)
      d3_selectionPrototype.transition = function (name) {
        var id = d3_transitionInheritId || ++d3_transitionId, ns = d3_transitionNamespace(name), subgroups = [], subgroup, node, transition = d3_transitionInherit || {
            time: Date.now(),
            ease: d3_ease_cubicInOut,
            delay: 0,
            duration: 250
          }
        for (var j = -1, m = this.length; ++j < m;) {
          subgroups.push(subgroup = [])
          for (var group = this[j], i = -1, n = group.length; ++i < n;) {
            if (node = group[i]) d3_transitionNode(node, i, ns, id, transition)
            subgroup.push(node)
          }
        }
        return d3_transition(subgroups, ns, id)
      }
      d3_selectionPrototype.interrupt = function (name) {
        return this.each(name == null ? d3_selection_interrupt : d3_selection_interruptNS(d3_transitionNamespace(name)))
      }
      var d3_selection_interrupt = d3_selection_interruptNS(d3_transitionNamespace())
      function d3_selection_interruptNS (ns) {
        return function () {
          var lock, active
          if ((lock = this[ns]) && (active = lock[lock.active])) {
            if (--lock.count) delete lock[lock.active]; else delete this[ns]
            lock.active += 0.5
            active.event && active.event.interrupt.call(this, this.__data__, active.index)
          }
        }
      }
      function d3_transition (groups, ns, id) {
        d3_subclass(groups, d3_transitionPrototype)
        groups.namespace = ns
        groups.id = id
        return groups
      }
      var d3_transitionPrototype = [], d3_transitionId = 0, d3_transitionInheritId, d3_transitionInherit
      d3_transitionPrototype.call = d3_selectionPrototype.call
      d3_transitionPrototype.empty = d3_selectionPrototype.empty
      d3_transitionPrototype.node = d3_selectionPrototype.node
      d3_transitionPrototype.size = d3_selectionPrototype.size
      d3.transition = function (selection, name) {
        return selection && selection.transition ? d3_transitionInheritId ? selection.transition(name) : selection : d3.selection().transition(selection)
      }
      d3.transition.prototype = d3_transitionPrototype
      d3_transitionPrototype.select = function (selector) {
        var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnode, node
        selector = d3_selection_selector(selector)
        for (var j = -1, m = this.length; ++j < m;) {
          subgroups.push(subgroup = [])
          for (var group = this[j], i = -1, n = group.length; ++i < n;) {
            if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {
              if ('__data__' in node) subnode.__data__ = node.__data__
              d3_transitionNode(subnode, i, ns, id, node[ns][id])
              subgroup.push(subnode)
            } else {
              subgroup.push(null)
            }
          }
        }
        return d3_transition(subgroups, ns, id)
      }
      d3_transitionPrototype.selectAll = function (selector) {
        var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnodes, node, subnode, transition
        selector = d3_selection_selectorAll(selector)
        for (var j = -1, m = this.length; ++j < m;) {
          for (var group = this[j], i = -1, n = group.length; ++i < n;) {
            if (node = group[i]) {
              transition = node[ns][id]
              subnodes = selector.call(node, node.__data__, i, j)
              subgroups.push(subgroup = [])
              for (var k = -1, o = subnodes.length; ++k < o;) {
                if (subnode = subnodes[k]) d3_transitionNode(subnode, k, ns, id, transition)
                subgroup.push(subnode)
              }
            }
          }
        }
        return d3_transition(subgroups, ns, id)
      }
      d3_transitionPrototype.filter = function (filter) {
        var subgroups = [], subgroup, group, node
        if (typeof filter !== 'function') filter = d3_selection_filter(filter)
        for (var j = 0, m = this.length; j < m; j++) {
          subgroups.push(subgroup = [])
          for (var group = this[j], i = 0, n = group.length; i < n; i++) {
            if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
              subgroup.push(node)
            }
          }
        }
        return d3_transition(subgroups, this.namespace, this.id)
      }
      d3_transitionPrototype.tween = function (name, tween) {
        var id = this.id, ns = this.namespace
        if (arguments.length < 2) return this.node()[ns][id].tween.get(name)
        return d3_selection_each(this, tween == null ? function (node) {
          node[ns][id].tween.remove(name)
        } : function (node) {
          node[ns][id].tween.set(name, tween)
        })
      }
      function d3_transition_tween (groups, name, value, tween) {
        var id = groups.id, ns = groups.namespace
        return d3_selection_each(groups, typeof value === 'function' ? function (node, i, j) {
          node[ns][id].tween.set(name, tween(value.call(node, node.__data__, i, j)))
        } : (value = tween(value), function (node) {
          node[ns][id].tween.set(name, value)
        }))
      }
      d3_transitionPrototype.attr = function (nameNS, value) {
        if (arguments.length < 2) {
          for (value in nameNS) this.attr(value, nameNS[value])
          return this
        }
        var interpolate = nameNS == 'transform' ? d3_interpolateTransform : d3_interpolate, name = d3.ns.qualify(nameNS)
        function attrNull () {
          this.removeAttribute(name)
        }
        function attrNullNS () {
          this.removeAttributeNS(name.space, name.local)
        }
        function attrTween (b) {
          return b == null ? attrNull : (b += '', function () {
            var a = this.getAttribute(name), i
            return a !== b && (i = interpolate(a, b), function (t) {
              this.setAttribute(name, i(t))
            })
          })
        }
        function attrTweenNS (b) {
          return b == null ? attrNullNS : (b += '', function () {
            var a = this.getAttributeNS(name.space, name.local), i
            return a !== b && (i = interpolate(a, b), function (t) {
              this.setAttributeNS(name.space, name.local, i(t))
            })
          })
        }
        return d3_transition_tween(this, 'attr.' + nameNS, value, name.local ? attrTweenNS : attrTween)
      }
      d3_transitionPrototype.attrTween = function (nameNS, tween) {
        var name = d3.ns.qualify(nameNS)
        function attrTween (d, i) {
          var f = tween.call(this, d, i, this.getAttribute(name))
          return f && function (t) {
            this.setAttribute(name, f(t))
          }
        }
        function attrTweenNS (d, i) {
          var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local))
          return f && function (t) {
            this.setAttributeNS(name.space, name.local, f(t))
          }
        }
        return this.tween('attr.' + nameNS, name.local ? attrTweenNS : attrTween)
      }
      d3_transitionPrototype.style = function (name, value, priority) {
        var n = arguments.length
        if (n < 3) {
          if (typeof name !== 'string') {
            if (n < 2) value = ''
            for (priority in name) this.style(priority, name[priority], value)
            return this
          }
          priority = ''
        }
        function styleNull () {
          this.style.removeProperty(name)
        }
        function styleString (b) {
          return b == null ? styleNull : (b += '', function () {
            var a = d3_window(this).getComputedStyle(this, null).getPropertyValue(name), i
            return a !== b && (i = d3_interpolate(a, b), function (t) {
              this.style.setProperty(name, i(t), priority)
            })
          })
        }
        return d3_transition_tween(this, 'style.' + name, value, styleString)
      }
      d3_transitionPrototype.styleTween = function (name, tween, priority) {
        if (arguments.length < 3) priority = ''
        function styleTween (d, i) {
          var f = tween.call(this, d, i, d3_window(this).getComputedStyle(this, null).getPropertyValue(name))
          return f && function (t) {
            this.style.setProperty(name, f(t), priority)
          }
        }
        return this.tween('style.' + name, styleTween)
      }
      d3_transitionPrototype.text = function (value) {
        return d3_transition_tween(this, 'text', value, d3_transition_text)
      }
      function d3_transition_text (b) {
        if (b == null) b = ''
        return function () {
          this.textContent = b
        }
      }
      d3_transitionPrototype.remove = function () {
        var ns = this.namespace
        return this.each('end.transition', function () {
          var p
          if (this[ns].count < 2 && (p = this.parentNode)) p.removeChild(this)
        })
      }
      d3_transitionPrototype.ease = function (value) {
        var id = this.id, ns = this.namespace
        if (arguments.length < 1) return this.node()[ns][id].ease
        if (typeof value !== 'function') value = d3.ease.apply(d3, arguments)
        return d3_selection_each(this, function (node) {
          node[ns][id].ease = value
        })
      }
      d3_transitionPrototype.delay = function (value) {
        var id = this.id, ns = this.namespace
        if (arguments.length < 1) return this.node()[ns][id].delay
        return d3_selection_each(this, typeof value === 'function' ? function (node, i, j) {
          node[ns][id].delay = +value.call(node, node.__data__, i, j)
        } : (value = +value, function (node) {
          node[ns][id].delay = value
        }))
      }
      d3_transitionPrototype.duration = function (value) {
        var id = this.id, ns = this.namespace
        if (arguments.length < 1) return this.node()[ns][id].duration
        return d3_selection_each(this, typeof value === 'function' ? function (node, i, j) {
          node[ns][id].duration = Math.max(1, value.call(node, node.__data__, i, j))
        } : (value = Math.max(1, value), function (node) {
          node[ns][id].duration = value
        }))
      }
      d3_transitionPrototype.each = function (type, listener) {
        var id = this.id, ns = this.namespace
        if (arguments.length < 2) {
          var inherit = d3_transitionInherit, inheritId = d3_transitionInheritId
          try {
            d3_transitionInheritId = id
            d3_selection_each(this, function (node, i, j) {
              d3_transitionInherit = node[ns][id]
              type.call(node, node.__data__, i, j)
            })
          } finally {
            d3_transitionInherit = inherit
            d3_transitionInheritId = inheritId
          }
        } else {
          d3_selection_each(this, function (node) {
            var transition = node[ns][id];
            (transition.event || (transition.event = d3.dispatch('start', 'end', 'interrupt'))).on(type, listener)
          })
        }
        return this
      }
      d3_transitionPrototype.transition = function () {
        var id0 = this.id, id1 = ++d3_transitionId, ns = this.namespace, subgroups = [], subgroup, group, node, transition
        for (var j = 0, m = this.length; j < m; j++) {
          subgroups.push(subgroup = [])
          for (var group = this[j], i = 0, n = group.length; i < n; i++) {
            if (node = group[i]) {
              transition = node[ns][id0]
              d3_transitionNode(node, i, ns, id1, {
                time: transition.time,
                ease: transition.ease,
                delay: transition.delay + transition.duration,
                duration: transition.duration
              })
            }
            subgroup.push(node)
          }
        }
        return d3_transition(subgroups, ns, id1)
      }
      function d3_transitionNamespace (name) {
        return name == null ? '__transition__' : '__transition_' + name + '__'
      }
      function d3_transitionNode (node, i, ns, id, inherit) {
        var lock = node[ns] || (node[ns] = {
            active: 0,
            count: 0
          }), transition = lock[id]
        if (!transition) {
          var time = inherit.time
          transition = lock[id] = {
            tween: new d3_Map(),
            time: time,
            delay: inherit.delay,
            duration: inherit.duration,
            ease: inherit.ease,
            index: i
          }
          inherit = null
          ++lock.count
          d3.timer(function (elapsed) {
            var delay = transition.delay, duration, ease, timer = d3_timer_active, tweened = []
            timer.t = delay + time
            if (delay <= elapsed) return start(elapsed - delay)
            timer.c = start
            function start (elapsed) {
              if (lock.active > id) return stop()
              var active = lock[lock.active]
              if (active) {
                --lock.count
                delete lock[lock.active]
                active.event && active.event.interrupt.call(node, node.__data__, active.index)
              }
              lock.active = id
              transition.event && transition.event.start.call(node, node.__data__, i)
              transition.tween.forEach(function (key, value) {
                if (value = value.call(node, node.__data__, i)) {
                  tweened.push(value)
                }
              })
              ease = transition.ease
              duration = transition.duration
              d3.timer(function () {
                timer.c = tick(elapsed || 1) ? d3_true : tick
                return 1
              }, 0, time)
            }
            function tick (elapsed) {
              if (lock.active !== id) return 1
              var t = elapsed / duration, e = ease(t), n = tweened.length
              while (n > 0) {
                tweened[--n].call(node, e)
              }
              if (t >= 1) {
                transition.event && transition.event.end.call(node, node.__data__, i)
                return stop()
              }
            }
            function stop () {
              if (--lock.count) delete lock[id]; else delete node[ns]
              return 1
            }
          }, 0, time)
        }
      }
      d3.svg.axis = function () {
        var scale = d3.scale.linear(), orient = d3_svg_axisDefaultOrient, innerTickSize = 6, outerTickSize = 6, tickPadding = 3, tickArguments_ = [ 10 ], tickValues = null, tickFormat_
        function axis (g) {
          g.each(function () {
            var g = d3.select(this)
            var scale0 = this.__chart__ || scale, scale1 = this.__chart__ = scale.copy()
            var ticks = tickValues == null ? scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain() : tickValues, tickFormat = tickFormat_ == null ? scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity : tickFormat_, tick = g.selectAll('.tick').data(ticks, scale1), tickEnter = tick.enter().insert('g', '.domain').attr('class', 'tick').style('opacity', ε), tickExit = d3.transition(tick.exit()).style('opacity', ε).remove(), tickUpdate = d3.transition(tick.order()).style('opacity', 1), tickSpacing = Math.max(innerTickSize, 0) + tickPadding, tickTransform
            var range = d3_scaleRange(scale1), path = g.selectAll('.domain').data([ 0 ]), pathUpdate = (path.enter().append('path').attr('class', 'domain'),
        d3.transition(path))
            tickEnter.append('line')
            tickEnter.append('text')
            var lineEnter = tickEnter.select('line'), lineUpdate = tickUpdate.select('line'), text = tick.select('text').text(tickFormat), textEnter = tickEnter.select('text'), textUpdate = tickUpdate.select('text'), sign = orient === 'top' || orient === 'left' ? -1 : 1, x1, x2, y1, y2
            if (orient === 'bottom' || orient === 'top') {
              tickTransform = d3_svg_axisX, x1 = 'x', y1 = 'y', x2 = 'x2', y2 = 'y2'
              text.attr('dy', sign < 0 ? '0em' : '.71em').style('text-anchor', 'middle')
              pathUpdate.attr('d', 'M' + range[0] + ',' + sign * outerTickSize + 'V0H' + range[1] + 'V' + sign * outerTickSize)
            } else {
              tickTransform = d3_svg_axisY, x1 = 'y', y1 = 'x', x2 = 'y2', y2 = 'x2'
              text.attr('dy', '.32em').style('text-anchor', sign < 0 ? 'end' : 'start')
              pathUpdate.attr('d', 'M' + sign * outerTickSize + ',' + range[0] + 'H0V' + range[1] + 'H' + sign * outerTickSize)
            }
            lineEnter.attr(y2, sign * innerTickSize)
            textEnter.attr(y1, sign * tickSpacing)
            lineUpdate.attr(x2, 0).attr(y2, sign * innerTickSize)
            textUpdate.attr(x1, 0).attr(y1, sign * tickSpacing)
            if (scale1.rangeBand) {
              var x = scale1, dx = x.rangeBand() / 2
              scale0 = scale1 = function (d) {
                return x(d) + dx
              }
            } else if (scale0.rangeBand) {
              scale0 = scale1
            } else {
              tickExit.call(tickTransform, scale1, scale0)
            }
            tickEnter.call(tickTransform, scale0, scale1)
            tickUpdate.call(tickTransform, scale1, scale1)
          })
        }
        axis.scale = function (x) {
          if (!arguments.length) return scale
          scale = x
          return axis
        }
        axis.orient = function (x) {
          if (!arguments.length) return orient
          orient = x in d3_svg_axisOrients ? x + '' : d3_svg_axisDefaultOrient
          return axis
        }
        axis.ticks = function () {
          if (!arguments.length) return tickArguments_
          tickArguments_ = arguments
          return axis
        }
        axis.tickValues = function (x) {
          if (!arguments.length) return tickValues
          tickValues = x
          return axis
        }
        axis.tickFormat = function (x) {
          if (!arguments.length) return tickFormat_
          tickFormat_ = x
          return axis
        }
        axis.tickSize = function (x) {
          var n = arguments.length
          if (!n) return innerTickSize
          innerTickSize = +x
          outerTickSize = +arguments[n - 1]
          return axis
        }
        axis.innerTickSize = function (x) {
          if (!arguments.length) return innerTickSize
          innerTickSize = +x
          return axis
        }
        axis.outerTickSize = function (x) {
          if (!arguments.length) return outerTickSize
          outerTickSize = +x
          return axis
        }
        axis.tickPadding = function (x) {
          if (!arguments.length) return tickPadding
          tickPadding = +x
          return axis
        }
        axis.tickSubdivide = function () {
          return arguments.length && axis
        }
        return axis
      }
      var d3_svg_axisDefaultOrient = 'bottom', d3_svg_axisOrients = {
          top: 1,
          right: 1,
          bottom: 1,
          left: 1
        }
      function d3_svg_axisX (selection, x0, x1) {
        selection.attr('transform', function (d) {
          var v0 = x0(d)
          return 'translate(' + (isFinite(v0) ? v0 : x1(d)) + ',0)'
        })
      }
      function d3_svg_axisY (selection, y0, y1) {
        selection.attr('transform', function (d) {
          var v0 = y0(d)
          return 'translate(0,' + (isFinite(v0) ? v0 : y1(d)) + ')'
        })
      }
      d3.svg.brush = function () {
        var event = d3_eventDispatch(brush, 'brushstart', 'brush', 'brushend'), x = null, y = null, xExtent = [ 0, 0 ], yExtent = [ 0, 0 ], xExtentDomain, yExtentDomain, xClamp = true, yClamp = true, resizes = d3_svg_brushResizes[0]
        function brush (g) {
          g.each(function () {
            var g = d3.select(this).style('pointer-events', 'all').style('-webkit-tap-highlight-color', 'rgba(0,0,0,0)').on('mousedown.brush', brushstart).on('touchstart.brush', brushstart)
            var background = g.selectAll('.background').data([ 0 ])
            background.enter().append('rect').attr('class', 'background').style('visibility', 'hidden').style('cursor', 'crosshair')
            g.selectAll('.extent').data([ 0 ]).enter().append('rect').attr('class', 'extent').style('cursor', 'move')
            var resize = g.selectAll('.resize').data(resizes, d3_identity)
            resize.exit().remove()
            resize.enter().append('g').attr('class', function (d) {
              return 'resize ' + d
            }).style('cursor', function (d) {
              return d3_svg_brushCursor[d]
            }).append('rect').attr('x', function (d) {
              return /[ew]$/.test(d) ? -3 : null
            }).attr('y', function (d) {
              return /^[ns]/.test(d) ? -3 : null
            }).attr('width', 6).attr('height', 6).style('visibility', 'hidden')
            resize.style('display', brush.empty() ? 'none' : null)
            var gUpdate = d3.transition(g), backgroundUpdate = d3.transition(background), range
            if (x) {
              range = d3_scaleRange(x)
              backgroundUpdate.attr('x', range[0]).attr('width', range[1] - range[0])
              redrawX(gUpdate)
            }
            if (y) {
              range = d3_scaleRange(y)
              backgroundUpdate.attr('y', range[0]).attr('height', range[1] - range[0])
              redrawY(gUpdate)
            }
            redraw(gUpdate)
          })
        }
        brush.event = function (g) {
          g.each(function () {
            var event_ = event.of(this, arguments), extent1 = {
                x: xExtent,
                y: yExtent,
                i: xExtentDomain,
                j: yExtentDomain
              }, extent0 = this.__chart__ || extent1
            this.__chart__ = extent1
            if (d3_transitionInheritId) {
              d3.select(this).transition().each('start.brush', function () {
                xExtentDomain = extent0.i
                yExtentDomain = extent0.j
                xExtent = extent0.x
                yExtent = extent0.y
                event_({
                  type: 'brushstart'
                })
              }).tween('brush:brush', function () {
                var xi = d3_interpolateArray(xExtent, extent1.x), yi = d3_interpolateArray(yExtent, extent1.y)
                xExtentDomain = yExtentDomain = null
                return function (t) {
                  xExtent = extent1.x = xi(t)
                  yExtent = extent1.y = yi(t)
                  event_({
                    type: 'brush',
                    mode: 'resize'
                  })
                }
              }).each('end.brush', function () {
                xExtentDomain = extent1.i
                yExtentDomain = extent1.j
                event_({
                  type: 'brush',
                  mode: 'resize'
                })
                event_({
                  type: 'brushend'
                })
              })
            } else {
              event_({
                type: 'brushstart'
              })
              event_({
                type: 'brush',
                mode: 'resize'
              })
              event_({
                type: 'brushend'
              })
            }
          })
        }
        function redraw (g) {
          g.selectAll('.resize').attr('transform', function (d) {
            return 'translate(' + xExtent[+/e$/.test(d)] + ',' + yExtent[+/^s/.test(d)] + ')'
          })
        }
        function redrawX (g) {
          g.select('.extent').attr('x', xExtent[0])
          g.selectAll('.extent,.n>rect,.s>rect').attr('width', xExtent[1] - xExtent[0])
        }
        function redrawY (g) {
          g.select('.extent').attr('y', yExtent[0])
          g.selectAll('.extent,.e>rect,.w>rect').attr('height', yExtent[1] - yExtent[0])
        }
        function brushstart () {
          var target = this, eventTarget = d3.select(d3.event.target), event_ = event.of(target, arguments), g = d3.select(target), resizing = eventTarget.datum(), resizingX = !/^(n|s)$/.test(resizing) && x, resizingY = !/^(e|w)$/.test(resizing) && y, dragging = eventTarget.classed('extent'), dragRestore = d3_event_dragSuppress(target), center, origin = d3.mouse(target), offset
          var w = d3.select(d3_window(target)).on('keydown.brush', keydown).on('keyup.brush', keyup)
          if (d3.event.changedTouches) {
            w.on('touchmove.brush', brushmove).on('touchend.brush', brushend)
          } else {
            w.on('mousemove.brush', brushmove).on('mouseup.brush', brushend)
          }
          g.interrupt().selectAll('*').interrupt()
          if (dragging) {
            origin[0] = xExtent[0] - origin[0]
            origin[1] = yExtent[0] - origin[1]
          } else if (resizing) {
            var ex = +/w$/.test(resizing), ey = +/^n/.test(resizing)
            offset = [ xExtent[1 - ex] - origin[0], yExtent[1 - ey] - origin[1] ]
            origin[0] = xExtent[ex]
            origin[1] = yExtent[ey]
          } else if (d3.event.altKey) center = origin.slice()
          g.style('pointer-events', 'none').selectAll('.resize').style('display', null)
          d3.select('body').style('cursor', eventTarget.style('cursor'))
          event_({
            type: 'brushstart'
          })
          brushmove()
          function keydown () {
            if (d3.event.keyCode == 32) {
              if (!dragging) {
                center = null
                origin[0] -= xExtent[1]
                origin[1] -= yExtent[1]
                dragging = 2
              }
              d3_eventPreventDefault()
            }
          }
          function keyup () {
            if (d3.event.keyCode == 32 && dragging == 2) {
              origin[0] += xExtent[1]
              origin[1] += yExtent[1]
              dragging = 0
              d3_eventPreventDefault()
            }
          }
          function brushmove () {
            var point = d3.mouse(target), moved = false
            if (offset) {
              point[0] += offset[0]
              point[1] += offset[1]
            }
            if (!dragging) {
              if (d3.event.altKey) {
                if (!center) center = [ (xExtent[0] + xExtent[1]) / 2, (yExtent[0] + yExtent[1]) / 2 ]
                origin[0] = xExtent[+(point[0] < center[0])]
                origin[1] = yExtent[+(point[1] < center[1])]
              } else center = null
            }
            if (resizingX && move1(point, x, 0)) {
              redrawX(g)
              moved = true
            }
            if (resizingY && move1(point, y, 1)) {
              redrawY(g)
              moved = true
            }
            if (moved) {
              redraw(g)
              event_({
                type: 'brush',
                mode: dragging ? 'move' : 'resize'
              })
            }
          }
          function move1 (point, scale, i) {
            var range = d3_scaleRange(scale), r0 = range[0], r1 = range[1], position = origin[i], extent = i ? yExtent : xExtent, size = extent[1] - extent[0], min, max
            if (dragging) {
              r0 -= position
              r1 -= size + position
            }
            min = (i ? yClamp : xClamp) ? Math.max(r0, Math.min(r1, point[i])) : point[i]
            if (dragging) {
              max = (min += position) + size
            } else {
              if (center) position = Math.max(r0, Math.min(r1, 2 * center[i] - min))
              if (position < min) {
                max = min
                min = position
              } else {
                max = position
              }
            }
            if (extent[0] != min || extent[1] != max) {
              if (i) yExtentDomain = null; else xExtentDomain = null
              extent[0] = min
              extent[1] = max
              return true
            }
          }
          function brushend () {
            brushmove()
            g.style('pointer-events', 'all').selectAll('.resize').style('display', brush.empty() ? 'none' : null)
            d3.select('body').style('cursor', null)
            w.on('mousemove.brush', null).on('mouseup.brush', null).on('touchmove.brush', null).on('touchend.brush', null).on('keydown.brush', null).on('keyup.brush', null)
            dragRestore()
            event_({
              type: 'brushend'
            })
          }
        }
        brush.x = function (z) {
          if (!arguments.length) return x
          x = z
          resizes = d3_svg_brushResizes[!x << 1 | !y]
          return brush
        }
        brush.y = function (z) {
          if (!arguments.length) return y
          y = z
          resizes = d3_svg_brushResizes[!x << 1 | !y]
          return brush
        }
        brush.clamp = function (z) {
          if (!arguments.length) return x && y ? [ xClamp, yClamp ] : x ? xClamp : y ? yClamp : null
          if (x && y) xClamp = !!z[0], yClamp = !!z[1]; else if (x) xClamp = !!z; else if (y) yClamp = !!z
          return brush
        }
        brush.extent = function (z) {
          var x0, x1, y0, y1, t
          if (!arguments.length) {
            if (x) {
              if (xExtentDomain) {
                x0 = xExtentDomain[0], x1 = xExtentDomain[1]
              } else {
                x0 = xExtent[0], x1 = xExtent[1]
                if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1)
                if (x1 < x0) t = x0, x0 = x1, x1 = t
              }
            }
            if (y) {
              if (yExtentDomain) {
                y0 = yExtentDomain[0], y1 = yExtentDomain[1]
              } else {
                y0 = yExtent[0], y1 = yExtent[1]
                if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1)
                if (y1 < y0) t = y0, y0 = y1, y1 = t
              }
            }
            return x && y ? [ [ x0, y0 ], [ x1, y1 ] ] : x ? [ x0, x1 ] : y && [ y0, y1 ]
          }
          if (x) {
            x0 = z[0], x1 = z[1]
            if (y) x0 = x0[0], x1 = x1[0]
            xExtentDomain = [ x0, x1 ]
            if (x.invert) x0 = x(x0), x1 = x(x1)
            if (x1 < x0) t = x0, x0 = x1, x1 = t
            if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [ x0, x1 ]
          }
          if (y) {
            y0 = z[0], y1 = z[1]
            if (x) y0 = y0[1], y1 = y1[1]
            yExtentDomain = [ y0, y1 ]
            if (y.invert) y0 = y(y0), y1 = y(y1)
            if (y1 < y0) t = y0, y0 = y1, y1 = t
            if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [ y0, y1 ]
          }
          return brush
        }
        brush.clear = function () {
          if (!brush.empty()) {
            xExtent = [ 0, 0 ], yExtent = [ 0, 0 ]
            xExtentDomain = yExtentDomain = null
          }
          return brush
        }
        brush.empty = function () {
          return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1]
        }
        return d3.rebind(brush, event, 'on')
      }
      var d3_svg_brushCursor = {
        n: 'ns-resize',
        e: 'ew-resize',
        s: 'ns-resize',
        w: 'ew-resize',
        nw: 'nwse-resize',
        ne: 'nesw-resize',
        se: 'nwse-resize',
        sw: 'nesw-resize'
      }
      var d3_svg_brushResizes = [ [ 'n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw' ], [ 'e', 'w' ], [ 'n', 's' ], [] ]
      var d3_time_format = d3_time.format = d3_locale_enUS.timeFormat
      var d3_time_formatUtc = d3_time_format.utc
      var d3_time_formatIso = d3_time_formatUtc('%Y-%m-%dT%H:%M:%S.%LZ')
      d3_time_format.iso = Date.prototype.toISOString && +new Date('2000-01-01T00:00:00.000Z') ? d3_time_formatIsoNative : d3_time_formatIso
      function d3_time_formatIsoNative (date) {
        return date.toISOString()
      }
      d3_time_formatIsoNative.parse = function (string) {
        var date = new Date(string)
        return isNaN(date) ? null : date
      }
      d3_time_formatIsoNative.toString = d3_time_formatIso.toString
      d3_time.second = d3_time_interval(function (date) {
        return new d3_date(Math.floor(date / 1e3) * 1e3)
      }, function (date, offset) {
        date.setTime(date.getTime() + Math.floor(offset) * 1e3)
      }, function (date) {
        return date.getSeconds()
      })
      d3_time.seconds = d3_time.second.range
      d3_time.seconds.utc = d3_time.second.utc.range
      d3_time.minute = d3_time_interval(function (date) {
        return new d3_date(Math.floor(date / 6e4) * 6e4)
      }, function (date, offset) {
        date.setTime(date.getTime() + Math.floor(offset) * 6e4)
      }, function (date) {
        return date.getMinutes()
      })
      d3_time.minutes = d3_time.minute.range
      d3_time.minutes.utc = d3_time.minute.utc.range
      d3_time.hour = d3_time_interval(function (date) {
        var timezone = date.getTimezoneOffset() / 60
        return new d3_date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5)
      }, function (date, offset) {
        date.setTime(date.getTime() + Math.floor(offset) * 36e5)
      }, function (date) {
        return date.getHours()
      })
      d3_time.hours = d3_time.hour.range
      d3_time.hours.utc = d3_time.hour.utc.range
      d3_time.month = d3_time_interval(function (date) {
        date = d3_time.day(date)
        date.setDate(1)
        return date
      }, function (date, offset) {
        date.setMonth(date.getMonth() + offset)
      }, function (date) {
        return date.getMonth()
      })
      d3_time.months = d3_time.month.range
      d3_time.months.utc = d3_time.month.utc.range
      function d3_time_scale (linear, methods, format) {
        function scale (x) {
          return linear(x)
        }
        scale.invert = function (x) {
          return d3_time_scaleDate(linear.invert(x))
        }
        scale.domain = function (x) {
          if (!arguments.length) return linear.domain().map(d3_time_scaleDate)
          linear.domain(x)
          return scale
        }
        function tickMethod (extent, count) {
          var span = extent[1] - extent[0], target = span / count, i = d3.bisect(d3_time_scaleSteps, target)
          return i == d3_time_scaleSteps.length ? [ methods.year, d3_scale_linearTickRange(extent.map(function (d) {
            return d / 31536e6
          }), count)[2] ] : !i ? [ d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2] ] : methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i]
        }
        scale.nice = function (interval, skip) {
          var domain = scale.domain(), extent = d3_scaleExtent(domain), method = interval == null ? tickMethod(extent, 10) : typeof interval === 'number' && tickMethod(extent, interval)
          if (method) interval = method[0], skip = method[1]
          function skipped (date) {
            return !isNaN(date) && !interval.range(date, d3_time_scaleDate(+date + 1), skip).length
          }
          return scale.domain(d3_scale_nice(domain, skip > 1 ? {
            floor: function (date) {
              while (skipped(date = interval.floor(date))) date = d3_time_scaleDate(date - 1)
              return date
            },
            ceil: function (date) {
              while (skipped(date = interval.ceil(date))) date = d3_time_scaleDate(+date + 1)
              return date
            }
          } : interval))
        }
        scale.ticks = function (interval, skip) {
          var extent = d3_scaleExtent(scale.domain()), method = interval == null ? tickMethod(extent, 10) : typeof interval === 'number' ? tickMethod(extent, interval) : !interval.range && [ {
              range: interval
            }, skip ]
          if (method) interval = method[0], skip = method[1]
          return interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip)
        }
        scale.tickFormat = function () {
          return format
        }
        scale.copy = function () {
          return d3_time_scale(linear.copy(), methods, format)
        }
        return d3_scale_linearRebind(scale, linear)
      }
      function d3_time_scaleDate (t) {
        return new Date(t)
      }
      var d3_time_scaleSteps = [ 1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6 ]
      var d3_time_scaleLocalMethods = [ [ d3_time.second, 1 ], [ d3_time.second, 5 ], [ d3_time.second, 15 ], [ d3_time.second, 30 ], [ d3_time.minute, 1 ], [ d3_time.minute, 5 ], [ d3_time.minute, 15 ], [ d3_time.minute, 30 ], [ d3_time.hour, 1 ], [ d3_time.hour, 3 ], [ d3_time.hour, 6 ], [ d3_time.hour, 12 ], [ d3_time.day, 1 ], [ d3_time.day, 2 ], [ d3_time.week, 1 ], [ d3_time.month, 1 ], [ d3_time.month, 3 ], [ d3_time.year, 1 ] ]
      var d3_time_scaleLocalFormat = d3_time_format.multi([ [ '.%L', function (d) {
        return d.getMilliseconds()
      } ], [ ':%S', function (d) {
        return d.getSeconds()
      } ], [ '%I:%M', function (d) {
        return d.getMinutes()
      } ], [ '%I %p', function (d) {
        return d.getHours()
      } ], [ '%a %d', function (d) {
        return d.getDay() && d.getDate() != 1
      } ], [ '%b %d', function (d) {
        return d.getDate() != 1
      } ], [ '%B', function (d) {
        return d.getMonth()
      } ], [ '%Y', d3_true ] ])
      var d3_time_scaleMilliseconds = {
        range: function (start, stop, step) {
          return d3.range(Math.ceil(start / step) * step, +stop, step).map(d3_time_scaleDate)
        },
        floor: d3_identity,
        ceil: d3_identity
      }
      d3_time_scaleLocalMethods.year = d3_time.year
      d3_time.scale = function () {
        return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat)
      }
      var d3_time_scaleUtcMethods = d3_time_scaleLocalMethods.map(function (m) {
        return [ m[0].utc, m[1] ]
      })
      var d3_time_scaleUtcFormat = d3_time_formatUtc.multi([ [ '.%L', function (d) {
        return d.getUTCMilliseconds()
      } ], [ ':%S', function (d) {
        return d.getUTCSeconds()
      } ], [ '%I:%M', function (d) {
        return d.getUTCMinutes()
      } ], [ '%I %p', function (d) {
        return d.getUTCHours()
      } ], [ '%a %d', function (d) {
        return d.getUTCDay() && d.getUTCDate() != 1
      } ], [ '%b %d', function (d) {
        return d.getUTCDate() != 1
      } ], [ '%B', function (d) {
        return d.getUTCMonth()
      } ], [ '%Y', d3_true ] ])
      d3_time_scaleUtcMethods.year = d3_time.year.utc
      d3_time.scale.utc = function () {
        return d3_time_scale(d3.scale.linear(), d3_time_scaleUtcMethods, d3_time_scaleUtcFormat)
      }
      d3.text = d3_xhrType(function (request) {
        return request.responseText
      })
      d3.json = function (url, callback) {
        return d3_xhr(url, 'application/json', d3_json, callback)
      }
      function d3_json (request) {
        return JSON.parse(request.responseText)
      }
      d3.html = function (url, callback) {
        return d3_xhr(url, 'text/html', d3_html, callback)
      }
      function d3_html (request) {
        var range = d3_document.createRange()
        range.selectNode(d3_document.body)
        return range.createContextualFragment(request.responseText)
      }
      d3.xml = d3_xhrType(function (request) {
        return request.responseXML
      })
      if (typeof define === 'function' && define.amd) define(d3); else if (typeof module === 'object' && module.exports) module.exports = d3
      this.d3 = d3
    }())
  }, {}],
  37: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

    var ViterbiBuilder = require('./viterbi/ViterbiBuilder.js')
    var ViterbiSearcher = require('./viterbi/ViterbiSearcher.js')
    var IpadicFormatter = require('./util/IpadicFormatter.js')

    var PUNCTUATION = /、|。/

/**
 * Tokenizer
 * @param {DynamicDictionaries} dic Dictionaries used by this tokenizer
 * @constructor
 */
    function Tokenizer (dic) {
      this.token_info_dictionary = dic.token_info_dictionary
      this.unknown_dictionary = dic.unknown_dictionary
      this.viterbi_builder = new ViterbiBuilder(dic)
      this.viterbi_searcher = new ViterbiSearcher(dic.connection_costs)
      this.formatter = new IpadicFormatter()  // TODO Other dictionaries
    }

/**
 * Split into sentence by punctuation
 * @param {string} input Input text
 * @returns {Array.<string>} Sentences end with punctuation
 */
    Tokenizer.splitByPunctuation = function (input) {
      var sentences = []
      var tail = input
      while (true) {
        if (tail === '') {
          break
        }
        var index = tail.search(PUNCTUATION)
        if (index < 0) {
          sentences.push(tail)
          break
        }
        sentences.push(tail.substring(0, index + 1))
        tail = tail.substring(index + 1)
      }
      return sentences
    }

/**
 * Tokenize text
 * @param {string} text Input text to analyze
 * @returns {Array} Tokens
 */
    Tokenizer.prototype.tokenize = function (text) {
      var sentences = Tokenizer.splitByPunctuation(text)
      var tokens = []
      for (var i = 0; i < sentences.length; i++) {
        var sentence = sentences[i]
        this.tokenizeForSentence(sentence, tokens)
      }
      return tokens
    }

    Tokenizer.prototype.tokenizeForSentence = function (sentence, tokens) {
      if (tokens == null) {
        tokens = []
      }
      var lattice = this.getLattice(sentence)
      var best_path = this.viterbi_searcher.search(lattice)

      for (var j = 0; j < best_path.length; j++) {
        var node = best_path[j]

        var token, features, features_line
        if (node.type === 'KNOWN') {
          features_line = this.token_info_dictionary.getFeatures(node.name)
          if (features_line == null) {
            features = []
          } else {
            features = features_line.split(',')
          }
          token = this.formatter.formatEntry(node.name, node.start_pos, node.type, features)
        } else if (node.type === 'UNKNOWN') {
            // Unknown word
          features_line = this.unknown_dictionary.getFeatures(node.name)
          if (features_line == null) {
            features = []
          } else {
            features = features_line.split(',')
          }
          token = this.formatter.formatUnknownEntry(node.name, node.start_pos, node.type, features, node.surface_form)
        } else {
            // TODO User dictionary
          token = this.formatter.formatEntry(node.name, node.start_pos, node.type, [])
        }

        tokens.push(token)
      }

      return tokens
    }

/**
 * Build word lattice
 * @param {string} text Input text to analyze
 * @returns {ViterbiLattice} Word lattice
 */
    Tokenizer.prototype.getLattice = function (text) {
      return this.viterbi_builder.build(text)
    }

    module.exports = Tokenizer
  }, {'./util/IpadicFormatter.js': 50, './viterbi/ViterbiBuilder.js': 52, './viterbi/ViterbiSearcher.js': 55}],
  38: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

    var Tokenizer = require('./Tokenizer.js')
    var DictionaryLoader = require('./loader/DictionaryLoader.js')

/**
 * TokenizerBuilder create Tokenizer instance.
 * @param {Object} option JSON object which have key-value pairs settings
 * @param {string} option.dicPath Dictionary directory path (or URL using in browser)
 * @constructor
 */
    function TokenizerBuilder (option) {
      if (option.dicPath != null) {
        this.dic_path = option.dicPath
      } else {
        this.dic_path = 'dict/'
      }
    }

/**
 * Build Tokenizer instance by asynchronous manner
 * @param {TokenizerBuilder~onLoad} callback Callback function
 */
    TokenizerBuilder.prototype.build = function (callback) {
      var loader = DictionaryLoader.getLoader(this.dic_path)
      loader.load(function (err, dic) {
        callback(err, new Tokenizer(dic))
      })
    }

/**
 * Callback used by build
 * @callback TokenizerBuilder~onLoad
 * @param {Object} err Error object
 * @param {Tokenizer} tokenizer Prepared Tokenizer
 */

    module.exports = TokenizerBuilder
  }, {'./Tokenizer.js': 37, './loader/DictionaryLoader.js': 47}],
  39: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

/**
 * CharacterClass
 * @param {number} class_id
 * @param {string} class_name
 * @param {boolean} is_always_invoke
 * @param {boolean} is_grouping
 * @param {number} max_length
 * @constructor
 */
    function CharacterClass (class_id, class_name, is_always_invoke, is_grouping, max_length) {
      this.class_id = class_id
      this.class_name = class_name
      this.is_always_invoke = is_always_invoke
      this.is_grouping = is_grouping
      this.max_length = max_length
    }

    module.exports = CharacterClass
  }, {}],
  40: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

    var InvokeDefinitionMap = require('./InvokeDefinitionMap.js')
    var CharacterClass = require('./CharacterClass.js')
    var SurrogateAwareString = require('../util/SurrogateAwareString.js')

    var DEFAULT_CATEGORY = 'DEFAULT'
    var RETURN_PATTERN = /\r|\n|\r\n/
    var CATEGORY_DEF_PATTERN = /^(\w+)\s+(\d)\s+(\d)\s+(\d)/
    var CATEGORY_MAPPING_PATTERN = /^(0x[0-9A-F]{4})(?:\s+([^#\s]+))(?:\s+([^#\s]+))*/
    var RANGE_CATEGORY_MAPPING_PATTERN = /^(0x[0-9A-F]{4})\.\.(0x[0-9A-F]{4})(?:\s+([^#\s]+))(?:\s+([^#\s]+))*/

/**
 * CharacterDefinition represents char.def file and
 * defines behavior of unknown word processing
 * @constructor
 */
    function CharacterDefinition () {
      this.character_category_map = new Uint8Array(65536)  // for all UCS2 code points
      this.compatible_category_map = new Uint32Array(65536)  // for all UCS2 code points
      this.invoke_definition_map = null
    }

/**
 * Load CharacterDefinition
 * @param {Uint8Array} cat_map_buffer
 * @param {Uint32Array} compat_cat_map_buffer
 * @param {InvokeDefinitionMap} invoke_def_buffer
 * @returns {CharacterDefinition}
 */
    CharacterDefinition.load = function (cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer) {
      var char_def = new CharacterDefinition()
      char_def.character_category_map = cat_map_buffer
      char_def.compatible_category_map = compat_cat_map_buffer
      char_def.invoke_definition_map = InvokeDefinitionMap.load(invoke_def_buffer)
      return char_def
    }

/**
 * Factory method of CharacterDefinition
 * @param {string} text Contents of char.def
 */
    CharacterDefinition.readCharacterDefinition = function (text) {
      var lines = text.split(RETURN_PATTERN)
      var line
      var character_category_definition = []
      var category_mapping = []

      for (var i = 0; i < lines.length; i++) {
        line = lines[i]
        if (line == null) {
          continue
        }
        var parsed_category_def = CATEGORY_DEF_PATTERN.exec(line)
        if (parsed_category_def != null) {
          var class_id = character_category_definition.length
          var char_class = CharacterDefinition.parseCharCategory(class_id, parsed_category_def)
          if (char_class == null) {
            continue
          }
          character_category_definition.push(char_class)
          continue
        }
        var parsed_category_mapping = CATEGORY_MAPPING_PATTERN.exec(line)
        if (parsed_category_mapping != null) {
          var mapping = CharacterDefinition.parseCategoryMapping(parsed_category_mapping)
          category_mapping.push(mapping)
        }
        var parsed_range_category_mapping = RANGE_CATEGORY_MAPPING_PATTERN.exec(line)
        if (parsed_range_category_mapping != null) {
          var range_mapping = CharacterDefinition.parseRangeCategoryMapping(parsed_range_category_mapping)
          category_mapping.push(range_mapping)
        }
      }

    // TODO If DEFAULT category does not exist, throw error

      var char_def = new CharacterDefinition()
      char_def.invoke_definition_map = new InvokeDefinitionMap()
      char_def.invoke_definition_map.init(character_category_definition)
      char_def.initCategoryMappings(category_mapping)

      return char_def
    }

    CharacterDefinition.parseCharCategory = function (class_id, parsed_category_def) {
      var category = parsed_category_def[1]
      var invoke = parseInt(parsed_category_def[2])
      var grouping = parseInt(parsed_category_def[3])
      var max_length = parseInt(parsed_category_def[4])
      if (!isFinite(invoke) || (invoke !== 0 && invoke !== 1)) {
        console.log('char.def parse error. INVOKE is 0 or 1 in:' + invoke)
        return null
      }
      if (!isFinite(grouping) || (grouping !== 0 && grouping !== 1)) {
        console.log('char.def parse error. GROUP is 0 or 1 in:' + grouping)
        return null
      }
      if (!isFinite(max_length) || max_length < 0) {
        console.log('char.def parse error. LENGTH is 1 to n:' + max_length)
        return null
      }
      var is_invoke = (invoke === 1)
      var is_grouping = (grouping === 1)

      return new CharacterClass(class_id, category, is_invoke, is_grouping, max_length)
    }

    CharacterDefinition.parseCategoryMapping = function (parsed_category_mapping) {
      var start = parseInt(parsed_category_mapping[1])
      var default_category = parsed_category_mapping[2]
      var compatible_category = (parsed_category_mapping.length > 3) ? parsed_category_mapping.slice(3) : []
      if (!isFinite(start) || start < 0 || start > 0xFFFF) {
        console.log('char.def parse error. CODE is invalid:' + start)
      }
      return { start: start, default: default_category, compatible: compatible_category}
    }

    CharacterDefinition.parseRangeCategoryMapping = function (parsed_category_mapping) {
      var start = parseInt(parsed_category_mapping[1])
      var end = parseInt(parsed_category_mapping[2])
      var default_category = parsed_category_mapping[3]
      var compatible_category = (parsed_category_mapping.length > 4) ? parsed_category_mapping.slice(4) : []
      if (!isFinite(start) || start < 0 || start > 0xFFFF) {
        console.log('char.def parse error. CODE is invalid:' + start)
      }
      if (!isFinite(end) || end < 0 || end > 0xFFFF) {
        console.log('char.def parse error. CODE is invalid:' + end)
      }
      return { start: start, end: end, default: default_category, compatible: compatible_category}
    }

/**
 * Initializing method
 * @param {Array} category_mapping Array of category mapping
 */
    CharacterDefinition.prototype.initCategoryMappings = function (category_mapping) {
    // Initialize map by DEFAULT class
      var code_point
      if (category_mapping != null) {
        for (var i = 0; i < category_mapping.length; i++) {
          var mapping = category_mapping[i]
          var end = mapping.end || mapping.start
          for (code_point = mapping.start; code_point <= end; code_point++) {
                // Default Category class ID
            this.character_category_map[code_point] = this.invoke_definition_map.lookup(mapping.default)

            for (var j = 0; j < mapping.compatible.length; j++) {
              var bitset = this.compatible_category_map[code_point]
              var compatible_category = mapping.compatible[j]
              if (compatible_category == null) {
                continue
              }
              var class_id = this.invoke_definition_map.lookup(compatible_category)  // Default Category
              if (class_id == null) {
                continue
              }
              var class_id_bit = 1 << class_id
              bitset = bitset | class_id_bit  // Set a bit of class ID 例えば、class_idが3のとき、3ビット目に1を立てる
              this.compatible_category_map[code_point] = bitset
            }
          }
        }
      }
      var default_id = this.invoke_definition_map.lookup(DEFAULT_CATEGORY)
      if (default_id == null) {
        return
      }
      for (code_point = 0; code_point < this.character_category_map.length; code_point++) {
        // 他に何のクラスも定義されていなかったときだけ DEFAULT
        if (this.character_category_map[code_point] === 0) {
            // DEFAULT class ID に対応するビットだけ1を立てる
          this.character_category_map[code_point] = 1 << default_id
        }
      }
    }

/**
 * Lookup compatible categories for a character (not included 1st category)
 * @param {string} ch UCS2 character (just 1st character is effective)
 * @returns {Array.<CharacterClass>} character classes
 */
    CharacterDefinition.prototype.lookupCompatibleCategory = function (ch) {
      var classes = []

    /*
     if (SurrogateAwareString.isSurrogatePair(ch)) {
     // Surrogate pair character codes can not be defined by char.def
     return classes;
     } */
      var code = ch.charCodeAt(0)
      var integer
      if (code < this.compatible_category_map.length) {
        integer = this.compatible_category_map[code]  // Bitset
      }

      if (integer == null || integer === 0) {
        return classes
      }

      for (var bit = 0; bit < 32; bit++) {  // Treat "bit" as a class ID
        if (((integer << (31 - bit)) >>> 31) === 1) {
          var character_class = this.invoke_definition_map.getCharacterClass(bit)
          if (character_class == null) {
            continue
          }
          classes.push(character_class)
        }
      }
      return classes
    }

/**
 * Lookup category for a character
 * @param {string} ch UCS2 character (just 1st character is effective)
 * @returns {CharacterClass} character class
 */
    CharacterDefinition.prototype.lookup = function (ch) {
      var class_id

      var code = ch.charCodeAt(0)
      if (SurrogateAwareString.isSurrogatePair(ch)) {
        // Surrogate pair character codes can not be defined by char.def, so set DEFAULT category
        class_id = this.invoke_definition_map.lookup(DEFAULT_CATEGORY)
      } else if (code < this.character_category_map.length) {
        class_id = this.character_category_map[code]  // Read as integer value
      }

      if (class_id == null) {
        class_id = this.invoke_definition_map.lookup(DEFAULT_CATEGORY)
      }

      return this.invoke_definition_map.getCharacterClass(class_id)
    }

    module.exports = CharacterDefinition
  }, {'../util/SurrogateAwareString.js': 51, './CharacterClass.js': 39, './InvokeDefinitionMap.js': 43}],
  41: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

/**
 * Connection costs matrix from cc.dat file.
 * 2 dimension matrix [forward_id][backward_id] -> cost
 * @param {number} initial_size Initial size of buffer
 * @constructor
 */
    function ConnectionCosts (initial_size) {
      this.dimension = 0
      this.buffer = new Int16Array(initial_size)

    // 1 dimensional array in original implementation
    // this.costs = [];
    }

    ConnectionCosts.prototype.put = function (forward_id, backward_id, cost) {
      if (!isFinite(forward_id)) {
        console.log(forward_id + ' ' + backward_id + ' ' + cost)
      }
      var index = forward_id * this.dimension + backward_id
      if (this.buffer.length < index + 1) {
        throw 'ConnectionCosts buffer overflow'
      }
      this.buffer[index] = cost

    // if (this.costs[forward_id] == null) {
    //     this.costs[forward_id] = [];
    // }
    // this.costs[forward_id][backward_id] = cost;
    }

    ConnectionCosts.prototype.get = function (forward_id, backward_id) {
      var index = forward_id * this.dimension + backward_id
      if (this.buffer.length < index + 1) {
        throw 'ConnectionCosts buffer overflow'
      }
      return this.buffer[index]

    // if (this.costs[forward_id] == null) {
    //     return null;
    // }
    // return this.costs[forward_id][backward_id];
    }

    ConnectionCosts.prototype.loadConnectionCosts = function (connection_costs_buffer) {
    // TODO Read dimension from connection_costs_buffer
      this.dimension = 1316
      this.buffer = connection_costs_buffer
    }

/**
 * Parse and build ConnectionCosts from contents of "matrix.def"
 * @param {string} matrix_text Text contents of "matrix.def"
 * @returns {ConnectionCosts}
 */
    ConnectionCosts.build = function (matrix_text) {
      var rows = matrix_text.split(/\n/).map(function (row) {
        return row.split(' ')
      })

    // Row 1
    // var forward_size = rows[0][0];
      var backward_size = rows[0][1]

    // id and cost must be a short value
      var costs = new ConnectionCosts(backward_size * backward_size)
      costs.dimension = backward_size

      for (var i = 1; i < rows.length; i++) {
        if (rows[i].length < 3) {
          continue
        }

        var forward_id = parseInt(rows[i][0])
        var backward_id = parseInt(rows[i][1])
        var cost = parseInt(rows[i][2])

        // Assertion
        if (forward_id < 0 || backward_id < 0) {
          console.log('Error in:' + rows[i])
        }

        costs.put(forward_id, backward_id, cost)
      }

      return costs
    }

    module.exports = ConnectionCosts
  }, {}],
  42: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

    var doublearray = require('doublearray')

    var TokenInfoDictionary = require('./TokenInfoDictionary.js')
    var ConnectionCosts = require('./ConnectionCosts.js')
    var UnknownDictionary = require('./UnknownDictionary.js')

/**
 * Dictionaries container for Tokenizer
 * @param {DoubleArray} trie
 * @param {TokenInfoDictionary} token_info_dictionary
 * @param {ConnectionCosts} connection_costs
 * @param {UnknownDictionary} unknown_dictionary
 * @constructor
 */
    function DynamicDictionaries (trie, token_info_dictionary, connection_costs, unknown_dictionary) {
      if (trie != null) {
        this.trie = trie
      } else {
        this.trie = doublearray.builder(0).build([
            {k: '', v: 1}
        ])
      }
      if (token_info_dictionary != null) {
        this.token_info_dictionary = token_info_dictionary
      } else {
        this.token_info_dictionary = new TokenInfoDictionary()
      }
      if (connection_costs != null) {
        this.connection_costs = connection_costs
      } else {
        // backward_size * backward_size
        this.connection_costs = new ConnectionCosts(0)
      }
      if (unknown_dictionary != null) {
        this.unknown_dictionary = unknown_dictionary
      } else {
        this.unknown_dictionary = new UnknownDictionary()
      }
    }

// from base.dat & check.dat
    DynamicDictionaries.prototype.loadTrie = function (base_buffer, check_buffer) {
      this.trie = doublearray.load(base_buffer, check_buffer)
      return this
    }

    DynamicDictionaries.prototype.loadTokenInfoDictionaries = function (token_info_buffer, pos_buffer, target_map_buffer) {
      this.token_info_dictionary.loadDictionary(token_info_buffer)
      this.token_info_dictionary.loadPosVector(pos_buffer)
      this.token_info_dictionary.loadTargetMap(target_map_buffer)
      return this
    }

    DynamicDictionaries.prototype.loadConnectionCosts = function (cc_buffer) {
      this.connection_costs.loadConnectionCosts(cc_buffer)
      return this
    }

    DynamicDictionaries.prototype.loadUnknownDictionaries = function (unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer) {
      this.unknown_dictionary.loadUnknownDictionaries(unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer)
      return this
    }

    module.exports = DynamicDictionaries
  }, {'./ConnectionCosts.js': 41, './TokenInfoDictionary.js': 44, './UnknownDictionary.js': 45, 'doublearray': 57}],
  43: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

    var ByteBuffer = require('../util/ByteBuffer.js')
    var CharacterClass = require('./CharacterClass.js')

/**
 * InvokeDefinitionMap represents invoke definition a part of char.def
 * @constructor
 */
    function InvokeDefinitionMap () {
      this.map = []
      this.lookup_table = {}  // Just for building dictionary
    }

/**
 * Load InvokeDefinitionMap from buffer
 * @param {Uint8Array} invoke_def_buffer
 * @returns {InvokeDefinitionMap}
 */
    InvokeDefinitionMap.load = function (invoke_def_buffer) {
      var invoke_def = new InvokeDefinitionMap()
      var character_category_definition = []

      var buffer = new ByteBuffer(invoke_def_buffer)
      while (buffer.position + 1 < buffer.size()) {
        var class_id = character_category_definition.length
        var is_always_invoke = buffer.get()
        var is_grouping = buffer.get()
        var max_length = buffer.getInt()
        var class_name = buffer.getString()
        character_category_definition.push(new CharacterClass(class_id, class_name, is_always_invoke, is_grouping, max_length))
      }

      invoke_def.init(character_category_definition)

      return invoke_def
    }

/**
 * Initializing method
 * @param {Array.<CharacterClass>} character_category_definition Array of CharacterClass
 */
    InvokeDefinitionMap.prototype.init = function (character_category_definition) {
      if (character_category_definition == null) {
        return
      }
      for (var i = 0; i < character_category_definition.length; i++) {
        var character_class = character_category_definition[i]
        this.map[i] = character_class
        this.lookup_table[character_class.class_name] = i
      }
    }

/**
 * Get class information by class ID
 * @param {number} class_id
 * @returns {CharacterClass}
 */
    InvokeDefinitionMap.prototype.getCharacterClass = function (class_id) {
      return this.map[class_id]
    }

/**
 * For building character definition dictionary
 * @param {string} class_name character
 * @returns {number} class_id
 */
    InvokeDefinitionMap.prototype.lookup = function (class_name) {
      var class_id = this.lookup_table[class_name]
      if (class_id == null) {
        return null
      }
      return class_id
    }

/**
 * Transform from map to binary buffer
 * @returns {Uint8Array}
 */
    InvokeDefinitionMap.prototype.toBuffer = function () {
      var buffer = new ByteBuffer()
      for (var i = 0; i < this.map.length; i++) {
        var char_class = this.map[i]
        buffer.put(char_class.is_always_invoke)
        buffer.put(char_class.is_grouping)
        buffer.putInt(char_class.max_length)
        buffer.putString(char_class.class_name)
      }
      buffer.shrink()
      return buffer.buffer
    }

    module.exports = InvokeDefinitionMap
  }, {'../util/ByteBuffer.js': 48, './CharacterClass.js': 39}],
  44: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

    var ByteBuffer = require('../util/ByteBuffer.js')

/**
 * TokenInfoDictionary
 * @constructor
 */
    function TokenInfoDictionary () {
      this.dictionary = new ByteBuffer(10 * 1024 * 1024)
      this.target_map = {}  // trie_id (of surface form) -> token_info_id (of token)
      this.pos_buffer = new ByteBuffer(10 * 1024 * 1024)
    }

// left_id right_id word_cost ...
// ^ this position is token_info_id
    TokenInfoDictionary.prototype.buildDictionary = function (entries) {
      var dictionary_entries = {}  // using as hashmap, string -> string (word_id -> surface_form) to build dictionary

      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i]

        if (entry.length < 4) {
          continue
        }

        var surface_form = entry[0]
        var left_id = entry[1]
        var right_id = entry[2]
        var word_cost = entry[3]
        var feature = entry.slice(4).join(',')  // TODO Optimize

        // Assertion
        if (!isFinite(left_id) || !isFinite(right_id) || !isFinite(word_cost)) {
          console.log(entry)
        }

        var token_info_id = this.put(left_id, right_id, word_cost, surface_form, feature)
        dictionary_entries[token_info_id] = surface_form
      }

    // Remove last unused area
      this.dictionary.shrink()
      this.pos_buffer.shrink()

      return dictionary_entries
    }

    TokenInfoDictionary.prototype.put = function (left_id, right_id, word_cost, surface_form, feature) {
      var token_info_id = this.dictionary.position
      var pos_id = this.pos_buffer.position

      this.dictionary.putShort(left_id)
      this.dictionary.putShort(right_id)
      this.dictionary.putShort(word_cost)
      this.dictionary.putInt(pos_id)
      this.pos_buffer.putString(surface_form + ',' + feature)

      return token_info_id
    }

    TokenInfoDictionary.prototype.addMapping = function (source, target) {
      var mapping = this.target_map[source]
      if (mapping == null) {
        mapping = []
      }
      mapping.push(target)

      this.target_map[source] = mapping
    }

    TokenInfoDictionary.prototype.targetMapToBuffer = function () {
      var buffer = new ByteBuffer()
      var map_keys_size = Object.keys(this.target_map).length
      buffer.putInt(map_keys_size)
      for (var key in this.target_map) {
        var values = this.target_map[key]  // Array
        var map_values_size = values.length
        buffer.putInt(parseInt(key))
        buffer.putInt(map_values_size)
        for (var i = 0; i < values.length; i++) {
          buffer.putInt(values[i])
        }
      }
      return buffer.shrink()  // Shrink-ed Typed Array
    }

// from tid.dat
    TokenInfoDictionary.prototype.loadDictionary = function (array_buffer) {
      this.dictionary = new ByteBuffer(array_buffer)
      return this
    }

// from tid_pos.dat
    TokenInfoDictionary.prototype.loadPosVector = function (array_buffer) {
      this.pos_buffer = new ByteBuffer(array_buffer)
      return this
    }

// from tid_map.dat
    TokenInfoDictionary.prototype.loadTargetMap = function (array_buffer) {
      var buffer = new ByteBuffer(array_buffer)
      buffer.position = 0
      this.target_map = {}
      buffer.readInt()  // map_keys_size
      while (true) {
        if (buffer.buffer.length < buffer.position + 1) {
          break
        }
        var key = buffer.readInt()
        var map_values_size = buffer.readInt()
        for (var i = 0; i < map_values_size; i++) {
          var value = buffer.readInt()
          this.addMapping(key, value)
        }
      }
      return this
    }

/**
 * Look up features in the dictionary
 * @param {string} token_info_id_str Word ID to look up
 * @returns {string} Features string concatenated by ","
 */
    TokenInfoDictionary.prototype.getFeatures = function (token_info_id_str) {
      var token_info_id = parseInt(token_info_id_str)
      if (isNaN(token_info_id)) {
        // TODO throw error
        return ''
      }
      var pos_id = this.dictionary.getInt(token_info_id + 6)
      return this.pos_buffer.getString(pos_id)
    }

    module.exports = TokenInfoDictionary
  }, {'../util/ByteBuffer.js': 48}],
  45: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

    var TokenInfoDictionary = require('./TokenInfoDictionary.js')
    var CharacterDefinition = require('./CharacterDefinition.js')
    var ByteBuffer = require('../util/ByteBuffer.js')

/**
 * UnknownDictionary
 * @constructor
 */
    function UnknownDictionary () {
    // TokenInfoDictionary.apply(this);  // execute super class constructor
      this.dictionary = new ByteBuffer(10 * 1024 * 1024)
      this.target_map = {}  // class_id (of CharacterClass) -> token_info_id (of unknown class)
      this.pos_buffer = new ByteBuffer(10 * 1024 * 1024)
      this.character_definition = null
    }

// Inherit from TokenInfoDictionary as a super class
    UnknownDictionary.prototype = Object.create(TokenInfoDictionary.prototype)
// UnknownDictionary.prototype.constructor = UnknownDictionary;

    UnknownDictionary.prototype.characterDefinition = function (character_definition) {
      this.character_definition = character_definition
      return this
    }

    UnknownDictionary.prototype.lookup = function (ch) {
      return this.character_definition.lookup(ch)
    }

    UnknownDictionary.prototype.lookupCompatibleCategory = function (ch) {
      return this.character_definition.lookupCompatibleCategory(ch)
    }

    UnknownDictionary.prototype.loadUnknownDictionaries = function (unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer) {
      this.loadDictionary(unk_buffer)
      this.loadPosVector(unk_pos_buffer)
      this.loadTargetMap(unk_map_buffer)
      this.character_definition = CharacterDefinition.load(cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer)
    }

    module.exports = UnknownDictionary
  }, {'../util/ByteBuffer.js': 48, './CharacterDefinition.js': 40, './TokenInfoDictionary.js': 44}],
  46: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

    var TokenizerBuilder = require('./TokenizerBuilder.js')
    var DictionaryBuilder = require('./util/DictionaryBuilder.js')

// Public methods
    var kuromoji = {
      builder: function (option) {
        return new TokenizerBuilder(option)
      },
      dictionaryBuilder: function () {
        return new DictionaryBuilder()
      }
    }

    if (typeof window === 'undefined') {
    // In node
      module.exports = kuromoji
    } else {
    // In browser
      window.kuromoji = kuromoji
    }
  }, {'./TokenizerBuilder.js': 38, './util/DictionaryBuilder.js': 49}],
  47: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

    var async = require('async')
    var zlib = require('zlibjs/bin/gunzip.min.js')

    var DynamicDictionaries = require('../dict/DynamicDictionaries.js')

    var fs
    var node_zlib
    var is_browser

    if (typeof window === 'undefined') {
    // In node
      fs = require('fs')
      node_zlib = require('zlib')
      is_browser = false
    } else {
      is_browser = true
    }

/**
 * DictionaryLoader base constructor
 * @param {string} dic_path Dictionary path
 * @constructor
 */
    function DictionaryLoader (dic_path) {
      this.dic = new DynamicDictionaries()
      this.dic_path = dic_path
    }

/**
 * Factory method for DictionaryLoader
 * @param {string} dic_path Dictionary path
 */
    DictionaryLoader.getLoader = function (dic_path) {
      if (is_browser) {
        // In browser
        return new BrowserDictionaryLoader(dic_path)
      } else {
        // In node
        return new NodeDictionaryLoader(dic_path)
      }
    }

/**
 * Load dictionary files
 * @param {DictionaryLoader~onLoad} load_callback Callback function called after loaded
 */
    DictionaryLoader.prototype.load = function (load_callback) {
      var dic = this.dic
      var dic_path = this.dic_path
      var loadArrayBuffer = this.loadArrayBuffer

      async.parallel([
        // Trie
        function (callback) {
          async.map([ 'base.dat.gz', 'check.dat.gz' ], function (filename, _callback) {
            loadArrayBuffer(dic_path + filename, function (err, buffer) {
              _callback(null, buffer)
            })
          }, function (err, buffers) {
            var base_buffer = new Int32Array(buffers[0])
            var check_buffer = new Int32Array(buffers[1])

            dic.loadTrie(base_buffer, check_buffer)
            callback(null)
          })
        },
        // Token info dictionaries
        function (callback) {
          async.map([ 'tid.dat.gz', 'tid_pos.dat.gz', 'tid_map.dat.gz' ], function (filename, _callback) {
            loadArrayBuffer(dic_path + filename, function (err, buffer) {
              _callback(null, buffer)
            })
          }, function (err, buffers) {
            var token_info_buffer = new Uint8Array(buffers[0])
            var pos_buffer = new Uint8Array(buffers[1])
            var target_map_buffer = new Uint8Array(buffers[2])

            dic.loadTokenInfoDictionaries(token_info_buffer, pos_buffer, target_map_buffer)
            callback(null)
          })
        },
        // Connection cost matrix
        function (callback) {
          loadArrayBuffer(dic_path + 'cc.dat.gz', function (err, buffer) {
            var cc_buffer = new Int16Array(buffer)
            dic.loadConnectionCosts(cc_buffer)
            callback(null)
          })
        },
        // Unknown dictionaries
        function (callback) {
          async.map([ 'unk.dat.gz', 'unk_pos.dat.gz', 'unk_map.dat.gz', 'unk_char.dat.gz', 'unk_compat.dat.gz', 'unk_invoke.dat.gz' ], function (filename, _callback) {
            loadArrayBuffer(dic_path + filename, function (err, buffer) {
              _callback(null, buffer)
            })
          }, function (err, buffers) {
            var unk_buffer = new Uint8Array(buffers[0])
            var unk_pos_buffer = new Uint8Array(buffers[1])
            var unk_map_buffer = new Uint8Array(buffers[2])
            var cat_map_buffer = new Uint8Array(buffers[3])
            var compat_cat_map_buffer = new Uint32Array(buffers[4])
            var invoke_def_buffer = new Uint8Array(buffers[5])

            dic.loadUnknownDictionaries(unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer)
                // dic.loadUnknownDictionaries(char_buffer, unk_buffer);
            callback(null)
          })
        }
      ], function (err) {
        load_callback(err, dic)
      })
    }

/**
 * Callback
 * @callback DictionaryLoader~onLoad
 * @param {Object} err Error object
 * @param {DynamicDictionaries} dic Loaded dictionary
 */

/**
 * BrowserDictionaryLoader inherits DictionaryLoader, using jQuery XHR for download
 * @param {string} dic_path Dictionary path
 * @constructor
 */
    function BrowserDictionaryLoader (dic_path) {
      DictionaryLoader.apply(this, [ dic_path ])
    }
    BrowserDictionaryLoader.prototype = Object.create(DictionaryLoader.prototype)
// BrowserDictionaryLoader.prototype.constructor = BrowserDictionaryLoader;

/**
 * Utility function to load gzipped dictionary
 * @param {string} url Dictionary URL
 * @param {BrowserDictionaryLoader~onLoad} callback Callback function
 */
    BrowserDictionaryLoader.prototype.loadArrayBuffer = function (url, callback) {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = function () {
        if (this.status !== 200) {
          callback(xhr.statusText, null)
        }
        var arraybuffer = this.response

        var gz = new zlib.Zlib.Gunzip(new Uint8Array(arraybuffer))
        var typed_array = gz.decompress()
        callback(null, typed_array.buffer)
      }
      xhr.onerror = function (err) {
        callback(err, null)
      }
      xhr.send()
    }

/**
 * Callback
 * @callback BrowserDictionaryLoader~onLoad
 * @param {Object} err Error object
 * @param {Uint8Array} buffer Loaded buffer
 */

/**
 * NodeDictionaryLoader inherits DictionaryLoader
 * @param {string} dic_path Dictionary path
 * @constructor
 */
    function NodeDictionaryLoader (dic_path) {
      DictionaryLoader.apply(this, [ dic_path ])
    }
    NodeDictionaryLoader.prototype = Object.create(DictionaryLoader.prototype)
// NodeDictionaryLoader.prototype.constructor = NodeDictionaryLoader;

/**
 * Utility function
 * @param {string} file Dictionary file path
 * @param {NodeDictionaryLoader~onLoad} callback Callback function
 */
    NodeDictionaryLoader.prototype.loadArrayBuffer = function (file, callback) {
      fs.readFile(file, function (err, buffer) {
        node_zlib.gunzip(buffer, function (err2, decompressed) {
          var typed_array = new Uint8Array(decompressed)
          callback(null, typed_array.buffer)
        })
      })
    }

/**
 * @callback NodeDictionaryLoader~onLoad
 * @param {Object} err Error object
 * @param {Uint8Array} buffer Loaded buffer
 */

    module.exports = DictionaryLoader
  }, {'../dict/DynamicDictionaries.js': 42, 'async': 56, 'fs': 1, 'zlib': 16, 'zlibjs/bin/gunzip.min.js': 58}],
  48: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

/**
 * Convert String (UTF-16) to UTF-8 ArrayBuffer
 *
 * @param {String} str UTF-16 string to convert
 * @return {Uint8Array} Byte sequence encoded by UTF-8
 */
    var stringToUtf8Bytes = function (str) {
    // Max size of 1 character is 4 bytes
      var bytes = new Uint8Array(str.length * 4)

      var i = 0, j = 0

      while (i < str.length) {
        var unicode_code

        var utf16_code = str.charCodeAt(i++)
        if (utf16_code >= 0xD800 && utf16_code <= 0xDBFF) {
            // surrogate pair
          var upper = utf16_code           // high surrogate
          var lower = str.charCodeAt(i++)  // low surrogate

          if (lower >= 0xDC00 && lower <= 0xDFFF) {
            unicode_code =
                    (upper - 0xD800) * (1 << 10) + (1 << 16) +
                    (lower - 0xDC00)
          } else {
                // malformed surrogate pair
            return null
          }
        } else {
            // not surrogate code
          unicode_code = utf16_code
        }

        if (unicode_code < 0x80) {
            // 1-byte
          bytes[j++] = unicode_code
        } else if (unicode_code < (1 << 11)) {
            // 2-byte
          bytes[j++] = (unicode_code >>> 6) | 0xC0
          bytes[j++] = (unicode_code & 0x3F) | 0x80
        } else if (unicode_code < (1 << 16)) {
            // 3-byte
          bytes[j++] = (unicode_code >>> 12) | 0xE0
          bytes[j++] = ((unicode_code >> 6) & 0x3f) | 0x80
          bytes[j++] = (unicode_code & 0x3F) | 0x80
        } else if (unicode_code < (1 << 21)) {
            // 4-byte
          bytes[j++] = (unicode_code >>> 18) | 0xF0
          bytes[j++] = ((unicode_code >> 12) & 0x3F) | 0x80
          bytes[j++] = ((unicode_code >> 6) & 0x3F) | 0x80
          bytes[j++] = (unicode_code & 0x3F) | 0x80
        } else {
            // malformed UCS4 code
        }
      }

      return bytes.subarray(0, j)
    }

/**
 * Convert UTF-8 ArrayBuffer to String (UTF-16)
 *
 * @param {Array} bytes UTF-8 byte sequence to convert
 * @return {String} String encoded by UTF-16
 */
    var utf8BytesToString = function (bytes) {
      var str = ''
      var code, b1, b2, b3, b4, upper, lower
      var i = 0

      while (i < bytes.length) {
        b1 = bytes[i++]

        if (b1 < 0x80) {
            // 1 byte
          code = b1
        } else if ((b1 >> 5) === 0x06) {
            // 2 bytes
          b2 = bytes[i++]
          code = ((b1 & 0x1f) << 6) | (b2 & 0x3f)
        } else if ((b1 >> 4) === 0x0e) {
            // 3 bytes
          b2 = bytes[i++]
          b3 = bytes[i++]
          code = ((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f)
        } else {
            // 4 bytes
          b2 = bytes[i++]
          b3 = bytes[i++]
          b4 = bytes[i++]
          code = ((b1 & 0x07) << 18) | ((b2 & 0x3f) << 12) | ((b3 & 0x3f) << 6) | (b4 & 0x3f)
        }

        if (code < 0x10000) {
          str += String.fromCharCode(code)
        } else {
            // surrogate pair
          code -= 0x10000
          upper = (0xD800 | (code >> 10))
          lower = (0xDC00 | (code & 0x3FF))
          str += String.fromCharCode(upper, lower)
        }
      }

      return str
    }

/**
 * Utilities to manipulate byte sequence
 * @param {(number|Uint8Array)} arg Initial size of this buffer (number), or buffer to set (Uint8Array)
 * @constructor
 */
    function ByteBuffer (arg) {
      var initial_size
      if (arg == null) {
        initial_size = 1024 * 1024
      } else if (typeof arg === 'number') {
        initial_size = arg
      } else if (arg instanceof Uint8Array) {
        this.buffer = arg
        this.position = 0  // Overwrite
        return
      } else {
        // typeof arg -> String
        throw typeof arg + ' is invalid parameter type for ByteBuffer constructor'
      }
    // arg is null or number
      this.buffer = new Uint8Array(initial_size)
      this.position = 0
    }

    ByteBuffer.prototype.size = function () {
      return this.buffer.length
    }

    ByteBuffer.prototype.reallocate = function () {
      var new_array = new Uint8Array(this.buffer.length * 2)
      new_array.set(this.buffer)
      this.buffer = new_array
    }

    ByteBuffer.prototype.shrink = function () {
      this.buffer = this.buffer.subarray(0, this.position)
      return this.buffer
    }

    ByteBuffer.prototype.put = function (b) {
      if (this.buffer.length < this.position + 1) {
        this.reallocate()
      }
      this.buffer[this.position++] = b
    }

    ByteBuffer.prototype.get = function (index) {
      if (index == null) {
        index = this.position
        this.position += 1
      }
      if (this.buffer.length < index + 1) {
        return 0
      }
      return this.buffer[index]
    }

// Write short to buffer by little endian
    ByteBuffer.prototype.putShort = function (num) {
      if (num > 0xFFFF) {
        throw num + ' is over short value'
      }
      var lower = (0x00FF & num)
      var upper = (0xFF00 & num) >> 8
      this.put(lower)
      this.put(upper)
    }

// Read short from buffer by little endian
    ByteBuffer.prototype.getShort = function (index) {
      if (index == null) {
        index = this.position
        this.position += 2
      }
      if (this.buffer.length < index + 2) {
        return 0
      }
      var lower = this.buffer[index]
      var upper = this.buffer[index + 1]
      return (upper << 8) + lower
    }

// Write integer to buffer by little endian
    ByteBuffer.prototype.putInt = function (num) {
      if (num > 0xFFFFFFFF) {
        throw num + ' is over integer value'
      }
      var b0 = (0x000000FF & num)
      var b1 = (0x0000FF00 & num) >> 8
      var b2 = (0x00FF0000 & num) >> 16
      var b3 = (0xFF000000 & num) >> 24
      this.put(b0)
      this.put(b1)
      this.put(b2)
      this.put(b3)
    }

// Read integer from buffer by little endian
    ByteBuffer.prototype.getInt = function (index) {
      if (index == null) {
        index = this.position
        this.position += 4
      }
      if (this.buffer.length < index + 4) {
        return 0
      }
      var b0 = this.buffer[index]
      var b1 = this.buffer[index + 1]
      var b2 = this.buffer[index + 2]
      var b3 = this.buffer[index + 3]

      return (b3 << 24) + (b2 << 16) + (b1 << 8) + b0
    }

    ByteBuffer.prototype.readInt = function () {
      var pos = this.position
      this.position += 4
      return this.getInt(pos)
    }

    ByteBuffer.prototype.putString = function (str) {
      var bytes = stringToUtf8Bytes(str)
      for (var i = 0; i < bytes.length; i++) {
        this.put(bytes[i])
      }
    // put null character as terminal character
      this.put(0)
    }

    ByteBuffer.prototype.getString = function (index) {
      var buf = [],
        ch
      if (index == null) {
        index = this.position
      }
      while (true) {
        if (this.buffer.length < index + 1) {
          break
        }
        ch = this.get(index++)
        if (ch === 0) {
          break
        } else {
          buf.push(ch)
        }
      }
      this.position = index
      return utf8BytesToString(buf)
    }

    module.exports = ByteBuffer
  }, {}],
  49: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

    var doublearray = require('doublearray')

    var DynamicDictionaries = require('../dict/DynamicDictionaries.js')
    var TokenInfoDictionary = require('../dict/TokenInfoDictionary.js')
    var ConnectionCosts = require('../dict/ConnectionCosts.js')
    var UnknownDictionary = require('../dict/UnknownDictionary.js')
    var CharacterDefinition = require('../dict/CharacterDefinition.js')  // TODO Remove this dependency

/**
 * Build dictionaries (token info, connection costs)
 *
 * Generates from matrix.def
 * cc.dat: Connection costs
 *
 * Generates from *.csv
 * dat.dat: Double array
 * tid.dat: Token info dictionary
 * tid_map.dat: targetMap
 * tid_pos.dat: posList (part of speech)
 */
    function DictionaryBuilder () {
    // Array of entries, each entry in Mecab form
    // (0: surface form, 1: left id, 2: right id, 3: word cost, 4: part of speech id, 5-: other features)
      this.tid_entries = []
      this.unk_entries = []

      this.matrix_text = '0 0'
      this.char_text = ''
    }

    DictionaryBuilder.prototype.addTokenInfoDictionary = function (text) {
      var new_entries = text.split(/\n/).map(function (row) {
        return row.split(',')
      })
      this.tid_entries = this.tid_entries.concat(new_entries)
      return this
    }

/**
 *
 * @param {string} matrix_text Contents of file "matrix.def"
 * @returns {DictionaryBuilder}
 */
    DictionaryBuilder.prototype.costMatrix = function (matrix_text) {
      this.matrix_text = matrix_text
      return this
    }

    DictionaryBuilder.prototype.charDef = function (char_text) {
      this.char_text = char_text
      return this
    }

    DictionaryBuilder.prototype.unkDef = function (text) {
      this.unk_entries = text.split(/\n/).map(function (row) {
        return row.split(',')
      })
      return this
    }

    DictionaryBuilder.prototype.build = function () {
      var dictionaries = this.buildTokenInfoDictionary()
      var connection_costs = this.buildConnectionCosts()
      var unknown_dictionary = this.buildUnknownDictionary()

      return new DynamicDictionaries(dictionaries.trie, dictionaries.token_info_dictionary, connection_costs, unknown_dictionary)
    }

/**
 * Build TokenInfoDictionary
 *
 * @returns {{trie: *, token_info_dictionary: *}}
 */
    DictionaryBuilder.prototype.buildTokenInfoDictionary = function () {
      var token_info_dictionary = new TokenInfoDictionary()

    // using as hashmap, string -> string (word_id -> surface_form) to build dictionary
      var dictionary_entries = token_info_dictionary.buildDictionary(this.tid_entries)

      var trie = this.buildDoubleArray()

      for (var token_info_id in dictionary_entries) {
        var surface_form = dictionary_entries[token_info_id]
        var trie_id = trie.lookup(surface_form)

        // Assertion
        // if (trie_id < 0) {
        //     console.log("Not Found:" + surface_form);
        // }

        token_info_dictionary.addMapping(trie_id, token_info_id)
      }

      return {
        trie: trie,
        token_info_dictionary: token_info_dictionary
      }
    }

    DictionaryBuilder.prototype.buildUnknownDictionary = function () {
      var unk_dictionary = new UnknownDictionary()

    // using as hashmap, string -> string (word_id -> surface_form) to build dictionary
      var dictionary_entries = unk_dictionary.buildDictionary(this.unk_entries)

      var char_def = CharacterDefinition.readCharacterDefinition(this.char_text) // Create CharacterDefinition (factory method)

      unk_dictionary.characterDefinition(char_def)

      for (var token_info_id in dictionary_entries) {
        var class_name = dictionary_entries[token_info_id]
        var class_id = char_def.invoke_definition_map.lookup(class_name)

        // Assertion
        // if (trie_id < 0) {
        //     console.log("Not Found:" + surface_form);
        // }

        unk_dictionary.addMapping(class_id, token_info_id)
      }

      return unk_dictionary
    }

/**
 * Build connection costs dictionary
 */
    DictionaryBuilder.prototype.buildConnectionCosts = function () {
      return ConnectionCosts.build(this.matrix_text)
    }

/**
 * Build double array trie
 *
 * @returns {DoubleArray} Double-Array trie
 */
    DictionaryBuilder.prototype.buildDoubleArray = function () {
      var trie_id = 0
      var words = this.tid_entries.map(function (entry) {
        var surface_form = entry[0]
        return { k: surface_form, v: trie_id++ }
      })

      var builder = doublearray.builder(1024 * 1024)
      return builder.build(words)
    }

    module.exports = DictionaryBuilder
  }, {'../dict/CharacterDefinition.js': 40, '../dict/ConnectionCosts.js': 41, '../dict/DynamicDictionaries.js': 42, '../dict/TokenInfoDictionary.js': 44, '../dict/UnknownDictionary.js': 45, 'doublearray': 57}],
  50: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

/**
 * Mappings between IPADIC dictionary features and tokenized results
 * @constructor
 */
    function IpadicFormatter () {
    }

    IpadicFormatter.prototype.formatEntry = function (word_id, position, type, features) {
      var token = {}
      token.word_id = word_id
      token.word_type = type
      token.word_position = position

      token.surface_form = features[0]
      token.pos = features[1]
      token.pos_detail_1 = features[2]
      token.pos_detail_2 = features[3]
      token.pos_detail_3 = features[4]
      token.conjugated_type = features[5]
      token.conjugated_form = features[6]
      token.basic_form = features[7]
      token.reading = features[8]
      token.pronunciation = features[9]

      return token
    }

    IpadicFormatter.prototype.formatUnknownEntry = function (word_id, position, type, features, surface_form) {
      var token = {}
      token.word_id = word_id
      token.word_type = type
      token.word_position = position

      token.surface_form = surface_form
      token.pos = features[1]
      token.pos_detail_1 = features[2]
      token.pos_detail_2 = features[3]
      token.pos_detail_3 = features[4]
      token.conjugated_type = features[5]
      token.conjugated_form = features[6]
      token.basic_form = features[7]
    // token.reading = features[8];
    // token.pronunciation = features[9];

      return token
    }

    module.exports = IpadicFormatter
  }, {}],
  51: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

/**
 * String wrapper for UTF-16 surrogate pair (4 bytes)
 * @param {string} str String to wrap
 * @constructor
 */
    function SurrogateAwareString (str) {
      this.str = str
      this.index_mapping = []

      for (var pos = 0; pos < str.length; pos++) {
        var ch = str.charAt(pos)
        this.index_mapping.push(pos)
        if (SurrogateAwareString.isSurrogatePair(ch)) {
          pos++
        }
      }
    // Surrogate aware length
      this.length = this.index_mapping.length
    }

    SurrogateAwareString.prototype.slice = function (index) {
      if (this.index_mapping.length <= index) {
        return ''
      }
      var surrogate_aware_index = this.index_mapping[index]
      return this.str.slice(surrogate_aware_index)
    }

    SurrogateAwareString.prototype.charAt = function (index) {
      if (this.str.length <= index) {
        return ''
      }
      var surrogate_aware_start_index = this.index_mapping[index]
      var surrogate_aware_end_index = this.index_mapping[index + 1]

      if (surrogate_aware_end_index == null) {
        return this.str.slice(surrogate_aware_start_index)
      }
      return this.str.slice(surrogate_aware_start_index, surrogate_aware_end_index)
    }

    SurrogateAwareString.prototype.charCodeAt = function (index) {
      if (this.index_mapping.length <= index) {
        return NaN
      }
      var surrogate_aware_index = this.index_mapping[index]
      var upper = this.str.charCodeAt(surrogate_aware_index)
      var lower
      if (upper >= 0xD800 && upper <= 0xDBFF && surrogate_aware_index < this.str.length) {
        lower = this.str.charCodeAt(surrogate_aware_index + 1)
        if (lower >= 0xDC00 && lower <= 0xDFFF) {
          return (upper - 0xD800) * 0x400 + lower - 0xDC00 + 0x10000
        }
      }
      return upper
    }

    SurrogateAwareString.prototype.toString = function () {
      return this.str
    }

    SurrogateAwareString.isSurrogatePair = function (ch) {
      var utf16_code = ch.charCodeAt(0)
      if (utf16_code >= 0xD800 && utf16_code <= 0xDBFF) {
        // surrogate pair
        return true
      } else {
        return false
      }
    }

    module.exports = SurrogateAwareString
  }, {}],
  52: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

    var ViterbiNode = require('./ViterbiNode.js')
    var ViterbiLattice = require('./ViterbiLattice.js')
    var SurrogateAwareString = require('../util/SurrogateAwareString.js')

/**
 * ViterbiBuilder builds word lattice (ViterbiLattice)
 * @param {DynamicDictionaries} dic dictionary
 * @constructor
 */
    function ViterbiBuilder (dic) {
      this.trie = dic.trie
      this.token_info_dictionary = dic.token_info_dictionary
      this.unknown_dictionary = dic.unknown_dictionary
    }

/**
 * Build word lattice
 * @param {string} sentence_str Input text
 * @returns {ViterbiLattice} Word lattice
 */
    ViterbiBuilder.prototype.build = function (sentence_str) {
      var lattice = new ViterbiLattice()
      var sentence = new SurrogateAwareString(sentence_str)

      var key, trie_id, left_id, right_id, word_cost
      for (var pos = 0; pos < sentence.length; pos++) {
        var tail = sentence.slice(pos)
        var vocabulary = this.trie.commonPrefixSearch(tail)
        for (var n = 0; n < vocabulary.length; n++) {  // Words in dictionary do not have surrogate pair (only UCS2 set)
          trie_id = vocabulary[n].v
          key = vocabulary[n].k

          var token_info_ids = this.token_info_dictionary.target_map[trie_id]
          for (var i = 0; i < token_info_ids.length; i++) {
            var token_info_id = parseInt(token_info_ids[i])

            left_id = this.token_info_dictionary.dictionary.getShort(token_info_id)
            right_id = this.token_info_dictionary.dictionary.getShort(token_info_id + 2)
            word_cost = this.token_info_dictionary.dictionary.getShort(token_info_id + 4)

                // node_name, cost, start_index, length, type, left_id, right_id, surface_form
            lattice.append(new ViterbiNode(token_info_id, word_cost, pos + 1, key.length, 'KNOWN', left_id, right_id, key))
          }
        }

        // Unknown word processing
        var surrogate_aware_tail = new SurrogateAwareString(tail)
        var head_char = new SurrogateAwareString(surrogate_aware_tail.charAt(0))
        var head_char_class = this.unknown_dictionary.lookup(head_char.toString())
        if (vocabulary == null || vocabulary.length === 0 || head_char_class.is_always_invoke === 1) {
            // Process unknown word
          key = head_char
          if (head_char_class.is_grouping === 1 && surrogate_aware_tail.length > 1) {
            for (var k = 1; k < surrogate_aware_tail.length; k++) {
              var next_char = surrogate_aware_tail.charAt(k)
              var next_char_class = this.unknown_dictionary.lookup(next_char)
              if (head_char_class.class_name !== next_char_class.class_name) {
                break
              }
              key += next_char
            }
          }

          var unk_ids = this.unknown_dictionary.target_map[head_char_class.class_id]
          for (var j = 0; j < unk_ids.length; j++) {
            var unk_id = parseInt(unk_ids[j])

            left_id = this.unknown_dictionary.dictionary.getShort(unk_id)
            right_id = this.unknown_dictionary.dictionary.getShort(unk_id + 2)
            word_cost = this.unknown_dictionary.dictionary.getShort(unk_id + 4)

                // node_name, cost, start_index, length, type, left_id, right_id, surface_form
            lattice.append(new ViterbiNode(unk_id, word_cost, pos + 1, key.length, 'UNKNOWN', left_id, right_id, key.toString()))
          }
        }
      }
      lattice.appendEos()

      return lattice
    }

    module.exports = ViterbiBuilder
  }, {'../util/SurrogateAwareString.js': 51, './ViterbiLattice.js': 53, './ViterbiNode.js': 54}],
  53: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

    var ViterbiNode = require('./ViterbiNode.js')

/**
 * ViterbiLattice is a lattice in Viterbi algorithm
 * @constructor
 */
    function ViterbiLattice () {
      this.nodes_end_at = []
      this.nodes_end_at[0] = [ new ViterbiNode('BOS', 0, 0, 0, 'BOS', 0, 0) ]
      this.eos_pos = 1
    }

/**
 * Append node to ViterbiLattice
 * @param {ViterbiNode} node
 */
    ViterbiLattice.prototype.append = function (node) {
      var last_pos = node.start_pos + node.length - 1
      if (this.eos_pos < last_pos) {
        this.eos_pos = last_pos
      }

      var prev_nodes = this.nodes_end_at[last_pos]
      if (prev_nodes == null) {
        prev_nodes = []
      }
      prev_nodes.push(node)

      this.nodes_end_at[last_pos] = prev_nodes
    }

/**
 * Set ends with EOS (End of Statement)
 */
    ViterbiLattice.prototype.appendEos = function () {
      var last_index = this.nodes_end_at.length
      this.eos_pos++
      this.nodes_end_at[last_index] = [ new ViterbiNode('EOS', 0, this.eos_pos, 0, 'EOS', 0, 0) ]
    }

    module.exports = ViterbiLattice
  }, {'./ViterbiNode.js': 54}],
  54: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

/**
 * ViterbiNode is a node of ViterbiLattice
 * @param {string} node_name
 * @param {number} node_cost Word cost to generate
 * @param {number} start_pos Start position from 1
 * @param {number} length Word length
 * @param {string} type Node type (KNOWN, UNKNOWN, BOS, EOS, ...)
 * @param {number} left_id Left context ID
 * @param {number} right_id Right context ID
 * @param {string} surface_form Surface form of this word
 * @constructor
 */
    function ViterbiNode (node_name, node_cost, start_pos, length, type, left_id, right_id, surface_form) {
      this.name = node_name
      this.cost = node_cost
      this.start_pos = start_pos
      this.length = length
      this.left_id = left_id
      this.right_id = right_id
      this.prev = null
      this.surface_form = surface_form
      if (type === 'BOS') {
        this.shortest_cost = 0
      } else {
        this.shortest_cost = Number.MAX_VALUE
      }
      this.type = type
    }

    module.exports = ViterbiNode
  }, {}],
  55: [function (require, module, exports) {
/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    'use strict'

/**
 * ViterbiSearcher is for searching best Viterbi path
 * @param {ConnectionCosts} connection_costs Connection costs matrix
 * @constructor
 */
    function ViterbiSearcher (connection_costs) {
      this.connection_costs = connection_costs
    }

/**
 * Search best path by forward-backward algorithm
 * @param {ViterbiLattice} lattice Viterbi lattice to search
 * @returns {Array} Shortest path
 */
    ViterbiSearcher.prototype.search = function (lattice) {
      lattice = this.forward(lattice)
      return this.backward(lattice)
    }

    ViterbiSearcher.prototype.forward = function (lattice) {
      var i, j, k
      for (i = 1; i <= lattice.eos_pos; i++) {
        var nodes = lattice.nodes_end_at[i]
        if (nodes == null) {
          continue
        }
        for (j = 0; j < nodes.length; j++) {
          var node = nodes[j]
          var cost = Number.MAX_VALUE
          var shortest_prev_node

          var prev_nodes = lattice.nodes_end_at[node.start_pos - 1]
          if (prev_nodes == null) {
                // TODO process unknown words (repair word lattice)
            continue
          }
          for (k = 0; k < prev_nodes.length; k++) {
            var prev_node = prev_nodes[k]

            var edge_cost
            if (node.left_id == null || prev_node.right_id == null) {
                    // TODO assert
              console.log('Left or right is null')
              edge_cost = 0
            } else {
              edge_cost = this.connection_costs.get(prev_node.right_id, node.left_id)
            }

            var _cost = prev_node.shortest_cost + edge_cost + node.cost
            if (_cost < cost) {
              shortest_prev_node = prev_node
              cost = _cost
            }
          }

          node.prev = shortest_prev_node
          node.shortest_cost = cost
        }
      }
      return lattice
    }

    ViterbiSearcher.prototype.backward = function (lattice) {
      var shortest_path = []
      var eos = lattice.nodes_end_at[lattice.nodes_end_at.length - 1][0]

      var node_back = eos.prev
      if (node_back == null) {
        return []
      }
      while (node_back.type !== 'BOS') {
        shortest_path.push(node_back)
        if (node_back.prev == null) {
            // TODO Failed to back. Process unknown words?
          return []
        }
        node_back = node_back.prev
      }

      return shortest_path.reverse()
    }

    module.exports = ViterbiSearcher
  }, {}],
  56: [function (require, module, exports) {
    (function (process, global) {
/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
      (function () {
        var async = {}
        function noop () {}
        function identity (v) {
          return v
        }
        function toBool (v) {
          return !!v
        }
        function notId (v) {
          return !v
        }

    // global on the server, window in the browser
        var previous_async

    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
        var root = typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global ||
            this

        if (root != null) {
          previous_async = root.async
        }

        async.noConflict = function () {
          root.async = previous_async
          return async
        }

        function only_once (fn) {
          return function () {
            if (fn === null) throw new Error('Callback was already called.')
            fn.apply(this, arguments)
            fn = null
          }
        }

        function _once (fn) {
          return function () {
            if (fn === null) return
            fn.apply(this, arguments)
            fn = null
          }
        }

    /// / cross-browser compatiblity functions ////

        var _toString = Object.prototype.toString

        var _isArray = Array.isArray || function (obj) {
          return _toString.call(obj) === '[object Array]'
        }

    // Ported from underscore.js isObject
        var _isObject = function (obj) {
          var type = typeof obj
          return type === 'function' || type === 'object' && !!obj
        }

        function _isArrayLike (arr) {
          return _isArray(arr) || (
            // has a positive integer length property
            typeof arr.length === 'number' &&
            arr.length >= 0 &&
            arr.length % 1 === 0
        )
        }

        function _each (coll, iterator) {
          return _isArrayLike(coll)
            ? _arrayEach(coll, iterator)
            : _forEachOf(coll, iterator)
        }

        function _arrayEach (arr, iterator) {
          var index = -1,
            length = arr.length

          while (++index < length) {
            iterator(arr[index], index, arr)
          }
        }

        function _map (arr, iterator) {
          var index = -1,
            length = arr.length,
            result = Array(length)

          while (++index < length) {
            result[index] = iterator(arr[index], index, arr)
          }
          return result
        }

        function _range (count) {
          return _map(Array(count), function (v, i) { return i })
        }

        function _reduce (arr, iterator, memo) {
          _arrayEach(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a)
          })
          return memo
        }

        function _forEachOf (object, iterator) {
          _arrayEach(_keys(object), function (key) {
            iterator(object[key], key)
          })
        }

        function _indexOf (arr, item) {
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) return i
          }
          return -1
        }

        var _keys = Object.keys || function (obj) {
          var keys = []
          for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
              keys.push(k)
            }
          }
          return keys
        }

        function _keyIterator (coll) {
          var i = -1
          var len
          var keys
          if (_isArrayLike(coll)) {
            len = coll.length
            return function next () {
              i++
              return i < len ? i : null
            }
          } else {
            keys = _keys(coll)
            len = keys.length
            return function next () {
              i++
              return i < len ? keys[i] : null
            }
          }
        }

    // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
    // This accumulates the arguments passed into an array, after a given index.
    // From underscore.js (https://github.com/jashkenas/underscore/pull/2140).
        function _restParam (func, startIndex) {
          startIndex = startIndex == null ? func.length - 1 : +startIndex
          return function () {
            var length = Math.max(arguments.length - startIndex, 0)
            var rest = Array(length)
            for (var index = 0; index < length; index++) {
              rest[index] = arguments[index + startIndex]
            }
            switch (startIndex) {
              case 0: return func.call(this, rest)
              case 1: return func.call(this, arguments[0], rest)
            }
            // Currently unused but handle cases outside of the switch statement:
            // var args = Array(startIndex + 1);
            // for (index = 0; index < startIndex; index++) {
            //     args[index] = arguments[index];
            // }
            // args[startIndex] = rest;
            // return func.apply(this, args);
          }
        }

        function _withoutIndex (iterator) {
          return function (value, index, callback) {
            return iterator(value, callback)
          }
        }

    /// / exported async module functions ////

    /// / nextTick implementation with browser-compatible fallback ////

    // capture the global reference to guard against fakeTimer mocks
        var _setImmediate = typeof setImmediate === 'function' && setImmediate

        var _delay = _setImmediate ? function (fn) {
        // not a direct alias for IE10 compatibility
          _setImmediate(fn)
        } : function (fn) {
          setTimeout(fn, 0)
        }

        if (typeof process === 'object' && typeof process.nextTick === 'function') {
          async.nextTick = process.nextTick
        } else {
          async.nextTick = _delay
        }
        async.setImmediate = _setImmediate ? _delay : async.nextTick

        async.forEach =
    async.each = function (arr, iterator, callback) {
      return async.eachOf(arr, _withoutIndex(iterator), callback)
    }

        async.forEachSeries =
    async.eachSeries = function (arr, iterator, callback) {
      return async.eachOfSeries(arr, _withoutIndex(iterator), callback)
    }

        async.forEachLimit =
    async.eachLimit = function (arr, limit, iterator, callback) {
      return _eachOfLimit(limit)(arr, _withoutIndex(iterator), callback)
    }

        async.forEachOf =
    async.eachOf = function (object, iterator, callback) {
      callback = _once(callback || noop)
      object = object || []
      var size = _isArrayLike(object) ? object.length : _keys(object).length
      var completed = 0
      if (!size) {
        return callback(null)
      }
      _each(object, function (value, key) {
        iterator(object[key], key, only_once(done))
      })
      function done (err) {
        if (err) {
          callback(err)
        } else {
          completed += 1
          if (completed >= size) {
            callback(null)
          }
        }
      }
    }

        async.forEachOfSeries =
    async.eachOfSeries = function (obj, iterator, callback) {
      callback = _once(callback || noop)
      obj = obj || []
      var nextKey = _keyIterator(obj)
      var key = nextKey()
      function iterate () {
        var sync = true
        if (key === null) {
          return callback(null)
        }
        iterator(obj[key], key, only_once(function (err) {
          if (err) {
            callback(err)
          } else {
            key = nextKey()
            if (key === null) {
              return callback(null)
            } else {
              if (sync) {
                async.nextTick(iterate)
              } else {
                iterate()
              }
            }
          }
        }))
        sync = false
      }
      iterate()
    }

        async.forEachOfLimit =
    async.eachOfLimit = function (obj, limit, iterator, callback) {
      _eachOfLimit(limit)(obj, iterator, callback)
    }

        function _eachOfLimit (limit) {
          return function (obj, iterator, callback) {
            callback = _once(callback || noop)
            obj = obj || []
            var nextKey = _keyIterator(obj)
            if (limit <= 0) {
              return callback(null)
            }
            var done = false
            var running = 0
            var errored = false;

            (function replenish () {
              if (done && running <= 0) {
                return callback(null)
              }

              while (running < limit && !errored) {
                var key = nextKey()
                if (key === null) {
                  done = true
                  if (running <= 0) {
                    callback(null)
                  }
                  return
                }
                running += 1
                iterator(obj[key], key, only_once(function (err) {
                  running -= 1
                  if (err) {
                    callback(err)
                    errored = true
                  } else {
                    replenish()
                  }
                }))
              }
            })()
          }
        }

        function doParallel (fn) {
          return function (obj, iterator, callback) {
            return fn(async.eachOf, obj, iterator, callback)
          }
        }
        function doParallelLimit (fn) {
          return function (obj, limit, iterator, callback) {
            return fn(_eachOfLimit(limit), obj, iterator, callback)
          }
        }
        function doSeries (fn) {
          return function (obj, iterator, callback) {
            return fn(async.eachOfSeries, obj, iterator, callback)
          }
        }

        function _asyncMap (eachfn, arr, iterator, callback) {
          callback = _once(callback || noop)
          var results = []
          eachfn(arr, function (value, index, callback) {
            iterator(value, function (err, v) {
              results[index] = v
              callback(err)
            })
          }, function (err) {
            callback(err, results)
          })
        }

        async.map = doParallel(_asyncMap)
        async.mapSeries = doSeries(_asyncMap)
        async.mapLimit = doParallelLimit(_asyncMap)

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
        async.inject =
    async.foldl =
    async.reduce = function (arr, memo, iterator, callback) {
      async.eachOfSeries(arr, function (x, i, callback) {
        iterator(memo, x, function (err, v) {
          memo = v
          callback(err)
        })
      }, function (err) {
        callback(err || null, memo)
      })
    }

        async.foldr =
    async.reduceRight = function (arr, memo, iterator, callback) {
      var reversed = _map(arr, identity).reverse()
      async.reduce(reversed, memo, iterator, callback)
    }

        function _filter (eachfn, arr, iterator, callback) {
          var results = []
          eachfn(arr, function (x, index, callback) {
            iterator(x, function (v) {
              if (v) {
                results.push({index: index, value: x})
              }
              callback()
            })
          }, function () {
            callback(_map(results.sort(function (a, b) {
              return a.index - b.index
            }), function (x) {
              return x.value
            }))
          })
        }

        async.select =
    async.filter = doParallel(_filter)

        async.selectLimit =
    async.filterLimit = doParallelLimit(_filter)

        async.selectSeries =
    async.filterSeries = doSeries(_filter)

        function _reject (eachfn, arr, iterator, callback) {
          _filter(eachfn, arr, function (value, cb) {
            iterator(value, function (v) {
              cb(!v)
            })
          }, callback)
        }
        async.reject = doParallel(_reject)
        async.rejectLimit = doParallelLimit(_reject)
        async.rejectSeries = doSeries(_reject)

        function _createTester (eachfn, check, getResult) {
          return function (arr, limit, iterator, cb) {
            function done () {
              if (cb) cb(getResult(false, void 0))
            }
            function iteratee (x, _, callback) {
              if (!cb) return callback()
              iterator(x, function (v) {
                if (cb && check(v)) {
                  cb(getResult(true, x))
                  cb = iterator = false
                }
                callback()
              })
            }
            if (arguments.length > 3) {
              eachfn(arr, limit, iteratee, done)
            } else {
              cb = iterator
              iterator = limit
              eachfn(arr, iteratee, done)
            }
          }
        }

        async.any =
    async.some = _createTester(async.eachOf, toBool, identity)

        async.someLimit = _createTester(async.eachOfLimit, toBool, identity)

        async.all =
    async.every = _createTester(async.eachOf, notId, notId)

        async.everyLimit = _createTester(async.eachOfLimit, notId, notId)

        function _findGetResult (v, x) {
          return x
        }
        async.detect = _createTester(async.eachOf, identity, _findGetResult)
        async.detectSeries = _createTester(async.eachOfSeries, identity, _findGetResult)
        async.detectLimit = _createTester(async.eachOfLimit, identity, _findGetResult)

        async.sortBy = function (arr, iterator, callback) {
          async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
              if (err) {
                callback(err)
              } else {
                callback(null, {value: x, criteria: criteria})
              }
            })
          }, function (err, results) {
            if (err) {
              return callback(err)
            } else {
              callback(null, _map(results.sort(comparator), function (x) {
                return x.value
              }))
            }
          })

          function comparator (left, right) {
            var a = left.criteria, b = right.criteria
            return a < b ? -1 : a > b ? 1 : 0
          }
        }

        async.auto = function (tasks, callback) {
          callback = _once(callback || noop)
          var keys = _keys(tasks)
          var remainingTasks = keys.length
          if (!remainingTasks) {
            return callback(null)
          }

          var results = {}

          var listeners = []
          function addListener (fn) {
            listeners.unshift(fn)
          }
          function removeListener (fn) {
            var idx = _indexOf(listeners, fn)
            if (idx >= 0) listeners.splice(idx, 1)
          }
          function taskComplete () {
            remainingTasks--
            _arrayEach(listeners.slice(0), function (fn) {
              fn()
            })
          }

          addListener(function () {
            if (!remainingTasks) {
              callback(null, results)
            }
          })

          _arrayEach(keys, function (k) {
            var task = _isArray(tasks[k]) ? tasks[k] : [tasks[k]]
            var taskCallback = _restParam(function (err, args) {
              if (args.length <= 1) {
                args = args[0]
              }
              if (err) {
                var safeResults = {}
                _forEachOf(results, function (val, rkey) {
                  safeResults[rkey] = val
                })
                safeResults[k] = args
                callback(err, safeResults)
              } else {
                results[k] = args
                async.setImmediate(taskComplete)
              }
            })
            var requires = task.slice(0, task.length - 1)
            // prevent dead-locks
            var len = requires.length
            var dep
            while (len--) {
              if (!(dep = tasks[requires[len]])) {
                throw new Error('Has inexistant dependency')
              }
              if (_isArray(dep) && _indexOf(dep, k) >= 0) {
                throw new Error('Has cyclic dependencies')
              }
            }
            function ready () {
              return _reduce(requires, function (a, x) {
                return (a && results.hasOwnProperty(x))
              }, true) && !results.hasOwnProperty(k)
            }
            if (ready()) {
              task[task.length - 1](taskCallback, results)
            } else {
              addListener(listener)
            }
            function listener () {
              if (ready()) {
                removeListener(listener)
                task[task.length - 1](taskCallback, results)
              }
            }
          })
        }

        async.retry = function (times, task, callback) {
          var DEFAULT_TIMES = 5
          var DEFAULT_INTERVAL = 0

          var attempts = []

          var opts = {
            times: DEFAULT_TIMES,
            interval: DEFAULT_INTERVAL
          }

          function parseTimes (acc, t) {
            if (typeof t === 'number') {
              acc.times = parseInt(t, 10) || DEFAULT_TIMES
            } else if (typeof t === 'object') {
              acc.times = parseInt(t.times, 10) || DEFAULT_TIMES
              acc.interval = parseInt(t.interval, 10) || DEFAULT_INTERVAL
            } else {
              throw new Error('Unsupported argument type for \'times\': ' + typeof t)
            }
          }

          var length = arguments.length
          if (length < 1 || length > 3) {
            throw new Error('Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)')
          } else if (length <= 2 && typeof times === 'function') {
            callback = task
            task = times
          }
          if (typeof times !== 'function') {
            parseTimes(opts, times)
          }
          opts.callback = callback
          opts.task = task

          function wrappedTask (wrappedCallback, wrappedResults) {
            function retryAttempt (task, finalAttempt) {
              return function (seriesCallback) {
                task(function (err, result) {
                  seriesCallback(!err || finalAttempt, {err: err, result: result})
                }, wrappedResults)
              }
            }

            function retryInterval (interval) {
              return function (seriesCallback) {
                setTimeout(function () {
                  seriesCallback(null)
                }, interval)
              }
            }

            while (opts.times) {
              var finalAttempt = !(opts.times -= 1)
              attempts.push(retryAttempt(opts.task, finalAttempt))
              if (!finalAttempt && opts.interval > 0) {
                attempts.push(retryInterval(opts.interval))
              }
            }

            async.series(attempts, function (done, data) {
              data = data[data.length - 1];
              (wrappedCallback || opts.callback)(data.err, data.result)
            })
          }

        // If a callback is passed, run this as a controll flow
          return opts.callback ? wrappedTask() : wrappedTask
        }

        async.waterfall = function (tasks, callback) {
          callback = _once(callback || noop)
          if (!_isArray(tasks)) {
            var err = new Error('First argument to waterfall must be an array of functions')
            return callback(err)
          }
          if (!tasks.length) {
            return callback()
          }
          function wrapIterator (iterator) {
            return _restParam(function (err, args) {
              if (err) {
                callback.apply(null, [err].concat(args))
              } else {
                var next = iterator.next()
                if (next) {
                  args.push(wrapIterator(next))
                } else {
                  args.push(callback)
                }
                ensureAsync(iterator).apply(null, args)
              }
            })
          }
          wrapIterator(async.iterator(tasks))()
        }

        function _parallel (eachfn, tasks, callback) {
          callback = callback || noop
          var results = _isArrayLike(tasks) ? [] : {}

          eachfn(tasks, function (task, key, callback) {
            task(_restParam(function (err, args) {
              if (args.length <= 1) {
                args = args[0]
              }
              results[key] = args
              callback(err)
            }))
          }, function (err) {
            callback(err, results)
          })
        }

        async.parallel = function (tasks, callback) {
          _parallel(async.eachOf, tasks, callback)
        }

        async.parallelLimit = function (tasks, limit, callback) {
          _parallel(_eachOfLimit(limit), tasks, callback)
        }

        async.series = function (tasks, callback) {
          _parallel(async.eachOfSeries, tasks, callback)
        }

        async.iterator = function (tasks) {
          function makeCallback (index) {
            function fn () {
              if (tasks.length) {
                tasks[index].apply(null, arguments)
              }
              return fn.next()
            }
            fn.next = function () {
              return (index < tasks.length - 1) ? makeCallback(index + 1) : null
            }
            return fn
          }
          return makeCallback(0)
        }

        async.apply = _restParam(function (fn, args) {
          return _restParam(function (callArgs) {
            return fn.apply(
                null, args.concat(callArgs)
            )
          })
        })

        function _concat (eachfn, arr, fn, callback) {
          var result = []
          eachfn(arr, function (x, index, cb) {
            fn(x, function (err, y) {
              result = result.concat(y || [])
              cb(err)
            })
          }, function (err) {
            callback(err, result)
          })
        }
        async.concat = doParallel(_concat)
        async.concatSeries = doSeries(_concat)

        async.whilst = function (test, iterator, callback) {
          callback = callback || noop
          if (test()) {
            var next = _restParam(function (err, args) {
              if (err) {
                callback(err)
              } else if (test.apply(this, args)) {
                iterator(next)
              } else {
                callback(null)
              }
            })
            iterator(next)
          } else {
            callback(null)
          }
        }

        async.doWhilst = function (iterator, test, callback) {
          var calls = 0
          return async.whilst(function () {
            return ++calls <= 1 || test.apply(this, arguments)
          }, iterator, callback)
        }

        async.until = function (test, iterator, callback) {
          return async.whilst(function () {
            return !test.apply(this, arguments)
          }, iterator, callback)
        }

        async.doUntil = function (iterator, test, callback) {
          return async.doWhilst(iterator, function () {
            return !test.apply(this, arguments)
          }, callback)
        }

        async.during = function (test, iterator, callback) {
          callback = callback || noop

          var next = _restParam(function (err, args) {
            if (err) {
              callback(err)
            } else {
              args.push(check)
              test.apply(this, args)
            }
          })

          var check = function (err, truth) {
            if (err) {
              callback(err)
            } else if (truth) {
              iterator(next)
            } else {
              callback(null)
            }
          }

          test(check)
        }

        async.doDuring = function (iterator, test, callback) {
          var calls = 0
          async.during(function (next) {
            if (calls++ < 1) {
              next(null, true)
            } else {
              test.apply(this, arguments)
            }
          }, iterator, callback)
        }

        function _queue (worker, concurrency, payload) {
          if (concurrency == null) {
            concurrency = 1
          } else if (concurrency === 0) {
            throw new Error('Concurrency must not be zero')
          }
          function _insert (q, data, pos, callback) {
            if (callback != null && typeof callback !== 'function') {
              throw new Error('task callback must be a function')
            }
            q.started = true
            if (!_isArray(data)) {
              data = [data]
            }
            if (data.length === 0 && q.idle()) {
                // call drain immediately if there are no tasks
              return async.setImmediate(function () {
                q.drain()
              })
            }
            _arrayEach(data, function (task) {
              var item = {
                data: task,
                callback: callback || noop
              }

              if (pos) {
                q.tasks.unshift(item)
              } else {
                q.tasks.push(item)
              }

              if (q.tasks.length === q.concurrency) {
                q.saturated()
              }
            })
            async.setImmediate(q.process)
          }
          function _next (q, tasks) {
            return function () {
              workers -= 1
              var args = arguments
              _arrayEach(tasks, function (task) {
                task.callback.apply(task, args)
              })
              if (q.tasks.length + workers === 0) {
                q.drain()
              }
              q.process()
            }
          }

          var workers = 0
          var q = {
            tasks: [],
            concurrency: concurrency,
            payload: payload,
            saturated: noop,
            empty: noop,
            drain: noop,
            started: false,
            paused: false,
            push: function (data, callback) {
              _insert(q, data, false, callback)
            },
            kill: function () {
              q.drain = noop
              q.tasks = []
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback)
            },
            process: function () {
              if (!q.paused && workers < q.concurrency && q.tasks.length) {
                while (workers < q.concurrency && q.tasks.length) {
                  var tasks = q.payload
                            ? q.tasks.splice(0, q.payload)
                            : q.tasks.splice(0, q.tasks.length)

                  var data = _map(tasks, function (task) {
                    return task.data
                  })

                  if (q.tasks.length === 0) {
                    q.empty()
                  }
                  workers += 1
                  var cb = only_once(_next(q, tasks))
                  worker(data, cb)
                }
              }
            },
            length: function () {
              return q.tasks.length
            },
            running: function () {
              return workers
            },
            idle: function () {
              return q.tasks.length + workers === 0
            },
            pause: function () {
              q.paused = true
            },
            resume: function () {
              if (q.paused === false) { return }
              q.paused = false
              var resumeCount = Math.min(q.concurrency, q.tasks.length)
                // Need to call q.process once per concurrent
                // worker to preserve full concurrency after pause
              for (var w = 1; w <= resumeCount; w++) {
                async.setImmediate(q.process)
              }
            }
          }
          return q
        }

        async.queue = function (worker, concurrency) {
          var q = _queue(function (items, cb) {
            worker(items[0], cb)
          }, concurrency, 1)

          return q
        }

        async.priorityQueue = function (worker, concurrency) {
          function _compareTasks (a, b) {
            return a.priority - b.priority
          }

          function _binarySearch (sequence, item, compare) {
            var beg = -1,
              end = sequence.length - 1
            while (beg < end) {
              var mid = beg + ((end - beg + 1) >>> 1)
              if (compare(item, sequence[mid]) >= 0) {
                beg = mid
              } else {
                end = mid - 1
              }
            }
            return beg
          }

          function _insert (q, data, priority, callback) {
            if (callback != null && typeof callback !== 'function') {
              throw new Error('task callback must be a function')
            }
            q.started = true
            if (!_isArray(data)) {
              data = [data]
            }
            if (data.length === 0) {
                // call drain immediately if there are no tasks
              return async.setImmediate(function () {
                q.drain()
              })
            }
            _arrayEach(data, function (task) {
              var item = {
                data: task,
                priority: priority,
                callback: typeof callback === 'function' ? callback : noop
              }

              q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item)

              if (q.tasks.length === q.concurrency) {
                q.saturated()
              }
              async.setImmediate(q.process)
            })
          }

        // Start with a normal queue
          var q = async.queue(worker, concurrency)

        // Override push to accept second parameter representing priority
          q.push = function (data, priority, callback) {
            _insert(q, data, priority, callback)
          }

        // Remove unshift function
          delete q.unshift

          return q
        }

        async.cargo = function (worker, payload) {
          return _queue(worker, 1, payload)
        }

        function _console_fn (name) {
          return _restParam(function (fn, args) {
            fn.apply(null, args.concat([_restParam(function (err, args) {
              if (typeof console === 'object') {
                if (err) {
                  if (console.error) {
                    console.error(err)
                  }
                } else if (console[name]) {
                  _arrayEach(args, function (x) {
                    console[name](x)
                  })
                }
              }
            })]))
          })
        }
        async.log = _console_fn('log')
        async.dir = _console_fn('dir')
    /* async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error'); */

        async.memoize = function (fn, hasher) {
          var memo = {}
          var queues = {}
          hasher = hasher || identity
          var memoized = _restParam(function memoized (args) {
            var callback = args.pop()
            var key = hasher.apply(null, args)
            if (key in memo) {
              async.nextTick(function () {
                callback.apply(null, memo[key])
              })
            } else if (key in queues) {
              queues[key].push(callback)
            } else {
              queues[key] = [callback]
              fn.apply(null, args.concat([_restParam(function (args) {
                memo[key] = args
                var q = queues[key]
                delete queues[key]
                for (var i = 0, l = q.length; i < l; i++) {
                  q[i].apply(null, args)
                }
              })]))
            }
          })
          memoized.memo = memo
          memoized.unmemoized = fn
          return memoized
        }

        async.unmemoize = function (fn) {
          return function () {
            return (fn.unmemoized || fn).apply(null, arguments)
          }
        }

        function _times (mapper) {
          return function (count, iterator, callback) {
            mapper(_range(count), iterator, callback)
          }
        }

        async.times = _times(async.map)
        async.timesSeries = _times(async.mapSeries)
        async.timesLimit = function (count, limit, iterator, callback) {
          return async.mapLimit(_range(count), limit, iterator, callback)
        }

        async.seq = function (/* functions... */) {
          var fns = arguments
          return _restParam(function (args) {
            var that = this

            var callback = args[args.length - 1]
            if (typeof callback === 'function') {
              args.pop()
            } else {
              callback = noop
            }

            async.reduce(fns, args, function (newargs, fn, cb) {
              fn.apply(that, newargs.concat([_restParam(function (err, nextargs) {
                cb(err, nextargs)
              })]))
            },
            function (err, results) {
              callback.apply(that, [err].concat(results))
            })
          })
        }

        async.compose = function (/* functions... */) {
          return async.seq.apply(null, Array.prototype.reverse.call(arguments))
        }

        function _applyEach (eachfn) {
          return _restParam(function (fns, args) {
            var go = _restParam(function (args) {
              var that = this
              var callback = args.pop()
              return eachfn(fns, function (fn, _, cb) {
                fn.apply(that, args.concat([cb]))
              },
                callback)
            })
            if (args.length) {
              return go.apply(this, args)
            } else {
              return go
            }
          })
        }

        async.applyEach = _applyEach(async.eachOf)
        async.applyEachSeries = _applyEach(async.eachOfSeries)

        async.forever = function (fn, callback) {
          var done = only_once(callback || noop)
          var task = ensureAsync(fn)
          function next (err) {
            if (err) {
              return done(err)
            }
            task(next)
          }
          next()
        }

        function ensureAsync (fn) {
          return _restParam(function (args) {
            var callback = args.pop()
            args.push(function () {
              var innerArgs = arguments
              if (sync) {
                async.setImmediate(function () {
                  callback.apply(null, innerArgs)
                })
              } else {
                callback.apply(null, innerArgs)
              }
            })
            var sync = true
            fn.apply(this, args)
            sync = false
          })
        }

        async.ensureAsync = ensureAsync

        async.constant = _restParam(function (values) {
          var args = [null].concat(values)
          return function (callback) {
            return callback.apply(this, args)
          }
        })

        async.wrapSync =
    async.asyncify = function asyncify (func) {
      return _restParam(function (args) {
        var callback = args.pop()
        var result
        try {
          result = func.apply(this, args)
        } catch (e) {
          return callback(e)
        }
            // if result is Promise object
        if (_isObject(result) && typeof result.then === 'function') {
          result.then(function (value) {
            callback(null, value)
          })['catch'](function (err) {
            callback(err.message ? err : new Error(err))
          })
        } else {
          callback(null, result)
        }
      })
    }

    // Node.js
        if (typeof module === 'object' && module.exports) {
          module.exports = async
        }
    // AMD / RequireJS
        else if (typeof define === 'function' && define.amd) {
          define([], function () {
            return async
          })
        }
    // included directly via <script> tag
        else {
          root.async = async
        }
      }())
    }).call(this, require('_process'), typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
  }, {'_process': 24}],
  57: [function (require, module, exports) {
// Copyright (c) 2014 Takuya Asano All Rights Reserved.

    (function () {
      'use strict'

      var TERM_CHAR = '\u0000', // terminal character
        TERM_CODE = 0,        // terminal character code
        ROOT_ID = 0,          // index of root node
        NOT_FOUND = -1,       // traverse() returns if no nodes found
        BASE_SIGNED = true,
        CHECK_SIGNED = true,
        BASE_BYTES = 4,
        CHECK_BYTES = 4,
        MEMORY_EXPAND_RATIO = 2

      var newBC = function (initial_size) {
        if (initial_size == null) {
          initial_size = 1024
        }

        var initBase = function (_base, start, end) {  // 'end' index does not include
          for (var i = start; i < end; i++) {
            _base[i] = -i + 1  // inversed previous empty node index
          }
          if (check.array[check.array.length - 1] > 0) {
            var last_used_id = check.array.length - 2
            while (check.array[last_used_id] > 0) {
              last_used_id--
            }
            _base[start] = -last_used_id
          }
        }

        var initCheck = function (_check, start, end) {
          for (var i = start; i < end; i++) {
            _check[i] = -i - 1  // inversed next empty node index
          }
        }

        var realloc = function (min_size) {
            // expand arrays size by given ratio
          var new_size = min_size * MEMORY_EXPAND_RATIO
            // console.log('re-allocate memory to ' + new_size);

          var base_new_array = newArrayBuffer(base.signed, base.bytes, new_size)
          initBase(base_new_array, base.array.length, new_size)  // init BASE in new range
          base_new_array.set(base.array)
          base.array = null  // explicit GC
          base.array = base_new_array

          var check_new_array = newArrayBuffer(check.signed, check.bytes, new_size)
          initCheck(check_new_array, check.array.length, new_size)  // init CHECK in new range
          check_new_array.set(check.array)
          check.array = null  // explicit GC
          check.array = check_new_array
        }

        var first_unused_node = ROOT_ID + 1

        var base = {
          signed: BASE_SIGNED,
          bytes: BASE_BYTES,
          array: newArrayBuffer(BASE_SIGNED, BASE_BYTES, initial_size)
        }

        var check = {
          signed: CHECK_SIGNED,
          bytes: CHECK_BYTES,
          array: newArrayBuffer(CHECK_SIGNED, CHECK_BYTES, initial_size)
        }

        // init root node
        base.array[ROOT_ID] = 1
        check.array[ROOT_ID] = ROOT_ID

        // init BASE
        initBase(base.array, ROOT_ID + 1, base.array.length)

        // init CHECK
        initCheck(check.array, ROOT_ID + 1, check.array.length)

        return {
          getBaseBuffer: function () {
            return base.array
          },
          getCheckBuffer: function () {
            return check.array
          },
          loadBaseBuffer: function (base_buffer) {
            base.array = base_buffer
            return this
          },
          loadCheckBuffer: function (check_buffer) {
            check.array = check_buffer
            return this
          },
          size: function () {
            return Math.max(base.array.length, check.array.length)
          },
          getBase: function (index) {
            if (base.array.length - 1 < index) {
              return -index + 1
                    // realloc(index);
            }
                // if (!Number.isFinite(base.array[index])) {
                //     console.log('getBase:' + index);
                //     throw 'getBase' + index;
                // }
            return base.array[index]
          },
          getCheck: function (index) {
            if (check.array.length - 1 < index) {
              return -index - 1
                    // realloc(index);
            }
                // if (!Number.isFinite(check.array[index])) {
                //     console.log('getCheck:' + index);
                //     throw 'getCheck' + index;
                // }
            return check.array[index]
          },
          setBase: function (index, base_value) {
            if (base.array.length - 1 < index) {
              realloc(index)
            }
            base.array[index] = base_value
          },
          setCheck: function (index, check_value) {
            if (check.array.length - 1 < index) {
              realloc(index)
            }
            check.array[index] = check_value
          },
          setFirstUnusedNode: function (index) {
                // if (!Number.isFinite(index)) {
                //     throw 'assertion error: setFirstUnusedNode ' + index + ' is not finite number';
                // }
            first_unused_node = index
          },
          getFirstUnusedNode: function () {
                // if (!Number.isFinite(first_unused_node)) {
                //     throw 'assertion error: getFirstUnusedNode ' + first_unused_node + ' is not finite number';
                // }
            return first_unused_node
          },
          shrink: function () {
            var last_index = this.size() - 1
            while (true) {
              if (check.array[last_index] >= 0) {
                break
              }
              last_index--
            }
            base.array = base.array.subarray(0, last_index + 2)   // keep last unused node
            check.array = check.array.subarray(0, last_index + 2) // keep last unused node
          },
          calc: function () {
            var unused_count = 0
            var size = check.array.length
            for (var i = 0; i < size; i++) {
              if (check.array[i] < 0) {
                unused_count++
              }
            }
            return {
              all: size,
              unused: unused_count,
              efficiency: (size - unused_count) / size
            }
          },
          dump: function () {
                // for debug
            var dump_base = ''
            var dump_check = ''

            var i
            for (i = 0; i < base.array.length; i++) {
              dump_base = dump_base + ' ' + this.getBase(i)
            }
            for (i = 0; i < check.array.length; i++) {
              dump_check = dump_check + ' ' + this.getCheck(i)
            }

            console.log('base:' + dump_base)
            console.log('chck:' + dump_check)

            return 'base:' + dump_base + ' chck:' + dump_check
          }
        }
      }

    /**
     * Factory method of double array
     */
      function DoubleArrayBuilder (initial_size) {
        this.bc = newBC(initial_size)  // BASE and CHECK
        this.keys = []
      }

    /**
     * Append a key to initialize set
     * (This method should be called by dictionary ordered key)
     *
     * @param {String} key
     * @param {Number} value Integer value from 0 to max signed integer number - 1
     */
      DoubleArrayBuilder.prototype.append = function (key, record) {
        this.keys.push({ k: key, v: record })
        return this
      }

    /**
     * Build double array for given keys
     *
     * @param {Array} keys Array of keys. A key is a Object which has properties 'k', 'v'.
     * 'k' is a key string, 'v' is a record assigned to that key.
     * @return {DoubleArray} Compiled double array
     */
      DoubleArrayBuilder.prototype.build = function (keys, sorted) {
        if (keys == null) {
          keys = this.keys
        }

        if (keys == null) {
          return new DoubleArray(this.bc)
        }

        if (sorted == null) {
          sorted = false
        }

        // Convert key string to ArrayBuffer
        var buff_keys =
            keys.map(function (k) {
              return {
                k: stringToUtf8Bytes(k.k + TERM_CHAR),
                v: k.v
              }
            })

        // Sort keys by byte order
        if (sorted) {
          this.keys = buff_keys
        } else {
          this.keys =
                buff_keys.sort(function (k1, k2) {
                  var b1 = k1.k
                  var b2 = k2.k
                  var min_length = Math.min(b1.length, b2.length)
                  for (var pos = 0; pos < min_length; pos++) {
                    if (b1[pos] === b2[pos]) {
                      continue
                    }
                    return b1[pos] - b2[pos]
                  }
                  return b1.length - b2.length
                })
        }

        buff_keys = null  // explicit GC

        this._build(ROOT_ID, 0, 0, this.keys.length)
        return new DoubleArray(this.bc)
      }

    /**
     * Append nodes to BASE and CHECK array recursively
     */
      DoubleArrayBuilder.prototype._build = function (parent_index, position, start, length) {
        var children_info = this.getChildrenInfo(position, start, length)
        var _base = this.findAllocatableBase(children_info)

        this.setBC(parent_index, children_info, _base)

        for (var i = 0; i < children_info.length; i = i + 3) {
          var child_code = children_info[i]
          if (child_code === TERM_CODE) {
            continue
          }
          var child_start = children_info[i + 1]
          var child_len = children_info[i + 2]
          var child_index = _base + child_code
          this._build(child_index, position + 1, child_start, child_len)
        }
      }

      DoubleArrayBuilder.prototype.getChildrenInfo = function (position, start, length) {
        var current_char = this.keys[start].k[position]
        var i = 0
        var children_info = new Int32Array(length * 3)

        children_info[i++] = current_char  // char (current)
        children_info[i++] = start         // start index (current)

        var next_pos = start
        var start_pos = start
        for (; next_pos < start + length; next_pos++) {
          var next_char = this.keys[next_pos].k[position]
          if (current_char !== next_char) {
            children_info[i++] = next_pos - start_pos  // length (current)

            children_info[i++] = next_char             // char (next)
            children_info[i++] = next_pos              // start index (next)
            current_char = next_char
            start_pos = next_pos
          }
        }
        children_info[i++] = next_pos - start_pos
        children_info = children_info.subarray(0, i)

        return children_info
      }

      DoubleArrayBuilder.prototype.setBC = function (parent_id, children_info, _base) {
        var bc = this.bc

        bc.setBase(parent_id, _base)  // Update BASE of parent node

        var i
        for (i = 0; i < children_info.length; i = i + 3) {
          var code = children_info[i]
          var child_id = _base + code

            // Update linked list of unused nodes

            // Assertion
            // if (child_id < 0) {
            //     throw 'assertion error: child_id is negative'
            // }

          var prev_unused_id = -bc.getBase(child_id)
          var next_unused_id = -bc.getCheck(child_id)
            // if (prev_unused_id < 0) {
            //     throw 'assertion error: setBC'
            // }
            // if (next_unused_id < 0) {
            //     throw 'assertion error: setBC'
            // }
          if (child_id !== bc.getFirstUnusedNode()) {
            bc.setCheck(prev_unused_id, -next_unused_id)
          } else {
                // Update first_unused_node
            bc.setFirstUnusedNode(next_unused_id)
          }
          bc.setBase(next_unused_id, -prev_unused_id)

          var check = parent_id         // CHECK is parent node index
          bc.setCheck(child_id, check)  // Update CHECK of child node

            // Update record
          if (code === TERM_CODE) {
            var start_pos = children_info[i + 1]
                // var len = children_info[i + 2];
                // if (len != 1) {
                //     throw 'assertion error: there are multiple terminal nodes. len:' + len;
                // }
            var value = this.keys[start_pos].v

            if (value == null) {
              value = 0
            }

            var base = -value - 1       // BASE is inverted record value
            bc.setBase(child_id, base)  // Update BASE of child(leaf) node
          }
        }
      }

    /**
     * Find BASE value that all children are allocatable in double array's region
     */
      DoubleArrayBuilder.prototype.findAllocatableBase = function (children_info) {
        var bc = this.bc

        // Assertion: keys are sorted by byte order
        // var c = -1;
        // for (var i = 0; i < children_info.length; i = i + 3) {
        //     if (children_info[i] < c) {
        //         throw 'assertion error: not sort key'
        //     }
        //     c = children_info[i];
        // }

        // iterate linked list of unused nodes
        var _base
        var curr = bc.getFirstUnusedNode()  // current index
        // if (curr < 0) {
        //     throw 'assertion error: getFirstUnusedNode returns negative value'
        // }

        while (true) {
          _base = curr - children_info[0]

          if (_base < 0) {
            curr = -bc.getCheck(curr)  // next

                // if (curr < 0) {
                //     throw 'assertion error: getCheck returns negative value'
                // }

            continue
          }

          var empty_area_found = true
          for (var i = 0; i < children_info.length; i = i + 3) {
            var code = children_info[i]
            var candidate_id = _base + code

            if (!this.isUnusedNode(candidate_id)) {
                    // candidate_id is used node
                    // next
              curr = -bc.getCheck(curr)
                    // if (curr < 0) {
                    //     throw 'assertion error: getCheck returns negative value'
                    // }

              empty_area_found = false
              break
            }
          }
          if (empty_area_found) {
                // Area is free
            return _base
          }
        }
      }

    /**
     * Check this double array index is unused or not
     */
      DoubleArrayBuilder.prototype.isUnusedNode = function (index) {
        var bc = this.bc
        var check = bc.getCheck(index)

        // if (index < 0) {
        //     throw 'assertion error: isUnusedNode index:' + index;
        // }

        if (index === ROOT_ID) {
            // root node
          return false
        }
        if (check < 0) {
            // unused
          return true
        }

        // used node (incl. leaf)
        return false
      }

    /**
     * Factory method of double array
     */
      function DoubleArray (bc) {
        this.bc = bc       // BASE and CHECK
        this.bc.shrink()
      }

    /**
     * Look up a given key in this trie
     *
     * @param {String} key
     * @return {Boolean} True if this trie contains a given key
     */
      DoubleArray.prototype.contain = function (key) {
        var bc = this.bc

        key += TERM_CHAR
        var buffer = stringToUtf8Bytes(key)

        var parent = ROOT_ID
        var child = NOT_FOUND

        for (var i = 0; i < buffer.length; i++) {
          var code = buffer[i]

          child = this.traverse(parent, code)
          if (child === NOT_FOUND) {
            return false
          }

          if (bc.getBase(child) <= 0) {
                // leaf node
            return true
          } else {
                // not leaf
            parent = child
            continue
          }
        }
        return false
      }

    /**
     * Look up a given key in this trie
     *
     * @param {String} key
     * @return {Number} Record value assgned to this key, -1 if this key does not contain
     */
      DoubleArray.prototype.lookup = function (key) {
        key += TERM_CHAR
        var buffer = stringToUtf8Bytes(key)

        var parent = ROOT_ID
        var child = NOT_FOUND

        for (var i = 0; i < buffer.length; i++) {
          var code = buffer[i]
          child = this.traverse(parent, code)
          if (child === NOT_FOUND) {
            return NOT_FOUND
          }
          parent = child
        }

        var base = this.bc.getBase(child)
        if (base <= 0) {
            // leaf node
          return -base - 1
        } else {
            // not leaf
          return NOT_FOUND
        }
      }

    /**
     * Common prefix search
     *
     * @param {String} key
     * @return {Array} Each result object has 'k' and 'v' (key and record,
     * respectively) properties assigned to matched string
     */
      DoubleArray.prototype.commonPrefixSearch = function (key) {
        var buffer = stringToUtf8Bytes(key)

        var parent = ROOT_ID
        var child = NOT_FOUND

        var result = []

        for (var i = 0; i < buffer.length; i++) {
          var code = buffer[i]

          child = this.traverse(parent, code)

          if (child !== NOT_FOUND) {
            parent = child

                // look forward by terminal character code to check this node is a leaf or not
            var grand_child = this.traverse(child, TERM_CODE)

            if (grand_child !== NOT_FOUND) {
              var base = this.bc.getBase(grand_child)

              var r = {}

              if (base <= 0) {
                        // If child is a leaf node, add record to result
                r.v = -base - 1
              }

                    // If child is a leaf node, add word to result
              r.k = utf8BytesToString(arrayCopy(buffer, 0, i + 1))

              result.push(r)
            }
            continue
          } else {
            break
          }
        }

        return result
      }

      DoubleArray.prototype.traverse = function (parent, code) {
        var child = this.bc.getBase(parent) + code
        if (this.bc.getCheck(child) === parent) {
          return child
        } else {
          return NOT_FOUND
        }
      }

      DoubleArray.prototype.size = function () {
        return this.bc.size()
      }

      DoubleArray.prototype.calc = function () {
        return this.bc.calc()
      }

      DoubleArray.prototype.dump = function () {
        return this.bc.dump()
      }

    // Array utility functions

      var newArrayBuffer = function (signed, bytes, size) {
        if (signed) {
          switch (bytes) {
            case 1:
              return new Int8Array(size)
            case 2:
              return new Int16Array(size)
            case 4:
              return new Int32Array(size)
            default:
              throw new RangeError('Invalid newArray parameter element_bytes:' + bytes)
          }
        } else {
          switch (bytes) {
            case 1:
              return new Uint8Array(size)
            case 2:
              return new Uint16Array(size)
            case 4:
              return new Uint32Array(size)
            default:
              throw new RangeError('Invalid newArray parameter element_bytes:' + bytes)
          }
        }
      }

      var arrayCopy = function (src, src_offset, length) {
        var buffer = new ArrayBuffer(length)
        var dstU8 = new Uint8Array(buffer, 0, length)
        var srcU8 = src.subarray(src_offset, length)
        dstU8.set(srcU8)
        return dstU8
      }

    /**
     * Convert String (UTF-16) to UTF-8 ArrayBuffer
     *
     * @param {String} str UTF-16 string to convert
     * @return {Uint8Array} Byte sequence encoded by UTF-8
     */
      var stringToUtf8Bytes = function (str) {
        // Max size of 1 character is 4 bytes
        var bytes = new Uint8Array(new ArrayBuffer(str.length * 4))

        var i = 0, j = 0

        while (i < str.length) {
          var unicode_code

          var utf16_code = str.charCodeAt(i++)
          if (utf16_code >= 0xD800 && utf16_code <= 0xDBFF) {
                // surrogate pair
            var upper = utf16_code           // high surrogate
            var lower = str.charCodeAt(i++)  // low surrogate

            if (lower >= 0xDC00 && lower <= 0xDFFF) {
              unicode_code =
                        (upper - 0xD800) * (1 << 10) + (1 << 16) +
                        (lower - 0xDC00)
            } else {
                    // malformed surrogate pair
              return null
            }
          } else {
                // not surrogate code
            unicode_code = utf16_code
          }

          if (unicode_code < 0x80) {
                // 1-byte
            bytes[j++] = unicode_code
          } else if (unicode_code < (1 << 11)) {
                // 2-byte
            bytes[j++] = (unicode_code >>> 6) | 0xC0
            bytes[j++] = (unicode_code & 0x3F) | 0x80
          } else if (unicode_code < (1 << 16)) {
                // 3-byte
            bytes[j++] = (unicode_code >>> 12) | 0xE0
            bytes[j++] = ((unicode_code >> 6) & 0x3f) | 0x80
            bytes[j++] = (unicode_code & 0x3F) | 0x80
          } else if (unicode_code < (1 << 21)) {
                // 4-byte
            bytes[j++] = (unicode_code >>> 18) | 0xF0
            bytes[j++] = ((unicode_code >> 12) & 0x3F) | 0x80
            bytes[j++] = ((unicode_code >> 6) & 0x3F) | 0x80
            bytes[j++] = (unicode_code & 0x3F) | 0x80
          } else {
                // malformed UCS4 code
          }
        }

        return bytes.subarray(0, j)
      }

    /**
     * Convert UTF-8 ArrayBuffer to String (UTF-16)
     *
     * @param {Uint8Array} bytes UTF-8 byte sequence to convert
     * @return {String} String encoded by UTF-16
     */
      var utf8BytesToString = function (bytes) {
        var str = ''
        var code, b1, b2, b3, b4, upper, lower
        var i = 0

        while (i < bytes.length) {
          b1 = bytes[i++]

          if (b1 < 0x80) {
                // 1 byte
            code = b1
          } else if ((b1 >> 5) === 0x06) {
                // 2 bytes
            b2 = bytes[i++]
            code = ((b1 & 0x1f) << 6) | (b2 & 0x3f)
          } else if ((b1 >> 4) === 0x0e) {
                // 3 bytes
            b2 = bytes[i++]
            b3 = bytes[i++]
            code = ((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f)
          } else {
                // 4 bytes
            b2 = bytes[i++]
            b3 = bytes[i++]
            b4 = bytes[i++]
            code = ((b1 & 0x07) << 18) | ((b2 & 0x3f) << 12) | ((b3 & 0x3f) << 6) | (b4 & 0x3f)
          }

          if (code < 0x10000) {
	            str += String.fromCharCode(code)
          } else {
	            // surrogate pair
	            code -= 0x10000
	            upper = (0xD800 | (code >> 10))
	            lower = (0xDC00 | (code & 0x3FF))
	            str += String.fromCharCode(upper, lower)
          }
        }

        return str
      }

    // public methods
      var doublearray = {
        builder: function (initial_size) {
          return new DoubleArrayBuilder(initial_size)
        },
        load: function (base_buffer, check_buffer) {
          var bc = newBC(0)
          bc.loadBaseBuffer(base_buffer)
          bc.loadCheckBuffer(check_buffer)
          return new DoubleArray(bc)
        }
      }

      if (typeof module === 'undefined') {
	    // In browser
        window.doublearray = doublearray
      } else {
	    // In node
        module.exports = doublearray
      }
    })()
  }, {}],
  58: [function (require, module, exports) {
    /** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function () {
      'use strict'; function n (e) { throw e } var q = void 0, aa = this; function r (e, c) { var d = e.split('.'), b = aa; !(d[0] in b) && b.execScript && b.execScript('var ' + d[0]); for (var a; d.length && (a = d.shift());)!d.length && c !== q ? b[a] = c : b = b[a] ? b[a] : b[a] = {} };var u = typeof Uint8Array !== 'undefined' && typeof Uint16Array !== 'undefined' && typeof Uint32Array !== 'undefined' && typeof DataView !== 'undefined'; new (u ? Uint8Array : Array)(256); var v; for (v = 0; v < 256; ++v) for (var w = v, ba = 7, w = w >>> 1; w; w >>>= 1)--ba; function x (e, c, d) { var b, a = typeof c === 'number' ? c : c = 0, f = typeof d === 'number' ? d : e.length; b = -1; for (a = f & 7; a--; ++c)b = b >>> 8 ^ z[(b ^ e[c]) & 255]; for (a = f >> 3; a--; c += 8)b = b >>> 8 ^ z[(b ^ e[c]) & 255], b = b >>> 8 ^ z[(b ^ e[c + 1]) & 255], b = b >>> 8 ^ z[(b ^ e[c + 2]) & 255], b = b >>> 8 ^ z[(b ^ e[c + 3]) & 255], b = b >>> 8 ^ z[(b ^ e[c + 4]) & 255], b = b >>> 8 ^ z[(b ^ e[c + 5]) & 255], b = b >>> 8 ^ z[(b ^ e[c + 6]) & 255], b = b >>> 8 ^ z[(b ^ e[c + 7]) & 255]; return (b ^ 4294967295) >>> 0 }
      var A = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759,
          2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977,
          2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755,
          2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956,
          3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270,
          936918E3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117], z = u ? new Uint32Array(A) : A; function B () {}B.prototype.getName = function () { return this.name }; B.prototype.getData = function () { return this.data }; B.prototype.H = function () { return this.I }; r('Zlib.GunzipMember', B); r('Zlib.GunzipMember.prototype.getName', B.prototype.getName); r('Zlib.GunzipMember.prototype.getData', B.prototype.getData); r('Zlib.GunzipMember.prototype.getMtime', B.prototype.H); function D (e) { var c = e.length, d = 0, b = Number.POSITIVE_INFINITY, a, f, g, k, m, p, t, h, l, y; for (h = 0; h < c; ++h)e[h] > d && (d = e[h]), e[h] < b && (b = e[h]); a = 1 << d; f = new (u ? Uint32Array : Array)(a); g = 1; k = 0; for (m = 2; g <= d;) { for (h = 0; h < c; ++h) if (e[h] === g) { p = 0; t = k; for (l = 0; l < g; ++l)p = p << 1 | t & 1, t >>= 1; y = g << 16 | h; for (l = p; l < a; l += m)f[l] = y; ++k }++g; k <<= 1; m <<= 1 } return [f, d, b] };var E = [], F; for (F = 0; F < 288; F++) switch (!0) { case F <= 143:E.push([F + 48, 8]); break; case F <= 255:E.push([F - 144 + 400, 9]); break; case F <= 279:E.push([F - 256 + 0, 7]); break; case F <= 287:E.push([F - 280 + 192, 8]); break; default:n('invalid literal: ' + F) }
      var ca = (function () {
        function e (a) {
          switch (!0) {
            case a === 3:return [257, a - 3, 0]; case a === 4:return [258, a - 4, 0]; case a === 5:return [259, a - 5, 0]; case a === 6:return [260, a - 6, 0]; case a === 7:return [261, a - 7, 0]; case a === 8:return [262, a - 8, 0]; case a === 9:return [263, a - 9, 0]; case a === 10:return [264, a - 10, 0]; case a <= 12:return [265, a - 11, 1]; case a <= 14:return [266, a - 13, 1]; case a <= 16:return [267, a - 15, 1]; case a <= 18:return [268, a - 17, 1]; case a <= 22:return [269, a - 19, 2]; case a <= 26:return [270, a - 23, 2]; case a <= 30:return [271, a - 27, 2]; case a <= 34:return [272,
              a - 31, 2]; case a <= 42:return [273, a - 35, 3]; case a <= 50:return [274, a - 43, 3]; case a <= 58:return [275, a - 51, 3]; case a <= 66:return [276, a - 59, 3]; case a <= 82:return [277, a - 67, 4]; case a <= 98:return [278, a - 83, 4]; case a <= 114:return [279, a - 99, 4]; case a <= 130:return [280, a - 115, 4]; case a <= 162:return [281, a - 131, 5]; case a <= 194:return [282, a - 163, 5]; case a <= 226:return [283, a - 195, 5]; case a <= 257:return [284, a - 227, 5]; case a === 258:return [285, a - 258, 0]; default:n('invalid length: ' + a)
          }
        } var c = [], d, b; for (d = 3; d <= 258; d++) {
          b = e(d), c[d] = b[2] << 24 | b[1] <<
16 | b[0]
        } return c
      }()); u && new Uint32Array(ca); function G (e, c) { this.i = []; this.j = 32768; this.d = this.f = this.c = this.n = 0; this.input = u ? new Uint8Array(e) : e; this.o = !1; this.k = H; this.z = !1; if (c || !(c = {}))c.index && (this.c = c.index), c.bufferSize && (this.j = c.bufferSize), c.bufferType && (this.k = c.bufferType), c.resize && (this.z = c.resize); switch (this.k) { case I:this.a = 32768; this.b = new (u ? Uint8Array : Array)(32768 + this.j + 258); break; case H:this.a = 0; this.b = new (u ? Uint8Array : Array)(this.j); this.e = this.F; this.q = this.B; this.l = this.D; break; default:n(Error('invalid inflate mode')) } }
      var I = 0, H = 1
      G.prototype.g = function () {
        for (;!this.o;) {
          var e = J(this, 3); e & 1 && (this.o = !0); e >>>= 1; switch (e) {
            case 0:var c = this.input, d = this.c, b = this.b, a = this.a, f = c.length, g = q, k = q, m = b.length, p = q; this.d = this.f = 0; d + 1 >= f && n(Error('invalid uncompressed block header: LEN')); g = c[d++] | c[d++] << 8; d + 1 >= f && n(Error('invalid uncompressed block header: NLEN')); k = c[d++] | c[d++] << 8; g === ~k && n(Error('invalid uncompressed block header: length verify')); d + g > c.length && n(Error('input buffer is broken')); switch (this.k) {
              case I:for (;a + g > b.length;) {
                p =
m - a; g -= p; if (u)b.set(c.subarray(d, d + p), a), a += p, d += p; else for (;p--;)b[a++] = c[d++]; this.a = a; b = this.e(); a = this.a
              } break; case H:for (;a + g > b.length;)b = this.e({t: 2}); break; default:n(Error('invalid inflate mode'))
            } if (u)b.set(c.subarray(d, d + g), a), a += g, d += g; else for (;g--;)b[a++] = c[d++]; this.c = d; this.a = a; this.b = b; break; case 1:this.l(da, ea); break; case 2:fa(this); break; default:n(Error('unknown BTYPE: ' + e))
          }
        } return this.q()
      }
      var K = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], L = u ? new Uint16Array(K) : K, N = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 258, 258], O = u ? new Uint16Array(N) : N, P = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0], Q = u ? new Uint8Array(P) : P, R = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577], ga = u ? new Uint16Array(R) : R, ha = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12,
          13, 13], U = u ? new Uint8Array(ha) : ha, V = new (u ? Uint8Array : Array)(288), W, ia; W = 0; for (ia = V.length; W < ia; ++W)V[W] = W <= 143 ? 8 : W <= 255 ? 9 : W <= 279 ? 7 : 8; var da = D(V), X = new (u ? Uint8Array : Array)(30), Y, ja; Y = 0; for (ja = X.length; Y < ja; ++Y)X[Y] = 5; var ea = D(X); function J (e, c) { for (var d = e.f, b = e.d, a = e.input, f = e.c, g = a.length, k; b < c;)f >= g && n(Error('input buffer is broken')), d |= a[f++] << b, b += 8; k = d & (1 << c) - 1; e.f = d >>> c; e.d = b - c; e.c = f; return k }
      function Z (e, c) { for (var d = e.f, b = e.d, a = e.input, f = e.c, g = a.length, k = c[0], m = c[1], p, t; b < m && !(f >= g);)d |= a[f++] << b, b += 8; p = k[d & (1 << m) - 1]; t = p >>> 16; e.f = d >> t; e.d = b - t; e.c = f; return p & 65535 }
      function fa (e) {
        function c (a, c, b) { var d, e = this.w, f, g; for (g = 0; g < a;) switch (d = Z(this, c), d) { case 16:for (f = 3 + J(this, 2); f--;)b[g++] = e; break; case 17:for (f = 3 + J(this, 3); f--;)b[g++] = 0; e = 0; break; case 18:for (f = 11 + J(this, 7); f--;)b[g++] = 0; e = 0; break; default:e = b[g++] = d } this.w = e; return b } var d = J(e, 5) + 257, b = J(e, 5) + 1, a = J(e, 4) + 4, f = new (u ? Uint8Array : Array)(L.length), g, k, m, p; for (p = 0; p < a; ++p)f[L[p]] = J(e, 3); if (!u) { p = a; for (a = f.length; p < a; ++p)f[L[p]] = 0 }g = D(f); k = new (u ? Uint8Array : Array)(d); m = new (u ? Uint8Array : Array)(b); e.w =
0; e.l(D(c.call(e, d, g, k)), D(c.call(e, b, g, m)))
      }G.prototype.l = function (e, c) { var d = this.b, b = this.a; this.r = e; for (var a = d.length - 258, f, g, k, m; (f = Z(this, e)) !== 256;) if (f < 256)b >= a && (this.a = b, d = this.e(), b = this.a), d[b++] = f; else { g = f - 257; m = O[g]; Q[g] > 0 && (m += J(this, Q[g])); f = Z(this, c); k = ga[f]; U[f] > 0 && (k += J(this, U[f])); b >= a && (this.a = b, d = this.e(), b = this.a); for (;m--;)d[b] = d[b++ - k] } for (;this.d >= 8;) this.d -= 8, this.c--; this.a = b }
      G.prototype.D = function (e, c) { var d = this.b, b = this.a; this.r = e; for (var a = d.length, f, g, k, m; (f = Z(this, e)) !== 256;) if (f < 256)b >= a && (d = this.e(), a = d.length), d[b++] = f; else { g = f - 257; m = O[g]; Q[g] > 0 && (m += J(this, Q[g])); f = Z(this, c); k = ga[f]; U[f] > 0 && (k += J(this, U[f])); b + m > a && (d = this.e(), a = d.length); for (;m--;)d[b] = d[b++ - k] } for (;this.d >= 8;) this.d -= 8, this.c--; this.a = b }
      G.prototype.e = function () { var e = new (u ? Uint8Array : Array)(this.a - 32768), c = this.a - 32768, d, b, a = this.b; if (u)e.set(a.subarray(32768, e.length)); else { d = 0; for (b = e.length; d < b; ++d)e[d] = a[d + 32768] } this.i.push(e); this.n += e.length; if (u)a.set(a.subarray(c, c + 32768)); else for (d = 0; d < 32768; ++d)a[d] = a[c + d]; this.a = 32768; return a }
      G.prototype.F = function (e) { var c, d = this.input.length / this.c + 1 | 0, b, a, f, g = this.input, k = this.b; e && (typeof e.t === 'number' && (d = e.t), typeof e.A === 'number' && (d += e.A)); d < 2 ? (b = (g.length - this.c) / this.r[2], f = 258 * (b / 2) | 0, a = f < k.length ? k.length + f : k.length << 1) : a = k.length * d; u ? (c = new Uint8Array(a), c.set(k)) : c = k; return this.b = c }
      G.prototype.q = function () { var e = 0, c = this.b, d = this.i, b, a = new (u ? Uint8Array : Array)(this.n + (this.a - 32768)), f, g, k, m; if (d.length === 0) return u ? this.b.subarray(32768, this.a) : this.b.slice(32768, this.a); f = 0; for (g = d.length; f < g; ++f) { b = d[f]; k = 0; for (m = b.length; k < m; ++k)a[e++] = b[k] }f = 32768; for (g = this.a; f < g; ++f)a[e++] = c[f]; this.i = []; return this.buffer = a }
      G.prototype.B = function () { var e, c = this.a; u ? this.z ? (e = new Uint8Array(c), e.set(this.b.subarray(0, c))) : e = this.b.subarray(0, c) : (this.b.length > c && (this.b.length = c), e = this.b); return this.buffer = e }; function $ (e) { this.input = e; this.c = 0; this.m = []; this.s = !1 }$.prototype.G = function () { this.s || this.g(); return this.m.slice() }
      $.prototype.g = function () {
        for (var e = this.input.length; this.c < e;) {
          var c = new B(), d = q, b = q, a = q, f = q, g = q, k = q, m = q, p = q, t = q, h = this.input, l = this.c; c.u = h[l++]; c.v = h[l++]; (c.u !== 31 || c.v !== 139) && n(Error('invalid file signature:' + c.u + ',' + c.v)); c.p = h[l++]; switch (c.p) { case 8:break; default:n(Error('unknown compression method: ' + c.p)) }c.h = h[l++]; p = h[l++] | h[l++] << 8 | h[l++] << 16 | h[l++] << 24; c.I = new Date(1E3 * p); c.O = h[l++]; c.N = h[l++]; (c.h & 4) > 0 && (c.J = h[l++] | h[l++] << 8, l += c.J); if ((c.h & 8) > 0) {
            m = []; for (k = 0; (g = h[l++]) > 0;)m[k++] = String.fromCharCode(g)
            c.name = m.join('')
          } if ((c.h & 16) > 0) { m = []; for (k = 0; (g = h[l++]) > 0;)m[k++] = String.fromCharCode(g); c.K = m.join('') }(c.h & 2) > 0 && (c.C = x(h, 0, l) & 65535, c.C !== (h[l++] | h[l++] << 8) && n(Error('invalid header crc16'))); d = h[h.length - 4] | h[h.length - 3] << 8 | h[h.length - 2] << 16 | h[h.length - 1] << 24; h.length - l - 4 - 4 < 512 * d && (f = d); b = new G(h, {index: l, bufferSize: f}); c.data = a = b.g(); l = b.c; c.L = t = (h[l++] | h[l++] << 8 | h[l++] << 16 | h[l++] << 24) >>> 0; x(a, q, q) !== t && n(Error('invalid CRC-32 checksum: 0x' + x(a, q, q).toString(16) + ' / 0x' + t.toString(16))); c.M =
d = (h[l++] | h[l++] << 8 | h[l++] << 16 | h[l++] << 24) >>> 0; (a.length & 4294967295) !== d && n(Error('invalid input size: ' + (a.length & 4294967295) + ' / ' + d)); this.m.push(c); this.c = l
        } this.s = !0; var y = this.m, s, M, S = 0, T = 0, C; s = 0; for (M = y.length; s < M; ++s)T += y[s].data.length; if (u) { C = new Uint8Array(T); for (s = 0; s < M; ++s)C.set(y[s].data, S), S += y[s].data.length } else { C = []; for (s = 0; s < M; ++s)C[s] = y[s].data; C = Array.prototype.concat.apply([], C) } return C
      }; r('Zlib.Gunzip', $); r('Zlib.Gunzip.prototype.decompress', $.prototype.g); r('Zlib.Gunzip.prototype.getMembers', $.prototype.G)
    }).call(this)
  }, {}],
  59: [function (require, module, exports) {
/* global kuromoji */
    'use strict'

    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { 'default': obj } }

    var _d3 = require('d3')

    var _d32 = _interopRequireDefault(_d3)

    require('kuromoji')

    var width = 960,
      height = 500

    var color = _d32['default'].scale.category20c()

    var force = _d32['default'].layout.force().charge(-120).linkDistance(30).size([width, height])

    var svg = _d32['default'].select('body').append('svg').attr('width', width).attr('height', height)

    kuromoji.builder({ dicPath: 'dict/' }).build(function (err, tokenizer) {
      var path = tokenizer.tokenize('すもももももももものうち')
      console.log(path)

      _d32['default'].json('miserables.json', function (error, graph) {
        if (error) throw error

        force.nodes(graph.nodes).links(graph.links).start()

        var link = svg.selectAll('.link').data(graph.links).enter().append('line').attr('class', 'link').style('stroke-width', function (d) {
          return Math.sqrt(d.value)
        })

        var node = svg.selectAll('.node').data(graph.nodes).enter().append('text').attr('class', 'node').style('fill', function (d) {
          return color(d.group)
        }).call(force.drag).text(function (d) {
          return d.name.substring(0, 4)
        })

        force.on('tick', function () {
          link.attr('x1', function (d) {
            return d.source.x
          }).attr('y1', function (d) {
            return d.source.y
          }).attr('x2', function (d) {
            return d.target.x
          }).attr('y2', function (d) {
            return d.target.y
          })

          node.attr('x', function (d) {
            return d.x
          }).attr('y', function (d) {
            return d.y
          })
        })
      })
    })

    var b = ['酒', '借金']
    var c = ['借りる', '過食']
    var a = [b, c]

/* var k_danraku = {    //形態素解析段落
  "danraku1":[
    "私",
    "生きる",
    "いる"
  ],
  "danraku2":[
    "ここ",
    "生きる"
  ]
}
*/

    var danraku0 = ['A', 'B', 'C']
    var danraku1 = ['B', 'D']
    var k_danraku = [danraku0, danraku1]

/* danraku1.add()

var danraku = ["段落あ","段落い"];
var A =
*/

    var tangoset = new Set()

    tangoset.add(danraku.tango)

    var tangoset = ['a', 'b', 'c', 'd']

    var keitaisokaiseki = [[1, 0], [1, 1], [1, 0], [0, 1]]
    var link = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    var i, j, k, l
    for (i = 0; i < tangoset.size; ++i) {
      for (j = i + 1; j < tangoset.size; ++j) {
        for (k = 0; k < danraku.size; ++k) {
          for (l = 0; l < danraku.size; ++l) {
            if (keitaisokaiseki[i][k] == 1 && keitaisokaiseki[j][l] == 1) {
              link[i][j] = 1
            }
          }
        }
      }
    }

    var jaccard

    var miserable = {
      'nodes': [{ 'name': '1', 'group': 1 }, { 'name': '2', 'group': 2 }, { 'name': '3', 'group': 3 }, { 'name': '4', 'group': 4 }, { 'name': '8', 'group': 8 }, { 'name': '7', 'group': 7 }, { 'name': '6', 'group': 6 }, { 'name': '5', 'group': 5 }, { 'name': '結局', 'group': 1 }, { 'name': '思う', 'group': 6 }, { 'name': '関係', 'group': 6 }, { 'name': '入る', 'group': 2 }, { 'name': '仕事', 'group': 5 }, { 'name': '人', 'group': 4 }, { 'name': '嘔吐', 'group': 8 }, { 'name': '見える', 'group': 2 }, { 'name': '分かる', 'group': 3 }, { 'name': '過食', 'group': 7 }, { 'name': '嫌い', 'group': 1 }, { 'name': '悪い', 'group': 2 }, { 'name': '2つ', 'group': 7 }, { 'name': '対人', 'group': 1 }, { 'name': 'ストレス', 'group': 8 }, { 'name': '風', 'group': 3 }, { 'name': '信頼', 'group': 2 }, { 'name': '一つ', 'group': 5 }, { 'name': '行動', 'group': 1 }, { 'name': '調子', 'group': 4 }, { 'name': '考える', 'group': 4 }, { 'name': '気持ち', 'group': 2 }, { 'name': '言う', 'group': 2 }, { 'name': 'ま', 'group': 3 }, { 'name': '自分', 'group': 2 }, { 'name': 'B', 'group': 1 }],
      'links': [{ 'source': 11, 'target': 8, 'value': 1 }, { 'source': 13, 'target': 11, 'value': 8 }, { 'source': 13, 'target': 12, 'value': 10 }, { 'source': 12, 'target': 9, 'value': 6 }, { 'source': 10, 'target': 9, 'value': 1 }, { 'source': 14, 'target': 10, 'value': 1 }, { 'source': 15, 'target': 13, 'value': 1 }, { 'source': 16, 'target': 14, 'value': 1 }, { 'source': 17, 'target': 14, 'value': 2 }, { 'source': 18, 'target': 15, 'value': 1 }, { 'source': 19, 'target': 16, 'value': 1 }, { 'source': 20, 'target': 17, 'value': 3 }, { 'source': 21, 'target': 19, 'value': 3 }, { 'source': 22, 'target': 20, 'value': 5 }, { 'source': 25, 'target': 23, 'value': 1 }, { 'source': 24, 'target': 23, 'value': 1 }, { 'source': 26, 'target': 24, 'value': 1 }, { 'source': 27, 'target': 22, 'value': 1 }, { 'source': 25, 'target': 22, 'value': 4 }, { 'source': 28, 'target': 27, 'value': 4 }, { 'source': 29, 'target': 25, 'value': 4 }, { 'source': 31, 'target': 28, 'value': 4 }, { 'source': 30, 'target': 29, 'value': 4 }, { 'source': 32, 'target': 31, 'value': 4 }, { 'source': 33, 'target': 32, 'value': 3 }]
    }
  }, {'d3': 36, 'kuromoji': 46}]}, {}, [59])
