import type { CommandPrefixToken, Token } from './tokenizer'
import { TokenType } from './tokenizer'

export enum NodeType {
  Command = 'Command',
  SlotText = 'SlotText',
  SlotIgnore = 'Ignore',
}

export interface NodeCommon {
  type: NodeType
  value?: string
  body?: Node[]
}

export type Node = CommandNode | SlotTextNode | SlotIgnoreNode

export interface CommandNode extends NodeCommon {
  type: NodeType.Command
  value: string
  body: Node[]
}

export interface SlotTextNode extends NodeCommon {
  type: NodeType.SlotText
  value: string
}

export interface SlotIgnoreNode extends NodeCommon {
  type: NodeType.SlotIgnore
}

/**
 * A parser that parse the a token list into AST
 *
 * For example, given the following tokens:
 *
 * [
 *    { type: TokenType.CommandPrefix, value: ';' },
 *    { type: TokenType.Command, value: 'a' },
 *    { type: TokenType.Separator, value: '>' },
 *    { type: TokenType.Ignore, value: '_' },
 *    { type: TokenType.Separator, value: '>' },
 *    { type: TokenType.CommandPrefix, value: ';' },
 *    { type: TokenType.Command, value: 'b' },
 *    { type: TokenType.Separator, value: '>>' },
 *    { type: TokenType.Slot, value: 'testb1' },
 *    { type: TokenType.Separator, value: '>>' },
 *    { type: TokenType.Slot, value: 'testb2' },
 *    { type: TokenType.Separator, value: '>' },
 *    { type: TokenType.Slot, value: 'testa1' },
 *    { type: TokenType.Separator, value: '>' },
 *    { type: TokenType.CommandPrefix, value: ';' },
 *    { type: TokenType.Command, value: 'c' },
 *    { type: TokenType.Separator, value: '>>' },
 *    { type: TokenType.CommandPrefix, value: ';' },
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
export function parser(tokens: Token[]) {
  const pTokens = processTokens(tokens)

  if (pTokens.length === 0)
    return null

  const root: CommandNode = {
    type: NodeType.Command,
    value: pTokens[0].value,
    body: [],
  }

  let i = 1
  const nearestCommandLevelList: CommandNode[] = [root]
  while (i < pTokens.length) {
    const [
      prevT,
      curT,
    ] = [pTokens[i - 1], pTokens[i], pTokens[i + 1]]

    if (prevT.type === TokenType.Separator) {
      const node = createNodeByToken(curT)
      const lvl = prevT.value.length
      const parent = nearestCommandLevelList[lvl - 1]
      parent.body.push(node)
      if (node.type === NodeType.Command) {
        nearestCommandLevelList[lvl] = node
      }
    }

    i++
  }

  return root
}

function createNodeByToken(token: Token) {
  switch (token.type) {
    case TokenType.Command:
      return {
        type: NodeType.Command,
        value: token.value,
        body: [],
      } as CommandNode
    case TokenType.SlotText:
      return {
        type: NodeType.SlotText,
        value: token.value,
      } as SlotTextNode
    case TokenType.SlotIgnore:
      return {
        type: NodeType.SlotIgnore,
      } as SlotIgnoreNode
    default:
      throw new Error(`Invalid token type: ${token.type}`)
  }
}
export function processTokens(tokens: Token[]): Exclude<Token, CommandPrefixToken>[] {
  // tokens should not be empty
  if (tokens.length === 0)
    return []

  // first token should be a command prefix
  if (tokens[0].type !== TokenType.CommandPrefix)
    return []

  // command-prefix-token must be followed by a command-token
  for (let i = 0; i < tokens.length - 1; i++) {
    if (tokens[i].type === TokenType.CommandPrefix && tokens[i + 1].type !== TokenType.Command)
      return []
  }

  const pTokens = tokens.filter(token => token.type !== TokenType.CommandPrefix)

  // even-indexed token should be a command-token or a slot-text-token or a slot-ignore-token
  // odd-indexed token should be a separator-token
  for (let i = 0; i < pTokens.length; i++) {
    if (i % 2 === 0 && ![TokenType.Command, TokenType.SlotText, TokenType.SlotIgnore].includes(pTokens[i].type))
      return []
    if (i % 2 === 1 && pTokens[i].type !== TokenType.Separator)
      return []
  }

  const seps = pTokens.filter(token => token.type === TokenType.Separator)

  // first separator token should have a length of 1
  if (seps.length > 0 && seps[0].value.length !== 1)
    return []

  // separator level should be increased step by step,
  // when it is increased, the command token should be ahead of the increased separator token
  for (let i = 0; i < seps.length - 1; i++) {
    const [sepLvl, nextSepLvl] = [seps[i].value.length, seps[i + 1].value.length]

    if (sepLvl < nextSepLvl && nextSepLvl - sepLvl > 1)
      return []
    // check if the command token is ahead of the increased separator tokens
    if (sepLvl < nextSepLvl && pTokens[(i + 1) * 2].type !== TokenType.Command)
      return []
  }

  return pTokens
}
