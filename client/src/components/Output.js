import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { OptionsConsumer } from '../context'
import { INSERT_OPERATION } from '../context/constants'
import { inputFromSessionStorage } from '../context/reducer'
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!../context/worker'
import { getMinWidth, downloadFile } from '../utils'

import '../styles/Output.scss'


const instance = worker()

const Output = ({ dispatch, index, input, text, prevText, isError, isLast, options }) => {
  const { fontSize, fontStyle, darkMode, panesInViewport } = options
  const iconVariant = darkMode ? 'dark' : 'light'
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
    setCopied(false)
  }, [text, setCopied])

  useEffect(() => {
    showDiff ?
      sessionStorage.setItem(showDiffStorageKey, true) :
      sessionStorage.removeItem(showDiffStorageKey)
  }, [showDiff, index])

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
    <div
      className={`output-container ${isError ? 'error' : ''}`}
      style={{ minWidth: getMinWidth(panesInViewport) }}
    >
      <div className="insert-operation">
        <button
          data-tip="Add a command"
          onClick={() => dispatch({ type: INSERT_OPERATION, index: index+1 })}
        >
          +
      </button>
      </div>
      <div className="io actions">
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
  options: PropTypes.object.isRequired
}

export default OptionsConsumer(Output)