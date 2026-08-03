import { Alert } from '@mui/material'
import { useNotifications } from '../stores/notificationStore'

const Notification = () => {
  const message = useNotifications()

  if (!message) {
    return null
  }

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity="success">
      {message}
    </Alert>
  )
}

export default Notification
