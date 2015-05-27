let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');

import AppDispatcher from '../dispatcher/app_dispatcher';

const CHANGE_EVENT = 'change';

let _currentTool = null;
