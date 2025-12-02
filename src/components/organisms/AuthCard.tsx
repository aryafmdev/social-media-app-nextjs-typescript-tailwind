'use client';
import { ReactNode } from "react";
import { cn } from "../../lib/utils"; // util tailwind-merge + clsx

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function AuthCard({ title, children, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-xl bg-neutral-900/80 backdrop-blur py-4xl border border-neutral-800",
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        
        <h1 className="font-display text-display-md text-neutral-25">Sociality</h1>
        <p className="font-display text-lg text-neutral-200">{title}</p>
      </div>
      {children}
    </div>
  );
}
