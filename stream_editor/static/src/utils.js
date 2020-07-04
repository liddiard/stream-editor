import { SET_OPERATIONS, SET_OPTIONS } from './constants'


// get an array of the elements upon which synced scrolling should operate
const getScrollElements = () =>
  document.querySelectorAll('.io-container textarea, .io-container output')

// scroll all scrollElements to the scrollTop specified on event.target
// with the exception of event.target (to prevent an infinite set/get)
const syncScroll =(scrollElements, event) => {
  [].forEach.call(scrollElements, (el) => {
    if (el === event.target) {
      return
    }
    el.scrollTop = event.target.scrollTop
  })
}

// enables synced scrolling on scrollElements if enabled is true,
// else disables
export const toggleSyncScrolling = (enable) => {
  const scrollElements = getScrollElements()
  const _syncScroll = syncScroll.bind(this, scrollElements);
  [].forEach.call(scrollElements, (el) =>
    // clear the scroll handler function. setting the event property
    // directly overwrites any previous event handler
    el.onscroll = enable ? _syncScroll : null
  )
}

// disable and reenable scrolling on all scroll elements. call when the
// list of elements to which synced scrolling should be applied changes
export const rebindSyncScrolling = () => {
  toggleSyncScrolling(false)
  toggleSyncScrolling(true)
}

// encode the provided options into a querystring and update the URL
export const writeOperationsToQuerystring = (operations) => {
  const params = new URLSearchParams(window.location.search)
  params.set('operations', JSON.stringify(operations))
  window.history.replaceState({}, '', `?${params.toString()}`)
}

// read the operations encoded in the URL and update the app's state
export const updateOperationsFromQuerystring = (dispatch) => {
  const urlParams = new URLSearchParams(window.location.search)
  let operations = urlParams.get('operations')
  if (operations) {
    try {
      operations = JSON.parse(operations)
      dispatch({ type: SET_OPERATIONS, operations })
    } catch (ex) {
      console.warn(`Failed to parse operations from querystring: ${operations}\nError: ${ex}`)
    }
  }
}

export const writeOptionsToLocalStorage = (options) => {
  localStorage.setItem('options', JSON.stringify(options))
}

export const updateOptionsFromLocalStorage = (dispatch) => {
  let options = localStorage.getItem('options')
  if (options) {
    try {
      options = JSON.parse(options)
      dispatch({ type: SET_OPTIONS, options })
    } catch (ex) {
      console.warn(`Failed to parse options from local storage: ${options}\nError: ${ex}`)
    }
  }
}

// get the minimum width of a pane based on the `panesInViewport` setting
export const getMinWidth = (panesInViewport) => `calc(${100/panesInViewport}% - 25px)`

export const getBashString = (operations) =>
  operations.map(op => `${op.command} ${op.args}`).join(' | ')