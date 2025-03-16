/* eslint-disable antfu/no-import-dist */
import { antfu } from '@antfu/eslint-config'
import snippet from './dist/config.js'
import { defineSnippets } from './dist/snippets.js'

const snippets = defineSnippets([
  {
    name: 'console.log',
    command: 'c',
    template: 'console.log($0)',
  },
  {
    name: 'function',
    command: 'f',
    template: `function fn() {
  $0
}`,
  },
])

export default antfu(
  {},
  snippet({
    commandPrefix: ';',
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
        'style/spaced-comment': 'off',
      },
    },
  )
