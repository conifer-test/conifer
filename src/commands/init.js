const inquirer = require('inquirer');
const { writeFileSync } = require('fs');
const log = require('../utils/logger.js').logger;
const confierAscii = require('../utils/confierAscii');
const {
  cloneDeployRepo,
  installCDK,
  createConiferLocalDirectory,
} = require('../utils/coniferInit');
const ora = require('ora');
const spinner = ora();
const {
  CONIFER_ENVIRONMENT_PATH,
  CONIFER_CONFIG_FILE,
} = require('../utils/coniferConfig');

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
    let envStr = '';
    for (const [key, value] of Object.entries(answers)) {
      envStr += key + '=' + value + '\n';
    }
    spinner.start();
    writeFileSync(CONIFER_ENVIRONMENT_PATH, envStr);
    spinner.succeed('Credentials saved to confier environment\n');
  });
};

const initQuestions = [
  {
    type: 'input',
    name: 'testDirectory',
    message:
      'What folder is your test files located relative to your project folder:',
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
  const pwd = await inquirer.prompt({
    type: 'confirm',
    name: 'projectDirectory',
    message: 'Confirm your current working directory is your project folder:',
  });
  if (!pwd.projectDirectory) {
    log('Please go to the correct working directory then reinitialize');
    process.exit();
  } else {
    await inquirer.prompt(initQuestions).then(async (answers) => {
      writeFileSync(CONIFER_CONFIG_FILE, JSON.stringify(answers));
    });
  }
};

const newInit = async () => {
  await createConiferLocalDirectory();
  await getAwsCred();
  await gatherInfo();
  await cloneDeployRepo();
  await installCDK();
};

module.exports = async () => {
  await confierAscii();
  await newInit();
};
