const { execSync } = require('child_process');

const generateFinalReport = () => {
  execSync(
    'npx mochawesome-merge ./coniferJSONReports/*.json -o ./coniferJSONReports/output.json'
  );
  execSync(
    'npx mochawesome-report-generator marge ./coniferJSONReports/output.json'
  );
};

module.exports = generateFinalReport;
