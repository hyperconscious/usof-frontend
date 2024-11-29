import axios from '../api/axios';

class LikeService {
  static async reactPost(postId: number, type: 'like' | 'dislike'): Promise<any> {
    const response = await axios.post(`/api/posts/${postId}/like`, { type });
    return response.data;
  }

  static async unlikePost(postId: number,): Promise<void> {
    const response = await axios.delete(`/api/posts/${postId}/like`);
    return response.data;
  }

  static async undislikePost(postId: number,): Promise<void> {
    const response = await axios.delete(`/api/posts/${postId}/dislike`);
    return response.data;
  }

  static async reactComment(commentId: number, type: 'like' | 'dislike') {
    const response = await axios.post(`/api/comments/${commentId}/like`, { type });
    return response.data;
  }

  static async unlikeComment(commentId: number) {
    const response = await axios.delete(`/api/comments/${commentId}/like`);
    return response.data;
  }

  static async undislikeComment(commentId: number): Promise<void> {
    const response = await axios.delete(`/api/comments/${commentId}/dislike`);
    return response.data;
  }
}

export default LikeService;
