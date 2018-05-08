"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultValidators = exports.isEmpty = exports.validate = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _isEmpty = require("lodash/isEmpty");

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _isFinite = require("lodash/isFinite");

var _isFinite2 = _interopRequireDefault(_isFinite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validate = exports.validate = function validate(name, value, rules) {
  var validators = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultValidators;

  if (!rules) return;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.entries(rules)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;

      var _ref2 = _slicedToArray(_ref, 2);

      var rule = _ref2[0];
      var constraint = _ref2[1];

      var result = rule in validators && validators[rule](value, constraint);
      if (result) return result;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

var isEmpty = exports.isEmpty = function isEmpty(value) {
  return !(0, _isFinite2.default)(value) && (0, _isEmpty2.default)(value);
};

var defaultValidators = exports.defaultValidators = {

  abn: function abn(value) {
    return isEmpty(value) || /^(\d *?){11}$/.test(value) ? undefined : "Must be a valid ABN";
  },

  email: function email(value) {
    return isEmpty(value) || /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) ? undefined : "Must be a valid email address";
  },

  max: function max(value, maximum) {
    return isEmpty(value) || value <= maximum ? undefined : "Must be " + maximum + " or less";
  },

  min: function min(value, minimum) {
    return isEmpty(value) || value >= minimum ? undefined : "Must be " + minimum + " or greater";
  },

  postcode: function postcode(value) {
    return isEmpty(value) || /^(0[289][0-9]{2}|[1-9][0-9]{3})$/.test(value) ? undefined : "Must be valid postcode";
  },

  required: function required(value) {
    return !isEmpty(value) || value === true ? undefined : "Must enter a value";
  },

  tel: function tel(value) {
    return isEmpty(value) || /^\(?((0|\+61 ?)[23478])?\)?[ -]?[0-9]{2}[ -]?[0-9]{2}[ -]?[0-9][ -]?[0-9]{3}$/.test(value) ? undefined : "Must be a valid phone number";
  }

};

exports.default = validate;