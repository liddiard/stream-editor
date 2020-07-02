import React from 'react'
import PropTypes from 'prop-types'


const Input = ({ text, onInputChange, maxLength }) => (
  <div className="input-container">
    <textarea value={text}
              onChange={onInputChange}
              maxLength={maxLength}
              placeholder="input text..." />
  </div>
)

Input.propTypes = {
  text: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  maxLength: PropTypes.number.isRequired
}

Input.defaultProps = {
  maxLength: 1048576 // 2**20
}

export default Input
