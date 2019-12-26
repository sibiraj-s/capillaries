const path = require('path');
const fs = require('fs');

const gulp = require('gulp');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const terser = require('gulp-plugin-terser');
const sourcemap = require('gulp-sourcemaps');

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

async function cleanOutDir() {
  await fs.promises.rmdir(outDir, { recursive: true });
}

async function compile() {
  const bundle = await rollup.rollup({
    input: './capillaries.js',
    plugins: [
      babel()
    ]
  });

  await bundle.write({
    file: 'dist/capillaries.js',
    format: 'cjs',
    sourcemap: true,
    banner
  });

  await bundle.write({
    file: 'dist/capillaries.esm.js',
    format: 'es',
    sourcemap: true,
    banner
  });

  await bundle.write({
    file: 'dist/capillaries.umd.js',
    format: 'umd',
    name: 'Capillaries',
    sourcemap: true,
    banner
  });
}

function minify() {
  return gulp.src('dist/*.js')
    .pipe(sourcemap.init())
    .pipe(terser())
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('dist'));
}

async function preparePackageJson() {
  const targetPkgPath = path.resolve(outDir, 'package.json');
  const jsonStr = await fs.promises.readFile(targetPkgPath, 'utf-8');

  const packageJson = JSON.parse(jsonStr);

  packageJson.main = 'capillaries.js';
  packageJson.module = 'capillaries.esm.js';
  packageJson.browser = 'capillaries.umd.min.js';
  packageJson.types = 'capillaries.d.ts';

  delete packageJson.scripts;
  delete packageJson.devDependencies;
  delete packageJson.private;

  await fs.promises.writeFile(targetPkgPath, JSON.stringify(packageJson, null, 2));
}

function copyFiles() {
  return gulp.src([
    'README.md',
    'CHANGELOG.md',
    'LICENSE',
    'capillaries.d.ts',
    'package.json'
  ]).pipe(gulp.dest(outDir));
}

const build = gulp.series(cleanOutDir, compile, minify, copyFiles, preparePackageJson);

exports.build = build;
exports.default = build;
