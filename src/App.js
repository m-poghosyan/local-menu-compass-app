import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import enGB from 'antd/lib/locale-provider/en_GB'
// import frFR from 'antd/lib/locale-provider/fr_FR'
// import ptPT from 'antd/lib/locale-provider/pt_PT'

import Layout from './layouts/default'
import Theme from './Theme'
import store from './store'

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={enGB}>
        <Router>
          <Theme>
            <Layout showMenu />
          </Theme>
        </Router>
      </ConfigProvider>
    </Provider>
  )
}

export default App
