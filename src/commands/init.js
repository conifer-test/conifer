const inquirer = require('inquirer');
const log = require('../utils/logger.js').logger;
const { writeFileSync } = require('fs');

const configFile = 'conifer-config.json';

const awsQuestions = [
  {
    type: 'password',
    name: 'AWS_ACCESS_KEY',
    message: 'AWS Access Key:',
  },
  {
    type: 'password',
    name: 'AWS_SECRET',
    message: 'AWS Secret:',
  },
  {
    type: 'input',
    name: 'AWS_REGION',
    message: 'AWS Region:',
  },
];

const getAwsCred = async () => {
  log('Please provide the following AWS credentials:');
  await inquirer.prompt(awsQuestions).then(async (answers) => {
    // TODO: Write to .env
    console.log(answers);
  });
};

const initQuestions = [
  {
    type: 'input',
    name: 'directory',
    message: 'What is your project directory:',
  },
  {
    type: 'input',
    name: 'entryPoint',
    message: 'What is your entry point command (e.g., npm start):',
  },
  {
    type: 'input',
    name: 'parallelInstances',
    message: 'How many parallel instances do you want to provision:',
  },
  {
    type: 'list',
    name: 'parallelType',
    message: 'How would you like to parallelize the tests:',
    choices: ['File globbing', 'Timing data'],
  },
];

const gatherInfo = async () => {
  log('Please provide the following information:');
  await inquirer.prompt(initQuestions).then(async (answers) => {
    writeFileSync(configFile, JSON.stringify(answers));
  });
};

module.exports = async () => {
  // TODO: Create conifer ASCII
  await getAwsCred();
  await gatherInfo();
};
