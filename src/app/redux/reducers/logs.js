/* @flow */
import type {ServerDefinition, LogDefinition, LoggerDatum} from 'lib/typedefs/data'
import type {LogFilter} from 'lib/storage/typedefs'

export type LogsAction = {
  type: 'logs/SET_SELECTED_SERVER',
  server: ServerDefinition | null,
} | {
  type: 'logs/SET_SELECTED_LOG',
  log: LogDefinition | null,
} | {
  type: 'logs/RECEIVE_LOGS',
  params: LogFilter,
  logs: LoggerDatum[]
} | {
  type: 'logs/FETCH_LOGS',
  params: LogFilter
} | {
  type: 'logs/RECEIVE_LOG',
  params: LogFilter,
  log: LoggerDatum
} | {
  type: 'logs/SET_SEARCH_STRING',
  searchString: string,
}

export type LogsSubstate = {
  selectedServer: ServerDefinition | null,
  selectedLog: LogDefinition | null,
  logs: LoggerDatum[],
  params: LogFilter,
  searchString: string,
}

export const DefaultLogsSubstate: LogsSubstate = {
  selectedServer: null,
  selectedLog: null,
  logs: [],
  params: {},
  searchString: '',
  fetching: false,
}

export default function reducer (
  state: LogsSubstate = DefaultLogsSubstate,
  action: LogsAction,
): LogsSubstate {
  switch (action.type) {
    case 'logs/SET_SELECTED_SERVER':
      return {
        ...state,
        selectedServer: action.server,
      }
    case 'logs/SET_SELECTED_LOG':
      return {
        ...state,
        selectedLog: action.log,
      }
    case 'logs/FETCH_LOGS':
      return {
        ...state,
        fetching: true,
        params: action.params,
      }
    case 'logs/RECEIVE_LOGS':
      return {
        ...state,
        fetching: false,
        params: action.params,
        logs: action.logs,
      }
    case 'logs/RECEIVE_LOG':
      return {
        ...state,
        params: action.params,
        logs: [action.log, ...state.logs],
      }
    case 'logs/SET_SEARCH_STRING':
      return {
        ...state,
        searchString: action.searchString,
      }
    default:
      return state
  }

}
