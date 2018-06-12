'use strict';

var customEvent = require('custom-event');
var eventlist = require('./eventlist');
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