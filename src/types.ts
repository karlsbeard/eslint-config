import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { ParserOptions } from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { VendoredPrettierOptions } from './vender/prettier-types'

export type Awaitable<T> = T | Promise<T>

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem['rules']
}

export interface OptionsComponentExts {
  componentExts?: string[]
}

export interface OptionsStylistic {
  stylistic?: boolean | StylisticConfig
}

export interface OptionsFiles {
  files?: string[]
}

export interface OptionsProjectType {
  type?: 'app' | 'lib'
}

export interface OptionsIsInEditor {
  isInEditor?: boolean
}

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem['rules']
}

export interface OptionsFormatters {
  /**
   * Enable formatting support for CSS, Less, Sass, and SCSS.
   *
   * Currently only support Prettier.
   */
  css?: 'prettier' | boolean

  /**
   * Enable formatting support for HTML.
   *
   * Currently only support Prettier.
   */
  html?: 'prettier' | boolean

  /**
   * Enable formatting support for XML.
   *
   * Currently only support Prettier.
   */
  xml?: 'prettier' | boolean

  /**
   * Enable formatting support for SVG.
   *
   * Currently only support Prettier.
   */
  svg?: 'prettier' | boolean

  /**
   * Enable formatting support for Markdown.
   *
   * Support both Prettier and dprint.
   *
   * When set to `true`, it will use Prettier.
   */
  markdown?: 'prettier' | 'dprint' | boolean

  /**
   * Enable formatting support for GraphQL.
   */
  graphql?: 'prettier' | boolean

  /**
   * Custom options for Prettier.
   *
   * By default it's controlled by our own config.
   */
  prettierOptions?: VendoredPrettierOptions

  /**
   * Custom options for dprint.
   *
   * By default it's controlled by our own config.
   */
  dprintOptions?: boolean

  /**
   * Install the prettier plugin for handle Slidev markdown
   *
   * Only works when `markdown` is enabled with `prettier`.
   */
  slidev?: boolean | {
    files?: string[]
  }

  /**
   * Enable formatting support for Astro.
   *
   * Currently only support Prettier.
   */
  astro?: 'prettier' | boolean
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[]

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[]
}

export type OptionsTypescript =
  | (OptionsTypeScriptWithTypes & OptionsOverrides)
  | (OptionsTypeScriptWithTypes & OptionsIsInEditor)

export interface StylisticConfig
  extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'jsx' | 'semi' | 'commaDangle'> {
}

export interface OptionsConfig extends OptionsComponentExts, OptionsProjectType {

  gitignore?: boolean | FlatGitignoreOptions

  /**
   * Disable some opinionated rules to Anthony's preference.
   *
   * Including:
   * - `antfu/top-level-function`
   * - `antfu/if-newline`
   *
   * @default false
   */
  lessOpinionated?: boolean

  vue?: boolean

  typescript?: boolean | OptionsTypescript

  javascript?: OptionsOverrides

  /**
   * Automatically rename plugins in the config.
   *
   * @default true
   */
  autoRenamePlugins?: boolean

  /**
   * Enable stylistic rules.
   *
   * @see https://eslint.style/
   * @default true
   */
  stylistic?: boolean | (StylisticConfig & OptionsOverrides)

  /**
   * Use external formatters to format files.
   *
   * Requires installing:
   * - `eslint-plugin-format`
   *
   * When set to `true`, it will enable all formatters.
   *
   * @default false
   */
  formatters?: boolean | OptionsFormatters

  /**
   * Control to disable some rules in editors.
   * @default auto-detect based on the process.env
   */
  isInEditor?: boolean

  /**
   * Provide overrides for rules for each integration.
   *
   * @deprecated use `overrides` option in each integration key instead
   */
  overrides?: {
    stylistic?: TypedFlatConfigItem['rules']
    javascript?: TypedFlatConfigItem['rules']
    typescript?: TypedFlatConfigItem['rules']
    vue?: TypedFlatConfigItem['rules']
  }
}

export type TypedFlatConfigItem = Omit<Linter.Config<Linter.RulesRecord>, 'plugins'> & {
  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>
}
