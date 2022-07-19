const glob = require('glob');
const fs = require('fs');
const { CONIFER_CONFIG_FILE } = require('./coniferConfig');
let config;

if (fs.existsSync(CONIFER_CONFIG_FILE)) {
  config = JSON.parse(fs.readFileSync(CONIFER_CONFIG_FILE));
}

const findAllTests = async () => {
  const { testDirectory } = config;
  return glob.sync(`${testDirectory}/**/*.{cy,spec}.{js,jsx,ts,tsx}`);
};

const groupTests = (testFiles) => {
  let parallelInstances = parseInt(config.parallelInstances, 10);
  if (parallelInstances > testFiles.length) {
    parallelInstances = testFiles.length;
  }

  const testGroupings = new Array(parallelInstances).fill([]);
  testGroupings.forEach((_, index) => (testGroupings[index] = []));

  testFiles.forEach((testFile, index) => {
    testGroupings[index % parallelInstances].push(testFile);
  });
  return [testGroupings, parallelInstances];
};

module.exports = { groupTests, findAllTests };
