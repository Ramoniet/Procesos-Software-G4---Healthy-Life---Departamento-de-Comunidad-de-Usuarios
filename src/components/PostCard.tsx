import type { Post, User } from '../types/index.ts';
//HU-12
interface PostCardProps {
  post: Post;
  author?: User;
}

export function PostCard({ post, author }: PostCardProps) {
  return (
    <article className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-secondary">
          {author?.name ?? 'Usuario desconocido'}
        </span>

        <span className="text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleDateString('es-ES')}
        </span>
      </div>

      <h3 className="text-lg font-bold text-secondary mb-2">
        {post.title}
      </h3>

      <p className="text-sm text-gray-600">
        {post.content}
      </p>

    </article>
  );
}