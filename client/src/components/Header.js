import React from 'react';
import '../styles/header.scss'

function Header() {
  return (
    <header className="header">
      <h2 className="header__title">
        PassKeeper
      </h2>
      <div className="header__user-info">
        <div className="header__name">
          Max Wexller
        </div>
        <div className="header__email">
          (maxim.davydov.94@gmail.com)
        </div>
      </div>
    </header>
  )
}

export default Header
