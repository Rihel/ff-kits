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
    viewBox="0 0 40 40"
    ref={ref}
  >
    <path
      fill="#fff"
      d="M11.448 18.427c.792 1.48 1.876 3.271 2.772 5.022.917 1.781 2.26 4.25 2.26 4.25s3.95-8.21 6.784-12.471c7.23-10.846 13.962-13.42 13.962-13.42s-.698 5.793-.626 8.127c.084 2.667 1.188 5.741 1.188 5.741s-6.22 3.615-12.117 9.982c-3.72 4.021-8.721 11.92-8.721 11.92s-4.22-5.137-7.544-7.753c-3.688-2.907-8.095-5.261-8.095-5.261s3.657-2.397 5.511-3.595c1.865-1.188 4.626-2.542 4.626-2.542"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
const Memo = memo(ForwardRef);
export default Memo;
