/* eslint-disable antfu/no-import-dist */
import { antfu } from '@antfu/eslint-config'
import snippet from './dist/config.js'
import { builtInSnippets, defineSnippets } from './dist/snippets.js'

const snippets = defineSnippets([
  ...builtInSnippets,
  {
    name: 'console.log',
    command: 'c',
    snippet: 'console.log($0)',
  },
  {
    name: 'function',
    command: 'f',
    snippet: `function fn($1) {
  $0
}`,
  },
])

export default antfu(
  {},
  snippet({
    prefix: ';',
    snippets,
  }),
)
  .append(
    {
      files: ['**/*.md/**/*'],
      rules: {
        'snippet/snippet': 'off',
        'style/no-trailing-spaces': 'off',
      },
    },
    {
      files: ['example.ts'],
      rules: {
        'antfu/top-level-function': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
  )
