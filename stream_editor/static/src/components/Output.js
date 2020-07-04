import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Diff from 'text-diff'

import { optionsData } from '../context'
import { getMinWidth } from '../utils'

import '../styles/Output.scss'


const Output = ({ showDiff, text, prevText, isLast, fontSize, fontStyle, panesInViewport }) => {
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

  return (
    <div
      className="output-container"
      style={{ minWidth: getMinWidth(panesInViewport) }}
    >
      <div className="io labels">
        <button 
          className={`copy ${copied ? 'copied' : ''}`}
          onClick={() => {
            setCopied(true)
            navigator.clipboard.writeText(text)
          }}
        >
          {copied ?
            <><img src="/img/icon-check.svg"/>Copied</> :
            <><img src="/img/icon-copy.svg"/>Copy</>
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