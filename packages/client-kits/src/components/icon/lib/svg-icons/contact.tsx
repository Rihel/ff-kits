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
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M2.711 7.7a6.875 6.875 0 0 1 6.872-6.658h.833A6.875 6.875 0 0 1 17.288 7.7a2.29 2.29 0 0 1 1.67 2.206V12.5c0 1.064-.726 1.959-1.71 2.217a3.54 3.54 0 0 1-3.499 2.991h-1.148a1.88 1.88 0 0 1-1.768 1.25H9.166a1.875 1.875 0 0 1 0-3.75h1.667c.816 0 1.51.522 1.768 1.25h1.148a2.29 2.29 0 0 0 2.213-1.69 2.29 2.29 0 0 1-1.958-2.268V9.907c0-1.177.888-2.147 2.03-2.277a5.625 5.625 0 0 0-5.618-5.338h-.833A5.625 5.625 0 0 0 3.965 7.63c1.142.13 2.03 1.1 2.03 2.277V12.5a2.29 2.29 0 0 1-2.292 2.291h-.37A2.29 2.29 0 0 1 1.04 12.5V9.907c0-1.05.706-1.935 1.67-2.206m12.543 2.207c0-.575.466-1.042 1.042-1.042h.37c.575 0 1.042.467 1.042 1.042V12.5c0 .575-.466 1.041-1.042 1.041h-.37a1.04 1.04 0 0 1-1.042-1.041zm-6.713 7.176c0 .345.28.625.625.625h1.667a.625.625 0 0 0 0-1.25H9.166a.625.625 0 0 0-.625.625M4.745 9.907c0-.575-.467-1.042-1.042-1.042h-.37c-.576 0-1.042.467-1.042 1.042V12.5c0 .575.466 1.041 1.042 1.041h.37c.575 0 1.042-.466 1.042-1.041z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
const Memo = memo(ForwardRef);
export default Memo;
