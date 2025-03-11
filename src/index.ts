import { createPluginWithSnippets } from './plugin'
import builtInSnippets from './snippets'

const defaultPrefix = ';'

export default createPluginWithSnippets(defaultPrefix, builtInSnippets)
