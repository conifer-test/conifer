const process = require('process');
const childProcess = require('child_process');
const fs = require('fs');
const { spawn } = require('child_process');

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

const spawner = async (command, args) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', (data) => {
      resolve(data);
    });
    child.on('exit', (data) => {
      resolve(data);
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
