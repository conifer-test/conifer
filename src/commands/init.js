const inquirer = require('inquirer');
const { writeFileSync } = require('fs');
const log = require('../utils/logger.js').logger;
const coniferAscii = require('../utils/coniferAscii');
const { v4 } = require('uuid');
const {
  cloneDeployRepo,
  cloneFilesRepo,
  installCDK,
  installDashboardRepo,
  createConiferLocalDirectory,
  createStartShell,
  cloneDashboardRepo,
} = require('../utils/coniferInit');
const path = require('path');
const CWD = process.cwd();
const { CONIFER_CONFIG_FILE } = require('../utils/coniferConfig');

const initQuestions = [
  {
    type: 'input',
    name: 'awsRegion',
    message: 'What is your AWS Region: (e.g., us-west-1)',
  },
  {
    type: 'input',
    name: 'testDirectory',
    message:
      'What parent folder is your test files located relative to your project folder: (e.g., ./cypress)',
  },
  {
    type: 'list',
    name: 'packageManager',
    message: 'What is your package manager:',
    choices: ['npm', 'yarn', 'pnpm'],
  },
  {
    type: 'input',
    name: 'entryPoint',
    message: 'What is your entry point command (e.g., npm start):',
  },
  {
    type: 'input',
    name: 'ports',
    message: 'What port(s) are exposed: (e.g., `3000, 3001`)',
  },
  {
    type: 'input',
    name: 'parallelInstances',
    message: 'How many parallel instances do you want to provision:',
  },
  {
    type: 'list',
    name: 'ec2InstanceType',
    message: 'What type of EC2 instance do you want to provision:',
    choices: [
      { name: 't3.xlarge - 4 vCPU & 16 GiB', value: 't3.xlarge' },
      { name: 't3.2xlarge - 8 vCPU & 32 GiB', value: 't3.2xlarge' },
      { name: 'c6i.2xlarge - 8 vCPU & 16 GiB', value: 'c6i.2xlarge' },
      { name: 'c6i.4xlarge - 16 vCPU & 32 GiB', value: 'c6i.4xlarge' },
      { name: 'c6i.8xlarge - 32 vCPU & 64 GiB', value: 'c6i.8xlarge' },
      { name: 'c6i.12xlarge - 48 vCPU & 96 GiB', value: 'c6i.12xlarge' },
    ],
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
      const transformAns = {
        ...answers,
        testDirectory: path.join(CWD, answers.testDirectory),
        ports: answers.ports.split(/[, ]+/),
        bucketName: `conifer-test-bucket-${v4()}`,
      };
      writeFileSync(CONIFER_CONFIG_FILE, JSON.stringify(transformAns));
    });
  }
};

const newInit = async () => {
  await createConiferLocalDirectory();
  await gatherInfo();
  await createStartShell();
  await cloneFilesRepo();
  await cloneDeployRepo();
  await cloneDashboardRepo();
  await installDashboardRepo();
  await installCDK();
};

module.exports = async () => {
  await coniferAscii();
  await newInit();
};
