var React = require('react');
var Diff = require('text-diff');
var ReactZeroClipboard = require('react-zeroclipboard');

var utils = require('../utils.js');


var Output = React.createClass({

  propTypes: {
    text: React.PropTypes.string.isRequired,
    prevText: React.PropTypes.string.isRequired,
    showDiff: React.PropTypes.bool.isRequired
  },

  render: function() {
    var text;
    if (this.props.showDiff) {
      var diff = new Diff();
      var diffText = diff.main(this.props.prevText, this.props.text);
      diff.cleanupSemantic(diffText);
      function createMarkup() { return {__html: diff.prettyHtml(diffText)}; };
      text = <pre dangerouslySetInnerHTML={createMarkup()} />;
    }
    else {
      text = <pre>{this.props.text}</pre>;
    }
    return (
      <div className="output-container">
        <div className="copy success-msg">
          ✓ Copied to clipboard
        </div>
        <ReactZeroClipboard text={this.props.text} onAfterCopy={utils.displayCopySuccess}>
          <div className="copy btn">
            <img src="/static/img/clipboard-icon.svg"/>
            Copy
          </div>
        </ReactZeroClipboard>
        <output>
          {text}
        </output>
      </div>
    );
  }

});


module.exports = Output;
