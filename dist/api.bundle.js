module.exports =
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
	exports.pathWithTokens = exports.buildAPIUrl = exports.findAnyValueInObject = exports.apiConfig = exports.default = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _j = __webpack_require__(1);
	
	var _dissectUrl = __webpack_require__(2);
	
	var _dissectUrl2 = _interopRequireDefault(_dissectUrl);
	
	var _buildAPIUrl = __webpack_require__(4);
	
	var _buildAPIUrl2 = _interopRequireDefault(_buildAPIUrl);
	
	var _setHeaders2 = __webpack_require__(7);
	
	var _setHeaders3 = _interopRequireDefault(_setHeaders2);
	
	var _convertBody = __webpack_require__(9);
	
	var _convertBody2 = _interopRequireDefault(_convertBody);
	
	var _cachedApiCall = __webpack_require__(10);
	
	var _settings = __webpack_require__(5);
	
	var _settings2 = _interopRequireDefault(_settings);
	
	var _fetchPonyfill = __webpack_require__(12);
	
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
	
	var _onCommonError = function _onCommonError(settings) {
	  return function (msg) {
	    return function (error) {
	      var _extends3;
	
	      var ex = error || {},
	          url = typeof window === "undefined" ? "server side" : location.href,
	          type = settings.type,
	          tokens = settings.tokens,
	          params = settings.params,
	          filter = settings.filter,
	          dispatch = settings.dispatch,
	          more = { type: type, tokens: tokens, params: params, filter: filter };
	
	
	      dispatch && dispatch(_extends(_defineProperty({
	        type: settings._type() + _settings2.default.REJECTED
	      }, _settings2.default.PENDING, false), ex, (_extends3 = { apiPath: settings._type()
	      }, _defineProperty(_extends3, _settings2.default.API_ERROR, true), _defineProperty(_extends3, 'status', _settings2.default.API_ERROR), _extends3)));
	
	      if (ex && ex.e) delete ex.e;
	
	      if (settings.ignoreError) return error;(_settings2.default.ON_COMMON_ERROR || new Function())(msg, url, 0, 0, ex, more);
	
	      throw error;
	    };
	  };
	};
	
	var minimalApi = function minimalApi(set) {
	  var global = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  return function (dispatch, getState) {
	
	    var s = (0, _j.jbound)(getState);
	
	    var api = function api(obj) {
	      return minimalApi(obj)(dispatch, getState);
	    },
	        baggage = { s: s, dispatch: dispatch, getState: getState, api: api };
	
	    var _set = void 0;
	
	    if (Array.isArray(set)) return set.forEach(function (obj) {
	      return api(_extends({}, global, baggage, obj));
	    });
	
	    if (typeof set === "function") {
	      _set = set(baggage);
	      if (!_set) return new Promise(function (resolve) {
	        resolve();
	      });else {
	        api = function api(obj) {
	          return minimalApi(_extends({ serverRequest: _set.serverRequest }, obj))(dispatch, getState);
	        };
	        baggage = { s: s, dispatch: dispatch, getState: getState, api: api };
	      }
	    }
	
	    var settings = Object.assign({ cacheTime: _settings2.default.DEFAULT_CACHE_TIME }, baggage, _set || set);
	    var onCommonError = _onCommonError(settings);
	
	    var timerFinished = true;
	
	    if (settings.delay) {
	      timerFinished = false;
	      setTimeout(function () {
	        return timerFinished = true;
	      }, settings.delay);
	    }
	
	    modifyByKey(settings, "prefetch");
	
	    var type = settings.type,
	        path = settings.path,
	        url = type || path || settings.url ? (0, _dissectUrl2.default)(settings) : null,
	        _settings$onSuccess = settings.onSuccess,
	        onSuccess = _settings$onSuccess === undefined ? f : _settings$onSuccess,
	        onError = settings.onError,
	        body = settings.body;
	
	
	    if (!url) return;
	
	    var outputExtras = function (take) {
	      for (var x in settings) {
	        if (x === "reduxForm" || x === "s" || x === "serverRequest") continue;
	        // else if (x === "type")
	        //  take._type = settings[x]
	        else if (typeof settings[x] !== "function") take[x] = settings[x];
	      }take.isAPI = true;
	
	      return Object.assign(take, {
	        body: typeof body === "string" ? JSON.parse(body) : body
	      });
	    }({});
	
	    var setAsPending = function setAsPending() {
	      var _extends4;
	
	      dispatch && dispatch(_extends({}, outputExtras, (_extends4 = { type: settings._type() + _settings2.default.PENDING,
	        apiPath: settings._type()
	      }, _defineProperty(_extends4, _settings2.default.PENDING, true), _defineProperty(_extends4, 'status', _settings2.default.PENDING), _extends4)));
	    };
	
	    var _setHeaders = (0, _setHeaders3.default)(settings),
	        hasToken = _setHeaders.hasToken;
	
	    (0, _convertBody2.default)(settings);
	
	    if (settings.requiresAuthentication && !hasToken) {
	
	      dispatch({ type: _settings2.default.UNAUTHORIZE });
	
	      return new Promise(function (resolve) {
	        var payload = {
	          data: {},
	          IsLoggedOut: true
	        };
	        var r = (0, _j.jbound)(payload);
	        var response = Object.assign(baggage, payload, { resolve: resolve, r: r, isCached: true
	        });
	        onSuccess && onSuccess(response);
	        return response;
	      });
	    }
	
	    if (settings.storeKey) {
	
	      var cached = (0, _cachedApiCall.handleLocalStorageAndReduxStateWrap)(settings);
	
	      if (cached) {
	
	        return new Promise(function (resolve) {
	
	          var payload = cached.response,
	              r = (0, _j.jbound)(payload),
	              response = Object.assign(baggage, payload, { resolve: resolve, r: r, isCached: true });
	
	          onSuccess && onSuccess(response);
	
	          return resolve(response);
	        });
	      }
	    }
	
	    setAsPending();
	
	    var actualCall = function actualCall() {
	      return (shouldUsePoly() ? ponyFill.fetch : fetch)(url, settings).then(function (response) {
	        var statusText = response.statusText,
	            status = response.status,
	            ok = response.ok;
	
	
	        if (!ok) return response.json().then(function (data) {
	          var _extends5;
	
	          var errors = data.errors,
	              e = (0, _j.jbound)(errors),
	              error_baggage = Object.assign(baggage, _extends({}, data, { e: e, errors: errors, statusText: statusText, status: status }));
	
	
	          dispatch && dispatch(_extends({}, outputExtras, (_extends5 = { type: settings._type() + _settings2.default.REJECTED
	          }, _defineProperty(_extends5, _settings2.default.PENDING, false), _defineProperty(_extends5, 'apiPath', settings._type()), _defineProperty(_extends5, _settings2.default.API_ERROR, true), _defineProperty(_extends5, 'status', _settings2.default.API_ERROR), _extends5)));
	
	          if (onError) onError(error_baggage);
	
	          // most likely logs you out
	          if (_settings2.default.DEFAULT_ON_ERROR && status === 401) _settings2.default.DEFAULT_ON_ERROR(error_baggage);
	
	          return Promise.reject(error_baggage);
	        });
	
	        if (settings.forceError1) return {};
	
	        if (settings.forceError2) return { text: function text() {
	            return undefined;
	          } };
	
	        if (settings.forceError3) return { text: function text() {
	            return "";
	          } };
	
	        if (settings.forceError4) return { text: function text() {
	            return JSON.stringify(JSON.parse({ fard: true }));
	          } };
	
	        if (settings.forceError5) return { text: function text() {
	            return JSON.stringify(JSON.parse({ fard: "<hello></hello>" }));
	          } };
	
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
	            success_baggage = Object.assign(baggage, _extends({}, outputExtras, payload, { r: r })),
	            finish = function finish() {
	          var _extends6;
	
	          dispatch && dispatch(_extends({}, outputExtras, (_extends6 = { type: settings._type() + _settings2.default.FULFILLED,
	            apiPath: settings._type(),
	            payload: payload
	          }, _defineProperty(_extends6, _settings2.default.PENDING, false), _defineProperty(_extends6, _settings2.default.FULFILLED, true), _defineProperty(_extends6, 'status', _settings2.default.FULFILLED), _defineProperty(_extends6, '__timestamp', new Date().getTime()), _extends6)));
	          onSuccess(success_baggage);
	        };
	
	        if (settings.preDispatch) settings.preDispatch(_extends({}, success_baggage, settings));
	
	        if (timerFinished) finish();else {
	          var interval = setInterval(function () {
	            if (timerFinished) {
	              clearInterval(interval);
	              finish();
	            }
	          }, 100);
	        }
	
	        return success_baggage;
	      }).catch(onCommonError("API_ERROR : Issue with dispatching Fulfilled"));
	    };
	
	    if (settings.preDelay) return new Promise(function (resolve) {
	
	      setTimeout(function () {
	        actualCall().then(function () {
	          resolve();
	        });
	      }, settings.preDelay);
	    });
	
	    return actualCall();
	  };
	};
	
	function apiConfig(obj) {
	  Object.assign(_settings2.default, obj);
	}
	
	exports.default = minimalApi;
	exports.apiConfig = apiConfig;
	exports.findAnyValueInObject = _cachedApiCall.findAnyValueInObject;
	exports.buildAPIUrl = _buildAPIUrl2.default;
	exports.pathWithTokens = _buildAPIUrl.pathWithTokens;

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
	      filter = settings.filter,
	      getState = settings.getState;
	
	
	  var ecoid = (0, _j2.default)("user.data.ec.organization_id", getState);
	
	  var str = '?';
	  var x = void 0,
	      y = void 0;
	
	  if (ecoid) params = _extends({
	    ecoid: ecoid
	  }, params || {});
	
	  if (!params) return "";
	
	  // modify the params so localStorage check works
	  settings.params = params;
	
	  for (x in params) {
	    if (params[x] !== undefined && params[x] !== "") str += x + '=' + encodeURIComponent(params[x]) + '&';
	  }str = str.replace(/\&$/, '');
	
	  if (filter) {
	    var filter_str = "";
	    for (y in filter) {
	      if (filter[y] !== undefined && filter[y] !== "") filter_str += y + '::' + encodeURIComponent(filter[y]) + '|';
	    }filter_str = filter_str.replace(/\|$/, '');
	
	    return str += "&filter=" + filter_str;
	  }
	
	  return str;
	}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.pathWithTokens = exports.default = undefined;
	
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
	exports.pathWithTokens = pathWithTokens;

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
	
	  return {
	    mode: settings.mode,
	    authToken: authToken,
	    Authorization: Authorization,
	    hasToken: authToken !== "undefined"
	  };
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
	
	    if (typeof File !== "undefined" && settings.body instanceof File || settings.isMultipart) return;
	
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
	
	exports.findAnyValueInObject = findAnyValueInObject;
	
	var _j = __webpack_require__(1);
	
	var _settings = __webpack_require__(5);
	
	var _settings2 = _interopRequireDefault(_settings);
	
	var _underscore = __webpack_require__(11);
	
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
	      filter = _ref.filter,
	      body = _ref.body,
	      r = _ref.r,
	      settings = _ref.settings;
	
	
	  // if (body || r.j("body"))
	  //   debugger
	
	  r.j("__timestamp");
	  var newParams = { tokens: tokens, params: params, body: body, filter: filter };
	  var oldParams = { tokens: r.j("tokens"), params: r.j("params"), body: r.j("body"), filter: r.j("filter") };
	  var now = new Date().getTime();
	
	  var equalProps = _underscore2.default.isEqual(newParams, oldParams);
	  var notTooOld = r.j("__timestamp", now) > now - (settings.cacheTime || 1000 * 60 * 5);
	
	  return equalProps && notTooOld;
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
	
	
	  if (!storeKey) return;
	
	  var fromStore = getFromStore(settings),
	      response = fromStore;
	
	  if (!response) return;
	
	  var sc = storeCheck(_extends({}, settings, { defaultStoreCheck: defaultStoreCheck, r: (0, _j.jbound)(response), data: response.data, response: response, settings: settings }));
	
	  if (!sc) return;
	
	  return _extends({ response: response, fromStore: fromStore, storeKey: storeKey }, response);
	};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = require("underscore");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	module.exports = require("fetch-ponyfill");

/***/ })
/******/ ]);
//# sourceMappingURL=api.bundle.js.map