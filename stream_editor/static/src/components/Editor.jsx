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
        this.newOperation(),
        this.newOperation()
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

  newOperation: function() {
    return JSON.parse(JSON.stringify(this.props.defaultOperation));
  },

  handleInputChange: function(event) {
    this.setState({input: event.target.value}, this.handleKeypress);
  },

  handleCommandChange: function(position, event) {
    var input = event.target;
    var operations = this.state.operations;
    operations[position].command = input.value;
    this.setState({operations: operations}, this.executeOperations);
  },

  handleArgsChange: function(position, event) {
    var input = event.target;
    var operations = this.state.operations;
    operations[position].args = input.value;
    this.setState({operations: operations}, this.handleKeypress);
  },

  handleKeypress: function() {
    // adds a delay between consecutive keypresses and API call to minimize API load
    if (this.timeoutId)
      window.clearTimeout(this.timeoutId);
    this.timeoutId = window.setTimeout(function(){
      this.executeOperations();
    }.bind(this), 200);
  },

  pushOperation: function() {
    var operations = this.state.operations;
    operations.push(this.newOperation());
    this.setState({operations: operations});
  },

  removeOperation: function(index) {
    if (!this.canRemoveOperation())
      return;
    var operations = this.state.operations;
    operations.splice(index, 1);
    this.setState({operations: operations}, this.executeOperations);
  },

  canRemoveOperation: function() {
    // must have at least two operations in memory at all times
    return (this.state.operations.length > 2);
  },

  executeOperations: function() {
    // send all operations except the last, which is a placeholder for the user
    // to click on to add a new operation
    var operationsUsed = this.state.operations.slice(0, this.state.operations.length-1);
    request
    .post(API_ROOT + 'execute/')
    .send({input: this.state.input, operations: operationsUsed})
    .end(function(err, res){
      this.clearOperationErrors();
      if (res.body.error) {
        var operations = this.state.operations;
        operations[res.body.error_pos].error = res.body.error_msg;
        this.setState({operations: operations});
      }
      else {
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
    console.log(this.state.operations);
    var operations = this.state.operations.map(function(operation, index){
      return (
        <Operation commands={this.state.commands}
                   operations={this.state.operations}
                   operation={operation}
                   pushOperation={this.pushOperation}
                   canRemoveOperation={this.canRemoveOperation}
                   removeOperation={this.removeOperation}
                   position={index}
                   onCommandChange={this.handleCommandChange}
                   onArgsChange={this.handleArgsChange}
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
