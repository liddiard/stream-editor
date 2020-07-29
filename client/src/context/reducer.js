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
  SET_PANES,
  SET_PANE_OPTIONS,
  SET_OPTIONS
} from './constants'

import { uuid } from '../utils'


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
    panes,
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
        panes: [
          ...state.panes,
          { id: uuid() }
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
        panes: [
          ...state.panes.slice(0, index),
          { id: uuid() },
          ...state.panes.slice(index)
        ],
      }
    case REMOVE_OPERATION:
      return { 
        ...state,
        operations: [
          ...state.operations.slice(0, index),
          ...state.operations.slice(index+1)
        ],
        panes: [
          ...state.panes.slice(0, Math.max(index-1, 0)),
          ...state.panes.slice(Math.max(index, 1))
        ]
      }
    case SET_OPERATION_COMMAND:
      return {
        ...state,
        operations: [
          ...state.operations.slice(0, index),
          { ...(state.operations[index] || DEFAULT_OPERATION), command },
          ...state.operations.slice(index+1)
        ]
      }
    case SET_OPERATION_ARGS:
      return {
        ...state,
        operations: [
          ...state.operations.slice(0, index),
          { ...(state.operations[index] || DEFAULT_OPERATION), args },
          ...state.operations.slice(index+1)
        ]
      }
    case SET_API_INPUT:
      return { ...state, apiInput: input }
    case SET_OUTPUTS:
      return { ...state, outputs }
    case SET_PANES: 
      return { ...state, panes }
    case SET_PANE_OPTIONS:
      return {
        ...state,
        panes: [
          ...state.panes.slice(0, index),
          { ...state.panes[index], ...options },
          ...state.panes.slice(index+1)
        ]
      }
    case SET_OPTIONS:
      return {
        ...state,
        options: { ...state.options, ...options }
      }
    default:
      return state
  }
}