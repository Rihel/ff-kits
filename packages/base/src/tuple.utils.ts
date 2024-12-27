type TupleToObject<T extends any[]> = {
  [K in keyof T as Exclude<K, keyof any[]>]: T[K]
}

export function tupleToObj<
  N extends PropertyKey[] & Record<keyof TupleToObject<T>, PropertyKey>,
  T extends any[],
>(names: [...N], tuple: [...T]) {
  const keyValueList = Array.from(tuple.entries()).map(([k, v]) => {
    const key = (names as any)[k]
    return [key, v]
  })
  return Object.fromEntries(keyValueList) as {
    [K in keyof TupleToObject<T> as N[K]]: T[K]
  }
}

export function tupleListToArray<
  T extends any[],
  N extends PropertyKey[] & Record<keyof TupleToObject<T>, PropertyKey>,
>(names: [...N], tupleList: Array<[...N]>) {
  return tupleList.map((tuple) => {
    return tupleToObj(names, tuple)
  })
}
