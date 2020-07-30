import {
  INITIAL_INPUT,
  INITIAL_OPERATION,
  DEFAULT_OPERATION,
  DEFAULT_PANES
} from './constants'
import {
  getOperationsFromQuerystring,
  getJSONFromLocalStorage,
  getJSONFromSessionStorage
} from '../utils'


const inputFromSessionStorage = sessionStorage.getItem('input')

export default {
  loading: false,
  commands: [], // supported commands and associated descriptions/resources
  input: inputFromSessionStorage !== null ? // user's text input
    inputFromSessionStorage :
    INITIAL_INPUT,
  operations: inputFromSessionStorage !== null ? // user's commands + arguments
    (getOperationsFromQuerystring() || [DEFAULT_OPERATION]) :
    [INITIAL_OPERATION],
  apiInput: '', // input from which the outputs were generated.
                // needed for diff b/c there's a delay between input
                // and receiving API resoponse.
  outputs: [],  // list of outputs after each operation is performed
  panes: getJSONFromSessionStorage('panes') || DEFAULT_PANES,
  errors: {
    upload: {
      message: null
    },
    operation: {
      message: null,
      index: null // index of `operations` where the error occurred, if applicable
    }
  },
  options: {
    syncScroll: true,    // scroll all input/output panes together
    fontSize: 12,        // font size in `pt`
    fontStyle: 'mono',   // 'mono' or 'sans'
    // default to user's preference for dark mode
    // https://stackoverflow.com/a/57795495
    darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    ...getJSONFromLocalStorage('options')
  }
}