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
    <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
      <path d="M2.168 4A3.167 3.167 0 0 1 5.335.833h5.333A3.167 3.167 0 0 1 13.835 4v8a3.167 3.167 0 0 1-3.167 3.166H5.335A3.167 3.167 0 0 1 2.168 12zm3.167-2.167c-1.197 0-2.167.97-2.167 2.167v8c0 1.196.97 2.166 2.167 2.166h5.333c1.197 0 2.167-.97 2.167-2.166V4c0-1.197-.97-2.167-2.167-2.167z" />
      <path d="M4.834 4.667a.5.5 0 0 1 .5-.5h5.333a.5.5 0 1 1 0 1H5.334a.5.5 0 0 1-.5-.5M4.834 8a.5.5 0 0 1 .5-.5h5.333a.5.5 0 1 1 0 1H5.334a.5.5 0 0 1-.5-.5M4.834 11.333a.5.5 0 0 1 .5-.5h2.667a.5.5 0 0 1 0 1H5.334a.5.5 0 0 1-.5-.5" />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
const Memo = memo(ForwardRef);
export default Memo;
