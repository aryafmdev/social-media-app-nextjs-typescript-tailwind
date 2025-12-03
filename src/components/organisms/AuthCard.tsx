'use client';
import { ReactNode } from "react";
import { cn } from "../../lib/utils";
import Image from "next/image";

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function AuthCard({ title, children, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-xl bg-neutral-900/20 backdrop-blur-5xl py-4xl border border-neutral-900",
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/images/logo-sociality.png"
            alt="Logo Sociality"
            width={30}
            height={30}
          />
        <h1 className="font-display font-bold text-display-xs text-neutral-25">Sociality</h1>
        </div>
        <p className="font-display font-bold text-xl md:text-display-xs text-neutral-200">{title}</p>
      </div>
      {children}
    </div>
  );
}
