import {
  INITIAL_INPUT,
  INITIAL_OPERATION,
  DEFAULT_OPERATION
} from './constants'
import {
  getOperationsFromQuerystring,
  getOptionsFromLocalStorage
} from '../utils'


const inputFromSessionStorage = sessionStorage.getItem('input')

// default to 3 panes in viewport, but progressively decrease that number if
// the screen is narrower than the provided breakpoints
let panesInViewport = 3
for (const breakpoint of [1200, 800]) {
  if (window.innerWidth < breakpoint) {
    --panesInViewport
  } else {
    break
  }
}

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
  outputs: [''], // list of output after each operation is performed
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
    panesInViewport,     // max number of input/output panes in view
    // default to user's preference for dark mode
    // https://stackoverflow.com/a/57795495
    darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    ...getOptionsFromLocalStorage()
  }
}