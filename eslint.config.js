import { antfu } from '@antfu/eslint-config'
// eslint-disable-next-line antfu/no-import-dist
import snippet from './dist/config.js'

export default antfu(
  {},
  snippet(),
)
  .append(
    {
      files: ['example.ts'],
      rules: {
        'antfu/top-level-function': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
  )
