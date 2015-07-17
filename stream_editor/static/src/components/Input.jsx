var React = require('react');


var Input = React.createClass({

  propTypes: {
    text: React.PropTypes.string.isRequired,
    onInputChange: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <textarea value={this.props.text}
                onChange={this.props.onInputChange} />
    );
  }

});


module.exports = Input;
