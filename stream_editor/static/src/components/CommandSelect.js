import React, { useState } from 'react'

import '../styles/CommandSelect.scss'


const CommandSelect = ({ commands, command, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const _onChange = (ev) => {
    onChange(ev)
    setTimeout(() => setIsOpen(false), 250)
  }

  return (
    <div className="command-select" onClick={() => setIsOpen(!isOpen)}>
      {isOpen ?
        <div className="backdrop" onClick={() => setIsOpen(false)} /> :
        null
      }
      <div className="selected">
        {command}
        <span className={`arrow ${isOpen ? 'open' : 'closed'}`}>▾</span>
      </div>
        {isOpen ? 
        <dl onClick={(ev) => ev.stopPropagation()}>
          {commands.map(_command => 
            <label key={_command.name}>
              <input
                type="radio"
                name="command"
                value={_command.name}
                checked={command === _command.name}
                onChange={_onChange} 
              />
              <dt>{_command.name}</dt>
              <dd>
                <span className="description">{_command.description} </span>
                <a href={_command.docs} target="_blank">docs</a><span className="separator">/</span>
                <a href={_command.examples} target="_blank">examples</a>
              </dd>
            </label>
          )}
        </dl> :
      null }
    </div>
  )
}

export default CommandSelect