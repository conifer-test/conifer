const { groupTests, findAllTests } = require('./coniferGlob');
const fs = require('fs');
const ora = require('ora');
const spinner = ora();
const Promisify = require('./promisify');
const {
  ECRClient,
  DescribeRepositoriesCommand,
  CreateRepositoryCommand,
  SetRepositoryPolicyCommand,
} = require('@aws-sdk/client-ecr');

const { CONIFER_CONFIG_FILE } = require('./coniferConfig');
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

// TODO: Test following code
const minElem = (lst) => {
  return lst.indexOf(Math.min(...lst));
};

const timingData = async (filesObj, parallelInstances) => {
  const fileAllocations = new Array(parallelInstances).fill().map(Object);
  const totals = new Array(parallelInstances).fill(0);

  const filesList = Object.entries(filesObj).sort((a, b) => b[1] - a[1]);
  for (const file of filesList) {
    const currMinIndex = minElem(totals);
    fileAllocations[currMinIndex][file[0]] = file[1];
    totals[currMinIndex] += file[1];
  }

  return fileAllocations;
};

const buildImage = async () => {
  await createDockerfile();
  spinner.start('Building docker image...');
  // await Promisify.execute(
  //   'docker build -t conifer-test:latest . --platform linux/amd64'
  // );
  await Promisify.spawner('docker', [
    'build',
    '-t',
    'conifer-test:latest',
    '.',
    '-f',
    'Dockerfile.conifer',
    '--platform',
    'linux/amd64',
  ]);
  spinner.succeed('Docker image built');
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
  const region = 'us-west-1';
  const client = new ECRClient({ region }); // TODO: Fix region
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

  spinner.start('Pushing image to your private AWS ECR...\n');
  const image = `${repo.repositoryUri}:latest`;
  // Send image to config file
  fs.readFile(CONIFER_CONFIG_FILE, (err, data) => {
    const json = JSON.parse(data);
    json['imageUri'] = image;

    fs.writeFileSync(CONIFER_CONFIG_FILE, JSON.stringify(json));
  });

  await Promisify.execute(`docker tag conifer-test:latest ${image}`);
  // await Promisify.execute(`docker push ${image}`);
  await Promisify.spawner('docker', ['push', image]);
  spinner.succeed('Image pushed to ECR');
};

module.exports = {
  fileGlob,
  timingData,
  buildImage,
  pushToEcr,
};
