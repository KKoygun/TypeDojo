export interface LabelMap {
  [key: string]: string
}

export function mergeLabels(a: LabelMap, b: LabelMap): LabelMap {
  return { ...a, ...b }
}
