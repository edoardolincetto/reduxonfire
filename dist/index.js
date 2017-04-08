(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("firebase"));
	else if(typeof define === 'function' && define.amd)
		define("reduxonfire", ["firebase"], factory);
	else if(typeof exports === 'object')
		exports["reduxonfire"] = factory(require("firebase"));
	else
		root["reduxonfire"] = factory(root["firebase"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _firebase = __webpack_require__(0);

var _firebase2 = _interopRequireDefault(_firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReduxOnFire = function () {
    function ReduxOnFire(config) {
        _classCallCheck(this, ReduxOnFire);

        this.firebaseApp = _firebase2.default.initializeApp(config);
        this.firebaseAuth = _firebase2.default.auth();
        this.firebaseAuthGoogle = new _firebase2.default.auth.GoogleAuthProvider();
        this.firebaseAuthFacebook = new _firebase2.default.auth.FacebookAuthProvider();
        this.firebaseStorage = _firebase2.default.storage();
        this.firebaseDatabase = _firebase2.default.database();
        this.dispatch = null;
        this.getState = null;
    }

    _createClass(ReduxOnFire, [{
        key: 'authObserver',
        value: function authObserver() {
            var _this = this;

            this.firebaseAuth.onAuthStateChanged(function (user) {
                if (user) {
                    _this.dispatch({ type: 'USER_LOGGED' });
                } else {
                    _this.dispatch({ type: 'USER_LOGGED_OUT' });
                }
            });
        }
    }, {
        key: 'signup',
        value: function signup(email, password) {
            var _this2 = this;

            this.dispatch({ type: 'SIGNUP_REQUEST' });
            this.firebaseAuth.createUserWithEmailAndPassword(email, password).then(function (result) {
                _this2.dispatch({
                    type: 'SIGNUP_SUCCESS',
                    result: result
                });
                var user = _this2.firebaseAuth.currentUser;
                if (!user.emailVerified) {
                    user.sendEmailVerification();
                }
            }).catch(function (error) {
                _this2.dispatch({
                    type: 'SIGNUP_FAILED',
                    error: error
                });
            });
        }
    }, {
        key: 'login',
        value: function login(email, password) {
            var _this3 = this;

            this.dispatch({ type: 'LOGIN_REQUEST' });
            this.firebaseAuth.signInWithEmailAndPassword(email, password).then(function (result) {
                _this3.dispatch({
                    type: 'LOGIN_SUCCESS',
                    result: result
                });
            }).catch(function (error) {
                _this3.dispatch({
                    type: 'LOGIN_FAILED',
                    error: error
                });
            });
        }
    }, {
        key: 'passwordReset',
        value: function passwordReset(email) {
            var _this4 = this;

            this.firebaseAuth.sendPasswordResetEmail(email).then(function () {
                _this4.dispatch({ type: 'PASSWORD_RESET_SUCCESS' });
            }).catch(function (error) {
                _this4.dispatch({
                    type: 'PASSWORD_RESET_FAILED',
                    error: error
                });
            });
        }
    }, {
        key: 'google',
        value: function google() {
            var _this5 = this;

            this.dispatch({ type: 'GOOGLE_REQUEST' });
            this.firebaseAuth.signInWithPopup(this.firebaseAuthGoogle).then(function (result) {
                _this5.dispatch({
                    type: 'GOOGLE_SUCCESS',
                    result: result
                });
            }).catch(function (error) {
                _this5.dispatch({
                    type: 'GOOGLE_FAILED',
                    error: error
                });
            });
        }
    }, {
        key: 'facebook',
        value: function facebook() {
            var _this6 = this;

            this.dispatch({ type: 'FACEBOOK_REQUEST' });
            this.firebaseAuth.signInWithPopup(this.firebaseAuthFacebook).then(function (result) {
                _this6.dispatch({
                    type: 'FACEBOOK_SUCCESS',
                    result: result
                });
            }).catch(function (error) {
                _this6.dispatch({
                    type: 'FACEBOOK_FAILED',
                    error: error
                });
            });
        }
    }, {
        key: 'logout',
        value: function logout() {
            var _this7 = this;

            this.firebaseAuth.signOut().then(function () {
                _this7.dispatch({ type: 'LOGOUT_SUCCESS' });
            }).catch(function (error) {
                _this7.dispatch({
                    type: 'LOGOUT_FAILED',
                    error: error
                });
            });
        }
    }, {
        key: 'getRecord',
        value: function getRecord(actionName, recordName) {
            var _this8 = this;

            var actionName = actionName.toUpperCase();
            this.dispatch({ type: 'GET_' + actionName + '_REQUEST' });

            this.firebaseDatabase.ref(recordName).on('value', function (snapshot) {
                _this8.dispatch(_defineProperty({
                    type: 'GET_' + actionName + '_SUCCESS'
                }, recordName, snapshot.val()));
            }, function (error) {
                _this8.dispatch({ type: 'GET_' + actionName + '_FAILED' });
            });
        }
    }, {
        key: 'getRecordById',
        value: function getRecordById(recordName, recordId) {
            var _this9 = this;

            var actionName = recordName.toUpperCase();
            this.dispatch({ type: 'GET_' + actionName + '_REQUEST' });

            var record = this.getState()[recordName].all.filter(function (value) {
                return value.id == recordId ? true : false;
            });

            if (record.length == 1) {
                this.dispatch(_defineProperty({
                    type: 'GET_' + actionName + '_CACHED'
                }, recordName, record[0]));
            } else {
                this.firebaseDatabase.ref(recordName).child(recordId).on('value', function (snapshot) {
                    _this9.dispatch(_defineProperty({
                        type: 'GET_' + actionName
                    }, recordName, snapshot.val()));
                }, function (error) {
                    _this9.dispatch({ type: 'GET_' + actionName + '_FAILED' });
                });
            }
        }
    }, {
        key: 'getRecordByContent',
        value: function getRecordByContent(recordName, recordContent) {
            var actionName = recordName.toUpperCase();
            return _defineProperty({
                type: 'GET_' + actionName
            }, recordName, recordContent);
        }
    }, {
        key: 'getRecords',
        value: function getRecords(recordsName) {
            var _this10 = this;

            var actionName = recordsName.toUpperCase();
            this.dispatch({ type: 'GET_' + actionName + '_REQUEST' });
            this.firebaseDatabase.ref(recordsName).on('value', function (snapshot) {
                var array = [];
                snapshot.forEach(function (child) {
                    var finalObject = child.val();
                    if (finalObject.id) {
                        finalObject.id = child.key;
                    }
                    array.push(finalObject);
                });
                _this10.dispatch(_defineProperty({
                    type: 'GET_' + actionName + '_SUCCESS'
                }, recordsName, array));
            }, function (error) {
                _this10.dispatch({ type: 'GET_' + actionName + '_FAILED' });
            });
        }
    }, {
        key: 'getRecordsOrdered',
        value: function getRecordsOrdered(recordsName, criteria, reverse) {
            var _this11 = this;

            var actionName = recordsName.toUpperCase();
            this.dispatch({ type: 'GET_' + actionName + '_REQUEST' });
            this.firebaseDatabase.ref(recordsName).orderByChild(criteria).on('value', function (snapshot) {
                var array = [];
                snapshot.forEach(function (child) {
                    var finalObject = child.val();
                    finalObject.id = child.key;
                    array.push(finalObject);
                });
                _this11.dispatch(_defineProperty({
                    type: 'GET_' + actionName + '_SUCCESS'
                }, recordsName, reverse ? array.reverse() : array));
            }, function (error) {
                _this11.dispatch({ type: 'GET_' + actionName + '_FAILED' });
            });
        }
    }, {
        key: 'addRecordKey',
        value: function addRecordKey(recordName) {
            var actionName = recordName.toUpperCase();
            var reference = this.firebaseDatabase.ref().child(recordName).push().key;
            var initialDB = {
                number: '0/2016'
            };

            return this.firebaseDatabase.ref().child(recordName + '/' + reference).update(initialDB, function (error) {
                if (error) {
                    console.log(error);
                } else {
                    return dispatch({
                        type: 'ADD_' + actionName,
                        reference: reference
                    });
                }
            });
        }
    }, {
        key: 'addRecordWithContent',
        value: function addRecordWithContent(recordName, recordContent, notificationFailed, notificationSuccess) {
            var actionName = recordName.toUpperCase();
            this.dispatch({ type: 'ADD_' + actionName + '_REQUEST' });
            var reference = this.firebaseDatabase.ref().child(recordName).push().key;
            return this.firebaseDatabase.ref().child(recordName + '/' + reference).update(recordContent, function (error) {
                if (error) {
                    return dispatch({ type: 'ADD_' + actionName + '_FAILED', notification: notificationFailed });
                } else {
                    return dispatch({ type: 'ADD_' + actionName + '_SUCCESS', notification: notificationSuccess });
                };
            });
        }
    }, {
        key: 'updateRecord',
        value: function updateRecord(recordName, recordId, recordContent, notificationFailed, notificationSuccess) {
            var _this12 = this;

            var actionName = recordName.toUpperCase();
            this.dispatch({ type: 'UPDATE_' + actionName + '_REQUEST' });

            if (recordId == null) {
                var reference = this.firebaseDatabase.ref().child(recordName);
            } else {
                var reference = this.firebaseDatabase.ref().child(recordName + '/' + recordId);
            }

            return reference.update(recordContent, function (error) {
                if (error) {
                    if (notificationFailed) {
                        _this12.dispatch({
                            type: 'UPDATE_' + actionName + '_FAILED',
                            notification: notificationFailed
                        });
                    }
                } else {
                    if (notificationSuccess) {
                        var _this12$dispatch;

                        _this12.dispatch((_this12$dispatch = {
                            type: 'UPDATE_' + actionName + '_SUCCESS'
                        }, _defineProperty(_this12$dispatch, recordName, recordContent), _defineProperty(_this12$dispatch, 'notification', notificationSuccess), _this12$dispatch));
                    }
                };
            });
        }
    }, {
        key: 'setRecord',
        value: function setRecord(recordName, recordContent, notificationFailed, notificationSuccess) {
            var _this13 = this;

            var actionName = recordName.toUpperCase();
            this.dispatch({ type: 'SET_' + actionName + '_REQUEST' });
            var reference = this.firebaseDatabase.ref().child(recordName);
            return reference.set(recordContent, function (error) {
                if (error) {
                    if (notificationFailed) {
                        _this13.dispatch({
                            type: 'SET_' + actionName + '_FAILED',
                            notification: notificationFailed
                        });
                    }
                } else {
                    if (notificationSuccess) {
                        var _this13$dispatch;

                        _this13.dispatch((_this13$dispatch = {
                            type: 'SET_' + actionName + '_SUCCESS'
                        }, _defineProperty(_this13$dispatch, recordName, recordContent), _defineProperty(_this13$dispatch, 'notification', notificationSuccess), _this13$dispatch));
                    }
                };
            });
        }
    }, {
        key: 'cloneRecord',
        value: function cloneRecord(recordName, recordId, notificationFailed, notificationSuccess) {
            var _this14 = this;

            var actionName = recordName.toUpperCase();
            this.dispatch({ type: 'CLONE_' + actionName + '_REQUEST' });
            var record = this.getState()[recordName].all.filter(function (value) {
                return value.id == recordId ? true : false;
            });

            if (record.length == 1) {
                var reference = this.firebaseDatabase.ref(recordName).push().key;
                return this.firebaseDatabase.ref(recordName).child(reference).update(record[0], function (error) {
                    if (error) {
                        return dispatch({ type: 'CLONE_' + actionName + '_FAILED', notification: notificationFailed });
                    } else {
                        return dispatch({ type: 'CLONE_' + actionName + '_SUCCESS', notification: notificationSuccess });
                    };
                });
            } else {
                this.firebaseDatabase.ref(recordName).child(recordId).once('value').then(function (snapshot) {
                    var reference = _this14.firebaseDatabase.ref(recordName).push().key;
                    return _this14.firebaseDatabase.ref(recordName).child(reference).update(snapshot.val(), function (error) {
                        if (error) {
                            return dispatch({ type: 'CLONE_' + actionName + '_FAILED', notification: notificationFailed });
                        } else {
                            return dispatch({ type: 'CLONE_' + actionName + '_SUCCESS', notification: notificationSuccess });
                        };
                    });
                });
            }
        }
    }, {
        key: 'deleteRecord',
        value: function deleteRecord(recordName, recordId, notificationSuccess) {
            var actionName = recordName.toUpperCase();
            this.firebaseDatabase.ref().child(recordName + '/' + recordId).remove();
            return {
                type: 'DELETE_' + actionName,
                id: recordId,
                notification: notificationSuccess
            };
        }
    }, {
        key: 'showNotification',
        value: function showNotification(notification) {
            return {
                type: 'SIMPLE_NOTIFICATION',
                notification: notification
            };
        }
    }]);

    return ReduxOnFire;
}();

exports.default = ReduxOnFire;

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map