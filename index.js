'use strict';

const { load } = require('node-gyp-build-esm');

let binding;

try {
  binding = load(__dirname, () => ({
    'darwin-arm64': () =>
      require(
        /* @vite-ignore */ './prebuilds/darwin-arm64/utf-8-validate.node',
      ),
    'darwin-x64': () =>
      require(/* @vite-ignore */ './prebuilds/darwin-x64/utf-8-validate.node'),
    'linux-x64': () =>
      require(/* @vite-ignore */ './prebuilds/linux-x64/utf-8-validate.node'),
    'win32-ia32': () =>
      require(/* @vite-ignore */ './prebuilds/win32-ia32/utf-8-validate.node'),
    'win32-x64': () =>
      require(/* @vite-ignore */ './prebuilds/win32-x64/utf-8-validate.node'),
  }));
} catch {
  binding = require('./fallback.js');
}

module.exports = binding;
