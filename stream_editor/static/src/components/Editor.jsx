var request = require('superagent');
var React = require('react');

var utils = require('../utils.js');
var Input = require('./Input.jsx');
var Operation = require('./Operation.jsx');
var Output = require('./Output.jsx');


var API_ROOT = '/api/';


var Editor = React.createClass({

  getDefaultProps: function() {
    return {
      defaultOperation: {
        // sed w/o arguments, returns the input unmodified
        cmd: 'sed',
        args: '',
        error: ''
      },
      inputDelay: 250 // milliseconds between input ending and API call
    };
  },

  getInitialState: function() {
    return {
      cmds: [], // supported cmds and associated descriptions/resources
      input: '',    // user's text input
      operations: [ // user's cmds + arguments
        this.newOperation(),
        this.newOperation()
      ],
      outputs: [''], // list of output after each operation is performed
      inputFromApi: '', // input from which the outputs were generated.
                        // needed for diff b/c there's a delay between input
                        // and receiving API resoponse.
      showDiff: true,     // show visual diff of changes
      syncScrolling: true, // scroll all input/output panes together
      editorOptionsDropdownVisible: false // editor options currently visible
                                          // on smaller screens
    }
  },

  componentDidMount: function() {
    request
    .get(API_ROOT + 'commands/')
    .end(function(err, res){
      this.setState({cmds: res.body.commands}, this.updateOperationsFromUrl);
    }.bind(this));
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevState.outputs !== this.state.outputs)
      utils.rebindSyncScrolling();
  },

  updateOperationsFromUrl: function() {
    var operationsFromUrl = utils.decodeUrl(document.location.search);
    if (operationsFromUrl.length) {
      operationsFromUrl.push(this.newOperation());
      this.setState({operations: operationsFromUrl}, this.executeOperations);
    }
  },

  newOperation: function() {
    // makes a unique copy of the defaultOperation object (as opposed to
    // pointing a reference to it)
    return JSON.parse(JSON.stringify(this.props.defaultOperation));
  },

  handleInputChange: function(event) {
    this.setState({input: event.target.value}, this.handleKeypress);
  },

  handleCmdChange: function(position, event) {
    var input = event.target;
    var operations = this.state.operations;
    operations[position].cmd = input.value;
    utils.updateDocumentUrl(operations);
    this.pushOperationIfLast(position);
    this.setState({operations: operations}, this.executeOperations);
  },

  handleArgsChange: function(position, event) {
    var input = event.target;
    var operations = this.state.operations;
    operations[position].args = input.value;
    utils.updateDocumentUrl(operations);
    this.setState({operations: operations}, this.handleKeypress);
  },

  handleKeypress: function() {
    // adds a delay between consecutive keypresses and API call to minimize API load
    if (this.timeoutId)
      window.clearTimeout(this.timeoutId);
    this.timeoutId = window.setTimeout(function(){
      this.executeOperations();
    }.bind(this), this.props.inputDelay);
  },

  handleShowDiffChange: function() {
    // toggles showing visual diff
    this.setState({showDiff: !this.state.showDiff});
  },

  handleSyncScrollingChange: function() {
    // toggles synced scroll
    utils.toggleSyncScrolling(this.state.syncScrolling);
    this.setState({syncScrolling: !this.state.syncScrolling});
  },

  handleEditorOptionsDropdownVisibleChange: function() {
    this.setState({editorOptionsDropdownVisible: !this.state.editorOptionsDropdownVisible});
  },

  pushOperation: function() {
    // add a new default operation to the end of this state's operations array
    var operations = this.state.operations;
    operations.push(this.newOperation());
    utils.updateDocumentUrl(operations);
    this.setState({operations: operations}, this.executeOperations);
  },

  pushOperationIfLast: function(position) {
    if (position === this.state.operations.length - 1)
      this.pushOperation();
  },

  removeOperation: function(index) {
    if (!this.canRemoveOperation())
      return;
    var operations = this.state.operations;
    operations.splice(index, 1);
    utils.updateDocumentUrl(operations);
    this.setState({operations: operations}, this.executeOperations);
  },

  canRemoveOperation: function() {
    // must have at least two operations in memory at all times
    // the first operation is the one being applied to the input (this would
    // be a pointless tool without any operations), and the second is a
    // placeholder. If the user interacts with it, we make it into a "real"
    // operation and append another placeholder.
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
      this.clearOperationErrors(); // clear out any existing error messages
      if (res.body.error) {
        var operations = this.state.operations;
        operations[res.body.error_pos].error = res.body.error_msg;
        this.setState({operations: operations});
      }
      else {
        this.setState({inputFromApi: res.body.input});
        this.setState({outputs: res.body.outputs});
      }
    }.bind(this));
  },

  clearOperationErrors: function() {
    this.state.operations.forEach(function(operation){
      operation.error = "";
    });
  },

  handleFeedbackClick: function(event) {
    event.preventDefault();
    var proceed = confirm(
      'Stream Edior is using GitHub issues to track all bug reports and ' +
      'feature requests. Your feedback is appreciated!\n\n' +
      'Proceed to GitHub issues for this project?'
    );
    if (proceed) window.location = event.target.href;
  },

  render: function() {
    var operations = this.state.operations.map(function(operation, index){
      return (
        <Operation cmds={this.state.cmds}
                   operations={this.state.operations}
                   operation={operation}
                   pushOperationIfLast={this.pushOperationIfLast}
                   canRemoveOperation={this.canRemoveOperation}
                   removeOperation={this.removeOperation}
                   position={index}
                   onCmdChange={this.handleCmdChange}
                   onArgsChange={this.handleArgsChange}
                   key={index} />
      );
    }.bind(this));
    var outputs = this.state.outputs.map(function(output, index){
      var prevText = index === 0 ? this.state.inputFromApi : this.state.outputs[index-1];
      return (
        <Output text={this.state.outputs[index]} prevText={prevText}
                showDiff={this.state.showDiff} key={index} />
      );
    }.bind(this));
    var editorOptionsClassName = "editor-options editor-options-options";
    if (!this.state.editorOptionsDropdownVisible)
      editorOptionsClassName += " hidden-mobile"
    return (
      <main>
        <div className={editorOptionsClassName}>
          <input type="checkbox" id="show-diff" checked={this.state.showDiff}
                 onChange={this.handleShowDiffChange} />
          <label htmlFor="show-diff">Show diff</label>
          <input type="checkbox" id="sync-scrolling" checked={this.state.syncScrolling}
                 onChange={this.handleSyncScrollingChange} />
          <label htmlFor="sync-scrolling">Sync scrolling</label>
          <a href="https://github.com/liddiard/stream-editor/issues/"
             onClick={this.handleFeedbackClick}>
            Give feedback
          </a>
        </div>
        <div className="editor-options editor-options-gear"
             onClick={this.handleEditorOptionsDropdownVisibleChange}>
          ⚙
        </div>
        <div className="io">
          <Input text={this.state.input} onInputChange={this.handleInputChange} />
          {outputs}
        </div>
        <div className="operations">
          {operations}
        </div>
      </main>
    );
  }

});


module.exports = Editor;
