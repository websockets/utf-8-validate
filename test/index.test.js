'use strict';

var assert = require('assert');
var path = require('path');
var fs = require('fs');

var txt = fs.readFileSync(path.join(__dirname, 'fixtures', 'lorem-ipsum.txt'));

describe('bindings', function() {
  var Validation = require('bindings')('validation').Validation;

  it('should return true for a valid utf8 string', function () {
    assert.strictEqual(Validation.isValidUTF8(new Buffer(txt)), true);
  });

  it('should return false for an erroneous string', function() {
    var invalid = new Buffer([
      0xce, 0xba, 0xe1, 0xbd, 0xb9, 0xcf, 0x83, 0xce, 0xbc, 0xce, 0xb5, 0xed,
      0xa0, 0x80, 0x65, 0x64, 0x69, 0x74, 0x65, 0x64
    ]);

    assert.strictEqual(Validation.isValidUTF8(invalid), false);
  });

  it('should return true for valid cases from the autobahn test suite', function () {
    assert.strictEqual(
      Validation.isValidUTF8(new Buffer('\xf0\x90\x80\x80')),
      true
    );
    assert.strictEqual(
      Validation.isValidUTF8(new Buffer([0xf0, 0x90, 0x80, 0x80])),
      true
    );
  });

  it('should return false for erroneous autobahn strings', function () {
    assert.strictEqual(
      Validation.isValidUTF8(new Buffer([0xce, 0xba, 0xe1, 0xbd])),
      false
    );
  });
});

describe.skip('fallback', function () {
  var Validation = require('../fallback').Validation;

  it('should return true for a valid utf8 string', function () {
    assert.strictEqual(Validation.isValidUTF8(new Buffer(txt)), true);
  });

  it('should return false for an erroneous string', function() {
    var invalid = new Buffer([
      0xce, 0xba, 0xe1, 0xbd, 0xb9, 0xcf, 0x83, 0xce, 0xbc, 0xce, 0xb5, 0xed,
      0xa0, 0x80, 0x65, 0x64, 0x69, 0x74, 0x65, 0x64
    ]);

    assert.strictEqual(Validation.isValidUTF8(invalid), false);
  });

  it('should return true for valid cases from the autobahn test suite', function () {
    assert.strictEqual(
      Validation.isValidUTF8(new Buffer('\xf0\x90\x80\x80')),
      true
    );
    assert.strictEqual(
      Validation.isValidUTF8(new Buffer([0xf0, 0x90, 0x80, 0x80])),
      true
    );
  });

  it('should return false for erroneous autobahn strings', function () {
    assert.strictEqual(
      Validation.isValidUTF8(new Buffer([0xce, 0xba, 0xe1, 0xbd])),
      false
    );
  });
});
