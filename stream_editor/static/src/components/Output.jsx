var React = require('react');


var Output = React.createClass({

  propTypes: {
    text: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <output>
        <pre>
          {this.props.text}
        </pre>
      </output>
    );
  }

});


module.exports = Output;
