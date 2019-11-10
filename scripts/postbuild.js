const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

const outDir = path.resolve(__dirname, '..', 'dist');

async function copyFile(fileName, cb) {
  const srcFile = path.resolve(__dirname, '..', fileName);
  const outFile = path.resolve(outDir, fileName);

  try {
    await fs.copyFile(srcFile, outFile);
    console.log(chalk.green('File copied:'), fileName);

    if (typeof cb === 'function') {
      cb();
    }
  } catch (err) {
    console.error(chalk.red('Unable to copy file'), fileName);
    console.error(err);
  }
}

async function preparePackageJson() {
  const packageJsonPath = path.resolve(outDir, 'package.json');

  try {
    const packageJsonString = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonString);
    packageJson.main = 'capillaries.min.js';
    packageJson.browser = 'capillaries.umd.min.js';
    packageJson.module = 'capillaries.esm.min.js';

    delete packageJson.scripts;
    delete packageJson.devDependencies;
    delete packageJson.private;

    await fs.writeFile(packageJsonPath, JSON.stringify((packageJson), null, 2), 'utf8');
    console.log(chalk.green('package.json updated'));
  } catch (err) {
    console.error(chalk.red('Error while updating package.json'));
    console.error(err);
  }
}

copyFile('README.md');
copyFile('LICENSE');
copyFile('package.json', preparePackageJson);
