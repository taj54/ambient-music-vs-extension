import { defineConfig } from 'tsup';
import pkg from './package.json';

export default defineConfig({
  entry: ['src/extension.ts', 'test/runTest.ts', 'test/suite/index.ts', 'test/extension.test.ts', 'test/suite/playlistFilter.test.ts', 'test/suite/playlistManager.test.ts'],
  outDir: 'dist',
  target: 'es2020',
  format: ['cjs'],
  sourcemap: true,
  clean: true,
  banner: {
    js: `/**
 * 
 * ${pkg.description}
 * ${pkg.name} v${pkg.version}
 * @author ${pkg.author}
 * @license ${pkg.license}
 * 
 */
    `,
  },
  external: ['vscode', 'mocha'],
});
