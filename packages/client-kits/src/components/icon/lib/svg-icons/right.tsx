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
      d="M9.174 7.805a.3.3 0 0 1 0 .39L5.62 12.341a.5.5 0 1 0 .76.65l3.553-4.145a1.3 1.3 0 0 0 0-1.692L6.38 3.008a.5.5 0 1 0-.759.65z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
const Memo = memo(ForwardRef);
export default Memo;
