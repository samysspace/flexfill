/**
 * flexfill - Flexible event handling for all browsers
 * @version v1.0.0
 * @link https://github.com/samysspace/flexfill
 * @license MIT
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.flexfill=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){

var NativeCustomEvent = global.CustomEvent;

function useNative() {
  try {
    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
    return  'cat' === p.type && 'bar' === p.detail.foo;
  } catch (e) {
  }
  return false;
}

module.exports = useNative() ? NativeCustomEvent :

// IE >= 9
'function' === typeof document.createEvent ? function CustomEvent (type, params) {
  var e = document.createEvent('CustomEvent');
  if (params) {
    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  } else {
    e.initCustomEvent(type, false, false, void 0);
  }
  return e;
} :

// IE <= 8
function CustomEvent (type, params) {
  var e = document.createEventObject();
  e.type = type;
  if (params) {
    e.bubbles = Boolean(params.bubbles);
    e.cancelable = Boolean(params.cancelable);
    e.detail = params.detail;
  } else {
    e.bubbles = false;
    e.cancelable = false;
    e.detail = void 0;
  }
  return e;
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
(function (global){
'use strict';

var customEvent = _dereq_('custom-event');
var eventlist = _dereq_('./eventlist');
var cache = [];
var doc = global.document;
var addEvent = addEventTrivial;
var removeEvent = removeEventTrivial;

if (!global.addEventListener) {
  addEvent = addEventNonTrivial;
  removeEvent = removeEventNonTrivial;
}

function addEventTrivial(node, type, listener, useCapture) {
  return node.addEventListener(type, listener, useCapture);
}

//For older browsers i.e. IE6-10 (no pun intended)
function addEventNonTrivial(node, type, listener) {
  return node.attachEvent('on' + type, createCallback(node, type, listener));
} 

function removeEventTrivial(node, type, listener, useCapture) {
  return node.removeEventListener(type, listener, useCapture);
}

function removeEventNonTrivial(node, type, listener) {
  var eventListener = getFromCache(node, type, listener);
  if(eventListener) {
    return node.detachEvent('on' + type, eventListener);
  }
}

function createNewEvent(node, type, details) {
  var e = eventlist.indexOf(type) === -1 ? createCustomEvent() : createExistingEvent();
  if(node.dispatchEvent) {
    node.dispatchEvent(e);
  }
  else {
    node.fireEvent('on' + type, e);
  }
  function createExistingEvent() {
    var e;
    if(doc.createEvent) {
      e = doc.createEvent('Event');
      e.initEvent(type, true, true);
    }
    else if(doc.createEventObject) {
      e = doc.createEventObject();
    }
    return e;
  }
  function createCustomEvent() {
    return new customEvent(type, {detail: details});
  }
}

function createCallback(node, type, listener) {
  var callback = getFromCache(node, type, listener) || callbackFactory(node, type, listener);
  cache.push({
    callback: callback,
    node: node,
    type: type,
    listener: listener
  })
  return callback;
}

function callbackFactory(node, type, listener) {
  return function deprecator(event) {
    var e = event || global.event;
    e.target = e.target || e.srcElement;
    e.which = e.which || e.keyCode;
    e.preventDefault = e.preventDefault || function preventDefault () { e.returnValue = false; };
      e.stopPropagation = e.stopPropagation || function stopPropagation () { e.cancelBubble = true; };
      listener.call(node, e);
  };
}

function getFromCache(node, type, listener) {
  var index = search(node, type, listener);
  if(index !== null) {
    var callback = cache[i].callback;
    cache.splice(i, 1); //we are already adding the callback in createCallback, no need to maintain redundant info
    return callback;
  }
}

function search(node, type, listener) {
  var index, item;
  for(i = 0; i < cache.length; i++) {
    item = hardCache[i];
    if(item.node === node && item.type === type && item.fn === fn) {
      return i;
    }
  }
}

module.exports = {
  add: addEvent,
  remove: removeEvent,
  create: createNewEvent
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./eventlist":3,"custom-event":1}],3:[function(_dereq_,module,exports){
(function (global){
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

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2])
(2)
});