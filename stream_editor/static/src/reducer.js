import {
  DEFAULT_OPERATION,
  SET_LOADING,
  SET_ERROR,
  SET_COMMANDS,
  SET_INPUT,
  SET_OPERATIONS,
  PUSH_OPERATION,
  INSERT_OPERATION,
  REMOVE_OPERATION,
  SET_OPERATION_COMMAND,
  SET_OPERATION_ARGS,
  SET_API_INPUT,
  SET_OUTPUTS,
  SET_OPTIONS,
  SET_OPTION
} from './constants'

export const initialState = {
  loading: false,
  commands: [], // supported commands and associated descriptions/resources
  input: '',    // user's text input
  operations: [ // user's commands + arguments
    { ...DEFAULT_OPERATION }
  ],
  apiInput: '', // input from which the outputs were generated.
                // needed for diff b/c there's a delay between input
                // and receiving API resoponse.
  outputs: [''], // list of output after each operation is performed
  error: {
    message: null,
    index: null // index of `operations` where the error occurred, if applicable
  },
  options: {
    showDiff: true,      // show visual diff of changes
    syncScroll: true,    // scroll all input/output panes together
    fontSize: 12,        // font size in `pt`
    fontStyle: 'mono',   // 'mono' or 'sans'
    panesInViewport: 3,  // max number of input/output panes in view
    // https://stackoverflow.com/a/57795495
    darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
  }
}

export default (state, action) => {
  const {
    loading,
    error,
    commands,
    input,
    operations,
    command,
    args,
    index,
    outputs,
    options,
    key,
    value
  } = action
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading }
    case SET_ERROR:
      return { ...state, error }
    case SET_COMMANDS:
      return { ...state, commands }
    case SET_INPUT:
      return { ...state, input }
    case SET_OPERATIONS:
      return {
        ...state,
        operations,
        outputs: Array(operations.length).fill('')
      }
    case PUSH_OPERATION:
      return {
        ...state,
        operations: [
          ...state.operations, { ...DEFAULT_OPERATION }
        ],
        outputs: [
          ...state.outputs, ''
        ]
      }
    case INSERT_OPERATION:
      return { 
        ...state,
        operations: [
          ...state.operations.slice(0, index),
          { ...DEFAULT_OPERATION },
          ...state.operations.slice(index)
        ],
        outputs: [
          ...state.outputs.slice(0, index-1),
          state.outputs[index-1],
          ...state.outputs.slice(index-1)
        ],
      }
    case REMOVE_OPERATION:
      return { 
        ...state,
        operations: [
          ...state.operations.slice(0, index),
          ...state.operations.slice(index+1)
        ],
        outputs: [
          ...state.outputs.slice(0, Math.max(index-1, 0)),
          ...state.outputs.slice(Math.max(index, 1))
        ]
      }
    case SET_OPERATION_COMMAND:
      return {
        ...state,
        operations: [
          ...state.operations.slice(0, index),
          { ...(state.operations[index] || DEFAULT_OPERATION), command },
          ...state.operations.slice(index+1)
        ],
        outputs: state.operations[index] ? state.outputs : [
          ...state.outputs, ''
        ]
      }
    case SET_OPERATION_ARGS:
      return {
        ...state,
        operations: [
          ...state.operations.slice(0, index),
          { ...(state.operations[index] || DEFAULT_OPERATION), args },
          ...state.operations.slice(index+1)
        ],
        outputs: state.operations[index] ? state.outputs : [
          ...state.outputs, ''
        ]
      }
    case SET_API_INPUT:
      return { ...state, apiInput: input }
    case SET_OUTPUTS:
      return { ...state, outputs }
    case SET_OPTIONS:
      return {
        ...state,
        options: { ...state.options, ...options }
      }
    case SET_OPTION:
      return {
        ...state,
        options: { ...state.options, [key]: value }
      }
    default:
      return state
  }
}