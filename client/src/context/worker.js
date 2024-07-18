import Diff from 'text-diff'


onmessage = async (event) => {
  const { prevText, text } = event.data
  const diff = new Diff()
  const diffText = diff.main(prevText, text)
  diff.cleanupSemantic(diffText)
  const result = diff.prettyHtml(diffText)
  postMessage(result)
}
