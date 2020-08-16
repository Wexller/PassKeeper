import React from 'react';
import Modal from 'react-modal';
import {BrowserRouter as Router} from 'react-router-dom';
import {useRoutes} from './routes';
import {useAuth} from './hooks/auth.hook';
import {AuthContext} from './context/AuthContext';
import Loader from './components/elements/Loader';
import './styles/app.scss';

Modal.setAppElement('#root')

function App() {
  const {token, login, logout, userId, userEmail, ready} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  if (!ready) {
    return <Loader />
  }

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, userEmail, isAuthenticated
    }}>
      <Router>
        <div className="container">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
