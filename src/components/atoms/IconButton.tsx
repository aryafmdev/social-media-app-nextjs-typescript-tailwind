import { ButtonHTMLAttributes } from "react";

export default function IconButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`size-6 flex items-center justify-center text-neutral-300 hover:text-neutral-25 ${className}`}
    />
  );
}

