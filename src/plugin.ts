import type { ESLint } from 'eslint'
import type { Snippet } from './types'
import { version } from '../package.json'
import { createRuleWithSnippets } from './rule'

export function createPluginWithSnippets(prefix: string, snippets: Snippet[]): ESLint.Plugin {
  return {
    meta: {
      name: 'snippet',
      version,
    },
    rules: {
      snippet: createRuleWithSnippets(prefix, snippets),
    },
  }
}
