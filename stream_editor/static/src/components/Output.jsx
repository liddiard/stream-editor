var React = require('react');
var Diff = require('text-diff');


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
      function createMarkup() { return {__html: diff.prettyHtml(diffText)}; };
      text = <pre dangerouslySetInnerHTML={createMarkup()} />;
    }
    else {
      text = <pre>{this.props.text}</pre>;
    }
    return (
      <output>
        {text}
      </output>
    );
  }

});


module.exports = Output;
