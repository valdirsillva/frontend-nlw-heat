import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { Authprovider } from './components/contexts/auth'

import "./styles/global.css"

ReactDOM.render(
  <React.StrictMode>
    <Authprovider>
      <App />
    </Authprovider>
  </React.StrictMode>,
  document.getElementById('root')
)
