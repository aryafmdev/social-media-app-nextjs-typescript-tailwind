import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export default function Button({ loading, className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`rounded-full bg-primary-200 text-neutral-25 px-lg py-sm font-semibold disabled:opacity-60 ${className}`}
    >
      {loading ? "Loading..." : props.children}
    </button>
  );
}

