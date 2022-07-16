const chalk = require('chalk');

const logger = (text) => console.log(`🌲 ${chalk.bold.green(text)}`);

module.exports = {
  logger,
};
