import type { ESLintPluginSnippetOptions } from './types'
import builtInSnippets from './snippets'

export function mergeOptionsWithDefaults(options: ESLintPluginSnippetOptions): Required<ESLintPluginSnippetOptions> {
  return {
    name: 'snippet',
    prefix: ';',
    snippets: builtInSnippets,
    ...options,
  }
}
