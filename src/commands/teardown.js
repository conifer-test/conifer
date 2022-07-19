const inquirer = require('inquirer');
const log = require('../utils/logger.js').logger;
const teardown = require('../utils/coniferTeardown');

module.exports = async () => {
  const question = [
    {
      type: 'confirm',
      name: 'confirmation',
      message:
        'Please confirm you want to teardown the Conifer infrastructure.',
    },
  ];
  await inquirer.prompt(question).then(async ({ confirmation }) => {
    if (confirmation) {
      teardown();
    } else {
      log('Teardown aborted');
    }
  });
};
