const process = require('process');
const childProcess = require('child_process');
const fs = require('fs');
const { spawn } = require('child_process');
const ora = require('ora');
const chalk = require('chalk');

const changeDir = async (directory) => {
  return new Promise((resolve, reject) => {
    process.chdir(directory);
    resolve();
  });
};

const execute = async (command) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, contents) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(contents);
    });
  });
};

const spawner = async (command, args, start, end) => {
  const spinner = ora();
  spinner.start(chalk.green(start));
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    spinner.stopAndPersist({
      text: chalk.green(start),
      symbol: chalk.bold.green('❯'),
    });
    child.on('close', (data) => {
      resolve(data);
    });
    child.on('exit', (data) => {
      resolve(data);
      spinner.succeed(chalk.green(end));
    });
  });
};

const getFiles = async () => {
  return new Promise((resolve, reject) => {
    const files = fs.readdirSync('.');
    resolve(files);
  });
};

module.exports = { changeDir, execute, spawner, getFiles };
