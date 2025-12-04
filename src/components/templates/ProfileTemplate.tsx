import { ReactNode } from "react";

export default function ProfileTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-black">
      <div className="mx-auto px-7xl py-7xl">{children}</div>
    </div>
  );
}

