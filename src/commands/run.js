const {
  runTestsInParallel,
  addtestRunIdToConfig,
  waitForTasksToComplete,
  sendTestRunId,
} = require('../utils/coniferRun');
const { startDashboard } = require('../utils/coniferDashboard');
const { generateTestResults } = require('../commands/create-test-results');
const log = require('../utils/logger.js').logger;
const updateTestGroupings = require('../utils/updateTestGroupings');

module.exports = async () => {
  // startDashboard(); // start backend express and frontend react TODO: Fix this
  addtestRunIdToConfig();
  sendTestRunId();
  const taskArns = await runTestsInParallel();
  log('All tasks initiated...');
  waitForTasksToComplete(taskArns, generateTestResults, updateTestGroupings);
};
