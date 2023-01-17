'use strict';

const fs_extra = require('fs-extra');
const path = require('path');

module.exports = {
  init: function(directory) {
    if (!directory) {
      fs_extra.copySync(path.join(__dirname, '../assets/contest'), '.');
      console.log('New OI Contest initialized.');
    } else {
      fs_extra.copySync(path.join(__dirname, '../assets/contest'), directory);
      console.log('New OI Contest initialized in (' + directory + ').');
    }
  }
};