var React = require('react');


var Operation = React.createClass({

  propTypes: {
    cmds: React.PropTypes.array.isRequired,
    operations: React.PropTypes.array.isRequired,
    operation: React.PropTypes.object.isRequired,
    pushOperation: React.PropTypes.func.isRequired,
    canRemoveOperation: React.PropTypes.func.isRequired,
    removeOperation: React.PropTypes.func.isRequired,
    position: React.PropTypes.number.isRequired,
    onCmdChange: React.PropTypes.func.isRequired,
    onArgsChange: React.PropTypes.func.isRequired
  },

  pushOperationIfLast: function() {
    if (this.props.position === this.props.operations.length - 1)
      this.props.pushOperation();
  },

  render: function() {
    var options = this.props.cmds.map(function(cmd, index){
      return (
        <option key={cmd.name} value={cmd.name}>
          {cmd.name}
        </option>
      );
    }.bind(this));
    var removeButton;
    if (this.props.canRemoveOperation() &&
        this.props.position != this.props.operations.length - 1) {
      removeButton = (
        <button className="remove-operation"
                onClick={this.props.removeOperation.bind(null, this.props.position)}>
          ✕
        </button>
      );
    }
    return (
      <div className="operation">
        <select name="cmd" value={this.props.operation.cmd}
                onChange={this.props.onCmdChange.bind(null, this.props.position)}>
          {options}
        </select>
        <div className="input">
          <input type="text" name="args" value={this.props.operation.args}
                 onChange={this.props.onArgsChange.bind(null, this.props.position)}
                 onFocus={this.pushOperationIfLast} />
           <div className="error">{this.props.operation.error}</div>
        </div>
        {removeButton}
      </div>
    );
  }

});


module.exports = Operation;
