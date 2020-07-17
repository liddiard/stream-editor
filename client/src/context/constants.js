export const API_ROOT = process.env.NODE_ENV === 'development' ?
  'http://localhost:5000/v1/' :
  'https://api.streameditor.io/v1/'

export const INPUT_DELAY = 250 // time to wait between keystrokes before sending API request to execute commands
export const MAX_INPUT_LENGTH = Math.pow(2, 20) // should match server-side constant of the same name
export const MAX_OPERATIONS = 16 // should match server-side constant of the same name

export const INITIAL_INPUT = `Welcome to Stream Editor, a tool for interactively writing and chaining command-line text manipulation utilities.

This pane contains input. Modify it with the command below, and see its output change to the right.`

export const INITIAL_OPERATION = {
  command: 'sed',
  args: '\'s/input/output/; s/ it/& further/; s/change/appear/\''
}

export const DEFAULT_OPERATION = {
  // cat w/o arguments, returns the input unmodified
  command: 'cat',
  args: ''
}

export const ERROR_GENERIC = {
  message: 'Sorry, an unexpected error occurred.',
  index: 0
}

export const ERROR_NULL = {
  message: null,
  index: null
}

export const SET_LOADING = 'SET_LOADING'
export const SET_COMMANDS = 'SET_COMMANDS'
export const SET_INPUT = 'SET_INPUT'

export const SET_UPLOAD_ERROR = 'SET_UPLOAD_ERROR'
export const SET_OPERATION_ERROR = 'SET_OPERATION_ERROR'

export const SET_OPERATIONS = 'SET_OPERATIONS'
export const PUSH_OPERATION = 'PUSH_OPERATION'
export const INSERT_OPERATION = 'INSERT_OPERATION'
export const REMOVE_OPERATION = 'REMOVE_OPERATION'
export const SET_OPERATION_COMMAND = 'SET_OPERATION_COMMAND'
export const SET_OPERATION_ARGS = 'SET_OPERATION_ARGS'

export const SET_API_INPUT = 'SET_API_INPUT'
export const SET_OUTPUTS = 'SET_OUTPUTS'

export const SET_OPTIONS = 'SET_OPTIONS'
export const SET_OPTION = 'SET_OPTION'