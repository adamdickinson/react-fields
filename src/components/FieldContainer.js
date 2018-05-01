import React from "react"
import get from "lodash/get"
import isEmpty from "lodash/isEmpty"
import isEqual from "lodash/isEqual"
import set from "lodash/set"
import update from "react-addons-update"
import { defaultValidators, validate } from "../helpers/validate"



export class FieldContainer extends React.Component {

  constructor(props) {
    super(props)
    this.errors = {}
    this.rules = {}
    this.activeFields = []
    this.validators = { ...defaultValidators }
  }



  activateField(name) {
    if( this.activeFields.includes(name) )
      return

    this.activeFields.push(name)
    this.forceUpdate()
  }



  activateFields() {
    const fields = Object.keys(this.rules)
    if( !isEqual(fields, this.activeFields) ) {
      this.activeFields = fields
      this.forceUpdate()
    }
  }



  connectActiveField(name) {
    return {
      error:    this.activeFields.includes(name) ? this.errors[name] : undefined,
      onBlur:   () => this.activateField(name),
      onChange: event => this.onFieldChange(name, event.target.value),
      value:    get(this.state, name),
      ...this.rules[name]
    }
  }



  connectField(name) {
    return {
      error:    this.errors[name],
      onChange: event => this.onFieldChange(name, event.target.value),
      value:    get(this.state, name),
      ...this.rules[name]
    }
  }



  deactivateFields() {
    if( this.activeFields.length ) {
      this.activeFields = []
      this.forceUpdate()
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
    const error = validate(name, value, this.rules[name], this.validators)

    if(error) {
      this.formValid = false
      this.errors[name] = error

    } else {
      delete this.errors[name]
      this.formValid = isEmpty(this.errors)
    }
  }



  validateFields() {
    const fields = Object.keys(this.rules)
    fields.forEach(field => this.validateField(field, get(this.state, field)))
  }



  render() { return null }

}



export default FieldContainer
