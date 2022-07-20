const fs = require('fs');
const CWD = process.cwd();
const CONIFER_LOCAL_DIRECTORY = CWD + '/.conifer';
const CONIFER_ENVIRONMENT_PATH = `${CONIFER_LOCAL_DIRECTORY}/.env`;
const CONIFER_CONFIG_FILE = `${CONIFER_LOCAL_DIRECTORY}/conifer-config.json`;

const parseConfig = async () => {
  return JSON.parse(fs.readFileSync(CONIFER_CONFIG_FILE));
};

module.exports = {
  CONIFER_CONFIG_FILE,
  CONIFER_LOCAL_DIRECTORY,
  CONIFER_ENVIRONMENT_PATH,
  CWD,
  parseConfig,
};
