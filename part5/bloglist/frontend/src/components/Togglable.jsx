import { useState, useImperativeHandle, forwardRef } from 'react'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const shownWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <>
      <span style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </span>
      <span style={shownWhenVisible}>
        {props.buttonBefore && (
          <button onClick={toggleVisibility}>{props.cancelButtonLabel}</button>
        )}

        {props.children}

        {!props.buttonBefore && (
          <button onClick={toggleVisibility}>{props.cancelButtonLabel}</button>
        )}
      </span>
    </>
  )
})

export default Togglable
