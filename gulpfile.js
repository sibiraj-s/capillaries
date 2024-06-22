import path from 'node:path';
import fs from 'node:fs/promises';

import gulp from 'gulp';
import tsup from 'tsup';
import terser from 'gulp-plugin-terser';

const pkgString = await fs.readFile('./package.json', 'utf-8');
const pkg = JSON.parse(pkgString);

const outDir = path.resolve(import.meta.dirname, 'dist');

const banner = `/*!
 * @module ${pkg.name}
 * @description ${pkg.description}
 * @version ${pkg.version}
 * @link ${pkg.repository}
 * @licence MIT License, https://opensource.org/licenses/MIT
 */
`;

const cleanOutDir = async function () {
  await fs.rm(outDir, { recursive: true, force: true });
};

const compile = async function () {
  await tsup.build({
    entry: ['./capillaries.ts'],
    format: ['esm', 'cjs'],
    outDir: 'dist',
    clean: true,
    splitting: false,
    sourcemap: true,
    dts: true,
    minify: false,
    esbuildOptions(options) {
      options.banner = {
        js: banner,
      };
    },
  });
};

const minify = function () {
  return gulp
    .src('dist/*.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(gulp.dest('dist', { sourcemaps: '.' }));
};

const preparePackageJson = async function () {
  const targetPkgPath = path.resolve(outDir, 'package.json');
  const jsonStr = await fs.readFile(targetPkgPath, 'utf-8');

  const packageJson = JSON.parse(jsonStr);

  packageJson.module = 'capillaries.js';
  packageJson.main = 'capillaries.cjs';
  packageJson.types = 'capillaries.d.ts';
  packageJson.exports = {
    '.': {
      require: {
        types: './capillaries.d.cts',
        default: './capillaries.cjs',
      },
      import: {
        types: './capillaries.d.ts',
        default: './capillaries.js',
      },
    },
  };

  delete packageJson.scripts;
  delete packageJson.devDependencies;
  delete packageJson.private;
  delete packageJson.engines;

  await fs.writeFile(targetPkgPath, JSON.stringify(packageJson, null, 2));
};

const copyFiles = function () {
  return gulp.src(['README.md', 'CHANGELOG.md', 'LICENSE', 'package.json']).pipe(gulp.dest(outDir));
};

export const build = gulp.series(cleanOutDir, compile, minify, copyFiles, preparePackageJson);

export default build;
