const inquirer = require('inquirer');
const log = require('../utils/logger.js').logger;

module.exports = async () => {
  const question = [
    {
      type: 'confirm',
      name: 'confirmation',
      message: 'Please confirm you are ready to deploy.',
    },
  ];

  await inquirer.prompt(question).then(async ({ confirmation }) => {
    if (confirmation) {
      log('Building image from ${directory}...');
      // TODO: Build image with dockerfile
      log('Deploying Conifer to AWS...');
      // TODO: Deploy CDK here
      log('Conifer deployed!');
    }
  });
};
