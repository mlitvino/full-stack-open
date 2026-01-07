const Error = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }

  return (
    <div className="message--error">
      {errorMessage}
    </div>
  )
}

export default Error
