import { useCallback, useEffect, useMemo } from "react";

import _ from "lodash";
import { useImmer } from "use-immer";

export type UseCtrlOption<T> = {
  valueKey: keyof T,
  handleKey: keyof T,
  defaultValue: any
}
export function useCtrl<Props extends Record<string, any>>(props: Props, options: UseCtrlOption<Props>) {
  const opt = useMemo(() => {
    return {
      ...{
        valueKey: "value",
        handleKey: "onChange",
        defaultValue: "",
      },
      ...options,
    };
  }, [options]);

  const { defaultValue, handleKey, valueKey } = opt;

  const [innerValue, setInnerValue] = useImmer(defaultValue);

  const handle = useCallback(
    (val: any, ...args: any) => {
      if (_.has(props, handleKey)) {
        props[handleKey]?.(val, ...args);
      }
      setInnerValue(val);
    },
    [props],
  );

  const value = useMemo(() => {
    if (_.has(props, valueKey)) {
      return props[valueKey];
    }
    return innerValue;
  }, [props, innerValue]);

  return {
    value,
    handle,
  };
}
