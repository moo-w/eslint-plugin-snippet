import type { Rule } from 'eslint'
import type { ESLintPluginSnippetOptions } from './types'
import applySnippet from './applySnippet'

export function createRule(options: Required<ESLintPluginSnippetOptions>): Rule.RuleModule {
  const { snippets } = options

  return {
    meta: {
      type: 'problem',
      docs: {
        description: 'Comment-as-snippet for one-off codemod with ESLint',
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
            const prefix = snippet.prefix || options.prefix
            const separator = snippet.separator || options.separator
            const ignoreIndicator = snippet.ignoreIndicator || options.ignoreIndicator

            const commandRegex = new RegExp(`^${prefix}${snippet.command}`)

            const shouldApplySnippet = commandRegex.test(comment.value)
            if (shouldApplySnippet)
              applySnippet(ctx, comment, snippet, separator, ignoreIndicator)
          }
        }
      }

      return {}
    },
  }
}
