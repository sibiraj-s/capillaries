const path = require('path');
const fs = require('fs');

const gulp = require('gulp');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const terser = require('gulp-plugin-terser');
const sourcemap = require('gulp-sourcemaps');
const through2 = require('through2');

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

async function minify() {
  gulp.src('dist/*.js')
    .pipe(sourcemap.init())
    .pipe(terser())
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('dist'));
}

function updatePackageJSON() {
  const transform = through2.obj((file, _, callback) => {
    const modifiedFile = file.clone();
    const packageJson = JSON.parse(file.contents.toString());

    packageJson.main = 'capillaries.js';
    packageJson.module = 'capillaries.esm.js';
    packageJson.browser = 'capillaries.umd.min.js';
    packageJson.types = 'capillaries.d.ts';

    delete packageJson.scripts;
    delete packageJson.devDependencies;
    delete packageJson.private;

    modifiedFile.contents = Buffer.from(JSON.stringify((packageJson), null, 2));
    callback(null, modifiedFile);
  });

  return transform;
}

async function copyFiles() {
  gulp.src('README.md').pipe(gulp.dest(outDir));
  gulp.src('CHANGELOG.md').pipe(gulp.dest(outDir));
  gulp.src('package.json')
    .pipe(updatePackageJSON())
    .pipe(gulp.dest(outDir));
}

const tasks = [
  cleanOutDir,
  compile,
  minify,
  copyFiles
];

const build = gulp.series(...tasks);

exports.build = build;
exports.default = build;
