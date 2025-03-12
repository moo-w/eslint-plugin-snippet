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
  snippet: string

  /**
   * Override plugin prefix
   */
  prefix?: string

  /**
   * Override plugin separator
   */
  separator?: string

  /**
   * Override plugin ignore indicator
   */
  ignoreIndicator?: string
}

export function defineSnippets(snippets: Snippet[]): Snippet[] {
  return snippets
}
