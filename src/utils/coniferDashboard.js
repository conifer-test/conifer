const Promisify = require('./promisify');
const { CONIFER_LOCAL_DIRECTORY } = require('./coniferConfig');
const DASHBOARD_DIRECTORY = `${CONIFER_LOCAL_DIRECTORY}/dashboard`;

const startDashboard = async () => {
  process.chdir(DASHBOARD_DIRECTORY + '/server');
  await Promisify.execute('npm run dev');
};

module.exports = {
  startDashboard,
};
