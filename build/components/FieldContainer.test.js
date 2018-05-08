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
  var sampleOtherFieldName = "client.lastName";
  var sampleOtherState = { client: { firstName: "Adam", lastName: "Holz" } };
  var sampleOtherValue = "Holz";
  var sampleState = { client: { firstName: "Adam" } };
  var sampleValue = "Adam";

  it("should activateField", function () {

    // Field inactive 
    var container = mount(_react2.default.createElement(_FieldContainer2.default, null)).instance();
    container.activateField(sampleFieldName);
    expect(container.activeFields).toEqual([sampleFieldName]);

    // Field active 
    container.activateField(sampleFieldName);
    expect(container.activeFields).toEqual([sampleFieldName]);
  });

  it("should activateFields", function () {

    // Inactive fields
    var container = mount(_react2.default.createElement(_FieldContainer2.default, null)).instance();
    container.rules = _defineProperty({}, sampleFieldName, { required: true });
    container.activateFields();
    expect(container.activeFields).toEqual([sampleFieldName]);

    // Already active (no change)
    container.activateFields();
    expect(container.activeFields).toEqual([sampleFieldName]);
  });

  it("should construct", function () {
    var container = new _FieldContainer2.default();
    expect(container.rules).toEqual({});
    expect(container.errors).toEqual({});
  });

  it("should connectActiveField", function () {
    var container = mount(_react2.default.createElement(_FieldContainer2.default, null));
    container.instance().rules = _defineProperty({}, sampleFieldName, { required: true });
    container.instance().errors = _defineProperty({}, sampleFieldName, sampleError);
    container.setState(sampleState);

    // Field inactive 
    var connection = container.instance().connectActiveField(sampleFieldName);
    expect(connection).toEqual(expect.objectContaining({
      error: undefined,
      value: sampleValue,
      required: true
    }));

    // Field active 
    container.instance().activeFields = [sampleFieldName];
    connection = container.instance().connectActiveField(sampleFieldName);
    expect(connection).toEqual(expect.objectContaining({
      error: sampleError,
      value: sampleValue,
      required: true
    }));

    // Test onChange
    container.instance().onFieldChange = jest.fn();
    connection.onChange({ target: { value: sampleValue } });
    expect(container.instance().onFieldChange).toBeCalledWith(sampleFieldName, sampleValue);

    // Test onBlur
    container.instance().activateField = jest.fn();
    connection.onBlur();
    expect(container.instance().activateField).toBeCalledWith(sampleFieldName);
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

  it("should deactivateFields", function () {

    // With no active fields
    var container = mount(_react2.default.createElement(_FieldContainer2.default, null)).instance();
    container.deactivateFields();
    expect(container.activeFields).toEqual([]);

    // With active fields
    container.activeFields = [sampleFieldName];
    container.deactivateFields();
    expect(container.activeFields).toEqual([]);
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

    // Change first field
    container.updateField(sampleFieldName, sampleValue);
    expect(container.setState).toBeCalledWith(sampleState);

    // Change second field
    container.state = sampleState;
    container.updateField(sampleOtherFieldName, sampleOtherValue);
    expect(container.setState).toBeCalledWith(sampleOtherState);

    // Delete field from empty state
    container.state = {};
    container.updateField(sampleFieldName, undefined);
    expect(container.setState).toBeCalledWith({ client: {} });

    // Delete field from non-empty state
    container.state = sampleState;
    container.updateField(sampleFieldName, undefined);
    expect(container.setState).toBeCalledWith({ client: {} });

    // "Delete" top-level field
    container.setState.mockClear();
    container.state = {};
    container.updateField("firstName", undefined);
    expect(container.setState).not.toHaveBeenCalled();
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

  it("should validateFields", function () {
    var _container$rules3;

    var container = new _FieldContainer2.default();
    container.rules = (_container$rules3 = {}, _defineProperty(_container$rules3, sampleFieldName, { required: true }), _defineProperty(_container$rules3, "lastName", { required: true }), _container$rules3);

    container.state = {
      lastName: "Holz"
    };

    container.validateFields();
    expect(container.formValid).toBe(false);
    expect(container.errors).toEqual(_defineProperty({}, sampleFieldName, "Must enter a value"));
  });
});