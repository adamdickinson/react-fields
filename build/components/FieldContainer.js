"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldContainer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _get = require("lodash/get");

var _get2 = _interopRequireDefault(_get);

var _set = require("lodash/set");

var _set2 = _interopRequireDefault(_set);

var _reactAddonsUpdate = require("react-addons-update");

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

var _validate = require("../helpers/validate");

var _validate2 = _interopRequireDefault(_validate);

var _isEmpty = require("lodash/isEmpty");

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FieldContainer = exports.FieldContainer = function (_React$Component) {
  _inherits(FieldContainer, _React$Component);

  function FieldContainer(props) {
    _classCallCheck(this, FieldContainer);

    var _this = _possibleConstructorReturn(this, (FieldContainer.__proto__ || Object.getPrototypeOf(FieldContainer)).call(this, props));

    _this.errors = {};
    _this.rules = {};
    return _this;
  }

  _createClass(FieldContainer, [{
    key: "connectField",
    value: function connectField(name) {
      var _this2 = this;

      return _extends({
        error: this.errors[name],
        onChange: function onChange(event) {
          return _this2.onFieldChange(name, event.target.value);
        },
        value: (0, _get2.default)(this.state, name)
      }, this.rules[name]);
    }
  }, {
    key: "onFieldChange",
    value: function onFieldChange(name, value) {
      this.validateField(name, value);
      this.updateField(name, value);
    }
  }, {
    key: "updateField",
    value: function updateField(name, value) {
      var branch = (0, _set2.default)({}, name, value);
      this.setState((0, _reactAddonsUpdate2.default)(this.state, { $set: (0, _set2.default)({}, name, value) }));
    }
  }, {
    key: "validateField",
    value: function validateField(name, value) {
      var error = (0, _validate2.default)(name, value, this.rules[name]);

      if (error) {
        this.formValid = false;
        this.errors[name] = error;
      } else {
        delete this.errors[name];
        this.formValid = (0, _isEmpty2.default)(this.errors);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return FieldContainer;
}(_react2.default.Component);

exports.default = FieldContainer;