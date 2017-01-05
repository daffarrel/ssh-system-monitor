/* @flow */

import {applyMiddleware, createStore as _createStore} from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducers from './reducers'
import createLogger from 'redux-logger'
import type {Store} from './types'

let _store = null

type StoreOptions = {
  logger: boolean,
}

export function getStore (preloadedState: Object = {}, opts: StoreOptions = {logger: true}) : Store {
  const middleware = [thunkMiddleware]

  if (opts.logger) middleware.push(createLogger())

  if (!_store) {
    _store = _createStore(
      reducers,
      preloadedState,
      applyMiddleware.apply(applyMiddleware, middleware)
    )
  }

  return _store
}