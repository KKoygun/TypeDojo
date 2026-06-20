// Challenge: index signatures with named properties

export interface MetricsMap {
  [key: string]: string | number  // value type must accommodate timestamp
  timestamp: number
}

export interface FlexibleConfig {
  [key: string]: string | number | boolean
  name: string
  version: number
}

export function mergeConfigs(base: FlexibleConfig, overrides: Partial<FlexibleConfig>): FlexibleConfig {
  // merge overrides into base, return new object
}

export function getMetric(map: MetricsMap, key: string): number | undefined {
  // safely read a value, return undefined for missing
}
