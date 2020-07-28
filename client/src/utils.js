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

// return operations encoded in the URL
export const getOperationsFromQuerystring = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const operations = urlParams.get('operations')
  if (operations) {
    try {
      return JSON.parse(operations)
    } catch (ex) {
      console.warn(`Failed to parse operations from querystring: ${operations}\nError: ${ex}`)
    }
  }
}

export const writeOptionsToLocalStorage = (options) =>
  localStorage.setItem('options', JSON.stringify(options))

export const getOptionsFromLocalStorage = () => {
  const options = localStorage.getItem('options')
  if (options) {
    try {
      return JSON.parse(options)
    } catch (ex) {
      console.warn(`Failed to parse options from local storage: ${options}\nError: ${ex}`)
    }
  }
}

// get operations as a string of piped-together commands
export const getBashString = (operations) =>
  operations.map(op =>
    [op.command].concat(op.args ? [op.args] : []).join(' ')).join(' | ')

// open a download dialog for a file with the provided filename and text
// https://stackoverflow.com/a/18197341
export const downloadFile = (filename, text) => {
  const el = document.createElement('a');
  el.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
  el.setAttribute('download', filename);
  el.style.display = 'none';
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}