import { ReactNode } from "react";

export default function AuthTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary-300/30 to-transparent" />
      <div className="relative z-10 w-full flex items-center justify-center p-5xl">{children}</div>
    </div>
  );
}

