#!/usr/bin/env node

'use strict';

const commander = require('commander');

const create = require('./create');
const generate = require('./generate');
const clean = require('./clean');
const thanks = require('./thanks');

const { version } = require('./variables');

(function() {

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
    .command('clean')
    .description('clean off generated files')
    .action(clean.clean);
  
  if (process.argv[2] == 'thanks') {
    thanks.thanks();
    return;
  }
  
  commander.parse(process.argv);

})();
