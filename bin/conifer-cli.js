#!/usr/bin/env node

const { program } = require('commander');

const testFile = require('../src/commands/test-file');
const help = require('../src/commands/help');

program
  .command("test-file")
  .alias("tf")
  .description("test creating a CLI command")
  .action(testFile);

program.parse(process.argv);