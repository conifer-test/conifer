const { fileGlob, buildImage, pushToEcr } = require('../utils/coniferBuild');

module.exports = async () => {
  await fileGlob();
  await buildImage();
  await pushToEcr();
};
