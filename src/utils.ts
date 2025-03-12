import type { ESLintPluginSnippetOptions } from './types'
import { builtInSnippets } from './snippets'

const defaultOptions: Required<ESLintPluginSnippetOptions> = {
  name: 'snippet',
  prefix: ';',
  separator: '>',
  ignoreIndicator: '_',
  snippets: builtInSnippets,
}

export function mergeOptionsWithDefaults(options: ESLintPluginSnippetOptions = {}): Required<ESLintPluginSnippetOptions> {
  return {
    ...defaultOptions,
    ...options,
  }
}
