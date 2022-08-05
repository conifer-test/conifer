const { merge } = require('mochawesome-merge');
const marge = require('mochawesome-report-generator');
const {
  parseConfig,
} = require('./coniferConfig');

const generateFinalReport = async () => {
  const { testRunId } = parseConfig();
  console.log('Generating Parallel Test Results...');

  const mergeOptions = {
    files: [`./coniferJSONReports/${testRunId}/results/*.json`],
  };

  const reporterOptions = {
    reportFilename: 'parallel-final-report',
  };

  return merge(mergeOptions).then((report) =>
    marge.create(report, reporterOptions)
  );
};

module.exports = generateFinalReport;
