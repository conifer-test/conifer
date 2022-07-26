const { exec } = require('child_process');
const {
  runTestsInParallel,
  addtestRunIdToConfig,
  waitForTasksToComplete,
  sendTestRunId,
} = require('../utils/coniferRun');
const { generateTestResults } = require('../commands/create-test-results');
const log = require('../utils/logger.js').logger;

module.exports = async () => {
  const dashboard = exec('start_dashboard'); // start backend express and frontend react
  dashboard.stdout.on('data', (data) => {
    console.log(`${data}`);
    (async () => await open('http://localhost:7777'))(); // TODO: Port number we want?
  });

  addtestRunIdToConfig();
  const taskArns = await runTestsInParallel();
  log('All tasks initiated...');
  sendTestRunId();
  waitForTasksToComplete(taskArns, generateTestResults);
};
