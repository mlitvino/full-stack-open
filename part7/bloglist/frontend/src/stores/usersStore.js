import { create } from 'zustand'

import userService from '../services/users'

export const useUsersStore = create((set) => ({
  users: [],
  actions: {
    initialize: async () => {
      const users = await userService.getAll()
      set({ users })
    }
  }
}))

export const useUsers = () => useUsersStore((state) => state.users)
export const useUsersActions = () => useUsersStore((state) => state.actions)
