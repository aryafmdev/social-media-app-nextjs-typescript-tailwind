import PostHeader from "../molecules/PostHeader";
import PostActions from "../molecules/PostActions";

export default function PostCard({ variant = "mobile" }: { variant?: "mobile" | "md" }) {
  const imgClass = variant === "md" ? "h-[420px]" : "h-[300px]";
  return (
    <article className="rounded-2xl bg-neutral-900 border border-neutral-800 p-3xl">
      <div className="mb-2xl">
        <PostHeader />
      </div>
      <div className={`w-full rounded-xl bg-neutral-800 ${imgClass}`} />
      <div className="mt-2xl">
        <PostActions />
      </div>
      <div className="mt-xl flex flex-col gap-xs">
        <span className="text-neutral-25 font-semibold">Username</span>
        <p className="text-neutral-300 text-md">
          Lorem ipsum dolor sit amet consectetur. Sit egestas ultricies a velit imperdiet amet morbi egestas fermentum...
        </p>
        <a className="text-primary-200 text-sm font-semibold" href="#">Show More</a>
      </div>
    </article>
  );
}

