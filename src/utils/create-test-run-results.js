const { execSync } = require('child_process');

const generateFinalReport = () => {
  execSync('npx mochawesome-merge ./coniferJSONReports/*.json -o output.json');
  execSync('marge ./coniferJSONReports/output.json');
};

module.exports = generateFinalReport;

