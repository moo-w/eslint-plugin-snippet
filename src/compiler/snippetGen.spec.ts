import type { Snippet } from '../types'
import type { TokenizerOptions } from './tokenizer'
import { parser } from './parser'
import { snippetGen } from './snippetGen'
import { tokenizer } from './tokenizer'

const tokenizerOpts: TokenizerOptions = {
  commandPrefix: ';',
  separator: '>',
  ignoreIndicator: '_',
}

const snippets: Snippet[] = [
  {
    name: 'function',
    command: 'fn',
    snippet: `function $0($1) {
  $2
}`,
  },
]

describe('snippetGen', () => {
  it('snippet not found', () => {
    const comment = ';test'
    const tokens = tokenizer(comment, tokenizerOpts)
    const ast = parser(tokens)!
    expect(snippetGen(ast, snippets)).toMatchInlineSnapshot(`""`)
  })

  it('too many slots in command', () => {
    const comment = ';fn>arg0>arg1>arg2>arg3'
    const tokens = tokenizer(comment, tokenizerOpts)
    const ast = parser(tokens)!
    expect(snippetGen(ast, snippets)).toMatchInlineSnapshot(`""`)
  })

  it('command slots less than template slots', () => {
    const comment = ';fn>arg0'
    const tokens = tokenizer(comment, tokenizerOpts)
    const ast = parser(tokens)!
    const result = snippetGen(ast, snippets)
    expect(result).toMatchInlineSnapshot(`
      "function arg0() {
        
      }"
    `)
  })

  it('command slots equal to template slots', () => {
    const comment = ';fn>arg0>arg1>arg2'
    const tokens = tokenizer(comment, tokenizerOpts)
    const ast = parser(tokens)!
    const result = snippetGen(ast, snippets)
    expect(result).toMatchInlineSnapshot(`
      "function arg0(arg1) {
        arg2
      }"
    `)
  })

  it('multi level', () => {
    const comment = ';fn>arg0>arg1>;fn>>arg0>>arg1>>arg2'
    const tokens = tokenizer(comment, tokenizerOpts)
    const ast = parser(tokens)!
    const result = snippetGen(ast, snippets)
    expect(result).toMatchInlineSnapshot(`
      "function arg0(arg1) {
        function arg0(arg1) {
        arg2
      }
      }"
    `)
  })
})
