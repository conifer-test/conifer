const Promisify = require('./promisify.js');
const { CONIFER_LOCAL_DIRECTORY } = require('./coniferConfig');
const CDK_OUTPUTS_PATH = `${CONIFER_LOCAL_DIRECTORY}/cdk_outputs.json`;

const deployAWSInfrastructure = async () => {
  process.chdir(CONIFER_LOCAL_DIRECTORY + '/deploy');
  await Promisify.spawner(
    'cdk',
    ['bootstrap'],
    'Deploying temporary resources to bootstrap your AWS deployments...',
    'Bootstrapping complete'
  );

  await Promisify.spawner(
    'cdk',
    [
      'deploy',
      '*',
      '--outputs-file',
      CDK_OUTPUTS_PATH,
      '--require-approval',
      'never',
    ],
    'Deploying AWS infrastructure with CDK. This could take 15 minutes or more...',
    'AWS infrastructure successfully deployed'
  );
};

module.exports = { deployAWSInfrastructure };
