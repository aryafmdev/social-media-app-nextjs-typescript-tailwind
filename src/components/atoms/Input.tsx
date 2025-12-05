import { forwardRef, InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className = "", invalid, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      {...props}
      className={`w-full rounded-md bg-neutral-950 text-neutral-25 placeholder:text-neutral-500 px-md py-sm border border-neutral-900 ${
        invalid ? "border-red-500" : "border-neutral-700"
      } focus:outline-none focus:ring-2 focus:ring-primary-200 ${className}`}
    />
  );
});

export default Input;

