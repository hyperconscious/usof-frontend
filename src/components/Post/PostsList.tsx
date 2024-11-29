import React, { useEffect, useState } from 'react';
import { Post } from '../../types/post';
import PostCard from './PostCard';
import UserService from '../../services/UserService';
import { User } from '../../types/user';

interface PostsListProps {
  posts: Post[];
}

const PostsList: React.FC<PostsListProps> = ({ posts }) => {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);

  if (!Array.isArray(posts)) {
    return (
      <p className="mt-5 text-xl text-center text-gray-500">
        No posts available.
      </p>
    );
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await UserService.getMyProfile();
        setUser(response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Failed to fetch user profile', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      {loading ? (
        <p className="mt-5 text-xl text-center text-gray-500">
          Loading...
        </p>
      ) : posts.length === 0 ? (
        <p className="mt-5 text-xl text-center text-gray-500">
          No posts available.
        </p>
      ) : (
        posts
          .filter((post: Post | null) => post !== null)
          .map((post: Post) => <PostCard key={post.id} post={post} user={user} />)
      )}
    </div>
  );
};

export default PostsList;
