import type { Post, User, Comment} from '../types/index.ts';
import { CreateCommentForm } from './CreateCommentForm.tsx';

//HU-12 y 14
interface PostCardProps {
  post: Post;
  author?: User;

  comments: Comment[];

  users: User[];

  canComment: boolean;

  onCreateComment: (
    postId: string,
    content: string
  ) => void;
}


export function PostCard({post,author,comments,users,canComment,onCreateComment}: PostCardProps) {
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

      <div className="mt-4 border-t pt-4">
        <h4 className="text-sm font-semibold text-secondary mb-2">
          Comentarios
        </h4>

        {comments.length === 0 ? (
          <p className="text-xs text-gray-400">
            No hay comentarios todavía.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {comments.map((comment) => {
              const commentAuthor = users.find(
                (user) => user.id === comment.authorId
              );

              return (
                <div
                  key={comment.id}
                  className="bg-gray-50 rounded-lg p-3"
                >
                  <div className="text-xs font-semibold text-secondary">
                    {commentAuthor?.name ?? 'Usuario desconocido'}
                  </div>

                  <div className="text-sm text-gray-600">
                    {comment.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {canComment && (
          <CreateCommentForm
            onSubmit={(content) =>
              onCreateComment(post.id, content)
            }
          />
        )}

      </div>
    
    </article>
  );
}