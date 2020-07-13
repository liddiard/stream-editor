import React from 'react'

import '../styles/Header.scss'


const Header = () => (
  <header>
    {/* <img id="logo" src="/img/logo.svg"/> */}
    <h1>Stream Editor.</h1>
    <h2 className="tagline">
      Interactively chain Unix text processing commands.
    </h2>
  </header>
)

export default Header