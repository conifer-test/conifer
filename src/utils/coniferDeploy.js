const Promisify = require('./promisify.js');
const ora = require('ora');
const spinner = ora();
const { CONIFER_LOCAL_DIRECTORY } = require('./coniferInit');
const CDK_OUTPUTS_PATH = `${CONIFER_LOCAL_DIRECTORY}/cdk_outputs.json`;

const deployAWSInfrastructure = async () => {
  spinner.start(
    'Deploying temporary resources to bootstrap your AWS deployments...'
  );
  await Promisify.spawner('cdk', ['bootstrap']);
  spinner.succeed('Bootstrapping complete\n');
  spinner.start(
    'Deploying AWS infrastructure with CDK. This could take 15 minutes or more...\n'
  );
  await Promisify.execute(
    `cdk deploy '*' --outputs-file ${CDK_OUTPUTS_PATH} --require-approval never`
  );
  spinner.succeed('AWS infrastructure successfully deployed');
};

module.exports = { deployAWSInfrastructure };
