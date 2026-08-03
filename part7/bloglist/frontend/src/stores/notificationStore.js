import { create } from 'zustand'

let notificationTimeoutId = null
let errorTimeoutId = null

export const useNotificationsStore = create((set) => ({
  notification: '',
  error: '',
  actions: {
    setNotification: (message, seconds = 5) => {
      clearTimeout(notificationTimeoutId)
      set({ notification: message })
      notificationTimeoutId = setTimeout(() => {
        set({ notification: '' })
      }, seconds * 1000)
    },
    setError: (message, seconds = 5) => {
      clearTimeout(errorTimeoutId)
      set({ error: message })
      errorTimeoutId = setTimeout(() => {
        set({ error: '' })
      }, seconds * 1000)
    }
  }
}))

export const useNotifications = () => useNotificationsStore((state) => state.notification)
export const useError = () => useNotificationsStore((state) => state.error)
export const useNotificationActions = () => useNotificationsStore((state) => state.actions)
