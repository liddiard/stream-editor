import { SET_OPERATIONS } from './constants'


export const encodeUrl = (operations) => {
  // takes an array of operations and encodes it into a querystring of the
  // format: ?command-0=[command name]&args-0=[arguments]&command-1=[command name]…

  // holds flattened key/value pairs like: {command-0: 'sed'}
  const urlComponents = {}
  operations.forEach(function(operation, index){
    urlComponents['command-'+index] = operation.command
    urlComponents['args-'+index] = operation.args
  })

  // holds url-encoded strings of key/value pairs like: "command-0=sed&args-0=s%2Fa%2Fa%2Fg"
  const encodedPairs = []
  for (var key in urlComponents) {
    if (urlComponents.hasOwnProperty(key)) {
      encodedPairs.push(window.encodeURIComponent(key) + '=' +
                        window.encodeURIComponent(urlComponents[key]))
    }
  }

  // the final querystring, parameters separated by ampersands
  var querystring = "?" + encodedPairs.join('&')
  return querystring
}

export const decodeUrl = (querystring) => {
  // takes a querystring encoded with the encodeUrl function and returns an
  // array of operations

  // remove the leading question mark and split the parameters into an array
  const encodedPairs = querystring.slice(1).split('&')

  // holds flattened key/value pairs like: {command-0: 'sed'}
  const urlComponents = {}
  encodedPairs.forEach(function(pair, index){
    const components = pair.split('=')
    urlComponents[window.decodeURIComponent(components[0])] = window.decodeURIComponent(components[1])
  })

  const operations = []
  var index = 0
  // look for keys in the format we expect until we run out or hit a snag
  // and compile them into an array of operation objects
  while(1) {
    if (urlComponents.hasOwnProperty('command-'+index) &&
        urlComponents.hasOwnProperty('args-'+index)) {
      operations.push({
        command: urlComponents['command-'+index],
        args: urlComponents['args-'+index],
        error: ''
      })
      index++
    }
    else break
  }

  return operations
}


export const updateDocumentUrl = (operations) => {
  // update the current document url with a url-encoded querystring from
  // `operations`, omitting the last, placeholder operation
  window.history.replaceState({}, '', encodeUrl(operations.slice(0, operations.length-1)))
}


export const dropDownCommandSelect = (position) => {
  // initialize a mouse click event on the dropdown menu in specified
  // position. `initMouseEvent` is deprecated, but I couldn't get the
  // MouseEvent constructor method to work on <select> elements (worked fine
  // on checkboxes though).
  // cf. https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent
  const commandSelects = document.querySelectorAll('.operation select')
  const event = document.createEvent('MouseEvents')
  event.initMouseEvent('mousedown', true, true, window)
  commandSelects[position].dispatchEvent(event)
}


export const getScrollElements = () => {
  // get an array of the elements upon which synced scrolling should operate
  return document.querySelectorAll('.io textarea, .io output')
}


export const syncScrolling =(scrollElements, event) => {
  // scroll all scrollElements to the scrollTop specified on event.target
  // with the exception of event.target (to prevent an infinite set/get)
  [].forEach.call(scrollElements, function(el){
    if (el === event.target) return
    el.scrollTop = event.target.scrollTop
  })
}


export const toggleSyncScrolling = (currentlyEnabled) => {
  // enables synced scrolling on scrollElements if currentlyEnabled is true,
  // else disables
  const scrollElements = getScrollElements()
  const _syncScrolling = syncScrolling.bind(this, scrollElements)
  if (currentlyEnabled) {
    [].forEach.call(scrollElements, function(el){
      // clear the scroll handler function. setting the event property
      // directly overwrites any previous event handler
      el.onscroll = null
    })
  }
  else {
    [].forEach.call(scrollElements, function(el){
      el.onscroll = _syncScrolling
    })
  }
}


export const rebindSyncScrolling = () => {
  // disable and reenable scrolling on all scroll elements. call when the
  // list of elements to which synced scrolling should be applied changes
  toggleSyncScrolling(true)
  toggleSyncScrolling(false)
}


export const displayCopySuccess =(event) => {
  // display success message of a copy given an event from ReactZeroClipboard
  // whose target is a copy button inside an Output component
  const successMsg = event.target.parentNode.querySelector('.copy.success-msg')

  // make the error message appear and do nothing for 0.5s
  successMsg.style.display = "block"
  setTimeout(function(){
    successMsg.style.opacity = 0
  }, 500)

  // fade out the error message and set its display back to none and opacity
  // to 1 after fade out is complete so it is ready for the next time the
  // message may need to be displayed
  setTimeout(function(){
    successMsg.style.display = "none"
    successMsg.style.opacity = 1
  }, 3000)
}

export default {
  encodeUrl,
  decodeUrl,
  updateDocumentUrl,
  dropDownCommandSelect,
  getScrollElements,
  syncScrolling,
  toggleSyncScrolling,
  rebindSyncScrolling,
  displayCopySuccess
}

export const writeOperationsToQuerystring = (operations) => {
  const params = new URLSearchParams(window.location.search)
  params.set('operations', JSON.stringify(operations))
  window.history.replaceState({}, '', `?${params.toString()}`)
}

export const updateOperationsFromQuerystring = (dispatch) => {
  const urlParams = new URLSearchParams(window.location.search);
  let operations = urlParams.get('operations');
  if (operations) {
    try {
      operations = JSON.parse(operations)
      dispatch({ type: SET_OPERATIONS, operations });
    } catch (ex) {
      console.warn(`Failed to parse options from querystring: ${operations}\nError: ${ex}`)
    }
  }
}