const ora = require('ora');
const Promisify = require('./promisify');
const fs = require('fs');

const spinner = ora();
const DEPLOY_REPO = 'https://github.com/conifer-test/deploy.git';
const {
  CONIFER_LOCAL_DIRECTORY,
  CWD,
  parseConfig,
} = require('./coniferConfig');
const DEPLOY_DIRECTORY = `${CONIFER_LOCAL_DIRECTORY}/deploy`;
const CLONE_FILES_REPO =
  'https://github.com/conifer-test/file-watch-upload.git';

const cloneDeployRepo = async () => {
  process.chdir(CONIFER_LOCAL_DIRECTORY);
  spinner.start(`Cloning ${DEPLOY_REPO}`);
  await Promisify.execute(`git clone -q '${DEPLOY_REPO}' ${DEPLOY_DIRECTORY}`);
  // await Promisify.spawner('git', ['clone', DEPLOY_REPO, DEPLOY_DIRECTORY]);
  spinner.succeed(`${DEPLOY_REPO} successfully cloned`);
};

const cloneFilesRepo = async () => {
  spinner.start('Cloning files');
  await Promisify.execute(`git clone -q ${CLONE_FILES_REPO} .conifer/utils`);
  spinner.succeed('Files successfully cloned\n');
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
  const { ports, entryPoint } = await parseConfig();
  let portsStr;
  portsStr = ports.map((port) => `npx wait-on http://localhost:${port}`);
  portsStr = portsStr.join(' && ');

  const content = `
#!/bin/bash
node .conifer/utils/s3-test-result-uploader.js & ${entryPoint} & ${portsStr} && \
npx cypress run --reporter mochawesome --reporter-options \
"reportDir=cypress/results,overwrite=false,html=false,json=true" \
--config 'specPattern=$FILES_GLOB'`;

  spinner.start('Creating conifer-start.sh');
  process.chdir(CWD);
  fs.writeFileSync('./conifer-start.sh', content);
  spinner.succeed('conifer-start.sh created in project directory');
};

module.exports = {
  cloneDeployRepo,
  cloneFilesRepo,
  installCDK,
  createConiferLocalDirectory,
  createStartShell,
};
