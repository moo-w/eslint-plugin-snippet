import type { TokenizerOptions } from './tokenizer'
import { tokenizer, TokenType } from './tokenizer'

const tokenizerOpts: TokenizerOptions = {
  commandPrefix: ';',
  separator: '>',
  ignoreIndicator: '_',
}

describe('tokenizer', () => {
  it('single command', () => {
    const comment = ';test'
    const expected = [
      { type: TokenType.CommandPrefix, value: ';' },
      { type: TokenType.Command, value: 'test' },
    ]

    const tokens = tokenizer(comment, tokenizerOpts)
    expect(tokens).toEqual(expected)
  })

  it('single command with separator', () => {
    const comment = ';test>'
    const expected = [
      { type: TokenType.CommandPrefix, value: ';' },
      { type: TokenType.Command, value: 'test' },
      { type: TokenType.Separator, value: '>' },
    ]

    const tokens = tokenizer(comment, tokenizerOpts)
    expect(tokens).toEqual(expected)
  })

  it('single command with ignore', () => {
    const comment = ';test>_>test>____>_'
    const expected = [
      { type: TokenType.CommandPrefix, value: ';' },
      { type: TokenType.Command, value: 'test' },
      { type: TokenType.Separator, value: '>' },
      { type: TokenType.SlotIgnore, value: '_' },
      { type: TokenType.Separator, value: '>' },
      { type: TokenType.SlotText, value: 'test' },
      { type: TokenType.Separator, value: '>' },
      { type: TokenType.SlotText, value: '____' },
      { type: TokenType.Separator, value: '>' },
      { type: TokenType.SlotIgnore, value: '_' },
    ]

    const tokens = tokenizer(comment, tokenizerOpts)
    expect(tokens).toEqual(expected)
  })

  it('space in slot', () => {
    const comment = ';test>test with space>test with            '
    const expected = [
      { type: TokenType.CommandPrefix, value: ';' },
      { type: TokenType.Command, value: 'test' },
      { type: TokenType.Separator, value: '>' },
      { type: TokenType.SlotText, value: 'test with space' },
      { type: TokenType.Separator, value: '>' },
      { type: TokenType.SlotText, value: 'test with            ' },
    ]

    const tokens = tokenizer(comment, tokenizerOpts)
    expect(tokens).toEqual(expected)
  })

  it('multi layer command', () => {
    const comment = ';a>_>;b>>testb1>>testb2>testa1>;c>>;d>>>testd1'
    const expected = [
      { type: TokenType.CommandPrefix, value: ';' },
      { type: TokenType.Command, value: 'a' },
      { type: TokenType.Separator, value: '>' },
      { type: TokenType.SlotIgnore, value: '_' },
      { type: TokenType.Separator, value: '>' },
      { type: TokenType.CommandPrefix, value: ';' },
      { type: TokenType.Command, value: 'b' },
      { type: TokenType.Separator, value: '>>' },
      { type: TokenType.SlotText, value: 'testb1' },
      { type: TokenType.Separator, value: '>>' },
      { type: TokenType.SlotText, value: 'testb2' },
      { type: TokenType.Separator, value: '>' },
      { type: TokenType.SlotText, value: 'testa1' },
      { type: TokenType.Separator, value: '>' },
      { type: TokenType.CommandPrefix, value: ';' },
      { type: TokenType.Command, value: 'c' },
      { type: TokenType.Separator, value: '>>' },
      { type: TokenType.CommandPrefix, value: ';' },
      { type: TokenType.Command, value: 'd' },
      { type: TokenType.Separator, value: '>>>' },
      { type: TokenType.SlotText, value: 'testd1' },
    ]

    const tokens = tokenizer(comment, tokenizerOpts)
    expect(tokens).toEqual(expected)
  })

  it('escaped separator in command', () => {
    const comment = `;test\\>test`
    const expected = [
      { type: TokenType.CommandPrefix, value: ';' },
      { type: TokenType.Command, value: 'test>test' },
    ]

    const tokens = tokenizer(comment, tokenizerOpts)
    expect(tokens).toEqual(expected)
  })

  it('escaped separator in slot', () => {
    const comment = `;test>test\\>test`
    const expected = [
      { type: TokenType.CommandPrefix, value: ';' },
      { type: TokenType.Command, value: 'test' },
      { type: TokenType.Separator, value: '>' },
      { type: TokenType.SlotText, value: 'test>test' },
    ]

    const tokens = tokenizer(comment, tokenizerOpts)
    expect(tokens).toEqual(expected)
  })

  it('slot-text mix with command', () => {
    const comment = `;text>param = ;arrow>console.log('a')`
    const expected = [
      { type: TokenType.CommandPrefix, value: ';' },
      { type: TokenType.Command, value: 'text' },
      { type: TokenType.Separator, value: '>' },
      { type: TokenType.SlotText, value: 'param = ' },
      { type: TokenType.CommandPrefix, value: ';' },
      { type: TokenType.Command, value: 'arrow' },
      { type: TokenType.Separator, value: '>' },
      { type: TokenType.SlotText, value: 'console.log(\'a\')' },
    ]

    const tokens = tokenizer(comment, tokenizerOpts)
    expect(tokens).toEqual(expected)
  })
})

describe('tokenizer: invalid comments', () => {
  it('front space', () => {
    const comment = ' ;test'
    const expected = [
      { type: TokenType.SlotText, value: ' ' },
      { type: TokenType.CommandPrefix, value: ';' },
      { type: TokenType.Command, value: 'test' },
    ]

    const tokens = tokenizer(comment, tokenizerOpts)
    expect(tokens).toEqual(expected)
  })

  it('>>>>\\>>>>>', () => {
    const comment = '>>>>\\>>>>>'
    const expected = [
      { type: TokenType.Separator, value: '>>>>' },
      { type: TokenType.SlotText, value: '>' },
      { type: TokenType.Separator, value: '>>>>' },
    ]

    const tokens = tokenizer(comment, tokenizerOpts)
    expect(tokens).toEqual(expected)
  })
})
