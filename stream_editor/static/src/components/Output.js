import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Diff from 'text-diff'

import { INSERT_OPERATION } from '../constants'
import { optionsData } from '../context'
import { getMinWidth } from '../utils'

import '../styles/Output.scss'


const Output = ({ dispatch, index, showDiff, text, prevText, isError, isLast, fontSize, fontStyle, darkMode, panesInViewport }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCopied(false)
  }, [text, setCopied])

  let output
  if (showDiff) {
    const diff = new Diff()
    const diffText = diff.main(prevText, text)
    diff.cleanupSemantic(diffText)
    const createMarkup = () => ({ __html: diff.prettyHtml(diffText) })
    output = <pre
      className={fontStyle}
      dangerouslySetInnerHTML={createMarkup()}
    />
  }
  else {
    output = <pre className={fontStyle}>{text}</pre>
  }

  const iconVariant = darkMode ? 'dark' : 'light'

  return (
    <div
      className={`output-container ${isError ? 'error' : ''}`}
      style={{ minWidth: getMinWidth(panesInViewport) }}
    >
      <div className="insert-operation">
        <button
          data-tip="Insert a command"
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
            <><img src={`/img/check-${iconVariant}.svg`} alt="" />Copied</> :
            <><img src={`/img/copy-${iconVariant}.svg`} alt="" />Copy</>
          }
        </button>
        {isLast ? <label>Output</label> : null}
      </div>
      <output style={{ fontSize: `${fontSize}pt` }}>
        {output}
      </output>
    </div>
  )
}

Output.propTypes = {
  text: PropTypes.string.isRequired,
  prevText: PropTypes.string.isRequired,
  showDiff: PropTypes.bool.isRequired
}

export default optionsData(Output)