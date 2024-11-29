import axios from '../api/axios';
import { PaginatedResponse, QueryOptions } from '../types/query';
import { Post } from '../types/post';

class FavouriteService {
  static async getFavouritePosts(id: string, query: QueryOptions): Promise<PaginatedResponse<Post>> {
    const response = await axios.get('/api/favourites', { params: query });
    id && id;
    return response.data;
  }

  static async addToFavourites(postId: number) {
    const response = await axios.post('/api/favourites', { postId });
    return response.data;
  }

  static async removeFromFavourites(postId: number) {
    const response = await axios.delete(`/api/favourites/${postId}`);
    return response.data;
  }

  static async isFavourite(postId: number) {
    const response = await axios.get(`/api/favourites/${postId}`);
    return response.data;
  }
}

export default FavouriteService;
