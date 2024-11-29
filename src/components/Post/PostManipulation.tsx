import React, { useEffect, useState } from 'react';
import { User } from '../../types/user';
import { Post, PostStatus } from '../../types/post';
import PostService from '../../services/PostService';
import { notifyError, notifySuccess } from '../../utils/notification';
import LikeService from '../../services/LikeService';
import { FaComments, FaEdit, FaRegThumbsDown, FaRegThumbsUp, FaTrash } from 'react-icons/fa';
import CommentService from '../../services/CommentService';
import AddEditPostModal from './AddEditPostModal';
import { MdCommentsDisabled } from 'react-icons/md';
import FavouriteService from '../../services/FavouriteService';
import { CiBookmark, CiBookmarkCheck } from 'react-icons/ci';

interface PostManipulationProps {
    user: User;
    post: Post;
    hidePost: () => void;
}

const PostManipulation: React.FC<PostManipulationProps> = ({ post, user, hidePost }) => {
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const [dislikesCount, setDislikesCount] = useState(post.dislikesCount);
    const [userReaction, setUserReaction] = useState<string>('');
    const [userBookmark, setUserBookmark] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalToggle = () => {
        if (!user) {
            notifyError('You need to be logged in to add a post');
            return;
        }
        setIsModalOpen(!isModalOpen);
    };

    const fetchUserReaction = async () => {
        try {
            const response = await PostService.getUserReaction(post.id);
            setUserReaction(response.data.reaction?.type);
        } catch (error) {
            console.error('Failed to fetch user reaction:', error);
        }
    };

    const fetchUserBookmark = async () => {
        try {
            const response = await FavouriteService.isFavourite(post.id);
            setUserBookmark(response === null ? false : true);
        } catch (error) {
            console.error('Failed to fetch user reaction:', error);
        }
    }

    useEffect(() => {
        if (user.id) {
            fetchUserReaction();
            fetchUserBookmark();
        }
    }, [user.id]);

    const handleLike = async (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!user.id) {
            notifyError('You need to login to like the post');
            return;
        }
        try {
            if (userReaction === 'like') {
                await LikeService.unlikePost(post.id);
                setLikesCount(likesCount - 1);
                setUserReaction('');
            } else {
                if (userReaction === 'dislike') {
                    await LikeService.undislikePost(post.id);
                    setDislikesCount(dislikesCount - 1);
                }
                await LikeService.reactPost(post.id, 'like');
                setLikesCount(likesCount + 1);
                setUserReaction('like');
            }
        } catch (error) {
            notifyError('You cannot like/dislike non active post.');
        }
    };

    const handleDislike = async (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!user.id) {
            notifyError('You need to login to dislike the post');
            return;
        }
        try {
            if (userReaction === 'dislike') {
                await LikeService.undislikePost(post.id);
                setDislikesCount(dislikesCount - 1);
                setUserReaction('');
            } else {
                if (userReaction === 'like') {
                    await LikeService.unlikePost(post.id);
                    setLikesCount(likesCount - 1);
                }
                await LikeService.reactPost(post.id, 'dislike');
                setDislikesCount(dislikesCount + 1);
                setUserReaction('dislike');
            }
        } catch (error) {
            notifyError('Failed to update dislike status');
        }
    };

    const handleDelete = async (event: React.MouseEvent) => {
        event.stopPropagation();
        if (window.confirm('Are you sure you want to delete this post? All comments will be deleted as well.')) {
            try {
                const comments = await PostService.getComments(post.id, { page: 1, limit: 0 });
                for (const comment of comments.items) {
                    const childComments = await CommentService.getChildrenComments(comment.id, { page: 1, limit: 0 });
                    for (const childComment of childComments.items) {
                        await CommentService.deleteComment(childComment.id);
                    }
                    await CommentService.deleteComment(comment.id);
                };

                await PostService.deletePost(post.id);
                notifySuccess('Post deleted successfully');
                hidePost();
            } catch (error) {
                notifyError('Failed to delete post');
            }
        }
    };

    const handleAddBookmark = async () => {
        try {
            if (userBookmark) {
                await FavouriteService.removeFromFavourites(post.id);
                setUserBookmark(false);
                notifySuccess('Post removed from favourites');
                return;
            }
            await FavouriteService.addToFavourites(post.id);
            setUserBookmark(true);
            notifySuccess('Post added to favourites');
        } catch (error) {
            notifyError('Failed to add post to favourites');
        }
    }

    const hadleEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        handleModalToggle();
    }

    return (
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4 text-gray-600">
                <button onClick={handleLike} className={`flex items-center space-x-1 ${userReaction === 'like' ? 'text-green-700' : ''} hover:text-green-800 transition-colors`}>
                    <FaRegThumbsUp size={22} />
                    <span>{likesCount}</span>
                </button>
                <button onClick={handleDislike} className={`flex items-center space-x-1 ${userReaction === 'dislike' ? 'text-red-700' : ''} hover:text-red-800 transition-colors`}>
                    <FaRegThumbsDown size={22} />
                    <span>{dislikesCount}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-indigo-700 transition-colors">
                    {post.status === PostStatus.ACTIVE ?
                        <>
                            <FaComments size={22} />
                            <span>{post.commentsCount}</span>
                        </>
                        : <MdCommentsDisabled size={22} />}
                </button>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={handleAddBookmark} className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                    {userBookmark ? <CiBookmarkCheck size={24} className="font-bold" /> : <CiBookmark size={24} className="font-bold" />}
                </button>
                {(user.role === 'admin' || post.author?.id === user.id) &&
                    <div className="flex items-center space-x-4">
                        <button onClick={hadleEdit} className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-800">
                            <FaEdit size={22} />
                        </button>
                        {isModalOpen && <AddEditPostModal onClose={handleModalToggle} post={post} />}
                        <button onClick={handleDelete} className="flex items-center space-x-1 text-gray-600 hover:text-red-800">
                            <FaTrash size={22} />
                        </button>
                        <span className="block mt-2 text-sm text-gray-600">Status: {post.status}</span>
                    </div>
                }
            </div>
        </div>
    );
};

export default PostManipulation;