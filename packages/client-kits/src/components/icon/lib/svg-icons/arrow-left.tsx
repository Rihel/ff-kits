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
    viewBox="0 0 32 32"
    ref={ref}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M16.37 9.625a1 1 0 0 1 0 1.415L12.408 15h9.253a1 1 0 1 1 0 2H12.41l3.96 3.96a1 1 0 0 1-1.414 1.414l-5.078-5.078a1.833 1.833 0 0 1 0-2.592l5.078-5.079a1 1 0 0 1 1.414 0"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
const Memo = memo(ForwardRef);
export default Memo;
