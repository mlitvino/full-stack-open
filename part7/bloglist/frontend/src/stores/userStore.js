import { create } from 'zustand'

import blogService from '../services/blogs'
import loginService from '../services/login'
import persistentUser from '../services/persistentUser'

const useUserStore = create((set) => ({
  user: null,
  actions: {
    initUser: () => {
      const user = persistentUser.getUser()
      if (user) {
        blogService.setToken(user.token)
        set({ user })
      }
    },
    login: async (username, password) => {
      const user = await loginService.login({ username, password })

      persistentUser.saveUser(user)
      blogService.setToken(user.token)
      set({ user })
      return user
    },
    logout: () => {
      set({ user: null })
      persistentUser.removeUser()
      blogService.setToken(null)
    }
  }
}))

export const useUser = () => useUserStore((state) => state.user)
export const useUserActions = () => useUserStore((state) => state.actions)
