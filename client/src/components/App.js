import React from 'react'
import '../styles/app.scss'
import Header from './Header'
import Body from './Body'
import Modal from 'react-modal'

Modal.setAppElement('#root')

function App() {
  return (
    <div className="container">
      <Header />
      <Body />
    </div>
  )
}

export default App
