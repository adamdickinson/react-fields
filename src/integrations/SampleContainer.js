import React from "react"
import FieldContainer from "../components/FieldContainer"
import SampleField from "./SampleField"



export class SampleContainer extends FieldContainer {

  constructor(props) {
    super(props)
    this.rules = {
      age: { required: true, max: 20 }
    }
  }



  render() {
    return (
      <div>
        <SampleField {...this.connectField("firstName")}  />
        <SampleField {...this.connectField("age")} />
      </div>
    )
  }

}



export default SampleContainer
