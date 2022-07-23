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
    {
      type: 'confirm',
      name: 'confirmECR',
      message:
        'Do you also want to teardown ECR? You will need to reupload your image',
    },
  ];

  await inquirer.prompt(question).then(async ({ confirmation, confirmECR }) => {
    if (confirmation) {
      if (confirmECR) {
        teardown(true);
      } else {
        teardown(false);
      }
    } else {
      log('Teardown aborted');
    }
  });
};
