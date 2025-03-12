import type { Rule } from 'eslint'
import type { Comment } from 'estree'
import type { Snippet } from './types'

export default function applySnippet(ctx: Rule.RuleContext, comment: Comment, snippetConfig: Snippet, separator: string, ignoreIndicator: string): void {
  const {
    name,
    snippet,
  } = snippetConfig

  const commentText = comment.value.trim()
  const params = commentText.split(separator).slice(1).map(param => param === ignoreIndicator ? '' : param)
  const slotRegex = /\$\d+/g
  const slotCount = (snippet.match(slotRegex) || []).length
  const paramCount = params.length

  if (slotCount > paramCount) {
    const missingCount = slotCount - paramCount
    for (let i = 0; i < missingCount; i++) {
      params.push('')
    }
  }
  let newSnippet = snippet
  params.forEach((param, i) => {
    newSnippet = newSnippet.replace(new RegExp(`\\$${i}`, 'g'), param)
  })

  // replace the comment with the snippet
  ctx.report({
    loc: comment.loc!,
    message: `Apply snippet "${name}"`,
    fix(fixer) {
      return fixer.replaceText(comment, newSnippet)
    },
  })
}
