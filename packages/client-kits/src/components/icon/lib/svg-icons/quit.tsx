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
      d="M7.5 8a.5.5 0 0 0 1 0V2a.5.5 0 0 0-1 0zM3.064 4.3a.5.5 0 1 0-.8-.6 7.167 7.167 0 1 0 11.468 0 .5.5 0 0 0-.799.6 6.167 6.167 0 1 1-9.869 0"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
const Memo = memo(ForwardRef);
export default Memo;
