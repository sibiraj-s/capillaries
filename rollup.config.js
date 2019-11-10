import babel from 'rollup-plugin-babel';

import pkg from './package.json';

const srcFile = './index.js';

const banner = `/*!
 * @module ${pkg.name}
 * @description ${pkg.description}
 * @version ${pkg.version}
 * @link ${pkg.repository}
 * @licence MIT License, https://opensource.org/licenses/MIT
 */
`;

const cjsOutputConfig = {
  file: 'dist/capillaries.js',
  format: 'cjs',
  banner,
  sourcemap: true
};

const esmOutputConfig = {
  file: 'dist/capillaries.esm.js',
  format: 'es',
  banner,
  sourcemap: true
};

const umdOutputConfig = {
  file: 'dist/capillaries.umd.js',
  format: 'umd',
  name: 'Capillaries',
  banner,
  sourcemap: true
};

const plugins = [
  babel()
];

export default [{
  input: srcFile,
  output: cjsOutputConfig,
  plugins
},
{
  input: srcFile,
  output: esmOutputConfig,
  plugins
},
{
  input: srcFile,
  output: umdOutputConfig,
  plugins
}];
