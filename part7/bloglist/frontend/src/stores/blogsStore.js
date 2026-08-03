import { create } from 'zustand'

import blogService from '../services/blogs'

export const useBlogsStore = create((set, get) => ({
  blogs: [],
  actions: {
    initialize: async () => {
      const blogs = await blogService.getAll()
      set(() => ({ blogs }))
    },
    add: async (blog) => {
      const newBlog = await blogService.create(blog)
      set((state) => ({ blogs: state.blogs.concat(newBlog) }))
    },
    remove: async (id) => {
      await blogService.remove(id)
      set((state) => ({
        blogs: state.blogs.filter((b) => b.id !== id)
      }))
    },
    like: async (id) => {
      const blog = get().blogs.find((b) => b.id === id)
      const updated = await blogService.update(id, { ...blog, likes: blog.likes + 1 })
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id === id ? updated : b))
      }))
    },
    addComment: async (id, comment) => {
      const updated = await blogService.createComment(id, comment)
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id === id ? updated : b))
      }))
    }
  }
}))

export const useBlogs = () => useBlogsStore((state) => state.blogs)
export const useBlogsActions = () => useBlogsStore((state) => state.actions)
