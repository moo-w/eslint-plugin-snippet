/**
 * A tokenizer that tokenize the a snippet comment into tokens
 *
 * For example, given the following comment:
 * ;a>_>;b>>testb1>>testb2>testa1>;c>>;d>>>testd1
 *
 * The tokenizer will tokenize it into the following tokens:
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
 */

import type { ESLintPluginSnippetOptions } from '../types'

export enum TokenType {
  Command = 'Command',
  Separator = 'Separator',
  Ignore = 'Ignore',
  Slot = 'Slot',
}

export interface Token {
  type: TokenType
  value: string
}

export type TokenizerOptions = Required<Omit<ESLintPluginSnippetOptions, 'name' | 'snippets'>>

export function tokenizer(comment: string, options: TokenizerOptions): Token[] {
  const tokens: Token[] = []
  const { commandPrefix, separator, ignoreIndicator } = options

  let p = 0
  const commentLength = comment.length
  while (p < commentLength) {
    const c = comment[p]

    if (c === commandPrefix) {
      const { token, pointer } = greedyMatchText(comment, p + 1, [commandPrefix, separator], TokenType.Command)
      tokens.push(token)
      p = pointer
    }
    else if (c === separator) {
      const { token, pointer } = greedyMatchSeparator(comment, p, separator)
      tokens.push(token)
      p = pointer
    }
    else {
      const { token, pointer } = greedyMatchSlot(comment, p, ignoreIndicator)
      tokens.push(token)
      p = pointer
    }
  }

  return tokens
}

function greedyMatchText(
  comment: string,
  pointer: number,
  notValidStrs: string[],
  tokenType: TokenType,
) {
  const ec = '\\'

  let tokenVal = ''

  const len = comment.length
  while (pointer < len) {
    const c = comment[pointer]

    if (c === ec) {
      pointer++
      tokenVal += comment[pointer] ?? ''
    }
    else if (notValidStrs.includes(c)) {
      break
    }
    else {
      tokenVal += c
    }
    pointer++
  }

  return {
    pointer,
    token: { type: tokenType, value: tokenVal },
  }
}

function greedyMatchSlot(comment: string, pointer: number, ignoreIndicator: string) {
  const { pointer: p, token } = greedyMatchText(comment, pointer, ['>', ';'], TokenType.Slot)
  if (token.value === ignoreIndicator) {
    token.type = TokenType.Ignore
    token.value = ignoreIndicator
  }

  return { pointer: p, token }
}

function greedyMatchSeparator(
  comment: string,
  pointer: number,
  separator: string,
) {
  let sep = ''
  do {
    sep += separator
    pointer++
  } while (comment[pointer] === separator)
  return {
    pointer,
    token: { type: TokenType.Separator, value: sep },
  }
}
