import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { OptionsConsumer } from '../context'
import { MAX_INPUT_LENGTH, SET_INPUT } from '../context/constants'
import { uploadFile } from '../context/actions'
import { getMinWidth } from '../utils'

import '../styles/Input.scss'


const Input = ({ dispatch, text, onChange, maxLength, error, options }) => {
  const { darkMode, panesInViewport, fontStyle, fontSize } = options
  const iconVariant = darkMode ? 'dark' : 'light'

  const fileInput = useRef()

  const handleFileUploadChange = async (ev) => {
    const file = ev.target.files[0]
    if (!file) {
      return // user cancelled file upload dialog
    }
    if (text) { // if existing input, confirm before replacing
      const yes = window.confirm(`Replace current input with the contents of “${file.name}”?`)
      if (!yes) {
        return
      }
    }
    uploadFile(dispatch, file)
  }

  return (<div
    className="input-container"
    style={{ minWidth: getMinWidth(panesInViewport) }}
  >
    <div className="io actions">
      <span className="upload error">
        {error.message}
      </span>
      <button onClick={() => fileInput.current.click()}>
        <img src={`/img/upload-${iconVariant}.svg`} alt="" />
        Upload File
      </button>
      <input
        type="file"
        ref={fileInput}
        onChange={handleFileUploadChange}
      />
      <label className="input">Input</label>
    </div>
    <textarea
      name="input"
      value={text}
      onChange={(ev) =>
        dispatch({ type: SET_INPUT, input: ev.target.value })}
      maxLength={maxLength}
      placeholder="Enter input text"
      className={fontStyle}
      style={{ fontSize: `${fontSize}pt` }}
      autoFocus
      tabIndex={1}
      spellCheck={false}
    />
  </div>)
}

Input.propTypes = {
  dispatch: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
  error: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired
}

Input.defaultProps = {
  maxLength: MAX_INPUT_LENGTH
}

export default OptionsConsumer(Input)
