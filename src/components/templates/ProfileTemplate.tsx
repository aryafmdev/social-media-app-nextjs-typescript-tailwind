import { ReactNode } from "react";

export default function ProfileTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-black">
      <div className="w-full max-w-[600px] mx-auto px-4 py-2xl">{children}</div>
    </div>
  );
}
