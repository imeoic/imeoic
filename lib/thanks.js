'use strict';

const { version } = require('./variables');

const article = '\
Fine! How smart you are! You have discovered the mysterious garden\n\
under the surface of Noci. Would you let Noci tell a thank where I\n\
comes from? Secretly tell you, it will be a very, very, very large\n\
kiss.\n\
Come here! For...\n\
Curiously, I was born on Jan 17, the day when WC2023 Test is held.\n\
For sacred thanks to Sukwants, zhangyt, yolanda, zsq147258369. \
';

module.exports = {
  thanks: function() {
    console.log(article);
  }
};