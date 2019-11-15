import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

const devTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

const middlewares = compose(
  applyMiddleware(thunk),
  devTools || (a => a)
)

const store = createStore(reducers, middlewares)

export default store
