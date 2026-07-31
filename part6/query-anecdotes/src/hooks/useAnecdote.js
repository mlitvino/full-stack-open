import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '../services/anecdotesService'
import { useNotification } from '../contexts/NotificationContext'

const useAnecdote = () => {
  const queryClient = useQueryClient()
  const { setNotification } = useNotification()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    retry: false
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: (error) => {
      setNotification(error.message)
    }
  })

  const voteAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  return {
    anecdotes: result.data,
    isLoading: result.isLoading,
    isError: result.isError,
    createAnecdote: newAnecdoteMutation.mutate,
    voteAnecdote: voteAnecdoteMutation.mutate
  }
}

export default useAnecdote
