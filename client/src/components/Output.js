import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { OptionsConsumer } from '../context'
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!../context/worker'
import { downloadFile } from '../utils'

import '../styles/Output.scss'


const instance = worker()

const Output = ({ index, input, text, prevText, isError, isLast, operation, options }) => {
  const { fontSize, fontStyle, darkMode } = options
  const iconVariant = darkMode ? 'dark' : 'light'
  const inputFromSessionStorage = sessionStorage.getItem('input')
  // sessionStorage key to store the `showDiff` preference for this output
  const showDiffStorageKey = `output.showDiff.${index}`

  const [copied, setCopied] = useState(false)
  // Show visual diff of changes if:
  // There is no input in session storage, indicating that this is the first
  // time the app has been opened this session and the "instructional" input
  // will be shown, which should be shown with a diff; OR the session storage
  // key from a previous load of this page is set to show diff.
  const [showDiff, setShowDiff] = useState(
    inputFromSessionStorage === null || 
    !!sessionStorage.getItem(showDiffStorageKey)
  )
  // cached diff output
  const [diffOutput, setDiffOutput] = useState(null)

  useEffect(() => {
    showDiff ?
      sessionStorage.setItem(showDiffStorageKey, true) :
      sessionStorage.removeItem(showDiffStorageKey)
  }, [showDiff, index, showDiffStorageKey])

  useMemo(async () => {
    if (!showDiff) {
      return
    }
    const html = await instance.generateDiff(prevText, text)
    setDiffOutput(html)
  }, [prevText, text, showDiff]);

  let output
  if (!input && !text && isLast) {
    output = <pre className={`${fontStyle} placeholder`}>
      Output will appear here
    </pre>
  }
  else if (showDiff) {
    const createMarkup = () => ({ __html: diffOutput })
    output = <pre
      className={fontStyle}
      dangerouslySetInnerHTML={createMarkup()}
    />
  }
  else {
    output = <pre className={fontStyle}>{text}</pre>
  }

  return (
    <div className={`output-container ${isError ? 'error' : ''}`}>
      <div className="actions">
        <label className="sans show-diff">
          <input
            type="checkbox"
            checked={showDiff}
            onChange={() => setShowDiff(!showDiff)}
          />
          Show diff
        </label>
        <button 
          className={`copy ${copied ? 'copied' : ''}`}
          onClick={() => {
            setCopied(true)
            navigator.clipboard.writeText(text)
          }}
          onBlur={() => setCopied(false)}
        >
          {copied ?
            <><img src={`/img/check-${iconVariant}.svg`} alt="" />Copied to Clipboard</> :
            <><img src={`/img/copy-${iconVariant}.svg`} alt="" />Copy to Clipboard</>
          }
        </button>
        {isLast ?
          <>
            <button onClick={() => downloadFile('output.txt', text)}>
              <img src={`/img/download-${iconVariant}.svg`} alt="" />
              Download
            </button>
            <label className="output">Output</label>
          </>
          : null}
      </div>
      <output style={{ fontSize: `${fontSize}pt` }}>
        {output}
      </output>
      {operation}
    </div>
  )
}

Output.propTypes = {
  dispatch: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  input: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  prevText: PropTypes.string.isRequired,
  isError: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  operation: PropTypes.element,
  options: PropTypes.object.isRequired,
}

export default OptionsConsumer(Output)