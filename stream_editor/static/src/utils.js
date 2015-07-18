var Utils = function() {

  var encodeUrl = function(operations) {

    var urlComponents = {};
    operations.forEach(function(operation, index){
      urlComponents['cmd-'+index] = operation.cmd;
      urlComponents['args-'+index] = operation.args;
    });

    var encodedPairs = [];
    for (var key in urlComponents) {
      if (urlComponents.hasOwnProperty(key)) {
        encodedPairs.push(window.encodeURIComponent(key) + '=' +
                          window.encodeURIComponent(urlComponents[key]));
      }
    }

    var querystring = "?" + encodedPairs.join('&');
    return querystring;
  };


  var decodeUrl = function(querystring) {

    var encodedPairs = querystring.slice(1).split('&');

    var urlComponents = {};
    encodedPairs.forEach(function(pair, index){
      components = pair.split('=');
      urlComponents[window.decodeURIComponent(components[0])] = window.decodeURIComponent(components[1]);
    });

    var operations = [];
    var index = 0;
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
  };

}


module.exports = Utils;
