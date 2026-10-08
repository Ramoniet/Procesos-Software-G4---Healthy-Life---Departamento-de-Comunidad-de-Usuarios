import type { Post, User } from '../types/index.ts';
import { PostCard } from './PostCard.tsx';
//HU-12
interface PostListProps {
  posts: Post[];
  users: User[];
}

export function PostList({ posts, users }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
        <span className="text-4xl">📝</span>

        <p className="text-gray-400 mt-3">
          Aún no hay publicaciones en esta comunidad.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          author={users.find((user) => user.id === post.authorId)}
        />
      ))}
    </div>
  );
}