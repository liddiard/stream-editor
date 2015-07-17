var React = require('react');


var Output = React.createClass({

  propTypes: {
    text: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <output>
        {this.props.text}
      </output>
    );
  }

});


module.exports = Output;
