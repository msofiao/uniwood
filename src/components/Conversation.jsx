import React from 'react'
import Message from './Message'

//extra component for messaging because theres data input 
const Conversation = () => {
  return (
    <div className='conversation'>
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />

    </div>
  )
}

export default Conversation
