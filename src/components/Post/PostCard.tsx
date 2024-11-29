import { Post } from '../../types/post';
import { User } from '../../types/user';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaTag } from 'react-icons/fa'; // Импорт иконок для автора и категорий
import PostManipulation from './PostManipulation';
import { useState } from 'react';

interface PostCardProps {
  post: Post;
  user: User;
}

const PostCard: React.FC<PostCardProps> = ({ post, user }) => {
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(false);

  const handleNavigate = () => {
    navigate(`/posts/${post.id}`);
  };

  const hidePost = () => {
    setIsHidden(true);
  };

  return (
    isHidden ? null :
      <div className="mt-4 p-6 border rounded-md shadow-lg bg-white">
        <div className="flex items-center justify-between mb-2">
          <h2
            onClick={handleNavigate}
            className="text-2xl font-semibold truncate max-w-[70%] cursor-pointer text-blue-800 hover:text-blue-950"
          >
            {post.title}
          </h2>
          <span className="text-sm text-gray-500">
            {new Date(post.publishDate).toLocaleDateString()}
          </span>
        </div>

        <p className="text-gray-700 line-clamp-3 mb-4">{post.content}</p>

        <div
          onClick={() => navigate(`/users/${post.author.id}`)}
          className="flex items-center space-x-2 cursor-pointer text-sm text-gray-600 hover:text-blue-950"
        >
          <FaUserAlt size={16} />
          <span>
            <strong>Author:</strong> {post.author?.full_name} (@{post.author?.login})
          </span>
        </div>

        <div className="mt-2 text-sm text-gray-600">
          {post.categories?.length ? (
            <div className="flex gap-2 mt-1 flex-wrap">
              {post.categories.map((cat) => (
                <span
                  onClick={() => { navigate(`?categories=${cat.title}`); navigate(0) }}
                  key={cat.title}
                  className="bg-indigo-100 text-indigo-600 hover:text-indigo-700 text-xs font-semibold py-1 px-2 rounded-full cursor-pointer mt-2"
                >
                  <FaTag className="inline mr-1" size={12} />
                  {cat.title}
                </span>
              ))}
            </div>
          ) : (<p></p>)
          }
        </div>

        <PostManipulation post={post} user={user} hidePost={hidePost} />
      </div>
  );
};

export default PostCard;
