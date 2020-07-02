import React, { useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  SET_OPTION,
  SET_INPUT,
  SET_OPERATIONS,
  DEFAULT_OPERATION
} from './constants'
import reducer, { initialState } from './reducer'
import {
  getCommands,
  setInput
} from './actions'

import {
  updateOperationsFromQuerystring,
  writeOperationsToQuerystring
} from './utils'
import Header from './components/Header'
import Input from './components/Input'
import Operation from './components/Operation'
import Output from './components/Output'

import './App.scss'


const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    commands,
    input,
    operations,
    outputs,
    apiInput,
    error,
    options
  } = state

  useEffect(() => {
    getCommands(dispatch)
    updateOperationsFromQuerystring(dispatch)
  }, [])

  useEffect(() => {
    writeOperationsToQuerystring(operations)
  }, [operations])

  const _outputs = outputs.map((output, index) => {
    const prevText = index === 0 ? apiInput : outputs[index-1]
    return (
      <Output text={outputs[index]} prevText={prevText}
              showDiff={options.showDiff} key={index} />
    )
  })

  return (
    <main>
      <div className="editor-options editor-options-options">
        <div className="option">
          <input
            type="checkbox"
            id="show-diff"
            checked={options.showDiff}
            onChange={(ev) =>
              dispatch({ type: SET_OPTION, key: 'showDiff', value: ev.target.checked })
            }
          />
          <label htmlFor="show-diff">Show diff</label>
        </div>
        <div className="option">
          <input
            type="checkbox"
            id="sync-scrolling"
            checked={options.syncScrolling}
            onChange={(ev) =>
              dispatch({ type: SET_OPTION, key: 'syncScrolling', value: ev.target.checked })
            }
          />
          <label htmlFor="sync-scrolling">Sync scrolling</label>
        </div>
      </div>
      <div className="io">
        <Input 
          text={input}
          onInputChange={(ev) =>
            setInput(dispatch, ev.target.value, operations)
          }
        />
        {_outputs}
      </div>
      <div className="operations">
        {operations.map((operation, index) =>
          <Operation
            key={index}
            dispatch={dispatch}
            index={index}
            commands={commands}
            operations={operations}
            operation={operation}
            error={error.index === index ? error.message : null}
          />
        )}
        <Operation
          dispatch={dispatch}
          index={operations.length}
          commands={commands}
          operations={operations}
          operation={{ ...DEFAULT_OPERATION }}
          error={null}
        />
      </div>
    </main>
  )
}

export default App



// export default class Editor extends React.Component {

//   static defaultProps = {
//     defaultOperation: {
//       // sed w/o arguments, returns the input unmodified
//       command: 'sed',
//       args: '',
//       error: ''
//     },
//     inputDelay: 250 // milliseconds between input ending and API call
//   }

//   constructor(props) {
//     super(props)
//     this.state = {
//       commands: [], // supported commands and associated descriptions/resources
//       input: '',    // user's text input
//       operations: [ // user's commands + arguments
//         this.newOperation(),
//         this.newOperation()
//       ],
//       outputs: [''], // list of output after each operation is performed
//       inputFromApi: '', // input from which the outputs were generated.
//                         // needed for diff b/c there's a delay between input
//                         // and receiving API resoponse.
//       showDiff: true,     // show visual diff of changes
//       syncScrolling: true, // scroll all input/output panes together
//       editorOptionsDropdownVisible: false // editor options currently visible
//                                           // on smaller screens
//     }
//   }

//   componentDidMount() {
//     request
//     .get(API_ROOT + 'commands/')
//     .end((err, res) => {
//       this.setState({ commands: res.body.commands }, this.updateOperationsFromUrl)
//     })
//   }

//   componentDidUpdate(prevProps, prevState) {
//     if (prevState.outputs !== this.state.outputs) {
//       utils.rebindSyncScrolling()
//     }
//   }

//   updateOperationsFromUrl = () => {
//     // update the operations in the Editor's state with the operations
//     // encoded in the document's URL with corresponding blank outputs
//     var operationsFromUrl = utils.decodeUrl(document.location.search)
//     if (operationsFromUrl.length) {
//       operationsFromUrl.push(this.newOperation()) // add the placeholder operation
//       var outputs = []
//       operationsFromUrl.forEach(function(operation, index){
//         if (index === 0) return
//         outputs.push('') // add corresponding empty outputs
//       })
//       this.setState(
//         {operations: operationsFromUrl, outputs: outputs},
//         this.executeOperations
//       )
//     }
//   }

//   newOperation = () => {
//     // makes a unique copy of the defaultOperation object (as opposed to
//     // pointing a reference to it)
//     return JSON.parse(JSON.stringify(this.props.defaultOperation))
//   }

//   handleInputChange = (event) => {
//     this.setState({ input: event.target.value }, this.handleKeypress)
//   }

//   handleCommandChange = (position, event) => {
//     const input = event.target
//     const { operations } = this.state
//     operations[position].command = input.value
//     utils.updateDocumentUrl(operations)
//     this.pushOperationIfLast(position)
//     this.setState({ operations }, this.executeOperations)
//   }

//   handleArgsChange = (position, event) => {
//     const input = event.target
//     const { operations } = this.state
//     operations[position].args = input.value
//     utils.updateDocumentUrl(operations)
//     this.setState({ operations: operations }, this.handleKeypress)
//   }

//   handleKeypress = () => {
//     // adds a delay between consecutive keypresses and API call to minimize API load
//     if (this.timeoutId)
//       window.clearTimeout(this.timeoutId)
//     this.timeoutId = window.setTimeout(() => {
//       this.executeOperations()
//     }, this.props.inputDelay)
//   }

//   handleShowDiffChange = () => {
//     // toggles showing visual diff
//     this.setState({ showDiff: !this.state.showDiff })
//   }

//   handleSyncScrollingChange = () => {
//     // toggles synced scroll
//     utils.toggleSyncScrolling(this.state.syncScrolling)
//     this.setState({ syncScrolling: !this.state.syncScrolling })
//   }

//   handleEditorOptionsDropdownVisibleChange = () => {
//     this.setState({ editorOptionsDropdownVisible: !this.state.editorOptionsDropdownVisible })
//   }

//   pushOperation = () => {
//     // add a new default operation to the end of this state's operations array
//     // and a new empty output to the end of this state's output array
//     const { operations } = this.state
//     operations.push(this.newOperation())
//     utils.updateDocumentUrl(operations)
//     const outputs = this.state.outputs
//     outputs.push('')
//     this.setState(
//       { operations, outputs },
//       this.executeOperations
//     )
//   }

//   pushOperationIfLast = (position) => {
//     if (position === this.state.operations.length - 1) {
//       this.pushOperation()
//     }
//   }

//   removeOperation = (index) => {
//     if (!this.canRemoveOperation()) {
//       return
//     }
//     const { operations } = this.state
//     operations.splice(index, 1)
//     utils.updateDocumentUrl(operations)
//     this.setState({operations: operations}, this.executeOperations)
//   }

//   canRemoveOperation = () => (
//     // must have at least two operations in memory at all times
//     // the first operation is the one being applied to the input (this would
//     // be a pointless tool without any operations), and the second is a
//     // placeholder. If the user interacts with it, we make it into a "real"
//     // operation and append another placeholder.
//     this.state.operations.length > 2
//   )

//   executeOperations = () => {
//     // send all operations except the last, which is a placeholder for the user
//     // to click on to add a new operation
//     const operationsUsed = this.state.operations.slice(0, this.state.operations.length-1)
//     request
//     .post(API_ROOT + 'execute/')
//     .send({ input: this.state.input, operations: operationsUsed })
//     .end((err, res) => {
//       this.clearOperationErrors() // clear out any existing error messages
//       if (res.body.error) {
//         var operations = this.state.operations
//         operations[res.body.error_pos].error = res.body.error_msg
//         this.setState({operations: operations})
//       }
//       else {
//         this.setState({inputFromApi: res.body.input})
//         this.setState({outputs: res.body.outputs})
//       }
//     })
//   }

//   // TODO
//   clearOperationErrors = () => {
//     this.state.operations.forEach((operation) => {
//       operation.error = ""
//     })
//   }

//   handleFeedbackClick = (event) => {
//     event.preventDefault()
//     const proceed = window.confirm(
//       'Stream Editor uses GitHub issues to track bug reports and feature ' +
//       'requests. Your feedback is greatly appreciated.\n\n' +
//       'Open GitHub issues for this project?'
//     )
//     if (proceed) {
//       window.open(event.target.href, '_blank')
//     }
//   }

//   render() {
//     const operations = this.state.operations.map((operation, index) => (
//       <Operation commands={this.state.commands}
//                   operations={this.state.operations}
//                   operation={operation}
//                   pushOperationIfLast={this.pushOperationIfLast}
//                   canRemoveOperation={this.canRemoveOperation}
//                   removeOperation={this.removeOperation}
//                   position={index}
//                   onCommandChange={this.handleCommandChange}
//                   onArgsChange={this.handleArgsChange}
//                   key={index} />
//     ))

//     const outputs = this.state.outputs.map((output, index) => {
//       const prevText = index === 0 ? this.state.inputFromApi : this.state.outputs[index-1]
//       return (
//         <Output text={this.state.outputs[index]} prevText={prevText}
//                 showDiff={this.state.showDiff} key={index} />
//       )
//     })

//     const commandsInfo = this.state.commands.map((command, index) => (
//       <div className="command" key={index}>
//         <span className="name">{command.name} </span>
//         <span className="description">{command.description}</span>
//         <a target="_blank" href={command.docs}>docs</a>
//         <a target="_blank" href={command.examples}>examples</a>
//       </div>
//     ))

//     let editorOptionsClassName = "editor-options editor-options-options"
//     if (!this.state.editorOptionsDropdownVisible) {
//       editorOptionsClassName += " hidden-mobile"
//     }

//     return (
//       <main>
//         <div className={editorOptionsClassName}>
//           <div className="command-reference">
//             <div className="dropdown">
//               Command reference ▾
//             </div>
//             <div className="contents">
//               {commandsInfo}
//             </div>
//           </div>
//           <div className="option">
//             <input type="checkbox" id="show-diff" checked={this.state.showDiff}
//                    onChange={this.handleShowDiffChange} />
//             <label htmlFor="show-diff">Show diff</label>
//           </div>
//           <div className="option">
//             <input type="checkbox" id="sync-scrolling" checked={this.state.syncScrolling}
//                    onChange={this.handleSyncScrollingChange} />
//             <label htmlFor="sync-scrolling">Sync scrolling</label>
//           </div>
//           <a href="https://github.com/liddiard/stream-editor/issues/"
//              onClick={this.handleFeedbackClick}>
//             Give feedback
//           </a>
//         </div>
//         <div className="editor-options open-btn"
//              onClick={this.handleEditorOptionsDropdownVisibleChange}>
//           <span className="label">Settings</span>
//           <span className="gear">⚙</span>
//         </div>
//         <div className="io">
//           <Input text={this.state.input} onInputChange={this.handleInputChange} />
//           {outputs}
//         </div>
//         <div className="operations">
//           {operations}
//         </div>
//       </main>
//     )
//   }
// }