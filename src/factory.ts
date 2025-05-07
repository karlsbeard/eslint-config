import type { Linter } from 'eslint'
import type { Awaitable } from 'eslint-flat-config-utils'
import type { ConfigNames } from './typegen'
import type { OptionsConfig, TypedFlatConfigItem } from './types'
import { FlatConfigComposer } from 'eslint-flat-config-utils'
import { isPackageExists } from 'local-pkg'
import { ignores, imports, javascript, typescript, stylistic, disables } from './configs'
import { interopDefault } from './utils'
import { formatters } from './configs/formatters'

const VuePackages = [
  'vue',
  'nuxt',
  'vitepress',
  '@slidev/cli',
]

export const defaultPluginRenaming = {
  '@eslint-react': 'react',
  '@eslint-react/dom': 'react-dom',
  '@eslint-react/hooks-extra': 'react-hooks-extra',
  '@eslint-react/naming-convention': 'react-naming-convention',

  '@stylistic': 'style',
  '@typescript-eslint': 'ts',
  'import-x': 'import',
  'n': 'node',
  'vitest': 'test',
  'yml': 'yaml',
}

export function karlsbeard(options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {}, ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    componentExts = [],
    autoRenamePlugins = true,
    gitignore: enableGitignore = true,
    typescript: enableTypeScript = isPackageExists('typescript'),
    vue: enableVue = VuePackages.some(i => isPackageExists(i)),
  } = options

  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === 'object'
      ? options.stylistic
      : {}
  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
        name: 'antfu/gitignore',
        ...enableGitignore,
      })]))
    }
    else {
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
        name: 'antfu/gitignore',
        strict: false,
      })]))
    }
  }

  const typescriptOptions = resolveSubOptions(options, 'typescript')

  // Base configs
  configs.push(
    ignores(options.ignores),
    javascript({
      isInEditor: false,
      overrides: getOverrides(options, 'javascript'),
    }),
    imports({
      stylistic: stylisticOptions,
    }),
  )

  if (enableVue) {
    componentExts.push('vue')
  }

  if (enableTypeScript) {
    configs.push(typescript({
      ...typescriptOptions,
      componentExts,
      overrides: getOverrides(options, 'typescript'),
      type: options.type,
    }))
  }

  if (stylisticOptions) {
    configs.push(stylistic({
      ...stylisticOptions,
      lessOpinionated: options.lessOpinionated,
      overrides: getOverrides(options, 'stylistic'),
    }))
  }

  if (options.formatters) {
    configs.push(formatters(options.formatters, typeof stylisticOptions === 'boolean' ? {} : stylisticOptions))
  }

  configs.push(disables())

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()
  composer = composer.append(
    ...configs,
    ...(userConfigs as any),
  )

  if (autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming)
  }

  return composer
}

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean'
    ? {} as any
    : options[key] || {} as any
}

export function getOverrides<K extends keyof OptionsConfig>(options: OptionsConfig, key: K): Partial<Linter.RulesRecord> {
  const sub = resolveSubOptions(options, key)

  return {
    ...(options.overrides as any)?.[key],
    ...'overrides' in sub
      ? sub.overrides
      : {},
  }
}
