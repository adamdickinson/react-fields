# @renegade/react-fields
*React Field Management*

As with anything node/React, there are a thousand ways to complete the same 
task. But the amount of choice and freedom is a double-edged sword - finding a 
solution that is testable, simple, easy-to-use, robust and traceable can be 
hard. 

*So to solve the challenge of flexible form validation, we made **react-fields**!*

Detail
---

### What does it do?

**react-fields** is a small form field library that provides a structured way
to manage data and validation through containers and simple fields. It provides
a FieldContainer class that defines the structure and behaviours required to 
connect fields to a validation and data management process.


### How does it work?

```js
import { FieldContainer } from "@renegade/react-fields"



class ClientContainer extends FieldContainer {

  constructor(props) {
    super(props)

    this.state = {
      firstName: "Adam",
      lastName: "Power"
    }

    this.rules = {
      firstName: { required: true },
      lastName:  { required: true },
      budget:    { type: "number", max: 10000, min: 0 }
    }

    this.validateFields()
  }
  
  
  
  render() {
    const connectField = this.connectField // Just for convenience

    return (
      <div>
        <InputField {...connectField("firstName")} />
        <InputField {...connectField("lastname")} />
        <InputField {...connectField("budget")} />
        <Button disabled={!this.formValid} onClick={this.submit.bind(this)}>Submit</Button>
      </div>
    )
  }



  submit() {
    this.onSubmit(this.state)
  }

}
```

Let's look at the basics here.

A validation process requires **rules**. To keep things simple and contextual, we 
provide these rules per field in the constructor of our container.

We then use **connectField** to pass these rules back into our fields, along 
with an onChange(event) method and the field value as per the current state. So 
what we've written above for our *budget* field is simply shorthand for:

```js
<InputField 
  onChange={event => this.onFieldChange("budget", event.target.value)} 
  value={this.state.budget} 
  error={this.errors.budget}
  type="number" 
  max={10000} 
  min={0} 
/>
```

A little bit of sugar is good from time to time, plus while DRY principles
aren't always the silver bullet we may wish they were, they certainly help us
with consistency, speed and maintainability in our code.


### Activated Forms

There are two primary use cases we've focused on to develop this library. The 
first - shown in 'How does it work?' above - illustrates how one might use it
to deal with editing of existing data. Validation processes will run and be
shown as soon as the form is loaded. Errors will be immediately visible and 
will change as the data changes.

However if we want to fill in a blank form, it's rude of us to show all of the 
things that are wrong before the user has even begun to fill it out. So we 
have introduced an additional dynamic: field activation.

Check this out:

```js
import { FieldContainer } from "@renegade/react-fields"



class ClientContainer extends FieldContainer {

  constructor(props) {
    super(props)

    this.rules = {
      firstName: { required: true },
      lastName:  { required: true },
      email:     { type: "email" }
    }

    this.validateFields()
  }
  
  
  
  render() {
    const connectField = this.connectActiveField // Just for convenience

    return (
      <div>
        <InputField {...connectField("firstName")} />
        <InputField {...connectField("lastname")} />
        <InputField {...connectField("email")} />
        <InputField {...connectField("phone")} />
        <Button onClick={this.formValid ? this.submit.bind(this) : this.activateFields.bind(this)}>
          Submit
        </Button>
      </div>
    )
  }



  submit() {
    this.onSubmit(this.state)
  }

}
```

What we're doing here is allowing a user to change data before attempting to 
submit it. Upon changing data and moving on (onBlur), each field will be made 
'active', meaning that it will display any errors found for it.

Upon submission, if the form is not valid all fields will be made active.

In the code, it's almost identical except for two key adjustments:

- Our Button's onClick will run activateFields if the form is not valid, or 
  submit if it is.

- We're using connectActiveField rather than connectField, to ensure our fields 
  self-activate and show errors only once activated.

As a quick example of how this works from a user's perspective:

1. User opens blank form (form has already validated, but no errors show)
2. User enters email address in field, but spells it incorrectly 
3. User moves onto phone field, only to see there is an error with the email 
   address (email address field self-activates onBlur)
4. User corrects email address and submits form
5. First name and last name show required error messages (form invalid, so 
   onClick activates all fields instead, revealing firstName and lastName as 
   required fields)
6. User adds first and last name into field, then submits again
7. Form shows success message (form now valid, so onClick runs submit)


### Why are we using state?

Bring on the state vs store debate! We enjoy a good argument about whether state
or a store (ie. redux) should be used to facilitate processes, though the
consensus seems to be that if the data is transient - if we're expecting it to 
change constantly - it belongs in state.

The best example is an `<input>` field. It retains its value in its own DOM 
state, because that value only has meaning once something else (ie. a form, or
a script) requests the value. Until then, it's still work in progress.

In much the same way, our FieldContainer has no meaning until the form is 
submitted. Once it's submitted, then we pass through meaningful data.


### What do fields do then?

As you can see from the long-hand InputField element declaration above, the 
props that are passed during a connect are consistent with a standard HTML5 
`<input>` element, with the exception of our `error` prop which provides the 
error message to be displayed.

```js
export const InputField = ({ error, ...inputProps }) => (
  <div className="field">
    <input {...inputProps} />
    { !!error && <span className="field-error">{error}</span> }
  </div>
)
```

Stay tuned - we will provide some super handy implementations for fields soon.


### Can I add my own validators?

Was hoping you'd ask! Absolutely you can!

The validators available to your FieldContainer are accessible and modifiable through the validators prop. To add your own, simply define it in your constructor and you're good to go:

```js
import { FieldContainer } from "@renegade/react-fields"



class ClientContainer extends FieldContainer {

  constructor(props) {
    super(props)

    this.validators.bananaCount = (value, count) => (value.match(/banana/g) || []).length === count
      ? undefined
      : `Incorrect bananae, expected ${count}`
  }

}
```

This will only be used within the defined FieldContainer, so if you find yourself re-using these, it might be worth defining common validators in a separate file and importing + appending to the validators attribute as required.


API
---

### FieldContainer

React.Component base class for any container that needs to use **react-fields**.

#### this.rules

Set in the constructor of the subclass, this is a map of field names to field 
rules and their specifications. Example:

```js
export class MyContainer extends FieldContainer {
  
  constructor(props) {
    super(props)
    this.rules = {
      sample: { required: true },
      "my.nested.field": { max: 20, min: 10 }
    }
  }
  
}
```

These rules and their specifications will also be applied to the relevant 
component during the connect process.

#### this.connectField(fieldName)

Generates a set of props specific to a field that will enable validation and 
data flow, as well as set any defined rules.

```js
export class MyContainer extends FieldContainer {
  
  render() {
    return (
      <div>
        <MyInputField {...this.connectField("my.nested.field")} />
      </div>
    )
  }

}
```

The call `this.connectField("my.nested.field")` simply generates an object that
looks like this:

```js
{
  error: this.errors["my.nested.field"],
  onChange: event => this.onFieldChange("my.nested.field", event.target.value),
  value: get(this.state, "my.nested.field")
  ...this.rules["my.nested.field"]
}
```

Where `get` is the lodash get method.


#### this.onFieldChange(name, value)

Handles a change to an input field value by first validating it then updating
the value in the state.


#### this.validateField(name, value)

Validates the given value against any rules set for the given field name. The 
message generated for an invalid value will be the first rule to fail. A 
corresponding entry in `this.errors` is created with that message, to be used 
later in rendering.


#### this.updateField(name, value)

Simply updates the value within the state using immutability and dot notation 
nesting.


#### this.errors

A field-name-indexed lookup of any error messages generated from validation 
processes. No errors means the form is valid.


#### this.formValid

Whether or not the fields in the container are all valid.
