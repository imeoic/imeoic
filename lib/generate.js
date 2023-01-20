'use_strict';

const path = require('path');
const fs = require('fs');
const util = require('util');
const yamljs = require('yamljs');

const clear = require('./clear');

module.exports = {
  generate: function (problem) {
    clear.clear();
    fs.mkdirSync('output');
    if (!problem) {
    }
    else {
      generate_problem(problem);
    }
  }
};

function generate_problem(problem) {
  var config = {
    contest: yamljs.load('_config.yml'),
    problem: yamljs.load(path.join('problems', problem, '_config.yml'))
  };
  var language = yamljs.load(path.join(__dirname, 'languages', (config.problem.language ? config.problem.language : config.contest.language) + '.yml'));
  var statement = fs.readFileSync(path.join('problems', problem, 'statement', '_statement.md')).toString();
  statement = ''
    + '<center><h2>' + util.format(language.statement.title, config.problem.title, config.problem.file) + '</h2></center>\n'
    + (config.problem.author ? '<center><h4>' + config.problem.author + '</h3></center>\n' : '')
    + statement
      .replace(/\r?\n?<!--begbackground-->\r?\n?\r?\n?([\s\S]*?)\r?\n?\r?\n?<!--endbackground-->\r?\n?/g, '\n#### ' + language.statement.background + '\n\n$1\n')
      .replace(/\r?\n?<!--begdescription-->\r?\n?\r?\n?([\s\S]*?)\r?\n?\r?\n?<!--enddescription-->\r?\n?/g, '\n#### ' + language.statement.description + '\n\n$1\n')
      .replace(/\r?\n?<!--beginputformat-->\r?\n?\r?\n?([\s\S]*?)\r?\n?\r?\n?<!--endinputformat-->\r?\n?/g, '\n#### ' + language.statement.input_format + '\n\n' + (config.problem.file_io ? util.format(language.particular.fin_notice, '$\\boldsymbol{' + config.problem.file + '.in}$') : '') + '\n\n$1\n')
      .replace(/\r?\n?<!--begoutputformat-->\r?\n?\r?\n?([\s\S]*?)\r?\n?\r?\n?<!--endoutputformat-->\r?\n?/g, '\n#### ' + language.statement.output_format + '\n\n' + (config.problem.file_io ? util.format(language.particular.fout_notice, '$\\boldsymbol{' + config.problem.file + '.out}$') : '') + '\n\n$1\n')
      .replace(/\r?\n?<!--samples-->\r?\n?/g, samples(problem, config, language))
      .replace(/\r?\n?<!--begconvention-->\r?\n?\r?\n?([\s\S]*?)\r?\n?\r?\n?<!--endconvention-->\r?\n?/g, '\n#### ' + language.statement.convention + '\n\n$1\n')
      .replace(/\r?\n?<!--beghint-->\r?\n?\r?\n?([\s\S]*?)\r?\n?\r?\n?<!--endhint-->\r?\n?/g, '\n#### ' + language.statement.hint + '\n\n$1\n');
  fs.writeFileSync(path.join('output', problem + '.md'), statement);
  console.log('Succeeded to generate (' + path.join('output', problem + '.md') + ').');
}

function samples(problem, config, language) {
  var res = '';
  for (var i = 1; i < config.problem.samples.quantity; ++i) {
    if (config.problem.samples.displayed.indexOf(i) != -1) {
      res = res
        + '\n#### ' + util.format(language.statement.sample_input, i) + '\n'
        + '\n```\n' + fs.readFileSync(path.join('problems', problem, 'samples', config.problem.file + i + '.in')).toString() + '\n```\n'
        + '\n#### ' + util.format(language.statement.sample_output, i) + '\n'
        + '\n```\n' + fs.readFileSync(path.join('problems', problem, 'samples', config.problem.file + i + '.ans')).toString() + '\n```\n'
      if (fs.existsSync(path.join('problems', problem, 'samples', config.problem.file + i + '.md'))) {
        res = res
          + '\n#### ' + util.format(language.statement.sample_explanation, i) + '\n'
          + '\n' + fs.readFileSync(path.join('problems', problem, 'samples', config.problem.file + i + '.md')).toString() + '\n'
      }
    }
    else {
      res = res
        + '\n#### ' + util.format(language.statement.sample_, i) + '\n'
        + '\n' + util.format(language.statement.in_directory, `$$\\boldsymbol{${problem}/${problem}${i}.in}$$`, `$$\\boldsymbol{${problem}/${problem}${i}.ans}$$`);
    }
  }
  return res;
}