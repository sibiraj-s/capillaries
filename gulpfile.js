const path = require('node:path');
const fs = require('node:fs/promises');

const gulp = require('gulp');
const rollup = require('rollup');
const { babel } = require('@rollup/plugin-babel');
const terser = require('gulp-plugin-terser');

const pkg = require('./package.json');

const outDir = path.resolve(__dirname, 'dist');

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
  const bundle = await rollup.rollup({
    input: './capillaries.js',
    plugins: [
      babel({ babelHelpers: 'bundled' }),
    ],
  });

  await bundle.write({
    file: 'dist/capillaries.cjs',
    format: 'cjs',
    exports: 'named',
    sourcemap: true,
    banner,
  });

  await bundle.write({
    file: 'dist/capillaries.js',
    format: 'es',
    sourcemap: true,
    banner,
  });

  await bundle.write({
    file: 'dist/capillaries.umd.js',
    format: 'umd',
    exports: 'named',
    name: 'Capillaries',
    sourcemap: true,
    banner,
  });

  await bundle.close();
};

const minify = function () {
  return gulp.src('dist/*.js', { sourcemaps: true })
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
      types: './capillaries.d.ts',
      require: './capillaries.cjs',
      import: './capillaries.js',
    },
  };

  delete packageJson.scripts;
  delete packageJson.devDependencies;
  delete packageJson.private;
  delete packageJson.engines;

  await fs.writeFile(targetPkgPath, JSON.stringify(packageJson, null, 2));
};

const copyFiles = function () {
  return gulp.src([
    'README.md',
    'CHANGELOG.md',
    'LICENSE',
    'capillaries.d.ts',
    'package.json',
  ]).pipe(gulp.dest(outDir));
};

const build = gulp.series(cleanOutDir, compile, minify, copyFiles, preparePackageJson);

exports.build = build;
exports.default = build;
