import type { Rule } from 'eslint'
import type { Comment } from 'estree'
import type { Snippet } from './types'
import { compiler } from './compiler/compiler'

export default function applySnippet(options: {
  ctx: Rule.RuleContext
  comment: Comment
  matchedSnippet: Snippet
  snippets: Snippet[]
  commandPrefix: string
  separator: string
  ignoreIndicator: string
}): void {
  const {
    ctx,
    comment,
    matchedSnippet,
    snippets,
    commandPrefix,
    separator,
    ignoreIndicator,
  } = options

  const commentValue = comment.value.trim()

  const snippet = compiler({
    comment: commentValue,
    snippets,
    tokenizerOptions: {
      commandPrefix,
      separator,
      ignoreIndicator,
    },
  })

  if (snippet === '') {
    return
  }

  // replace the comment with the snippet
  // replace space with '⋅'
  const reportSnippet = snippet.replace(/ /g, '⋅')
  ctx.report({
    loc: comment.loc!,
    messageId: 'snippet-fix',
    data: {
      name: matchedSnippet.name,
      separator: '-'.repeat(matchedSnippet.name.length + 15),
      snippet: reportSnippet,
    },
    fix(fixer) {
      return fixer.replaceText(comment, snippet)
    },
  })
}
