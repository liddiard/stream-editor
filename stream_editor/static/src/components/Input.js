import React from 'react'
import PropTypes from 'prop-types'

import { optionsData } from '../context'
import { getMinWidth } from '../utils'


const Input = ({ text, onChange, maxLength, fontSize, fontStyle, panesInViewport }) => (
  <div
    className="input-container"
    style={{ minWidth: getMinWidth(panesInViewport) }}
  >
    <div className="io labels">
      <label>Input</label>
    </div>
    <textarea value={text}
              onChange={onChange}
              maxLength={maxLength}
              placeholder="Enter your text here."
              className={fontStyle}
              style={{ fontSize: `${fontSize}pt` }} />
  </div>
)

Input.propTypes = {
  text: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  maxLength: PropTypes.number.isRequired
}

Input.defaultProps = {
  maxLength: 1048576 // 2**20
}

export default optionsData(Input)
