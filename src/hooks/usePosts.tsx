import { useState, useEffect } from 'react';
import PostService from '../services/PostService';
import { Post } from '../types/post';

import UserService from '../services/UserService';
import FavouriteService from '../services/FavouriteService';
import { QueryOptions } from '../types/query';

export enum PostServiceType {
    DEFAULT = 'default',
    LIKED = 'liked',
    SAVED = 'saved',
    MY_POSTS = 'myPosts',
}

const PostServiceMap = {
    [PostServiceType.DEFAULT]: PostService.getPosts,
    [PostServiceType.LIKED]: UserService.getLikedPosts,
    [PostServiceType.SAVED]: FavouriteService.getFavouritePosts,
    [PostServiceType.MY_POSTS]: PostService.getMyPosts,
};

export { PostServiceMap };


export const usePosts = (service: PostServiceType, initialParams: QueryOptions, id: string) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<QueryOptions>(initialParams);

    const fetchPostsData = async () => {
        setLoading(true);
        setError(null);
        try {
            const requestParams = {
                page: params.page || 1,
                limit: params.limit || 12,
                sortField: params.sortField || 'likes_count',
                sortDirection: params.sortDirection || 'ASC',
                filters: params.filters || {},
                search: params.search || undefined,
            };

            const response = await PostServiceMap[service](id, requestParams);

            setPosts(response.items);
            setTotal(response.total);
        } catch (err) {
            setError('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPostsData();
    }, [params]);

    return {
        posts,
        total,
        loading,
        error,
        setParams,
        refetch: fetchPostsData,
    };
};
