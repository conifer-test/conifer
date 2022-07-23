const getItemsByTestFileName = require('./getItemsByTestFileName');

async function getTestRunIDList(anyFileName) {
  const testRunsForFile = await getItemsByTestFileName(anyFileName);
  const testRunArr = Array.from(new Set(testRunsForFile.map(testRun => testRun.testRunID)));
  console.log(testRunArr);
  return testRunArr;
}

// getTestRunIDList('./cypress/e2e/second-test.cy.js');

module.exports = getTestRunIDList;