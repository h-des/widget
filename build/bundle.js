(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "pwNi");
/******/ })
/************************************************************************/
/******/ ({

/***/ "BMrJ":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var memoize = function memoize(fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = function (fn) {
	var memo = {};

	return function (selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector];
	};
}(function (target) {
	return document.querySelector(target);
});

var singleton = null;
var singletonCounter = 0;
var stylesInsertedAtTop = [];

var fixUrls = __webpack_require__("DRTY");

module.exports = function (list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if (newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if (domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j]();
				}delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if (domStyle) {
			domStyle.refs++;

			for (var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for (; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for (var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts };
		}
	}
}

function listToStyles(list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = { css: css, media: media, sourceMap: sourceMap };

		if (!newStyles[id]) styles.push(newStyles[id] = { id: id, parts: [part] });else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement(options, style) {
	var target = getElement(options.insertInto);

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if (idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement(options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs(el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
		result = options.transform(obj.css);

		if (result) {
			// If transform returns a value, use that instead of the original css.
			// This allows running runtime transformations on the css.
			obj.css = result;
		} else {
			// If the transform function returns a falsy value, don't add this css.
			// This allows conditional loading of css
			return function () {
				// noop
			};
		}
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);
	} else if (obj.sourceMap && typeof URL === "function" && typeof URL.createObjectURL === "function" && typeof URL.revokeObjectURL === "function" && typeof Blob === "function" && typeof btoa === "function") {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function remove() {
			removeStyleElement(style);

			if (style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function remove() {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if (newObj) {
			if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
}();

function applyToSingletonTag(style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag(style, obj) {
	var css = obj.css;
	var media = obj.media;

	if (media) {
		style.setAttribute("media", media);
	}

	if (style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while (style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink(link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
 	If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
 	and there is no publicPath defined then lets turn convertToAbsoluteUrls
 	on by default.  Otherwise default to the convertToAbsoluteUrls option
 	directly
 */
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if (oldSrc) URL.revokeObjectURL(oldSrc);
}

/***/ }),

/***/ "BtxX":
/***/ (function(module, exports) {

(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}

  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function () {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new this.constructor(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    return new Promise(function (resolve, reject) {
      if (!arr || typeof arr.length === 'undefined') throw new TypeError('Promise.all accepts an array');
      var args = Array.prototype.slice.call(arr);
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = typeof setImmediate === 'function' && function (fn) {
    setImmediate(fn);
  } || function (fn) {
    setTimeoutFunc(fn, 0);
  };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }
})(this);

/***/ }),

/***/ "DRTY":
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),

/***/ "JkW7":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: ../node_modules/preact/dist/preact.min.js
var preact_min = __webpack_require__("KM04");
var preact_min_default = /*#__PURE__*/__webpack_require__.n(preact_min);

// CONCATENATED MODULE: ../node_modules/preact-habitat/dist/preact-habitat.es.js
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



/**
 * Removes `-` fron a string and capetalize the letter after
 * example: data-props-hello-world =>  dataPropsHelloWorld
 * Used for props passed from host DOM element
 * @param  {String} str string
 * @return {String} Capetalized string
 */
var camelcasize = function camelcasize(str) {
  return str.replace(/-([a-z])/gi, function (all, letter) {
    return letter.toUpperCase();
  });
};

/**
 * [getExecutedScript internal widget to provide the currently executed script]
 * @param  {document} document [Browser document object]
 * @return {HTMLElement}     [script Element]
 */
var getExecutedScript = function getExecutedScript() {
  return document.currentScript || function () {
    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1];
  }();
};

/**
 * Get the props from a host element's data attributes
 * @param  {Element} tag The host element
 * @return {Object}  props object to be passed to the component
 */
var collectPropsFromElement = function collectPropsFromElement(element, defaultProps) {
  if (defaultProps === void 0) defaultProps = {};

  var attrs = element.attributes;

  var props = _extends({}, defaultProps);

  // collect from element
  Object.keys(attrs).forEach(function (key) {
    if (attrs.hasOwnProperty(key)) {
      var dataAttrName = attrs[key].name;
      if (!dataAttrName || typeof dataAttrName !== "string") {
        return false;
      }
      var propName = dataAttrName.split(/(data-props?-)/).pop() || '';
      propName = camelcasize(propName);
      if (dataAttrName !== propName) {
        var propValue = attrs[key].nodeValue;
        props[propName] = propValue;
      }
    }
  });

  // check for child script text/props or application/json
  [].forEach.call(element.getElementsByTagName('script'), function (scrp) {
    var propsObj = {};
    if (scrp.hasAttribute('type')) {
      if (scrp.getAttribute("type") !== "text/props" && scrp.getAttribute("type") !== "application/json") {
        return;
      }
      try {
        propsObj = JSON.parse(scrp.innerHTML);
      } catch (e) {
        throw new Error(e);
      }
      _extends(props, propsObj);
    }
  });

  return props;
};

var getHabitatSelectorFromClient = function getHabitatSelectorFromClient(currentScript) {
  var scriptTagAttrs = currentScript.attributes;
  var selector = null;
  // check for another props attached to the tag
  Object.keys(scriptTagAttrs).forEach(function (key) {
    if (scriptTagAttrs.hasOwnProperty(key)) {
      var dataAttrName = scriptTagAttrs[key].name;
      if (dataAttrName === 'data-mount-in') {
        selector = scriptTagAttrs[key].nodeValue;
      }
    }
  });
  return selector;
};

/**
 * Return array of 0 or more elements that will host our widget
 * @param  {id} attrId the data widget id attribute the host should have
 * @param  {document} scope  Docuemnt object or DOM Element as a scope
 * @return {Array}        Array of matching habitats
 */
var widgetDOMHostElements = function widgetDOMHostElements(ref) {
  var selector = ref.selector;
  var inline = ref.inline;
  var clientSpecified = ref.clientSpecified;

  var hostNodes = [];
  var currentScript = getExecutedScript();

  if (inline === true) {
    var parentNode = currentScript.parentNode;
    hostNodes.push(parentNode);
  }
  if (clientSpecified === true && !selector) {
    // user did not specify where to mount - get it from script tag attributes
    selector = getHabitatSelectorFromClient(currentScript);
  }
  if (selector) {
    [].forEach.call(document.querySelectorAll(selector), function (queriedTag) {
      hostNodes.push(queriedTag);
    });
  }
  return hostNodes;
};

/**
 * preact render function that will be queued if the DOM is not ready
 * and executed immeidatly if DOM is ready
 */
var preact_habitat_es_preactRender = function preactRender(widget, hostElements, root, cleanRoot, defaultProps) {
  hostElements.forEach(function (elm) {
    var hostNode = elm;
    if (hostNode._habitat) {
      return;
    }
    hostNode._habitat = true;
    var props = collectPropsFromElement(elm, defaultProps) || defaultProps;
    if (cleanRoot) {
      hostNode.innerHTML = "";
    }
    return Object(preact_min["render"])(Object(preact_min["h"])(widget, props), hostNode, root);
  });
};

var habitat = function habitat(Widget) {
  // Widget represents the Preact component we need to mount
  var widget = Widget;
  // preact root render helper
  var root = null;

  var render$$1 = function render$$1(ref) {
    if (ref === void 0) ref = {};
    var selector = ref.selector;if (selector === void 0) selector = null;
    var inline = ref.inline;if (inline === void 0) inline = false;
    var clean = ref.clean;if (clean === void 0) clean = false;
    var clientSpecified = ref.clientSpecified;if (clientSpecified === void 0) clientSpecified = false;
    var defaultProps = ref.defaultProps;if (defaultProps === void 0) defaultProps = {};

    var elements = widgetDOMHostElements({
      selector: selector,
      inline: inline,
      clientSpecified: clientSpecified
    });
    var loaded = function loaded() {
      if (elements.length > 0) {
        var elements$1 = widgetDOMHostElements({
          selector: selector,
          inline: inline,
          clientSpecified: clientSpecified
        });

        return preact_habitat_es_preactRender(widget, elements$1, root, clean, defaultProps);
      }
    };
    loaded();
    document.addEventListener("DOMContentLoaded", loaded);
    document.addEventListener("load", loaded);
  };

  return { render: render$$1 };
};

/* harmony default export */ var preact_habitat_es = (habitat);
//# sourceMappingURL=preact-habitat.es.js.map
// CONCATENATED MODULE: ./services/widget/index.js
var fetchData = function fetchData(url, key) {
  return fetch(url + '/api/v1/widget', { headers: { Authorization: 'API_KEY ' + key } });
};

var submitData = function submitData(url, key, body) {
  return fetch(url + '/api/v1/widget', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: 'API_KEY ' + key,
      'Content-Type': 'application/json'
    }
  });
};

var log = function log(url, key, body) {
  return fetch(url + '/api/v1/widget/analytics', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: 'API_KEY ' + key,
      'Content-Type': 'application/json'
    }
  });
};
// CONCATENATED MODULE: ./components/Input/Input.js
var Input__extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };




function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var Input_Input = function (_Component) {
  _inherits(Input, _Component);

  function Input() {
    _classCallCheck(this, Input);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Input.prototype.render = function render() {
    var _props = this.props,
        label = _props.label,
        as = _props.as,
        onChange = _props.onChange,
        inputProps = _objectWithoutProperties(_props, ['label', 'as', 'onChange']);

    return Object(preact_min["h"])(
      'label',
      null,
      Object(preact_min["h"])(
        'span',
        null,
        label
      ),
      as === 'textarea' ? Object(preact_min["h"])('textarea', Input__extends({ onChange: onChange }, inputProps)) : Object(preact_min["h"])('input', Input__extends({ onInput: onChange }, inputProps))
    );
  };

  return Input;
}(preact_min["Component"]);

;

/* harmony default export */ var components_Input_Input = (Input_Input);
// CONCATENATED MODULE: ./components/Input/index.js


/* harmony default export */ var components_Input = (components_Input_Input);
// EXTERNAL MODULE: ./components/Form/style.scss
var style = __webpack_require__("R9Hi");
var style_default = /*#__PURE__*/__webpack_require__.n(style);

// CONCATENATED MODULE: ./components/Form/Form.js



function Form__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Form__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function Form__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var Form__ref = Object(preact_min["h"])(
  'p',
  null,
  'Twoja wiadomo\u015B\u0107 zosta\u0142a wys\u0142ana!'
);

var _ref2 = Object(preact_min["h"])(
  'button',
  { type: 'submit' },
  'Wy\u015Blij'
);

var Form_Form = function (_Component) {
  Form__inherits(Form, _Component);

  function Form() {
    var _temp, _this, _ret;

    Form__classCallCheck(this, Form);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = Form__possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
      error: null,
      email: null,
      text: null,
      sent: false
    }, _this.handleUpdate = function (name) {
      return function (event) {
        var _this$setState;

        _this.setState((_this$setState = {}, _this$setState[name] = event.target.value, _this$setState));
      };
    }, _this.handleSubmit = function (event) {
      event.preventDefault();
      var _this$state = _this.state,
          email = _this$state.email,
          text = _this$state.text;

      if (!email || !text) {
        return _this.setState({ error: 'Wypełnij wszystkie pola' });
      }

      _this.props.onSubmit({ from: email, text: text });
      _this.setState({ error: null, sent: true });
    }, _temp), Form__possibleConstructorReturn(_this, _ret);
  }

  Form.prototype.render = function render() {
    var _state = this.state,
        sent = _state.sent,
        error = _state.error;

    return !!sent ? Form__ref : Object(preact_min["h"])(
      'form',
      { onSubmit: this.handleSubmit, 'class': style_default.a.form },
      Object(preact_min["h"])(components_Input, {
        required: true,
        name: 'email',
        type: 'email',
        label: 'Email',
        onChange: this.handleUpdate('email')
      }),
      Object(preact_min["h"])(components_Input, {
        required: true,
        as: 'textarea',
        name: 'text',
        type: 'text',
        label: 'Wiadomo\u015B\u0107',
        onChange: this.handleUpdate('text')
      }),
      error && Object(preact_min["h"])(
        'p',
        { 'class': style_default.a.error },
        error
      ),
      _ref2
    );
  };

  return Form;
}(preact_min["Component"]);

/* harmony default export */ var components_Form_Form = (Form_Form);
// CONCATENATED MODULE: ./components/Form/index.js


/* harmony default export */ var components_Form = (components_Form_Form);
// EXTERNAL MODULE: ./components/App/style.scss
var App_style = __webpack_require__("teC+");
var App_style_default = /*#__PURE__*/__webpack_require__.n(App_style);

// CONCATENATED MODULE: ./components/App/App.js



function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function App__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function App__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function App__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var App__ref2 = Object(preact_min["h"])(
  'p',
  null,
  '\u0141adowanie'
);

var App_App = function (_Component) {
  App__inherits(App, _Component);

  function App() {
    var _temp, _this, _ret;

    App__classCallCheck(this, App);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = App__possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
      data: null,
      isOpen: false,
      opened: false
    }, _this.handleSubmit = function (data) {
      submitData(_this.props.url, _this.props.apiKey, data);
    }, _this.handleOpen = function () {
      if (!_this.state.opened) {
        log(_this.props.url, _this.props.apiKey, { event: 'OPENED' });
      }

      _this.setState({ isOpen: true, opened: true });
    }, _this.handleClose = function () {
      _this.setState({ isOpen: false });
    }, _temp), App__possibleConstructorReturn(_this, _ret);
  }

  App.prototype.componentDidMount = function () {
    var _ref = _asyncToGenerator(function* () {
      try {
        var res = yield fetchData(this.props.url, this.props.apiKey).then(function (data) {
          return data.json();
        });
        this.setState({ data: res });
        log(this.props.url, this.props.apiKey, { event: 'VIEWED' });
      } catch (e) {}
    });

    function componentDidMount() {
      return _ref.apply(this, arguments);
    }

    return componentDidMount;
  }();

  App.prototype.render = function render() {
    var _state = this.state,
        data = _state.data,
        isOpen = _state.isOpen;


    return isOpen ? Object(preact_min["h"])(
      'div',
      { 'class': App_style_default.a.container },
      Object(preact_min["h"])(
        'div',
        { onClick: this.handleClose, 'class': App_style_default.a.bar },
        'Zamknij'
      ),
      !data ? App__ref2 : Object(preact_min["h"])(
        preact_min["Fragment"],
        null,
        Object(preact_min["h"])(
          'h1',
          null,
          data.name
        ),
        Object(preact_min["h"])(
          'p',
          null,
          data.text
        ),
        Object(preact_min["h"])(components_Form, { onSubmit: this.handleSubmit })
      )
    ) : Object(preact_min["h"])(
      'button',
      { onClick: this.handleOpen, 'class': App_style_default.a.icon },
      'Skontaktuj si\u0119 z nami'
    );
  };

  return App;
}(preact_min["Component"]);

/* harmony default export */ var components_App_App = (App_App);
// CONCATENATED MODULE: ./components/App/index.js


/* harmony default export */ var components_App = (components_App_App);
// CONCATENATED MODULE: ./index.js
var poly = __webpack_require__("m+Gh");





var _habitat = preact_habitat_es(components_App);

_habitat.render({
  selector: '[data-widget-host="deple-widget"]',
  clean: true
});

/***/ }),

/***/ "KM04":
/***/ (function(module, exports, __webpack_require__) {

!function () {
  "use strict";
  function e(e, t) {
    var n,
        o,
        r,
        i,
        l = W;for (i = arguments.length; i-- > 2;) {
      P.push(arguments[i]);
    }t && null != t.children && (P.length || P.push(t.children), delete t.children);while (P.length) {
      if ((o = P.pop()) && void 0 !== o.pop) for (i = o.length; i--;) {
        P.push(o[i]);
      } else "boolean" == typeof o && (o = null), (r = "function" != typeof e) && (null == o ? o = "" : "number" == typeof o ? o += "" : "string" != typeof o && (r = !1)), r && n ? l[l.length - 1] += o : l === W ? l = [o] : l.push(o), n = r;
    }var a = new T();return a.nodeName = e, a.children = l, a.attributes = null == t ? void 0 : t, a.key = null == t ? void 0 : t.key, void 0 !== M.vnode && M.vnode(a), a;
  }function t(e, t) {
    for (var n in t) {
      e[n] = t[n];
    }return e;
  }function n(e, t) {
    e && ("function" == typeof e ? e(t) : e.current = t);
  }function o(n, o) {
    return e(n.nodeName, t(t({}, n.attributes), o), arguments.length > 2 ? [].slice.call(arguments, 2) : n.children);
  }function r(e) {
    !e.__d && (e.__d = !0) && 1 == V.push(e) && (M.debounceRendering || D)(i);
  }function i() {
    var e;while (e = V.pop()) {
      e.__d && x(e);
    }
  }function l(e, t, n) {
    return "string" == typeof t || "number" == typeof t ? void 0 !== e.splitText : "string" == typeof t.nodeName ? !e._componentConstructor && a(e, t.nodeName) : n || e._componentConstructor === t.nodeName;
  }function a(e, t) {
    return e.__n === t || e.nodeName.toLowerCase() === t.toLowerCase();
  }function u(e) {
    var n = t({}, e.attributes);n.children = e.children;var o = e.nodeName.defaultProps;if (void 0 !== o) for (var r in o) {
      void 0 === n[r] && (n[r] = o[r]);
    }return n;
  }function c(e, t) {
    var n = t ? document.createElementNS("http://www.w3.org/2000/svg", e) : document.createElement(e);return n.__n = e, n;
  }function p(e) {
    var t = e.parentNode;t && t.removeChild(e);
  }function s(e, t, o, r, i) {
    if ("className" === t && (t = "class"), "key" === t) ;else if ("ref" === t) n(o, null), n(r, e);else if ("class" !== t || i) {
      if ("style" === t) {
        if (r && "string" != typeof r && "string" != typeof o || (e.style.cssText = r || ""), r && "object" == typeof r) {
          if ("string" != typeof o) for (var l in o) {
            l in r || (e.style[l] = "");
          }for (var l in r) {
            e.style[l] = "number" == typeof r[l] && !1 === E.test(l) ? r[l] + "px" : r[l];
          }
        }
      } else if ("dangerouslySetInnerHTML" === t) r && (e.innerHTML = r.__html || "");else if ("o" == t[0] && "n" == t[1]) {
        var a = t !== (t = t.replace(/Capture$/, ""));t = t.toLowerCase().substring(2), r ? o || e.addEventListener(t, _, a) : e.removeEventListener(t, _, a), (e.__l || (e.__l = {}))[t] = r;
      } else if ("list" !== t && "type" !== t && !i && t in e) {
        try {
          e[t] = null == r ? "" : r;
        } catch (e) {}null != r && !1 !== r || "spellcheck" == t || e.removeAttribute(t);
      } else {
        var u = i && t !== (t = t.replace(/^xlink:?/, ""));null == r || !1 === r ? u ? e.removeAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase()) : e.removeAttribute(t) : "function" != typeof r && (u ? e.setAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase(), r) : e.setAttribute(t, r));
      }
    } else e.className = r || "";
  }function _(e) {
    return this.__l[e.type](M.event && M.event(e) || e);
  }function f() {
    var e;while (e = A.shift()) {
      M.afterMount && M.afterMount(e), e.componentDidMount && e.componentDidMount();
    }
  }function d(e, t, n, o, r, i) {
    H++ || (R = null != r && void 0 !== r.ownerSVGElement, B = null != e && !("__preactattr_" in e));var l = h(e, t, n, o, i);return r && l.parentNode !== r && r.appendChild(l), --H || (B = !1, i || f()), l;
  }function h(e, t, n, o, r) {
    var i = e,
        l = R;if (null != t && "boolean" != typeof t || (t = ""), "string" == typeof t || "number" == typeof t) return e && void 0 !== e.splitText && e.parentNode && (!e._component || r) ? e.nodeValue != t && (e.nodeValue = t) : (i = document.createTextNode(t), e && (e.parentNode && e.parentNode.replaceChild(i, e), v(e, !0))), i.__preactattr_ = !0, i;var u = t.nodeName;if ("function" == typeof u) return N(e, t, n, o);if (R = "svg" === u || "foreignObject" !== u && R, u += "", (!e || !a(e, u)) && (i = c(u, R), e)) {
      while (e.firstChild) {
        i.appendChild(e.firstChild);
      }e.parentNode && e.parentNode.replaceChild(i, e), v(e, !0);
    }var p = i.firstChild,
        s = i.__preactattr_,
        _ = t.children;if (null == s) {
      s = i.__preactattr_ = {};for (var f = i.attributes, d = f.length; d--;) {
        s[f[d].name] = f[d].value;
      }
    }return !B && _ && 1 === _.length && "string" == typeof _[0] && null != p && void 0 !== p.splitText && null == p.nextSibling ? p.nodeValue != _[0] && (p.nodeValue = _[0]) : (_ && _.length || null != p) && m(i, _, n, o, B || null != s.dangerouslySetInnerHTML), y(i, t.attributes, s), R = l, i;
  }function m(e, t, n, o, r) {
    var i,
        a,
        u,
        c,
        s,
        _ = e.childNodes,
        f = [],
        d = {},
        m = 0,
        b = 0,
        y = _.length,
        g = 0,
        w = t ? t.length : 0;if (0 !== y) for (var C = 0; C < y; C++) {
      var x = _[C],
          N = x.__preactattr_,
          k = w && N ? x._component ? x._component.__k : N.key : null;null != k ? (m++, d[k] = x) : (N || (void 0 !== x.splitText ? !r || x.nodeValue.trim() : r)) && (f[g++] = x);
    }if (0 !== w) for (var C = 0; C < w; C++) {
      c = t[C], s = null;var k = c.key;if (null != k) m && void 0 !== d[k] && (s = d[k], d[k] = void 0, m--);else if (b < g) for (i = b; i < g; i++) {
        if (void 0 !== f[i] && l(a = f[i], c, r)) {
          s = a, f[i] = void 0, i === g - 1 && g--, i === b && b++;break;
        }
      }s = h(s, c, n, o), u = _[C], s && s !== e && s !== u && (null == u ? e.appendChild(s) : s === u.nextSibling ? p(u) : e.insertBefore(s, u));
    }if (m) for (var C in d) {
      void 0 !== d[C] && v(d[C], !1);
    }while (b <= g) {
      void 0 !== (s = f[g--]) && v(s, !1);
    }
  }function v(e, t) {
    var o = e._component;o ? k(o) : (null != e.__preactattr_ && n(e.__preactattr_.ref, null), !1 !== t && null != e.__preactattr_ || p(e), b(e));
  }function b(e) {
    e = e.lastChild;while (e) {
      var t = e.previousSibling;v(e, !0), e = t;
    }
  }function y(e, t, n) {
    var o;for (o in n) {
      t && null != t[o] || null == n[o] || s(e, o, n[o], n[o] = void 0, R);
    }for (o in t) {
      "children" === o || "innerHTML" === o || o in n && t[o] === ("value" === o || "checked" === o ? e[o] : n[o]) || s(e, o, n[o], n[o] = t[o], R);
    }
  }function g(e, t, n) {
    var o,
        r = F.length;e.prototype && e.prototype.render ? (o = new e(t, n), U.call(o, t, n)) : (o = new U(t, n), o.constructor = e, o.render = w);while (r--) {
      if (F[r].constructor === e) return o.__b = F[r].__b, F.splice(r, 1), o;
    }return o;
  }function w(e, t, n) {
    return this.constructor(e, n);
  }function C(e, t, o, i, l) {
    e.__x || (e.__x = !0, e.__r = t.ref, e.__k = t.key, delete t.ref, delete t.key, void 0 === e.constructor.getDerivedStateFromProps && (!e.base || l ? e.componentWillMount && e.componentWillMount() : e.componentWillReceiveProps && e.componentWillReceiveProps(t, i)), i && i !== e.context && (e.__c || (e.__c = e.context), e.context = i), e.__p || (e.__p = e.props), e.props = t, e.__x = !1, 0 !== o && (1 !== o && !1 === M.syncComponentUpdates && e.base ? r(e) : x(e, 1, l)), n(e.__r, e));
  }function x(e, n, o, r) {
    if (!e.__x) {
      var i,
          l,
          a,
          c = e.props,
          p = e.state,
          s = e.context,
          _ = e.__p || c,
          h = e.__s || p,
          m = e.__c || s,
          b = e.base,
          y = e.__b,
          w = b || y,
          N = e._component,
          U = !1,
          S = m;if (e.constructor.getDerivedStateFromProps && (p = t(t({}, p), e.constructor.getDerivedStateFromProps(c, p)), e.state = p), b && (e.props = _, e.state = h, e.context = m, 2 !== n && e.shouldComponentUpdate && !1 === e.shouldComponentUpdate(c, p, s) ? U = !0 : e.componentWillUpdate && e.componentWillUpdate(c, p, s), e.props = c, e.state = p, e.context = s), e.__p = e.__s = e.__c = e.__b = null, e.__d = !1, !U) {
        i = e.render(c, p, s), e.getChildContext && (s = t(t({}, s), e.getChildContext())), b && e.getSnapshotBeforeUpdate && (S = e.getSnapshotBeforeUpdate(_, h));var L,
            T,
            P = i && i.nodeName;if ("function" == typeof P) {
          var W = u(i);l = N, l && l.constructor === P && W.key == l.__k ? C(l, W, 1, s, !1) : (L = l, e._component = l = g(P, W, s), l.__b = l.__b || y, l.__u = e, C(l, W, 0, s, !1), x(l, 1, o, !0)), T = l.base;
        } else a = w, L = N, L && (a = e._component = null), (w || 1 === n) && (a && (a._component = null), T = d(a, i, s, o || !b, w && w.parentNode, !0));if (w && T !== w && l !== N) {
          var D = w.parentNode;D && T !== D && (D.replaceChild(T, w), L || (w._component = null, v(w, !1)));
        }if (L && k(L), e.base = T, T && !r) {
          var E = e,
              V = e;while (V = V.__u) {
            (E = V).base = T;
          }T._component = E, T._componentConstructor = E.constructor;
        }
      }!b || o ? A.push(e) : U || (e.componentDidUpdate && e.componentDidUpdate(_, h, S), M.afterUpdate && M.afterUpdate(e));while (e.__h.length) {
        e.__h.pop().call(e);
      }H || r || f();
    }
  }function N(e, t, n, o) {
    var r = e && e._component,
        i = r,
        l = e,
        a = r && e._componentConstructor === t.nodeName,
        c = a,
        p = u(t);while (r && !c && (r = r.__u)) {
      c = r.constructor === t.nodeName;
    }return r && c && (!o || r._component) ? (C(r, p, 3, n, o), e = r.base) : (i && !a && (k(i), e = l = null), r = g(t.nodeName, p, n), e && !r.__b && (r.__b = e, l = null), C(r, p, 1, n, o), e = r.base, l && e !== l && (l._component = null, v(l, !1))), e;
  }function k(e) {
    M.beforeUnmount && M.beforeUnmount(e);var t = e.base;e.__x = !0, e.componentWillUnmount && e.componentWillUnmount(), e.base = null;var o = e._component;o ? k(o) : t && (null != t.__preactattr_ && n(t.__preactattr_.ref, null), e.__b = t, p(t), F.push(e), b(t)), n(e.__r, null);
  }function U(e, t) {
    this.__d = !0, this.context = t, this.props = e, this.state = this.state || {}, this.__h = [];
  }function S(e, t, n) {
    return d(n, e, {}, !1, t, !1);
  }function L() {
    return {};
  }var T = function T() {},
      M = {},
      P = [],
      W = [],
      D = "function" == typeof Promise ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout,
      E = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i,
      V = [],
      A = [],
      H = 0,
      R = !1,
      B = !1,
      F = [];t(U.prototype, { setState: function setState(e, n) {
      this.__s || (this.__s = this.state), this.state = t(t({}, this.state), "function" == typeof e ? e(this.state, this.props) : e), n && this.__h.push(n), r(this);
    }, forceUpdate: function forceUpdate(e) {
      e && this.__h.push(e), x(this, 2);
    }, render: function render() {} });var j = { h: e, createElement: e, cloneElement: o, createRef: L, Component: U, render: S, rerender: i, options: M }; true ? module.exports = j : self.preact = j;
}();
//# sourceMappingURL=preact.min.js.map

/***/ }),

/***/ "QAmr":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var index = typeof fetch == 'function' ? fetch.bind() : function (url, options) {
	options = options || {};
	return new Promise(function (resolve, reject) {
		var request = new XMLHttpRequest();

		request.open(options.method || 'get', url, true);

		for (var i in options.headers) {
			request.setRequestHeader(i, options.headers[i]);
		}

		request.withCredentials = options.credentials == 'include';

		request.onload = function () {
			resolve(response());
		};

		request.onerror = reject;

		request.send(options.body || null);

		function response() {
			var _keys = [],
			    all = [],
			    headers = {},
			    header;

			request.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function (m, key, value) {
				_keys.push(key = key.toLowerCase());
				all.push([key, value]);
				header = headers[key];
				headers[key] = header ? header + "," + value : value;
			});

			return {
				ok: (request.status / 100 | 0) == 2, // 200-299
				status: request.status,
				statusText: request.statusText,
				url: request.responseURL,
				clone: response,
				text: function text() {
					return Promise.resolve(request.responseText);
				},
				json: function json() {
					return Promise.resolve(request.responseText).then(JSON.parse);
				},
				blob: function blob() {
					return Promise.resolve(new Blob([request.response]));
				},
				headers: {
					keys: function keys() {
						return _keys;
					},
					entries: function entries() {
						return all;
					},
					get: function get(n) {
						return headers[n.toLowerCase()];
					},
					has: function has(n) {
						return n.toLowerCase() in headers;
					}
				}
			};
		}
	});
};

/* harmony default export */ __webpack_exports__["default"] = (index);
//# sourceMappingURL=unfetch.es.js.map

/***/ }),

/***/ "R9Hi":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("sjSc");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("BMrJ")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--4-2!../../../node_modules/postcss-loader/lib/index.js??postcss!../../../node_modules/preact-cli/lib/lib/webpack/proxy-loader.js??ref--2-0!./style.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--4-2!../../../node_modules/postcss-loader/lib/index.js??postcss!../../../node_modules/preact-cli/lib/lib/webpack/proxy-loader.js??ref--2-0!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "VS7n":
/***/ (function(module, exports, __webpack_require__) {

module.exports = window.fetch || (window.fetch = __webpack_require__("QAmr").default || __webpack_require__("QAmr"));

/***/ }),

/***/ "f7Ar":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("lcwS")(true);
// imports


// module
exports.push([module.i, ".icon__143OP{border-radius:25px;border:1px solid #b3b3b3;font:14px Helvetica Neue,arial,sans-serif;font-weight:600;background-color:#191970;color:#fff;cursor:pointer;-webkit-box-align:center;-ms-flex-align:center;align-items:center;outline:none;height:50px;padding:0 20px}.container__1BNiV,.icon__143OP{display:-webkit-box;display:-ms-flexbox;display:flex;text-align:center;-webkit-box-shadow:0 10px 17px 0 #cccacc;box-shadow:0 10px 17px 0 #cccacc}.container__1BNiV{border-radius:16px;border:1px solid #b3b3b3;font:14px/1.21 Helvetica Neue,arial,sans-serif;font-weight:400;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;overflow:hidden;width:300px;max-width:90vw}.container__1BNiV .bar__dwKDr{height:40px;background-color:#191970;color:#fff;cursor:pointer;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end;padding:0 16px;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.container__1BNiV h1{color:#191970}.container__1BNiV p{margin-bottom:20px}", "", {"version":3,"sources":["/home/patryk/Projects/widget/src/components/App/style.scss"],"names":[],"mappings":"AAAA,aACE,mBACA,yBACA,0CACA,gBACA,yBACA,WACA,AACA,eACA,yBAAA,sBAAA,mBACA,aACA,AAEA,YACA,cAAe,CAChB,+BARC,oBAAA,oBAAA,aACA,AAGA,kBACA,yCAAA,gCACA,CAIF,AAFC,kBAGC,mBACA,yBACA,+CACA,gBACA,AACA,4BAAA,6BAAA,0BAAA,sBACA,AAEA,gBACA,YACA,cAAe,CAXjB,8BAcI,YACA,yBACA,WACA,eACA,oBAAA,oBAAA,aACA,qBAAA,kBAAA,yBACA,eACA,yBAAA,sBAAA,kBAAmB,CArBvB,qBAyBI,aAAmB,CAzBvB,oBA6BI,kBAAmB,CACpB","file":"style.scss","sourcesContent":[".icon {\n  border-radius: 25px;\n  border: 1px solid #b3b3b3;\n  font: 14px 'Helvetica Neue', arial, sans-serif;\n  font-weight: 600;\n  background-color: midnightblue;\n  color: white;\n  display: flex;\n  cursor: pointer;\n  align-items: center;\n  outline:none;\n  text-align: center;\n  box-shadow: 0px 10px 17px 0px rgba(204, 202, 204, 1);\n  height: 50px;\n  padding: 0 20px;\n}\n\n.container {\n  border-radius: 16px;\n  border: 1px solid #b3b3b3;\n  font: 14px/1.21 'Helvetica Neue', arial, sans-serif;\n  font-weight: 400;\n  display: flex;\n  flex-direction: column;\n  text-align: center;\n  box-shadow: 0px 10px 17px 0px rgba(204, 202, 204, 1);\n  overflow: hidden;\n  width: 300px;\n  max-width: 90vw;\n\n  .bar {\n    height: 40px;\n    background-color: midnightblue;\n    color: white;\n    cursor: pointer;\n    display: flex;\n    justify-content: flex-end;\n    padding: 0 16px;\n    align-items: center;\n  }\n\n  h1 {\n    color: midnightblue;\n  }\n\n  p {\n    margin-bottom: 20px;\n  }\n}\n"],"sourceRoot":""}]);

// exports
exports.locals = {
	"icon": "icon__143OP",
	"container": "container__1BNiV",
	"bar": "bar__dwKDr"
};

/***/ }),

/***/ "h6ac":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),

/***/ "lcwS":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),

/***/ "m+Gh":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

if (!global.Promise) global.Promise = __webpack_require__("BtxX");
if (!global.fetch) global.fetch = __webpack_require__("VS7n");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("h6ac")))

/***/ }),

/***/ "pwNi":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _preact = __webpack_require__("KM04");

if (false) {
	require('preact/devtools');
} else if (false) {
	navigator.serviceWorker.register(__webpack_public_path__ + 'sw.js');
}

var interopDefault = function interopDefault(m) {
	return m && m.default ? m.default : m;
};

var app = interopDefault(__webpack_require__("JkW7"));

if (typeof app === 'function') {
	var root = document.body.firstElementChild;

	var init = function init() {
		var app = interopDefault(__webpack_require__("JkW7"));
		root = (0, _preact.render)((0, _preact.h)(app), document.body, root);
	};

	if (false) module.hot.accept('preact-cli-entrypoint', init);

	init();
}

/***/ }),

/***/ "sjSc":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("lcwS")(true);
// imports


// module
exports.push([module.i, ".error__8q4FL{color:darkred;background-color:#fefcbf;border-left:2px solid darkred;padding:4px 8px}.form__2OUzf{padding:16px;text-align:left}.form__2OUzf,.form__2OUzf label{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.form__2OUzf label{margin-bottom:12px}.form__2OUzf label span{text-transform:uppercase;font-size:12px;letter-spacing:1.2px;font-weight:600;margin-bottom:4px}.form__2OUzf input,.form__2OUzf textarea{border-radius:4px;border:1px solid #b3b3b3;font-size:16px;font-weight:600;color:#090909}.form__2OUzf input ::-webkit-input-placeholder,.form__2OUzf textarea ::-webkit-input-placeholder{color:#b3b3b3}.form__2OUzf input ::-moz-placeholder,.form__2OUzf textarea ::-moz-placeholder{color:#b3b3b3}.form__2OUzf input ::-ms-input-placeholder,.form__2OUzf textarea ::-ms-input-placeholder{color:#b3b3b3}.form__2OUzf input ::placeholder,.form__2OUzf textarea ::placeholder{color:#b3b3b3}.form__2OUzf input :valid,.form__2OUzf textarea :valid{border-color:#006400}.form__2OUzf input :invalid,.form__2OUzf textarea :invalid{border-color:red}.form__2OUzf input{height:48px;padding:0 14px}.form__2OUzf textarea{padding:14px;resize:none;height:80px;font-family:Helvetica Neue,arial,sans-serif}.form__2OUzf button{border-radius:4px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:0 18px;background-color:#1e90ff;color:#fff;cursor:pointer;border:none;outline:none;height:40px;font-size:16px;font-weight:600;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.form__2OUzf button:hover{background-color:#191970}", "", {"version":3,"sources":["/home/patryk/Projects/widget/src/components/Form/style.scss"],"names":[],"mappings":"AAAA,cACE,cACA,yBACA,8BACA,eAAgB,CACjB,aAGC,aACA,AAEA,eAAe,CAJjB,gCAEE,oBAAA,oBAAA,aACA,4BAAA,6BAAA,0BAAA,qBACA,CAJF,mBASI,kBAAmB,CATvB,wBAYM,yBACA,eACA,qBACA,gBACA,iBAAkB,CAhBxB,yCAsBI,kBACA,yBACA,eACA,gBACA,aAAc,CA1BlB,iGA6BM,aAAc,CA7BpB,+EA6BM,aAAc,CA7BpB,yFA6BM,aAAc,CA7BpB,qEA6BM,aAAc,CA7BpB,uDAkCM,oBAAuB,CAlC7B,2DAsCM,gBAAiB,CAtCvB,mBA2CI,YACA,cAAe,CA5CnB,sBAgDI,aACA,YACA,YACA,2CAAgD,CAnDpD,oBAuDI,kBACA,oBAAA,oBAAA,aACA,yBAAA,sBAAA,mBACA,eACA,yBACA,WACA,eACA,YACA,aACA,YACA,eACA,gBACA,wBAAA,qBAAA,sBAAuB,CAnE3B,0BAsEM,wBAA8B,CAC/B","file":"style.scss","sourcesContent":[".error {\n  color: darkred;\n  background-color: #fefcbf;\n  border-left: 2px solid darkred;\n  padding: 4px 8px;\n}\n\n.form {\n  padding: 16px;\n  display: flex;\n  flex-direction: column;\n  text-align:left;\n\n  label {\n    display: flex;\n    flex-direction: column;\n    margin-bottom: 12px;\n\n    span {\n      text-transform: uppercase;\n      font-size: 12px;\n      letter-spacing: 1.2px;\n      font-weight: 600;\n      margin-bottom: 4px;\n    }\n  }\n\n  input,\n  textarea {\n    border-radius: 4px;\n    border: 1px solid #b3b3b3;\n    font-size: 16px;\n    font-weight: 600;\n    color: #090909;\n\n    ::placeholder {\n      color: #b3b3b3;\n    }\n\n\n    :valid {\n      border-color: darkgreen;\n    }\n\n    :invalid {\n      border-color: red;\n    }\n  }\n\n  input {\n    height: 48px;\n    padding: 0 14px;\n  }\n\n  textarea {\n    padding: 14px;\n    resize: none;\n    height: 80px;\n    font-family: 'Helvetica Neue', arial, sans-serif;\n  }\n\n  button {\n    border-radius: 4px;\n    display: flex;\n    align-items: center;\n    padding: 0 18px;\n    background-color: dodgerblue;\n    color: white;\n    cursor: pointer;\n    border: none;\n    outline: none;\n    height: 40px;\n    font-size: 16px;\n    font-weight: 600;\n    justify-content: center;\n\n    &:hover {\n      background-color: midnightblue;\n    }\n  }\n}\n"],"sourceRoot":""}]);

// exports
exports.locals = {
	"error": "error__8q4FL",
	"form": "form__2OUzf"
};

/***/ }),

/***/ "teC+":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("f7Ar");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("BMrJ")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--4-2!../../../node_modules/postcss-loader/lib/index.js??postcss!../../../node_modules/preact-cli/lib/lib/webpack/proxy-loader.js??ref--2-0!./style.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--4-2!../../../node_modules/postcss-loader/lib/index.js??postcss!../../../node_modules/preact-cli/lib/lib/webpack/proxy-loader.js??ref--2-0!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ })

/******/ });
});
//# sourceMappingURL=bundle.js.map