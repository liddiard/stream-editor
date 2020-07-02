import React from 'react'

const CommandSelect = ({ commands }) => (
  <div className="command-select">
    <select>
      {commands.map(command => <option></option>)}
    </select>
  </div>
)