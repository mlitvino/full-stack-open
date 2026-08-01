import { create } from 'zustand'

import anecdoteService from '../services/anecdotes'

export const useAnecdotes = create((set) => ({
  anecdotes: [],

  addAnecdote: async (anecdote) => {
    const created = await anecdoteService.createNew(anecdote)
    set(state => ({ anecdotes: state.anecdotes.concat(created) }))
    return created
  },

  remove: async (id) => {
    await anecdoteService.remove(id)
    set(state => ({ anecdotes: state.anecdotes.filter(a => a.id !== id) }))
  }
}))

anecdoteService.getAll().then(anecdotes => useAnecdotes.setState({ anecdotes }))
