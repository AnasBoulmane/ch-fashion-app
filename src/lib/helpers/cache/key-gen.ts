import { sortBy, isObject, isArray } from 'lodash'

const hashValue = (value: unknown): string => {
  if (isArray(value)) {
    return `[${value.map(hashValue).join(',')}]`
  }
  if (isObject(value)) {
    return `{${sortBy(Object.entries(value), ([key]) => key).map(([key, value]) => `"${key}":${hashValue(value)}`).join(',')}}`
  }
  return String(value)
}

export const generateKey = (args: unknown[]): string => hashValue(args)
