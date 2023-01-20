#!/usr/bin/env node

'use strict';

const version = '0.0.1';

const commander = require('commander');

const create = require('./lib/create');
const generate = require('./lib/generate');
const clear = require('./lib/clear');

commander.version(version);

commander
  .command('init [directory]')
  .description('initialize a new OI contest')
  .action(create.init);

commander
  .command('new <directory>')
  .option('-t, --traditional', 'traditional problem')
  .option('-i, --interactive', 'interactive problem')
  .option('-c, --communication', 'communication problem')
  .option('-s, --submitting', 'answer submitting problem')
  .description('create a new problem (traditional default)')
  .action(create.new);

commander
  .command('generate [problem]')
  .description('generate the statement')
  .action(generate.generate);

commander
  .command('clear')
  .description('clear generated files')
  .action(clear.clear);

commander.parse(process.argv);
