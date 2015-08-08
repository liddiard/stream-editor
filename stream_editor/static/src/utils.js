module.exports = {

  encodeUrl: function(operations) {
    // takes an array of operations and encodes it into a querystring of the
    // format: ?cmd-0=[command name]&args-0=[arguments]&cmd-1=[command name]…

    // holds flattened key/value pairs like: {cmd-0: 'sed'}
    var urlComponents = {};
    operations.forEach(function(operation, index){
      urlComponents['cmd-'+index] = operation.cmd;
      urlComponents['args-'+index] = operation.args;
    });

    // holds url-encoded strings of key/value pairs like: "cmd-0=sed&args-0=s%2Fa%2Fa%2Fg"
    var encodedPairs = [];
    for (var key in urlComponents) {
      if (urlComponents.hasOwnProperty(key)) {
        encodedPairs.push(window.encodeURIComponent(key) + '=' +
                          window.encodeURIComponent(urlComponents[key]));
      }
    }

    // the final querystring, parameters separated by ampersands
    var querystring = "?" + encodedPairs.join('&');
    return querystring;
  },


  decodeUrl: function(querystring) {
    // takes a querystring encoded with the encodeUrl function and returns an
    // array of operations

    // remove the leading question mark and split the parameters into an array
    var encodedPairs = querystring.slice(1).split('&');

    // holds flattened key/value pairs like: {cmd-0: 'sed'}
    var urlComponents = {};
    encodedPairs.forEach(function(pair, index){
      components = pair.split('=');
      urlComponents[window.decodeURIComponent(components[0])] = window.decodeURIComponent(components[1]);
    });

    var operations = [];
    var index = 0;
    // look for keys in the format we expect until we run out or hit a snag
    // and compile them into an array of operation objects
    while(1) {
      if (urlComponents.hasOwnProperty('cmd-'+index) &&
          urlComponents.hasOwnProperty('args-'+index)) {
        operations.push({
          cmd: urlComponents['cmd-'+index],
          args: urlComponents['args-'+index],
          error: ''
        });
        index++;
      }
      else break;
    }

    return operations;
  },


  updateDocumentUrl: function(operations) {
    // update the current document url with a url-encoded querystring from
    // `operations`, omitting the last, placeholder operation
    window.history.replaceState({}, '', this.encodeUrl(operations.slice(0, operations.length-1)));
  },


  dropDownCommandSelect: function(position) {
    // initialize a mouse click event on the dropdown menu in specified
    // position. `initMouseEvent` is deprecated, but I couldn't get the
    // MouseEvent constructor method to work on <select> elements (worked fine
    // on checkboxes though).
    // cf. https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent
    var commandSelects = document.querySelectorAll('.operation select');
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('mousedown', true, true, window);
    commandSelects[position].dispatchEvent(event);
  },


  getScrollElements: function() {
    // get an array of the elements upon which synced scrolling should operate
    return document.querySelectorAll('.io textarea, .io output');
  },


  syncScrolling: function(scrollElements, event) {
    // scroll all scrollElements to the scrollTop specified on event.target
    // with the exception of event.target (to prevent an infinite set/get)
    [].forEach.call(scrollElements, function(el){
      if (el === event.target) return;
      el.scrollTop = event.target.scrollTop;
    });
  },


  toggleSyncScrolling: function(currentlyEnabled) {
    // enables synced scrolling on scrollElements if currentlyEnabled is true,
    // else disables
    var scrollElements = this.getScrollElements();
    var syncScrolling = this.syncScrolling.bind(this, scrollElements);
    if (currentlyEnabled) {
      [].forEach.call(scrollElements, function(el){
        // clear the scroll handler function. setting the event property
        // directly overwrites any previous event handler
        el.onscroll = null;
      });
    }
    else {
      [].forEach.call(scrollElements, function(el){
        el.onscroll = syncScrolling;
      });
    }
  },


  rebindSyncScrolling: function() {
    // disable and reenable scrolling on all scroll elements. call when the
    // list of elements to which synced scrolling should be applied changes
    this.toggleSyncScrolling(true);
    this.toggleSyncScrolling(false);
  },


  selectText: function(element) {
    // select all text in "element"
    // source: http://stackoverflow.com/a/987376/2487925
    var doc = document
      , text = doc.getElementById(element)
      , range, selection
    ;
    if (doc.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(text);
      range.select();
    } else if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  },


  selectOutputText: function(event) {
    console.log(this);
    var selectAllButton = event.target;
    var outputContainer = selectAllButton.parentNode;
    var output = outputContainer.querySelector('output');
    this.selectText(output);
  }

};
