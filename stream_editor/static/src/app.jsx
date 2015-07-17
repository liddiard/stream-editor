var React = require('react');

var Header = require('./components/Header.jsx');
var Editor = require('./components/Editor.jsx');


var App = React.createClass({

  render: function() {
    return (
      <div>
        <Header />
        <Editor />
      </div>
    )
  }

});


React.render(<App />, document.body);
