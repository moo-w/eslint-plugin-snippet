import type { Snippet } from '../types'
import type { CommandNode } from './parser'
import { NodeType } from './parser'

export function snippetGen(node: CommandNode, snippets: Snippet[]): string {
  let result = ''

  const s = snippets.find(s => s.command === node.value)
  if (!s) {
    return ''
  }

  let template = s.snippet
  const templateSlotRegex = /\$\d+/g
  const templateSlotCount = s.snippet.match(templateSlotRegex)?.length || 0
  const commandSlotCount = node.body.length
  const commandSlots = node.body

  if (commandSlotCount > templateSlotCount) {
    return ''
  }

  commandSlots.forEach((node, i) => {
    switch (node.type) {
      case NodeType.SlotIgnore:
        template = template.replace(new RegExp(`\\$${i}`, 'g'), '')
        break
      case NodeType.SlotText:
        template = template.replace(new RegExp(`\\$${i}`, 'g'), node.value)
        break
      case NodeType.Command:
        template = template.replace(new RegExp(`\\$${i}`, 'g'), snippetGen(node, snippets))
        break
    }
  })

  // remove redundant template slots
  template = template.replace(templateSlotRegex, '')

  result = template

  return result
}
