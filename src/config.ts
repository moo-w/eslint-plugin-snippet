import type { ESLintPluginSnippetOptions } from './types'
import { createPluginWithSnippets } from './plugin'
import { mergeOptionsWithDefaults } from './utils'

export default function config(options: ESLintPluginSnippetOptions = {}) {
  const { name, prefix, snippets } = mergeOptionsWithDefaults(options)

  return {
    name,
    plugins: {
      snippet: createPluginWithSnippets(prefix, snippets),
    },
    rules: {
      'snippet/snippet': 'error',
    },
  }
}
