const glob = require('glob');
const fs = require('fs');
const { CONIFER_LOCAL_DIRECTORY } = require('./coniferConfig');
const config = JSON.parse(
  fs.readFileSync(CONIFER_LOCAL_DIRECTORY + '/conifer-config.json')
);

const findAllTests = async () => {
  const { testDirectory } = config;
  return glob.sync(`${testDirectory}/**/*.{cy,spec}.{js,jsx,ts,tsx}`);
};

const groupTests = (testFiles) => {
  const { parallelInstances } = config;
  const testGroupings = new Array(parseInt(parallelInstances, 10)).fill([]);
  testGroupings.forEach((_, index) => (testGroupings[index] = []));

  testFiles.forEach((testFile, index) => {
    testGroupings[index % parallelInstances].push(testFile);
  });
  return testGroupings;
};

module.exports = { groupTests, findAllTests };
