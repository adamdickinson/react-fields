import React from "react"



export const SampleField = ({ error, value, ...props }) => (
  <span className="field">
    <input value={value || ''} {...props} />
    { error && <span className="error">{error}</span> }
  </span>
)



export default SampleField
