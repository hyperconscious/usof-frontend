import React, { useState } from 'react';
import { Comment } from '../../types/comment';
import CommentManipulation from './CommentManipulation';
import { User } from '../../types/user';
import config from '../../config/env.config';
import { notifyError } from '../../utils/notification';
import CommentService from '../../services/CommentService';
import Pagination from '../shared/Pagination/Pagination';
import PostService from '../../services/PostService';

interface CommentCardProps {
    comment: Comment;
    user: User;
    isReply?: boolean;
    postId?: number;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, user, isReply = true, postId }) => {
    const [isHidden, setIsHidden] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(comment.content);
    const [childrenComments, setChildrenComments] = useState<Comment[]>([]);
    const [showChildren, setShowChildren] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [page, setPage] = useState(1);
    const [totalChildren, setTotalChildren] = useState(0);
    const [sortOption, setSortOption] = useState<'publish_date' | 'likes_count'>('likes_count');
    const repliesPerPage = 7;

    const hideComment = () => {
        setIsHidden(true);
    };

    const updateComment = (updatedContent: string) => {
        setContent(updatedContent);
    };

    const getContent = () => {
        return content;
    }

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value as 'publish_date' | 'likes_count');
        handleGetChildren(page, false);
    };

    if (isHidden) {
        return null;
    }

    const handleGetChildren = async (newPage: number, change?: boolean) => {
        if (change) {
            setIsReplying(!isReplying);
            setShowChildren(!showChildren);
        }
        setPage(newPage);
        try {
            const response = await CommentService.getChildrenComments(comment.id,
                {
                    page: newPage,
                    limit: repliesPerPage,
                    sortField: sortOption,
                    sortDirection: 'DESC',
                }
            );
            setChildrenComments(response.items);
            setTotalChildren(response.total);
        }
        catch (error) {
            notifyError('Failed to get children comments');
        }
    }

    const handleReply = async () => {
        if (!replyContent.trim()) return;
        try {
            const response = await PostService.createComment(postId!, { content: replyContent, parentCommentId: comment.id });
            setChildrenComments([response, ...childrenComments]);
            setReplyContent('');
            setTotalChildren(totalChildren + 1);
        } catch (error) {
            user?.verified ? notifyError('You cannot comment non active post.') :
                notifyError('You need to log in to add a comment.');
            console.error('Failed to add comment:', error);
        }
    };

    return (
        isHidden ? null :
            <div className="flex items-start space-x-4 p-4 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <div className="flex-shrink-0">
                    <img
                        src={comment.author?.avatar ? `${config.BACKEND_URL}${comment.author.avatar}` : '/avatars/default_avatar.png'}
                        alt={`${comment.author?.full_name}'s avatar`}
                        className="w-16 h-16 rounded-full object-cover border border-gray-300"
                    />
                </div>

                <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <div className='flex flex-grow justify-between'>
                            <h4 className="text-lg font-semibold text-gray-800">{comment.author?.full_name}</h4>
                            <p className="text-sm text-gray-500">
                                {new Date(comment.publishDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    {isEditing ? (
                        <div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-2 mt-2 border border-gray-300 rounded"
                            />
                        </div>
                    ) : (
                        <div>
                            <p className="mt-2 text-gray-700">{getContent()}</p>
                        </div>
                    )}

                    <CommentManipulation
                        comment={comment}
                        user={user}
                        isEditing={isEditing}
                        page={isReply ? page : -1}
                        getContent={getContent}
                        hideComment={hideComment}
                        updateComment={updateComment}
                        setIsEditing={setIsEditing}
                        handleGetChildren={handleGetChildren}
                    />
                    {isReply && <>
                        {isReplying && (<div className="mt-4">
                            <textarea
                                className="w-full border p-2 rounded"
                                rows={2}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write your reply..."
                            ></textarea>
                            <div className="mt-2 text-right">
                                <button onClick={handleReply} className="px-4 py-2 bg-blue-600 text-white rounded">
                                    Submit
                                </button>
                            </div>
                            <select
                                value={sortOption}
                                onChange={handleSortChange}
                                className="border rounded px-2 py-1"
                            >
                                <option value="publish_date">Popular</option>
                                <option value="likes_count">Newest</option>
                            </select>
                        </div>
                        )}
                        {childrenComments && showChildren && (
                            <div className="mt-4 pl-4 border-l">
                                {childrenComments.map((child) => (
                                    <CommentCard key={child.id} comment={child} user={user} isReply={false} />
                                ))}
                                <Pagination
                                    page={page}
                                    total={totalChildren}
                                    itemsPerPage={repliesPerPage}
                                    onPageChange={(newPage) => {
                                        setPage(newPage);
                                        handleGetChildren(newPage, false);
                                    }}
                                />
                            </div>
                        )}
                    </>}
                </div>

            </div>
    );
};

export default CommentCard;
