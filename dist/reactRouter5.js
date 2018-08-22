(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
	(factory((global.reactRouter5 = {}),global.React));
}(this, (function (exports,React) { 'use strict';

	var React__default = 'default' in React ? React['default'] : React;

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	var emptyFunction_1 = emptyFunction;

	var emptyFunction$1 = /*#__PURE__*/Object.freeze({
		default: emptyFunction_1,
		__moduleExports: emptyFunction_1
	});

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var validateFormat = function validateFormat(format) {};

	if (process.env.NODE_ENV !== 'production') {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}

	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	var invariant_1 = invariant;

	var invariant$1 = /*#__PURE__*/Object.freeze({
		default: invariant_1,
		__moduleExports: invariant_1
	});

	var emptyFunction$2 = ( emptyFunction$1 && emptyFunction_1 ) || emptyFunction$1;

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = emptyFunction$2;

	if (process.env.NODE_ENV !== 'production') {
	  (function () {
	    var printWarning = function printWarning(format) {
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // --- Welcome to debugging React ---
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch (x) {}
	    };

	    warning = function warning(condition, format) {
	      if (format === undefined) {
	        throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	      }

	      if (format.indexOf('Failed Composite propType: ') === 0) {
	        return; // Ignore CompositeComponent proptype check.
	      }

	      if (!condition) {
	        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	          args[_key2 - 2] = arguments[_key2];
	        }

	        printWarning.apply(undefined, [format].concat(args));
	      }
	    };
	  })();
	}

	var warning_1 = warning;

	var warning$1 = /*#__PURE__*/Object.freeze({
		default: warning_1,
		__moduleExports: warning_1
	});

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	var ReactPropTypesSecret_1 = ReactPropTypesSecret;

	var ReactPropTypesSecret$1 = /*#__PURE__*/Object.freeze({
		default: ReactPropTypesSecret_1,
		__moduleExports: ReactPropTypesSecret_1
	});

	var require$$0 = ( invariant$1 && invariant_1 ) || invariant$1;

	var require$$1 = ( warning$1 && warning_1 ) || warning$1;

	var require$$2 = ( ReactPropTypesSecret$1 && ReactPropTypesSecret_1 ) || ReactPropTypesSecret$1;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

	var inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	var objectWithoutProperties = function (obj, keys) {
	  var target = {};

	  for (var i in obj) {
	    if (keys.indexOf(i) >= 0) continue;
	    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
	    target[i] = obj[i];
	  }

	  return target;
	};

	var possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	if (process.env.NODE_ENV !== 'production') {
	  var invariant$2 = require$$0;
	  var warning$2 = require$$1;
	  var ReactPropTypesSecret$2 = require$$2;
	  var loggedTypeFailures = {};
	}

	/**
	 * Assert that the values match with the type specs.
	 * Error messages are memorized and will only be shown once.
	 *
	 * @param {object} typeSpecs Map of name to a ReactPropType
	 * @param {object} values Runtime values that need to be type-checked
	 * @param {string} location e.g. "prop", "context", "child context"
	 * @param {string} componentName Name of the component for error messages.
	 * @param {?Function} getStack Returns the component stack.
	 * @private
	 */
	function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
	  if (process.env.NODE_ENV !== 'production') {
	    for (var typeSpecName in typeSpecs) {
	      if (typeSpecs.hasOwnProperty(typeSpecName)) {
	        var error;
	        // Prop type validation may throw. In case they do, we don't want to
	        // fail the render phase where it didn't fail before. So we log it.
	        // After these have been cleaned up, we'll let them throw.
	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          invariant$2(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', componentName || 'React class', location, typeSpecName);
	          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$2);
	        } catch (ex) {
	          error = ex;
	        }
	        warning$2(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error === 'undefined' ? 'undefined' : _typeof(error));
	        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	          // Only monitor this failure once because there tends to be a lot of the
	          // same error.
	          loggedTypeFailures[error.message] = true;

	          var stack = getStack ? getStack() : '';

	          warning$2(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
	        }
	      }
	    }
	  }
	}

	var checkPropTypes_1 = checkPropTypes;

	var checkPropTypes$1 = /*#__PURE__*/Object.freeze({
		default: checkPropTypes_1,
		__moduleExports: checkPropTypes_1
	});

	var checkPropTypes$2 = ( checkPropTypes$1 && checkPropTypes_1 ) || checkPropTypes$1;

	var factoryWithTypeCheckers = function factoryWithTypeCheckers(isValidElement, throwOnDirectAccess) {
	  /* global Symbol */
	  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

	  /**
	   * Returns the iterator method function contained on the iterable object.
	   *
	   * Be sure to invoke the function with the iterable as context:
	   *
	   *     var iteratorFn = getIteratorFn(myIterable);
	   *     if (iteratorFn) {
	   *       var iterator = iteratorFn.call(myIterable);
	   *       ...
	   *     }
	   *
	   * @param {?object} maybeIterable
	   * @return {?function}
	   */
	  function getIteratorFn(maybeIterable) {
	    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }

	  /**
	   * Collection of methods that allow declaration and validation of props that are
	   * supplied to React components. Example usage:
	   *
	   *   var Props = require('ReactPropTypes');
	   *   var MyArticle = React.createClass({
	   *     propTypes: {
	   *       // An optional string prop named "description".
	   *       description: Props.string,
	   *
	   *       // A required enum prop named "category".
	   *       category: Props.oneOf(['News','Photos']).isRequired,
	   *
	   *       // A prop named "dialog" that requires an instance of Dialog.
	   *       dialog: Props.instanceOf(Dialog).isRequired
	   *     },
	   *     render: function() { ... }
	   *   });
	   *
	   * A more formal specification of how these methods are used:
	   *
	   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
	   *   decl := ReactPropTypes.{type}(.isRequired)?
	   *
	   * Each and every declaration produces a function with the same signature. This
	   * allows the creation of custom validation functions. For example:
	   *
	   *  var MyLink = React.createClass({
	   *    propTypes: {
	   *      // An optional string or URI prop named "href".
	   *      href: function(props, propName, componentName) {
	   *        var propValue = props[propName];
	   *        if (propValue != null && typeof propValue !== 'string' &&
	   *            !(propValue instanceof URI)) {
	   *          return new Error(
	   *            'Expected a string or an URI for ' + propName + ' in ' +
	   *            componentName
	   *          );
	   *        }
	   *      }
	   *    },
	   *    render: function() {...}
	   *  });
	   *
	   * @internal
	   */

	  var ANONYMOUS = '<<anonymous>>';

	  // Important!
	  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
	  var ReactPropTypes = {
	    array: createPrimitiveTypeChecker('array'),
	    bool: createPrimitiveTypeChecker('boolean'),
	    func: createPrimitiveTypeChecker('function'),
	    number: createPrimitiveTypeChecker('number'),
	    object: createPrimitiveTypeChecker('object'),
	    string: createPrimitiveTypeChecker('string'),
	    symbol: createPrimitiveTypeChecker('symbol'),

	    any: createAnyTypeChecker(),
	    arrayOf: createArrayOfTypeChecker,
	    element: createElementTypeChecker(),
	    instanceOf: createInstanceTypeChecker,
	    node: createNodeChecker(),
	    objectOf: createObjectOfTypeChecker,
	    oneOf: createEnumTypeChecker,
	    oneOfType: createUnionTypeChecker,
	    shape: createShapeTypeChecker
	  };

	  /**
	   * inlined Object.is polyfill to avoid requiring consumers ship their own
	   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	   */
	  /*eslint-disable no-self-compare*/
	  function is(x, y) {
	    // SameValue algorithm
	    if (x === y) {
	      // Steps 1-5, 7-10
	      // Steps 6.b-6.e: +0 != -0
	      return x !== 0 || 1 / x === 1 / y;
	    } else {
	      // Step 6.a: NaN == NaN
	      return x !== x && y !== y;
	    }
	  }
	  /*eslint-enable no-self-compare*/

	  /**
	   * We use an Error-like object for backward compatibility as people may call
	   * PropTypes directly and inspect their output. However, we don't use real
	   * Errors anymore. We don't inspect their stack anyway, and creating them
	   * is prohibitively expensive if they are created too often, such as what
	   * happens in oneOfType() for any type before the one that matched.
	   */
	  function PropTypeError(message) {
	    this.message = message;
	    this.stack = '';
	  }
	  // Make `instanceof Error` still work for returned errors.
	  PropTypeError.prototype = Error.prototype;

	  function createChainableTypeChecker(validate) {
	    if (process.env.NODE_ENV !== 'production') {
	      var manualPropTypeCallCache = {};
	      var manualPropTypeWarningCount = 0;
	    }
	    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
	      componentName = componentName || ANONYMOUS;
	      propFullName = propFullName || propName;

	      if (secret !== require$$2) {
	        if (throwOnDirectAccess) {
	          // New behavior only for users of `prop-types` package
	          require$$0(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
	        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
	          // Old behavior for people using React.PropTypes
	          var cacheKey = componentName + ':' + propName;
	          if (!manualPropTypeCallCache[cacheKey] &&
	          // Avoid spamming the console because they are often not actionable except for lib authors
	          manualPropTypeWarningCount < 3) {
	            require$$1(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.', propFullName, componentName);
	            manualPropTypeCallCache[cacheKey] = true;
	            manualPropTypeWarningCount++;
	          }
	        }
	      }
	      if (props[propName] == null) {
	        if (isRequired) {
	          if (props[propName] === null) {
	            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
	          }
	          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
	        }
	        return null;
	      } else {
	        return validate(props, propName, componentName, location, propFullName);
	      }
	    }

	    var chainedCheckType = checkType.bind(null, false);
	    chainedCheckType.isRequired = checkType.bind(null, true);

	    return chainedCheckType;
	  }

	  function createPrimitiveTypeChecker(expectedType) {
	    function validate(props, propName, componentName, location, propFullName, secret) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== expectedType) {
	        // `propValue` being instance of, say, date/regexp, pass the 'object'
	        // check, but we can offer a more precise error message here rather than
	        // 'of type `object`'.
	        var preciseType = getPreciseType(propValue);

	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createAnyTypeChecker() {
	    return createChainableTypeChecker(emptyFunction$2.thatReturnsNull);
	  }

	  function createArrayOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
	      }
	      var propValue = props[propName];
	      if (!Array.isArray(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
	      }
	      for (var i = 0; i < propValue.length; i++) {
	        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', require$$2);
	        if (error instanceof Error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createElementTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!isValidElement(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createInstanceTypeChecker(expectedClass) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!(props[propName] instanceof expectedClass)) {
	        var expectedClassName = expectedClass.name || ANONYMOUS;
	        var actualClassName = getClassName(props[propName]);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createEnumTypeChecker(expectedValues) {
	    if (!Array.isArray(expectedValues)) {
	      process.env.NODE_ENV !== 'production' ? require$$1(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
	      return emptyFunction$2.thatReturnsNull;
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      for (var i = 0; i < expectedValues.length; i++) {
	        if (is(propValue, expectedValues[i])) {
	          return null;
	        }
	      }

	      var valuesString = JSON.stringify(expectedValues);
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createObjectOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
	      }
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
	      }
	      for (var key in propValue) {
	        if (propValue.hasOwnProperty(key)) {
	          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, require$$2);
	          if (error instanceof Error) {
	            return error;
	          }
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createUnionTypeChecker(arrayOfTypeCheckers) {
	    if (!Array.isArray(arrayOfTypeCheckers)) {
	      process.env.NODE_ENV !== 'production' ? require$$1(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
	      return emptyFunction$2.thatReturnsNull;
	    }

	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (typeof checker !== 'function') {
	        require$$1(false, 'Invalid argument supplid to oneOfType. Expected an array of check functions, but ' + 'received %s at index %s.', getPostfixForTypeWarning(checker), i);
	        return emptyFunction$2.thatReturnsNull;
	      }
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	        var checker = arrayOfTypeCheckers[i];
	        if (checker(props, propName, componentName, location, propFullName, require$$2) == null) {
	          return null;
	        }
	      }

	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createNodeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!isNode(props[propName])) {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      for (var key in shapeTypes) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          continue;
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, require$$2);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function isNode(propValue) {
	    switch (typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue)) {
	      case 'number':
	      case 'string':
	      case 'undefined':
	        return true;
	      case 'boolean':
	        return !propValue;
	      case 'object':
	        if (Array.isArray(propValue)) {
	          return propValue.every(isNode);
	        }
	        if (propValue === null || isValidElement(propValue)) {
	          return true;
	        }

	        var iteratorFn = getIteratorFn(propValue);
	        if (iteratorFn) {
	          var iterator = iteratorFn.call(propValue);
	          var step;
	          if (iteratorFn !== propValue.entries) {
	            while (!(step = iterator.next()).done) {
	              if (!isNode(step.value)) {
	                return false;
	              }
	            }
	          } else {
	            // Iterator will provide entry [k,v] tuples rather than values.
	            while (!(step = iterator.next()).done) {
	              var entry = step.value;
	              if (entry) {
	                if (!isNode(entry[1])) {
	                  return false;
	                }
	              }
	            }
	          }
	        } else {
	          return false;
	        }

	        return true;
	      default:
	        return false;
	    }
	  }

	  function isSymbol(propType, propValue) {
	    // Native Symbol.
	    if (propType === 'symbol') {
	      return true;
	    }

	    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
	    if (propValue['@@toStringTag'] === 'Symbol') {
	      return true;
	    }

	    // Fallback for non-spec compliant Symbols which are polyfilled.
	    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
	      return true;
	    }

	    return false;
	  }

	  // Equivalent of `typeof` but with special handling for array and regexp.
	  function getPropType(propValue) {
	    var propType = typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue);
	    if (Array.isArray(propValue)) {
	      return 'array';
	    }
	    if (propValue instanceof RegExp) {
	      // Old webkits (at least until Android 4.0) return 'function' rather than
	      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
	      // passes PropTypes.object.
	      return 'object';
	    }
	    if (isSymbol(propType, propValue)) {
	      return 'symbol';
	    }
	    return propType;
	  }

	  // This handles more types than `getPropType`. Only used for error messages.
	  // See `createPrimitiveTypeChecker`.
	  function getPreciseType(propValue) {
	    if (typeof propValue === 'undefined' || propValue === null) {
	      return '' + propValue;
	    }
	    var propType = getPropType(propValue);
	    if (propType === 'object') {
	      if (propValue instanceof Date) {
	        return 'date';
	      } else if (propValue instanceof RegExp) {
	        return 'regexp';
	      }
	    }
	    return propType;
	  }

	  // Returns a string that is postfixed to a warning about an invalid type.
	  // For example, "undefined" or "of type array"
	  function getPostfixForTypeWarning(value) {
	    var type = getPreciseType(value);
	    switch (type) {
	      case 'array':
	      case 'object':
	        return 'an ' + type;
	      case 'boolean':
	      case 'date':
	      case 'regexp':
	        return 'a ' + type;
	      default:
	        return type;
	    }
	  }

	  // Returns class name of the object, if any.
	  function getClassName(propValue) {
	    if (!propValue.constructor || !propValue.constructor.name) {
	      return ANONYMOUS;
	    }
	    return propValue.constructor.name;
	  }

	  ReactPropTypes.checkPropTypes = checkPropTypes$2;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};

	var factoryWithTypeCheckers$1 = /*#__PURE__*/Object.freeze({
		default: factoryWithTypeCheckers,
		__moduleExports: factoryWithTypeCheckers
	});

	var factoryWithThrowingShims = function factoryWithThrowingShims() {
	  function shim(props, propName, componentName, location, propFullName, secret) {
	    if (secret === require$$2) {
	      // It is still safe when called from React.
	      return;
	    }
	    require$$0(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
	  }  shim.isRequired = shim;
	  function getShim() {
	    return shim;
	  }  // Important!
	  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
	  var ReactPropTypes = {
	    array: shim,
	    bool: shim,
	    func: shim,
	    number: shim,
	    object: shim,
	    string: shim,
	    symbol: shim,

	    any: shim,
	    arrayOf: getShim,
	    element: shim,
	    instanceOf: getShim,
	    node: shim,
	    objectOf: getShim,
	    oneOf: getShim,
	    oneOfType: getShim,
	    shape: getShim
	  };

	  ReactPropTypes.checkPropTypes = emptyFunction$2;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};

	var factoryWithThrowingShims$1 = /*#__PURE__*/Object.freeze({
		default: factoryWithThrowingShims,
		__moduleExports: factoryWithThrowingShims
	});

	var require$$0$1 = ( factoryWithTypeCheckers$1 && factoryWithTypeCheckers ) || factoryWithTypeCheckers$1;

	var require$$1$1 = ( factoryWithThrowingShims$1 && factoryWithThrowingShims ) || factoryWithThrowingShims$1;

	var propTypes = createCommonjsModule(function (module) {
	  /**
	   * Copyright 2013-present, Facebook, Inc.
	   * All rights reserved.
	   *
	   * This source code is licensed under the BSD-style license found in the
	   * LICENSE file in the root directory of this source tree. An additional grant
	   * of patent rights can be found in the PATENTS file in the same directory.
	   */

	  if (process.env.NODE_ENV !== 'production') {
	    var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 0xeac7;

	    var isValidElement = function isValidElement(object) {
	      return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	    };

	    // By explicitly using `prop-types` you are opting into new development behavior.
	    // http://fb.me/prop-types-in-prod
	    var throwOnDirectAccess = true;
	    module.exports = require$$0$1(isValidElement, throwOnDirectAccess);
	  } else {
	    // By explicitly using `prop-types` you are opting into new production behavior.
	    // http://fb.me/prop-types-in-prod
	    module.exports = require$$1$1();
	  }
	});

	var BaseLink = function (_Component) {
	    inherits(BaseLink, _Component);

	    function BaseLink(props, context) {
	        classCallCheck(this, BaseLink);

	        var _this = possibleConstructorReturn(this, (BaseLink.__proto__ || Object.getPrototypeOf(BaseLink)).call(this, props, context));

	        _this.router = context.router;

	        if (!_this.router.hasPlugin('BROWSER_PLUGIN')) {
	            console.error('[react-router5][BaseLink] missing browser plugin, href might be built incorrectly');
	        }

	        _this.isActive = _this.isActive.bind(_this);
	        _this.clickHandler = _this.clickHandler.bind(_this);
	        _this.callback = _this.callback.bind(_this);

	        _this.state = { active: _this.isActive() };
	        return _this;
	    }

	    createClass(BaseLink, [{
	        key: 'buildUrl',
	        value: function buildUrl(routeName, routeParams) {
	            if (this.router.buildUrl) {
	                return this.router.buildUrl(routeName, routeParams);
	            }

	            return this.router.buildPath(routeName, routeParams);
	        }
	    }, {
	        key: 'isActive',
	        value: function isActive() {
	            return this.router.isActive(this.props.routeName, this.props.routeParams, this.props.activeStrict, this.props.ignoreQueryParams);
	        }
	    }, {
	        key: 'callback',
	        value: function callback(err, state) {
	            if (!err && this.props.successCallback) {
	                this.props.successCallback(state);
	            }

	            if (err && this.props.errorCallback) {
	                this.props.errorCallback(err);
	            }
	        }
	    }, {
	        key: 'clickHandler',
	        value: function clickHandler(evt) {
	            if (this.props.onClick) {
	                this.props.onClick(evt);

	                if (evt.defaultPrevented) {
	                    return;
	                }
	            }

	            var comboKey = evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey;

	            if (evt.button === 0 && !comboKey) {
	                evt.preventDefault();
	                this.router.navigate(this.props.routeName, this.props.routeParams, this.props.routeOptions, this.callback);
	            }
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            /* eslint-disable */
	            var _props = this.props,
	                routeName = _props.routeName,
	                routeParams = _props.routeParams,
	                routeOptions = _props.routeOptions,
	                className = _props.className,
	                activeClassName = _props.activeClassName,
	                activeStrict = _props.activeStrict,
	                ignoreQueryParams = _props.ignoreQueryParams,
	                route = _props.route,
	                previousRoute = _props.previousRoute,
	                router = _props.router,
	                children = _props.children,
	                onClick = _props.onClick,
	                successCallback = _props.successCallback,
	                errorCallback = _props.errorCallback,
	                linkProps = objectWithoutProperties(_props, ['routeName', 'routeParams', 'routeOptions', 'className', 'activeClassName', 'activeStrict', 'ignoreQueryParams', 'route', 'previousRoute', 'router', 'children', 'onClick', 'successCallback', 'errorCallback']);
	            /* eslint-enable */

	            var active = this.isActive();
	            var href = this.buildUrl(routeName, routeParams);
	            var linkclassName = (active ? [activeClassName] : []).concat(className ? className.split(' ') : []).join(' ');

	            return React__default.createElement('a', _extends({}, linkProps, {
	                href: href,
	                className: linkclassName,
	                onClick: this.clickHandler
	            }), children);
	        }
	    }]);
	    return BaseLink;
	}(React.Component);

	BaseLink.contextTypes = {
	    router: propTypes.object.isRequired
	};

	BaseLink.propTypes = {
	    routeName: propTypes.string.isRequired,
	    routeParams: propTypes.object,
	    routeOptions: propTypes.object,
	    activeClassName: propTypes.string,
	    activeStrict: propTypes.bool,
	    ignoreQueryParams: propTypes.bool,
	    onClick: propTypes.func,
	    onMouseOver: propTypes.func,
	    successCallback: propTypes.func,
	    errorCallback: propTypes.func
	};

	BaseLink.defaultProps = {
	    activeClassName: 'active',
	    activeStrict: false,
	    ignoreQueryParams: true,
	    routeParams: {},
	    routeOptions: {}
	};

	var getDisplayName = function getDisplayName(component) {
	    return component.displayName || component.name || 'Component';
	};

	var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
	    return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

	function nameToIDs(name) {
	    return name.split('.').reduce(function (ids, name) {
	        return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
	    }, []);
	}

	function exists(val) {
	    return val !== undefined && val !== null;
	}

	function hasMetaParams(state) {
	    return state && state.meta && state.meta.params;
	}

	function extractSegmentParams(name, state) {
	    if (!exists(state.meta.params[name])) return {};

	    return Object.keys(state.meta.params[name]).reduce(function (params, p) {
	        params[p] = state.params[p];
	        return params;
	    }, {});
	}

	function transitionPath(toState, fromState) {
	    var fromStateIds = fromState ? nameToIDs(fromState.name) : [];
	    var toStateIds = nameToIDs(toState.name);
	    var maxI = Math.min(fromStateIds.length, toStateIds.length);

	    function pointOfDifference() {
	        var i = void 0;

	        var _loop = function _loop() {
	            var left = fromStateIds[i];
	            var right = toStateIds[i];

	            if (left !== right) return {
	                v: i
	            };

	            var leftParams = extractSegmentParams(left, toState);
	            var rightParams = extractSegmentParams(right, fromState);

	            if (leftParams.length !== rightParams.length) return {
	                v: i
	            };
	            if (leftParams.length === 0) return 'continue';

	            var different = Object.keys(leftParams).some(function (p) {
	                return rightParams[p] !== leftParams[p];
	            });
	            if (different) {
	                return {
	                    v: i
	                };
	            }
	        };

	        for (i = 0; i < maxI; i += 1) {
	            var _ret = _loop();

	            switch (_ret) {
	                case 'continue':
	                    continue;

	                default:
	                    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof$1(_ret)) === "object") return _ret.v;
	            }
	        }

	        return i;
	    }

	    var i = void 0;
	    if (!fromState) {
	        i = 0;
	    } else if (!hasMetaParams(fromState) && !hasMetaParams(toState)) {
	        i = 0;
	    } else {
	        i = pointOfDifference();
	    }

	    var toDeactivate = fromStateIds.slice(i).reverse();
	    var toActivate = toStateIds.slice(i);

	    var intersection = fromState && i > 0 ? fromStateIds[i - 1] : '';

	    return {
	        intersection: intersection,
	        toDeactivate: toDeactivate,
	        toActivate: toActivate
	    };
	}

	function _toConsumableArray(arr) {
	    if (Array.isArray(arr)) {
	        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	            arr2[i] = arr[i];
	        }return arr2;
	    } else {
	        return Array.from(arr);
	    }
	}

	function shouldUpdateNode(nodeName) {
	    return function (toState, fromSate) {
	        var _transitionPath = transitionPath(toState, fromSate),
	            intersection = _transitionPath.intersection,
	            toActivate = _transitionPath.toActivate,
	            toDeactivateReversed = _transitionPath.toDeactivate;

	        var toDeactivate = [].concat(_toConsumableArray(toDeactivateReversed)).reverse();

	        if (toState.meta.options && toState.meta.options.reload) {
	            return true;
	        }

	        if (nodeName === intersection) {
	            return true;
	        }

	        if (toActivate.indexOf(nodeName) === -1) {
	            return false;
	        }

	        var matching = true;

	        for (var i = 0; i < toActivate.length; i += 1) {
	            var activatedSegment = toActivate[i];
	            var sameLevelDeactivatedSegment = toDeactivate[i];

	            matching = activatedSegment === sameLevelDeactivatedSegment;

	            if (matching && activatedSegment === nodeName) {
	                return true;
	            }

	            if (!matching) {
	                return false;
	            }
	        }

	        // Should never be reached
	        return false;
	    };
	}

	function routeNode(nodeName) {
	    return function routeNodeWrapper(RouteSegment) {
	        var RouteNode = function (_Component) {
	            inherits(RouteNode, _Component);

	            function RouteNode(props, context) {
	                classCallCheck(this, RouteNode);

	                var _this = possibleConstructorReturn(this, (RouteNode.__proto__ || Object.getPrototypeOf(RouteNode)).call(this, props, context));

	                _this.router = context.router;
	                _this.state = {
	                    previousRoute: null,
	                    route: _this.router.getState()
	                };

	                if (typeof window !== 'undefined') {
	                    var listener = function listener(_ref) {
	                        var route = _ref.route,
	                            previousRoute = _ref.previousRoute;

	                        if (shouldUpdateNode(nodeName)(route, previousRoute)) {
	                            _this.setState({
	                                previousRoute: previousRoute,
	                                route: route
	                            });
	                        }
	                    };
	                    _this.unsubscribe = _this.router.subscribe(listener);
	                }
	                return _this;
	            }

	            createClass(RouteNode, [{
	                key: 'componentWillUnmount',
	                value: function componentWillUnmount() {
	                    if (this.unsubscribe) {
	                        this.unsubscribe();
	                    }
	                }
	            }, {
	                key: 'render',
	                value: function render() {
	                    var props = this.props,
	                        router = this.router;
	                    var _state = this.state,
	                        previousRoute = _state.previousRoute,
	                        route = _state.route;

	                    var component = React.createElement(RouteSegment, _extends({}, props, {
	                        router: router,
	                        previousRoute: previousRoute,
	                        route: route
	                    }));

	                    return component;
	                }
	            }]);
	            return RouteNode;
	        }(React.Component);

	        RouteNode.contextTypes = {
	            router: propTypes.object.isRequired
	        };

	        RouteNode.displayName = 'RouteNode[' + getDisplayName(RouteSegment) + ']';

	        return RouteNode;
	    };
	}

	var RouterProvider = function (_Component) {
	    inherits(RouterProvider, _Component);

	    function RouterProvider(props, context) {
	        classCallCheck(this, RouterProvider);

	        var _this = possibleConstructorReturn(this, (RouterProvider.__proto__ || Object.getPrototypeOf(RouterProvider)).call(this, props, context));

	        _this.router = props.router;
	        return _this;
	    }

	    createClass(RouterProvider, [{
	        key: 'getChildContext',
	        value: function getChildContext() {
	            return { router: this.router };
	        }
	    }, {
	        key: 'componentWillReceiveProps',
	        value: function componentWillReceiveProps(nextProps) {
	            if (this.props.router !== nextProps.router) {
	                console.error('[react-router5][RouterProvider] does not support changing the router object.');
	            }
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var children = this.props.children;

	            return React.Children.only(children);
	        }
	    }]);
	    return RouterProvider;
	}(React.Component);

	RouterProvider.propTypes = {
	    router: propTypes.object.isRequired,
	    children: propTypes.element.isRequired
	};

	RouterProvider.childContextTypes = {
	    router: propTypes.object.isRequired
	};

	function withRoute(BaseComponent) {
	    var ComponentWithRoute = function (_Component) {
	        inherits(ComponentWithRoute, _Component);

	        function ComponentWithRoute(props, context) {
	            classCallCheck(this, ComponentWithRoute);

	            var _this = possibleConstructorReturn(this, (ComponentWithRoute.__proto__ || Object.getPrototypeOf(ComponentWithRoute)).call(this, props, context));

	            _this.router = context.router;
	            _this.state = {
	                previousRoute: null,
	                route: _this.router.getState()
	            };

	            if (typeof window !== 'undefined') {
	                var listener = function listener(_ref) {
	                    var route = _ref.route,
	                        previousRoute = _ref.previousRoute;

	                    _this.setState({ route: route, previousRoute: previousRoute });
	                };
	                _this.unsubscribe = _this.router.subscribe(listener);
	            }
	            return _this;
	        }

	        createClass(ComponentWithRoute, [{
	            key: 'componentWillUnmount',
	            value: function componentWillUnmount() {
	                if (this.unsubscribe) {
	                    this.unsubscribe();
	                }
	            }
	        }, {
	            key: 'render',
	            value: function render() {
	                return React.createElement(BaseComponent, _extends({}, this.props, this.state, {
	                    router: this.router
	                }));
	            }
	        }]);
	        return ComponentWithRoute;
	    }(React.Component);

	    ComponentWithRoute.contextTypes = {
	        router: propTypes.object.isRequired
	    };

	    ComponentWithRoute.displayName = 'WithRoute[' + getDisplayName(BaseComponent) + ']';

	    return ComponentWithRoute;
	}

	var emptyCreateContext = function emptyCreateContext() {
	    return {
	        Provider: function Provider(_ref) {
	            var children = _ref.children;
	            return children;
	        },
	        Consumer: function Consumer() {
	            return null;
	        }
	    };
	};

	var createContext = React__default.createContext || emptyCreateContext;

	var _createContext = createContext({}),
	    Provider = _createContext.Provider,
	    Route = _createContext.Consumer;

	var RouteProvider = function (_React$PureComponent) {
	    inherits(RouteProvider, _React$PureComponent);

	    function RouteProvider(props) {
	        classCallCheck(this, RouteProvider);

	        var _this = possibleConstructorReturn(this, (RouteProvider.__proto__ || Object.getPrototypeOf(RouteProvider)).call(this, props));

	        var router = props.router;


	        _this.router = router;
	        _this.state = {
	            route: router.getState(),
	            previousRoute: null,
	            router: router
	        };

	        if (typeof window !== 'undefined') {
	            var listener = function listener(_ref2) {
	                var route = _ref2.route,
	                    previousRoute = _ref2.previousRoute;

	                _this.setState({
	                    route: route,
	                    previousRoute: previousRoute
	                });
	            };
	            _this.unsubscribe = _this.router.subscribe(listener);
	        }
	        return _this;
	    }

	    createClass(RouteProvider, [{
	        key: 'componentWillUnmount',
	        value: function componentWillUnmount() {
	            if (this.unsubscribe) {
	                this.unsubscribe();
	            }
	        }
	    }, {
	        key: 'getChildContext',
	        value: function getChildContext() {
	            return { router: this.props.router };
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return React__default.createElement(
	                Provider,
	                { value: this.state },
	                this.props.children
	            );
	        }
	    }]);
	    return RouteProvider;
	}(React__default.PureComponent);

	RouteProvider.childContextTypes = {
	    router: propTypes.object.isRequired
	};

	RouteProvider.propTypes = {
	    router: propTypes.object.isRequired,
	    children: propTypes.node.isRequired
	};

	var RouteNode = function (_React$Component) {
	    inherits(RouteNode, _React$Component);

	    function RouteNode(props, context) {
	        classCallCheck(this, RouteNode);

	        var _this2 = possibleConstructorReturn(this, (RouteNode.__proto__ || Object.getPrototypeOf(RouteNode)).call(this, props, context));

	        _this2.renderOnRouteNodeChange = _this2.renderOnRouteNodeChange.bind(_this2);
	        return _this2;
	    }

	    createClass(RouteNode, [{
	        key: 'renderOnRouteNodeChange',
	        value: function renderOnRouteNodeChange(routeContext) {
	            var shouldUpdate = shouldUpdateNode(this.props.nodeName)(routeContext.route, routeContext.previousRoute);

	            if (!this.memoizedResult || shouldUpdate) {
	                this.memoizedResult = this.props.children(routeContext);
	            }

	            return this.memoizedResult;
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return React__default.createElement(
	                Route,
	                null,
	                this.renderOnRouteNodeChange
	            );
	        }
	    }]);
	    return RouteNode;
	}(React__default.Component);

	RouteNode.propTypes = {
	    nodeName: propTypes.string.isRequired,
	    children: propTypes.func.isRequired
	};

	var Link = withRoute(BaseLink);

	exports.BaseLink = BaseLink;
	exports.routeNode = routeNode;
	exports.RouterProvider = RouterProvider;
	exports.withRoute = withRoute;
	exports.Link = Link;
	exports.RouteProvider = RouteProvider;
	exports.Route = Route;
	exports.RouteNode = RouteNode;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
