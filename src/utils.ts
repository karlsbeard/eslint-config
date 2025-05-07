import { isPackageExists } from 'local-pkg'
import type { Awaitable, TypedFlatConfigItem } from './types'
import { fileURLToPath } from 'url'

const scopeUrl = fileURLToPath(new URL('.', import.meta.url))

export const parserPlain = {
  meta: {
    name: 'parser-plain',
  },
  parseForESLint: (code: string) => ({
    ast: {
      body: [],
      comments: [],
      loc: { end: code.length, start: 0 },
      range: [0, code.length],
      tokens: [],
      type: 'Program',
    },
    scopeManger: null,
    services: { isPlain: true },
    visitorKeys: {
      Program: ['body'],
    },
  }),
}

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m
  return (resolved as any).default || resolved
}

export function renameRules(rules: Record<string, any>, map: Record<string, string>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules).map(([key, value]) => {
      for (const [from, to] of Object.entries(map)) {
        if (key.startsWith(`${from}/`)) {
          return [to + key.slice(from.length), value]
        }
      }
      return [key, value]
    }),
  )
}

/**
 * Combine array and non-array configs into a single array.
 */
export async function combine(...configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]): Promise<TypedFlatConfigItem[]> {
  const resolved = await Promise.all(configs)
  return resolved.flat()
}

export function isPackageInScope(name: string): boolean {
  return isPackageExists(name, { paths: [scopeUrl] })
}
