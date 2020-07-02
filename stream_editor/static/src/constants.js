export const API_ROOT = 'http://localhost:5000/api/v1/'

export const INPUT_DELAY = 250

export const DEFAULT_OPERATION = {
  // sed w/o arguments, returns the input unmodified
  command: 'sed',
  args: ''
}

export const ERROR_GENERIC = {
  message: 'Sorry, an unexpected error occurred.',
  index: 0
}

export const SET_LOADING = 'SET_LOADING'
export const SET_ERROR = 'SET_ERROR'
export const SET_COMMANDS = 'SET_COMMANDS'
export const SET_INPUT = 'SET_INPUT'

export const SET_OPERATIONS = 'SET_OPERATIONS'
export const PUSH_OPERATION = 'PUSH_OPERATION'
export const INSERT_OPERATION = 'INSERT_OPERATION'
export const REMOVE_OPERATION = 'REMOVE_OPERATION'
export const SET_OPERATION_COMMAND = 'SET_OPERATION_COMMAND'
export const SET_OPERATION_ARGS = 'SET_OPERATION_ARGS'

export const SET_API_INPUT = 'SET_API_INPUT'
export const SET_OUTPUTS = 'SET_OUTPUTS'

export const SET_OPTION = 'SET_OPTION'