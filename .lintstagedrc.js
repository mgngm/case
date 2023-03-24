const path = require('path');

const buildEslintCommand = (filenames) =>
  `suppress-exit-code next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`;
const buildPrettierCommands = (filenames) => filenames.map((f) => `prettier --config .prettierrc.json --write '${f}'`);

module.exports = {
  '*.{scss,css,md}': buildPrettierCommands,
  '*.{js,jsx,ts,tsx}': (filenames) => [buildEslintCommand(filenames), ...buildPrettierCommands(filenames)],
};
