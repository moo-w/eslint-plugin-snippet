import type { TokenizerOptions } from './tokenizer'
import { NodeType, parser, processTokens } from './parser'
import { tokenizer } from './tokenizer'

const tokenizerOpts: TokenizerOptions = {
  commandPrefix: ';',
  separator: '>',
  ignoreIndicator: '_',
}

describe('processTokens: invalid tokens', () => {
  it('should return [] if tokens are empty', () => {
    const result = processTokens([])
    expect(result).toEqual([])
  })

  it('should return [] if first token is not a command', () => {
    const comment = `    ;test`
    const tokens = tokenizer(comment, tokenizerOpts)
    const result = processTokens(tokens)
    expect(result).toEqual([])
  })

  it('should return [] if separators exist in even index of tokens array', () => {
    const comment = `;test;test>`
    const tokens = tokenizer(comment, tokenizerOpts)
    const result = processTokens(tokens)
    expect(result).toEqual([])
  })

  it('should return [] if other tokens exist in odd index of tokens array', () => {
    const comment = `;test;test;test>`
    const tokens = tokenizer(comment, tokenizerOpts)
    const result = processTokens(tokens)
    expect(result).toEqual([])
  })

  it('the fist separator value length should be 1', () => {
    const comment = `;test>>test`
    const tokens = tokenizer(comment, tokenizerOpts)
    const result = processTokens(tokens)
    expect(result).toEqual([])
  })

  it('sep should increase step by step', () => {
    const comment = `;test>test>>>test`
    const tokens = tokenizer(comment, tokenizerOpts)
    const result = processTokens(tokens)
    expect(result).toEqual([])
  })

  it('if sep is increasing, the token before it must be a command', () => {
    const comment = `;test>test>>test`
    const tokens = tokenizer(comment, tokenizerOpts)
    const result = processTokens(tokens)
    expect(result).toEqual([])
  })
})

describe('parser', () => {
  it('if pre-check failed, return null', () => {
    const comment = `;test>test>>test`
    const tokens = tokenizer(comment, tokenizerOpts)
    const result = parser(tokens)
    expect(result).toBe(null)
  })

  it('parser', () => {
    const comment = ';a>_>;b>>testb1>>testb2>testa1>;c>>;d>>>testd1>testa2'
    const tokens = tokenizer(comment, tokenizerOpts)
    const result = parser(tokens)
    expect(result).toEqual({
      type: NodeType.Command,
      value: 'a',
      body: [
        { type: NodeType.SlotIgnore },
        {
          type: NodeType.Command,
          value: 'b',
          body: [
            { type: NodeType.SlotText, value: 'testb1' },
            { type: NodeType.SlotText, value: 'testb2' },
          ],
        },
        { type: NodeType.SlotText, value: 'testa1' },
        {
          type: NodeType.Command,
          value: 'c',
          body: [
            {
              type: NodeType.Command,
              value: 'd',
              body: [{ type: NodeType.SlotText, value: 'testd1' }],
            },
          ],
        },
        { type: NodeType.SlotText, value: 'testa2' },
      ],
    })
  })

//   it.skip('ramdom test', () => {
//     const comment = ';func>callback = ;arror>>a>>console.log(a)>body'
//     const snippetResult = `
// function(callback = () => console.log())
// `
//     const tokens = tokenizer(comment, tokenizerOpts)
//     const result = parser(tokens)
//     console.log(JSON.stringify(result, null, 2))
//   })
})
