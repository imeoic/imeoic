'use strict';

const fs_extra = require('fs-extra');
const path = require('path');

module.exports = {
  init: function(directory) {
    if (!directory) {
      directory = '.';
    }
    fs_extra.copySync(path.join(__dirname, '../assets/contest'), directory);
    fs_extra.copySync(path.join(__dirname, '../assets/problem'), path.join(directory, 'A'));
    console.log('New OI Contest initialized in (' + directory + ').');
  }
};