#!/usr/bin/env node

'use strict';

const version = '0.0.1';

const commander = require('commander');

commander.version(version);

commander
  .command('init [directory]')
  .description('Initialize a new OI contest.')
  .action((require('./lib/create.js')).init);

commander.parse(process.argv);
