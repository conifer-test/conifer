const { v4 } = require('uuid');
const fs = require('fs');

const testRunID = v4();

console.log('Your UUID is: ' + testRunID);

fs.writeFile('test-run-id.txt', testRunID, (err) => {
  if (err)
    console.log(err);
  else {
    console.log('File written successfully\n');
    console.log('The written has the following contents:');
    console.log(fs.readFileSync('test-run-id.txt', 'utf8'));
  }
});