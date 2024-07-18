import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import { OptionsConsumer } from '../context'
import { SET_PANE_OPTIONS } from '../context/constants'
import { downloadFile } from '../utils'

import '../styles/Output.scss'


const diffWorker = new Worker(new URL('../context/worker.js', import.meta.url));

const Output = ({ dispatch, index, input, text, prevText, isError, isLast, operation, showDiff, options }) => {
  const { fontSize, fontStyle, darkMode } = options
  const iconVariant = darkMode ? 'dark' : 'light'

  const [copied, setCopied] = useState(false)
  // cached diff output
  const [diffOutput, setDiffOutput] = useState(null)

  useMemo(async () => {
    if (!showDiff) {
      return
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#dedicated_workers
    diffWorker.postMessage({ prevText, text })
    diffWorker.onmessage = (e) => {
      setDiffOutput(e.data)
    }
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
            onChange={() =>
              dispatch({
                type: SET_PANE_OPTIONS,
                // `index` here refers to this Output component's `index` prop
                // output pane indexes, on the other hand, are relatively
                // offset one ahead because of the input pane that precedes them
                index: index + 1,
                options: { showDiff: !showDiff }
              })
            }
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
  showDiff: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired,
}

Output.defaultProps = {
  text: '',
  prevText: '',
  // Show visual diff of changes if there is no input in session storage,
  // indicating that this is the first time the app has been opened this
  // session and the "instructional" input will be shown, which should be
  // shown with a diff
  showDiff: false
}

export default OptionsConsumer(Output)