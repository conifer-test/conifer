const { groupTests, findAllTests } = require('../utils/coniferGlob');
const fs = require('fs');
const ora = require('ora');
const spinner = ora();

const { CONIFER_CONFIG_FILE } = require('../utils/coniferConfig');

module.exports = async () => {
  // Find tests to glob
  spinner.start('Finding tests files to glob');
  const testFiles = await findAllTests();
  const globbedFiles = groupTests(testFiles);
  fs.readFile(CONIFER_CONFIG_FILE, (err, data) => {
    const json = JSON.parse(data);
    json['testGroupings'] = globbedFiles;
    fs.writeFileSync(CONIFER_CONFIG_FILE, JSON.stringify(json));
  });
  spinner.succeed('Completed globbing files');
  // TODO: Build updated image

  // TODO: Push updated image to ECR
};
