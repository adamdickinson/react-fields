"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _FieldContainer = require("./FieldContainer");

var _FieldContainer2 = _interopRequireDefault(_FieldContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe("FieldContainer component", function () {

  var sampleError = "Invalid value";
  var sampleFieldName = "client.firstName";
  var sampleState = { client: { firstName: "Adam" } };
  var sampleValue = "Adam";

  it("should construct", function () {
    var container = new _FieldContainer2.default();
    expect(container.rules).toEqual({});
    expect(container.errors).toEqual({});
  });

  it("should connectField", function () {
    var container = mount(_react2.default.createElement(_FieldContainer2.default, null));
    container.instance().rules = _defineProperty({}, sampleFieldName, { required: true });
    container.instance().errors = _defineProperty({}, sampleFieldName, sampleError);
    container.setState(sampleState);

    var connection = container.instance().connectField(sampleFieldName);
    expect(connection).toEqual(expect.objectContaining({
      error: sampleError,
      value: sampleValue,
      required: true
    }));

    container.instance().onFieldChange = jest.fn();
    connection.onChange({ target: { value: sampleValue } });
    expect(container.instance().onFieldChange).toBeCalledWith(sampleFieldName, sampleValue);
  });

  it("should handle onFieldChange", function () {
    var container = new _FieldContainer2.default();
    container.validateField = jest.fn();
    container.updateField = jest.fn();

    container.onFieldChange(sampleFieldName, sampleValue, { required: true });
    expect(container.validateField).toBeCalled();
    expect(container.updateField).toBeCalled();
  });

  it("should updateField", function () {
    var container = new _FieldContainer2.default();
    container.state = {};
    container.setState = jest.fn();

    container.updateField(sampleFieldName, sampleValue);
    expect(container.setState).toBeCalledWith(sampleState);
  });

  it("should validateField", function () {
    var container = new _FieldContainer2.default();
    container.errors[sampleFieldName] = sampleError;

    // Success - field has no applied rules
    container.validateField(sampleFieldName, sampleValue);
    expect(container.errors).toEqual({});
    expect(container.formValid).toBe(true);

    // Fail - rules applied and not passed
    container.rules = _defineProperty({}, sampleFieldName, { required: true });
    container.validateField(sampleFieldName, "");
    expect(container.errors).toEqual(_defineProperty({}, sampleFieldName, "Must enter a value"));
    expect(container.formValid).toBe(false);
  });
});