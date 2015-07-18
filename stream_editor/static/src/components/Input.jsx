var React = require('react');


var Input = React.createClass({

  propTypes: {
    text: React.PropTypes.string.isRequired,
    onInputChange: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      maxLength: 1048576 // 2**20
    };
  },

  render: function() {
    return (
      <textarea value={this.props.text}
                onChange={this.props.onInputChange}
                maxLength={this.props.maxLength} />
    );
  }

});


module.exports = Input;
