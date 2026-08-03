import { Alert, AlertTitle, Button } from '@mui/material'

const ErrorFallback = ({ resetErrorBoundary }) => {
  return (
    <Alert severity="error" style={{ marginTop: 10, marginBottom: 10 }}>
      <AlertTitle>Something went wrong :(</AlertTitle>
      <div style={{ marginTop: 10 }}>
        <Button variant="outlined" size="small" onClick={resetErrorBoundary}>
          try again
        </Button>
      </div>
    </Alert>
  )
}

export default ErrorFallback
