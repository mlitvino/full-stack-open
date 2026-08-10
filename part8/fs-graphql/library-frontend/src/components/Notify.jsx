const Notify = ({ notification }) => {
  if (!notification) {
    return null
  }

  const color = notification.type === 'success' ? 'green' : 'red'

  return (
    <div style={{ color }}>
      {notification.message}
    </div>
  )
}

export default Notify
