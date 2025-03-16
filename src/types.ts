export interface ESLintPluginSnippetOptions {
  /**
   * Name of the plugin
   * @default 'snippet'
   */
  name?: string

  /**
   * Prefix for the snippet-command
   * @default ':'
   */
  commandPrefix?: string

  /**
   * Separator for the snippet-comments
   * @default '>'
   */
  separator?: string

  /**
   * Ignore indicator
   * @default '_'
   */
  ignoreIndicator?: string

  /**
   * Custom snippets
   */
  snippets?: Snippet[]
}

export interface Snippet {
  /**
   * Name of the snippet
   */
  name: string

  /**
   * Command to trigger the snippet
   */
  command: string

  /**
   * Snippet text
   */
  template: string
}

export function defineSnippets(snippets: Snippet[]): Snippet[] {
  return snippets
}
