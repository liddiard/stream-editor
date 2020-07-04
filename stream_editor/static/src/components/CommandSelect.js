import React, { useState } from 'react'

import '../styles/CommandSelect.scss'


const CommandSelect = ({ commands, command, index, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const _onChange = (ev) => {
    onChange(ev)
    console.log(ev.target)
    setTimeout(() => setIsOpen(false), 250)
  }

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
      </button      >
        {isOpen ? 
        <dl onClick={(ev) => ev.stopPropagation()} role="dialog">
          {commands.map((_command, index) => 
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
                  href={_command.docs}
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

export default CommandSelect