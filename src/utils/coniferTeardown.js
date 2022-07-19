const Promisify = require('./promisify');
const ora = require('ora');
const spinner = ora();

const teardown = async () => {
  spinner.start('Tearing down conifer AWS infrastructure');
  await Promisify.spawner(['cdk', ['destroy', '-f', '*']]);
  spinner.succeed('AWS infrastructure successfully torn down');
};

module.exports = teardown;
