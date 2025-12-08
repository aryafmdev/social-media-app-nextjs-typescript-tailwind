import PostHeader from '../molecules/PostHeader';
import PostActions from '../molecules/PostActions';
import type { Post } from '../../lib/api/posts';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function PostCard({
  variant = 'mobile',
  post,
}: {
  variant?: 'mobile' | 'md';
  post: Post;
}) {
  const router = useRouter();
  const imgClass =
    variant === 'md'
      ? 'w-[clamp(361px,calc(361px + (239 * (100vw - 393px) / 1047)),600px)] h-[clamp(361px,calc(361px + (239 * (100vw - 393px) / 1047)),600px)]'
      : 'size-[361px]';
  const isDetail = variant === 'md';

  const [expanded, setExpanded] = useState(false);
  const authorDisplayName =
    (post.author?.name && post.author?.name.trim()) ||
    (post.author?.username && post.author?.username.trim()) ||
    'Username';
  return (
    <article className='border-b border-neutral-900 pb-2xl'>
      <div className='mb-2xl'>
        <PostHeader
          name={post.author?.name}
          username={post.author?.username}
          avatarUrl={post.author?.avatarUrl}
          createdAt={post.createdAt}
        />
      </div>
      {post.imageUrl ? (
        <Image
          src={post.imageUrl}
          alt='post'
          width={600}
          height={600}
          className={`rounded-xl object-cover ${imgClass} ${isDetail ? '' : 'cursor-pointer'}`}
          style={{ width: '100%', height: 'auto' }}
          sizes='(min-width: 768px) 600px, 100vw'
          onClick={isDetail ? undefined : () => router.push(`/posts/${post.id}`)}
        />
      ) : (
        <div
          className={`w-full rounded-xl bg-neutral-800 ${imgClass} ${isDetail ? '' : 'cursor-pointer'}`}
          onClick={isDetail ? undefined : () => router.push(`/posts/${post.id}`)}
        />
      )}
      <div className='mt-2xl'>
        <PostActions
          postId={post.id}
          liked={post.liked}
          saved={post.saved}
          likesCount={post.likesCount ?? 0}
          commentsCount={post.commentsCount ?? 0}
        />
      </div>
      <div className='mt-xl flex flex-col gap-xs'>
        <span className='text-neutral-25 font-semibold'>
          {authorDisplayName}
        </span>
        <p
          className='text-neutral-300 text-md'
          style={
            expanded
              ? undefined
              : {
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }
          }
        >
          {post.caption ?? ''}
        </p>
        {!expanded && (
          <button
            className='text-primary-200 text-sm font-semibold w-fit cursor-pointer'
            onClick={() => setExpanded(true)}
          >
            Show More
          </button>
        )}
      </div>
    </article>
  );
}
