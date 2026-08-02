import { Alert } from '@mui/material'

const Notification = ({ message }) => {
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
