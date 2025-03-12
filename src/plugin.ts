import type { ESLint } from 'eslint'
import type { ESLintPluginSnippetOptions } from './types'
import { version } from '../package.json'
import { createRule } from './rule'

export function createPlugin(options: Required<ESLintPluginSnippetOptions>): ESLint.Plugin {
  const { name } = options
  return {
    meta: {
      name,
      version,
    },
    rules: {
      snippet: createRule(options),
    },
  }
}
