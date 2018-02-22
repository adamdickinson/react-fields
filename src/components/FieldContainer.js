import React from "react"
import get from "lodash/get"
import set from "lodash/set"
import update from "react-addons-update"
import validate from "../helpers/validate"
import isEmpty from "lodash/isEmpty"



export class FieldContainer extends React.Component {

  constructor(props) {
    super(props)
    this.errors = {}
    this.rules = {}
  }



  connectField(name) {
    return {
      error:    this.errors[name],
      onChange: event => this.onFieldChange(name, event.target.value),
      value:    get(this.state, name),
      ...this.rules[name]
    }
  }



  onFieldChange(name, value) {
    this.validateField(name, value)
    this.updateField(name, value)
  }



  updateField(name, value) {
    const branch = set({}, name, value)
    this.setState( update(this.state, { $set: set({}, name, value) }) )
  }



  validateField(name, value) {
    const error = validate(name, value, this.rules[name])

    if(error) {
      this.formValid = false
      this.errors[name] = error

    } else {
      delete this.errors[name]
      this.formValid = isEmpty(this.errors)
    }
  }



  render() { return null }

}



export default FieldContainer
