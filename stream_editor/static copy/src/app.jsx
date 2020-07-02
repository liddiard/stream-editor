var React = require('react');
require('./app.scss');

var Header = require('./components/Header.jsx');
var Editor = require('./components/Editor.jsx');


var App = React.createClass({

  render: function() {
    return (
      <div id="app">
        <Header />
        <Editor />
      </div>
    )
  }

});


React.render(<App />, document.body);
