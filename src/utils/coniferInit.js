const ora = require('ora');
const Promisify = require('./promisify');
const fs = require('fs');

const spinner = ora();
const DEPLOY_REPO = 'https://github.com/conifer-test/deploy.git';
const { CONIFER_LOCAL_DIRECTORY } = require('./coniferConfig');
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

module.exports = {
  cloneDeployRepo,
  cloneFilesRepo,
  installCDK,
  createConiferLocalDirectory,
};
