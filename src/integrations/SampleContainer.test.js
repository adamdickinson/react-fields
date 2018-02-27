import React from "react"
import SampleContainer from "./SampleContainer"



describe("integration", () => {

  const sampleValue = "adam"



  it("should update value", () => {
    const container = mount(<SampleContainer />)
    expect(container.state()).toBe(null)

    container.find("input").first().simulate("change", { target: { value: sampleValue } })
    expect(container.state().firstName).toBe(sampleValue)
  })



  it("should show error", async () => {
    const container = mount(<SampleContainer />)
    expect(container.state()).toBe(null)

    const input = container.find("input").last()

    // Valid
    input.simulate("change", { target: { value: 20 } })
    let field = container.find("SampleField").last()
    expect(field.prop("error")).toBe(undefined)

    // Invalid
    input.simulate("change", { target: { value: 21 } })
    field = container.find("SampleField").last()
    expect(field.prop("error")).toBe("Must be 20 or less")
  })

})
