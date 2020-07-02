import React from 'react'
import PropTypes from 'prop-types'
import Diff from 'text-diff'


const Output = ({ showDiff, text, prevText }) => {
  let output
  if (showDiff) {
    var diff = new Diff()
    var diffText = diff.main(prevText, text)
    diff.cleanupSemantic(diffText)
    function createMarkup() { return {__html: diff.prettyHtml(diffText)} }
    output = <pre dangerouslySetInnerHTML={createMarkup()} />
  }
  else {
    output = <pre>{text}</pre>
  }
  return (
    <div className="output-container">
      <div className="copy success-msg">
        ✓ Copied to clipboard
      </div>
        <div 
          className="copy btn"
          onClick={() => navigator.clipboard.writeText(text)}
        >
          <img src="/static/img/clipboard-icon.svg"/>
          Copy
        </div>
      <output>
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

export default Output
