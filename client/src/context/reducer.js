import {
  DEFAULT_OPERATION,
  SET_LOADING,
  SET_UPLOAD_ERROR,
  SET_OPERATION_ERROR,
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
  SET_OPTION,
} from './constants'


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
    case SET_UPLOAD_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          upload: { message: error } 
        }
      }
    case SET_OPERATION_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          operation: error 
        }
      }
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