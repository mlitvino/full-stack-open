import { createContext, useCallback, useContext, useRef, useState } from 'react'

const NotificationContext = createContext(null)

export const NotificationContextProvider = ({ children }) => {
  const [notification, setNotificationState] = useState('')
  const timeoutRef = useRef(null)

  const setNotification = useCallback((message, seconds = 5) => {
    clearTimeout(timeoutRef.current)
    setNotificationState(message)
    timeoutRef.current = setTimeout(() => {
      setNotificationState('')
    }, seconds * 1000)
  }, [])

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)

export default NotificationContext
