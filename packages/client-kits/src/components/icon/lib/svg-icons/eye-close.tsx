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
    <g fill="currentColor">
      <path d="M8.125 10.03c0-1.036.84-1.875 1.875-1.875a.625.625 0 1 0 0-1.25 3.125 3.125 0 0 0-3.125 3.125.625.625 0 1 0 1.25 0" />
      <path
        fillRule="evenodd"
        d="M3.279 16.692c.244.244.64.244.884 0l12.5-12.5a.625.625 0 1 0-.884-.884l-1.951 1.95A8.9 8.9 0 0 0 10 4.406a8.97 8.97 0 0 0-7.881 4.671 1.99 1.99 0 0 0 0 1.908 9 9 0 0 0 2.851 3.133L3.28 15.808a.625.625 0 0 0 0 .884m8.73-10.774q.446.12.87.29l-6.983 6.983-.977-.69a7.8 7.8 0 0 1-1.703-2.117.74.74 0 0 1 0-.708A7.72 7.72 0 0 1 10 5.655c.695 0 1.369.092 2.008.263"
        clipRule="evenodd"
      />
      <path d="M15.386 6.965a.625.625 0 0 1 .884-.01 9 9 0 0 1 1.611 2.121 1.99 1.99 0 0 1 0 1.908A8.97 8.97 0 0 1 10 15.655a9 9 0 0 1-2.239-.281.625.625 0 0 1 .31-1.211 7.8 7.8 0 0 0 1.929.242 7.72 7.72 0 0 0 6.785-4.021.74.74 0 0 0 0-.708 7.7 7.7 0 0 0-1.388-1.827.625.625 0 0 1-.011-.884" />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
const Memo = memo(ForwardRef);
export default Memo;
