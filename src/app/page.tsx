import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-25 font-sans dark:bg-neutral-950">
      <main className="flex min-h-screen w-full flex-col items-center justify-between py-10xl px-7xl bg-neutral-50 dark:bg-neutral-900 sm:items-start rounded-xl">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-3xl text-center sm:items-start sm:text-left">
          <h1 className=" text-6xl font-display font-semibold text-neutral-900 dark:text-neutral-50">
            To get started, edit the page.tsx file.
          </h1>
          <h2 className="text-4xl font-display font-semibold text-neutral-900 dark:text-neutral-50">
            Sociality
          </h2>
          <h3 className="text-3xl font-display font-semibold text-neutral-900 dark:text-neutral-50">
            Social Media App Developed by AryaFMDev
          </h3>
          <h4 className="text-2xl font-display font-semibold text-neutral-900 dark:text-neutral-50">
            A social media app that allows users to connect with each other.
          </h4>
          <h5 className="text-xl font-display font-semibold text-neutral-900 dark:text-neutral-50">
            Features
          </h5>
          <h6 className="text-lg font-display font-semibold text-neutral-900 dark:text-neutral-50">
            User Authentication
          </h6>
          <p className="text-md text-neutral-600 dark:text-neutral-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-primary-200 dark:text-primary-200"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-primary-200 dark:text-primary-200"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-xl text-md font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
