const { groupTests, findAllTests } = require('./coniferGlob');
const fs = require('fs');
const ora = require('ora');
const spinner = ora({
  color: 'green',
});
const Promisify = require('./promisify');
const {
  ECRClient,
  DescribeRepositoriesCommand,
  CreateRepositoryCommand,
  SetRepositoryPolicyCommand,
} = require('@aws-sdk/client-ecr');

const { CONIFER_CONFIG_FILE, parseConfig } = require('./coniferConfig');
const { createDockerfile } = require('./coniferDockerfile');

const fileGlob = async () => {
  spinner.start('Finding tests files to glob');
  const testFiles = await findAllTests();
  const [globbedFiles, parallelInstances] = groupTests(testFiles);

  fs.readFile(CONIFER_CONFIG_FILE, (err, data) => {
    const json = JSON.parse(data);
    if (Number(json.parallelInstances) !== parallelInstances) {
      spinner.warn(
        `Reduced number of parallel instances to ${parallelInstances} due to amount of test files`
      );
      json['parallelInstances'] = parallelInstances;
    }
    json['testGroupings'] = globbedFiles;
    fs.writeFileSync(CONIFER_CONFIG_FILE, JSON.stringify(json));
  });
  spinner.succeed('Completed globbing files');
};

const minElem = (lst) => {
  return lst.indexOf(Math.min(...lst));
};

const timingData = async (filesObj, parallelInstances) => {
  // const fileAllocations = new Array(parallelInstances).fill().map(Object);
  const fileAllocations = new Array(parallelInstances).fill().map(Array);
  const totals = new Array(parallelInstances).fill(0);

  const filesList = Object.entries(filesObj).sort((a, b) => b[1] - a[1]);
  for (const file of filesList) {
    const currMinIndex = minElem(totals);
    fileAllocations[currMinIndex].push(file[0]);
    // fileAllocations[currMinIndex][file[0]] = file[1];
    totals[currMinIndex] += file[1];
  }

  return fileAllocations;
};

const allocateTestsFromObjects = (objects, parallelInstances) => {
  //given list of objects with a given testRunID, returns the test alocations for
  const newObj = {};
  objects.forEach((obj) => (newObj[obj.testFileName] = obj.stats.duration));
  // console.log('newObj: ', newObj);
  return timingData(newObj, parallelInstances);
};

const buildImage = async () => {
  await createDockerfile();
  await Promisify.spawner(
    'docker',
    [
      'build',
      '-t',
      'conifer-test:latest',
      '.',
      '-f',
      'Dockerfile.conifer',
      '--platform',
      'linux/amd64',
    ],
    'Building docker image...',
    'Docker image built'
  );
};

const ecrPolicy = JSON.stringify({
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'AllowAccess',
      Effect: 'Allow',
      Principal: {
        AWS: '*',
      },
      Action: 'ecr:*',
    },
  ],
});

const pushToEcr = async () => {
  const { awsRegion: region } = parseConfig();
  const client = new ECRClient({ region });
  let repo;

  const describeRegistry = new DescribeRepositoriesCommand({
    repositoryNames: ['conifer-test'],
  });

  spinner.start('Creating AWS private repository...');
  try {
    repo = await client.send(describeRegistry);
    repo = repo.repositories.find((r) => r.repositoryName === 'conifer-test');
  } catch (error) {
    const createRegistry = new CreateRepositoryCommand({
      repositoryName: 'conifer-test',
    });
    repo = await client.send(createRegistry);
    repo = repo.repository;

    const createEcrPolicy = new SetRepositoryPolicyCommand({
      policyText: ecrPolicy,
      repositoryName: 'conifer-test',
    });
    await client.send(createEcrPolicy);
  }
  spinner.succeed('Repository created');

  await Promisify.execute(
    `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${repo.repositoryUri}`
  );

  const image = `${repo.repositoryUri}:latest`;

  fs.readFile(CONIFER_CONFIG_FILE, (err, data) => {
    const json = JSON.parse(data);
    json['imageUri'] = image;

    fs.writeFileSync(CONIFER_CONFIG_FILE, JSON.stringify(json));
  });

  await Promisify.execute(`docker tag conifer-test:latest ${image}`);
  await Promisify.spawner(
    'docker',
    ['push', image],
    'Pushing image to your private AWS ECR...',
    'Image pushed to AWS ECR'
  );
};

module.exports = {
  fileGlob,
  timingData,
  buildImage,
  pushToEcr,
  allocateTestsFromObjects,
};
