import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import memoryUtils from './utils/memoryUtils'
import storeUtils from './utils/storeUtils'

const user = storeUtils.getUser()
memoryUtils.user = user

ReactDOM.render(<App/>, document.getElementById('root'))