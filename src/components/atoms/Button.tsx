import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export default function Button({ loading, className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`rounded-full bg-primary-300 text-neutral-25 px-lg py-sm text-md font-bold disabled:opacity-60 ${className}`}
    >
      {loading ? "Loading..." : props.children}
    </button>
  );
}

