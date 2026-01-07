const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  return (
    <div className="message--success">
      {message}
    </div>
  )
}

export default Notification
