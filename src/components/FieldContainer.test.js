import React from "react"
import FieldContainer from "./FieldContainer"



describe("FieldContainer component", () => {
  
  const sampleError = "Invalid value"
  const sampleFieldName = "client.firstName"
  const sampleOtherFieldName = "client.lastName"
  const sampleOtherState = { client: { firstName: "Adam", lastName: "Holz" } }
  const sampleOtherValue = "Holz"
  const sampleState = { client: { firstName: "Adam" } }
  const sampleValue = "Adam"



  it("should activateField", () => {

    // Field inactive 
    const container = mount(<FieldContainer />).instance()
    container.activateField(sampleFieldName)
    expect(container.activeFields)
      .toEqual([sampleFieldName])

    // Field active 
    container.activateField(sampleFieldName)
    expect(container.activeFields)
      .toEqual([sampleFieldName])

  })



  it("should activateFields", () => {
    const container = shallow(<FieldContainer />).instance()
    const sampleContext = { activeFields: [], forceUpdate: jest.fn() }
    const activateFields = container.activateFields.bind(sampleContext)

    // Inactive fields
    sampleContext.rules = { [sampleFieldName]: { required: true } }
    activateFields()
    expect(sampleContext.activeFields).toEqual([sampleFieldName])
    expect(sampleContext.forceUpdate).toBeCalled()

    // Already active (no change)
    activateFields()
    expect(sampleContext.activeFields).toEqual([sampleFieldName])

  })



  it("should construct", () => {
    const container = new FieldContainer()
    expect(container.rules).toEqual({})
    expect(container.errors).toEqual({})
  })



  it("should connectActiveField", () => {
    const container = mount(<FieldContainer />)
    container.instance().rules = { [sampleFieldName]: { required: true } }
    container.instance().errors = { [sampleFieldName]: sampleError }
    container.setState(sampleState)

    // Field inactive 
    let connection = container.instance().connectActiveField(sampleFieldName)
    expect(connection)
      .toEqual(expect.objectContaining({
        error:    undefined,
        value:    sampleValue,
        required: true
      }))

    // Field active 
    container.instance().activeFields = [sampleFieldName]
    connection = container.instance().connectActiveField(sampleFieldName)
    expect(connection)
      .toEqual(expect.objectContaining({
        error:    sampleError,
        value:    sampleValue,
        required: true
      }))

    // Test onChange
    container.instance().onFieldChange = jest.fn()
    connection.onChange({ target: { value: sampleValue } })
    expect(container.instance().onFieldChange)
      .toBeCalledWith(sampleFieldName, sampleValue)

    // Test onBlur
    container.instance().activateField = jest.fn()
    connection.onBlur()
    expect(container.instance().activateField)
      .toBeCalledWith(sampleFieldName)
  })



  it("should connectField", () => {
    const container = mount(<FieldContainer />)
    container.instance().rules = { [sampleFieldName]: { required: true } }
    container.instance().errors = { [sampleFieldName]: sampleError }
    container.setState(sampleState)

    const connection = container.instance().connectField(sampleFieldName)
    expect(connection)
      .toEqual(expect.objectContaining({
        error:    sampleError,
        value:    sampleValue,
        required: true
      }))

    container.instance().onFieldChange = jest.fn()
    connection.onChange({ target: { value: sampleValue } })
    expect(container.instance().onFieldChange).toBeCalledWith(sampleFieldName, sampleValue)
  })



  it("should deactivateFields", () => {

    // With no active fields
    const container = mount(<FieldContainer />).instance()
    container.deactivateFields()
    expect(container.activeFields).toEqual([])

    // With active fields
    container.activeFields = [sampleFieldName]
    container.deactivateFields()
    expect(container.activeFields).toEqual([])

  })



  it("should handle onFieldChange", () => {
    const container = new FieldContainer()
    container.validateField = jest.fn()
    container.updateField = jest.fn()

    container.onFieldChange(sampleFieldName, sampleValue, { required: true })
    expect(container.validateField).toBeCalled()
    expect(container.updateField).toBeCalled()
  })



  it("should updateField", () => {
    const container = new FieldContainer()
    container.state = {}
    container.setState = jest.fn()

    // Change first field
    container.updateField(sampleFieldName, sampleValue)
    expect(container.setState).toBeCalledWith(sampleState)

    // Change second field
    container.state = sampleState
    container.updateField(sampleOtherFieldName, sampleOtherValue)
    expect(container.setState).toBeCalledWith(sampleOtherState)

    // Delete field from empty state
    container.state = {} 
    container.updateField(sampleFieldName, undefined)
    expect(container.setState).toBeCalledWith({ client: {} })

    // Delete field from non-empty state
    container.state = sampleState
    container.updateField(sampleFieldName, undefined)
    expect(container.setState).toBeCalledWith({ client: {} })

    // "Delete" top-level field
    container.setState.mockClear()
    container.state = {} 
    container.updateField("firstName", undefined)
    expect(container.setState).not.toHaveBeenCalled()
  })



  it("should validateField", () => {
    const container = new FieldContainer()
    container.errors[sampleFieldName] = sampleError

    // Success - field has no applied rules
    container.validateField(sampleFieldName, sampleValue)
    expect(container.errors).toEqual({})
    expect(container.formValid).toBe(true)

    // Fail - rules applied and not passed
    container.rules = { [sampleFieldName]: { required: true } }
    container.validateField(sampleFieldName, "")
    expect(container.errors).toEqual({ [sampleFieldName]: "Must enter a value" })
    expect(container.formValid).toBe(false)
  })



  it("should validateFields", () => {
    const container = new FieldContainer()
    container.rules = {
      [sampleFieldName]: { required: true },
      lastName: { required: true }
    }

    // Test with component state
    container.state = { lastName: "Holz" }
    container.validateFields()
    expect(container.formValid).toBe(false)
    expect(container.errors).toEqual({
      [sampleFieldName]: "Must enter a value"
    })

    // Test with a given state
    container.validateFields({ [sampleFieldName]: "Adam" })
    expect(container.formValid).toBe(false)
    expect(container.errors).toEqual({
      lastName: "Must enter a value"
    })
  })


})
