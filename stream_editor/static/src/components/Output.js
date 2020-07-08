import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { OptionsConsumer } from '../context'
import { INSERT_OPERATION } from '../context/constants'
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!../context/worker'
import { getMinWidth, downloadFile } from '../utils'

import '../styles/Output.scss'


const instance = worker()

const Output = ({ dispatch, index, text, prevText, isError, isLast, options }) => {
  const { showDiff, fontSize, fontStyle, darkMode, panesInViewport } = options
  const iconVariant = darkMode ? 'dark' : 'light'

  const [copied, setCopied] = useState(false)
  const [diffOutput, setDiffOutput] = useState(null)

  useEffect(() => {
    setCopied(false)
  }, [text, setCopied])

  useMemo(async () => {
    if (!showDiff) {
      return
    }
    const html = await instance.generateDiff(prevText, text)
    setDiffOutput(html)
  }, [prevText, text, showDiff]);

  let output
  if (showDiff) {
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
      <div className="io labels">
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
            <label>Output</label>
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
  text: PropTypes.string.isRequired,
  prevText: PropTypes.string.isRequired,
  isError: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired
}

export default OptionsConsumer(Output)