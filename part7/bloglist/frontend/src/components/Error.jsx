import { Alert } from '@mui/material'

const Error = ({ errorMessage }) => {
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
