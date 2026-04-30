import { load } from 'node-gyp-build-esm';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import isValidUTF8 from './fallback.mjs';

let binding;

// In a CJS bundle (esbuild/webpack), `require` is defined — esbuild replaces it
// with its own `__require` implementation, webpack with `__webpack_require__`.
// In a pure ESM environment (no bundler), `require` is undefined, so we fall back
// to `createRequire(import.meta.url)` which provides a CJS-style require anchored
// to the current module's path.
// Note: native .node addons cannot be loaded via ESM `import()` because
// `process.dlopen` is synchronous — `require` or `createRequire` is always needed.
//
// IMPORTANT: The `if/else` structure is intentional and must not be refactored
// into a ternary or other expression. Bundlers like esbuild and webpack statically
// analyze `typeof require === 'function'` as a known condition at build time,
// allowing them to tree-shake the `else` branch entirely. Collapsing this into
// an expression (e.g. `const _require = typeof require === 'function' ? require : ...`)
// breaks that static analyzability.
try {
  if (typeof require === 'function') {
    const isVite =
      typeof import.meta !== 'undefined' &&
      !!import.meta.env?.MODE &&
      !!import.meta.env.BASE_URL;

    if (isVite) {
      binding = load(import.meta.dirname, () => ({
        'darwin-arm64': () =>
          require(
            join(
              process.cwd(),
              'node_modules/utf-8-validate/prebuilds/darwin-arm64/utf-8-validate.node',
            ),
          ),
        'darwin-x64': () =>
          require(
            join(
              process.cwd(),
              'node_modules/utf-8-validate/prebuilds/darwin-x64/utf-8-validate.node',
            ),
          ),
        'linux-x64': () =>
          require(
            join(
              process.cwd(),
              'node_modules/utf-8-validate/prebuilds/linux-x64/utf-8-validate.node',
            ),
          ),
        'win32-ia32': () =>
          require(
            join(
              process.cwd(),
              'node_modules/utf-8-validate/prebuilds/win32-ia32/utf-8-validate.node',
            ),
          ),
        'win32-x64': () =>
          require(
            join(
              process.cwd(),
              'node_modules/utf-8-validate/prebuilds/win32-x64/utf-8-validate.node',
            ),
          ),
      }));
    } else {
      binding = load(import.meta.dirname, () => ({
        'darwin-arm64': () =>
          require(
            /* @vite-ignore */ './prebuilds/darwin-arm64/utf-8-validate.node',
          ),
        'darwin-x64': () =>
          require(
            /* @vite-ignore */ './prebuilds/darwin-x64/utf-8-validate.node',
          ),
        'linux-x64': () =>
          require(
            /* @vite-ignore */ './prebuilds/linux-x64/utf-8-validate.node',
          ),
        'win32-ia32': () =>
          require(
            /* @vite-ignore */ './prebuilds/win32-ia32/utf-8-validate.node',
          ),
        'win32-x64': () =>
          require(
            /* @vite-ignore */ './prebuilds/win32-x64/utf-8-validate.node',
          ),
      }));
    }
  } else {
    // `require` is block-scoped here intentionally — it avoids a duplicate
    // binding conflict with any `require` that a bundler may inject globally.
    const require = createRequire(import.meta.url);

    binding = load(import.meta.dirname, () => ({
      'darwin-arm64': () =>
        require('./prebuilds/darwin-arm64/utf-8-validate.node'),
      'darwin-x64': () => require('./prebuilds/darwin-x64/utf-8-validate.node'),
      'linux-x64': () => require('./prebuilds/linux-x64/utf-8-validate.node'),
      'win32-ia32': () => require('./prebuilds/win32-ia32/utf-8-validate.node'),
      'win32-x64': () => require('./prebuilds/win32-x64/utf-8-validate.node'),
    }));
  }
} catch {
  binding = isValidUTF8;
}

export default binding;
