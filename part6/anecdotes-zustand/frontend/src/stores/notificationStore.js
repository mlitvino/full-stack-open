import { create } from 'zustand'

let timeoutId = null

export const useNotificationsStore = create((set) => ({
  notification: '',
  actions: {
    setNotification: (message) => {
      clearTimeout(timeoutId)
      set({ notification: message })
      timeoutId = setTimeout(() => {
        set({ notification: '' })
      }, 5000)
    },
  }
}))

export const useNotifications = () => useNotificationsStore(state => state.notification)
export const useNotificationActions = () => useNotificationsStore(state => state.actions)
