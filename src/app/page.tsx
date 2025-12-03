

import HeaderSmart from "../components/organisms/HeaderSmart";
import MenuBar from "../components/molecules/MenuBar";
import PostCard from "../components/organisms/PostCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <HeaderSmart />
      <section className="mx-auto px-7xl py-7xl flex flex-col gap-4xl">
        <PostCard variant="mobile" />
        <div className="hidden md:block">
          <PostCard variant="md" />
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-10 flex justify-center">
        <MenuBar />
      </div>
    </main>
  );
}
