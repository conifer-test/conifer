const { merge } = require('mochawesome-merge');
const marge = require('mochawesome-report-generator');

const generateFinalReport = () => {
  console.log('Generating Parallel Test Results...');

  const mergeOptions = {
    files: [
      './coniferJSONReports/*.json',
    ],
  }

  const reporterOptions = {
    reportFilename: "parallel-final-report",
  }

  return merge(mergeOptions).then(report => marge.create(report, reporterOptions));
}


module.exports = generateFinalReport;
