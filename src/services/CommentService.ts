import axios from '../api/axios';
import { Comment } from '../types/comment';
import { PaginatedResponse, QueryOptions } from '../types/query';
import { UpdateCommentData } from '../validation/schemas';

class CommentService {
    static async getCommentById(commentId: number): Promise<Comment> {
        const response = await axios.get(`/api/comments/${commentId}`);
        return response.data;
    }

    static async updateComment(commentId: number, data: UpdateCommentData): Promise<Comment> {
        const response = await axios.patch(`/api/comments/${commentId}`, data);
        return response.data;
    }

    static async getChildrenComments(commentId: number, options: QueryOptions,): Promise<PaginatedResponse<Comment>> {
        const response = await axios.get(`/api/comments/${commentId}/children`, { params: options });
        return response.data;
    }

    static async deleteComment(commentId: number): Promise<void> {
        const response = await axios.delete(`/api/comments/${commentId}`);
        return response.data;
    }

    static async getUserReaction(commentId: number): Promise<any> {
        const response = await axios.get(`/api/comments/${commentId}/user-reaction`);
        return response;
    }
}

export default CommentService;
