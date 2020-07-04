import React from 'react'
import PropTypes from 'prop-types'

import {
  SET_OPERATION_COMMAND,
  SET_OPERATION_ARGS,
  REMOVE_OPERATION
} from '../constants'
import { optionsData } from '../context'
import { getMinWidth } from '../utils'
import CommandSelect from './CommandSelect'

import '../styles/Operation.scss'


const Operation = ({ dispatch, index, commands, operations, operation, error, panesInViewport }) => {
  const removeButton = index !== operations.length && operations.length > 1 ? (
    <button
      className="remove-operation"
      data-tip="Remove command"
      onClick={() => dispatch({ type: REMOVE_OPERATION, index })}
    >
      ✕
    </button>
  ) : null

  const _error = error ? (
    <div className="error">
      {error}
    </div>
  ) : null

  return (
    <div
      className={`operation ${error ? 'error' : ''}`}
      style={{ minWidth: getMinWidth(panesInViewport) }}
    >
      {_error}
      <CommandSelect
        commands={commands}
        command={operation.command}
        index={index}
        onChange={ev => dispatch({ type: SET_OPERATION_COMMAND, index, command: ev.target.value })}
      />
      <div className="args">
        <input
          type="text"
          name="args"
          value={operation.args}
          placeholder="arguments"
          tabIndex={(index*2) + 3}
          onChange={ev => dispatch({ type: SET_OPERATION_ARGS, index, args: ev.target.value })}
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

export default optionsData(Operation)
