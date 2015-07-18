var React = require('react');


var Operation = React.createClass({

  propTypes: {
    commands: React.PropTypes.array.isRequired,
    selected: React.PropTypes.string.isRequired,
    operations: React.PropTypes.array.isRequired,
    pushOperation: React.PropTypes.func.isRequired,
    removeOperation: React.PropTypes.func.isRequired,
    position: React.PropTypes.number.isRequired,
    onOperationChange: React.PropTypes.func.isRequired
  },

  pushOperationIfLast: function() {
    if (this.props.position === this.props.operations.length - 1)
      this.props.pushOperation();
  },

  render: function() {
    var options = this.props.commands.map(function(command, index){
      return (
        <option key={command.name} value={command.name}>
          {command.name}
        </option>
      );
    }.bind(this));
    return (
      <div className="operation">
        <select name="command"
                onChange={this.props.onOperationChange.bind(null, this.props.position)}>
          {options}
        </select>
        <input type="text" name="args"
               onChange={this.props.onOperationChange.bind(null, this.props.position)}
               onFocus={this.pushOperationIfLast} />
      </div>
    );
  }

});


module.exports = Operation;
