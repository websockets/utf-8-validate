'use strict';

const { join } = require('path');
const { readFileSync } = require('fs');
const { strictEqual } = require('assert');
const isValidUTF8 = require('..');

const txt = readFileSync(join(__dirname, 'fixtures', 'lorem-ipsum.txt'));

describe('isValidUTF8', () => {
  it('returns true with an empty buffer', function () {
    strictEqual(isValidUTF8(Buffer.alloc(0)), true);
  });

  it('returns true for a valid utf8 string', function () {
    strictEqual(isValidUTF8(Buffer.from(txt)), true);
  });

  it('returns false for an erroneous string', function () {
    var invalid = Buffer.from([
      0xce, 0xba, 0xe1, 0xbd, 0xb9, 0xcf, 0x83, 0xce, 0xbc, 0xce, 0xb5, 0xed,
      0xa0, 0x80, 0x65, 0x64, 0x69, 0x74, 0x65, 0x64
    ]);

    strictEqual(isValidUTF8(invalid), false);
  });

  it('returns true for valid cases from the autobahn test suite', function () {
    strictEqual(
      isValidUTF8(Buffer.from('\xf0\x90\x80\x80')),
      true
    );
    strictEqual(
      isValidUTF8(Buffer.from([0xf0, 0x90, 0x80, 0x80])),
      true
    );
  });

  it('returns false for erroneous autobahn strings', function () {
    strictEqual(
      isValidUTF8(Buffer.from([0xce, 0xba, 0xe1, 0xbd])),
      false
    );
  });
});
