/*!
 * UTF-8 validate: UTF-8 validation for WebSockets.
 * Copyright(c) 2015 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

'use strict';

exports.Validation = {
  /**
   * Checks if a given buffer contains only correct UTF-8.
   * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
   * Markus Kuhn.
   *
   * @param {Buffer} buf The buffer to check
   * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
   */
  isValidUTF8: function (buf) {
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('First argument needs to be a buffer');
    }

    var len = buf.length;
    var i = 0;

    while (i < len) {
      if (buf[i] < 0x80) { // 0xxxxxxx
        i++;
      } else if ((buf[i] & 0xe0) === 0xc0) { // 110xxxxx 10xxxxxx
        if (
          i + 1 === len ||
          (buf[i + 1] & 0xc0) !== 0x80 ||
          (buf[i] & 0xfe) === 0xc0 // overlong
        ) {
          return false;
        } else {
          i += 2;
        }
      } else if ((buf[i] & 0xf0) === 0xe0) { // 1110xxxx 10xxxxxx 10xxxxxx
        if (
          i + 2 >= len ||
          (buf[i + 1] & 0xc0) !== 0x80 ||
          (buf[i + 2] & 0xc0) !== 0x80 ||
          buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80 || // overlong
          buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0    // surrogate (U+D800 - U+DFFF)
        ) {
          return false;
        } else {
          i += 3;
        }
      } else if ((buf[i] & 0xf8) === 0xf0) { // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
        if (
          i + 3 >= len ||
          (buf[i + 1] & 0xc0) !== 0x80 ||
          (buf[i + 2] & 0xc0) !== 0x80 ||
          (buf[i + 3] & 0xc0) !== 0x80 ||
          buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80 || // overlong
          buf[i] === 0xf4 && buf[i + 1] > 0x8f || buf[i] > 0xf4 // > U+10FFFF
        ) {
          return false;
        } else {
          i += 4;
        }
      } else {
        return false;
      }
    }

    return true;
  }
};
