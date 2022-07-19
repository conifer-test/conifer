const inquirer = require('inquirer');
const log = require('../utils/logger.js').logger;
const { deployAWSInfrastructure } = require('../utils/coniferDeploy');

module.exports = async () => {
  const question = [
    {
      type: 'confirm',
      name: 'confirmation',
      message: 'Please confirm you are ready to deploy',
    },
  ];

  await inquirer.prompt(question).then(async ({ confirmation }) => {
    if (confirmation) {
      log('Building image from ${directory}...');
      // TODO: Build image with dockerfile
      log('Building image complete');
      log('Deploying Conifer to AWS...');
      await deployAWSInfrastructure();
      log('Conifer deployed');
    }
  });
};
