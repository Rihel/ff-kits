import type { SVGProps } from "react";
import { Ref, forwardRef, memo } from "react";
const SvgComponent = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 16 16"
    ref={ref}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8.196 9.174a.3.3 0 0 1-.39 0L3.658 5.62a.5.5 0 0 0-.65.76l4.146 3.553a1.3 1.3 0 0 0 1.692 0l4.146-3.554a.5.5 0 1 0-.651-.759z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
const Memo = memo(ForwardRef);
export default Memo;
