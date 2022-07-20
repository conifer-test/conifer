const Promisify = require('./promisify');
const ora = require('ora');
const spinner = ora();
const { CONIFER_LOCAL_DIRECTORY } = require('./coniferConfig');

const teardown = async () => {
  spinner.start('Tearing down conifer AWS infrastructure');
  process.chdir(`${CONIFER_LOCAL_DIRECTORY}/deploy`);
  await Promisify.spawner('cdk', ['destroy', '-f']);
  await Promisify.execute(
    'aws ecr delete-repository --repository-name conifer-test --force'
  );
  spinner.succeed('AWS infrastructure successfully torn down');
};

module.exports = teardown;
