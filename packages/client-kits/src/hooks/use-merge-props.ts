import { Context, useContext, useMemo } from 'react'
import { MergeRule, mergeWith } from '@ff-kits/base'

/**
 * 当你的组件的props和context有冲突的时候，可以使用useMergeProps，定制合并规则
 *
 * 比如现在有个组件context有一个field，props有一个field，如果你想要把props的值给context，那么可以使用useMergeProps
 *
 * 参考 Panel组件
 * @param context
 * @param props
 * @param mergeRules
 * @returns
 */

export function useMergeProps<
  T extends Record<string, any> = Record<string, any>,
  K extends keyof T = keyof T,
  Rule extends MergeRule<T, K> = MergeRule<T, K>,
>(
  context: Context<T>,
  props: Partial<T>,
  mergeRules: Record<K, Rule>
): Partial<T> {
  const ctx = useContext(context)
  return useMemo(() => {
    return mergeWith(ctx, props, mergeRules)
  }, [ctx, props, mergeRules])
}
