import { ReactNode } from "react";

export default function ProfileTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-black">
      <div className="mx-auto px-2xl py-2xl">{children}</div>
    </div>
  );
}

