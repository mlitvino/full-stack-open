import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import useAnecdoteStore from '../stores/anecdoteStore'
import AnecdoteList from './AnecdoteList'

const anecdotes = [
  { id: 1, content: 'Least votes', votes: 1 },
  { id: 2, content: 'Most votes', votes: 10 },
  { id: 3, content: 'Middle votes', votes: 5 },
]

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes, filter: '' })
})

describe('AnecdoteList', () => {
  it('renders anecdotes sorted by votes, most votes first', () => {
    const { container } = render(<AnecdoteList />)

    const contents = anecdotes.map(a => a.content)
    const renderedOrder = [...container.querySelectorAll('div')]
      .map(div => div.textContent)
      .filter(text => contents.includes(text))

    expect(renderedOrder).toEqual(['Most votes', 'Middle votes', 'Least votes'])
  })

  it('renders only anecdotes matching the filter', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: 1, content: 'Banana bread recipe', votes: 1 },
        { id: 2, content: 'Banana split recipe', votes: 2 },
        { id: 3, content: 'Apple pie recipe', votes: 3 },
      ],
      filter: 'Banana'
    })

    const { container } = render(<AnecdoteList />)
    const renderedText = container.textContent

    expect(renderedText).toContain('Banana bread recipe')
    expect(renderedText).toContain('Banana split recipe')
    expect(renderedText).not.toContain('Apple pie recipe')
  })
})
