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

const listOfFiles = ['./cypress/e2e/first-test.cy.js', './cypress/e2e/second-test.cy.js'];

// For each file upload it to dynamoDB



/*

Start

Running the test for the first time
- [x] Generate Test Run ID - UUID
- [x] Save the Test run ID into a file locally

- [x] Glob the test files to be executed
  - Use Lawrence's function - returns an array of file name

- For each file in the test files
  - [x] - Create the table if first time? Else don't create it.
  - [x] Upload the data into dynamoDB
    - Primary Key - File path name(?)
    - Sort Key - Test Run ID(?)
    - Or the other way around
  - Note - to figure this part out, query the data from the database

- Once the test case is completed - we know this because of file watcher
<<<<<<< HEAD
<<<<<<< HEAD
  - Upload the json data into dynamoDB 
=======
  - Upload the data into dynamoDB 
>>>>>>> b4858bc (experiment with DynamoDB)
=======
  - Upload the json data into dynamoDB 
>>>>>>> 3b0e0cc (save dynamoDB query progress)
    - (use the test run id and sort key to find the file)
    - test run ID will come from a local file or somewhere else? 
    - test file will come from the file watcher? - the json file needs to have the same name as the spec file

- In the next run, repeat the process above,

Finish 


*/