const { groupTests, findAllTests } = require('./coniferGlob');
const fs = require('fs');
const ora = require('ora');
const spinner = ora();
const log = require('./logger').logger;

const { CONIFER_CONFIG_FILE } = require('./coniferConfig');

const fileGlob = async () => {
  spinner.start('Finding tests files to glob');
  const testFiles = await findAllTests();
  const [globbedFiles, parallelInstances] = groupTests(testFiles);

  fs.readFile(CONIFER_CONFIG_FILE, (err, data) => {
    const json = JSON.parse(data);
    if (Number(json.parallelInstances) !== parallelInstances) {
      json['parallelInstances'] = parallelInstances;
    }
    log(
      `Reduced number of parallel instances to ${parallelInstances} due to amount of test files`
    );
    json['testGroupings'] = globbedFiles;
    fs.writeFileSync(CONIFER_CONFIG_FILE, JSON.stringify(json));
  });
  spinner.succeed('Completed globbing files');
};

const timingData = async () => {
  // TODO: timing data algorithm
};

const buildImage = async () => {
  // TODO: Build image
};

const pushToEcr = async () => {
  // TODO: push new image to ECR
};

module.exports = { fileGlob, timingData, buildImage, pushToEcr };
