import { useNotifications } from '../stores/notificationStore'

const Notification = () => {
  const notification = useNotifications()

  if (!notification) {
    return null
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

const style = {
  border: 'solid',
  padding: 10,
  borderWidth: 1,
  marginBottom: 10
}

export default Notification
