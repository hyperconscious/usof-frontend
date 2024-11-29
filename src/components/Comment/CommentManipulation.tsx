import React, { useEffect, useState } from 'react';
import { User } from '../../types/user';
import { notifyError, notifySuccess } from '../../utils/notification';
import LikeService from '../../services/LikeService';
import { Comment } from '../../types/comment';
import { FaEdit, FaRegThumbsDown, FaRegThumbsUp, FaReply, FaSave, FaTrash, } from 'react-icons/fa';
import CommentService from '../../services/CommentService';

interface CommentManipulationProps {
    comment: Comment;
    user: User;
    isEditing: boolean;
    page: number;
    getContent: () => string;
    hideComment: () => void;
    updateComment: (updatedContent: string) => void;
    setIsEditing: (isEditing: boolean) => void;
    handleGetChildren: (newPage: number, change?: boolean) => void;
}

const CommentManipulation: React.FC<CommentManipulationProps> = ({ comment, user, page, isEditing, getContent, hideComment, updateComment, setIsEditing, handleGetChildren }) => {
    const [likesCount, setLikesCount] = useState(comment.likesCount);
    const [dislikesCount, setDislikesCount] = useState(comment.dislikesCount);
    const [userReaction, setUserReaction] = useState<string>('');

    const fetchUserReaction = async () => {
        try {
            const response = await CommentService.getUserReaction(comment.id);
            setUserReaction(response.data.reaction?.type);
        } catch (error) {
            console.error('Failed to fetch user reaction:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserReaction();
        }
    }, [user]);

    const handleLike = async () => {
        if (!user) {
            notifyError('You need to login to like the comment');
            return;
        }
        try {
            if (userReaction === 'like') {
                await LikeService.unlikeComment(comment.id);
                setLikesCount(likesCount - 1);
                setUserReaction('');
            } else {
                if (userReaction === 'dislike') {
                    await LikeService.undislikeComment(comment.id);
                    setDislikesCount(dislikesCount - 1);
                }
                await LikeService.reactComment(comment.id, 'like');
                setLikesCount(likesCount + 1);
                setUserReaction('like');
            }
        } catch (error) {
            notifyError('Failed to update like status');
        }
    };

    const handleDislike = async () => {
        if (!user) {
            notifyError('You need to login to dislike the comment');
            return;
        }
        try {
            if (userReaction === 'dislike') {
                await LikeService.undislikeComment(comment.id);
                setDislikesCount(dislikesCount - 1);
                setUserReaction('');
            } else {
                if (userReaction === 'like') {
                    await LikeService.unlikeComment(comment.id);
                    setLikesCount(likesCount - 1);
                }
                await LikeService.reactComment(comment.id, 'dislike');
                setDislikesCount(dislikesCount + 1);
                setUserReaction('dislike');
            }
        } catch (error) {
            notifyError('Failed to update dislike status');
        }
    };

    const handleSaveEdit = async () => {
        if (isEditing) {
            try {
                await CommentService.updateComment(comment.id, { content: getContent() });
                updateComment(getContent());
                setIsEditing(false);
                notifySuccess('Comment updated successfully');
            } catch (error) {
                notifyError('Failed to update comment');
            } finally {
                setIsEditing(false);
            }
        } else {
            setIsEditing(true);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post? All comments will be deleted as well.')) {
            try {
                await CommentService.deleteComment(comment.id);
                notifySuccess('Comment deleted successfully');
                hideComment();
            } catch (error) {
                notifyError('Failed to delete comment');
            }
        }
    }

    return (
        <div className="mt-4 flex items-center justify-between text-gray-600">
            <div className='flex space-x-4 '>
                <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 ${userReaction === 'like' ? 'text-green-700' : ''} hover:text-green-800 transition-colors`}
                >
                    <FaRegThumbsUp size={22} />
                    <span>{likesCount}</span>
                </button>
                <button
                    onClick={handleDislike}
                    className={`flex items-center space-x-1 ${userReaction === 'dislike' ? 'text-red-700' : ''} hover:text-red-800 transition-colors`}
                >
                    <FaRegThumbsDown size={22} />
                    <span>{dislikesCount}</span>
                </button>
                {page !== -1 &&
                    <button
                        onClick={() => handleGetChildren(page, true)}
                        className="text-indigo-600 hover:text-indigo-700 transition-colors">
                        <FaReply size={22} />
                    </button>
                }
            </div>
            {(user?.role === 'admin' || comment?.author?.id === user?.id) &&
                <div className="flex items-center space-x-4">
                    <button onClick={handleSaveEdit} className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-800">
                        {isEditing ? < FaSave size={22} /> : <FaEdit size={22} />}
                    </button>
                    <button onClick={handleDelete} className="flex items-center space-x-1 text-gray-600 hover:text-red-800">
                        <FaTrash size={22} />
                    </button>
                    {/* <span className="block mt-2 text-sm text-gray-600">Status: {comment.status}</span> */}
                </div>
            }
        </div>
    );
};

export default CommentManipulation;



