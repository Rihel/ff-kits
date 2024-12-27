import { FFIcon } from '../icon'
import { useCallback } from 'react'
import { useImmer } from 'use-immer'

export const SiderMenuCollapsed = ({ collapsed, onCollapse }) => {
  const [state, setState] = useImmer({
    show: false,
  })
  const showTrigger = useCallback(() => {
    setState((d) => {
      d.show = true
    })
  }, [])
  const hideTrigger = useCallback(() => {
    setState((d) => {
      d.show = false
    })
  }, [])
  return (
    <div
      className="absolute top-0 right-0 flex items-center w-3 h-full translate-x-1/2 "
      onMouseEnter={showTrigger}
      onMouseLeave={hideTrigger}
    >
      {state.show && (
        <div
          onClick={onCollapse}
          className="w-full h-16 rounded-full border border-[#565679] bg-[#F7f8fa] text-[10px] flex items-center justify-center cursor-pointer"
          style={{
            transform: `rotate(${collapsed ? 180 : 0}deg)`,
          }}
        >
          <FFIcon type="caret-left-outlined" />
        </div>
      )}
    </div>
  )
}
