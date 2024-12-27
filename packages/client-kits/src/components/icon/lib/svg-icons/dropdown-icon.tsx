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
    viewBox="0 0 12 12"
    ref={ref}
  >
    <path
      fill="currentColor"
      d="M5.548 7.484 3.371 4.995A.6.6 0 0 1 3.822 4h4.356a.6.6 0 0 1 .451.995L6.452 7.484a.6.6 0 0 1-.904 0"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
const Memo = memo(ForwardRef);
export default Memo;
