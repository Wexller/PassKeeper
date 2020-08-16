import React, {useContext} from 'react';
import '../styles/header.scss'
import {AuthContext} from '../context/AuthContext';

function Header() {
  const auth = useContext(AuthContext)

  return (
    <header className="header">
      <h2 className="header__title" style={{ marginTop: '1rem' }}>
        PassKeeper
      </h2>
      <div className="header__user-info">
        <div className="header__email">
          ({auth.userEmail})
          &nbsp;
          <button className='btn' onClick={auth.logout}>
            Выйти
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
