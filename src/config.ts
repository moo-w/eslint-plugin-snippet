import type { ESLintPluginSnippetOptions } from './types'
import { createPlugin } from './plugin'
import { mergeOptionsWithDefaults } from './utils'

export default function config(options: ESLintPluginSnippetOptions = {}) {
  const opts = mergeOptionsWithDefaults(options)

  return {
    name: opts.name,
    plugins: {
      snippet: createPlugin(opts),
    },
    rules: {
      'snippet/snippet': 'error',
    },
  }
}
