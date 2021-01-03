import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { increaseVotes } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleVote}) => {
    return (
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleVote}>vote</button>
            </div>
        </div>
    )
}

const Anecdotes = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ filter, anecdotes}) => {
      if (filter === '') {
        return anecdotes
      }
      return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
    })

    const vote = anecdote => {
      dispatch(increaseVotes(anecdote))
      dispatch(setNotification(`you voted for "${anecdote.content}"`, 5))
    }

    return (
        <div>
          {anecdotes
            .sort(function (a, b) {
              return b.votes - a.votes
            })
            .map(anecdote =>
              <Anecdote key={anecdote.id} anecdote={anecdote} 
                handleVote={() => vote(anecdote)} />
          )}
        </div>
      )
}

export default Anecdotes