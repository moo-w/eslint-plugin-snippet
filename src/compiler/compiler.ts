import type { Snippet } from '../types'
import type { TokenizerOptions } from './tokenizer'
import { parser } from './parser'
import { snippetGen } from './snippetGen'
import { tokenizer } from './tokenizer'

export interface CompilerOptions {
  comment: string
  snippets: Snippet[]
  tokenizerOptions: TokenizerOptions
}

export function compiler(options: CompilerOptions) {
  const { comment, snippets, tokenizerOptions } = options
  const tokens = tokenizer(comment, tokenizerOptions)
  const ast = parser(tokens)
  if (!ast)
    return ''
  return snippetGen(ast, snippets)
}
