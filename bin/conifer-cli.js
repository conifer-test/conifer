#!/usr/bin/env node

const { program } = require('commander');
const init = require('../src/commands/init');
const build = require('../src/commands/build');
const deploy = require('../src/commands/deploy');
const run = require('../src/commands/run');
const teardown = require('../src/commands/teardown');
const createTestResults = require('../src/commands/create-test-results');

program
  .command('init')
  .alias('i')
  .description('Initialize files required to deploy conifer infrastructure')
  .action(init);

program
  .command('build')
  .alias('b')
  .description('Build the conifer image')
  .action(build);

program
  .command('deploy')
  .alias('d')
  .description('Deploy conifer infrastructure in system')
  .action(deploy);

program
  .command('run')
  .alias('r')
  .description('Running cypress tests in parallel')
  .action(run);

program
  .command('teardown')
  .alias('td')
  .description('Taking down all Conifer infrastructure')
  .action(teardown);

program
  .command('results')
  .alias('rs')
  .description('Generating the test results')
  .action(createTestResults);

program.parse(process.argv);
