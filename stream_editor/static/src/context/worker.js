import Diff from 'text-diff'


export const generateDiff = (prevText, text) => {
  const diff = new Diff()
  const diffText = diff.main(prevText, text)
  diff.cleanupSemantic(diffText)
  return diff.prettyHtml(diffText)
}