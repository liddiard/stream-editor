var request = require('superagent');
var React = require('react');

var Input = require('./Input.jsx');
var Operation = require('./Operation.jsx');
var Output = require('./Output.jsx');


var API_ROOT = '/api/';


var Editor = React.createClass({

  getDefaultProps: function() {
    return {
      defaultOperation: {
        // sed w/o arguments, returns the input unmodified
        command: 'sed',
        args: '',
        error: ''
      }
    };
  },

  getInitialState: function() {
    return {
      commands: [], // supported commands and associated descriptions/resources
      input: '',    // user's text input
      operations: [ // user's commands + arguments
        this.props.defaultOperation,
        this.props.defaultOperation
      ],
      outputs: [''] // list of output after each operation is performed
    }
  },

  componentDidMount: function() {
    request
    .get(API_ROOT + 'commands/')
    .end(function(err, res){
      this.setState({
        commands: res.body.commands
      });
    }.bind(this));
  },

  handleInputChange: function(event) {
    this.setState({input: event.target.value}, this.executeOperations);
  },

  handleOperationChange: function(position, event) {
    var input = event.target;
    var operations = this.state.operations;
    operations[position][input.name] = input.value;
    this.setState({operations: operations}, this.executeOperations);
  },

  pushOperation: function() {
    var operations = this.state.operations;
    operations.push(this.props.defaultOperation);
    this.setState({operations: operations});
  },

  removeOperation: function(index) {
    if (this.state.operations.length <= 2)
      return; // must have at least two operations in memory
    var operations = this.state.operations;
    operations.splice(index, 1);
    this.setState({operations: operations});
  },

  executeOperations: function() {
    // send all operations except the last, which is a placeholder for the user
    // to click on to add a new operation
    var operationsUsed = this.state.operations.slice(0, this.state.operations.length-1);
    request
    .post(API_ROOT + 'execute/')
    .send({input: this.state.input, operations: operationsUsed})
    .end(function(err, res){
      if (res.body.error) {
        var operations = this.state.operations;
        operations[res.body.error_pos].error = res.body.error_msg;
        this.setState({operations: operations});
      }
      else {
        this.clearOperationErrors();
        this.setState({outputs: res.body.outputs});
      }
      console.log(this.state.outputs);
    }.bind(this));
  },

  clearOperationErrors: function() {
    for (var i = 0; i < this.state.operations.length; i++) {
      this.state.operations[i].error = "";
    }
  },

  render: function() {
    var operations = this.state.operations.map(function(operation, index){
      return (
        <Operation commands={this.state.commands}
                   selected={operation.command}
                   operations={this.state.operations}
                   pushOperation={this.pushOperation}
                   removeOperation={this.removeOperation}
                   position={index}
                   onOperationChange={this.handleOperationChange}
                   key={index} />
      );
    }.bind(this));
    var outputs = this.state.outputs.map(function(output, index){
      return (
        <Output text={this.state.outputs[index]} key={index} />
      );
    }.bind(this));
    return (
      <main>
        {operations}
        <Input text={this.state.input} onInputChange={this.handleInputChange} />
        {outputs}
      </main>
    );
  }

});


module.exports = Editor;
