import React from "react"
import FieldContainer from "./FieldContainer"



describe("FieldContainer component", () => {
  
  const sampleError = "Invalid value"
  const sampleFieldName = "client.firstName"
  const sampleState = { client: { firstName: "Adam" } }
  const sampleValue = "Adam"



  it("should construct", () => {
    const container = new FieldContainer()
    expect(container.rules).toEqual({})
    expect(container.errors).toEqual({})
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

    container.updateField(sampleFieldName, sampleValue)
    expect(container.setState).toBeCalledWith(sampleState)
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


})
