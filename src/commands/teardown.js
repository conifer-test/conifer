const inquirer = require('inquirer');
const log = require('../utils/logger.js').logger;
const { execSync } = require('child_process');

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
      log('Tearing down Conifer from AWS...');
      execSync('cdk destroy conifer');
      log('Conifer torn down!');
    }
  });
};
