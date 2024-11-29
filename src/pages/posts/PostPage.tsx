import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostService from '../../services/PostService';
import { Post, PostStatus } from '../../types/post';
import { Comment as CommentType } from '../../types/comment';
import CommentCard from '../../components/Comment/CommentCard';
import PostManipulation from '../../components/Post/PostManipulation';
import UserService from '../../services/UserService';
import { User } from '../../types/user';
import { FaTag, FaUserAlt } from 'react-icons/fa';
import { notifyError } from '../../utils/notification';
import Pagination from '../../components/shared/Pagination/Pagination';

const PostPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [isHidden, setIsHidden] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const [sortOption, setSortOption] = useState<'publish_date' | 'likes_count'>('likes_count');
    const navigate = useNavigate();

    const hidePost = () => {
        setIsHidden(true);
    };

    const commentsPerPage = 10;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await PostService.getPost(Number(id));
                setPost(response);
            } catch (error) {
                console.error('Failed to fetch post:', error);
            }
        };

        const fetchUser = async () => {
            try {
                const response = await UserService.getMyProfile();
                setUser(response);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await PostService.getComments(Number(id), {
                    page,
                    limit: commentsPerPage,
                    sortField: sortOption,
                    sortDirection: 'DESC',
                });
                setComments(response.items);
                setTotalComments(response.total);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };

        fetchUser();
        fetchPost();
        fetchComments();
    }, [id, page, sortOption]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const response = await PostService.createComment(Number(id), { content: newComment, });
            setComments([response, ...comments]);
            setNewComment('');
            setIsFormVisible(false);
            setTotalComments(totalComments + 1);
        } catch (error) {
            user?.verified ? notifyError('You cannot comment non active post.') :
                notifyError('You need to log in to add a comment.');
            console.error('Failed to add comment:', error);
        }
        finally {
            setIsFormVisible(false);
        }
    };

    const toggleForm = () => {
        setIsFormVisible(!isFormVisible);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value as 'publish_date' | 'likes_count');
    };

    return (
        <div className="container mx-auto p-4 space-y-8">
            {post && !isHidden ? (
                <>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-between mb-7">
                            <h2 className="text-2xl font-bold">{post.title}</h2>
                            <p className="text-sm text-gray-500">{new Date(post.publishDate).toLocaleDateString()}</p>
                        </div>
                        <p>{post.content}</p>
                        <div
                            onClick={() => navigate(`/users/${post.author.id}`)}
                            className="flex items-center space-x-2 cursor-pointer text-sm text-gray-600 hover:text-blue-950 mt-3"
                        >
                            <FaUserAlt size={16} />
                            <span>
                                <strong>Author:</strong> {post.author?.full_name} (@{post.author?.login})
                            </span>
                        </div>

                        <div className="mt-2 text-sm text-gray-600">
                            {post.categories?.length ? (
                                <div className="flex gap-2 mt-1">
                                    {post.categories.map((cat) => (
                                        <span
                                            key={cat.title}
                                            className="bg-indigo-100 text-indigo-600 hover:text-indigo-700 text-xs font-semibold py-1 px-2 rounded-full cursor-pointer mt-2"
                                        >
                                            <FaTag className="inline mr-1" size={12} />
                                            {cat.title}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p></p>
                            )}
                        </div>
                        {user && <PostManipulation post={post} user={user} hidePost={hidePost} />}
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        {(post.status === PostStatus.ACTIVE || post.author.id === user?.id) || user?.role === 'admin' ?
                            <>
                                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                                <div className="mb-4 flex justify-between items-center">
                                    <button
                                        onClick={toggleForm}
                                        className="px-4 py-2 bg-gray-700 text-white rounded"
                                    >
                                        {isFormVisible ? 'Cancel' : 'Add a Comment'}
                                    </button>
                                    <select
                                        value={sortOption}
                                        onChange={handleSortChange}
                                        className="border rounded px-2 py-1"
                                    >
                                        <option value="publish_date">Newest</option>
                                        <option value="likes_count">Popular</option>
                                    </select>
                                </div>
                                {isFormVisible && (
                                    <div className="mb-6">
                                        <textarea
                                            className="w-full border p-2 rounded"
                                            rows={4}
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Write your comment..."
                                        ></textarea>
                                        <div className="mt-4 text-right">
                                            <button
                                                onClick={handleAddComment}
                                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-4">
                                    {comments.map((comment) => (
                                        <CommentCard key={comment.id} comment={comment} user={user!} postId={post.id} />
                                    ))}
                                </div>
                                <Pagination
                                    page={page}
                                    total={totalComments}
                                    itemsPerPage={commentsPerPage}
                                    onPageChange={(newPage: React.SetStateAction<number>) => setPage(newPage)}
                                />
                            </> :
                            <p className="text-center mt-4 text-gray-500">Comments are disabled.</p>
                        }
                    </div>
                </>
            ) : (
                <div className="text-center mt-8">
                    <h3 className="text-2xl font-semibold">Post was removed or unawaible.</h3>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                    >
                        Go Home
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostPage;
