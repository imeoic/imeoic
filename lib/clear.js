'use strict';

const path = require('path');
var fs = require('fs');

function remove(file) {
  if (fs.existsSync(file)) {
    if (fs.statSync(file).isDirectory()) {
      var files = fs.readdirSync(file);
      for (var i in files) {
        remove(path.join(file, files[i]));
      }
      fs.rmdirSync(file);
    }
    else {
      fs.rmSync(file);
    }
  }
}

module.exports = {
  clear: function() {
    remove('output');
  }
};