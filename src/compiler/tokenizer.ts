import type { ESLintPluginSnippetOptions } from '../types'

export enum TokenType {
  Command = 'Command',
  CommandPrefix = 'CommandPrefix',
  Separator = 'Separator',
  SlotIgnore = 'SlotIgnore',
  SlotText = 'SlotText',
}

export interface TokenCommon {
  type: TokenType
  value: string
}

export interface CommandPrefixToken extends TokenCommon {
  type: TokenType.CommandPrefix
}

export interface CommandToken extends TokenCommon {
  type: TokenType.Command
}

export interface SeparatorToken extends TokenCommon {
  type: TokenType.Separator
}

export interface SlotTextToken extends TokenCommon {
  type: TokenType.SlotText
}

export interface SlotIgnoreToken extends TokenCommon {
  type: TokenType.SlotIgnore
}

export type Token = CommandToken | CommandPrefixToken | SeparatorToken | SlotIgnoreToken | SlotTextToken

export type TokenizerOptions = Required<Pick<ESLintPluginSnippetOptions, 'commandPrefix' | 'separator' | 'ignoreIndicator'>>

/**
 * A tokenizer that tokenize the a snippet comment into tokens
 *
 * For example, given the following comment:
 * ;a>_>;b>>testb1>>testb2>testa1>;c>>;d>>>testd1
 *
 * The tokenizer will tokenize it into the following tokens:
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
 */
export function tokenizer(comment: string, options: TokenizerOptions): Token[] {
  const tokens: Token[] = []
  const { commandPrefix, separator } = options

  let p = 0
  const commentLength = comment.length
  while (p < commentLength) {
    const c = comment[p]

    if (c === commandPrefix) {
      tokens.push({ type: TokenType.CommandPrefix, value: c })
      p++

      const { token, pointer } = greedyMatchCommand(comment, p, options)
      tokens.push(token)
      p = pointer
    }
    else if (c === separator) {
      const { token, pointer } = greedyMatchSeparator(comment, p, separator)
      tokens.push(token)
      p = pointer
    }
    else {
      const { token, pointer } = greedyMatchSlotText(comment, p, options)
      tokens.push(token)
      p = pointer
    }
  }

  return tokens
}

function greedyMatch(
  comment: string,
  pointer: number,
  specialCharacters: string[],
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
    else if (specialCharacters.includes(c)) {
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

function greedyMatchCommand(
  comment: string,
  pointer: number,
  tokenizerOpts: TokenizerOptions,
) {
  const { commandPrefix, separator } = tokenizerOpts

  const { pointer: p, token } = greedyMatch(comment, pointer, [commandPrefix, separator], TokenType.Command)
  return { pointer: p, token }
}

function greedyMatchSlotText(
  comment: string,
  pointer: number,
  tokenizerOpts: TokenizerOptions,
) {
  const { commandPrefix, separator, ignoreIndicator } = tokenizerOpts

  const { pointer: p, token } = greedyMatch(comment, pointer, [commandPrefix, separator], TokenType.SlotText)
  if (token.value === ignoreIndicator) {
    token.type = TokenType.SlotIgnore
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
