'use_strict';

const path = require('path');
const fs = require('fs');
const util = require('util');
const yamljs = require('yamljs');
const moment = require('moment');

const contest = yamljs.load('_config.yml');

if (contest.timezone) {
  process.env.TZ = contest.timezone;
}

module.exports = {
  generate: function (problem) {
    if (!fs.existsSync('output')) {
      fs.mkdirSync('output');
    }
    if (!problem) {
      fs.writeFileSync(path.join('output', 'statement.md'), generate_contest());
      console.log('Succeeded to generate (' + path.join('output', 'statement.md') + ').');
    }
    else {
      fs.writeFileSync(path.join('output', problem + '.md'), generate_problem(problem));
      console.log('Succeeded to generate (' + path.join('output', problem + '.md') + ').');
    }
  }
};

function generate_contest() {
  var config = {
    contest: contest,
    problems: []
  };
  for (var i in config.contest.days) {
    for (var j in config.contest.days[i].problems) {
      config.problems.push(yamljs.load(path.join('problems', config.contest.days[i].problems[j], '_config.yml')));
    }
  }

  const language = yamljs.load(path.join(__dirname, 'languages', config.contest.language + '.yml'));

  var statement = ''
    + '<center><font style="font-size:1.8em;font-weight:bold">' + config.contest.title + '</font></center>\n\n'
    + (config.contest.subtitle ? '<center><font style="font-size:1.8em;font-weight:bold">' + config.contest.subtitle + '</font></center>\n\n' : '')
    + (config.contest.author ? '<center><font style="font-size:1.8em">' + config.contest.author + '</font></center>\n\n' : '')
    + '<center><font style="font-size:1.4em">' + getTime(config.contest.time_st, config.contest.time_fn, language) + '</font></center>\n\n';

  for (var i in config.contest.days) {
    for (var j in config.contest.days[i].problems) {
      statement = statement + '<div style="page-break-after:always"></div>\n\n' + generate_problem(config.contest.days[i].problems[j]);
    }
  }

  return statement;
}

function getTime(start, ending, language) {
  start = new moment(start);
  ending = new moment(ending);
  if (start.format('YYMMDD') == ending.format('YYMMDD')) {
    return util.format(language.cover.time, start.format('Y'), start.format('M'), start.format('D'), start.format('HH'), start.format('mm'), ending.format('H'), ending.format('mm'));
  }
  else {
    return util.format(language.cover.time_nad, start.format('Y'), start.format('M'), start.format('D'), start.format('HH'), start.format('mm'), ending.format('Y'), ending.format('M'), ending.format('D'), ending.format('HH'), ending.format('mm'));
  }
}

function generate_problem(problem) {
  const config = {
    contest: contest,
    problem: yamljs.load(path.join('problems', problem, '_config.yml'))
  };
  const language = yamljs.load(path.join(__dirname, 'languages', (config.problem.language ? config.problem.language : config.contest.language) + '.yml'));
  var statement = fs.readFileSync(path.join('problems', problem, 'statement', '_statement.md')).toString();
  statement = ''
    + '<center><h2>' + util.format(language.statement.title, config.problem.title, config.problem.file) + '</h2></center>\n'
    + (config.problem.author ? '<center><h4>' + config.problem.author + '</h3></center>\n' : '')
    + (config.problem.type_notice ? '**' + util.format(language.particular.type_notice, language.particular.types[config.problem.type]) + '**' : '')
    + statement
      .replace(/\r?\n?<!--begbackground-->\r?\n?\r?\n?([\s\S]*?)\r?\n?\r?\n?<!--endbackground-->\r?\n?/g, '\n#### ' + language.statement.background + '\n\n$1\n')
      .replace(/\r?\n?<!--begdescription-->\r?\n?\r?\n?([\s\S]*?)\r?\n?\r?\n?<!--enddescription-->\r?\n?/g, '\n#### ' + language.statement.description + '\n\n$1\n')
      .replace(/\r?\n?<!--beginputformat-->\r?\n?\r?\n?([\s\S]*?)\r?\n?\r?\n?<!--endinputformat-->\r?\n?/g, '\n#### ' + language.statement.input_format + '\n\n' + (config.problem.file_io ? util.format(language.particular.fin_notice, '$\\boldsymbol{' + config.problem.file + '.in}$') : '') + '\n\n$1\n')
      .replace(/\r?\n?<!--begoutputformat-->\r?\n?\r?\n?([\s\S]*?)\r?\n?\r?\n?<!--endoutputformat-->\r?\n?/g, '\n#### ' + language.statement.output_format + '\n\n' + (config.problem.file_io ? util.format(language.particular.fout_notice, '$\\boldsymbol{' + config.problem.file + '.out}$') : '') + '\n\n$1\n')
      .replace(/\r?\n?<!--samples-->\r?\n?/g, samples(problem, config, language))
      .replace(/\r?\n?<!--begconvention-->\r?\n?\r?\n?([\s\S]*?)\r?\n?\r?\n?<!--endconvention-->\r?\n?/g, '\n#### ' + language.statement.convention + '\n\n$1\n')
      .replace(/\r?\n?<!--beghint-->\r?\n?\r?\n?([\s\S]*?)\r?\n?\r?\n?<!--endhint-->\r?\n?/g, '\n#### ' + language.statement.hint + '\n\n$1\n');
  return statement;
}

function samples(problem, config, language) {
  var res = '';
  for (var i = 1; i <= config.problem.samples.quantity; ++i) {
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