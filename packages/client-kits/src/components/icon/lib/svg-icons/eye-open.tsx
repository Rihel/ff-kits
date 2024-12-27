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
    viewBox="0 0 20 20"
    ref={ref}
  >
    <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
      <path d="M10 5.625a7.72 7.72 0 0 0-6.784 4.021.74.74 0 0 0 0 .708A7.72 7.72 0 0 0 10 14.375a7.72 7.72 0 0 0 6.785-4.021.74.74 0 0 0 0-.708A7.72 7.72 0 0 0 10 5.625M2.119 9.046A8.97 8.97 0 0 1 10 4.375c3.401 0 6.36 1.89 7.881 4.671a1.99 1.99 0 0 1 0 1.908A8.97 8.97 0 0 1 10 15.625a8.97 8.97 0 0 1-7.881-4.671 1.99 1.99 0 0 1 0-1.908" />
      <path d="M10 8.125a1.875 1.875 0 1 0 0 3.75 1.875 1.875 0 0 0 0-3.75M6.875 10a3.125 3.125 0 1 1 6.25 0 3.125 3.125 0 0 1-6.25 0" />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
const Memo = memo(ForwardRef);
export default Memo;
