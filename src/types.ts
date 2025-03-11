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
  snippet: string
}

export interface ESLintPluginSnippetOptions {
  /**
   * Name of the plugin
   * @default 'snippet'
   */
  name?: string

  /**
   * Prefix for the snippet-comments
   * @default ':'
   */
  prefix?: string

  /**
   * Custom snippets
   */
  snippets?: Snippet[]
}
