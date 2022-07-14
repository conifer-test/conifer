#!/usr/bin/env node

const { program } = require('commander');
const testFile = require('../src/commands/test-file');

program
  .command('init')
  .alias('i')
  .description('Initialize files required to deploy conifer infrastructure')
  .action(testFile);

program
  .command('deploy')
  .alias('d')
  .description('Deploy conifer infrastructure in system')
  .action(testFile);

program
  .command('run')
  .alias('r')
  .description('Running cypress tests in parallel')
  .action(testFile);

program
  .command('teardown')
  .alias('td')
  .description('Taking down all Conifer infrastructure')
  .action(testFile);

program.parse(process.argv);