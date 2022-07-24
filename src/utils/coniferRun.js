const Promisify = require('./promisify');
const ora = require('ora');
const fs = require('fs');
const { v4 } = require('uuid');

const {
  CONIFER_LOCAL_DIRECTORY,
  parseConfig,
  CONIFER_CONFIG_FILE,
} = require('./coniferConfig');
const CDK_OUTPUTS_PATH = `${CONIFER_LOCAL_DIRECTORY}/cdk_outputs.json`;

const {
  ECSClient,
  DescribeTasksCommand,
  RunTaskCommand,
} = require('@aws-sdk/client-ecs');

const spinner = ora();
// Trigger running of the tasks
/*
Need the following:
1. AWS Region
2. Cluster arn
3. Task names


High level flow of runTestsInParallel command

# Before test runs - Handling the live streaming feature
- Grab all the test files that are going to be executed - file globbing
- Update the files data into dynamoDB with a status of pending / to be executed - need a function that calls PutItem DynamoDB
  - Both primary key, testFileName and sort key, testRunID are needed
    - The test run ID can be generated using utils/generate-test-run-ID file
  - Optional nice to have - to contain the information of which container the test file is on 

# During actual parallel test
- Get the information needed to define the tasks - to run them
- Run the tasks
  - While running, the file watcher is uploading json data to both S3 and dynamoDB 

# Post running parallel test
- Note: We need some way to know that the parallel test is done running 
- Generate test report - the code for this is writte, but we need to tweak some of the hard coded values.
- Pull timing historical data for next test run?
  - the time duration data is generated by mochawesome json report, therefore no updates need to be done to the dynamoDB at this point
*/

// {
//   "containerOverrides": [
//     {
//       "name": "string",
//       "command": ["string", ...],
//       "environment": [
//         {
//           "name": "string",
//           "value": "string"
//         }
//         ...
//       ]
//     }
//     ...
//   ],
//   "taskRoleArn": "string"
// }
// const testRunId = JSON.stringify(createTestRunId());
// const testRunId = createTestRunId();

const testRunId = v4();

const addtestRunIdToConfig = () => {
  fs.readFile(CONIFER_CONFIG_FILE, (err, data) => {
    const json = JSON.parse(data);
    json['testRunId'] = testRunId;
    fs.writeFileSync(CONIFER_CONFIG_FILE, JSON.stringify(json));
  });
};

const runAllTasks = async (taskCommands, client) => {
  const runningTasks = taskCommands.map((taskCommand) => {
    return client.send(taskCommand).then((result) => result);
  });

  return await Promise.all(runningTasks).then((results) => {
    console.log('all tasks launched');
    return results.map((result) => result.tasks[0].taskArn); // Make this better
  });
};

const runTestsInParallel = async () => {
  const { awsRegion: region } = await parseConfig();
  console.log("This is the line you're looking for", region);
  const cdkOutputs = JSON.parse(fs.readFileSync(CDK_OUTPUTS_PATH));

  const client = new ECSClient({ region }); // dynamically populate the region
  const cluster = cdkOutputs.ConiferCdkStack.clusterArn;
  const taskArns = JSON.parse(cdkOutputs.ConiferCdkStack.taskDefinitionArns);
  const taskCommands = taskArns.map((taskArn, index) => {
    const taskParams = {
      taskDefinition: taskArn,
      cluster,
      overrides: {
        containerOverrides: [
          {
            name: `conifer-container-${index}`,
            environment: [
              {
                name: 'TEST_RUN_ID',
                value: testRunId,
              },
            ],
          },
        ],
      },
    };

    return new RunTaskCommand(taskParams, client);
  });

  const taskRunArns = await runAllTasks(taskCommands, client);
  console.log(taskRunArns);
  return taskRunArns;
};

const areTasksRunning = async (taskArns) => {
  const { awsRegion: region } = await parseConfig();
  const cdkOutputs = JSON.parse(fs.readFileSync(CDK_OUTPUTS_PATH));
  const client = new ECSClient({ region });

  const cluster = cdkOutputs.ConiferCdkStack.clusterArn;

  const params = {
    cluster,
    tasks: taskArns,
  };

  const command = new DescribeTasksCommand(params);
  const response = await client.send(command);

  return response.tasks.every((task) => {
    return task.lastStatus === 'STOPPED';
  });
};

const waitForTasksToComplete = async (taskArns, ...args) => {
  spinner.start('Waiting for tests to finish executing...');
  const intervalId = setInterval(async () => {
    const tasksComplete = await areTasksRunning(taskArns);

    if (tasksComplete) {
      clearInterval(intervalId);
      args.forEach((arg) => arg());
      spinner.succeed('All tests have finished executing!');
    }
  }, 5000);
};

module.exports = {
  runTestsInParallel,
  addtestRunIdToConfig,
  areTasksRunning,
  waitForTasksToComplete,
};
