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
    await timingData();
  }
  await buildImage();
  await pushToEcr();
};
