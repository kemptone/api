/******/ (function(modules) { // webpackBootstrap
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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.apiConfig = exports.default = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _j = __webpack_require__(1);
	
	var _dissectUrl = __webpack_require__(2);
	
	var _dissectUrl2 = _interopRequireDefault(_dissectUrl);
	
	var _setHeaders = __webpack_require__(7);
	
	var _setHeaders2 = _interopRequireDefault(_setHeaders);
	
	var _convertBody = __webpack_require__(9);
	
	var _convertBody2 = _interopRequireDefault(_convertBody);
	
	var _cachedApiCall = __webpack_require__(10);
	
	var _settings = __webpack_require__(5);
	
	var _settings2 = _interopRequireDefault(_settings);
	
	var _fetchPonyfill = __webpack_require__(13);
	
	var _fetchPonyfill2 = _interopRequireDefault(_fetchPonyfill);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var ponyFill = (0, _fetchPonyfill2.default)({});
	
	var shouldUsePoly = function shouldUsePoly() {
	
	  if (typeof fetch === "undefined") return true;
	
	  if (typeof window === "undefined") return true;
	
	  var agent = window.navigator.userAgent.toLowerCase();
	
	  if (agent.indexOf("edge") > -1) return true;
	
	  if (agent.indexOf("trident/7.0") > -1) return true;
	};
	
	var f = new Function();
	
	function modifyByKey(settings, key) {
	  var add = void 0;
	  if (settings[key]) if (add = settings[key](_extends({}, settings, { settings: settings }))) settings = Object.assign(settings, add);
	}
	
	var minimalApi = function minimalApi(set) {
	  return function (dispatch, getState) {
	
	    var s = (0, _j.jbound)(getState),
	        api = function api(obj) {
	      return minimalApi(obj)(dispatch, getState);
	    },
	        baggage = { s: s, dispatch: dispatch, getState: getState, api: api };
	
	    var _set = void 0;
	
	    if (Array.isArray(set)) return set.forEach(function (obj) {
	      return api(_extends({}, baggage, obj));
	    });
	
	    if (typeof set === "function") {
	      _set = set(baggage);
	      if (!_set) return new Promise(function (resolve) {
	        resolve();
	      });
	    }
	
	    var settings = Object.assign(baggage, _set || set);
	
	    modifyByKey(settings, "prefetch");
	    (0, _convertBody2.default)(settings);
	
	    var type = settings.type,
	        path = settings.path,
	        url = type || path || settings.url ? (0, _dissectUrl2.default)(settings) : null,
	        tokens = settings.tokens,
	        params = settings.params,
	        _settings$onSuccess = settings.onSuccess,
	        onSuccess = _settings$onSuccess === undefined ? f : _settings$onSuccess,
	        _settings$onError = settings.onError,
	        onError = _settings$onError === undefined ? f : _settings$onError,
	        body = settings.body;
	
	
	    if (!url) return;
	
	    (0, _setHeaders2.default)(settings);
	
	    var outputExtras = {
	      body: typeof body === "string" ? JSON.parse(body) : body,
	      tokens: tokens,
	      params: params
	    };
	
	    dispatch && dispatch(_extends(_defineProperty({
	      type: settings._type() + _settings2.default.PENDING
	    }, _settings2.default.PENDING, true), outputExtras));
	
	    if (settings.storeKey) {
	
	      var cached = (0, _cachedApiCall.handleLocalStorageAndReduxStateWrap)(settings);
	
	      if (cached) {
	        return new Promise(function (resolve) {
	
	          var payload = cached.response,
	              r = (0, _j.jbound)(payload),
	              response = Object.assign(baggage, payload, { resolve: resolve, r: r });
	
	          dispatch && dispatch(_extends(_defineProperty({
	            type: type() + _settings2.default.FULFILLED,
	            payload: payload
	          }, _settings2.default.PENDING, false), outputExtras));
	
	          onSuccess && onSuccess(response);
	
	          return resolve(response);
	        });
	      }
	    }
	
	    return shouldUsePoly() ? ponyFill.fetch : fetch(url, settings).then(function (response) {
	      var statusText = response.statusText,
	          status = response.status,
	          ok = response.ok;
	
	
	      if (!ok) return response.json().then(function (data) {
	        var errors = data.errors,
	            e = (0, _j.jbound)(errors),
	            error_baggage = Object.assign(baggage, { e: e, errors: errors, statusText: statusText, status: status });
	
	
	        dispatch && dispatch(_extends(_defineProperty({
	          type: settings._type() + _settings2.default.REJECTED
	        }, _settings2.default.PENDING, false), outputExtras, { errors: errors,
	          apiPath: settings._type()
	        }));
	
	        dispatch && dispatch(_extends({
	          type: _settings2.default.API_ERROR,
	          apiPath: settings._type(),
	          errors: errors
	        }, outputExtras));
	
	        onError(error_baggage);
	
	        return Promise.reject(error_baggage);
	      });
	
	      return response;
	    }).then(function (response) {
	      return response.text();
	    }).then(function (text) {
	
	      var forward = 0;
	
	      if (settings.preserveEscaping) return JSON.parse(text);else return JSON.parse(text.replace(/&lt;/g, "﹤") // these are not ok
	      .replace(/&gt;/g, "﹥") // not ok either
	      .replace(/“/g, "&quot;").replace(/”/g, "&quot;").replace(/&quot;/g, function () {
	        forward++;
	        return forward % 2 ? "“" : "”";
	      }).replace(/&#96;/g, "'") // single quotes ok, because JSON is double quoted
	      .replace(/&#x27;/g, "'") // tick is ok
	      .replace(/&amp;/g, "&") // & is ok because it might be in a url
	      );
	    }).then(function (payload) {
	
	      var r = (0, _j.jbound)(payload),
	          success_baggage = Object.assign(baggage, _extends({}, payload, { r: r }));
	
	      modifyByKey(success_baggage, "predispatch");
	
	      dispatch && dispatch(_extends({}, outputExtras, _defineProperty({ type: settings._type() + _settings2.default.FULFILLED,
	        payload: payload
	      }, _settings2.default.PENDING, false)));
	
	      onSuccess(success_baggage);
	
	      return success_baggage;
	    });
	  };
	};
	
	function apiConfig(obj) {
	  Object.assign(_settings2.default, obj);
	}
	
	exports.default = minimalApi;
	exports.apiConfig = apiConfig;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = require("j");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = dissectUrl;
	
	var _buildParams = __webpack_require__(3);
	
	var _buildParams2 = _interopRequireDefault(_buildParams);
	
	var _buildAPIUrl = __webpack_require__(4);
	
	var _buildAPIUrl2 = _interopRequireDefault(_buildAPIUrl);
	
	var _parseMethod = __webpack_require__(6);
	
	var _parseMethod2 = _interopRequireDefault(_parseMethod);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Used to replace the API_PATH when tokens are present
	 * @param settings {object} api object
	 * @returns {string}
	 */
	function dissectUrl(settings) {
	
	  var params = (0, _buildParams2.default)(settings);
	
	  (0, _parseMethod2.default)(settings);
	
	  // if the PATH starts with ~ then assume it's going to local server, not to API server
	  if (settings.type.substr(0, 1) === "~") return settings.type.substr(1) + params;
	
	  // special case for node base routing
	  // if ((settings.originalType || settings.type) === API_PATH.POST_USER_AUTHENTICATION())
	  //  return settings.type + params
	
	  if (settings.url) return settings.url + params;
	
	  if (settings.path) return (0, _buildAPIUrl2.default)(settings.path, settings.tokens) + params;
	
	  if (settings.type) return (0, _buildAPIUrl2.default)(settings.type, settings.tokens) + params;
	}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = buildParams;
	
	var _j = __webpack_require__(1);
	
	var _j2 = _interopRequireDefault(_j);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function buildParams(settings) {
	  var params = settings.params,
	      getState = settings.getState;
	
	
	  var ecoid = (0, _j2.default)("user.data.ec.organization_id", getState);
	
	  var str = '?';
	  var x = void 0;
	
	  if (ecoid) params = _extends({}, params || {}, { ecoid: ecoid
	  });
	
	  if (!params) return "";
	
	  // modify the params so localStorage check works
	  settings.params = params;
	
	  for (x in params) {
	    if (params[x] !== undefined) str += x + '=' + encodeURIComponent(params[x]) + '&';
	  }return str.replace(/\&$/, '');
	}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _settings = __webpack_require__(5);
	
	var _settings2 = _interopRequireDefault(_settings);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 *
	 * @param { string } path
	 * @param { object } tokens
	 * @param clean [boolean] optional, removes the post | get | put | delete
	 * @returns { string }
	 */
	function buildAPIUrl(path, tokens) {
	  return getApiHost() + pathWithTokens.apply(this, arguments);
	}
	
	function pathWithTokens() {
	  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
	  var tokens = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var clean = arguments[2];
	
	
	  if (typeof path !== "string" || (typeof tokens === "undefined" ? "undefined" : _typeof(tokens)) !== "object") return path;
	
	  Object.keys(tokens).forEach(function (key) {
	    path = path.replace(new RegExp(':' + key, 'g'), tokens[key]);
	  });
	
	  if (clean) return path.split(" ")[1] || path.split(" ")[0];
	
	  return path;
	}
	
	function getApiHost() {
	
	  var api_port = parseInt(_settings2.default.APIPORT);
	
	  var P = api_port !== 80 ? ":" + api_port : '';
	
	  if (_settings2.default.ISHTTPS) return "https://" + _settings2.default.APIHOSTNAME + P;else return "http://" + _settings2.default.APIHOSTNAME + P;
	}
	
	exports.default = buildAPIUrl;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var settings = {
	  ISHTTPS: false,
	  APIHOSTNAME: "fardFardFard",
	  APIPORT: 80,
	  PENDING: "_PENDING",
	  FULFILLED: "_FULFILLED",
	  REJECTED: "_REJECTED",
	  COOKIE_AUTHORIZATION: "X-Authorization",
	  API_ERROR: "API_ERROR"
	};
	
	exports.default = settings;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.default = parseMethod;
	/**
	 * Get the request method out of the type, extends the settings object with value
	 * @param settings
	 * @returns {*}
	 */
	function parseMethod(settings) {
	
	  settings._type = settings.type;
	
	  var type = typeof settings.type === "function" ? settings.type() || "" : settings.type || "";
	
	  var _type$split = type.split(" "),
	      _type$split2 = _slicedToArray(_type$split, 2),
	      part1 = _type$split2[0],
	      part2 = _type$split2[1];
	
	  if (!part2) return settings;
	
	  settings.originalType = settings.type;
	  settings.method = part1.toUpperCase();
	  settings.type = part2;
	
	  return settings;
	}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = setHeaders;
	
	var _cookieDough = __webpack_require__(8);
	
	var _cookieDough2 = _interopRequireDefault(_cookieDough);
	
	var _settings = __webpack_require__(5);
	
	var _settings2 = _interopRequireDefault(_settings);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * sets the request headers
	 * @param settings
	 */
	function setHeaders(settings) {
	  var serverRequest = settings.serverRequest,
	      cookie = serverRequest ? new _cookieDough2.default(serverRequest) : (0, _cookieDough2.default)(),
	      authToken = cookie.get(_settings2.default.COOKIE_AUTHORIZATION) || 'undefined',
	      Authorization = 'Bearer ' + authToken,
	      baseHeaders = { Authorization: Authorization };
	
	
	  settings.mode = "cors";
	
	  if (settings.type.substr(0, 1) === "~") settings.credentials = 'include';
	
	  // if the request body should be multipart/form-data,
	  // don't set the 'Content-Type' header so that the
	  // browser will do it automatically, along with the
	  // appropriate 'boundary' string
	  if (!settings.isMultipart) if (settings.method !== "GET") baseHeaders['Content-Type'] = 'application/json';
	
	  settings.headers = Object.assign(_extends({}, baseHeaders), settings.headers);
	}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = require("cookie-dough");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = convertBody;
	/**
	 * Converts the key/value body object into a json string
	 * @param settings
	 */
	
	var FORCE_BODY_ON_PUT = true;
	
	function convertBody(settings) {
	
	  if (settings.body) {
	    if (typeof settings.body !== "string") settings._body = settings.body;
	
	    if (settings.body instanceof File || settings.isMultipart) return;
	
	    settings.body = JSON.stringify(settings.body);
	  } else if (FORCE_BODY_ON_PUT && settings.method === "PUT") settings.body = "{}";
	}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.handleLocalStorageAndReduxStateWrap = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _j = __webpack_require__(1);
	
	var _settings = __webpack_require__(5);
	
	var _settings2 = _interopRequireDefault(_settings);
	
	var _simpleLocalStorage = __webpack_require__(11);
	
	var _underscore = __webpack_require__(12);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function findAnyValueInObject(obj, x) {
	  for (x in obj) {
	    if (x === _settings2.default.PENDING) continue;else if (!(obj[x] instanceof Object)) return true;else if (findAnyValueInObject(obj[x])) return true;
	  }
	}
	
	function defaultStoreCheck(_ref) {
	  var tokens = _ref.tokens,
	      params = _ref.params,
	      r = _ref.r;
	
	  var newParams = { tokens: tokens, params: params };
	  var oldParams = { tokens: r.j("tokens"), params: r.j("params") };
	  return _underscore2.default.isEqual(newParams, oldParams);
	}
	
	function getFromStore(_ref2) {
	  var storeKey = _ref2.storeKey,
	      s = _ref2.s;
	
	
	  var value = s.j(storeKey) || {};
	
	  if (value[_settings2.default.PENDING]) return;
	
	  if (findAnyValueInObject(value)) return value;
	}
	
	var handleLocalStorageAndReduxStateWrap = exports.handleLocalStorageAndReduxStateWrap = function handleLocalStorageAndReduxStateWrap(settings) {
	  var storeKey = settings.storeKey,
	      _settings$storeCheck = settings.storeCheck,
	      storeCheck = _settings$storeCheck === undefined ? defaultStoreCheck : _settings$storeCheck;
	
	
	  if (typeof window === "undefined") return false;
	
	  var response = void 0;
	  var fromStore = void 0;
	
	  if (storeKey) if (response = (fromStore = getFromStore(settings)) || (0, _simpleLocalStorage.populate)(storeKey)) if (storeCheck(_extends({}, settings, { defaultStoreCheck: defaultStoreCheck, r: (0, _j.jbound)(response), data: response.data, response: response, settings: settings }))) return _extends({ response: response, fromStore: fromStore, storeKey: storeKey }, response);
	};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = require("simple-local-storage");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	module.exports = require("underscore");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = require("fetch-ponyfill");

/***/ })
/******/ ]);
//# sourceMappingURL=api.bundle.js.map