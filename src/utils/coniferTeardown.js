const Promisify = require('./promisify');
const { CONIFER_LOCAL_DIRECTORY } = require('./coniferConfig');

const teardown = async (confirmECR) => {
  process.chdir(`${CONIFER_LOCAL_DIRECTORY}/deploy`);
  await Promisify.spawner(
    'cdk',
    ['destroy', '-f'],
    'Tearing down conifer AWS infrastructure...',
    'AWS infrastructure successfully torn down'
  );
  if (confirmECR) {
    await Promisify.execute(
      'aws ecr delete-repository --repository-name conifer-test --force'
    );
  }
};

module.exports = teardown;
