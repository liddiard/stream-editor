import React, { useRef, useCallback } from 'react'
import PropTypes from 'prop-types'

import { OptionsConsumer } from '../context'
import { MAX_INPUT_LENGTH, SET_INPUT } from '../context/constants'
import { uploadFile } from '../context/actions'

import '../styles/Input.scss'


const Input = ({ dispatch, text, maxLength, error, operation, options }) => {
  const { darkMode, fontStyle, fontSize } = options
  const iconVariant = darkMode ? 'dark' : 'light'

  const fileInput = useRef()

  const handleFileUploadChange = useCallback(async (ev) => {
    const file = ev.target.files[0]
    if (!file) {
      return // user cancelled file upload dialog
    }
    if (text) { // if existing input, confirm before replacing
      const yes = window.confirm(`Replace current input with the contents of “${file.name}”?`)
      if (!yes) {
        // reset the file input so if the user tries to upload the same file
        // again, this onChange handler will still run again
        fileInput.current.value = null
        return
      }
    }
    uploadFile(dispatch, file)
  }, [dispatch, text])

  return (
    <div className="input-container">
      <div className="actions">
        {error.message ? (
          <span className="upload error">
            {error.message}
          </span>
        ) : null}
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
      {operation}
    </div>
  )
}

Input.propTypes = {
  dispatch: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
  error: PropTypes.object.isRequired,
  operation: PropTypes.element.isRequired,
  options: PropTypes.object.isRequired
}

Input.defaultProps = {
  maxLength: MAX_INPUT_LENGTH
}

export default OptionsConsumer(Input)
