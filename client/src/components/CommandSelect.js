import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import { OptionsConsumer } from '../context'

import '../styles/CommandSelect.scss'


const CommandSelect = ({ commands, command, index, onChange, options }) => {
  const { darkMode } = options

  const [isOpen, setIsOpen] = useState(false)

  const _onChange = useCallback((ev) => {
    onChange(ev)
    setTimeout(() => setIsOpen(false), 250)
  }, [onChange])

  return (
    <div className="command-select" onClick={() => setIsOpen(!isOpen)}>
      {isOpen ?
        <div className="backdrop" onClick={() => setIsOpen(false)} /> :
        null
      }
      <button
        className="selected"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={(index*2) + 2}>
        {command}
        <span className={`arrow ${isOpen ? 'open' : 'closed'}`}>▾</span>
      </button>
      {isOpen ? 
        <dl onClick={(ev) => ev.stopPropagation()} role="dialog">
          {commands.map((_command) =>
            <label key={_command.name}>
              <input
                type="radio"
                name="command"
                value={_command.name}
                checked={command === _command.name}
                autoFocus={command === _command.name}
                onChange={_onChange}
              />
              <dt>{_command.name}</dt>
              <dd>
                <span className="description">{_command.description} </span>
                <a
                  href={`/manpages/${_command.name}.html?theme=${darkMode ? 'dark' : 'light'}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  docs
                </a>
                <span className="separator">/</span>
                <a
                  href={_command.examples}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  examples
                </a>
              </dd>
            </label>
          )}
        </dl> :
      null }
    </div>
  )
}

CommandSelect.propTypes = {
  commands: PropTypes.array.isRequired,
  command: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired
}

export default OptionsConsumer(CommandSelect)