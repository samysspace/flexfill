'use strict';

var eventlist = [];
var name = '';
var onevent = /^on/;

/**
* Takes the names of all global event handlers and strips them of the word 'on'.
*/
for (name in global) {
  if (onevent.test(name)) {
    eventlist.push(name.slice(2));
  }
}

module.exports = eventlist;