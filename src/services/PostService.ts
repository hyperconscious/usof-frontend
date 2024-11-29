import axios from '../api/axios';
import { PaginatedResponse, QueryOptions } from '../types/query';
import { Post } from '../types/post';
import { Comment } from '../types/comment';
import { CreatePostData, UpdateCommentData } from '../validation/schemas';

class PostService {
  static async getPosts(id: string, query: QueryOptions): Promise<PaginatedResponse<Post>> {
    const response = await axios.get('/api/posts', { params: query });
    id && id;
    return response.data;
  }

  static async getMyPosts(
    id: string,
    query: QueryOptions,
  ): Promise<PaginatedResponse<Post>> {
    const response = await axios.get('/api/posts/my-posts', { params: query });
    id && id;
    return response.data;
  }

  static async getPost(postId: number): Promise<Post> {
    const response = await axios.get(`/api/posts/${postId}`);
    return response.data.data;
  }

  static async getComments(
    postId: number,
    query: QueryOptions,
  ): Promise<PaginatedResponse<Comment>> {
    const response = await axios.get(`/api/posts/${postId}/comments`, {
      params: query,
    });
    return response.data;
  }

  static async createComment(postId: number, data: UpdateCommentData): Promise<Comment> {
    const response = await axios.post(`/api/posts/${postId}/comments`, data);
    return response.data.data;
  }


  static async getCategories(postId: number): Promise<string[]> {
    const response = await axios.get(`/api/posts/${postId}/categories`);
    return response.data;
  }

  static async addCategory(
    postId: number,
    category: string,
  ): Promise<string[]> {
    const response = await axios.patch(`/api/posts/${postId}`, { category });
    return response.data;
  }

  static async deleteCategory(postId: number, category: string): Promise<void> {
    const response = await axios.patch(`/api/posts/${postId}`, { category });
    return response.data;
  }

  static async getLikes(
    postId: number,
  ): Promise<PaginatedResponse<{ userId: number }>> {
    const response = await axios.get(`/api/posts/${postId}/likes`);
    return response.data;
  }

  static async addLike(postId: number): Promise<void> {
    const response = await axios.post(`/api/posts/${postId}/like`);
    return response.data;
  }

  static async removeLike(postId: number): Promise<void> {
    const response = await axios.delete(`/api/posts/${postId}/like`);
    return response.data;
  }

  static async removeDislike(postId: number): Promise<void> {
    const response = await axios.delete(`/api/posts/${postId}/dislike`);
    return response.data;
  }

  static async getUserReaction(postId: number): Promise<any> {
    const response = await axios.get(`/api/posts/${postId}/user-reaction`);
    return response;
  }

  static async getDislikes(
    postId: number,
  ): Promise<PaginatedResponse<{ userId: number }>> {
    const response = await axios.get(`/api/posts/${postId}/dislikes`);
    return response.data;
  }

  static async createPost(data: CreatePostData): Promise<Post> {
    const payload = {
      ...data,
    };
    const response = await axios.post('/api/posts', payload);
    return response.data.data;
  }

  static async updatePost(postId: number, data: Partial<CreatePostData>) {
    const response = await axios.patch(`/api/posts/${postId}`, data);
    return response.data;
  }

  static async deletePost(postId: number): Promise<void> {
    const response = await axios.delete(`/api/posts/${postId}`);
    return response.data;
  }
}

export default PostService;
