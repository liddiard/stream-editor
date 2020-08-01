import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import {
  SET_OPERATION_COMMAND,
  SET_OPERATION_ARGS,
  REMOVE_OPERATION
} from '../context/constants'
import { OptionsConsumer } from '../context'
import CommandSelect from './CommandSelect'

import '../styles/Operation.scss'
import ReactTooltip from 'react-tooltip'


const Operation = ({ dispatch, index, commands, operations, operation, error }) => {
  // if the pasted args start with a supported command, update the operation's
  // command accordingly and remove it from the args
  // e.g. if your current command is `cat` and you paste "sed s/a/b/", update
  // this operation's command dropdown to `sed` with the args to "s/a/b/"
  // instead of leaving the command as `cat` with args "sed s/a/b/"
  const handlePaste = useCallback((ev) => {
    // get pasted text; supported in all major browsers
    const value = ev.clipboardData.getData('Text')
    const command = commands
      .map(({ name }) => name)
      .find(cmd => value.startsWith(`${cmd} `))
    if (command) {
      dispatch({ type: SET_OPERATION_COMMAND, index, command })
      dispatch({
        type: SET_OPERATION_ARGS,
        index,
        // remove matched command from the args set
        args: value.replace(new RegExp(`^${command} `), '')
      })
      // prevent the `onChange` function from being called after this as we've
      // already set the appropriate `args` value in state
      ev.preventDefault()
    }
  }, [dispatch, index, commands])

  const removeButton = index !== operations.length && operations.length > 1 ? (
    <button
      className="remove-operation"
      data-tip="Remove command"
      onClick={() => {
        dispatch({ type: REMOVE_OPERATION, index })
        // hide the "Remove command" tooltip
        ReactTooltip.hide()
      }}
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
    <div className={`operation ${error ? 'error' : ''}`}>
      {_error}
      <CommandSelect
        commands={commands}
        command={operation.command}
        index={index}
        onChange={(ev) =>
          dispatch({ type: SET_OPERATION_COMMAND, index, command: ev.target.value })}
      />
      <input
        type="text"
        name="args"
        value={operation.args}
        placeholder="arguments"
        tabIndex={(index*2) + 3}
        onChange={(ev) =>
          dispatch({ type: SET_OPERATION_ARGS, index, args: ev.target.value })
        }
        onPaste={handlePaste}
        aria-label="command arguments"
      />
      {removeButton}
    </div>
  )
}

Operation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  commands: PropTypes.array.isRequired,
  operations: PropTypes.array.isRequired,
  operation: PropTypes.object.isRequired,
  error: PropTypes.string,
  options: PropTypes.object.isRequired
}

export default OptionsConsumer(Operation)
