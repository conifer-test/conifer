const { execSync } = require('child_process');

const generateFinalReport = () => {
  console.log('Generating Parallel Test Results...');
  execSync('npx mochawesome-merge ./coniferJSONReports/*.json -o ./coniferJSONReports/output.json');
  execSync('npx mochawesome-report-generator marge ./coniferJSONReports/output.json');
};

module.exports = generateFinalReport;

