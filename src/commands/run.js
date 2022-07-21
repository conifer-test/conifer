const { exec } = require('child_process');
const { runTestsInParallel } = require('../utils/coniferRun');
const log = require('../utils/logger.js').logger;

module.exports = async () => {
  const dashboard = exec('start_dashboard'); // start backend express and frontend react
  dashboard.stdout.on('data', (data) => {
    console.log(`${data}`);
    (async () => await open('http://localhost:7777'))(); // TODO: Port number we want?
  });

  await runTestsInParallel();
  log('All tasks initiated')
};
