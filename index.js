#!/usr/bin/env node

'use strict';

const version = '0.0.1';

const commander = require('commander');

commander.version(version);

commander
  .command('init [directory]')
  .description('initialize a new OI contest')
  .action((require('./lib/create.js')).init);

commander
  .command('new <directory>')
  .option('-t, --traditional', 'traditional problem')
  .option('-i, --interactive', 'interactive problem')
  .option('-c, --communication', 'communication problem')
  .option('-s, --submitting', 'answer submitting problem')
  .description('create a new problem (traditional default)')
  .action((require('./lib/create.js')).new);

commander.parse(process.argv);
