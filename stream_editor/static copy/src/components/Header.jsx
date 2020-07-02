var React = require('react');


var Header = React.createClass({

  render: function() {
    return (
      <header>
        <div id="logo">
          &gt;<img src="/static/img/pencil-icon.svg"/>
        </div>
        <h1>Stream Editor</h1>
        <h2 className="tagline">
          Interactively manipulate text with Linux commands.
        </h2>
      </header>
    )
  }

});


module.exports = Header;
