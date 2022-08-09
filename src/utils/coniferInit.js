const ora = require('ora');
const Promisify = require('./promisify');
const fs = require('fs');

const spinner = ora({
  color: 'green',
});
const DEPLOY_REPO = 'https://github.com/conifer-test/deploy.git';
const {
  CONIFER_LOCAL_DIRECTORY,
  CWD,
  parseConfig,
} = require('./coniferConfig');
const DEPLOY_DIRECTORY = `${CONIFER_LOCAL_DIRECTORY}/deploy`;
const DASHBOARD_DIRECTORY = `${CONIFER_LOCAL_DIRECTORY}/dashboard`;
const CLONE_FILES_REPO =
  'https://github.com/conifer-test/file-watch-upload.git';
const CLONE_DASHBOARD_REPO =
  'https://github.com/conifer-test/conifer-dashboard.git';

const cloneDeployRepo = async () => {
  process.chdir(CONIFER_LOCAL_DIRECTORY);
  spinner.start(`Cloning ${DEPLOY_REPO}...`);
  await Promisify.execute(`git clone -q '${DEPLOY_REPO}' ${DEPLOY_DIRECTORY}`);
  spinner.succeed('Deployment files successfully cloned');
};

const cloneFilesRepo = async () => {
  spinner.start('Cloning watch files...');
  await Promisify.execute(`git clone -q ${CLONE_FILES_REPO} .conifer/utils`);
  spinner.succeed('Watch files successfully cloned');
};

const cloneDashboardRepo = async () => {
  spinner.start('Cloning dashboard...');
  await Promisify.execute(`git clone -q ${CLONE_DASHBOARD_REPO} dashboard`);
  spinner.succeed('Dashboard successfully cloned\n');
};

const installDashboardRepo = async () => {
  spinner.start('Installing dashboard packages...');
  process.chdir(`${DASHBOARD_DIRECTORY}/server`);
  await Promisify.execute('npm install');
  process.chdir(`${DASHBOARD_DIRECTORY}/client`);
  await Promisify.execute('npm install');
  spinner.succeed('Dashboard packages successfully installed');
};

const installCDK = async () => {
  process.chdir(DEPLOY_DIRECTORY);
  spinner.start('Installing aws-cdk...');
  await Promisify.execute('npm install -g aws-cdk');
  spinner.succeed('aws-cdk successfully installed');
  spinner.start('Installing deployment dependencies...');
  await Promisify.execute('npm install');
  spinner.succeed('Deployment dependencies successfully installed');
};

const createConiferLocalDirectory = async () => {
  spinner.start();
  if (!fs.existsSync(CONIFER_LOCAL_DIRECTORY)) {
    fs.mkdirSync(CONIFER_LOCAL_DIRECTORY);
    fs.mkdirSync(DEPLOY_DIRECTORY);
    spinner.succeed('Conifer local directory created\n');
  } else {
    spinner.fail('This project already contains conifer\n');
  }
};

const createStartShell = async () => {
  const { ports, entryPoint } = parseConfig();
  let portsStr;
  portsStr = ports.map((port) => `npx wait-on http://localhost:${port}`);
  portsStr = portsStr.join(' && ');

  const content = `#!/bin/bash

node .conifer/utils/observer.js & ${entryPoint} & ${portsStr} && \
npx cypress run --reporter mochawesome --reporter-options \
'reportDir=cypress/results,overwrite=false,reportFilename="[name]",html=false,json=true' \
--config 'specPattern=$FILES_GLOB' && sleep 5`;

  console.log();
  spinner.start('Creating conifer-start.sh...');
  process.chdir(CWD);
  fs.writeFileSync('./conifer-start.sh', content);
  spinner.succeed('conifer-start.sh created in project directory');
};

module.exports = {
  cloneDeployRepo,
  cloneFilesRepo,
  cloneDashboardRepo,
  installDashboardRepo,
  installCDK,
  createConiferLocalDirectory,
  createStartShell,
};
