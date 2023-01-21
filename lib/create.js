'use strict';

const path = require('path');
const fs_extra = require('fs-extra');

module.exports = {
  init: init,
  new: function(directory, option) {
    if (option.traditional) {
      new_traditional(directory);
    }
    else if (option.interactive) {
      console.error('Current version of Imeoic doesn\'t support non-traditional problems.')
      // new_interactive(directory);
    }
    else if (option.communication) {
      console.error('Current version of Imeoic doesn\'t support non-traditional problems.')
      // new_communication(directory);
    }
    else if (option.submitting) {
      console.error('Current version of Imeoic doesn\'t support non-traditional problems.')
      // new_submitting(directory);
    }
    else {
      new_traditional(directory);
    }
  }
};

function init(directory) {
  if (!directory) {
    directory = '.';
  }
  fs_extra.copySync(path.join(__dirname, '../assets/contest'), directory);
  fs_extra.copySync(path.join(__dirname, '../assets/traditional'), path.join(directory, 'problems', 'A'));
  console.log('New OI Contest initialized in (' + directory + ').');
}

function new_traditional(directory) {
  fs_extra.copySync(path.join(__dirname, '../assets/traditional'), path.join('problems', directory));
  console.log('New traditional problem created in (' + path.join('problems', directory) + ').');
}

function new_interactive(directory) {
  fs_extra.copySync(path.join(__dirname, '../assets/interactive'), directory);
  console.log('New interactive problem created in (' + path.join('problems', directory) + ').');
}

function new_communication(directory) {
  fs_extra.copySync(path.join(__dirname, '../assets/communication'), directory);
  console.log('New communication problem created in (' + path.join('problems', directory) + ').');
}

function new_submitting(directory) {
  fs_extra.copySync(path.join(__dirname, '../assets/submitting'), directory);
  console.log('New answer submitting problem created in (' + path.join('problems', directory) + ').');
}
