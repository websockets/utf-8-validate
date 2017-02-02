'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');

const txt = fs.readFileSync(path.join(__dirname, 'fixtures', 'lorem-ipsum.txt'));

describe('bindings', function () {
  const isValidUTF8 = require('bindings')('validation');

  it('should throw an error if the first argument is not a buffer', function () {
    assert.throws(
      () => isValidUTF8({}),
      /TypeError: First argument needs to be a buffer/
    );
  });

  it('should return true with an empty buffer', function () {
    assert.strictEqual(isValidUTF8(Buffer.alloc(0)), true);
  });

  it('should return true for a valid utf8 string', function () {
    assert.strictEqual(isValidUTF8(Buffer.from(txt)), true);
  });

  it('should return false for an erroneous string', function () {
    var invalid = Buffer.from([
      0xce, 0xba, 0xe1, 0xbd, 0xb9, 0xcf, 0x83, 0xce, 0xbc, 0xce, 0xb5, 0xed,
      0xa0, 0x80, 0x65, 0x64, 0x69, 0x74, 0x65, 0x64
    ]);

    assert.strictEqual(isValidUTF8(invalid), false);
  });

  it('should return true for valid cases from the autobahn test suite', function () {
    assert.strictEqual(
      isValidUTF8(Buffer.from('\xf0\x90\x80\x80')),
      true
    );
    assert.strictEqual(
      isValidUTF8(Buffer.from([0xf0, 0x90, 0x80, 0x80])),
      true
    );
  });

  it('should return false for erroneous autobahn strings', function () {
    assert.strictEqual(
      isValidUTF8(Buffer.from([0xce, 0xba, 0xe1, 0xbd])),
      false
    );
  });
});

describe('fallback', function () {
  var isValidUTF8 = require('../fallback');

  it('should throw an error if the first argument is not a buffer', function () {
    assert.throws(
      () => isValidUTF8({}),
      /TypeError: First argument needs to be a buffer/
    );
  });

  it('should return true with an empty buffer', function () {
    assert.strictEqual(isValidUTF8(Buffer.alloc(0)), true);
  });

  it('should return true for a valid utf8 string', function () {
    assert.strictEqual(isValidUTF8(Buffer.from(txt)), true);
  });

  it('should return false for an erroneous string', function () {
    var invalid = Buffer.from([
      0xce, 0xba, 0xe1, 0xbd, 0xb9, 0xcf, 0x83, 0xce, 0xbc, 0xce, 0xb5, 0xed,
      0xa0, 0x80, 0x65, 0x64, 0x69, 0x74, 0x65, 0x64
    ]);

    assert.strictEqual(isValidUTF8(invalid), false);
  });

  it('should return true for valid cases from the autobahn test suite', function () {
    assert.strictEqual(
      isValidUTF8(Buffer.from('\xf0\x90\x80\x80')),
      true
    );
    assert.strictEqual(
      isValidUTF8(Buffer.from([0xf0, 0x90, 0x80, 0x80])),
      true
    );
  });

  it('should return false for erroneous autobahn strings', function () {
    assert.strictEqual(
      isValidUTF8(Buffer.from([0xce, 0xba, 0xe1, 0xbd])),
      false
    );
  });
});
