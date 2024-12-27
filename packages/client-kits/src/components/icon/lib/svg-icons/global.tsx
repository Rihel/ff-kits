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
      <path d="M.831 8a7.167 7.167 0 1 1 14.333 0A7.167 7.167 0 0 1 .831 8m7.167-6.166a6.167 6.167 0 1 0 0 12.333 6.167 6.167 0 0 0 0-12.333" />
      <path d="M8.387 1.019a.5.5 0 0 1-.073.703c-4.198 3.41-4.198 9.147 0 12.557a.5.5 0 0 1-.63.776c-4.691-3.81-4.691-10.299 0-14.11a.5.5 0 0 1 .703.074" />
      <path d="M7.61 1.019a.5.5 0 0 0 .072.703c4.199 3.41 4.199 9.147 0 12.557a.5.5 0 0 0 .631.777c4.69-3.81 4.69-10.3 0-14.11a.5.5 0 0 0-.703.073" />
      <path d="M7.998.834a.5.5 0 0 1 .499.5v13.333a.5.5 0 1 1-1 0V1.334a.5.5 0 0 1 .5-.5" />
      <path d="M15.166 8.001a.5.5 0 0 0-.5-.5H1.332a.5.5 0 0 0 0 1h13.334a.5.5 0 0 0 .5-.5" />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
const Memo = memo(ForwardRef);
export default Memo;
