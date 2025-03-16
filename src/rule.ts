import type { Rule } from 'eslint'
import type { ESLintPluginSnippetOptions } from './types'
import applySnippet from './applySnippet'

export function createRule(options: Required<ESLintPluginSnippetOptions>): Rule.RuleModule {
  const { commandPrefix, separator, ignoreIndicator, snippets } = options

  return {
    meta: {
      type: 'problem',
      docs: {
        description: 'Comment-as-snippet for one-off codemod with ESLint',
      },
      messages: {
        'snippet-fix': `snippet [{{name}}] fix:
{{separator}}
{{snippet}}`,
      },
      fixable: 'code',
      schema: [],
    },
    create(ctx) {
      const sc = ctx.sourceCode
      const comments = sc.getAllComments()

      for (const comment of comments) {
        const isLineComment = comment.type === 'Line'
        if (isLineComment) {
          for (const snippet of snippets) {
            const commandRegex = new RegExp(`^${commandPrefix}${snippet.command}(?:${separator}|\\b)`)

            const shouldApplySnippet = commandRegex.test(comment.value)
            // eslint-disable-next-line no-console
            console.log(`shouldApplySnippet ${snippet.command}`, shouldApplySnippet, comment.value, commandRegex)
            if (shouldApplySnippet) {
              applySnippet({
                ctx,
                comment,
                matchedSnippet: snippet,
                snippets,
                commandPrefix,
                separator,
                ignoreIndicator,
              })
            }
          }
        }
      }

      return {}
    },
  }
}
