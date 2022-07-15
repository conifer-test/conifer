const { execSync } = require('child_process');

execSync('npx mochawesome-merge ./coniferJSONReports/*.json -o output.json');
execSync('marge ./coniferJSONReports/output.json');