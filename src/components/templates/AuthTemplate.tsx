import { ReactNode } from "react";
import Image from "next/image";

export default function AuthTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black overflow-hidden relative">
      <div className="absolute inset-x-0 bottom-0 z-0 flex justify-center">
        <Image
          src="/assets/images/gradient-image.png"
          alt="Gradient Background"
          width={2440}
          height={1020}
          className="w-[clamp(393px,100vw,2440px)] h-[clamp(223px,81.8vw-98.5px,1080px)]"
          priority
        />
      </div>

      {/* Konten utama */}
      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
