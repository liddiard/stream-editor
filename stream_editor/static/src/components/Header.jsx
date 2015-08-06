var React = require('react');


var Header = React.createClass({

  render: function() {
    return (
      <header>
        <h1>Stream Editor</h1>
        <h2 className="tagline">
          Interactively use Linux text commands like sed, grep, and awk.
        </h2>
      </header>
    )
  }

});


module.exports = Header;
