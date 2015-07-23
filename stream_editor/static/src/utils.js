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
    // and complie them into an array of operation objects
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
  }

};
