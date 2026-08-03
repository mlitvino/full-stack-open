import { Alert } from '@mui/material'
import { useError } from '../stores/notificationStore'

const Error = () => {
  const errorMessage = useError()

  if (!errorMessage) {
    return null
  }

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity="error">
      {errorMessage}
    </Alert>
  )
}

export default Error
