const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

async function prebuild() {
  const outputDir = path.resolve(__dirname, '..', 'dist');

  try {
    await fs.rmdir(outputDir, { recursive: true });
    console.log(chalk.green('Deleted output directory'));
  } catch (err) {
    console.error(chalk.red('Error while removing output dir'));
    console.error(err);
  }
}

prebuild();
