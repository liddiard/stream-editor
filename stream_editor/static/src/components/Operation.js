import React from 'react'
import PropTypes from 'prop-types'

import {
  SET_OPERATION_COMMAND,
  SET_OPERATION_ARGS,
  REMOVE_OPERATION
} from '../constants'
import {} from '../actions'
import utils from '../utils'


const Operation = ({ dispatch, index, commands, operations, operation, error }) => {
  // construct an array of command options to go in the command <select>
  const options = commands.map(command =>
    <option key={command.name} value={command.name}>
      {command.name}
    </option>
  )

  // add an operation remove button if operations can be removed in the
  // current state and this operation is not the last, placeholder operation
  const removeButton = (operations.length > 1 && index !== operations.length - 1) ? (
    <button className="remove-operation"
            onClick={() => dispatch({ type: REMOVE_OPERATION, index })}>
      ✕
    </button>
  ) : null

  const _error = error ? (
    <div className="error">
      {error}
    </div>
  ) : null

  return (
    <div className="operation">
      {_error}
      <select
        name="command"
        value={operation.command}
        onChange={ev => dispatch({ type: SET_OPERATION_COMMAND, index, command: ev.target.value })}
      >
        {options}
      </select>
      <div className="dropdown-arrow">▾</div>
      <div className="args">
        <input
          type="text"
          name="args"
          value={operation.args}
          placeholder="arguments"
          onChange={ev => dispatch({ type: SET_OPERATION_ARGS, index, args: ev.target.value })}
          onFocus={() => { /* props.pushOperationIfLast.bind(null, index) */}}
        />
      </div>
      {removeButton}
    </div>
  )
}

Operation.propTypes = {
  commands: PropTypes.array.isRequired,
  operations: PropTypes.array.isRequired,
  operation: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
}

export default Operation
