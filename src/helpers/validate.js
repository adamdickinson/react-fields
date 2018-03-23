import isEmptyish from "lodash/isEmpty"
import isFinite from "lodash/isFinite"



export const validate = (name, value, rules, validators=defaultValidators) => {
  if( !rules ) return
  for( let [rule, constraint] of Object.entries(rules) ) {
    const result = (rule in validators) && validators[rule](value, constraint) 
    if(result) return result
  }
}



export const isEmpty = value => !isFinite(value) && isEmptyish(value)



export const defaultValidators = {

  abn: value => isEmpty(value) || /^(\d *?){11}$/.test(value)
    ? undefined
    : "Must be a valid ABN",

  email: value => isEmpty(value) || /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
    ? undefined
    : "Must be a valid email address",

  max: (value, maximum) => isEmpty(value) || (value <= maximum)
    ? undefined
    : `Must be ${maximum} or less`,

  min: (value, minimum) => isEmpty(value) || (value >= minimum)
    ? undefined
    : `Must be ${minimum} or greater`,

  postcode: value => isEmpty(value) || /^(0[289][0-9]{2}|[1-9][0-9]{3})$/.test(value)
    ? undefined
    : "Must be valid postcode",

  required: value => !isEmpty(value) || value === true
    ? undefined
    : "Must enter a value",

  tel: value => isEmpty(value) || /^\(?((0|\+61 ?)[23478])?\)?[ -]?[0-9]{2}[ -]?[0-9]{2}[ -]?[0-9][ -]?[0-9]{3}$/.test(value) 
    ? undefined
    : "Must be a valid phone number"

}



export default validate
