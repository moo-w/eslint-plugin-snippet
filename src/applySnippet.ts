import type { Rule } from 'eslint'
import type { Comment } from 'estree'
import type { Snippet } from './types'

export default function applySnippet(ctx: Rule.RuleContext, comment: Comment, snippetConfig: Snippet, separator: string, ignoreIndicator: string): void {
  const {
    name,
    snippet,
  } = snippetConfig

  const commentValue = comment.value.trim()
  const params = commentValue.split(separator).slice(1).map(param => param === ignoreIndicator ? '' : param)
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
  // replace space with '⋅'
  const reportSnippet = newSnippet.replace(/ /g, '⋅')
  ctx.report({
    loc: comment.loc!,
    message: `[eslint-plugin-snippet]
Apply snippet "${name}"
>>>
${reportSnippet}
<<<`,
    fix(fixer) {
      return fixer.replaceText(comment, newSnippet)
    },
  })
}
