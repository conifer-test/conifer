const {
  fileGlob,
  timingData,
  buildImage,
  pushToEcr,
} = require('../utils/coniferBuild');
const fs = require('fs');

const { CONIFER_CONFIG_FILE } = require('../utils/coniferConfig');
let config;

if (fs.existsSync(CONIFER_CONFIG_FILE)) {
  config = JSON.parse(fs.readFileSync(CONIFER_CONFIG_FILE));
}

module.exports = async () => {
  if (config.parallelType === 'File globbing') {
    await fileGlob();
  } else {
    // TODO: Timing data
    await timingData();
  }

  // TODO: Build updated image
  await buildImage();
  // TODO: Push updated image to ECR
  await pushToEcr();
};
