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

var _isEmpty = require("lodash/isEmpty");

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _isEqual = require("lodash/isEqual");

var _isEqual2 = _interopRequireDefault(_isEqual);

var _validate = require("../helpers/validate");

var _objectPathImmutable = require("object-path-immutable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    _this.activeFields = [];
    _this.validators = _extends({}, _validate.defaultValidators);
    return _this;
  }

  _createClass(FieldContainer, [{
    key: "activateField",
    value: function activateField(name) {
      if (this.activeFields.includes(name)) return;

      this.activeFields.push(name);
      this.forceUpdate();
    }
  }, {
    key: "activateFields",
    value: function activateFields() {
      var fields = Object.keys(this.rules);
      if (!(0, _isEqual2.default)(fields, this.activeFields)) {
        this.activeFields = fields;
        this.forceUpdate();
      }
    }
  }, {
    key: "connectActiveField",
    value: function connectActiveField(name) {
      var _this2 = this;

      return _extends({
        error: this.activeFields.includes(name) ? this.errors[name] : undefined,
        onBlur: function onBlur() {
          return _this2.activateField(name);
        },
        onChange: function onChange(event) {
          return _this2.onFieldChange(name, event.target.value);
        },
        value: (0, _get2.default)(this.state, name)
      }, this.rules[name]);
    }
  }, {
    key: "connectField",
    value: function connectField(name) {
      var _this3 = this;

      return _extends({
        error: this.errors[name],
        onChange: function onChange(event) {
          return _this3.onFieldChange(name, event.target.value);
        },
        value: (0, _get2.default)(this.state, name)
      }, this.rules[name]);
    }
  }, {
    key: "deactivateFields",
    value: function deactivateFields() {
      if (this.activeFields.length) {
        this.activeFields = [];
        this.forceUpdate();
      }
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
      var state = (0, _objectPathImmutable.set)(this.state, name, value);
      var rootPath = name.split(".")[0]; // Grab the top-level identifier (eg. 'client')
      var rootState = _defineProperty({}, rootPath, state[rootPath]); // Grab the portion of the state belonging to our root path (eg. { client: {...} })
      this.setState(rootState);
    }
  }, {
    key: "validateField",
    value: function validateField(name, value) {
      var error = (0, _validate.validate)(name, value, this.rules[name], this.validators);

      if (error) {
        this.formValid = false;
        this.errors[name] = error;
      } else {
        delete this.errors[name];
        this.formValid = (0, _isEmpty2.default)(this.errors);
      }
    }
  }, {
    key: "validateFields",
    value: function validateFields() {
      var _this4 = this;

      var fields = Object.keys(this.rules);
      fields.forEach(function (field) {
        return _this4.validateField(field, (0, _get2.default)(_this4.state, field));
      });
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