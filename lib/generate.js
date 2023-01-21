'use_strict';

const path = require('path');
const fs = require('fs');
const util = require('util');
const yamljs = require('yamljs');
const moment = require('moment');

module.exports = {
  generate: function (option) {
    if (!fs.existsSync('output')) {
      fs.mkdirSync('output');
    }
    if (option.problem) {
      fs.writeFileSync(path.join('output', option.problem + '.md'), generate_problem(option.problem));
      console.log('Succeeded to generate (' + path.join('output', option.problem + '.md') + ').');
    }
    else if (option.day) {
      fs.writeFileSync(path.join('output', option.day + '.md'), generate_day(option.day));
      console.log('Succeeded to generate (' + path.join('output', option.day + '.md') + ').');
    }
    else {
      var days = yamljs.load('_config.yml').days;
      for (var day in days) {
        fs.writeFileSync(path.join('output', day + '.md'), generate_day(day));
        console.log('Succeeded to generate (' + path.join('output', day + '.md') + ').');
      }
    }
  }
};

var sharedvar_problems;

function generate_day(day) {
  var config = {
    contest: yamljs.load('_config.yml'),
    problems: []
  };
  for (var i in config.contest.days[day].problems) {
    config.problems.push(yamljs.load(path.join('problems', config.contest.days[day].problems[i], '_config.yml')));
  }
  var language = yamljs.load(path.join(__dirname, 'languages', config.contest.language + '.yml'));
  var suffix = yamljs.load(path.join(__dirname, 'languages', 'source_suffix.yml'));

  if (!config.contest.days[day].author) {
    config.contest.days[day].author = config.contest.author;
  }

  var statement = ''
    + '<center><font style="font-size:1.8em;font-weight:bold">' + config.contest.title + '</font></center>\n\n'
    + (config.contest.days[day].title ? '<center><font style="font-size:1.8em;font-weight:bold">' + config.contest.days[day].title + '</font></center>\n\n' : '')
    + (config.contest.days[day].author ? '<center><font style="font-size:1.8em">' + config.contest.days[day].author + '</font></center>\n\n' : '')
    + '<center><font style="font-size:1.4em">' + getTime(config.contest.days[day].time_st, config.contest.days[day].time_fn, language) + '</font></center>\n\n';

  sharedvar_problems = config.problems;
  statement = statement + '<table border="1"><tbody>'
    + getTableRow(language.cover.problem_name, function (p) { return p.title })
    + getTableRow(language.cover.problem_type, function (p) { return language.particular.types[p.type] })
    + getTableRow(language.cover.english_name, function (p) { return p.file })
    + getTableRow(language.cover.input_file, function (p) { return p.file + '.in' })
    + getTableRow(language.cover.output_file, function (p) { return p.file + '.out' })
    + getTableRow(language.cover.time_limit, function (p) { return util.format(language.units.s, (p.time_limit / 1000).toFixed(1)); })
    + getTableRow(language.cover.memory_limit, function (p) { return util.format(language.units.MB, (p.memory_limit / 1000).toFixed(0)); })
    + getTableRow(language.cover.tests_quantity, function (p) { return p.tests.quantity; })
    + getTableRow(language.cover.subtasks_quantity, function (p) { return p.subtasks ? p.subtasks.length : undefined; })
    + getTableRow(language.cover.scores_equal, function (p) { return p.subtasks ? undefined : (p.tests.scores ? language.words.false : language.words.true); })
    + '</tdoby></table>\n\n';

  statement = statement + language.cover.source_name + '\n\n<table border="1"><tbody>';
  for (var i in config.contest.languages) {
    statement = statement + getTableRow(util.format(language.cover.for_language, i), function (p) { return util.format(suffix[i], p.file); });
  }
  statement = statement + '</tdoby></table>\n\n';

  statement = statement + language.cover.compile_option + '\n\n<table border="1"><tbody>';
  for (var i in config.contest.languages) {
    statement = statement
      + '<tr><td style="width:' + (100 / (config.problems.length + 1)).toFixed(2) + '%">' + util.format(language.cover.for_language, i) + '</td>'
      + '<td style="width:' + (100 - 100 / (config.problems.length + 1)).toFixed(2) + '%">' + config.contest.languages[i] + '</td></tr>';
  }
  statement = statement + '</tdoby></table>\n\n';

  statement = statement + '**' + language.cover.notes + '**\n\n';
  var icounter = 0;
  for (var i in config.contest.notes) {
    statement = statement + '  ' + (++icounter) + '. ' + config.contest.notes[i] + '\n';
  }
  statement = statement + '\n';

  for (var i in config.contest.days[day].problems) {
    statement = statement + '<div style="page-break-after:always"></div>\n\n' + generate_problem(config.contest.days[day].problems[i]);
  }

  return statement;
}

function getTableRow(title, getfunc) {
  var problems = sharedvar_problems;
  var res = '<tr><td style="width:' + (100 / (problems.length + 1)).toFixed(2) + '%">' + title + '</td>';
  var counter = 0;
  for (var i in problems) {
    var data = getfunc(problems[i]);
    if (data) {
      res = res + '<td style="width:' + (100 / (problems.length + 1)).toFixed(2) + '%">' + data + '</td>';
      ++counter;
    }
    else {
      res = res + '<td style="width:' + (100 / (problems.length + 1)).toFixed(2) + '%"></td>';
    }
  }
  return counter > 0 ? res : '';
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
  var config = {
    contest: yamljs.load('_config.yml'),
    problem: yamljs.load(path.join('problems', problem, '_config.yml'))
  };
  var language = yamljs.load(path.join(__dirname, 'languages', (config.problem.language ? config.problem.language : config.contest.language) + '.yml'));
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