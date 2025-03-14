/**
 * A parser that parse the a token list into AST
 *
 * For example, given the following tokens:
 *
 * [
 *    { type: TokenType.Command, value: 'a' },
 *    { type: TokenType.Separator, value: '>' },
 *    { type: TokenType.Ignore, value: '_' },
 *    { type: TokenType.Separator, value: '>' },
 *    { type: TokenType.Command, value: 'b' },
 *    { type: TokenType.Separator, value: '>>' },
 *    { type: TokenType.Slot, value: 'testb1' },
 *    { type: TokenType.Separator, value: '>>' },
 *    { type: TokenType.Slot, value: 'testb2' },
 *    { type: TokenType.Separator, value: '>' },
 *    { type: TokenType.Slot, value: 'testa1' },
 *    { type: TokenType.Separator, value: '>' },
 *    { type: TokenType.Command, value: 'c' },
 *    { type: TokenType.Separator, value: '>>' },
 *    { type: TokenType.Command, value: 'd' },
 *    { type: TokenType.Separator, value: '>>>' },
 *    { type: TokenType.Slot, value: 'testd1' },
 * ]
 *
 * The parser will parse it into the following AST:
 *
 * {
 *    type: 'Command',
 *    value: 'a',
 *    body: [
 *      { type: 'Ignore' },
 *      {
 *        type: 'Command',
 *        value: 'b',
 *        body: [
 *          { type: 'Slot', value: 'testb1' },
 *          { type: 'Slot', value: 'testb2' }
 *        ]
 *      },
 *      { type: 'Slot', value: 'testa1' },
 *      {
 *        type: 'Command',
 *        value: 'c',
 *        body: [
 *          {
 *            type: 'Command',
 *            value: 'd',
 *            body: [{ type: 'Slot', value: 'testd1' }]
 *          },
 *        ]
 *      },
 *    ]
 * }
 */

import type { Token } from './tokenizer'

export enum NodeType {
  Command = 'Command',
  Slot = 'Slot',
  Ignore = 'Ignore',
}

export interface Node {
  type: NodeType
  value?: string
  body?: Node[]
}

export interface CommandNode extends Node {
  type: NodeType.Command
  value: string
  body: Node[]
}

export interface SlotNode extends Node {
  type: NodeType.Slot
  value: string
}

export interface IgnoreNode extends Node {
  type: NodeType.Ignore
}

export function parser(tokens: Token[]) {
  if (tokens.length === 0) {
    return null
  }
  if (tokens[0].type !== 'Command') {
    throw new Error('Parser: the first token must be a command')
  }
  const root: CommandNode = {
    type: NodeType.Command,
    value: tokens[0].value,
    body: [],
  }
  let p = 1
  while (p < tokens.length) {
    // TODO: implement the parser
    p++
  }

  return root
}
