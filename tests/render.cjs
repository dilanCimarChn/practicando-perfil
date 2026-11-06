const fs = require('node:fs');
const path = require('node:path');
const { builtinModules, createRequire } = require('node:module');
const vm = require('node:vm');
const project = path.resolve(__dirname, '..');
// PORTFOLIO_MODULES is an optional offline validation fallback, not needed after npm ci.
const paths = [project, process.env.PORTFOLIO_MODULES].filter(Boolean);
const esbuild = createRequire(require.resolve('vite', { paths }))('esbuild');
module.exports = async function render(imports, expression) {
  const contents = `import React from 'react'; import { renderToStaticMarkup } from 'react-dom/server';
    import { MemoryRouter } from 'react-router-dom'; ${imports}
    export const html = renderToStaticMarkup(${expression});`;
  const result = await esbuild.build({ stdin: { contents, resolveDir: project, loader: 'jsx' },
    bundle: true, write: false, platform: 'node', format: 'cjs', jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"' },
    plugins: [{ name: 'local-test-files', setup(build) {
      build.onResolve({ filter: /.*/ }, args => {
        if (args.path.startsWith('node:') || builtinModules.includes(args.path)) return { path: args.path, external: true };
        const from = args.importer && args.importer !== '<stdin>' ? path.dirname(args.importer) : args.resolveDir;
        let resolved;
        if (args.path.startsWith('.')) {
          const candidate = path.resolve(from, args.path);
          resolved = ['', '.js', '.jsx', '.ts', '.tsx', '.json'].map(ext => candidate+ext)
            .find(file => fs.existsSync(file) && fs.statSync(file).isFile());
        }
        resolved ||= require.resolve(args.path, { paths: [from, ...paths] });
        return { path: resolved, namespace: 'test-files' };
      });
      build.onLoad({ filter: /.*/, namespace: 'test-files' }, args => {
        const ext = path.extname(args.path).slice(1);
        if (ext === 'css') return { contents: '', loader: 'js' };
        return { contents: fs.readFileSync(args.path, 'utf8'),
          loader: ['jsx','tsx','ts','json'].includes(ext) ? ext : 'js', resolveDir: path.dirname(args.path) };
      });
    } }], logLevel: 'silent' });
  const sandbox = { module: { exports: {} }, require, console, process, TextEncoder, TextDecoder,
    URL, URLSearchParams, AbortController, setTimeout, clearTimeout };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(result.outputFiles[0].text, sandbox, { timeout: 10000 });
  return sandbox.module.exports.html;
};
